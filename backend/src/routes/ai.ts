import express from "express";
import upload from "../middleware/upload";
import { callLLM } from "../llm/llmClient";
import { analyzeImagePrompt } from "../prompts/analyze-image";
import { analyzeTextPrompt } from "../prompts/analyze-speech";
import { autocompletePrompt } from "../prompts/autocomplete";

const router = express.Router();

router.post("/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const prompt = analyzeTextPrompt(text);

    

    const result = await callLLM('mistral', prompt);
    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "image required" });

    const b64 = req.file.buffer.toString("base64");
    const prompt = analyzeImagePrompt();

    const result = await callLLM('llava:13b', prompt, { images: [b64] });
    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/autocomplete", async (req, res) => {
  try {
    const { field, query, context } = req.body;
    if (!query || query.length < 1) return res.json({ suggestions: [] });

    const prompt = autocompletePrompt(field, query, context);
    const result = await callLLM('mistral', prompt);
    const match = result.match(/\{[\s\S]*\}/);
    let parsed = { suggestions: [] as string[] };
    if (match) {
      parsed = JSON.parse(match[0]);
    } else {
      // naive: split lines
      parsed = { suggestions: result.split("\n").slice(0,10).map(s=>s.trim()).filter(Boolean) };
    }
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
