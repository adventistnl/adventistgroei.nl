"use client"

import * as React from "react"
import { Church, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistrationLayout } from "./registration-layout"
import { Progress } from "@/components/ui/progress"

import { cn } from "@/lib/utils"

interface LoadingStateProps {
  message: string
  className?: string
}

interface InvalidInviteStateProps {
  title: string
  description: string
  buttonText: string
  onGoToLogin: () => void
}

/**
 * Estado de loading inicial
 * Exibe animação de carregamento com ícone da igreja
 */
export function LoadingState({ message, className }: LoadingStateProps) {
  return (
    <div className={cn("min-h-screen bg-background flex items-center justify-center p-4", className)}>
      <div className="text-center space-y-8">
        <div className="relative mx-auto w-20 h-20">
          <div className="w-20 h-20 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Church className="w-8 h-8 text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground text-base">{message}</p>
      </div>
    </div>
  )
}

/**
 * Estado de validação de convite
 * Exibe spinner menor durante a validação
 */
export function ValidatingInviteState({ message }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  )
}

/**
 * Estado de convite inválido
 * Exibe erro e botão para voltar ao login
 * Auto-redireciona após 10 segundos com barra de progresso
 */
interface SuccessRegistrationStateProps {
  title: string
  message: string
  description: string
}

/**
 * Estado de registro completo com sucesso
 * Exibe animação de loading durante redirecionamento para dashboard
 */
export function SuccessRegistrationState({ 
  title,
  message,
  description 
}: SuccessRegistrationStateProps) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    // Animação de progresso suave
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 95
        }
        return prev + 2
      })
    }, 100)

    return () => {
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Church className="w-8 h-8 text-primary" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <CardTitle className="text-2xl text-primary">{title}</CardTitle>
            <CardDescription className="text-base font-medium">{message}</CardDescription>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">Loading your workspace...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function InvalidInviteState({ 
  title, 
  description, 
  buttonText, 
  onGoToLogin 
}: InvalidInviteStateProps) {
  const [progress, setProgress] = React.useState(0)
  const [secondsLeft, setSecondsLeft] = React.useState(10)

  React.useEffect(() => {
    // Atualizar progresso a cada 100ms para animação suave
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 100)

    // Atualizar segundos restantes a cada 1 segundo
    const secondsInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(secondsInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Redirecionar após 10 segundos
    const redirectTimer = setTimeout(() => {
      onGoToLogin()
    }, 10000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(secondsInterval)
      clearTimeout(redirectTimer)
    }
  }, [onGoToLogin])

  return (
    <RegistrationLayout>
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <Card className="w-full max-w-md border-destructive/20">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="text-base">{description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Redirecting in</span>
                <span className="font-mono font-semibold text-primary">{secondsLeft}s</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <Button onClick={onGoToLogin} className="w-full" size="lg">
              {buttonText}
            </Button>
          </CardContent>
        </Card>
      </div>
    </RegistrationLayout>
  )
}
