"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
  showPercentage?: boolean
  showStepInfo?: boolean
}

/**
 * Componente de progresso minimalista
 * Exibe apenas uma barra de progresso de 0 a 100%
 * Simples, limpo e funcional
 */
export function StepProgress({ 
  currentStep, 
  totalSteps,
  className,
  showPercentage = true,
  showStepInfo = true
}: StepProgressProps) {
  // Calcula o progresso de 0 a 100%
  const progress = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100)
  const roundedProgress = Math.round(progress)

  return (
    <div className={cn("w-full", className)}>
      {/* Informações do progresso */}
      {showStepInfo && (
        <div className="flex justify-between items-center mb-0.75rem">
          <span className="text-0.875rem font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          {showPercentage && (
            <span className="text-0.875rem font-semibold text-primary">
              {roundedProgress}%
            </span>
          )}
        </div>
      )}
      
      {/* Barra de progresso */}
      <div className="relative w-full h-0.5rem bg-muted/30 rounded-full overflow-hidden">
        {/* Barra de progresso preenchida */}
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary/90 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
        
        {/* Efeito de shimmer sutil */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30"
          style={{ 
            transform: `translateX(-${100 - progress}%)`,
            transition: 'transform 0.5s ease-out'
          }}
        />
      </div>
    </div>
  )
}
