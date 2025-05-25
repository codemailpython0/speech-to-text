import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import supabase from "../models/supabaseClient.js";


export const transcribeAudio = async (req, res) => {
  const audioPath = path.resolve(req.file.path);
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioPath));
    formData.append("model", "whisper-1");

    const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const { data, error } = await supabase
      .from("transcriptions")
      .insert([{ filename: req.file.originalname, text: response.data.text }]);

    fs.unlinkSync(audioPath);
    res.json({ text: response.data.text });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
};

export const getAllTranscriptions = async (req, res) => {
  const { data, error } = await supabase.from("transcriptions").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
