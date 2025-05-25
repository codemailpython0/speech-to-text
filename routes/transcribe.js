import express from 'express';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config(); // Load environment variables

const router = express.Router();
const uploadsDir = path.join(process.cwd(), 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// POST /api/transcribe
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  const audioPath = req.file.path;
  const originalName = req.file.originalname;
  const apiKey = process.env.DEEPGRAM_API_KEY;

  try {
    const audioBuffer = fs.readFileSync(audioPath);

    const response = await axios.post(
      'https://api.deepgram.com/v1/listen',
      audioBuffer,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          'Content-Type': 'audio/wav',
        },
      }
    );

    const transcript = response.data.results.channels[0].alternatives[0].transcript;

    const transcriptPath = audioPath + '.txt';
    fs.writeFileSync(transcriptPath, transcript, 'utf-8');

    // ✅ Save to Supabase with error logging
    const { error } = await supabase.from('transcriptions').insert([
      {
        filename: originalName,
        transcript: transcript, // 🔁 use 'text' if your column name is 'text'
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error); // 👈 log error if insert fails
    }

    res.json({ text: transcript });
  } catch (error) {
    console.error('Transcription error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// GET /api/history
router.get('/history', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transcriptions')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Fetch history error:', err.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
