"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { StepHead } from "./step-head"
import { StepFields } from "./step-fields"
import { StepProgress } from "./step-progress"
import { StepNavigation } from "./step-navigation"

interface Step {
  id: string
  title: string
  description: string
  fields: React.ReactNode
  validation?: () => Promise<boolean>
}

interface MultiStepFormProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  onSubmit: () => void
  isSubmitting?: boolean
  className?: string
  // Navigation labels
  previousLabel?: string
  nextLabel?: string
  submitLabel?: string
  submittingLabel?: string
  // Styling options
  showStepperAtTop?: boolean
  stepperVariant?: "circles" | "progress" | "both"
  // Gap customization
  headGap?: string
  fieldsGap?: string
  navigationGap?: string
  stepperGap?: string
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  onSubmit,
  isSubmitting = false,
  className,
  previousLabel = "Previous",
  nextLabel = "Next", 
  submitLabel = "Submit",
  submittingLabel = "Submitting...",
  showStepperAtTop = false,
  stepperVariant = "circles",
  headGap = "2rem",
  fieldsGap = "2rem",
  navigationGap = "1.5rem",
  stepperGap = "1.5rem"
}: MultiStepFormProps) {
  const totalSteps = steps.length
  const currentStepData = steps[currentStep - 1]
  const isLastStep = currentStep === totalSteps

  // Handle Enter key press for auto-advance
  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      if (isLastStep) {
        onSubmit()
      } else {
        // Validate current step if validation function exists
        if (currentStepData.validation) {
          const isValid = await currentStepData.validation()
          if (isValid) {
            onStepChange(currentStep + 1)
          }
        } else {
          onStepChange(currentStep + 1)
        }
      }
    }
  }

  const handleNext = async () => {
    if (isLastStep) {
      onSubmit()
    } else {
      // Validate current step if validation function exists
      if (currentStepData.validation) {
        const isValid = await currentStepData.validation()
        if (isValid) {
          onStepChange(currentStep + 1)
        }
      } else {
        onStepChange(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange(currentStep - 1)
    }
  }

  return (
    <div 
      className={cn("w-full flex flex-col", className)} 
      onKeyDown={handleKeyPress}
      style={{ gap: "2rem" }}
    >
      
      {/* Stepper at Top (optional) */}
      {showStepperAtTop && (
        <StepProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          variant={stepperVariant}
          className="mb-1rem"
        />
      )}
      
      {/* Head: Step Title and Description */}
      <StepHead
        title={currentStepData.title}
        description={currentStepData.description}
        className="mb-1rem"
      />

      {/* Fields: Current Step Content */}
      <StepFields 
        className="mb-1rem"
        gap="1.5rem"
      >
        {currentStepData.fields}
      </StepFields>

      {/* Navigation Buttons */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isSubmitting={isSubmitting}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        submitLabel={submitLabel}
        submittingLabel={submittingLabel}
        className="mb-1rem"
      />

      {/* Stepper at Bottom (default) */}
      {!showStepperAtTop && (
        <StepProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          variant={stepperVariant}
        />
      )}
    </div>
  )
}
