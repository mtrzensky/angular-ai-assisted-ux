export const analyzeImagePrompt = () => `You receive a base64-encoded image (as data). 
    Identify visible properties: 
    - Hair Color as "hairColor"
    - Sex as "sex" with possible values "male, female" + "unknown" if you can't decide
    - Age as "age". Exact number only.
    - Short descriptive tags as "notes". 
    
    Return JSON only. No unnecessary whitespaces or line returns`