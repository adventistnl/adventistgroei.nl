"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuickAction {
  id: string
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  disabled?: boolean
  className?: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  className?: string
  showTitle?: boolean
  size?: "sm" | "default" | "lg"
  orientation?: "horizontal" | "vertical"
  maxColumns?: number
}

export function QuickActions({
  actions,
  title = "Quick Actions:",
  className,
  showTitle = true,
  size = "sm",
  orientation = "horizontal",
  maxColumns = 4
}: QuickActionsProps) {
  if (actions.length === 0) {
    return null
  }

  const containerClasses = cn(
    "flex items-start gap-2",
    orientation === "horizontal" 
      ? "flex-row flex-wrap" 
      : "flex-col",
    className
  )

  const gridClasses = cn(
    "flex gap-2",
    orientation === "horizontal" 
      ? "flex-wrap" 
      : "flex-col w-full",
  )

  return (
    <div className={containerClasses}>
      {showTitle && (
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap py-2">
          {title}
        </span>
      )}
      <div className={gridClasses}>
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              size={size}
              variant={action.variant || "outline"}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "flex-shrink-0",
                orientation === "vertical" && "w-full justify-start",
                action.className
              )}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

// Variante compacta para uso em toolbars
export function QuickActionsCompact({
  actions,
  className,
  size = "sm"
}: Omit<QuickActionsProps, "title" | "showTitle" | "orientation">) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.id}
            size={size}
            variant={action.variant || "outline"}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn("flex-shrink-0", action.className)}
          >
            <Icon className="w-4 h-4 mr-1.5" />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

// Variante em grid responsivo
export function QuickActionsGrid({
  actions,
  title,
  showTitle = true,
  className,
  size = "sm",
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  }
}: QuickActionsProps & {
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}) {
  const gridCols = {
    sm: `grid-cols-${columns.sm || 1}`,
    md: `md:grid-cols-${columns.md || 2}`,
    lg: `lg:grid-cols-${columns.lg || 3}`,
    xl: `xl:grid-cols-${columns.xl || 4}`
  }

  return (
    <div className={cn("space-y-3", className)}>
      {showTitle && title && (
        <h3 className="text-sm font-medium text-muted-foreground">
          {title}
        </h3>
      )}
      <div className={cn(
        "grid gap-2",
        gridCols.sm,
        gridCols.md,
        gridCols.lg,
        gridCols.xl
      )}>
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              size={size}
              variant={action.variant || "outline"}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn("w-full justify-start", action.className)}
            >
              <Icon className="w-4 h-4 mr-1.5" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
