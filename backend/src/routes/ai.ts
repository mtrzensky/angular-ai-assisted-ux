import express from "express";
import upload from "../middleware/upload";
import { callLLM } from "../llm/llmClient";
import { analyzeImagePrompt } from "../prompts/analyze-image";
import { analyzeTextPrompt } from "../prompts/analyze-text";

const router = express.Router();

router.post("/analyze-text", async (req, res) => {
  try {
    const { text, formStructure } = req.body;
    if (!text || !formStructure) return res.status(400).json({ error: "text required" });

    const prompt = analyzeTextPrompt(text, formStructure);

    const result = await callLLM('mistral', prompt, {
      temperature: 0.0,
      top_p: 0.2,
      num_predict: 400,
      format: 'json',
    });

    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    const formStructure = req.body.formStructure;

    if (!req.file) return res.status(400).json({ error: "image required" });
    if (!formStructure) return res.status(400).json({ error: "formStructure required" });

    const b64 = req.file.buffer.toString("base64");
    const prompt = analyzeImagePrompt(formStructure);

    const imageResult = await callLLM('gemma3:12b', prompt, { 
      temperature: 0.0,
      top_p: 0.1,
      num_predict: 400, 
      images: [b64]
    });
    const result = await callLLM('mistral', analyzeTextPrompt(imageResult, formStructure), {
      temperature: 0.0,
      top_p: 0.2,
      num_predict: 400,
      format: 'json'
    });

    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
