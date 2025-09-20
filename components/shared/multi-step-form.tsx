"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { StepTitle } from "./step-title"
import { StepFieldsContainer } from "./step-fields-container"
import { StepProgress } from "./step-progress"
import { StepButtons } from "./step-buttons"

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
  stepperVariant?: "circles" | "progress" | "both" | "modern" | "minimal"
  titleVariant?: "default" | "centered" | "left"
  buttonsVariant?: "default" | "minimal" | "modern"
  // Layout customization
  fieldsLayout?: "flex" | "grid" | "stack"
  containerGap?: string
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
  stepperVariant = "modern",
  titleVariant = "centered",
  buttonsVariant = "modern",
  fieldsLayout = "stack",
  containerGap = "2.5rem"
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
      className={cn("w-full flex mt-4 flex-col", className)} 
      onKeyDown={handleKeyPress}
      style={{ gap: containerGap }}
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
      
      {/* Title: Step Title and Description */}
      {/* <StepTitle
        title={currentStepData.title}
        description={currentStepData.description}
        variant={titleVariant}
        className="mb-1.5rem"
      /> */}

      {/* Fields: Current Step Content */}
      <StepFieldsContainer 
        layout={fieldsLayout}
        gap="2.5rem"
        className="mb-2rem"
      >
        {currentStepData.fields}
      </StepFieldsContainer>

      {/* Buttons: Navigation */}
      <StepButtons
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={handlePrevious}
        onNext={handleNext}
        isSubmitting={isSubmitting}
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        submitLabel={submitLabel}
        submittingLabel={submittingLabel}
        variant={buttonsVariant}
        className="mb-1.5rem"
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
