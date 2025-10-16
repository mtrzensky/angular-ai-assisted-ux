import { getTypeScriptInterfacesAsString } from "../functions/get-typescript-interfaces";

export const analyzeImagePrompt = () => `You receive a base64-encoded image (as data). You will identify and extract the following fields based on these interface definitions:
${getTypeScriptInterfacesAsString()}

Focus on the person identified in the image.
Leave all fields empty that cannot be determined from the image, only make assumptions about visual identifiable properties.
Never fill fields relevant to the image content with random or made-up data.
Only information around that person in the image can be added to "notes".
Do not include any additional commentary or text outside of the JSON object.
Return JSON as provided by above type definitions.`