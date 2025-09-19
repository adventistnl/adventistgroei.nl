"use client"

import * as React from "react"
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepButtonsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  isSubmitting?: boolean
  previousLabel?: string
  nextLabel?: string
  submitLabel?: string
  submittingLabel?: string
  className?: string
  variant?: "default" | "minimal" | "modern"
}

export function StepButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false,
  previousLabel = "Previous",
  nextLabel = "Next",
  submitLabel = "Submit",
  submittingLabel = "Submitting...",
  className,
  variant = "modern"
}: StepButtonsProps) {
  const isLastStep = currentStep === totalSteps

  const getVariantClasses = () => {
    switch (variant) {
      case "minimal":
        return {
          container: "flex justify-between items-center",
          previous: "h-2.5rem px-1.25rem text-0.875rem",
          next: "h-2.5rem px-1.25rem text-0.875rem"
        }
      case "default":
        return {
          container: "flex justify-between items-center gap-1rem",
          previous: "h-3rem px-1.5rem text-1rem",
          next: "h-3rem px-1.5rem text-1rem"
        }
      case "modern":
      default:
        return {
          container: "flex justify-between items-center gap-1rem pt-2rem",
          previous: "h-3rem px-2rem text-0.875rem font-medium",
          next: "h-3rem px-2rem text-0.875rem font-medium"
        }
    }
  }

  const classes = getVariantClasses()

  return (
    <div className={cn(classes.container, className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={cn(
          "flex items-center gap-0.75rem transition-all duration-200",
          classes.previous,
          "hover:bg-muted/50 border-2 hover:border-primary/30"
        )}
      >
        <ArrowLeft className="w-1.125rem h-1.125rem" />
        <span className="hidden sm:inline">{previousLabel}</span>
        <span className="sm:hidden">Back</span>
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className={cn(
          "flex items-center gap-0.75rem transition-all duration-200",
          classes.next,
          "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl",
          isSubmitting && "opacity-75 cursor-not-allowed"
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-1.125rem h-1.125rem animate-spin" />
            <span className="hidden sm:inline">{submittingLabel}</span>
            <span className="sm:hidden">...</span>
          </>
        ) : isLastStep ? (
          <>
            <CheckCircle className="w-1.125rem h-1.125rem" />
            <span className="hidden sm:inline">{submitLabel}</span>
            <span className="sm:hidden">Finish</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">{nextLabel}</span>
            <span className="sm:hidden">Next</span>
            <ArrowLeft className="w-1.125rem h-1.125rem rotate-180" />
          </>
        )}
      </Button>
    </div>
  )
}
