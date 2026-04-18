import express from "express";
import upload from "../middleware/upload";
import { callLLM } from "../llm/llmClient";
import { transcribeAudio } from "../llm/whisperClient";
import { analyzeImagePrompt } from "../prompts/analyze-image";
import { analyzeTextPrompt } from "../prompts/analyze-text";
import { resolveLanguage, t } from "../i18n";

const router = express.Router();

router.post("/transcribe-audio", upload.single("audio"), async (req, res) => {
  const language = resolveLanguage(req.body?.language);
  try {
    if (!req.file) return res.status(400).json({ error: t(language, "audioRequired") });

    const text = await transcribeAudio(
      req.file.buffer,
      req.file.originalname || "audio.webm",
      req.file.mimetype || "audio/webm",
      language
    );

    res.json({ text });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/analyze-text", async (req, res) => {
  const language = resolveLanguage(req.body?.language);
  try {
    const { text, formStructure } = req.body;
    if (!text || !formStructure) return res.status(400).json({ error: t(language, "textRequired") });

    const prompt = analyzeTextPrompt(text, formStructure, language);

    const result = await callLLM('qwen3.5:9b', prompt, formStructure, {
      think: false,
      options: {
        temperature: 0.0,
        top_p: 1.0,
        top_k: 1,
        seed: 42,
        repeat_penalty: 1.0,
        num_ctx: 4096,
        num_predict: 512,
      },
    });

    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/analyze-image", upload.single("image"), async (req, res) => {
  const language = resolveLanguage(req.body?.language);
  try {
    const formStructure = req.body.formStructure;

    if (!req.file) return res.status(400).json({ error: t(language, "imageRequired") });
    if (!formStructure) return res.status(400).json({ error: t(language, "formStructureRequired") });

    const b64 = req.file.buffer.toString("base64");
    const parsedFormStructure = JSON.parse(formStructure);
    const prompt = analyzeImagePrompt(parsedFormStructure, language);

    const result = await callLLM('qwen3.5:9b', prompt, parsedFormStructure, {
      images: [b64],
      think: false,
      options: {
        temperature: 0.0,
        top_p: 1.0,
        top_k: 1,
        seed: 42,
        repeat_penalty: 1.0,
        num_ctx: 8192,
        num_predict: 512,
      },
    });

    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
