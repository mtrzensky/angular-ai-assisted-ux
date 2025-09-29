import express from "express";
import upload from "../middleware/upload";
import { callLLM } from "../llm/llmClient";

const router = express.Router();

// 1) Analyze speech transcript or free text to produce JSON to autofill form
router.post("/analyze-text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const prompt = `You receive a spoken or typed input (transcript). Extract structured registration fields as JSON:
Return JSON only, no extra commentary. Fields: firstname, lastname, age, street, city, country, hairColor, notes.

Transcript: ${text}`;

    const result = await callLLM('mistral', prompt);
    res.json({ parsed: JSON.parse(result) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 2) Analyze image and return inferred fields
router.post("/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "image required" });

    // If your LLM supports image inputs, you can send the base64 data,
    // or use a vision model adapter. Here we send base64 to the LLM endpoint.
    const b64 = req.file.buffer.toString("base64");
    const prompt = `You receive a base64-encoded image (as data). Identify visible properties like hairColor, approximate age range, and short descriptive tags. Return JSON only.`;

    const result = await callLLM('bakllava', prompt, { image_base64: b64 });
    const resultObj = result as { output?: string; text?: string };
    const textOut = (resultObj.output ?? resultObj.text) || JSON.stringify(resultObj);
    const jsonMatch = textOut.match(/{[\s\S]*}/);
    let parsed = {};
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      parsed = { notes: textOut };
    }
    res.json({ parsed });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3) Autocomplete: user typed query -> LLM suggests completions
router.post("/autocomplete", async (req, res) => {
  try {
    const { field, query, context } = req.body;
    if (!query || query.length < 1) return res.json({ suggestions: [] });

    const prompt = `You are an assistant that provides autocomplete suggestions for registration field "${field}".
User typed: "${query}".
Context (if any): ${JSON.stringify(context || {})}
Return an array of up to 10 suggestions as JSON: {"suggestions": ["..."]}`;
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
