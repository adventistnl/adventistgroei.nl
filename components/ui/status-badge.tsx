import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export type StatusBadgeVariant = 
  | "success" 
  | "warning" 
  | "error" 
  | "info" 
  | "neutral" 
  | "default"

export interface StatusBadgeProps {
  /** The label text to display */
  label: string
  /** Visual variant defining colors */
  variant?: StatusBadgeVariant
  /** Optional icon component to display */
  icon?: LucideIcon
  /** Show a colored dot indicator */
  showDot?: boolean
  /** Custom dot color (overrides variant color) */
  dotColor?: string
  /** Additional CSS classes */
  className?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

const variantStyles: Record<StatusBadgeVariant, string> = {
  success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800",
  error: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  neutral: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
  default: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
}

const dotColors: Record<StatusBadgeVariant, string> = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-gray-400",
  default: "bg-gray-500"
}

const sizeStyles: Record<"sm" | "md" | "lg", { badge: string; dot: string; icon: string }> = {
  sm: {
    badge: "text-xs px-2 py-0.5",
    dot: "w-1.5 h-1.5",
    icon: "w-3 h-3"
  },
  md: {
    badge: "text-sm px-2.5 py-1",
    dot: "w-2 h-2",
    icon: "w-3.5 h-3.5"
  },
  lg: {
    badge: "text-base px-3 py-1.5",
    dot: "w-2.5 h-2.5",
    icon: "w-4 h-4"
  }
}

/**
 * StatusBadge - A consistent, reusable badge component for status indicators
 * 
 * Features:
 * - Pre-defined color variants (success, warning, error, info, neutral, default)
 * - Optional dot indicator
 * - Optional icon support
 * - Multiple size options
 * - Dark mode support
 * - Fully customizable with className prop
 * 
 * @example
 * ```tsx
 * <StatusBadge label="Active" variant="success" showDot />
 * <StatusBadge label="Pending" variant="warning" icon={Clock} />
 * <StatusBadge label="Error" variant="error" size="lg" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = "default",
  icon: Icon,
  showDot = false,
  dotColor,
  className,
  size = "sm"
}) => {
  const variantClass = variantStyles[variant]
  const defaultDotColor = dotColors[variant]
  const sizeClass = sizeStyles[size]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        variantClass,
        sizeClass.badge,
        "flex items-center gap-1.5 font-medium",
        className
      )}
    >
      {showDot && (
        <div 
          className={cn(
            "rounded-full",
            sizeClass.dot,
            !dotColor && defaultDotColor
          )}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
      )}
      {Icon && <Icon className={sizeClass.icon} />}
      {label}
    </Badge>
  )
}
