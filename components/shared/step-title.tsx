"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepTitleProps {
  title: string
  description?: string
  className?: string
  variant?: "default" | "centered" | "left"
  stepNumber?: number
  totalSteps?: number
}

export function StepTitle({ 
  title, 
  description, 
  className,
  variant = "left",
  stepNumber,
  totalSteps
}: StepTitleProps) {
  const getAlignmentClasses = () => {
    switch (variant) {
      case "left":
        return "text-left"
      case "default":
        return "text-center"
      case "centered":
      default:
        return "text-center"
    }
  }

  return (
    <div className={cn("space-y-0.75rem mt-2rem", getAlignmentClasses(), className)}>
      {/* Tag com número do step */}
      {stepNumber && (
        <div className="flex items-center gap-0.75rem mb-0.5rem">
          <span className="inline-flex items-center justify-center w-2rem h-2rem bg-primary text-primary-foreground text-0.875rem font-semibold rounded-full">
            {stepNumber}
          </span>
          {totalSteps && (
            <span className="text-0.75rem text-muted-foreground font-medium">
              de {totalSteps}
            </span>
          )}
        </div>
      )}
      
      {/* Título */}
      <h2 className="text-1.5rem sm:text-1.75rem lg:text-2rem font-bold text-foreground leading-tight tracking-tight">
        {title}
      </h2>
      
      {/* Descrição */}
      {description && (
        <p className="text-0.875rem sm:text-1rem text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
