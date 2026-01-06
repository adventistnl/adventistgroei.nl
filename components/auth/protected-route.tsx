"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { loginTranslations } from '@/lib/translations/login'

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t.validatingAccount}</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderizar nada (redirecionamento está acontecendo)
  if (!isAuthenticated) {
    return null
  }

  // Se estiver autenticado, renderizar o conteúdo protegido
  return <>{children}</>
}
