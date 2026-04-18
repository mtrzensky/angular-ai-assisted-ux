import { JSONSchema7 } from "json-schema";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

export type OllamaModelOptions = {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  min_p?: number;
  typical_p?: number;
  repeat_last_n?: number;
  repeat_penalty?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  penalize_newline?: boolean;
  stop?: string[];
  seed?: number;
  num_ctx?: number;
  num_predict?: number;
  num_batch?: number;
  num_gpu?: number;
  main_gpu?: number;
  num_thread?: number;
  num_keep?: number;
  numa?: boolean;
  use_mmap?: boolean;
};

export type CallLLMParams = {
  images?: string[];
  system?: string;
  think?: boolean;
  keep_alive?: string | number;
  raw?: boolean;
  suffix?: string;
  options?: OllamaModelOptions;
};

export async function callLLM(
  model: string,
  prompt: string,
  format: string | JSONSchema7 = "",
  params: CallLLMParams = {}
): Promise<string> {
  if (typeof prompt !== "string") {
    throw new Error(`Ollama requires "prompt" to be a string. Got: ${typeof prompt}`);
  }

  const { options, ...topLevel } = params;

  const body: Record<string, unknown> = {
    model,
    prompt,
    stream: false,
    ...topLevel,
  };
  if (format) body.format = format;
  if (options) body.options = options;

  const res = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error ${res.status}: ${text}`);
  }

  console.log(`----- ${model} RESPONSE -----`);
  const ollamaJsonResult = await res.json();
  console.log(ollamaJsonResult.response);
  console.log(`\n\n`);

  return ollamaJsonResult.response;
}
