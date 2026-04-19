"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const subsidyStatusBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors",
  {
    variants: {
      variant: {
        advance:
          "bg-amber-50 text-amber-700 border-amber-400 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-600",
        "refund-pending":
          "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
        "refund-done":
          "bg-green-50 text-green-700 border-green-300 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        outline:
          "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SubsidyStatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof subsidyStatusBadgeVariants> {
  /**
   * The icon to display in the badge
   */
  icon?: LucideIcon
  /**
   * The text to display in the badge
   */
  text: string
}

/**
 * A reusable badge component for displaying subsidy status information
 * Follows the same design pattern as the base Badge component
 */
export function SubsidyStatusBadge({
  icon: Icon,
  text,
  variant,
  className,
  ...props
}: SubsidyStatusBadgeProps) {
  return (
    <span
      className={cn(subsidyStatusBadgeVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon className="w-3 h-3" />}
      <span>{text}</span>
    </span>
  )
}

export { subsidyStatusBadgeVariants }
