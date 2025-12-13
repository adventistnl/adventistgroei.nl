"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface GridItem {
  /** Unique identifier for the item */
  id: string
  /** Component to render */
  component: React.ReactNode
  /** Grid column span (e.g., "col-span-8", "col-span-4") */
  colSpan?: string
  /** Optional custom className */
  className?: string
}

interface GridContainerProps {
  /** Array of grid items to render */
  items: GridItem[]
  /** Total number of grid columns (default: 12) */
  totalColumns?: number
  /** Gap between grid items */
  gap?: "none" | "sm" | "md" | "lg"
  /** Optional custom className for the container */
  className?: string
}

export function GridContainer({
  items,
  totalColumns = 12,
  gap = "md",
  className,
}: GridContainerProps) {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }

  return (
    <div
      className={cn(
        "grid",
        `grid-cols-${totalColumns}`,
        gapClasses[gap],
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            item.colSpan || `col-span-${totalColumns}`,
            item.className
          )}
        >
          {item.component}
        </div>
      ))}
    </div>
  )
}
