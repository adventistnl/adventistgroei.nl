import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export type TagBadgeVariant = 
  | "blue" 
  | "green" 
  | "red" 
  | "yellow" 
  | "purple" 
  | "orange"
  | "cyan"
  | "indigo"
  | "pink"
  | "gray"

export interface TagBadgeProps {
  /** The label text to display */
  label: string
  /** Color variant for the dot and text */
  variant?: TagBadgeVariant
  /** Optional icon component to display */
  icon?: LucideIcon
  /** Additional CSS classes */
  className?: string
  /** Size variant */
  size?: "xs" | "sm" | "md"
  /** Click handler */
  onClick?: () => void
}

const variantStyles: Record<TagBadgeVariant, { text: string; dot: string }> = {
  blue: {
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500"
  },
  green: {
    text: "text-green-700 dark:text-green-400",
    dot: "bg-green-500"
  },
  red: {
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500"
  },
  yellow: {
    text: "text-yellow-700 dark:text-yellow-400",
    dot: "bg-yellow-500"
  },
  purple: {
    text: "text-purple-700 dark:text-purple-400",
    dot: "bg-purple-500"
  },
  orange: {
    text: "text-orange-700 dark:text-orange-400",
    dot: "bg-orange-500"
  },
  cyan: {
    text: "text-cyan-700 dark:text-cyan-400",
    dot: "bg-cyan-500"
  },
  indigo: {
    text: "text-indigo-700 dark:text-indigo-400",
    dot: "bg-indigo-500"
  },
  pink: {
    text: "text-pink-700 dark:text-pink-400",
    dot: "bg-pink-500"
  },
  gray: {
    text: "text-gray-700 dark:text-gray-400",
    dot: "bg-gray-500"
  }
}

const sizeStyles: Record<"xs" | "sm" | "md", { badge: string; dot: string; icon: string }> = {
  xs: {
    badge: "text-[10px] px-2 py-0.5",
    dot: "w-1.5 h-1.5",
    icon: "w-2.5 h-2.5"
  },
  sm: {
    badge: "text-xs px-2.5 py-1",
    dot: "w-2 h-2",
    icon: "w-3 h-3"
  },
  md: {
    badge: "text-sm px-3 py-1",
    dot: "w-2.5 h-2.5",
    icon: "w-3.5 h-3.5"
  }
}

/**
 * TagBadge - A monochromatic badge component with colored dot and text
 * 
 * Features:
 * - White/transparent background for clean look
 * - Colored dot indicator on the left
 * - Colored text matching the dot
 * - Optional icon support
 * - Multiple size options
 * - Dark mode support
 * - Click handler support
 * 
 * @example
 * ```tsx
 * <TagBadge label="In Progress" variant="blue" />
 * <TagBadge label="High Priority" variant="orange" icon={Flag} />
 * <TagBadge label="Completed" variant="green" size="md" />
 * ```
 */
export const TagBadge: React.FC<TagBadgeProps> = ({
  label,
  variant = "gray",
  icon: Icon,
  className,
  size = "sm",
  onClick
}) => {
  const { text, dot } = variantStyles[variant]
  const sizeClass = sizeStyles[size]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700",
        text,
        sizeClass.badge,
        "flex items-center gap-1.5 font-medium",
        onClick && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <div 
        className={cn(
          "rounded-full",
          sizeClass.dot,
          dot
        )} 
      />
      {Icon && <Icon className={sizeClass.icon} />}
      {label}
    </Badge>
  )
}
