"use client"

import * as React from "react"
import { Globe, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useTranslation } from "react-i18next"
import toast from "react-hot-toast"

interface Language {
  code: string
  name: string
}

interface RegistrationHeaderProps {
  title: string
  subtitle: string
  languages: Language[]
  currentLanguage: string
}

/**
 * Header da página de registro
 * Contém título, subtítulo e controles de idioma/tema
 */
export function RegistrationHeader({ 
  title, 
  subtitle, 
  languages, 
  currentLanguage 
}: RegistrationHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { i18n } = useTranslation()

  /**
   * Manipula a mudança de idioma
   * Atualiza o i18n e exibe feedback visual
   */
  const handleLanguageChange = (languageCode: string) => {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(languageCode)
      const selectedLanguage = languages.find(l => l.code === languageCode)
      toast.success(`Language changed to ${selectedLanguage?.name}`, {
        duration: 3000
      })
    }
  }

  /**
   * Alterna entre tema claro e escuro
   * Exibe feedback visual da mudança
   */
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    toast.success(`Theme changed to ${newTheme} mode`, {
      duration: 2000
    })
  }

  return (
    <div className="space-y-2rem max-w-2xl  mb-3rem">
      {/* Header principal com controles */}
      <div className="flex justify-between items-center">
        {/* Título alinhado à esquerda */}
        <div className="flex-1">
          <h1 className="text-2.5rem sm:text-3rem lg:text-3.5rem font-bold text-left leading-tight">
            {title}
          </h1>
        </div>
        
        {/* Controles de idioma e tema com gap maior */}
        <div className="flex gap-1">
          {/* Seletor de idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-2.75rem">
                <Globe className="w-1.1rem h-1.1rem" />
                <span className="hidden sm:inline text-0.9rem font-medium">
                  {languages.find(l => l.code === currentLanguage)?.flag}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="gap-0.5rem"
                >
                  {language.flag} {language.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Toggle de tema */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            className="h-2.75rem w-2.75rem p-0"
          >
            {theme === "dark" ? <Sun className="w-1.1rem h-1.1rem" /> : <Moon className="w-1.1rem h-1.1rem" />}
          </Button>
        </div>
      </div>
      
      {/* Subtítulo alinhado à esquerda com tamanho menor */}
      <div className="text-left">
        <p className="text-muted-foreground text-1rem sm:text-1.125rem lg:text-1.25rem leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
