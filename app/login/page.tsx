"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'next-themes'
import { ApolloError } from '@apollo/client'
import toast from "react-hot-toast"
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Eye, EyeOff, Globe, Lock, Mail, Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import { LoginSplash } from '@/components/auth/login-splash'
import { AdventistLogo } from '@/components/ui/adventist-logo'
import { AuthSidebar } from '@/components/auth/auth-sidebar'
import { loginTranslations } from '@/lib/translations/login'
import { AppLoader } from '@/components/shared/app-loader'
import { LoginFieldInput } from '@/components/ui/login-field-input'

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'nl', name: 'Nederlands' }
]

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)

  const { login, isAuthenticated, isLoading, error: authError } = useAuth()
  const { i18n } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentLanguage = i18n?.language || 'en'
  const t = loginTranslations[currentLanguage as keyof typeof loginTranslations] || loginTranslations.en

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const rememberLogin = localStorage.getItem('rememberLogin')
    const rememberExpiry = localStorage.getItem('rememberExpiry')
    if (rememberLogin === 'true' && rememberExpiry) {
      const expiryTime = parseInt(rememberExpiry)
      if (Date.now() < expiryTime) {
        setRememberMe(true)
      } else {
        localStorage.removeItem('rememberLogin')
        localStorage.removeItem('rememberExpiry')
      }
    }
  }, [])

  useEffect(() => {
    const registered = searchParams.get('registered')
    const registeredEmail = searchParams.get('email')
    const userRole = searchParams.get('role')
    if (registered === 'true') {
      if (registeredEmail) {
        setEmail(decodeURIComponent(registeredEmail))
        toast.success(
          `${t.registrationCompleted}\n👤 ${t.rolePrefix} ${userRole}\n ${t.firstLoginMessage}`,
          { duration: 6000, style: { minWidth: '350px' } }
        )
      } else {
        toast.success(`${t.registrationCompleted} ${t.firstLoginMessage}`, { duration: 4000 })
      }
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    let hasFieldError = false
    if (!email) {
      setEmailError(t.emailRequired)
      hasFieldError = true
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(t.emailInvalid)
      hasFieldError = true
    } else {
      setEmailError('')
    }
    if (!password) {
      setPasswordError(t.passwordRequired)
      hasFieldError = true
    } else {
      setPasswordError('')
    }
    if (hasFieldError) return
    setIsSubmitting(true)
    try {
      await login(email, password, rememberMe)
      toast.success(`${t.welcomeBack}`, { duration: 3000 })
      setTimeout(() => router.push('/dashboard'), 100)
    } catch (err) {
      setIsSubmitting(false)

      // Erro GraphQL estruturado — ex.:
      // { extensions: { code: 'AUTHENTICATION_ERROR', status: 401, context: { additional: { field: 'email' } } } }
      const gqlError = err instanceof ApolloError ? err.graphQLErrors?.[0] : undefined
      const ext = gqlError?.extensions as
        | { code?: string; status?: number; context?: { additional?: { field?: string } } }
        | undefined
      const isAuthError = ext?.code === 'AUTHENTICATION_ERROR' || ext?.status === 401

      const msg = err instanceof Error ? err.message.toLowerCase() : ''

      if (msg.includes('no active roles') || msg.includes('has no active roles')) {
        // Conta sem roles — não são credenciais inválidas
        setError(t.noActiveRoles)
      } else if (
        isAuthError ||
        msg.includes('invalid credentials') ||
        msg.includes('user not found') ||
        msg.includes('niet gevonden') ||
        msg.includes('invalid token') ||
        msg.includes('unauthorized') ||
        msg.includes('wrong password') ||
        msg.includes('incorrect password') ||
        msg.includes('authentication failed') ||
        msg.includes('invalid_credentials')
      ) {
        // Credenciais inválidas → campos vermelhos + mensagem padrão única (sem alert acima)
        setEmailError(' ')
        setPasswordError(t.credentialsInvalid)
      } else {
        // Qualquer outro erro de login (servidor, rede, etc.)
        setEmailError(' ')
        setPasswordError(t.credentialsInvalid)
      }
    }
  }

  useEffect(() => {
    if (authError) {
      setEmailError(' ')
      setPasswordError(t.credentialsInvalid)
    } else {
      setError('')
    }
  }, [authError, t])

  const handleLanguageChange = (code: string) => {
    if (i18n?.changeLanguage) {
      i18n.changeLanguage(code)
      const lang = LANGUAGES.find(l => l.code === code)
      toast.success(`${lang?.name}`, { duration: 2000 })
    }
  }

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  if (showSplash) return <LoginSplash onComplete={() => setShowSplash(false)} />
  if (isLoading) return <AppLoader fullScreen />
  if (isAuthenticated) return <AppLoader fullScreen message={t.loading} />

  const isDark = mounted && resolvedTheme === 'dark'

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-7 min-h-screen">

        {/* ── Cols 1-6: Login Form ─────────────────────────────── */}
        <div className="col-span-6 flex flex-col items-center justify-center p-8 sm:p-16 relative">
          <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Brand header */}
            <div className="space-y-3">
              <p className="text-muted-foreground font-medium text-sm tracking-wide uppercase">
                {t.subtitle}
              </p>
              <div className="flex items-center gap-3">
                <div className="text-primary shrink-0" style={{ width: '2.25rem', height: '2.25rem' }}>
                  <AdventistLogo className="w-full h-full" />
                </div>
                <h1 className="text-foreground leading-tight tracking-tight text-2xl sm:text-3xl">
                  <span className="font-bold">{t.titleBold}</span>{' '}
                  <span className="font-light">{t.titleLight}</span>
                </h1>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {error && (
                <Alert variant="destructive" className="border-destructive/40 bg-destructive/8 py-3">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-7">
                <LoginFieldInput
                  fieldId="email"
                  label={t.email}
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); if (error) setError('') }}
                  error={emailError}
                  leftIcon={<Mail className="h-4 w-4" />}
                  disabled={isSubmitting}
                  autoComplete="email"
                />

                <LoginFieldInput
                  fieldId="password"
                  label={t.password}
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); if (error) setError('') }}
                  error={passwordError}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightElement={
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)} disabled={isSubmitting}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                  }
                  disabled={isSubmitting}
                  autoComplete="current-password"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={isSubmitting}
                  className="border-muted-foreground/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="remember-me" className="text-sm text-muted-foreground cursor-pointer font-normal">
                  {t.rememberMe}
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold tracking-wide transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    {t.signingIn}
                  </div>
                ) : t.signIn}
              </Button>
            </form>

            {/* Footer row: forgot password + lang + theme */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t.forgotPassword}
              </button>

              <div className="flex items-center gap-1">
                {/* Language selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                      <Globe className="h-4 w-4" />
                      <span className="sr-only">{t.changeLanguage}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px]">
                    {LANGUAGES.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={currentLanguage === lang.code ? 'font-semibold' : ''}
                      >
                        {lang.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Theme toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={handleThemeToggle}
                >
                  {mounted && isDark
                    ? <Sun className="h-4 w-4" />
                    : <Moon className="h-4 w-4" />}
                  <span className="sr-only">{t.toggleTheme}</span>
                </Button>
              </div>
            </div>

            {/* Copyright */}
            <p className="text-center text-xs text-muted-foreground/60 pt-4">
              &copy; {new Date().getFullYear()} {t.allRightsReserved}
            </p>

          </div>
        </div>

        {/* ── Col 7: Pilar decorativo padrão ──────────────────── */}
        <AuthSidebar />

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AppLoader fullScreen />}>
      <LoginPageContent />
    </Suspense>
  )
}

