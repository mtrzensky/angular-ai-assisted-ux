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

## Stack
- Ollama (running models locally) - [Download here](https://ollama.com/)
    - mistral:latest
    - gemma3:12b
- Angular v20
- Express

## How to run
```
# AI models
ollama pull mistral:latest
ollama pull gemma3:12b

ollama run mistral:latest
ollama run gemma3:15b


# Backend
cd backend
npm install
npm run dev


# Frontend
cd frontend
npm install
npm run start
```

## How to use
- The stack runs on these ports
    - localhost:11434 - Ollama (You can change it via ENV file and a OLLAMA_URL var)
    - localhost:4200 - Angular frontend - Use it within your browser!
    - localhost:3000 - Express backend
- You can edit the `formData.ts` file with fields as you desire. In default the AI will respect your new fields
- You can edit prompts with
    - `analyze-image.ts` - Prompts for gemma3:12b image detection
    - `analyze-text.ts` - Prompts for mistral:latest text structure

## Structure
### Backend
- `backend/src/llm/llmClient.ts` - This is the LLM Client that communicates with our models
- `backend/src/middleware/upload.ts` - This is a middleware using "multer" to process base64 images
- `backend/src/routes/ai.ts` - Our REST endpoints
    - `/analyze-text` - Endpoint for our mistral:latest text model
    - `/analyze.image` - Endpoint for our gemma3:12b multimodal model

### Frontend
- `frontend/src` - Starting point with app mount and Angular Material `styles.scss` config  
- `frontend/src/app/components/registration` - Folder of our profiling form
- `frontend/src/app/models/formData.ts` - Our form fields. Readily typed
    - You have 2 different form field as default objects to show you, how the LLMs perform with `text` type fields vs. `select` type fields
    - This should give you an idea about some deterministic limitations and probably solution ideas you can build on
- `frontend/src/app/functions/form-fields-to-json-schema.ts` - Function to parse our form field objects
    - We will use this to inject our prompts with form data context. Ollama natively supports JSONSchema7 to produce JSON output.
- `frontend/src/app/services` - Our data and communication service
    - `api.service.ts` - REST Api Service
    - `speech.service.ts` - Service using the SpeechRecognition API from your browser (needed for voice transcript)
        - You can change the language you want to detect and transcript here
    - `webcam.service.ts`- Service to control the WebCam stream and capture images from it
- `frontend/src/app/types/speech.d.ts` - SpeechRecognition types
