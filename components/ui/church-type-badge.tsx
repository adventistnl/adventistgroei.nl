import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sprout, Building2, Church } from "lucide-react"

export type ChurchType = "STANDARD" | "PLANT" | "COMPANY"

export interface ChurchTypeBadgeProps {
  /** Church type - STANDARD, PLANT, or COMPANY */
  type: ChurchType
  /** Additional CSS classes */
  className?: string
  /** Show icon */
  showIcon?: boolean
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

const typeConfig: Record<ChurchType, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  className: string
  borderStyle: string
}> = {
  STANDARD: {
    label: "Standard",
    icon: Church,
    className: "bg-gray-50 text-gray-900 border-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-100",
    borderStyle: "border-2"
  },
  PLANT: {
    label: "Church Plant",
    icon: Sprout,
    className: "bg-green-50 text-green-700 border-green-600 dark:bg-green-950 dark:text-green-300 dark:border-green-500",
    borderStyle: "border-2 border-dashed"
  },
  COMPANY: {
    label: "Company",
    icon: Building2,
    className: "bg-orange-50 text-orange-700 border-orange-600 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-500",
    borderStyle: "border-2"
  }
}

const sizeStyles: Record<"sm" | "md" | "lg", { badge: string; icon: string }> = {
  sm: {
    badge: "text-xs px-2 py-0.5",
    icon: "w-3 h-3"
  },
  md: {
    badge: "text-sm px-2.5 py-1",
    icon: "w-3.5 h-3.5"
  },
  lg: {
    badge: "text-base px-3 py-1.5",
    icon: "w-4 h-4"
  }
}

/**
 * ChurchTypeBadge - Badge component for church types with icons
 * 
 * Features:
 * - Three church types: STANDARD (black), PLANT (green dashed), COMPANY (orange)
 * - Optional icon display
 * - Multiple size options
 * - Dark mode support
 * - Custom border styles per type
 * 
 * @example
 * ```tsx
 * <ChurchTypeBadge type="PLANT" showIcon />
 * <ChurchTypeBadge type="COMPANY" size="lg" />
 * <ChurchTypeBadge type="STANDARD" />
 * ```
 */
export const ChurchTypeBadge: React.FC<ChurchTypeBadgeProps> = ({
  type,
  className,
  showIcon = true,
  size = "sm"
}) => {
  const config = typeConfig[type]
  const Icon = config.icon
  const sizeClass = sizeStyles[size]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        config.className,
        config.borderStyle,
        sizeClass.badge,
        "flex items-center gap-1.5 font-medium",
        className
      )}
    >
      {showIcon && <Icon className={sizeClass.icon} />}
      {config.label}
    </Badge>
  )
}
