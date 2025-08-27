const express = require('express');
const { google } = require('googleapis');
const ical = require('node-ical');
const fs = require('fs');
const path = require('path');
// Ensure env vars are loaded from root .env first, then server/.env as fallback
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config({ path: path.join(__dirname, '.env') });
const router = express.Router();

// Token persistence (simple JSON on disk for demo)
const storeDir = path.join(__dirname, 'uploads');
const tokenPath = path.join(storeDir, 'calendar-tokens.json');
const icalPath = path.join(storeDir, 'ical-urls.json');
if (!fs.existsSync(storeDir)) fs.mkdirSync(storeDir, { recursive: true });
function readJsonSafe(p) { try { if (!fs.existsSync(p)) return {}; return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch (_) { return {}; } }
function writeJsonSafe(p, obj) { try { fs.writeFileSync(p, JSON.stringify(obj, null, 2)); } catch (_) {} }
function getUid(req) { return (req.headers['x-user-id'] || req.query.uid || 'demo-user'); }
let userCalendarTokens = readJsonSafe(tokenPath);
let userICalUrls = readJsonSafe(icalPath);

// Google OAuth2 setup
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Step 1: Start Google OAuth
router.get('/api/auth/google', (req, res) => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).send('Google OAuth not configured (missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET)');
  }
  const uid = getUid(req);
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
  'https://www.googleapis.com/auth/calendar',
      'profile',
      'email',
    ],
    state: encodeURIComponent(JSON.stringify({ uid }))
  });
  res.redirect(url);
});

// Step 2: Google OAuth callback
router.get('/api/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  let uid = 'demo-user';
  if (req.query.state) {
    try { uid = JSON.parse(decodeURIComponent(req.query.state)).uid || uid; } catch (_) {}
  }
  if (!code) return res.status(400).send('No code provided');
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    userCalendarTokens[uid] = tokens;
    writeJsonSafe(tokenPath, userCalendarTokens);
    // Redirect to oauth-success page and signal success
    res.redirect('/calendar/oauth-success.html?connected=1');
  } catch (err) {
    res.status(500).send('OAuth error');
  }
});

// Step 2b: Handle POST from popup with code or accessToken
router.post('/api/auth/google/callback', async (req, res) => {
  const { code, accessToken, uid: bodyUid } = req.body || {};
  const uid = bodyUid || getUid(req);
  if (code) {
    try {
      const { tokens } = await oAuth2Client.getToken(code);
      userCalendarTokens[uid] = tokens;
      writeJsonSafe(tokenPath, userCalendarTokens);
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'OAuth error' });
    }
  } else if (accessToken) {
    userCalendarTokens[uid] = { access_token: accessToken };
    writeJsonSafe(tokenPath, userCalendarTokens);
    return res.json({ success: true });
  }
  return res.status(400).json({ error: 'No code or access token provided' });
});

// Save iCal URL
router.post('/api/connect/ical', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No URL provided' });
  const uid = getUid(req);
  userICalUrls[uid] = url;
  writeJsonSafe(icalPath, userICalUrls);
  res.json({ success: true });
});

// Fetch Google Calendar events
router.get('/api/calendar/google', async (req, res) => {
  const uid = getUid(req);
  const tokens = userCalendarTokens[uid];
  if (!tokens) return res.json([]);
  oAuth2Client.setCredentials(tokens);
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  try {
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });
    res.json(events.data.items || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Google Calendar events' });
  }
});

// Fetch iCal events
router.get('/api/calendar/ical', async (req, res) => {
  const uid = getUid(req);
  const url = userICalUrls[uid];
  if (!url) return res.json([]);
  try {
    const data = await ical.async.fromURL(url);
    const events = Object.values(data).filter(e => e.type === 'VEVENT');
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch iCal events' });
  }
});

// Connection status for Google Calendar
router.get('/api/calendar/google/status', (req, res) => {
  const uid = getUid(req);
  const connected = Boolean(userCalendarTokens[uid] && (userCalendarTokens[uid].access_token || userCalendarTokens[uid].refresh_token));
  res.json({ connected });
});

// Disconnect Google Calendar
router.delete('/api/calendar/google', (req, res) => {
  const uid = getUid(req);
  if (userCalendarTokens[uid]) {
    delete userCalendarTokens[uid];
    writeJsonSafe(tokenPath, userCalendarTokens);
  }
  res.json({ connected: false });
});

module.exports = router;
