"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { useI18nReady } from "@/hooks/use-i18n-ready"

const languages = [
  { code: 'pt', name: 'Português', initials: 'PT' },
  { code: 'en', name: 'English', initials: 'EN' },
  { code: 'nl', name: 'Nederlands', initials: 'NL' }
]

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const { isReady, hasTimedOut, currentLanguage } = useI18nReady()

  const changeLanguage = (languageCode: string) => {
    // Verificação simplificada - o hook useI18nReady já garante que está pronto
    if (typeof i18n.changeLanguage !== 'function') {
      console.warn('[Language Selector] changeLanguage method not available')
      toast.error('Unable to change language at this time', { duration: 2000 })
      return
    }
    
    const selectedLang = languages.find(lang => lang.code === languageCode)
    
    i18n.changeLanguage(languageCode)
      .then(() => {
        toast.success(
          `Language changed to ${selectedLang?.name}`,
          {
            duration: 2000,
            style: { minWidth: '250px' }
          }
        )
        // Salvar preferência no localStorage
        localStorage.setItem('preferred-language', languageCode)
      })
      .catch((err) => {
        console.error('Failed to change language:', err)
        toast.error('Failed to change language', { duration: 2000 })
      })
  }

  // Load saved language preference on mount
  React.useEffect(() => {
    if (isReady && i18n.isInitialized) {
      const savedLanguage = localStorage.getItem('preferred-language')
      if (savedLanguage && savedLanguage !== i18n.language && i18n.changeLanguage) {
        i18n.changeLanguage(savedLanguage).catch(err => {
          console.warn('Failed to load saved language:', err)
        })
      }
    }
  }, [isReady, i18n])

  const displayLanguage = languages.find(lang => lang.code === currentLanguage) || languages[1] // Default to EN

  // Show minimal loading state with EN as default display
  if (!isReady) {
    return (
      <Button variant="outline" size="sm" className="gap-2 h-9 px-3" disabled>
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">EN</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 px-3">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {displayLanguage.initials}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{language.initials}</span>
              <span className="text-sm text-muted-foreground">{language.name}</span>
            </div>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
