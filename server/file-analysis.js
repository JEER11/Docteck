const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const Tesseract = require('tesseract.js');
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
require('dotenv').config();

const router = express.Router();
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
          role: 'user',
          content: [
            { type: 'text', text: 'Describe this image in 3-5 concise sentences with any medically relevant details. If text is visible, include it briefly.' },
            { type: 'image_url', image_url: { url: dataUrl } }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 300,
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

// Main file analysis endpoint
router.post('/api/analyze-file', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded.' });
  let result = {};
  try {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/')) {
      result.type = 'image';
      const [ocr, caption] = await Promise.all([
        ocrImage(file.path),
        captionImage(file.path)
      ]);
      result.ocr = ocr;
      result.caption = caption;
    } else if (file.mimetype.startsWith('audio/')) {
      result.type = 'audio';
      result.transcript = await transcribeAudio(file.path);
    } else if (file.mimetype.startsWith('video/')) {
      result.type = 'video';
      result.transcript = await transcribeVideo(file.path);
    } else if (['.txt', '.md', '.csv', '.json', '.xml', '.html', '.js', '.py', '.java', '.c', '.cpp', '.ts', '.tsx'].includes(ext)) {
      result.type = 'text';
      result.content = readTextFile(file.path);
    } else {
      result.type = 'other';
      result.info = 'File type not supported for analysis.';
    }
    try { fs.unlinkSync(file.path); } catch (_) {}
    res.json(result);
  } catch (err) {
    try { fs.unlinkSync(file.path); } catch (_) {}
    res.status(500).json({ error: 'File analysis failed.', details: err.message });
  }
});

module.exports = router;
