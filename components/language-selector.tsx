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

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
]

export function LanguageSelector() {
  const { i18n, t } = useTranslation()

  const changeLanguage = (languageCode: string) => {
    const previousLang = i18n.language
    
    i18n.changeLanguage(languageCode)
    
    const selectedLang = languages.find(lang => lang.code === languageCode)
    
    toast.success(
      `🌍 ${t('common.language')} changed to ${selectedLang?.name}`,
      {
        duration: 3000,
        style: { minWidth: '250px' }
      }
    )

    // Salvar preferência no localStorage
    localStorage.setItem('preferred-language', languageCode)
  }

  // Carregar idioma salvo ao inicializar
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language')
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  const currentLanguage = languages.find(lang => lang.code === i18n.language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 h-9 px-3">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
          <span className="sm:hidden">
            {currentLanguage?.flag}
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
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
