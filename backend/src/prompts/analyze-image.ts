import { getTypeScriptInterfacesAsString } from "../functions/get-typescript-interfaces";

export const analyzeImagePrompt = () => `You receive a base64-encoded image (as data). You will identify and extract the following properties based on these interface definitions:
${getTypeScriptInterfacesAsString()}
Very important: Leave all fields empty that cannot be determined from the image, only make assumptions about visual identifiable properties.

Never fill JSON properties relevant to the image content with random or made-up data.
Focus on the person identified in the image and assume properties based on what you can see.
Only information around that person in the image can be added to "notes".
Never fill JSON property "notes" with "image not clear" or similar, if no additional information is available for "notes", don't fill it.
Do not include any additional commentary or text outside of the JSON object.
NEVER fill 'firstname' or 'lastname'. Leave them empty.
Return JSON as provided by above type definitions and leave not clear identifiable properties inside the object empty.`