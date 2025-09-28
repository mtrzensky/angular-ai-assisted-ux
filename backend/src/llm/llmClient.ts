import fetch from "node-fetch";

const LLM_URL = process.env.LLM_URL || "http://localhost:11434";

export async function callLLM(prompt: string, options: any = {}) {
  const body = { prompt, ...options };
  const res = await fetch(`${LLM_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`LLM error: ${res.status}`);
  return res.json();
}