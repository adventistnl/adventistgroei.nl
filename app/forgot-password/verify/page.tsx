"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from "react-hot-toast"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle, Building2 } from 'lucide-react'
import { AppLoader } from '@/components/shared/app-loader'
import { AdventistLogo } from '@/components/ui/adventist-logo'
import { useVerifyForgotPasswordCodeMutation, useSendForgotPasswordCodeMutation } from '@/hooks/graphql/use-forgot-password-mutation'

function VerifyCodePageContent() {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifyCode, { loading: isSubmitting }] = useVerifyForgotPasswordCodeMutation()
  const [resendCode, { loading: isResending }] = useSendForgotPasswordCodeMutation()

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      router.push('/forgot-password')
    }
  }, [searchParams, router])

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (code.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    try {
      const response = await verifyCode({
        variables: { email, code }
      })

      const result = response.data?.verifyForgotPasswordCode

      if (result?.success && result?.resetToken) {
        toast.success(result?.message || 'Code verified successfully', {
          duration: 3000
        })
        
        // Navigate to reset password page with reset token
        router.push(`/forgot-password/reset?email=${encodeURIComponent(email)}&code=${code}&resetToken=${encodeURIComponent(result.resetToken)}`)
      } else {
        setError(result?.error || 'Invalid verification code')
        toast.error(result?.error || 'Invalid verification code', {
          duration: 4000
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid verification code'
      setError(errorMessage)
      toast.error(errorMessage, {
        duration: 4000
      })
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return

    try {
      const response = await resendCode({
        variables: { email }
      })

      const result = response.data?.sendForgotPasswordCode

      if (result?.success) {
        toast.success(result?.message || 'New code sent to your email', {
          duration: 3000
        })
        
        setResendCooldown(60) // 60 seconds cooldown
      } else {
        toast.error(result?.error || 'Failed to resend code', {
          duration: 4000
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend code'
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
                    <span className="font-bold">Verify Code</span>
                  </h1>
                </div>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter the 6-digit code sent to
                </p>
                <p className="text-foreground font-medium text-sm">{email}</p>
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
                
                {/* Campo Código */}
                <div className="space-y-3">
                  <Label htmlFor="code" className="font-medium text-foreground" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center tracking-widest bg-background border-border focus:border-primary transition-all duration-200"
                      style={{ 
                        height: 'clamp(3rem, 6vh, 4rem)',
                        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                        letterSpacing: '0.5em'
                      }}
                      disabled={isSubmitting}
                      maxLength={6}
                    />
                    {code.length === 6 && (
                      <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
                
                {/* Botão Reenviar Código */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0 
                      ? `Resend code in ${resendCooldown}s` 
                      : "Didn't receive the code? Resend"}
                  </button>
                </div>
                
                {/* Botão de Submit */}
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200" 
                  style={{ 
                    height: 'clamp(3rem, 6vh, 4rem)',
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)'
                  }}
                  disabled={isSubmitting || code.length !== 6}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-3"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </form>
              
              {/* Link Voltar ao Email */}
              <div className="text-center">
                <button 
                  onClick={() => router.push('/forgot-password')}
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                  type="button"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Email
                </button>
              </div>
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

export default function VerifyCodePage() {
  return (
    <Suspense fallback={<AppLoader fullScreen />}>
      <VerifyCodePageContent />
    </Suspense>
  )
}
