const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');
// Load environment variables with sane precedence:
// 1) Root .env (real creds typically live here)
// 2) server/.env (optional per-service overrides; will NOT override existing vars)
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });


const stripeRoutes = require('./stripeRoutes');
const stripePayRoutes = require('./stripePayRoutes');
const app = express();
// Use a Node-specific port var to avoid clashing with Flask's PORT from root .env
const port = Number(process.env.SERVER_PORT || process.env.NODE_PORT || 3001);

// Behind Nginx, trust the first proxy for X-Forwarded-* headers
app.set('trust proxy', 1);


// CORS: default open in dev, locked down in production via ALLOWED_ORIGINS env
const rawOrigins = (process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const devOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5050',
  'http://127.0.0.1:5050',
];
const isProd = (process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production' || process.env.ENV === 'production');
const allowedOrigins = rawOrigins.length ? rawOrigins : (isProd ? [] : devOrigins);
const corsCfg = {
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g., same-origin or curl/postman)
    if (!origin) return cb(null, true);
    if (allowedOrigins.length === 0) return cb(null, false); // no cross-origin in prod unless explicitly allowed
    const ok = allowedOrigins.includes(origin);
    return cb(null, ok);
  },
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','X-API-SECRET'],
};
app.use(cors(corsCfg));
app.options('*', cors(corsCfg));
// Harden JSON parser: avoid noisy logs if a non-JSON request slips through
app.use((req, res, next) => {
  const ct = (req.headers['content-type'] || '').toLowerCase();
  if (ct.includes('application/json')) return bodyParser.json()(req, res, next);
  return next();
});
app.use('/api/stripe', stripeRoutes);
app.use('/api/stripe', stripePayRoutes);
// Serve uploaded files (optional)
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));
// Serve React static assets. Prefer freshly built assets in /build, else fall back to /public.
const uiDir = fs.existsSync(path.join(__dirname, '..', 'build')) ? 'build' : 'public';
app.use(express.static(path.join(__dirname, '..', uiDir)));

// React Router (SPA) fallback so deep links work and live code changes (after rebuild) are picked up
app.get([ '/app', '/app/*', '/dashboard', '/dashboard/*' ], (req, res, next) => {
  const indexPath = path.join(__dirname, '..', uiDir, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  return next();
});

// Proxy to the Flask service using http-proxy-middleware for proper streaming/header handling.
// Requests to /api/flask/<path> will be forwarded to the Flask server configured by FLASK_URL.
// Example: GET /api/flask/api/hello -> ${FLASK_URL}/api/hello
// Default to Flask dev at 5050; can be overridden by FLASK_URL env var
const FLASK_URL = process.env.FLASK_URL || 'http://127.0.0.1:5050';
app.use('/api/flask', createProxyMiddleware({
  target: FLASK_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/flask': '' },
  onProxyReq(proxyReq, req, res) {
    // If request body was parsed by express (JSON or urlencoded), re-attach it.
    // For multipart/form-data (file uploads) we must NOT consume or reattach body here — allow streaming passthrough.
    try {
      const contentType = (req.headers['content-type'] || '').toLowerCase();
      const shouldAttach = (contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) && req.body && Object.keys(req.body).length;
      if (shouldAttach) {
        const bodyData = contentType.includes('application/x-www-form-urlencoded') ? new URLSearchParams(req.body).toString() : JSON.stringify(req.body);
        // update content-length
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
        proxyReq.end();
      }
      // otherwise leave the request stream intact so proxy will stream it through (this supports multipart/form-data uploads)
    } catch (err) {
      // if anything goes wrong, log and continue — proxy will attempt to stream
      console.error('onProxyReq error', err);
    }
  },
  onError(err, req, res) {
    console.error('Proxy error', err);
    if (!res.headersSent) res.status(502).json({ ok: false, error: 'flask_proxy_error' });
  }
}));

// Health endpoint for Node that also checks Flask readiness
async function nodeHealth(req, res) {
  try {
    const flaskHealthUrl = `${FLASK_URL.replace(/\/$/, '')}/health`;
    const resp = await fetch(flaskHealthUrl, { method: 'GET' });
    const flaskOk = resp.ok;
    return res.json({ ok: true, flask: flaskOk });
  } catch (e) {
    console.error('Health check failed', e);
    return res.status(503).json({ ok: false, flask: false });
  }
}
app.get('/health', nodeHealth);
app.get('/api/health', nodeHealth);

// Env presence (no secrets) for troubleshooting
function envInfo(req, res) {
  res.json({
    ok: true,
    google: {
      id: Boolean(process.env.GOOGLE_CLIENT_ID),
      secret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
      redirectUri: Boolean(process.env.GOOGLE_REDIRECT_URI),
    },
    ai: {
      openai: Boolean(process.env.OPENAI_API_KEY),
      groq: Boolean(process.env.GROQ_API_KEY),
      deepinfra: Boolean(process.env.DEEPINFRA_TOKEN),
    },
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    flaskUrl: process.env.FLASK_URL || null,
    serverPort: process.env.SERVER_PORT || process.env.NODE_PORT || null,
  });
}
app.get('/health/env', envInfo);
app.get('/api/health/env', envInfo);

// Support endpoints (Ask / Report) with file uploads
const multer = require('multer');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const askDir = path.join(__dirname, 'uploads', 'ask');
const reportDir = path.join(__dirname, 'uploads', 'report');
const recordsDir = path.join(__dirname, 'uploads', 'records');
const mfDir = path.join(recordsDir, 'mf');
ensureDir(askDir);
ensureDir(reportDir);
ensureDir(recordsDir);
ensureDir(mfDir);

const storageAsk = multer.diskStorage({
  destination: (req, file, cb) => cb(null, askDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${ts}_${safe}`);
  },
});

const storageReport = multer.diskStorage({
  destination: (req, file, cb) => cb(null, reportDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${ts}_${safe}`);
  },
});

