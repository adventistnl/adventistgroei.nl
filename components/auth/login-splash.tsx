"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { AdventistLogo } from "@/components/ui/adventist-logo"
import { loginTranslations } from "@/lib/translations/login"
import { AppLoader } from "@/components/shared/app-loader"

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
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AppLoader
      message={t.splash.loading}
      fullScreen
      isExiting={isExiting}
      onExitComplete={onComplete}
      className="space-y-8 mx-auto px-8"
    />
  )
}