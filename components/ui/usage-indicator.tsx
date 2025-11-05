import React from "react"
import { cn } from "@/lib/utils"

export interface UsageIndicatorProps {
  /** The usage percentage value (0-100) */
  percentage: number
  /** Whether the indicator should be disabled/dimmed */
  disabled?: boolean
  /** Size variant of the indicator */
  size?: "sm" | "md" | "lg"
  /** Color variant based on thresholds */
  variant?: "default" | "success" | "warning" | "danger"
  /** Show only the bar without percentage text */
  barOnly?: boolean
  /** Custom className for the container */
  className?: string
}

const sizeStyles = {
  sm: {
    text: "text-xs",
    bar: "w-12 h-1.5",
    gap: "space-y-1"
  },
  md: {
    text: "text-xs",
    bar: "w-16 h-2",
    gap: "space-y-2"
  },
  lg: {
    text: "text-sm",
    bar: "w-20 h-2.5",
    gap: "space-y-2"
  }
}

const variantStyles = {
  default: "bg-gray-600",
  success: "bg-green-600",
  warning: "bg-yellow-600",
  danger: "bg-red-600"
}

/**
 * Determines the color variant based on percentage thresholds
 * - 0-75%: success (green)
 * - 75-90%: warning (yellow)
 * - 90-100%: danger (red)
 */
const getAutoVariant = (percentage: number): "success" | "warning" | "danger" => {
  if (percentage > 90) return "danger"
  if (percentage > 75) return "warning"
  return "success"
}

/**
 * UsageIndicator - A reusable component for displaying budget/resource usage
 * 
 * Features:
 * - Progress bar visualization
 * - Percentage text display
 * - Multiple size options
 * - Auto-calculated color variants based on thresholds
 * - Disabled state support
 * - Customizable colors
 * 
 * @example
 * ```tsx
 * <UsageIndicator percentage={75} />
 * <UsageIndicator percentage={92} size="lg" />
 * <UsageIndicator percentage={50} variant="success" disabled />
 * <UsageIndicator percentage={85} barOnly />
 * ```
 */
export const UsageIndicator: React.FC<UsageIndicatorProps> = ({
  percentage,
  disabled = false,
  size = "md",
  variant,
  barOnly = false,
  className
}) => {
  // Clamp percentage between 0 and 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  
  // Determine color variant
  const colorVariant = variant || getAutoVariant(clampedPercentage)
  const barColor = variantStyles[colorVariant]
  
  const sizeStyle = sizeStyles[size]

  if (barOnly) {
    return (
      <div 
        className={cn(
          sizeStyle.bar,
          "bg-gray-200 rounded-full border border-gray-300",
          disabled && "opacity-50",
          className
        )}
      >
        <div 
          className={cn(
            barColor,
            "h-full rounded-full transition-all duration-300"
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-center",
        sizeStyle.gap,
        disabled && "opacity-50",
        className
      )}
    >
      <div className={cn(sizeStyle.text, "font-medium text-gray-700")}>
        {clampedPercentage}%
      </div>
      <div 
        className={cn(
          sizeStyle.bar,
          "bg-gray-200 rounded-full border border-gray-300"
        )}
      >
        <div 
          className={cn(
            barColor,
            "h-full rounded-full transition-all duration-300"
          )}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  )
}
