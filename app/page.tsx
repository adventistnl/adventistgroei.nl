"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { loginTranslations } from '@/lib/translations/login'

export default function HomePage() {
  const { isAuthenticated, isLoading, token, user } = useAuth()
  const router = useRouter()
  const { i18n } = useTranslation()

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t = loginTranslations[currentLanguage as keyof typeof loginTranslations] || loginTranslations.en

  useEffect(() => {
    // Só redireciona quando terminar de carregar
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router, token, user])

  // Mostrar loading enquanto verifica autenticação
  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      <LoadingSpinner 
        text={t.validatingAccount} 
        icon={Building2}
        size="md"
      />
    </div>
  )
}
