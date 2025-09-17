"use client"

import * as React from "react"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
  variant?: "circles" | "progress" | "both"
}

export function StepProgress({ 
  currentStep, 
  totalSteps,
  className,
  variant = "circles"
}: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {variant === "circles" && (
        <div className="flex items-center gap-1rem">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1
            return (
              <div key={stepNumber} className="flex items-center">
                <div className={cn(
                  "w-2.5rem h-2.5rem rounded-full flex items-center justify-center text-0.875rem font-medium transition-all duration-300",
                  currentStep === stepNumber 
                    ? "bg-primary text-primary-foreground" 
                    : currentStep > stepNumber 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                )}>
                  {currentStep > stepNumber ? (
                    <CheckCircle className="w-1rem h-1rem" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < totalSteps && (
                  <div className={cn(
                    "w-2rem h-0.125rem mx-0.5rem transition-all duration-300",
                    currentStep > stepNumber ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {variant === "progress" && (
        <div className="w-full max-w-20rem">
          <div className="flex justify-between text-0.75rem text-muted-foreground mb-0.5rem">
            <span>Step {currentStep}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-0.5rem bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {variant === "both" && (
        <div className="w-full space-y-1rem">
          {/* Progress Bar */}
          <div className="w-full max-w-20rem mx-auto">
            <div className="flex justify-between text-0.75rem text-muted-foreground mb-0.5rem">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-0.5rem bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Circles */}
          <div className="flex items-center justify-center gap-1rem">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1
              return (
                <div key={stepNumber} className="flex items-center">
                  <div className={cn(
                    "w-2rem h-2rem rounded-full flex items-center justify-center text-0.75rem font-medium transition-all duration-300",
                    currentStep === stepNumber 
                      ? "bg-primary text-primary-foreground" 
                      : currentStep > stepNumber 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                  )}>
                    {currentStep > stepNumber ? (
                      <CheckCircle className="w-0.875rem h-0.875rem" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < totalSteps && (
                    <div className={cn(
                      "w-1.5rem h-0.125rem mx-0.375rem transition-all duration-300",
                      currentStep > stepNumber ? "bg-primary" : "bg-muted"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
