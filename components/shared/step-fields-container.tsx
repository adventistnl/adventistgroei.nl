"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepFieldsContainerProps {
  children: React.ReactNode
  className?: string
  layout?: "flex" | "grid" | "stack"
  gap?: string
  maxWidth?: string
}

export function StepFieldsContainer({ 
  children, 
  className,
  layout = "stack",
  gap = "2.5rem",
  maxWidth = "none"
}: StepFieldsContainerProps) {
  const getLayoutClasses = () => {
    switch (layout) {
      case "grid":
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.75rem"
      case "flex":
        return "flex flex-col"
      case "stack":
      default:
        return "space-y-1.5rem"
    }
  }

  const containerStyle = {
    gap: layout !== "stack" ? gap : undefined,
    maxWidth: maxWidth !== "none" ? maxWidth : undefined
  }

  return (
    <div 
      className={cn(
        getLayoutClasses(),
        className
      )}
      style={containerStyle}
    >
      {children}
    </div>
  )
}
