
# Whisper Transcription App (Deepgram Version)

This is a full-stack audio transcription app using:
✅ **Frontend** → React (Vite)  
✅ **Backend** → Node.js + Express + Deepgram API

It allows users to upload an audio file, send it to the backend, and get back the transcribed text.

---

## 📁 Project Structure

```
/frontend     → React app (Vite)
└── src       → React components

/backend      → Express server
└── routes    → API routes
└── models    → API clients
```

---

## 🛠 Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://your-repo-url.git
cd whisper-transcription-app
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

✅ Create a `.env` file in `/backend`:
```
DEEPGRAM_API_KEY=your-deepgram-api-key
PORT=5000
```

✅ Run the backend:
```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

✅ Start the React app:
```bash
npm run dev
```

---

## 🔗 API Usage

- **POST** `/api/transcribe`
    - `FormData` with an `audio` file.
    - Returns: `{ transcript: "..." }`

Example curl:
```bash
curl -X POST http://localhost:5000/api/transcribe   -F "audio=@/path/to/your/audiofile.mp3"
```

---

## 🌍 Deployment

You can deploy:
- **Frontend** → Vercel, Netlify
- **Backend** → Render, Railway, Heroku, or any Node.js server

Make sure to update your frontend `API_URL` to point to the deployed backend!

---

## 📦 Tech Stack

- React + Vite
- Express.js
- Deepgram Speech-to-Text API
- Multer (file upload)

---

## ✨ Features

- Upload audio files (.mp3, .wav, etc.)
- Transcribe speech to text using Deepgram
- Show the transcription result on the frontend

---

## 💡 Future Improvements

- Add loading spinners and error handling
- Support multiple languages
- Store transcriptions in a database
- User authentication & history
