const express = require('express');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const router = express.Router();

const storeDir = path.join(__dirname, 'uploads');
const apptPath = path.join(storeDir, 'appointments.json');
const providersPath = path.join(storeDir, 'providers.json');
const calendarTokenPath = path.join(storeDir, 'calendar-tokens.json');
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });

function readJsonSafe(p, fallback) {
  try { if (!fs.existsSync(p)) return fallback; return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (_) { return fallback; }
}
function writeJsonSafe(p, obj) { try { fs.writeFileSync(p, JSON.stringify(obj, null, 2)); } catch (_) {} }

// Seed providers if missing
function ensureProviders() {
  if (!fs.existsSync(providersPath)) {
    const seed = [
      { id: 'p-smith', name: 'Dr. Alice Smith', specialty: 'Primary Care', location: 'Suite 101', availability: { mon: ['09:00-12:00','13:00-17:00'], tue: ['09:00-12:00','13:00-17:00'], wed: ['09:00-12:00'], thu: ['13:00-17:00'], fri: ['09:00-12:00'] } },
      { id: 'p-johnson', name: 'Dr. Bob Johnson', specialty: 'Cardiology', location: 'Suite 203', availability: { mon: ['10:00-16:00'], wed: ['10:00-16:00'], fri: ['10:00-14:00'] } },
      { id: 'p-lee', name: 'Dr. Carol Lee', specialty: 'Dermatology', location: 'Suite 305', availability: { tue: ['09:30-15:30'], thu: ['09:30-15:30'] } },
    ];
    writeJsonSafe(providersPath, seed);
  }
}
ensureProviders();

function listAppointments() {
  return readJsonSafe(apptPath, []);
}
function saveAppointments(list) { writeJsonSafe(apptPath, list); }

function parseTimeStr(s) { const [h,m] = s.split(':').map(Number); const d = new Date(); d.setHours(h, m||0, 0, 0); return d; }
function timeToMinutes(d) { return d.getHours()*60 + d.getMinutes(); }

function weekdayKey(date) {
  return ['sun','mon','tue','wed','thu','fri','sat'][new Date(date).getDay()];
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return (aStart < bEnd) && (bStart < aEnd);
}

function getCalendarClient(tokens) {
  if (!tokens) return null;
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'
  );
  oAuth2Client.setCredentials(tokens);
  return google.calendar({ version: 'v3', auth: oAuth2Client });
}

async function insertGoogleEvent(tokens, body) {
  try {
    const cal = getCalendarClient(tokens);
    if (!cal) return null;
    const resp = await cal.events.insert({ calendarId: 'primary', requestBody: body });
    return resp.data;
  } catch (_) { return null; }
}

// Providers
router.get('/api/providers', (req, res) => {
  const providers = readJsonSafe(providersPath, []);
  res.json({ ok: true, providers });
});
router.get('/api/providers/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const providers = readJsonSafe(providersPath, []);
  const filtered = providers.filter(p => p.name.toLowerCase().includes(q) || (p.specialty||'').toLowerCase().includes(q));
  res.json({ ok: true, providers: filtered });
});

// Suggest available slots for provider on/after a date
router.post('/api/appointments/suggest', (req, res) => {
  const { providerId, date, durationMinutes = 30 } = req.body || {};
  const providers = readJsonSafe(providersPath, []);
  const prov = providers.find(p => p.id === providerId);
  if (!prov) return res.status(404).json({ ok: false, error: 'provider_not_found' });
  const startDate = date ? new Date(date) : new Date();
  const existing = listAppointments().filter(a => a.providerId === providerId);
  const slots = [];
  for (let dayOffset = 0; dayOffset < 14 && slots.length < 8; dayOffset++) {
    const d = new Date(startDate.getTime() + dayOffset*86400000);
    const key = weekdayKey(d);
    const windows = prov.availability[key] || [];
    windows.forEach(win => {
      const [from, to] = win.split('-');
      const f = parseTimeStr(from); const t = parseTimeStr(to);
      // set to chosen date
      f.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
      t.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
      for (let cur = new Date(f); cur < t; cur = new Date(cur.getTime() + durationMinutes*60000)) {
        const end = new Date(cur.getTime() + durationMinutes*60000);
        const conflict = existing.some(a => overlaps(cur, end, new Date(a.start), new Date(a.end)));
        if (!conflict && end <= t) slots.push({ start: cur.toISOString(), end: end.toISOString() });
        if (slots.length >= 8) break;
      }
    });
  }
  res.json({ ok: true, slots });
});

// CRUD appointments
router.get('/api/appointments', (req, res) => {
  res.json({ ok: true, appointments: listAppointments() });
});

router.post('/api/appointments', async (req, res) => {
  const { title, start, end, providerId, location, reason, details, addToCalendar = true } = req.body || {};
  if (!title || !start || !end) return res.status(400).json({ ok: false, error: 'missing_fields' });
  const appts = listAppointments();
  // conflict check if provider assigned
  if (providerId) {
    const conflict = appts.some(a => a.providerId === providerId && overlaps(new Date(start), new Date(end), new Date(a.start), new Date(a.end)));
    if (conflict) return res.status(409).json({ ok: false, error: 'provider_conflict' });
  }
  const id = 'a_' + Date.now().toString(36);
  const record = { id, title, start, end, providerId: providerId || null, location: location || '', reason: reason || '', details: details || '' };
  appts.push(record);
  saveAppointments(appts);
  // Add to Google Calendar if connected
  if (addToCalendar) {
    const tokens = readJsonSafe(calendarTokenPath, {})['demo-user']; // simple default uid
    await insertGoogleEvent(tokens, { summary: title, location, description: details || reason, start: { dateTime: new Date(start).toISOString() }, end: { dateTime: new Date(end).toISOString() } });
  }
  res.json({ ok: true, appointment: record });
});

router.patch('/api/appointments/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body || {};
  const appts = listAppointments();
  const idx = appts.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'not_found' });
  // conflict check when changing time or provider
  const existing = appts[idx];
  const next = { ...existing, ...updates };
  if (next.providerId) {
    const conflict = appts.some(a => a.id !== id && a.providerId === next.providerId && overlaps(new Date(next.start), new Date(next.end), new Date(a.start), new Date(a.end)));
    if (conflict) return res.status(409).json({ ok: false, error: 'provider_conflict' });
  }
  appts[idx] = next;
  saveAppointments(appts);
  res.json({ ok: true, appointment: next });
});

router.delete('/api/appointments/:id', (req, res) => {
  const id = req.params.id;
  const appts = listAppointments();
  const idx = appts.findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ ok: false, error: 'not_found' });
  appts.splice(idx, 1);
  saveAppointments(appts);
  res.json({ ok: true });
});

module.exports = router;