const uploadAsk = multer({ storage: storageAsk, limits: { fileSize: 10 * 1024 * 1024 } });
const uploadReport = multer({ storage: storageReport, limits: { fileSize: 10 * 1024 * 1024 } });
const storageMf = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mfDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    const safe = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${ts}_${safe}`);
  },
});
const uploadMf = multer({ storage: storageMf, limits: { fileSize: 20 * 1024 * 1024 } });

// Simple Email OTP store and mailer
const nodemailer = require('nodemailer');
const otpStorePath = path.join(__dirname, 'uploads', 'otp-store.json');
ensureDir(path.dirname(otpStorePath));
function readOtpStore() {
  try {
    if (!fs.existsSync(otpStorePath)) return {};
    return JSON.parse(fs.readFileSync(otpStorePath, 'utf-8'));
  } catch (_) { return {}; }
}
function writeOtpStore(data) {
  try { fs.writeFileSync(otpStorePath, JSON.stringify(data, null, 2)); } catch (_) {}
}
function generateOtp() {
  return ('' + Math.floor(100000 + Math.random() * 900000));
}
// Transport configuration via ENV or fallback to ethereal if not configured
let mailTransport = null;
async function getTransport() {
  if (mailTransport) return mailTransport;
  const host = process.env.SMTP_HOST;
  const portNum = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (host && user && pass) {
    mailTransport = nodemailer.createTransport({ host, port: portNum || 587, secure: false, auth: { user, pass } });
  } else {
    // Create a test account automatically for dev
    const testAcc = await nodemailer.createTestAccount();
    mailTransport = nodemailer.createTransport({ host: 'smtp.ethereal.email', port: 587, secure: false, auth: { user: testAcc.user, pass: testAcc.pass } });
    console.log('Email OTP using Ethereal test SMTP. Preview links will appear in server logs.');
  }
  return mailTransport;
}

// Send Email OTP
app.post('/api/2fa/email/send', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ ok: false, error: 'missing_email' });
  try {
    const otp = generateOtp();
    const store = readOtpStore();
    store[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    writeOtpStore(store);
    const transporter = await getTransport();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@docteck.local',
      to: email,
      subject: 'Your Docteck verification code',
      text: `Your verification code is ${otp}. It expires in 10 minutes.`,
      html: `<p>Your Docteck verification code is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log('OTP email preview:', preview);
    res.json({ ok: true });
  } catch (e) {
    console.error('send email otp failed', e);
    res.status(500).json({ ok: false, error: 'send_failed' });
  }
});

// Verify Email OTP
app.post('/api/2fa/email/verify', (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ ok: false, error: 'missing_params' });
  try {
    const store = readOtpStore();
    const entry = store[email];
    if (!entry) return res.status(400).json({ ok: false, error: 'not_found' });
    if (Date.now() > Number(entry.expiresAt)) return res.status(400).json({ ok: false, error: 'expired' });
    if ((entry.otp || '').trim() !== String(code).trim()) return res.status(400).json({ ok: false, error: 'invalid' });
    delete store[email];
    writeOtpStore(store);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'verify_failed' });
  }
});

app.post('/api/support/ask', uploadAsk.array('files', 5), (req, res) => {
  try {
    const data = {
      createdAt: new Date().toISOString(),
      question: req.body.question || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      category: req.body.category || 'General',
      categoryOther: req.body.categoryOther || '',
      replyEmail: req.body.replyEmail === 'true',
      replySMS: req.body.replySMS === 'true',
      files: (req.files || []).map(f => ({ filename: f.filename, path: `/uploads/ask/${f.filename}`, mimetype: f.mimetype, size: f.size })),
    };
    const jsonPath = path.join(askDir, 'submissions.json');
    const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) : [];
    existing.push(data);
    fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'failed_to_save' });
  }
});

app.post('/api/support/report', uploadReport.array('files', 5), (req, res) => {
  try {
    const data = {
      createdAt: new Date().toISOString(),
      description: req.body.description || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      category: req.body.category || 'Bug',
      categoryOther: req.body.categoryOther || '',
      severity: req.body.severity || 'Normal',
      replyEmail: req.body.replyEmail === 'true',
      replySMS: req.body.replySMS === 'true',
      files: (req.files || []).map(f => ({ filename: f.filename, path: `/uploads/report/${f.filename}`, mimetype: f.mimetype, size: f.size })),
    };
    const jsonPath = path.join(reportDir, 'submissions.json');
    const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) : [];
    existing.push(data);
    fs.writeFileSync(jsonPath, JSON.stringify(existing, null, 2));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'failed_to_save' });
  }
});

