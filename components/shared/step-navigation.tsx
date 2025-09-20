"use client"

import * as React from "react"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StepNavigationProps {
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
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting = false,
  previousLabel = "Previous",
  nextLabel = "Next",
  submitLabel = "Submit",
  submittingLabel = "Submitting...",
  className
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps

  return (
    <div className={cn("flex justify-between items-center pt-1.5rem", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-0.5rem h-2.75rem px-1.5rem text-0.875rem"
      >
        <ArrowLeft className="w-1rem h-1rem" />
        {previousLabel}
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="flex items-center gap-0.5rem h-2.75rem px-1.5rem text-0.875rem"
      >
        {isSubmitting ? (
          <>
            <div className="w-1rem h-1rem border-2 border-white border-t-transparent rounded-full animate-spin" />
            {submittingLabel}
          </>
        ) : isLastStep ? (
          <>
            <CheckCircle className="w-1rem h-1rem" />
            {submitLabel}
          </>
        ) : (
          <>
            {nextLabel}
            <ArrowLeft className="w-1rem h-1rem rotate-180" />
          </>
        )}
      </Button>
    </div>
  )
}
