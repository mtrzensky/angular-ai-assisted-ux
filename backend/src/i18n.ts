export type AppLanguage = "de" | "en";

export const DEFAULT_LANGUAGE: AppLanguage = (process.env.APP_LANGUAGE as AppLanguage) || "de";

export function resolveLanguage(raw: unknown): AppLanguage {
  return raw === "en" || raw === "de" ? raw : DEFAULT_LANGUAGE;
}

const messages = {
  errors: {
    audioRequired: { de: "Audio erforderlich", en: "audio required" },
    textRequired: { de: "Text erforderlich", en: "text required" },
    imageRequired: { de: "Bild erforderlich", en: "image required" },
    formStructureRequired: { de: "Formularstruktur erforderlich", en: "formStructure required" },
  },
} as const;

type ErrorKey = keyof typeof messages.errors;

export function t(lang: AppLanguage, key: ErrorKey): string {
  return messages.errors[key][lang];
}

export const LANGUAGE_NAMES: Record<AppLanguage, string> = {
  de: "German",
  en: "English",
};
