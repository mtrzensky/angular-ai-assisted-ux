import { AppLanguage, DEFAULT_LANGUAGE } from "../i18n";

const WHISPER_URL = process.env.WHISPER_URL || "http://localhost:8000";
const WHISPER_MODEL = process.env.WHISPER_MODEL || "Systran/faster-whisper-small";
const WHISPER_LANGUAGE_FALLBACK: AppLanguage = (process.env.WHISPER_LANGUAGE as AppLanguage) || DEFAULT_LANGUAGE;

let modelReady: Promise<void> | null = null;

function postTranscription(audio: Buffer, filename: string, mimeType: string, language: AppLanguage) {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(audio)], { type: mimeType }), filename);
  form.append("model", WHISPER_MODEL);
  form.append("language", language);
  form.append("response_format", "json");
  return fetch(`${WHISPER_URL}/v1/audio/transcriptions`, { method: "POST", body: form });
}

async function pullModel(): Promise<void> {
  console.log(`[whisper] pulling model '${WHISPER_MODEL}' (first-run setup, may take a while)...`);
  const res = await fetch(`${WHISPER_URL}/v1/models/${encodeURIComponent(WHISPER_MODEL)}`, { method: "POST" });
  if (!res.ok && res.status !== 409) {
    const body = await res.text().catch(() => "");
    throw new Error(`Whisper model pull failed ${res.status}: ${body}`);
  }
  console.log(`[whisper] model '${WHISPER_MODEL}' is ready.`);
}

export function ensureWhisperModel(): Promise<void> {
  if (!modelReady) {
    modelReady = pullModel().catch((err) => {
      modelReady = null;
      throw err;
    });
  }
  return modelReady;
}

/**
 * Sends an audio buffer to a local OpenAI-compatible Whisper server
 * (e.g. speaches-ai/speaches / faster-whisper-server) and returns the
 * transcribed text. If the model is not yet installed on the Whisper
 * server, it is auto-pulled on first use.
 */
export async function transcribeAudio(
  audio: Buffer,
  filename: string,
  mimeType: string,
  language: AppLanguage = WHISPER_LANGUAGE_FALLBACK
): Promise<string> {
  let res = await postTranscription(audio, filename, mimeType, language);

  if (res.status === 404) {
    const body = await res.text();
    if (body.includes("not installed") || body.includes(WHISPER_MODEL)) {
      await ensureWhisperModel();
      res = await postTranscription(audio, filename, mimeType, language);
    } else {
      throw new Error(`Whisper error 404: ${body}`);
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Whisper error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as { text: string };
  console.log(`----- whisper RESPONSE (${language}) -----`);
  console.log(json.text);
  console.log(`\n\n`);

  return (json.text || "").trim();
}
