"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepFieldsProps {
  children: React.ReactNode
  className?: string
  layout?: "flex" | "grid"
  gap?: string
}

export function StepFields({ 
  children, 
  className,
  layout = "flex",
  gap = "1.5rem"
}: StepFieldsProps) {
  const layoutClasses = layout === "grid" 
    ? "grid grid-cols-1 sm:grid-cols-2 gap-0.75rem"
    : "flex flex-col"
  
  return (
    <div 
      className={cn(
        layoutClasses,
        className
      )}
      style={{ gap: gap }}
    >
      {children}
    </div>
  )
}
