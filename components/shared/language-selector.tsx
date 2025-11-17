"use client"

import * as React from "react"
import { Globe, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18nReady } from "@/hooks/use-i18n-ready"
import { useLanguageOptions } from "@/hooks/use-language-preferences"

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const { isReady, currentLanguage } = useI18nReady()
  const languageOptions = useLanguageOptions()

  // Criar um mapeamento para incluir as iniciais baseadas nos dados do hook
  const languagesWithInitials = languageOptions.map(lang => ({
    code: lang.value,
    name: lang.label,
    initials: lang.value.toUpperCase()
  }))

  const changeLanguage = (languageCode: string) => {
    // Verificação simplificada - o hook useI18nReady já garante que está pronto
    if (typeof i18n.changeLanguage !== 'function') {
      console.warn('[Language Selector] changeLanguage method not available')
      toast.error('Unable to change language at this time', { duration: 2000 })
      return
    }
    
    const selectedLang = languagesWithInitials.find(lang => lang.code === languageCode)
    
    try {
      i18n.changeLanguage(languageCode).then(() => {
        toast.success(
          `🌍 Language changed to ${selectedLang?.name}`,
          {
            duration: 2000,
            style: { minWidth: '250px' }
          }
        )
        // Salvar preferência no localStorage
        localStorage.setItem('preferred-language', languageCode)
      }).catch((err) => {
        console.error('Failed to change language:', err)
        toast.error('Failed to change language', { duration: 2000 })
      })
    } catch (error) {
      console.error('Error changing language:', error)
      toast.error('Unable to change language at this time', { duration: 2000 })
    }
  }

  const displayLanguage = languagesWithInitials.find(lang => lang.code === currentLanguage) || 
    languagesWithInitials.find(lang => lang.code === 'en') || 
    languagesWithInitials[0] // Fallback para o primeiro idioma disponível

  // Show minimal loading state with current language if available
  if (!isReady) {
    const loadingLanguage = languagesWithInitials.find(lang => lang.code === currentLanguage) ||
      languagesWithInitials.find(lang => lang.code === 'en') ||
      { initials: 'EN' }
    
    return (
      <Button variant="outline" size="sm" className="gap-2 h-9 px-3" disabled>
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{loadingLanguage.initials}</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 px-3">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{displayLanguage.initials}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languagesWithInitials.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setPreferredLanguage(language.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{language.initials}</span>
              <span className="text-sm text-muted-foreground">{language.name}</span>
            </div>
            {preferredLanguage === language.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
