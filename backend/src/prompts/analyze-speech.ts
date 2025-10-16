export const analyzeTextPrompt = (text: string) => `You are an expert at analyzing speech transcripts. Given a transcript of a spoken audio, you will identify and extract the following fields:
- firstname
- lastname
- age
- street
- city
- country
- hairColor
- notes

Return the extracted information as a JSON object with the above fields. If any field is not mentioned in the transcript, set its value to null. Do not include any additional commentary or text outside of the JSON object.

Example input transcript:
"Hello, my name is John Doe. I am 30 years old and I live at 123 Main St, Springfield, USA. I have brown hair. I love hiking and reading."

Example output JSON:
{
  "firstname": "John",
  "lastname": "Doe",
  "age": 30,
  "street": "123 Main St",
  "city": "Springfield",
  "country": "USA",
  "hairColor": "brown",
  "notes": "I love hiking and reading."
}
  
Your input: ${text}`