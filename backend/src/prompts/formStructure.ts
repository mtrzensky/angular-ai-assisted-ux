export const stringifyFormStructure = (formStructure: unknown): string =>
  typeof formStructure === "string" ? formStructure : JSON.stringify(formStructure, null, 2);
