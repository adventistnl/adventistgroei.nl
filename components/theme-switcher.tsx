"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const [isDark, setIsDark] = React.useState(false)
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Carregar tema salvo ao inicializar
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const shouldBeDark = savedTheme === 'dark'
    setIsDark(shouldBeDark)
    
    // Aplicar tema ao documento IMEDIATAMENTE
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle theme com animação gradient
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    
    // Inicia animação de transição
    setIsTransitioning(true)
    
    // Aplica tema IMEDIATAMENTE (sem delay)
    setIsDark(!isDark)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    // Remove overlay após animação
    setTimeout(() => {
      setIsTransitioning(false)
    }, 400)
  }

  return (
    <>
      {/* Gradient Transition Overlay */}
      {isTransitioning && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            background: isDark 
              ? 'radial-gradient(circle at center, rgba(15, 23, 42, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
            animation: 'themeTransition 0.4s ease-in-out'
          }}
        />
      )}
      
      <Button 
        variant="outline" 
        size="icon" 
        className="relative h-9 w-9 transition-transform hover:scale-105"
        onClick={toggleTheme}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
        <span className="sr-only">{t('common.theme') || 'Theme'}</span>
      </Button>
      
      {/* Keyframes CSS inline */}
      <style jsx global>{`
        @keyframes themeTransition {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  )
}
