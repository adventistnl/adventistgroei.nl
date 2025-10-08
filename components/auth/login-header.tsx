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
  flag: string
}

interface LoginHeaderProps {
  title: string
  subtitle: string
  languages: Language[]
  currentLanguage: string
}

/**
 * Header da página de login
 * Contém título, subtítulo e controles de idioma/tema
 */
export function LoginHeader({ 
  title, 
  subtitle, 
  languages, 
  currentLanguage 
}: LoginHeaderProps) {
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
      toast.success(`${selectedLanguage?.flag} Language changed to ${selectedLanguage?.name}`, {
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
    toast.success(`${newTheme === "dark" ? "🌙" : "☀️"} Theme changed to ${newTheme} mode`, {
      duration: 2000
    })
  }

  return (
    <div className="space-y-6 max-w-md mb-8">
      {/* Header principal com controles */}
      <div className="flex justify-between items-start">

        {/* Controles de idioma e tema */}
        <div className="flex gap-2 mr-4">
          {/* Seletor de idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 h-9 px-3">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {languages.find(l => l.code === currentLanguage)?.flag}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="gap-2"
                >
                  {language.flag} {language.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        {/* Título centralizado */}
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            {subtitle}
          </p>
        </div>
        


          {/* Toggle de tema */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleThemeToggle}
            className="h-9 w-9 px-0"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  )
}