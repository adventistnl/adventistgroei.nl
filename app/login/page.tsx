"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import toast from "react-hot-toast"
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building2, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { LoginSplash } from '@/components/auth/login-splash'
import { LoginHeader } from '@/components/auth/login-header'
import { AdventistLogo } from '@/components/ui/adventist-logo'
import { loginTranslations } from '@/lib/translations/login'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

// Idiomas suportados pelo sistema
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'pt', name: 'Português' },
]

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  
  const { login, isAuthenticated, isLoading, error: authError } = useAuth()
  const { i18n } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = loginTranslations[currentLanguage as keyof typeof loginTranslations] || loginTranslations.en

  // Removido: Redirecionamento automático - agora feito diretamente no login

  // Carregar configuração "lembrar por 30 dias"
  useEffect(() => {
    const rememberLogin = localStorage.getItem('rememberLogin')
    const rememberExpiry = localStorage.getItem('rememberExpiry')
    
    if (rememberLogin === 'true' && rememberExpiry) {
      const expiryTime = parseInt(rememberExpiry)
      if (Date.now() < expiryTime) {
        setRememberMe(true)
      } else {
        // Expirou, limpar dados
        localStorage.removeItem('rememberLogin')
        localStorage.removeItem('rememberExpiry')
      }
    }
  }, [])

  // Verificar se o usuário acabou de se registrar
  useEffect(() => {
    const registered = searchParams.get('registered')
    const registeredEmail = searchParams.get('email')
    const userRole = searchParams.get('role')
    
    if (registered === 'true') {
      if (registeredEmail) {
        setEmail(decodeURIComponent(registeredEmail))
        toast.success(
          `${t.registrationCompleted}\n👤 ${t.rolePrefix} ${userRole}\n ${t.firstLoginMessage}`,
          {
            duration: 6000,
            style: {
              minWidth: '350px',
            },
          }
        )
      } else {
        toast.success(`${t.registrationCompleted} ${t.firstLoginMessage}`, {
          duration: 4000,
        })
      }
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!email || !password) {
      setError(t.fillAllFields)
      setIsSubmitting(false)
      return
    }

    try {
      await login(email, password, rememberMe)
      
      toast.success(`${t.welcomeBack}`, {
        duration: 3000
      })
      // Pequeno delay para garantir que o estado seja atualizado antes do redirecionamento
      setTimeout(() => {
        router.push('/dashboard')
      }, 100)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User not found') {
          setError(t.invalidCredentials)
          return
        } else if (error.message === 'User has no active roles') {
          setError(t.noActiveRoles)
          return
        } else if (error.message === 'invalid token') {
          setError(t.loginError)
          return
        } else if (error.message === 'Invalid credentials') {
          setError(t.invalidCredentials)
          return
        } else {
          setError(t.loginError)
          return
        }
      } else {
        setError(t.loginError)
        return
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    setError(authError ? t.invalidCredentials : "")
  }, [authError, t])

  // Handler para completar o splash screen
  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // Mostrar splash screen primeiro
  if (showSplash) {
    return (
      <LoginSplash onComplete={handleSplashComplete} />
    )
  }

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
    <LoadingSpinner 
        text="Loading institutions..." 
        icon={Building2}
        size="md"
      />
      </div>
    )
  }

  // Se já estiver autenticado, não mostrar nada (redirecionamento está acontecendo)
  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Grid Layout com 7 colunas - mesmo padrão da página de registro */}
      <div className="grid grid-cols-7 min-h-screen">
        
        {/* Colunas 1-6: Área de Login */}
        <div className="col-span-6 flex items-center justify-center p-8 sm:p-16">
          <div className="w-full max-w-xl space-y-8">
            
            {/* Header com Logo, Título e Controles */}
            <div className="text-center space-y-8">
              
              {/* Logo da Igreja centralizada sem background */}

              
              {/* Título principal da Igreja */}
              <div className="space-y-0.5">

                <p className="text-muted-foreground font-medium mb-0.5" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                  {t.subtitle}
                </p>
                <div className="flex justify-center items-center mb-1">
                  {/* Logo visível apenas em desktop */}
                  <div className="hidden sm:block text-primary mr-3" style={{ width: 'clamp(2.5rem, 3vw, 3rem)', height: 'clamp(2.5rem, 3vw, 3rem)' }}>
                    <AdventistLogo className="w-full h-full text-primary" />
                  </div>
                  
                  <h1 className="text-foreground leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                  {currentLanguage === 'en' && (
                    <>
                      <span className="font-bold">Seventh-day</span>{' '}
                      <span className="font-light">Adventist Church</span>
                    </>
                  )}
                  {currentLanguage === 'nl' && (
                    <>
                      <span className="font-bold">Zevende-dags</span>{' '}
                      <span className="font-light">Adventistenkerk</span>
                    </>
                  )}
                  {currentLanguage === 'pt' && (
                    <>
                      <span className="font-bold">Igreja Adventista</span>{' '}
                      <span className="font-light">do Sétimo Dia</span>
                    </>
                  )}
                </h1>
              </div>

              </div>
              
              {/* Header com controles de idioma e tema */}
              {/* <LoginHeader
                title=""
                subtitle=""
                languages={LANGUAGES}
                currentLanguage={currentLanguage}
              /> */}
            </div>

            {/* Formulário de Login */}
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
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
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
                
                {/* Campo Senha */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="font-medium text-foreground" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 bg-background border-border focus:border-primary transition-all duration-200"
                      style={{ 
                        height: 'clamp(3rem, 6vh, 4rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)'
                      }}
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Checkbox Lembrar por 30 dias */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    disabled={isSubmitting}
                    className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label
                    htmlFor="remember-me"
                    className="font-medium text-foreground cursor-pointer"
                    style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  >
                    {t.rememberMe}
                  </Label>
                </div>
                
                {/* Botão de Login */}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-primary dark:hover:bg-primary/90 dark:text-primary-foreground" 
                  style={{ 
                    height: 'clamp(3rem, 6vh, 4rem)',
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                      {t.signingIn}
                    </div>
                  ) : (
                    t.signIn
                  )}
                </Button>
              </form>
              
              {/* Link Esqueceu Senha */}
              <div className="text-center">
                <button 
                  onClick={() => router.push('/forgot-password')}
                  className="text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  type="button"
                >
                  {t.forgotPassword}
                </button>
              </div>
              
            </div>
          </div>
        </div>
        
        {/* Coluna 7: Sidebar decorativa - mesmo padrão da página de registro */}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <LoadingSpinner
        text="Loading..."
        size="lg"
        fullScreen
      />
    }>
      <LoginPageContent />
    </Suspense>
  )
}