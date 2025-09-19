"use client"

import * as React from "react"
import { Church, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RegistrationLayout } from "./registration-layout"

interface LoadingStateProps {
  message: string
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
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Church className="w-6 h-6 text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground text-lg">{message}</p>
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

/**
 * Estado de convite inválido
 * Exibe erro e botão para voltar ao login
 */
export function InvalidInviteState({ 
  title, 
  description, 
  buttonText, 
  onGoToLogin 
}: InvalidInviteStateProps) {
  return (
    <RegistrationLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onGoToLogin} className="w-full">
              {buttonText}
            </Button>
          </CardContent>
        </Card>
      </div>
    </RegistrationLayout>
  )
}