// Simple Records storage (JSON on disk)
const recordsJsonPath = path.join(recordsDir, 'records.json');
function readRecords() {
  if (!fs.existsSync(recordsJsonPath)) return {
    notes: { endOfLife: '', medicalFamily: '' },
    // Structured End of Life section (defaults)
    eol: {
      notes: '',
      insurance: { provider: '', policyNumber: '', groupNumber: '', phone: '', memberId: '' },
      directives: { healthcareProxyName: '', healthcareProxyPhone: '', livingWillOnFile: false, dnrOnFile: false, preferredHospital: '' },
      donorStatus: 'Unknown',
      documentLinks: [],
      resources: [],
    },
  mfFiles: [],
    visits: [],
    tests: [],
    updatedAt: null,
  };
  try {
    const parsed = JSON.parse(fs.readFileSync(recordsJsonPath, 'utf-8'));
    // Backward compatibility: if eol missing, create from defaults and migrate notes.endOfLife
    if (!parsed.eol) {
      parsed.eol = {
        notes: parsed?.notes?.endOfLife || '',
        insurance: { provider: '', policyNumber: '', groupNumber: '', phone: '', memberId: '' },
        directives: { healthcareProxyName: '', healthcareProxyPhone: '', livingWillOnFile: false, dnrOnFile: false, preferredHospital: '' },
        donorStatus: 'Unknown',
        documentLinks: [],
        resources: [],
      };
    } else if (parsed.notes && parsed.notes.endOfLife && !parsed.eol.notes) {
      parsed.eol.notes = parsed.notes.endOfLife;
    }
  if (!Array.isArray(parsed.mfFiles)) parsed.mfFiles = [];
  return parsed;
  } catch (e) {
    console.error('Failed to read records.json', e);
    return { 
      notes: { endOfLife: '', medicalFamily: '' },
      eol: {
        notes: '',
        insurance: { provider: '', policyNumber: '', groupNumber: '', phone: '', memberId: '' },
        directives: { healthcareProxyName: '', healthcareProxyPhone: '', livingWillOnFile: false, dnrOnFile: false, preferredHospital: '' },
        donorStatus: 'Unknown',
        documentLinks: [],
        resources: [],
      },
  mfFiles: [],
  visits: [], tests: [], updatedAt: null 
    };
  }
}
function writeRecords(data) {
  fs.writeFileSync(recordsJsonPath, JSON.stringify(data, null, 2));
}

app.get('/api/records', (req, res) => {
  try {
    const data = readRecords();
    res.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.post('/api/records/notes', (req, res) => {
  try {
    const { endOfLife = '', medicalFamily = '' } = req.body || {};
    const current = readRecords();
    const updated = {
      ...current,
      notes: { endOfLife, medicalFamily },
      updatedAt: new Date().toISOString(),
    };
    writeRecords(updated);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'failed_to_save_records' });
  }
});

// Update structured End of Life data
app.post('/api/records/eol', (req, res) => {
  try {
    const eolUpdate = req.body || {};
    const current = readRecords();
    const merged = {
      ...current.eol,
      ...eolUpdate,
      // Ensure arrays are replaced intentionally
      documentLinks: Array.isArray(eolUpdate.documentLinks) ? eolUpdate.documentLinks : (current.eol?.documentLinks || []),
      resources: Array.isArray(eolUpdate.resources) ? eolUpdate.resources : (current.eol?.resources || []),
    };
    const updated = { ...current, eol: merged, updatedAt: new Date().toISOString() };
    writeRecords(updated);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'failed_to_save_eol' });
  }
});

// Medical & Family files API
app.get('/api/records/mf-files', (req, res) => {
  try {
    const data = readRecords();
    res.json({ ok: true, files: data.mfFiles || [] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.post('/api/records/mf-files', uploadMf.single('file'), (req, res) => {
  try {
    const current = readRecords();
    if (!req.file) return res.status(400).json({ ok: false, error: 'no_file' });
    const category = (req.body.category || 'Self').trim();
    const label = (req.body.label || req.file.originalname).trim();
    const entry = {
      id: req.file.filename,
      label,
      category,
      path: `/uploads/records/mf/${req.file.filename}`,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date().toISOString(),
    };
    const updated = { ...current, mfFiles: [ ...(current.mfFiles || []), entry ], updatedAt: new Date().toISOString() };
    writeRecords(updated);
    res.json({ ok: true, file: entry });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'failed_to_upload' });
  }
});

app.delete('/api/records/mf-files/:id', (req, res) => {
  try {
    const id = req.params.id;
    const current = readRecords();
    const files = current.mfFiles || [];
    const idx = files.findIndex(f => f.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, error: 'not_found' });
    const file = files[idx];
    const diskPath = path.join(mfDir, file.id);
    if (fs.existsSync(diskPath)) {
      try { fs.unlinkSync(diskPath); } catch (_) {}
    }
    files.splice(idx, 1);
    const updated = { ...current, mfFiles: files, updatedAt: new Date().toISOString() };
    writeRecords(updated);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'failed_to_delete' });
  }
});

// Update metadata (tags/notes/label) for an mf-file
app.patch('/api/records/mf-files/:id', (req, res) => {
  try {
    const id = req.params.id;
    const { label, tags, notes } = req.body || {};
    const current = readRecords();
    const files = current.mfFiles || [];
    const idx = files.findIndex(f => f.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, error: 'not_found' });
    const prev = files[idx];
    const next = {
      ...prev,
      ...(typeof label === 'string' ? { label } : {}),
      ...(Array.isArray(tags) ? { tags } : {}),
      ...(typeof notes === 'string' ? { notes } : {}),
      updatedAt: new Date().toISOString(),
    };
    files[idx] = next;
    const updated = { ...current, mfFiles: files, updatedAt: new Date().toISOString() };
    writeRecords(updated);
    res.json({ ok: true, file: next });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'failed_to_update' });
  }
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Prevent long hangs if upstream is slow
  timeout: 20_000,
});

// Helper: apply a timeout to any promise to avoid hanging requests
function withTimeout(promise, ms, onTimeoutValue = null) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((resolve) => {
      timer = setTimeout(() => resolve(onTimeoutValue), ms);
    })
  ]);
}

