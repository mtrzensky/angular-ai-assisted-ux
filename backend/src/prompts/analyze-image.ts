export const analyzeImagePrompt = (formStructure: string) => `
You receive a base64-encoded image (as data). Your job is to analyze and describe the person in the picture.
Describe visual features of the person and make a profile of that person.

Provide additional notes about the person and analyze that person noticable features or other things to note carefully, as we are in a medicine and hospital context.
Your output always should be a human readable text. Never output JSON or any other format.

Properties list of a person to consider:
${formStructure}

HOW TO INTERPRET THE PROPERTIES LIST:
- 'name' is the name of the property you need to describe about the person.
    - Correct Example: 'estimatedAge' - Try to assume the estimated age ("Person seems to be around 26").
- If the type is 'select', you need to get the 'options' to describe the property. Each option has a 'label'. These you can use.
    - Correct Example: 'glasses' -> options labels are 'yes', 'no', 'sunglasses'. Possible output if person wears no glasses: "Person does not wear glasses".
- Derive EVERY field from this list and give descriptions base on your task.
- Carefully analyze what you see about the person, like mimic, gestures, behaviour, mood, what that person's seems to be doing etc. and add it as "notes"
- Also give relevant "notes" about everything that could be important for medically examine this person

IMPORTANT RULES:
- Do not use the provided form structure for your output schema. 
- ONLY derive possible properties of the person from it.
- NEVER Output structured format. 
- ALWAYS write a human readable description of the person in the image
- Don't write extra comments, just describe what you see
- If you try to assess something based on assumptions, pick only one option per property`
;