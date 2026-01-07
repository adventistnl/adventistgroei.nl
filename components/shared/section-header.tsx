import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  /**
   * Title of the section
   */
  title: string
  
  /**
   * Optional icon to display before the title
   */
  icon?: LucideIcon
  
  /**
   * Optional description below the title
   */
  description?: string
  
  /**
   * Size variant for the header
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
  
  /**
   * Optional actions to render on the right side
   */
  actions?: React.ReactNode
  
  /**
   * Custom className for the container
   */
  className?: string
}

const sizeVariants = {
  sm: {
    title: "text-lg font-semibold",
    icon: "w-4 h-4",
    description: "text-xs"
  },
  default: {
    title: "text-xl font-semibold",
    icon: "w-5 h-5",
    description: "text-sm"
  },
  lg: {
    title: "text-2xl font-bold",
    icon: "w-6 h-6",
    description: "text-base"
  }
}

/**
 * SectionHeader Component
 * 
 * A reusable section header component with optional icon, description, and actions.
 * Commonly used to organize content into logical sections with consistent styling.
 * 
 * @example
 * ```tsx
 * <SectionHeader
 *   title="Institutional Structure"
 *   icon={Map}
 *   description="Overview of organizational hierarchy"
 *   actions={
 *     <Button size="sm">
 *       <Plus className="w-4 h-4 mr-2" />
 *       Add New
 *     </Button>
 *   }
 * />
 * ```
 */
export function SectionHeader({
  title,
  icon: Icon,
  description,
  size = "default",
  actions,
  className
}: SectionHeaderProps) {
  const variant = sizeVariants[size]

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className={cn(variant.title, "flex items-center gap-2")}>
          {Icon && <Icon className={variant.icon} />}
          {title}
        </h2>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      {description && (
        <p className={cn("text-muted-foreground mt-1", variant.description)}>
          {description}
        </p>
      )}
    </div>
  )
}
