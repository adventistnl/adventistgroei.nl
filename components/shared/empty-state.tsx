"use client"

import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  /** Icon component from lucide-react */
  icon?: LucideIcon
  /** Main title text */
  title: string
  /** Optional description text */
  description?: string
  /** Icon size (default: h-5 w-5) */
  iconSize?: string
  /** Icon color (default: text-gray-400) */
  iconColor?: string
  /** Container background (default: bg-gray-50) */
  containerBg?: string
  /** Border style (default: border-2 border-dashed border-gray-200) */
  borderStyle?: string
  /** Title text size (default: text-xs) */
  titleSize?: string
  /** Description text size (default: text-xs) */
  descriptionSize?: string
  /** Padding (default: py-8 px-4) */
  padding?: string
  /** Custom className for the container */
  className?: string
  /** Full height mode - fills parent container */
  fullHeight?: boolean
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  iconSize = "h-5 w-5",
  iconColor = "text-gray-400 dark:text-gray-500",
  containerBg = "bg-gray-50 dark:bg-gray-800/30",
  borderStyle = "border-2 border-dashed border-gray-200 dark:border-gray-700",
  titleSize = "text-xs",
  descriptionSize = "text-xs",
  padding = "py-8 px-4",
  className,
  fullHeight = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg",
        borderStyle,
        containerBg,
        padding,
        fullHeight && "h-full w-full",
        className
      )}
    >
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/50">
          <Icon className={cn(iconSize, iconColor)} />
        </div>
      )}
      <h4 className={cn("mt-3 font-medium text-gray-900 dark:text-gray-100", titleSize)}>
        {title}
      </h4>
      {description && (
        <p className={cn("mt-1 text-gray-500 dark:text-gray-400 text-center max-w-sm", descriptionSize)}>
          {description}
        </p>
      )}
    </div>
  )
}
