"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LucideIcon, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { quickActionsTranslations } from "@/lib/translations/quick-actions"

export interface QuickAction {
  id: string
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  disabled?: boolean
  className?: string
  description?: string
}

interface QuickActionsProps {
  actions: QuickAction[]
  title?: string
  className?: string
  showTitle?: boolean
  size?: "sm" | "default" | "lg"
  orientation?: "horizontal" | "vertical"
  maxColumns?: number
  helpText?: string
}

export function QuickActions({
  actions,
  title,
  className,
  showTitle = false,
  size = "sm",
  orientation = "horizontal",
  maxColumns = 4,
  helpText
}: QuickActionsProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = quickActionsTranslations[currentLanguage as keyof typeof quickActionsTranslations] || quickActionsTranslations.en
  
  const displayTitle = title || t.quickActions
  const displayHelpText = helpText || t.defaultHelpText

  if (actions.length === 0) {
    return null
  }

  const containerClasses = cn(
    "relative rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-3 sm:p-4 mt-4 shadow-sm hover:shadow-md transition-all duration-200",
    "hover:border-border hover:bg-card/50",
    className
  )

  const gridClasses = cn(
    "flex gap-2",
    orientation === "horizontal" 
      ? "flex-wrap" 
      : "flex-col w-full",
  )

  return (
    <TooltipProvider>
      <div className={containerClasses}>
        {/* Info Icon with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 transition-colors">
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">{displayHelpText}</p>
          </TooltipContent>
        </Tooltip>

        <div className={gridClasses}>
          {actions.map((action) => {
            const Icon = action.icon
            const buttonContent = (
              <Button
                key={action.id}
                size={size}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  "flex-shrink-0 transition-all duration-200",
                  "hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white",
                  orientation === "vertical" && "w-full justify-start",
                  action.className
                )}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{action.label}</span>
                <span className="sm:hidden">{action.label.split(' ')[0]}</span>
              </Button>
            )

            if (action.description) {
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">{action.description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return buttonContent
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

// Variante compacta para uso em toolbars
export function QuickActionsCompact({
  actions,
  className,
  size = "sm",
  helpText
}: Omit<QuickActionsProps, "title" | "showTitle" | "orientation"> & { helpText?: string }) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = quickActionsTranslations[currentLanguage as keyof typeof quickActionsTranslations] || quickActionsTranslations.en
  
  const displayHelpText = helpText || t.defaultHelpText

  return (
    <TooltipProvider>
      <div className={cn(
        "relative rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-2 shadow-sm hover:shadow-md transition-all duration-200",
        "hover:border-border hover:bg-card/50",
        className
      )}>
        {/* Info Icon with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="absolute top-1.5 right-1.5 p-1 rounded-full hover:bg-muted/50 transition-colors z-10">
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">{displayHelpText}</p>
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-2 flex-wrap pr-6">
          {actions.map((action) => {
            const Icon = action.icon
            const buttonContent = (
              <Button
                key={action.id}
                size={size}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  "flex-shrink-0 transition-all duration-200",
                  "hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white",
                  action.className
                )}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            )

            if (action.description) {
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">{action.description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return buttonContent
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}

// Variante em grid responsivo
export function QuickActionsGrid({
  actions,
  title,
  showTitle = false,
  className,
  size = "sm",
  helpText,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  }
}: QuickActionsProps & {
  helpText?: string
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
}) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = quickActionsTranslations[currentLanguage as keyof typeof quickActionsTranslations] || quickActionsTranslations.en
  
  const displayTitle = title || t.quickActions
  const displayHelpText = helpText || t.defaultHelpText

  const gridCols = {
    sm: `grid-cols-${columns.sm || 1}`,
    md: `md:grid-cols-${columns.md || 2}`,
    lg: `lg:grid-cols-${columns.lg || 3}`,
    xl: `xl:grid-cols-${columns.xl || 4}`
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "relative rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200",
        "hover:border-border hover:bg-card/50",
        className
      )}>
        {/* Info Icon with Tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted/50 transition-colors z-10">
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-xs">
            <p className="text-xs">{displayHelpText}</p>
          </TooltipContent>
        </Tooltip>

        {showTitle && displayTitle && (
          <h3 className="text-sm font-medium text-muted-foreground mb-3 pr-8">
            {displayTitle}
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
            const buttonContent = (
              <Button
                key={action.id}
                size={size}
                variant={action.variant || "outline"}
                onClick={action.onClick}
                disabled={action.disabled}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  "hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white",
                  action.className
                )}
              >
                <Icon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="truncate">{action.label}</span>
              </Button>
            )

            if (action.description) {
              return (
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    {buttonContent}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">{action.description}</p>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return buttonContent
          })}
        </div>
      </div>
    </TooltipProvider>
  )
}