// Very small, safe local fallback so the UI never stays silent.
function localFallbackReply(userText) {
  const t = (userText || '').toString().toLowerCase();
  const tips = [];
  if (/fever|temperature/.test(t)) tips.push('Stay hydrated and rest. Consider acetaminophen for fever unless contraindicated.');
  if (/(cough|cold)/.test(t)) tips.push('Warm fluids, rest, and honey (if not allergic) can help a cough.');
  if (/headache|migraine/.test(t)) tips.push('Hydration and over‑the‑counter pain relief (e.g., acetaminophen) may help.');
  if (/stomach|nausea|vomit|diarrhea/.test(t)) tips.push('Small sips of clear fluids and bland foods; watch for dehydration.');
  if (/chest pain|shortness of breath|difficulty breathing|severe/.test(t)) tips.push('If symptoms are severe or sudden, seek urgent medical care.');
  const base = tips.length
    ? tips.slice(0, 3).join(' ')
    : 'Rest, hydrate, and monitor your symptoms. For persistent or worsening issues, consult a healthcare professional.';
  return `${base} This is a quick offline tip while the AI service resets—ask again in a moment for a fuller answer.`;
}

// Lightweight Groq fallback (no tool calling). Returns a short reply or null.
async function groqSimpleChat(messages, sysText) {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    const body = {
      model: 'llama3-70b-8192',
      messages: [
        ...(sysText ? [{ role: 'system', content: sysText }] : []),
        ...messages
      ],
      max_tokens: 250,
      temperature: 0.4,
    };
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 20_000);
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(t);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (_) {
    return null;
  }
}

// DeepInfra fallback (DeepSeek-V3) using OpenAI-compatible Chat Completions.
async function deepinfraSimpleChat(messages, sysText) {
  if (!process.env.DEEPINFRA_TOKEN) return null;
  try {
    const body = {
      model: 'deepseek-ai/DeepSeek-V3',
      messages: [
        ...(sysText ? [{ role: 'system', content: sysText }] : []),
        ...messages
      ],
      max_tokens: 250,
      temperature: 0.4,
    };
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 20_000);
    const resp = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPINFRA_TOKEN}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(t);
    if (!resp.ok) return null;
    const data = await resp.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (_) {
    return null;
  }
}

app.post('/api/doctor-assistant', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful medical assistant. When a user describes symptoms, suggest possible illnesses and recommend over-the-counter medicines or advise seeing a doctor. Always remind users to consult a healthcare professional for serious or persistent symptoms.' },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.5,
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI service error.' });
  }
});

app.post('/api/groq-assistant', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided.' });
  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: 'You are a professional, friendly medical assistant. Keep replies to 1–2 sentences, concise and varied. Capabilities: 1) infer likely common illnesses from symptoms (be cautious, not diagnostic), 2) suggest OTC medicines and dosing ranges (if safe) or note when to avoid, 3) recommend simple home care (rest, fluids, warm bath, humidity, etc.), 4) suggest which kind of doctor/specialist to see and urgency, 5) help medical students study by explaining topics clearly and stepwise, 6) create quick quizzes with 1–3 questions and then explain answers briefly on request. Always include a brief safety note for red flags or uncertainty and tell users to seek professional care for severe/worsening symptoms.' },
          { role: 'user', content: message }
        ],
        max_tokens: 180,
        temperature: 0.7,
      })
    });
    if (!groqRes.ok) throw new Error('Groq API error');
    const data = await groqRes.json();
    const reply = data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI service error.' });
  }
});

// Smart assistant with tool-calling: web browse, calendar, and doctor contact
const cheerio = require('cheerio');
const dayjs = require('dayjs');
const chrono = require('chrono-node');
const { google } = require('googleapis');
const wiki = require('wikijs').default;
const calendarTokenPath = path.join(__dirname, 'uploads', 'calendar-tokens.json');

