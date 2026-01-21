"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from "react-hot-toast"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, CheckCircle, Lock, Building2 } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { AdventistLogo } from '@/components/ui/adventist-logo'
import { useResetPasswordMutation } from '@/hooks/graphql/use-forgot-password-mutation'

function ResetPasswordPageContent() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [error, setError] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const [resetPassword, { loading: isSubmitting }] = useResetPasswordMutation()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const codeParam = searchParams.get('code')
    const tokenParam = searchParams.get('resetToken')
    
    if (emailParam && codeParam && tokenParam) {
      setEmail(emailParam)
      setCode(codeParam)
      setResetToken(tokenParam)
    } else {
      router.push('/forgot-password')
    }
  }, [searchParams, router])

  const passwordValid = password.length >= 8
  const passwordsMatch = password === confirmPassword && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordValid) {
      setError('Password must be at least 8 characters')
      return
    }

    if (!passwordsMatch) {
      setError("Passwords don't match")
      return
    }

    try {
      const response = await resetPassword({
        variables: {
          email,
          code,
          newPassword: password,
          resetToken
        }
      })

      const result = response.data?.resetPassword

      if (result?.success) {
        toast.success(result?.message || 'Password reset successfully!', {
          duration: 4000
        })
        
        // Navigate to login
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } else {
        setError(result?.error || 'Failed to reset password')
        toast.error(result?.error || 'Failed to reset password', {
          duration: 4000
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password'
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 4000
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Grid Layout com 7 colunas */}
      <div className="grid grid-cols-7 min-h-screen">
        
        {/* Colunas 1-6: Área do Formulário */}
        <div className="col-span-6 flex items-center justify-center p-8 sm:p-16">
          <div className="w-full max-w-xl space-y-8">
            
            {/* Header com Logo e Título */}
            <div className="text-center space-y-8">
              <div className="space-y-0.5">
                <p className="text-muted-foreground font-medium mb-0.5" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
                  Password Recovery
                </p>
                <div className="flex justify-center items-center mb-1">
                  <div className="hidden sm:block text-primary mr-3" style={{ width: 'clamp(2.5rem, 3vw, 3rem)', height: 'clamp(2.5rem, 3vw, 3rem)' }}>
                    <AdventistLogo className="w-full h-full text-primary" />
                  </div>
                  
                  <h1 className="text-foreground leading-tight tracking-tight" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                    <span className="font-bold">Set New Password</span>
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Create a new password for your account
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
                
                {/* Campo Nova Senha */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="font-medium text-foreground" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-20 bg-background border-border focus:border-primary transition-all duration-200"
                      style={{ 
                        height: 'clamp(3rem, 6vh, 4rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)'
                      }}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {passwordValid && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters
                  </p>
                </div>
                
                {/* Campo Confirmar Senha */}
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="font-medium text-foreground" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-20 bg-background border-border focus:border-primary transition-all duration-200"
                      style={{ 
                        height: 'clamp(3rem, 6vh, 4rem)',
                        fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)'
                      }}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                      {passwordsMatch && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {confirmPassword && (
                    <p className={`text-xs ${passwordsMatch ? 'text-green-500' : 'text-destructive'}`}>
                      {passwordsMatch ? 'Passwords match ✓' : "Passwords don't match"}
                    </p>
                  )}
                </div>
                
                {/* Botão de Submit */}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200" 
                  style={{ 
                    height: 'clamp(3rem, 6vh, 4rem)',
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
                  }}
                  disabled={isSubmitting || !passwordValid || !passwordsMatch}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Coluna 7: Sidebar decorativa */}
        <div className="col-span-1 bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex items-center justify-center" style={{ width: 'clamp(3rem, 8vw, 5rem)', height: 'clamp(3rem, 8vw, 5rem)' }}>
              <AdventistLogo className="w-full h-full text-white" />
            </div>
          </div>
          
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-48 left-1/4 w-8 h-8 bg-white/60 rounded-full"></div>
            <div className="absolute top-64 right-1/4 w-12 h-12 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white/80 rounded-full"></div>
          </div>
          
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <LoadingSpinner
        text="Loading..."
        customIcon={Building2}
        size="lg"
        fullScreen
        className="space-y-6 max-w-sm mx-auto px-8"
      />
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
}
