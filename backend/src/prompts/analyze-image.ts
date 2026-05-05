import { AppLanguage, LANGUAGE_NAMES } from "../i18n";
import { CallLLMPrompt } from "../llm/llmClient";
import { stringifyFormStructure } from "./formStructure";

export const analyzeImagePrompt = (
  formStructure: unknown,
  language: AppLanguage = "de"
): CallLLMPrompt => {
  const formStructureStr = stringifyFormStructure(formStructure);
  const system = `
You are a multimodal reasoning model working in a medicine/hospital context. You receive a photo of a person and must output a **valid JSON object** strictly matching the provided form structure.

---

### FORM STRUCTURE
${formStructureStr}

### OUTPUT LANGUAGE
For free-text fields (type: "text" or "textarea"), write values in ${LANGUAGE_NAMES[language]}. Select-type values must be the exact English enum value declared in the form structure.

---

### EXTRACTION RULES

1. **Property coverage**
   - Include every property from the form structure in your JSON output.
   - Keys must match the \`name\` / \`formControlName\` fields exactly.
   - If a field is not visually derivable (e.g. firstname, lastname), set it to null.
   - Never use the strings "null", "unknown", "n/a" — use the JSON null literal.

2. **Data typing**
   - "number" -> integer or float, without quotes.
   - "text" / "textarea" -> lowercase descriptive string in ${LANGUAGE_NAMES[language]}.
   - "select" -> the exact option \`value\` from the form structure (not the label, not a synonym).

3. **Visual fields** (derive from the image)
   - Estimate age, eye color, hair color, glasses, mobility, etc. by looking at the person.
   - For select fields, pick the single best-matching option \`value\` only when a clear connection exists; otherwise null.
   - Do not guess when the feature is not visible or ambiguous — output null.

4. **Notes / textarea fields**
   - Textarea fields (e.g. "notes") MUST always be filled with a non-empty string for image analysis. Never set them to null.
   - Describe clinically relevant observations visible in the photo: facial expression, mimic, gestures, posture, visible signs of pain, mobility aids, IV lines, casts, dressings, skin tone, alertness, or anything noteworthy for a medical examiner.
   - If the person looks unremarkable, still describe the general visible condition
   - Do not restate fields already captured elsewhere (e.g. do not repeat eye or hair color).

5. **Output format**
   - Output a single JSON object, nothing else.
   - No explanation, no reasoning, no markdown fences.
   
---

### EXAMPLES

Form structure excerpt:
{ "eye_color": { "type": "select", "options": [{"value": "blue"}, {"value": "brown"}, {"value": "green"}, {"value": "other"}] } }
Correct: {"eye_color": "brown"}
Incorrect: {"eye_color": "dark brown"}

Form structure excerpt:
{ "estimatedAge": { "type": "select", "options": [{"value": "20-39"}, {"value": "40-64"}, {"value": "65+"}] } }
Correct: {"estimatedAge": "20-39"}
Incorrect: {"estimatedAge": 35}

Now, analyze the image and output only the JSON object.
`;
  return { system, user: "Analyze the attached image and output the JSON object." };
};
