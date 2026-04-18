import express, { Request, Response, RequestHandler } from "express";
import upload from "../middleware/upload";
import { callLLM } from "../llm/llmClient";
import { transcribeAudio } from "../llm/whisperClient";
import { IMAGE_ANALYSIS_OPTIONS, LLM_MODEL, TEXT_ANALYSIS_OPTIONS } from "../llm/options";
import { analyzeImagePrompt } from "../prompts/analyze-image";
import { analyzeTextPrompt } from "../prompts/analyze-text";
import { AppLanguage, resolveLanguage, t } from "../i18n";

const router = express.Router();

type LocalizedHandler = (req: Request, res: Response, language: AppLanguage) => Promise<unknown>;

const handle = (fn: LocalizedHandler): RequestHandler => async (req, res) => {
  const language = resolveLanguage(req.body?.language);
  try {
    await fn(req, res, language);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

router.post(
  "/transcribe-audio",
  upload.single("audio"),
  handle(async (req, res, language) => {
    if (!req.file) return res.status(400).json({ error: t(language, "audioRequired") });

    const text = await transcribeAudio(
      req.file.buffer,
      req.file.originalname || "audio.webm",
      req.file.mimetype || "audio/webm",
      language
    );

    res.json({ text });
  })
);

router.post(
  "/analyze-text",
  handle(async (req, res, language) => {
    const { text, formStructure } = req.body;
    if (!text || !formStructure) return res.status(400).json({ error: t(language, "textRequired") });

    const prompt = analyzeTextPrompt(text, formStructure, language);
    const result = await callLLM(LLM_MODEL, prompt, formStructure, {
      think: false,
      options: TEXT_ANALYSIS_OPTIONS,
    });

    res.json({ parsed: JSON.parse(result) });
  })
);

router.post(
  "/analyze-image",
  upload.single("image"),
  handle(async (req, res, language) => {
    const formStructure = req.body.formStructure;
    if (!req.file) return res.status(400).json({ error: t(language, "imageRequired") });
    if (!formStructure) return res.status(400).json({ error: t(language, "formStructureRequired") });

    const parsedFormStructure = JSON.parse(formStructure);
    const prompt = analyzeImagePrompt(parsedFormStructure, language);
    const result = await callLLM(LLM_MODEL, prompt, parsedFormStructure, {
      images: [req.file.buffer.toString("base64")],
      think: false,
      options: IMAGE_ANALYSIS_OPTIONS,
    });

    res.json({ parsed: JSON.parse(result) });
  })
);

export default router;
