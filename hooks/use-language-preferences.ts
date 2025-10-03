import { LanguagePreference } from "@/types/globalTypes";

/**
 * Hook to fetch language preferences.
 * If no data exists, returns a default list of languages.
 */
export function useLanguagePreferences() {
  const defaultLanguages = [
    { value: LanguagePreference.en, label: "English" },
    { value: LanguagePreference.nl, label: "Nederlands" },
  ];

  // In the future, this could fetch from an API or context if needed.
  return defaultLanguages;
}