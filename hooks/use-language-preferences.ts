import { LanguagePreference } from "@/types/globalTypes";

/**
 * Hook para seletores de formulário com informações visuais.
 * Inclui flags para melhor UX nos seletores.
 */
export function useLanguageOptions() {
  const languageOptions: { value: LanguagePreference; label: string; }[] = [
    { 
      value: LanguagePreference.en, 
      label: "English",
    },
    { 
      value: LanguagePreference.nl, 
      label: "Nederlands", 
    },
  ];

  return languageOptions;
}