import { getTypeScriptInterfacesAsString } from "../functions/get-typescript-interfaces";

export const analyzeTextPrompt = (text: string) => `You are an expert at analyzing speech transcripts. Given a transcript of a spoken audio, you will identify and extract the following fields based on these interface definitions:
${getTypeScriptInterfacesAsString()}

Return the extracted information as a JSON object with the above fields. 
If any field is not mentioned in the transcript, set its value to null. Don't set it to string 'null', use the correct null value.
If no additional information is available for "notes", set it to null. Don't set it to string 'null', use the correct null value.
Do not include any additional commentary or text outside of the JSON object.
Return JSON as provided by above type definitions.
  
Your input: ${text}`