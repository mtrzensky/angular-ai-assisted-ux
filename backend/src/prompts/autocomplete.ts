export const autocompletePrompt = (field: string, query: string, context: Record<string, any> = {}) => `You are an assistant that provides autocomplete suggestions for registration field "${field}".
User typed: "${query}".
Context (if any): ${JSON.stringify(context || {})}
Return an array of up to 10 suggestions as JSON: {"suggestions": ["..."]}`;