function readJsonSafe(p) { try { if (!fs.existsSync(p)) return {}; return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (_) { return {}; } }
function getUid(req) { return (req.headers['x-user-id'] || req.query.uid || 'demo-user'); }
// Simple in-memory short-term memory per user
const shortMemory = new Map(); // uid -> [{role, content, ts}]
function remember(uid, role, content) {
  const arr = shortMemory.get(uid) || [];
  arr.push({ role, content, ts: Date.now() });
  // keep last 20 turns
  while (arr.length > 40) arr.shift();
  shortMemory.set(uid, arr);
}
function recall(uid) {
  return shortMemory.get(uid) || [];
}

async function webSearch(query) {
  const url = 'https://duckduckgo.com/html/?q=' + encodeURIComponent(query);
  const html = await (await fetch(url, { headers: { 'User-Agent': 'DocteckBot/1.0' } })).text();
  const $ = cheerio.load(html);
  const results = [];
  $('a.result__a').slice(0, 5).each((_, el) => {
    const title = $(el).text();
    const link = $(el).attr('href');
    const snippet = $(el).closest('.result').find('.result__snippet').text();
    if (title && link) results.push({ title, url: link, snippet });
  });
  return results;
}

async function wikiSummary(query) {
  try {
    const page = await wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' }).page(query);
    const summary = await page.summary();
    return summary.slice(0, 1200);
  } catch (_) {
    return '';
  }
}

function isYouTubeUrl(u) {
  try {
    const x = new URL(u);
    if (x.hostname.includes('youtube.com')) return true;
    if (x.hostname.includes('youtu.be')) return true;
  } catch(_) {}
  return false;
}

function parseYouTubeId(u) {
  try {
    const x = new URL(u);
    if (x.hostname.includes('youtu.be')) return x.pathname.slice(1);
    if (x.searchParams.get('v')) return x.searchParams.get('v');
    const m = x.pathname.match(/\/shorts\/([A-Za-z0-9_-]{5,})/);
    if (m) return m[1];
  } catch(_) {}
  return '';
}

function sanitize(str) { return (str || '').toString(); }

function vttToText(vtt) {
  try {
    return vtt
      .split(/\r?\n/)
      .filter(l => !/^\d+$/.test(l) && !/-->/.test(l) && l.trim() !== '' && !/^WEBVTT/i.test(l))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch { return ''; }
}

function xmlToText(xml) {
  try {
    // Remove tags and decode basic entities
    const noTags = xml.replace(/<[^>]+>/g, ' ');
    return noTags.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
  } catch { return ''; }
}

async function fetchYouTubeMeta(url) {
  const headers = { 'User-Agent': 'DocteckBot/1.0 (+https://docteck.local)' };
  let oembed = {};
  try {
    const oe = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`, { headers });
    if (oe.ok) oembed = await oe.json();
  } catch(_) {}
  let html = '';
  try {
    html = await (await fetch(url, { headers })).text();
  } catch(_) {}
  const $ = cheerio.load(html || '');
  const meta = (name, attr='content') => ($(`meta[property="${name}"]`).attr(attr) || $(`meta[name="${name}"]`).attr(attr) || '').trim();
  const title = meta('og:title') || oembed.title || $('title').first().text().trim();
  const description = meta('og:description');
  const thumbnail = meta('og:image') || oembed.thumbnail_url || '';
  const author = oembed.author_name || '';
  const duration = ($('meta[itemprop="duration"]').attr('content') || '').trim();
  const published = ($('meta[itemprop="datePublished"]').attr('content') || '').trim();
  // Try to capture short description text from initial data JSON if present
  let shortDesc = '';
  let transcript = '';
  try {
    const m = html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\});/);
    if (m) {
      const data = JSON.parse(m[1]);
      shortDesc = data?.videoDetails?.shortDescription || '';
      const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
      let track = null;
      if (Array.isArray(tracks) && tracks.length) {
        track = tracks.find(t => t.languageCode && t.languageCode.startsWith('en')) || tracks[0];
      }
      if (track && track.baseUrl) {
        try {
          const capRes = await fetch(track.baseUrl + '&fmt=vtt', { headers });
          if (capRes.ok) {
            const vtt = await capRes.text();
            transcript = vttToText(vtt);
          }
          if (!transcript) {
            const capXml = await (await fetch(track.baseUrl, { headers })).text();
            transcript = xmlToText(capXml);
          }
          transcript = sanitize(transcript).slice(0, 10000);
        } catch(_) {}
      }
    }
  } catch(_) {}
  return { title, description, thumbnail, author, duration, published, shortDesc, transcript };
}

function localBulletSummary(headerLines, contentText, maxBullets = 8) {
  const bullets = [];
  const seen = new Set();
  for (const h of headerLines) {
    const v = (h || '').toString().trim();
    if (v && !seen.has(v)) { bullets.push(v); seen.add(v); }
  }
  const text = (contentText || '').toString();
  const parts = text
    .replace(/\r/g, '')
    .split(/\n+|(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length >= 30)
    .slice(0, maxBullets);
  for (const p of parts) {
    if (bullets.length >= maxBullets + headerLines.length) break;
    const line = p.length > 180 ? p.slice(0, 177) + '…' : p;
    if (!seen.has(line)) { bullets.push(line); seen.add(line); }
  }
  return bullets.map(b => `- ${b}`).join('\n');
}

async function summarizeWithOpenAI(openaiClient, system, user, max=350) {
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [ { role: 'system', content: system }, { role: 'user', content: user } ],
    max_tokens: max,
    temperature: 0.2,
  });
  return completion.choices?.[0]?.message?.content || '';
}

async function webFetchAndSummarize(url, openaiClient) {
  const headers = { 'User-Agent': 'DocteckBot/1.0 (+https://docteck.local)' };
  if (isYouTubeUrl(url)) {
    const meta = await fetchYouTubeMeta(url);
    const payload = [
      `Title: ${meta.title || ''}`,
      meta.author ? `Channel: ${meta.author}` : '',
      meta.published ? `Published: ${meta.published}` : '',
      meta.duration ? `Duration: ${meta.duration}` : '',
      meta.description ? `OG Description: ${meta.description}` : '',
      meta.shortDesc ? `Video Description: ${meta.shortDesc.slice(0, 4000)}` : '',
      meta.transcript ? `Transcript (partial): ${meta.transcript.slice(0, 6000)}` : ''
    ].filter(Boolean).join('\n');
    const sys = 'You are summarizing a YouTube video for practical understanding. Extract topic, key takeaways, any steps/processes, risks/considerations, and 3-5 actionable next steps. If medical/health related, include cautions to see a professional when appropriate. Keep it concise with headings and bullet points.';
    try {
      return await summarizeWithOpenAI(openaiClient, sys, payload, 420);
    } catch (_) {
      // Local fallback summary
      const header = [
        meta.title ? `Title: ${meta.title}` : '',
        meta.author ? `Channel: ${meta.author}` : '',
        meta.published ? `Published: ${meta.published}` : '',
        meta.duration ? `Duration: ${meta.duration}` : ''
      ].filter(Boolean);
      const content = meta.transcript || meta.shortDesc || meta.description || '';
      const bullets = localBulletSummary(header, content, 8);
      return `YouTube quick summary (offline):\n${bullets}\n\nNote: This is a quick local summary; ask again for a richer summary when limits reset.`;
    }
  }

  // Generic page
  let html = '';
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 20000);
    const resp = await fetch(url, { headers, signal: controller.signal });
    clearTimeout(t);
    html = await resp.text();
  } catch (e) {
    return 'Unable to fetch the page right now.';
  }
  const $ = cheerio.load(html);
  $('script, style, nav, aside, footer, noscript, svg, header, form, iframe').remove();
  const title = ($('title').first().text() || '').trim();
  const description = ($('meta[name="description"]').attr('content') || '').trim();
  const ogTitle = ($('meta[property="og:title"]').attr('content') || '').trim();
  const ogDesc = ($('meta[property="og:description"]').attr('content') || '').trim();
  const canonical = ($('link[rel="canonical"]').attr('href') || '').trim();
  const blocks = [];
  $('main, article, section, h1, h2, h3, p, li').each((_, el) => {
    const tx = $(el).text().replace(/\s+/g, ' ').trim();
    if (!tx) return;
    if (tx.length < 40) return;
    if (/^Skip to content/i.test(tx)) return;
    if (/Reload to refresh your session/i.test(tx)) return;
    blocks.push(tx);
  });
  const unique = Array.from(new Set(blocks));
  const top = unique.sort((a,b)=>b.length-a.length).slice(0, 20);
  const body = top.join('\n');
  const sys = 'Summarize the following web page focusing on information useful for a healthcare/appointments assistant. Provide: 1) What this page is, 2) Key points (<=10 bullets), 3) Important dates/contacts/links (if any), 4) Suggested next steps. Ignore navigation/boilerplate text.';
  const user = [
    `Title: ${title}`,
    ogTitle && ogTitle !== title ? `OG Title: ${ogTitle}` : '',
    description ? `Description: ${description}` : '',
    ogDesc && ogDesc !== description ? `OG Description: ${ogDesc}` : '',
    canonical ? `Canonical: ${canonical}` : '',
    body
  ].filter(Boolean).join('\n');
  try {
    return await summarizeWithOpenAI(openaiClient, sys, user, 380);
  } catch (_) {
    // Local fallback summary
    const header = [
      title ? `Title: ${title}` : '',
      ogTitle && ogTitle !== title ? `OG Title: ${ogTitle}` : '',
      description ? `Description: ${description}` : ''
    ].filter(Boolean);
    const bullets = localBulletSummary(header, body, 10);
    return `Page quick summary (offline):\n${bullets}\n\nNote: This is a quick local summary; ask again for a richer summary when limits reset.`;
  }
}

function parseDateTime(phrase) {
  const parsed = chrono.parse(phrase, new Date(), { forwardDate: true });
  if (!parsed || !parsed[0]) return null;
  const { start } = parsed[0];
  const dt = start.date();
  return dt;
}

function getCalendarClientForUid(uid) {
  const tokens = readJsonSafe(calendarTokenPath)[uid];
  if (!tokens) return null;
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'
  );
  oAuth2Client.setCredentials(tokens);
  return google.calendar({ version: 'v3', auth: oAuth2Client });
}

async function createCalendarEvent(uid, { title, startTime, durationMinutes = 30, location, description }) {
  const cal = getCalendarClientForUid(uid);
  if (!cal) return { ok: false, error: 'not_connected' };
  const start = startTime instanceof Date ? startTime : parseDateTime(String(startTime) || '');
  if (!start) return { ok: false, error: 'invalid_time' };
  const end = new Date(start.getTime() + durationMinutes * 60000);
  try {
    const resp = await cal.events.insert({
      calendarId: 'primary',
      requestBody: {
        summary: title || 'Appointment',
        location: location || undefined,
        description: description || undefined,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      },
    });
    return { ok: true, event: resp.data };
  } catch (e) {
    return { ok: false, error: 'insert_failed', details: e.message };
  }
}

async function listUpcoming(uid) {
  const cal = getCalendarClientForUid(uid);
  if (!cal) return { ok: false, error: 'not_connected' };
  try {
    const events = await cal.events.list({ calendarId: 'primary', timeMin: new Date().toISOString(), maxResults: 10, singleEvents: true, orderBy: 'startTime' });
    return { ok: true, events: events.data.items || [] };
  } catch (e) {
    return { ok: false, error: 'list_failed', details: e.message };
  }
}

app.post('/api/assistant-smart', async (req, res) => {
  const uid = getUid(req);
  const messages = req.body?.messages || (req.body?.message ? [{ role: 'user', content: req.body.message }] : []);
  if (!messages.length) return res.status(400).json({ error: 'No messages' });
  // Hoist system prompt so it is available to error-handling fallbacks
  const sysText = 'You are a concise, action-oriented medical assistant. Capabilities: (A) infer likely common illnesses from symptoms (not a diagnosis), (B) recommend safe OTC medicines with general dosing ranges and contraindication notes, (C) suggest home care (hydration, rest, warm bath/shower, humidifier, salt-water gargle, etc.), (D) recommend which kind of doctor/specialist to see and urgency, (E) help medical students study with stepwise explanations, mnemonics, and comparisons, (F) create brief quizzes (1–5 questions) and then explain answers on request. Always include short safety guidance for red flags and advise seeking professional care for severe or worsening symptoms. Prefer calling tools to take actions. When users ask to schedule appointments, call add_appointment (and optionally create_event if appropriate). When they ask to add or remember a task, call add_todo. When they specify a main doctor/hospital/provider for the HUB, call add_hub_item. For pharmacy entries, call add_pharmacy. For medicines to track under Prescriptions, call add_prescription. For general “what is X”, use wiki_summary. Use web_search/web_fetch for current info. For contacting a doctor, call contact_doctor.\n\nWhen the user submits text from files, do NOT repeat long transcripts. Instead, synthesize: 1) What it is, 2) Key points (<=8 bullets), 3) Risks/alerts, 4) Next steps. Quote short snippets only when necessary. Keep replies to ~150–250 words unless the user requests detail.';
  const sys = { role: 'system', content: sysText };
  try {
    const tools = [
      {
        type: 'function',
        function: {
          name: 'web_search',
          description: 'Search the web for current information',
          parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'web_fetch',
          description: 'Fetch a specific URL and summarize key points',
          parameters: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'create_event',
          description: 'Create a calendar event in the user\'s primary Google Calendar',
          parameters: { type: 'object', properties: {
            title: { type: 'string' },
            startTime: { type: 'string', description: 'Natural language like "tomorrow 3pm" or ISO' },
            durationMinutes: { type: 'number' },
            location: { type: 'string' },
            description: { type: 'string' }
          }, required: ['title','startTime'] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'list_upcoming',
          description: 'List the next 10 upcoming events',
          parameters: { type: 'object', properties: {} }
        }
      },
      {
        type: 'function',
        function: {
          name: 'contact_doctor',
          description: 'Send an email to the configured doctor address with subject and message',
          parameters: { type: 'object', properties: { subject: { type: 'string' }, message: { type: 'string' } }, required: ['subject','message'] }
        }
      },
      {
        type: 'function',
        function: {
          name: 'wiki_summary',
          description: 'Get a concise summary from Wikipedia for general knowledge questions',
          parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        }
      }
      ,
      // App-integrations: let the AI request structured adds. The client will perform the actual add
      {
        type: 'function',
        function: {
          name: 'add_todo',
          description: 'Add a short task/reminder to the To-do tracker',
          parameters: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Short description of the task' },
              date: { type: 'string', description: 'When to do it, natural language or ISO' }
            },
            required: ['text']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'add_appointment',
          description: 'Add an appointment to the app calendar and appointments list',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Doctor or appointment title' },
              startTime: { type: 'string', description: 'When the appointment starts (e.g., "Tuesday 4pm")' },
              durationMinutes: { type: 'number', description: 'Duration in minutes', default: 30 },
              doctor: { type: 'string', description: 'Doctor name if available' },
              hospital: { type: 'string', description: 'Hospital/clinic name' },
              location: { type: 'string' }
            },
            required: ['title','startTime']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'add_hub_item',
          description: 'Add a provider/hospital information card in the HUB table',
          parameters: {
            type: 'object',
            properties: {
              hospital: { type: 'string' },
              doctors: { type: 'array', items: { type: 'string' }, description: 'One or more doctor names' },
              bill: { type: 'string', description: 'Bill currency symbol or amount, optional' },
              completion: { type: 'number', description: 'Completion percent 0-100', default: 0 }
            },
            required: ['hospital']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'add_pharmacy',
          description: 'Add a pharmacy to Pharmacy Information box',
          parameters: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              address: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
              prescription: { type: 'string', description: 'Name of a prescription to pick up' }
            },
            required: ['name','address']
          }
        }
      },
      {
        type: 'function',
        function: {
          name: 'add_prescription',
          description: 'Add an entry to the Prescriptions list',
          parameters: {
            type: 'object',
            properties: {
              medicine: { type: 'string' },
              price: { type: 'string', description: 'Price like $60' },
              date: { type: 'string', description: 'Pick-up date (YYYY-MM-DD or natural language)' }
            },
            required: ['medicine','date']
          }
        }
      }
    ];
  // sys defined above so catch/fallbacks can reference it too
    // Merge short memory with latest messages
    const memory = recall(uid).slice(-10);
    const first = await withTimeout(
      openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [sys, ...memory, ...messages], tools, tool_choice: 'auto', temperature: 0.4, max_tokens: 250 }),
      25_000
    );
    if (!first) {
      return res.status(504).json({ error: 'upstream_timeout', reply: 'Sorry, the assistant took too long to respond. Please try again.' });
    }
    const msg = first.choices[0].message;
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      async function executeTool(name, args) {
        if (name === 'web_search') return await webSearch(args.query || '');
        if (name === 'web_fetch') return await webFetchAndSummarize(args.url || '', openai);
        if (name === 'create_event') return await createCalendarEvent(uid, args);
        if (name === 'list_upcoming') return await listUpcoming(uid);
        if (name === 'wiki_summary') return await wikiSummary(args.query || '');
        if (name === 'contact_doctor') {
          try {
            const transporter = await getTransport();
            const info = await transporter.sendMail({
              from: process.env.SMTP_FROM || 'no-reply@docteck.local',
              to: process.env.DOCTOR_EMAIL || process.env.SMTP_TO || 'docteck@example.com',
              subject: args.subject || 'Message from Docteck Assistant',
              text: args.message || ''
            });
            const preview = nodemailer.getTestMessageUrl(info);
            return { ok: true, previewUrl: preview };
          } catch (e) {
            return { ok: false, error: 'send_failed' };
          }
        }
        if (name === 'add_todo') {
          return { ok: true, todo: { text: args.text || '', date: args.date || null } };
        }
        if (name === 'add_appointment') {
          return { ok: true, appointment: {
            title: args.title || args.doctor || 'Appointment',
            startTime: args.startTime || args.date || '',
            durationMinutes: typeof args.durationMinutes === 'number' ? args.durationMinutes : 30,
            doctor: args.doctor || null,
            hospital: args.hospital || null,
            location: args.location || null
          }};
        }
        if (name === 'add_hub_item') {
          const doctors = Array.isArray(args.doctors) ? args.doctors : (args.doctor ? [args.doctor] : []);
          return { ok: true, hub: {
            hospital: args.hospital || 'Hospital',
            doctors,
            bill: args.bill || '$',
            completion: typeof args.completion === 'number' ? args.completion : 0
          }};
        }
        if (name === 'add_pharmacy') {
          return { ok: true, pharmacy: {
            name: args.name || '',
            address: args.address || '',
            email: args.email || '',
            phone: args.phone || '',
            prescription: args.prescription || ''
          }};
        }
        if (name === 'add_prescription') {
          return { ok: true, prescription: {
            medicine: args.medicine || '',
            price: args.price || '',
            date: args.date || ''
          }};
        }
        return { ok: false, error: 'unknown_tool' };
      }

      const toolMessages = [];
      for (const call of msg.tool_calls) {
        const name = call.function?.name;
        let args = {};
        try { args = JSON.parse(call.function?.arguments || '{}'); } catch (_) { args = {}; }
        const result = await executeTool(name, args);
        const content = typeof result === 'string' ? result : JSON.stringify(result);
        toolMessages.push({ role: 'tool', tool_call_id: call.id, content });
      }

      const follow = await withTimeout(
        openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [sys, ...messages, msg, ...toolMessages],
          temperature: 0.4,
          max_tokens: 250,
        }),
        25_000
      );
      if (!follow) {
        // If we fetched content already (e.g., web_fetch) but can’t get model to finalize, return the tool content directly.
        const lastFetch = toolMessages.findLast ? toolMessages.findLast(m => m && typeof m.content === 'string') : toolMessages[toolMessages.length - 1];
        if (lastFetch && typeof lastFetch.content === 'string' && lastFetch.content.trim()) {
          remember(uid, 'user', messages[messages.length - 1]?.content || '');
          remember(uid, 'assistant', lastFetch.content);
          return res.json({ reply: lastFetch.content, tool: null, fallback: true });
        }
        return res.status(504).json({ error: 'upstream_timeout', reply: 'Action performed. The assistant reply timed out. Please ask again if needed.' });
      }
      const replyText = follow.choices[0].message.content;
      remember(uid, 'user', messages[messages.length - 1]?.content || '');
      remember(uid, 'assistant', replyText);
      return res.json({ reply: replyText });
    }
    const replyText = msg.content;
    remember(uid, 'user', messages[messages.length - 1]?.content || '');
    remember(uid, 'assistant', replyText);
    return res.json({ reply: replyText });
  } catch (e) {
    // Graceful rate-limit handling with Groq fallback when available
    const code = e?.error?.code || e?.code;
    const httpStatus = e?.status || e?.response?.status || 0;
    const msgText = e?.error?.message || e?.message || '';
    const isRate = httpStatus === 429 || code === 'rate_limit_exceeded' || /rate limit/i.test(msgText);
    const isQuota = code === 'insufficient_quota' || /insufficient[_\s-]?quota|exceeded your current quota/i.test(msgText);

    if (isRate || isQuota) {
      // Try Groq first if available
      try {
        if (process.env.GROQ_API_KEY) {
          const fallback = await withTimeout(
            groqSimpleChat(messages, sysText),
            20_000
          );
          if (fallback && fallback.trim()) {
            try { console.log('assistant-smart: responded via Groq fallback'); } catch (_) {}
            remember(uid, 'user', messages[messages.length - 1]?.content || '');
            remember(uid, 'assistant', fallback);
            return res.json({ reply: `${fallback}\n\n(note: replied using backup model due to temporary limits)`, tool: null, fallback: 'groq' });
          }
        }
        // Then DeepInfra if available
        if (process.env.DEEPINFRA_TOKEN) {
          const di = await withTimeout(
            deepinfraSimpleChat(messages, sysText),
            20_000
          );
          if (di && di.trim()) {
            try { console.log('assistant-smart: responded via DeepInfra fallback'); } catch (_) {}
            remember(uid, 'user', messages[messages.length - 1]?.content || '');
            remember(uid, 'assistant', di);
            return res.json({ reply: `${di}\n\n(note: replied using backup model)`, tool: null, fallback: 'deepinfra' });
          }
        }
      } catch (_) { /* ignore and continue to 429 */ }
    }

    if (isRate) {
      try { console.warn('assistant-smart rate limited', msgText); } catch(_) {}
      const headers = e?.headers || {};
      let retryAfter = 20;
      if (headers['retry-after-ms']) {
        const ms = parseInt(headers['retry-after-ms'], 10);
        if (!Number.isNaN(ms)) retryAfter = Math.max(1, Math.round(ms / 1000));
      } else if (headers['retry-after']) {
        const sec = parseInt(headers['retry-after'], 10);
        if (!Number.isNaN(sec)) retryAfter = Math.max(1, sec);
      }
      // Provide a short local reply so the UI still gets something, plus guidance to retry.
      const lastUser = messages?.[messages.length - 1]?.content || '';
      const offline = localFallbackReply(lastUser);
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        retryAfter,
        reply: offline
      });
    }

    if (isQuota) {
      // Quota exhausted typically won't reset daily; advise upgrading or switching keys.
      return res.status(402).json({ error: 'insufficient_quota', reply: 'The AI quota is exhausted for now. Please add billing or try again later.' });
    }

    console.error('assistant-smart error', e);
    const lastUser = messages?.[messages.length - 1]?.content || '';
    const offline = localFallbackReply(lastUser);
    return res.status(200).json({ reply: offline, fallback: 'local' });
  }
});

const fileAnalysisRouter = require('./file-analysis');
app.use(fileAnalysisRouter);

const calendarRouter = require('./calendar');
app.use(calendarRouter);

const appointmentsRouter = require('./appointments');
app.use(appointmentsRouter);

app.listen(port, () => {
  console.log(`Doctor Assistant backend running on port ${port}`);
});
