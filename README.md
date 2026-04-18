# Angular and AI-Driven UX: AI assisted User Interactions
This is the demo presented at the NG-DE 2025 Conference in Berlin by Mario Trzensky

## IMPORTANT DISCLAIMER
This demo's purpose is to give you a starting idea on how you could work with LLMs and Angular within a product context, how you can configure it locally and feed it with context data dynamically.
This is not a fully fledged product or repository and should be treated as such. That means that this demo lacks things like
- Anti-Prompt-Injections measures (Like using "system" vs "user" role prompt structure)
- Security in general
- Fully (100%) deterministic results
- Coherent styles and visual design
- Tests
- Instant performance

You are free to use this repository to try and tinker away as you please though! I still believe it is possible with more time to achieve a performant, stable and mostly deterministic solution, if you apply more software fallbacks to it (i.e. JSON validator, "Retry LLM call if output is faulty or not sufficient"). So if you want to fork, clone or copy it, just do it! :)

Voice transcription runs fully locally via a Whisper-compatible HTTP server. The browser's SpeechRecognition API is no longer used; the frontend records audio with the `MediaRecorder` API and the backend forwards the blob to Whisper for on-device transcription.

The UI supports German and English — switch languages with the picker in the header. The selected language is forwarded to Whisper (for transcription) and to the LLM (for natural-language output). All enum values in the form structure stay English so JSON extraction remains stable across locales.

## Stack
- Ollama (running models locally) - [Download here](https://ollama.com/)
    - qwen3.5:9b — single multimodal model used for both text and image analysis
- Local Whisper server (OpenAI-compatible API). Recommended: [speaches](https://github.com/speaches-ai/speaches) / `faster-whisper-server`
- Angular v20 with `@ngx-translate/core` (de/en, runtime language switch, translations bundled — no network fetch)
- Express

## How to run
```
# AI model
ollama pull qwen3.5:9b
ollama run qwen3.5:9b


# Local Whisper (speech-to-text) — runs on :8000, OpenAI-compatible API
# Option A: Docker (simplest — just start it, the backend auto-pulls the model on first run)
docker run --rm -p 8000:8000 ghcr.io/speaches-ai/speaches:latest-cpu
# Option B: any other Whisper server exposing POST /v1/audio/transcriptions


# Backend
cd backend
npm install
npm run dev


# Frontend
cd frontend
npm install
npm run start
```

### Whisper configuration
The backend reads these env vars (all optional):
- `WHISPER_URL` (default `http://localhost:8000`)
- `WHISPER_MODEL` (default `Systran/faster-whisper-small`)
- `WHISPER_LANGUAGE` (default `de`) — fallback when the frontend does not send a language

The backend auto-pulls `WHISPER_MODEL` on startup (and again on a 404 during the first transcription) so no manual `POST /v1/models/...` is required.

### UI language
The frontend language (`de` | `en`) is selected in the header, persisted in `localStorage`, and forwarded with every backend request (`language` field in JSON / multipart). The backend uses it for Whisper transcription and for a short language instruction appended to the LLM prompts. Prompts themselves stay in English for best model performance.

## How to use
- The stack runs on these ports
    - localhost:11434 - Ollama (You can change it via ENV file and a `OLLAMA_URL` var)
    - localhost:4200 - Angular frontend - Use it within your browser!
    - localhost:3000 - Express backend
- The stack also expects a local Whisper server at `localhost:8000` (see "Whisper configuration" above)
- You can edit the `formData.ts` file with fields as you desire. In default the AI will respect your new fields
- You can edit prompts with
    - `analyze-image.ts` - Prompt used for image analysis
    - `analyze-text.ts` - Prompt used for structured text extraction

## Structure
### Backend
- `backend/src/llm/llmClient.ts` - Thin client that POSTs to the Ollama `/api/generate` endpoint
- `backend/src/llm/options.ts` - Shared model id (`LLM_MODEL`) and deterministic sampling options reused by every endpoint
- `backend/src/llm/whisperClient.ts` - Client for the local Whisper server (speech-to-text), incl. first-run model pull
- `backend/src/middleware/upload.ts` - `multer` in-memory storage for image / audio uploads
- `backend/src/prompts/analyze-text.ts` / `analyze-image.ts` - Prompt builders, parameterised by language
- `backend/src/prompts/formStructure.ts` - Small helper shared by both prompt builders
- `backend/src/i18n.ts` - App language type, language resolution and translated error messages
- `backend/src/routes/ai.ts` - REST endpoints, wrapped in a single error-handling helper
    - `/analyze-text` - Text → structured JSON (Qwen 3.5 9B)
    - `/analyze-image` - Image → structured JSON (Qwen 3.5 9B, multimodal)
    - `/transcribe-audio` - Audio → text (Whisper)

### Frontend
- `frontend/src` - Starting point with app mount and Angular Material `styles.scss` config
- `frontend/src/app/components/registration` - Folder of our profiling form
- `frontend/src/app/models/formData.ts` - Our form fields. Readily typed
    - You have 2 different form field as default objects to show you, how the LLMs perform with `text` type fields vs. `select` type fields
    - This should give you an idea about some deterministic limitations and probably solution ideas you can build on
- `frontend/src/app/functions/form-fields-to-json-schema.ts` - Maps `FormField[]` to a JSONSchema7 object (Ollama consumes this as the `format` hint)
- `frontend/src/app/services` - Data and communication services
    - `api.service.ts` - Typed REST client (`AnalyzeResponse`, `TranscribeResponse`)
    - `speech.service.ts` - Records microphone audio via the `MediaRecorder` API and posts the blob to the backend for local Whisper transcription
    - `webcam.service.ts` - Controls the WebCam stream and captures images from it
    - `language.service.ts` - Current UI language signal, `localStorage` persistence, wires `@ngx-translate/core`
- `frontend/src/app/i18n` - Bundled `de` / `en` translations and a sync `TranslateLoader`
