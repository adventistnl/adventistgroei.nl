"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface StepHeadProps {
  title: string
  description: string
  className?: string
}

export function StepHead({ 
  title, 
  description, 
  className 
}: StepHeadProps) {
  return (
    <div className={cn("text-center space-y-0.5rem", className)}>
      <h2 className="text-1.25rem sm:text-1.5rem lg:text-1.75rem font-bold text-foreground leading-tight">
        {title}
      </h2>
      <p className="text-0.875rem sm:text-1rem text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
