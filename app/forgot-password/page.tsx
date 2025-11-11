"use client"

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import toast from "react-hot-toast"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft } from 'lucide-react'
import { AdventistLogo } from '@/components/ui/adventist-logo'

function ForgotPasswordPageContent() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  const { i18n } = useTranslation()
  const router = useRouter()

  const currentLanguage = i18n?.language || 'en'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!email) {
      setError('Email is required')
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Verification code sent to your email', {
        duration: 4000
      })
      
      // Navigate to verify code page
      router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
    } catch (error) {
      setError('Error sending verification code')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Grid Layout com 7 colunas - mesmo padrão do registro */}
      <div className="grid grid-cols-7 min-h-screen">
        
        {/* Colunas 1-6: Área do Formulário */}
        <div className="col-span-6 flex items-center justify-center p-8 sm:p-16">
          <div className="w-full max-w-xl space-y-8">
            
            {/* Header com Logo e Título */}
            <div className="text-center space-y-8">
              
              {/* Título */}
              <div className="space-y-0.5">
                <p className="text-muted-foreground font-medium mb-0.5" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                  Password Recovery
                </p>
                <div className="flex justify-center items-center mb-1">
                  {/* Logo visível apenas em desktop */}
                  <div className="hidden sm:block text-primary mr-3" style={{ width: 'clamp(2.5rem, 3vw, 3rem)', height: 'clamp(2.5rem, 3vw, 3rem)' }}>
                    <AdventistLogo className="w-full h-full text-primary" />
                  </div>
                  
                  <h1 className="text-foreground leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    <span className="font-bold">Reset Password</span>
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter your email address and we'll send you a verification code
                </p>
              </div>
            </div>

            {/* Formulário */}
            <div className="space-y-6 px-4 sm:px-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertDescription className="text-destructive-foreground">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Campo Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="font-medium text-foreground" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 bg-background border-border focus:border-primary transition-all duration-200"
                      style={{ 
                        height: 'clamp(3rem, 6vh, 4rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)'
                      }}
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                  </div>
                </div>
                
                {/* Botão de Submit */}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200" 
                  style={{ 
                    height: 'clamp(3rem, 6vh, 4rem)',
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                      Sending Code...
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
              
              {/* Link Voltar ao Login */}
              <div className="text-center">
                <button 
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coluna 7: Sidebar decorativa */}
        <div className="col-span-1 bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
          {/* Logo centralizado no topo */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center justify-center" style={{ width: 'clamp(3rem, 8vw, 5rem)', height: 'clamp(3rem, 8vw, 5rem)' }}>
              <AdventistLogo className="w-full h-full text-white" />
            </div>
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-48 left-1/4 w-8 h-8 bg-white/60 rounded-full"></div>
            <div className="absolute top-64 right-1/4 w-12 h-12 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/80 rounded-full"></div>
          </div>
          
          {/* Linhas decorativas sutis */}
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ForgotPasswordPageContent />
    </Suspense>
  )
}
