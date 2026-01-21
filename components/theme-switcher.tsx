"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"

export function ThemeSwitcher() {
  const { t, ready } = useTranslation()
  const [isDark, setIsDark] = React.useState(false)

  // Carregar tema salvo ao inicializar
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const shouldBeDark = savedTheme === 'dark'
    setIsDark(shouldBeDark)
    
    // Aplicar tema ao documento
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const setTheme = (theme: 'light' | 'dark') => {
    setIsDark(theme === 'dark')
    
    // Aplicar tema ao documento
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      toast.success(t('common.theme_dark_activated') || 'Dark mode activated', {
        duration: 2000,
        style: { background: '#1f2937', color: '#f9fafb' }
      })
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      toast.success(t('common.theme_light_activated') || 'Light mode activated', {
        duration: 2000,
        style: { background: '#ffffff', color: '#1f2937' }
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('common.theme') || 'Theme'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{t('common.light_mode') || 'Light'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{t('common.dark_mode') || 'Dark'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
