const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const stripeRoutes = require('./stripeRoutes');
const stripePayRoutes = require('./stripePayRoutes');
const app = express();
const port = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json());
app.use('/api/stripe', stripeRoutes);
app.use('/api/stripe', stripePayRoutes);
// Serve uploaded files (optional)
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));
// Serve static assets (like /calendar/oauth-success.html) from root public folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Support endpoints (Ask / Report) with file uploads
const fs = require('fs');
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
});

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
          { role: 'system', content: 'You are a professional, friendly medical assistant. Always reply in 1-2 sentences, never more. Be direct, simple, and to the point. Vary your greetings and acknowledgements (e.g., "I see", "Understood", "Alright", etc.). If greeted, reply with a short, natural greeting and offer help. If symptoms are described, give a likely cause and a medicine or recovery method right away, using different phrasing each time. If the user follows up, continue the conversation naturally and contextually. Never be verbose or repeat the same phrases.' },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
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

async function webFetchAndSummarize(url, openaiClient) {
  const html = await (await fetch(url, { headers: { 'User-Agent': 'DocteckBot/1.0' } })).text();
  const $ = cheerio.load(html);
  const text = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 12000);
  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Summarize the following web page content into the most relevant medical or appointment-related points. Include key facts, dates, medications, contact info and links if present.' },
      { role: 'user', content: text }
    ],
    max_tokens: 300,
    temperature: 0.2,
  });
  return completion.choices?.[0]?.message?.content || '';
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
      }
      {
        type: 'function',
        function: {
          name: 'wiki_summary',
          description: 'Get a concise summary from Wikipedia for general knowledge questions',
          parameters: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] }
        }
      }
    ];
    const sys = {
      role: 'system',
      content: 'You are a concise, action-oriented medical assistant with broad general knowledge. You specialize in medical topics but can answer other queries succinctly. Maintain short-term memory across turns. When users ask to schedule appointments, call create_event. If they ask general “what is X”, use wiki_summary. Use web_search/web_fetch for current info. For contacting a doctor, call contact_doctor. Keep replies to 2-4 sentences.'
    };
    // Merge short memory with latest messages
    const memory = recall(uid).slice(-10);
    const first = await openai.chat.completions.create({ model: 'gpt-4o-mini', messages: [sys, ...memory, ...messages], tools, tool_choice: 'auto', temperature: 0.4, max_tokens: 250 });
    const msg = first.choices[0].message;
    if (msg.tool_calls && msg.tool_calls.length > 0) {
      const call = msg.tool_calls[0];
      const name = call.function.name;
      const args = JSON.parse(call.function.arguments || '{}');
      let toolResult = null;
      if (name === 'web_search') toolResult = await webSearch(args.query || '');
      else if (name === 'web_fetch') toolResult = await webFetchAndSummarize(args.url || '', openai);
      else if (name === 'create_event') toolResult = await createCalendarEvent(uid, args);
      else if (name === 'list_upcoming') toolResult = await listUpcoming(uid);
      else if (name === 'wiki_summary') toolResult = await wikiSummary(args.query || '');
      else if (name === 'contact_doctor') {
        try {
          const transporter = await getTransport();
          const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || 'no-reply@docteck.local',
            to: process.env.DOCTOR_EMAIL || process.env.SMTP_TO || 'docteck@example.com',
            subject: args.subject || 'Message from Docteck Assistant',
            text: args.message || ''
          });
          const preview = nodemailer.getTestMessageUrl(info);
          toolResult = { ok: true, previewUrl: preview };
        } catch (e) {
          toolResult = { ok: false, error: 'send_failed' };
        }
      }
      const follow = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [sys, ...messages, msg, { role: 'tool', tool_call_id: call.id, content: JSON.stringify(toolResult) }],
        temperature: 0.4,
        max_tokens: 250,
      });
      const replyText = follow.choices[0].message.content;
      remember(uid, 'user', messages[messages.length - 1]?.content || '');
      remember(uid, 'assistant', replyText);
      return res.json({ reply: replyText, tool: { name, result: toolResult } });
    }
    const replyText = msg.content;
    remember(uid, 'user', messages[messages.length - 1]?.content || '');
    remember(uid, 'assistant', replyText);
    return res.json({ reply: replyText });
  } catch (e) {
    console.error('assistant-smart error', e);
    return res.status(500).json({ error: 'assistant_error' });
  }
});

const fileAnalysisRouter = require('./file-analysis');
app.use(fileAnalysisRouter);

const calendarRouter = require('./calendar');
app.use(calendarRouter);

app.listen(port, () => {
  console.log(`Doctor Assistant backend running on port ${port}`);
});
