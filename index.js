import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import transcribeRoutes from "./routes/transcribe.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'  // your React dev server
}));

app.use(express.json());
app.use("/api", transcribeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});
