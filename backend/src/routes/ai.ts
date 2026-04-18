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

    const result = await callLLM('mistral', prompt, formStructure, {
      temperature: 0.0,
      top_p: 0.1,
      num_ctx: 10240,
      num_predict: 512,
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
    const prompt = analyzeImagePrompt(formStructure, language);

    const imageResult = await callLLM('gemma3:12b', prompt, '', {
      temperature: 0.0,
      top_p: 0.2,
      num_ctx: 16384,
      num_predict: 1024,
      images: [b64]
    });
    const result = await callLLM('mistral', analyzeTextPrompt(imageResult, formStructure, language), JSON.parse(formStructure), {
      temperature: 0.0,
      top_p: 0.1,
      num_ctx: 10240,
      num_predict: 512,
    });

    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
