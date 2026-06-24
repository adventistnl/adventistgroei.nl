"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { loginTranslations } from '@/lib/translations/login'
import { AppLoader } from '@/components/shared/app-loader'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { i18n } = useTranslation()

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t = loginTranslations[currentLanguage as keyof typeof loginTranslations] || loginTranslations.en

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <AppLoader
        message={t.validatingAccount}
        fullScreen
      />
    )
  }

  // Se não estiver autenticado, não renderizar nada (redirecionamento está acontecendo)
  if (!isAuthenticated) {
    return null
  }

  // Se estiver autenticado, renderizar o conteúdo protegido
  return <>{children}</>
}
