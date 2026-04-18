import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai";
import { ensureWhisperModel } from "./llm/whisperClient";

dotenv.config();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:4200")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10mb" }));
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);

  ensureWhisperModel().catch((err) => {
    console.warn(`[whisper] model could not be pre-pulled: ${err.message}`);
    console.warn(`[whisper] will retry on the first transcription request.`);
  });
});
