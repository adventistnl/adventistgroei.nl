"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

interface Language {
  code: string
  name: string
  flag: string
  initials: string
}

// System configured languages (base configuration)
const SYSTEM_LANGUAGES: Language[] = [
  { code: "pt", name: "Português", flag: "🇧🇷", initials: "PT" },
  { code: "en", name: "English", flag: "🇺🇸", initials: "EN" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", initials: "NL" },
]

interface LanguageSettingsContextType {
  // Available languages in the system
  availableLanguages: Language[]
  // Languages enabled by user in settings
  enabledLanguages: Language[]
  // Current preferred language
  preferredLanguage: string
  // Change preferred language
  setPreferredLanguage: (code: string) => void
  // Toggle language enabled/disabled
  toggleLanguageEnabled: (code: string) => void
  // Check if a language is enabled
  isLanguageEnabled: (code: string) => boolean
}

const LanguageSettingsContext = createContext<LanguageSettingsContextType | undefined>(undefined)

const STORAGE_KEY_ENABLED = "language-settings-enabled"
const STORAGE_KEY_PREFERRED = "language-settings-preferred"

export function LanguageSettingsProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  
  // Initialize enabled languages from sessionStorage or default to all
  const [enabledLanguageCodes, setEnabledLanguageCodes] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(STORAGE_KEY_ENABLED)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error("Failed to parse stored enabled languages", e)
        }
      }
    }
    // Default: all languages enabled
    return SYSTEM_LANGUAGES.map((lang) => lang.code)
  })

  // Initialize preferred language from sessionStorage or i18n
  const [preferredLanguage, setPreferredLanguageState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(STORAGE_KEY_PREFERRED)
      if (stored && enabledLanguageCodes.includes(stored)) {
        return stored
      }
    }
    // Default to current i18n language or first enabled language
    const currentLang = i18n.language
    return enabledLanguageCodes.includes(currentLang) ? currentLang : enabledLanguageCodes[0] || "en"
  })

  // Get enabled languages objects
  const enabledLanguages = SYSTEM_LANGUAGES.filter((lang) => enabledLanguageCodes.includes(lang.code))

  // Sync preferred language with i18n and sessionStorage
  useEffect(() => {
    if (preferredLanguage && i18n.isInitialized) {
      // Only change if different and language is enabled
      if (i18n.language !== preferredLanguage && enabledLanguageCodes.includes(preferredLanguage)) {
        i18n.changeLanguage(preferredLanguage).catch((err) => {
          console.error("Failed to change language:", err)
        })
      }
      sessionStorage.setItem(STORAGE_KEY_PREFERRED, preferredLanguage)
    }
  }, [preferredLanguage, i18n, enabledLanguageCodes])

  // Save enabled languages to sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY_ENABLED, JSON.stringify(enabledLanguageCodes))
    }
  }, [enabledLanguageCodes])

  const setPreferredLanguage = (code: string) => {
    // Only allow setting to enabled languages
    if (!enabledLanguageCodes.includes(code)) {
      toast.error("This language is not enabled in settings")
      return
    }

    setPreferredLanguageState(code)
    
    const selectedLang = SYSTEM_LANGUAGES.find((lang) => lang.code === code)
    toast.success(`Language changed to ${selectedLang?.name}`, {
      duration: 2000,
      style: { minWidth: "250px" },
    })
  }

  const toggleLanguageEnabled = (code: string) => {
    setEnabledLanguageCodes((prev) => {
      const isCurrentlyEnabled = prev.includes(code)
      
      // Don't allow disabling if it's the only enabled language
      if (isCurrentlyEnabled && prev.length === 1) {
        toast.error("At least one language must be enabled")
        return prev
      }

      // Don't allow disabling the preferred language
      if (isCurrentlyEnabled && code === preferredLanguage) {
        toast.error("Cannot disable your preferred language. Change your preference first.")
        return prev
      }

      const newEnabled = isCurrentlyEnabled ? prev.filter((c) => c !== code) : [...prev, code]

      const lang = SYSTEM_LANGUAGES.find((l) => l.code === code)
      toast.success(
        isCurrentlyEnabled ? `${lang?.flag} ${lang?.name} disabled` : `${lang?.flag} ${lang?.name} enabled`,
        { duration: 1500 }
      )

      return newEnabled
    })
  }

  const isLanguageEnabled = (code: string) => {
    return enabledLanguageCodes.includes(code)
  }

  return (
    <LanguageSettingsContext.Provider
      value={{
        availableLanguages: SYSTEM_LANGUAGES,
        enabledLanguages,
        preferredLanguage,
        setPreferredLanguage,
        toggleLanguageEnabled,
        isLanguageEnabled,
      }}
    >
      {children}
    </LanguageSettingsContext.Provider>
  )
}

export function useLanguageSettings() {
  const context = useContext(LanguageSettingsContext)
  if (context === undefined) {
    throw new Error("useLanguageSettings must be used within a LanguageSettingsProvider")
  }
  return context
}
