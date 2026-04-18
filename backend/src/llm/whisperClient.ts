const WHISPER_URL = process.env.WHISPER_URL || "http://localhost:8000";
const WHISPER_MODEL = process.env.WHISPER_MODEL || "Systran/faster-whisper-small";
const WHISPER_LANGUAGE = process.env.WHISPER_LANGUAGE || "de";

/**
 * Sends an audio buffer to a local OpenAI-compatible Whisper server
 * (e.g. speaches-ai/speaches / faster-whisper-server) and returns the
 * transcribed text.
 */
export async function transcribeAudio(
  audio: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(audio)], { type: mimeType }), filename);
  form.append("model", WHISPER_MODEL);
  form.append("language", WHISPER_LANGUAGE);
  form.append("response_format", "json");

  const res = await fetch(`${WHISPER_URL}/v1/audio/transcriptions`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Whisper error ${res.status}: ${text}`);
  }

  const json = (await res.json()) as { text: string };
  console.log(`----- whisper RESPONSE -----`);
  console.log(json.text);
  console.log(`\n\n`);

  return (json.text || "").trim();
}
