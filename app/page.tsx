"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar automaticamente para o dashboard
    router.push('/dashboard')
  }, [router])

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecionando para o dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
