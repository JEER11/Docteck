const express = require('express');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const fetch = require('node-fetch');

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

// Save a provider into local store (e.g., from external search)
router.post('/api/providers', (req, res) => {
  try {
    const incoming = req.body || {};
    const providers = readJsonSafe(providersPath, []);
    // De-dupe by NPI if provided
    if (incoming.npi) {
      const existing = providers.find(p => String(p.npi) === String(incoming.npi));
      if (existing) return res.json({ ok: true, provider: existing, saved: false });
    }
    const id = incoming.id || (incoming.npi ? `npi-${incoming.npi}` : 'p_' + Date.now().toString(36));
    const record = {
      id,
      name: incoming.name || 'Provider',
      specialty: incoming.specialty || incoming.taxonomy || '',
      location: incoming.location || '',
      phone: incoming.phone || '',
      npi: incoming.npi || null,
      source: incoming.source || 'local',
      address: incoming.address || undefined,
      city: incoming.city || undefined,
      state: incoming.state || undefined,
      postal_code: incoming.postal_code || undefined,
    };
    providers.push(record);
    writeJsonSafe(providersPath, providers);
    res.json({ ok: true, provider: record, saved: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'save_failed' });
  }
});

// Real US provider search via NPI Registry (public API)
// Docs: https://npiregistry.cms.hhs.gov/api/
router.get('/api/providers/real-search', async (req, res) => {
  try {
    const { q = '', city = '', state = '', zip = '', taxonomy = '', limit = '20' } = req.query || {};
    let first = '', last = '', taxonomyDesc = taxonomy;
    const trimmed = String(q || '').trim();
    if (trimmed.includes(' ')) {
      const parts = trimmed.split(/\s+/);
      first = parts[0];
      last = parts.slice(1).join(' ');
    } else if (trimmed) {
      taxonomyDesc = trimmed; // treat single word as specialty
    }
    const params = new URLSearchParams();
    params.set('version', '2.1');
    params.set('limit', String(Math.min(Number(limit) || 20, 50)));
    // Prefer individual providers
    // params.set('enumeration_type', 'NPI-1'); // allow both types by default
    if (first) params.set('first_name', first);
    if (last) params.set('last_name', last);
    if (taxonomyDesc) params.set('taxonomy_description', taxonomyDesc);
    if (city) params.set('city', city);
    if (state) params.set('state', state);
    if (zip) params.set('postal_code', zip);
    params.set('country_code', 'US');
    const url = `https://npiregistry.cms.hhs.gov/api/?${params.toString()}`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'Docteck/1.0 (+https://docteck.local)' } });
    if (!resp.ok) {
      return res.status(502).json({ ok: false, error: 'upstream_error' });
    }
    const data = await resp.json();
    const results = (data.results || []).map(r => {
      const basic = r.basic || {};
      const tax = Array.isArray(r.taxonomies) && r.taxonomies.length ? r.taxonomies[0] : {};
      const addresses = Array.isArray(r.addresses) ? r.addresses : [];
      const loc = addresses.find(a => a.address_purpose === 'LOCATION') || addresses[0] || {};
      const name = [basic.first_name, basic.last_name].filter(Boolean).join(' ') || basic.organization_name || basic.name || '';
      const address1 = [loc.address_1, loc.address_2].filter(Boolean).join(', ');
      const location = [address1, [loc.city, loc.state].filter(Boolean).join(', '), loc.postal_code].filter(Boolean).join(' • ');
      return {
        id: `npi-${r.number}`,
        npi: r.number,
        name,
        specialty: tax.desc || '',
        taxonomy: tax.desc || '',
        phone: loc.telephone_number || '',
        address: address1 || undefined,
        city: loc.city || undefined,
        state: loc.state || undefined,
        postal_code: loc.postal_code || undefined,
        location,
        source: 'npi',
      };
    });
    res.json({ ok: true, providers: results, total: data.result_count || results.length, source: 'npi' });
  } catch (e) {
    console.error('real-search failed', e);
    res.status(500).json({ ok: false, error: 'search_failed' });
  }
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
