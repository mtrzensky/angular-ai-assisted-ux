export const analyzeTextPrompt = (text: string, formStructure: string) => `
You are a reasoning model that converts descriptive or visual text into structured form data.

You must output a **valid JSON object** strictly based on the provided form structure.

---

### FORM STRUCTURE
${formStructure}

### SOURCE TEXT
${text}

---

### STRICT EXTRACTION RULES
Follow these rules exactly:

1. **Field coverage**
   - Include every field from the form structure.
   - If the information is not mentioned or not inferable, set its value to null (not the string "null" or "unknown").
   - Never use the strings "null", "unknown", "n/a", or similar.
   - Never wrap numeric or null values in quotes.

2. **Data typing**
   - Use correct types:
     - For "number": return an integer or float, without quotes.
     - For "text" or "textarea": return a lowercase descriptive string.
     - For "select": return only the exact option **value** from the form structure.

3. **Select field logic**
   For every select-type field:
   - Look at all available option **values** (ignore the labels).
   - Choose the single most semantically appropriate value.
   - Output exactly that **value** (not the label or a synonym).
   - If no match fits, return \`null\`.

   Perform reasoning like this internally:
   - Step 1: Identify any phrase in the input text related to this field.
   - Step 2: Compare it against each available \`option.value\`.
   - Step 3: Pick the best match **only** if a clear connection exists.
   - Step 4: Otherwise, output \`null\`.

4. **Avoid guessing or invention**
   - Do NOT infer names, firstnames, lastnames, or any personal data that is not visible in the text.
   - If the text contains "unknown", "not visible", "none", or similar phrases, set the corresponding field to \`null\`.

5. **Output format**
   - Output a single JSON object.
   - Do not include any explanation, reasoning, or Markdown formatting.
   - All keys must match the \`name\` fields in the form structure exactly.

---

### EXAMPLES

Example 1:
Form structure:
{
  "eyeColor": {
    "type": "select",
    "options": [
      { "value": "blue" },
      { "value": "brown" },
      { "value": "green" },
      { "value": "other" }
    ]
  }
}
Text: "The person has dark brown eyes."

Correct:
{"eyeColor": "brown"}

Incorrect:
{"eyeColor": "dark brown"}
Incorrect:
{"eyeColor": "brown eyes"}

---

Example 2:
Form structure:
{
  "mobility": {
    "type": "select",
    "options": [
      { "value": "walking" },
      { "value": "wheelchair" },
      { "value": "bedridden" }
    ]
  }
}
Text: "The person is standing up, moving freely."

Correct:
{"mobility": "walking"}

Incorrect:
{"mobility": "normal"}
Incorrect:
{"mobility": "walking independently"}

---

Example 3:
Form structure:
{
  "estimatedAge": {
    "type": "select",
    "options": [
        { value: '0-12', label: 'Child (0-12)' },
        { value: '13-19', label: 'Teen (13-19)' },
        { value: '20-39', label: 'Young Adult (20-39)' },
        { value: '40-64', label: 'Adult (40-64)' },
        { value: '65+', label: 'Senior (65+)' },
    ]
  }
}
Text: "The age is around 35 years old."

Correct:
{"estimatedAge": '20-39'}

Incorrect:
{"estimatedAge": "35 years old"}
Incorrect:
{"estimatedAge": 35}

Now, generate only a JSON object for the given input text.
`;
