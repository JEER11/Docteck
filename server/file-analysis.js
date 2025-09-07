const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const Tesseract = require('tesseract.js');
const ffmpeg = require('fluent-ffmpeg');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
let pdfParse;
try {
  pdfParse = require('pdf-parse');
} catch (_) {
  pdfParse = null; // installed at runtime; handle gracefully if missing
}
// Use packaged ffmpeg/ffprobe binaries for portability
try {
  const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
  if (ffmpegInstaller && ffmpegInstaller.path) {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
  }
} catch (_) { /* optional */ }
try {
  const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
  if (ffprobeInstaller && ffprobeInstaller.path) {
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
  }
} catch (_) { /* optional */ }
const { exec } = require('child_process');
require('dotenv').config();

const router = express.Router();
// Use .any() so we can parse multipart fields even when no file is attached (URL-only analysis)
const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: Transcribe audio using OpenAI Whisper
async function transcribeAudio(filePath) {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-1',
      // language: 'en', // optionally set
      response_format: 'json'
    });
    // SDK v4 returns object with .text when response_format json
    return transcription.text || '';
  } catch (e) {
    console.error('Audio transcription failed:', e.message);
    return 'Transcription unavailable (error during processing).';
  }
}

// Helper: Extract audio from video and transcribe
async function transcribeVideo(filePath) {
  const audioPath = filePath + '.wav';
  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .output(audioPath)
      .on('end', async () => {
        try {
          const transcript = await transcribeAudio(audioPath);
          try { fs.unlinkSync(audioPath); } catch (_) {}
          resolve(transcript);
        } catch (err) {
          try { fs.unlinkSync(audioPath); } catch (_) {}
          resolve('Transcription unavailable (video processing error).');
        }
      })
      .on('error', (err) => {
        console.error('ffmpeg error:', err.message);
        resolve('Transcription unavailable (ffmpeg error).');
      })
      .run();
  });
}

// Helper: OCR for images
async function ocrImage(filePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text;
  } catch (e) {
    console.error('OCR failed:', e.message);
    return '';
  }
}

// Helper: Caption/describe image using OpenAI vision
async function captionImage(filePath) {
  try {
    const mime = {
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.bmp': 'image/bmp', '.heic': 'image/heic'
    }[path.extname(filePath).toLowerCase()] || 'image/jpeg';
    const base64 = fs.readFileSync(filePath, { encoding: 'base64' });
    const dataUrl = `data:${mime};base64,${base64}`;
  const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: [
                'You are a medical triage assistant (not a doctor). Analyze images for visible health/injury findings and give safe, concise guidance.',
                '- Do NOT identify people or infer demographics. Do NOT provide definitive diagnoses.',
                '- Focus on: cuts/lacerations, bruises/hematomas, swelling, redness, rashes, discoloration, bleeding level, infection signs (warmth, spreading redness, pus, streaking).',
                '- For bruises, estimate color category (red, purple/blue, green, yellow/brown) and what that may suggest about healing stage (approximate only).',
                '- Provide: 1) What you see, 2) Likely severity (rough), 3) Home-care steps, 4) Red flags that require urgent care, 5) When to see a clinician.',
                '- Keep output to 4–8 bullet points plus a one-line disclaimer. Avoid long paragraphs. Avoid echoing long text from the image; summarize only.'
              ].join('\n')
            }
          ]
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: [
              'Analyze this image for medically relevant details.',
              'If applicable, describe: injury type (e.g., cut, bruise, rash), approximate size/location if visible, color/stage for bruises (red/purple/blue/green/yellow/brown), swelling, redness, bleeding, and infection indicators.',
              'Then give concise: home care steps (e.g., clean, bandage, cold/warm compress timing), when to monitor vs seek care, and emergency red flags.',
              'If text exists in the image (labels/packaging), include a brief 1-line summary only.'
            ].join(' ')} ,
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ],
      temperature: 0.2,
  max_tokens: 450,
    });
    return completion.choices?.[0]?.message?.content || '';
  } catch (e) {
    console.error('Image caption failed:', e.message);
    return '';
  }
}

// Helper: Read text from file
function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// Helper: Download remote URL to a temp file and return the path + detected content-type
async function downloadToTemp(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  const res = await fetch(url, { redirect: 'follow', signal: controller.signal }).finally(() => clearTimeout(t));
  if (!res.ok) throw new Error(`Failed to fetch url: ${res.status}`);
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  // If it's an HTML page, don't download as a file. Signal caller to scrape instead.
  if (ct.includes('text/html')) {
    throw new Error('html-page');
  }
  const extMap = {
    'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif', 'image/bmp': '.bmp', 'image/heic': '.heic',
    'application/pdf': '.pdf',
    'audio/mpeg': '.mp3', 'audio/wav': '.wav', 'audio/ogg': '.ogg', 'audio/mp4': '.m4a',
    'video/mp4': '.mp4', 'video/webm': '.webm', 'video/quicktime': '.mov'
  };
  const guessedExt = extMap[ct] || path.extname(new URL(url).pathname) || '';
  const fileName = `url_${Date.now()}_${Math.random().toString(36).slice(2)}${guessedExt}`;
  const tempPath = path.join('uploads', fileName);
  await new Promise((resolve, reject) => {
    const out = fs.createWriteStream(tempPath);
    res.body.pipe(out);
    res.body.on('error', reject);
    out.on('finish', resolve);
  });
  return { path: tempPath, contentType: ct };
}

