import type { OllamaModelOptions } from "./llmClient";

export const LLM_MODEL = "qwen3.5:9b";

const DETERMINISTIC_BASE: OllamaModelOptions = {
  temperature: 0.0,
  top_p: 1.0,
  top_k: 1,
  seed: 42,
  repeat_penalty: 1.0,
  num_predict: 512,
};

export const TEXT_ANALYSIS_OPTIONS: OllamaModelOptions = {
  ...DETERMINISTIC_BASE,
  num_ctx: 4096,
};

export const IMAGE_ANALYSIS_OPTIONS: OllamaModelOptions = {
  ...DETERMINISTIC_BASE,
  num_ctx: 8192,
};
