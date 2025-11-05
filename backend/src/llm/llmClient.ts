import { JSONSchema7 } from "json-schema";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

/**
 * Calls a locally running Ollama model with the given prompt.
 * @param model Name of the ollama model, e.g. "llama3", "mistral", "codellama"
 * @param prompt The text prompt you want to send
 * @param format The format of the output
 * @param options Additional options (e.g. temperature, max tokens, etc.)
 */
export async function callLLM(model: string, prompt: string | JSONSchema7 = '', format: string, options: Record<string, any> = {}): Promise<string> {
  if (typeof prompt !== "string") {
    throw new Error(`Ollama requires "prompt" to be a string. Got: ${typeof prompt}`);
  }

  const body = {
    model,
    prompt,
    stream: false,
    format,
    ...options
  };

  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  console.log(`----- ${model} RESPONSE -----`);
  const ollamaJsonResult = await res.json();
  console.log(ollamaJsonResult.response);

  return ollamaJsonResult.response;
}