// Helper: Scrape basic readable text from an HTML page
async function fetchHtmlText(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  const res = await fetch(url, { redirect: 'follow', signal: controller.signal }).finally(() => clearTimeout(t));
  if (!res.ok) throw new Error(`Failed to fetch page: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  // Remove script/style/nav/aside/footer and common boilerplate
  $('script, style, nav, aside, footer, noscript, svg, header, form').remove();
  // Strip common GitHub/SPA chrome elements
  $('[id^="desktop-menu"], [id^="sidebar"], [class*="Header"], [class*="flash"], [class*="toast"], [class*="Banner"], [class*="notification"], [class*="cookie"], [class*="modal"], [role="alert"], [role="navigation"], [role="menu"]').remove();
  const title = ($('title').first().text() || '').trim();
  const description = ($('meta[name="description"]').attr('content') || '').trim();
  // Gather main content blocks and filter out very short/boilerplate snippets
  const blocks = [];
  $('main, article, section, h1, h2, h3, p, li').each((_, el) => {
    const tx = $(el).text().replace(/\s+/g, ' ').trim();
    if (tx && tx.length >= 40 && !/^Skip to content/i.test(tx) && !/Reload to refresh your session/i.test(tx)) {
      blocks.push(tx);
    }
  });
  // Deduplicate and select top content chunks by length (limited)
  const unique = Array.from(new Set(blocks));
  const top = unique.sort((a,b)=>b.length-a.length).slice(0, 12);
  const text = top.join('\n');
  return { title, description, text };
}

// Main file analysis endpoint
router.post('/api/analyze-file', upload.any(), async (req, res) => {
  // Support analyzing a URL if provided
  const url = (req.body && (req.body.url || req.body.link)) ? String(req.body.url || req.body.link).trim() : '';
  // When using upload.any(), multer does not set req.file; prefer first file if present
  let file = req.file || (Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : undefined);
  let tempDownloadPath = null;
  let tempDownloadType = '';
  try {
    if (!file && url) {
      try {
        const dl = await downloadToTemp(url);
        tempDownloadPath = dl.path;
        tempDownloadType = dl.contentType;
        // Create a faux multer file-like object for reuse of pipeline
        file = {
          path: tempDownloadPath,
          mimetype: tempDownloadType || 'application/octet-stream',
          originalname: path.basename(tempDownloadPath)
        };
      } catch (e) {
        // If it's an HTML page, scrape text
        try {
          const page = await fetchHtmlText(url);
          return res.json({ type: 'url', url, page });
        } catch (e2) {
          return res.status(400).json({ error: 'url_fetch_failed', details: e2.message });
        }
      }
    }

    if (!file) return res.status(400).json({ error: 'No file uploaded.' });
    let result = {};
    const ext = (file.originalname ? path.extname(file.originalname) : path.extname(file.path)).toLowerCase();

    if ((file.mimetype || '').startsWith('image/')) {
      result.type = 'image';
      const [ocr, caption] = await Promise.all([
        ocrImage(file.path),
        captionImage(file.path)
      ]);
      result.ocr = ocr;
      result.caption = caption;
    } else if ((file.mimetype || '').startsWith('audio/')) {
      result.type = 'audio';
      result.transcript = await transcribeAudio(file.path);
    } else if ((file.mimetype || '').startsWith('video/')) {
      result.type = 'video';
      result.transcript = await transcribeVideo(file.path);
    } else if (ext === '.pdf' || (file.mimetype === 'application/pdf')) {
      result.type = 'pdf';
      if (pdfParse) {
        try {
          const buff = fs.readFileSync(file.path);
          const parsed = await pdfParse(buff);
          result.content = (parsed.text || '').trim();
          result.numpages = parsed.numpages || undefined;
          result.info = parsed.info || undefined;
        } catch (e) {
          console.error('PDF parse failed:', e.message);
          result.content = '';
          result.info = 'Unable to extract text. (If this is a scanned PDF, OCR is not yet enabled.)';
        }
      } else {
        result.info = 'PDF parsing module not installed. Please run npm install in server folder.';
      }
    } else if (['.txt', '.md', '.csv', '.json', '.xml', '.html', '.htm', '.js', '.py', '.java', '.c', '.cpp', '.ts', '.tsx'].includes(ext)) {
      result.type = 'text';
      result.content = readTextFile(file.path);
    } else {
      result.type = 'other';
      result.info = 'File type not supported for analysis.';
    }
    try { fs.unlinkSync(file.path); } catch (_) {}
    res.json(result);
  } catch (err) {
    try { if (file && file.path) fs.unlinkSync(file.path); } catch (_) {}
    res.status(500).json({ error: 'File analysis failed.', details: err.message });
  }
});

module.exports = router;
