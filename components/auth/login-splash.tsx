"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { AdventistLogo } from "@/components/ui/adventist-logo"
import { loginTranslations } from "@/lib/translations/login"

interface LoginSplashProps {
  onComplete: () => void
}

/**
 * Componente de carregamento inicial para a página de login
 * Exibe por 3 segundos antes de deslizar para baixo e mostrar o formulário de login
 */
export function LoginSplash({ onComplete }: LoginSplashProps) {
  const [isExiting, setIsExiting] = React.useState(false)
  const { i18n } = useTranslation()

  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = loginTranslations[currentLanguage as keyof typeof loginTranslations] || loginTranslations.en

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true)
      // Aguarda a animação de saída terminar antes de chamar onComplete
      setTimeout(() => {
        onComplete()
      }, 700)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className={`fixed inset-0 bg-background z-50 flex items-center justify-center transition-transform duration-700 ease-in-out ${
        isExiting ? 'transform translate-y-full' : 'transform translate-y-0'
      }`}
      style={{ 
        transform: isExiting ? 'translateY(100vh)' : 'translateY(0)',
        overflowY: 'scroll'
      }}
    >
      <div className="text-center space-y-8 max-w-md mx-auto px-8">
        
        {/* Logo centralizada sem background */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Animação de loading sutil ao redor do logo */}
            <div className="absolute inset-0 w-24 h-24 border-2 border-transparent border-t-primary/30 border-r-primary/20 rounded-full animate-spin"></div>
            
            {/* Logo da Igreja Adventista */}
            <div className="w-24 h-24 flex items-center justify-center">
              <AdventistLogo className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Textos modernos e funcionais */}
        <div className="space-y-4">
          {/* Título principal */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight tracking-tight">
            {t.splash.title}
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg text-muted-foreground font-medium">
            {t.splash.subtitle}
          </p>
          
          {/* Indicador de carregamento moderno */}
          <div className="flex items-center justify-center space-x-1 pt-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
          </div>
          
          {/* Texto de carregamento */}
          <p className="text-sm text-muted-foreground font-medium pt-2">
            {t.splash.loading}
          </p>
        </div>
      </div>
    </div>
  )
}