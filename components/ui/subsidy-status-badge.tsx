"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SubsidyStatusBadgeProps {
  /**
   * The icon to display in the badge
   */
  icon?: LucideIcon
  /**
   * The text to display in the badge
   */
  text: string
  /**
   * The variant/color scheme of the badge
   */
  variant?: "advance" | "refund-pending" | "refund-done" | "custom"
  /**
   * Custom colors for the badge (only used when variant is "custom")
   */
  customColors?: {
    bg: string
    text: string
    border: string
    darkBg?: string
    darkText?: string
    darkBorder?: string
  }
  /**
   * Additional className for the badge
   */
  className?: string
}

const variantStyles = {
  advance: "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
  "refund-pending": "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  "refund-done": "bg-green-50 text-green-700 border-green-300 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
  custom: ""
}

/**
 * A reusable badge component for displaying subsidy status information
 * Follows the same design pattern as AdvanceSubsidyBadge
 */
export function SubsidyStatusBadge({
  icon: Icon,
  text,
  variant = "custom",
  customColors,
  className
}: SubsidyStatusBadgeProps) {
  // Build custom color classes if provided
  const customColorClasses = customColors
    ? cn(
      customColors.bg,
      customColors.text,
      customColors.border,
      customColors.darkBg,
      customColors.darkText,
      customColors.darkBorder
    )
    : ""

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs px-1.5 py-0.5 h-4 font-medium flex items-center gap-0.5",
        variant !== "custom" ? variantStyles[variant] : customColorClasses,
        className
      )}
    >
      {Icon && <Icon className="w-2.5 h-2.5" />}
      <span>{text}</span>
    </Badge>
  )
}
