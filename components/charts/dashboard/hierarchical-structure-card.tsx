"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, Map, ChevronRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "react-i18next"
import { hierarchicalStructureTranslations } from "@/lib/translations/hierarchical-structure"
import { cn } from "@/lib/utils"

export interface HierarchyLevel {
  /**
   * Title of the hierarchy level
   */
  title: string
  
  /**
   * Icon for the level
   */
  icon: LucideIcon
  
  /**
   * Description with statistics
   */
  description: string
  
  /**
   * Additional details
   */
  details?: string
  
  /**
   * Border color class (e.g., 'border-primary/30')
   */
  borderColor?: string
  
  /**
   * Indentation level (0, 1, 2, 3)
   * @default 0
   */
  indent?: number
}

export interface HierarchicalStructureCardProps {
  /**
   * Card title (optional - uses i18n default if not provided)
   */
  title?: string
  
  /**
   * Card description (optional - uses i18n default if not provided)
   */
  description?: string
  
  /**
   * Optional icon for the title
   */
  icon?: LucideIcon
  
  /**
   * Hierarchy levels to display
   */
  levels: HierarchyLevel[]
  
  /**
   * Whether the card is loading
   */
  loading?: boolean
  
  /**
   * Footer content (hierarchy flow or summary)
   */
  footer?: React.ReactNode
  
  /**
   * Custom className
   */
  className?: string
}

/**
 * HierarchicalStructureCard Component
 * 
 * Modern and minimalist card component for displaying hierarchical organizational structures.
 * Features clean design with subtle visual hierarchy and full i18n support.
 */
export function HierarchicalStructureCard({
  title,
  description,
  icon: Icon = Map,
  levels,
  loading = false,
  footer,
  className = ""
}: HierarchicalStructureCardProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = hierarchicalStructureTranslations[currentLanguage as keyof typeof hierarchicalStructureTranslations] || hierarchicalStructureTranslations.en

  // Use i18n default if not provided
  const displayTitle = title || t.title
  const displayDescription = description || t.description

  if (loading) {
    return (
      <Card className={cn("h-full flex flex-col", className)}>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-56 mt-1.5" />
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="w-4 h-4 text-muted-foreground" />
          {displayTitle}
        </CardTitle>
        <CardDescription className="text-xs">{displayDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-1 overflow-y-auto">
        {levels.map((level, index) => {
          const isLast = index === levels.length - 1
          
          return (
            <div key={index} className="group">
              {/* Level Container */}
              <div 
                className={cn(
                  "relative py-3 px-3 rounded-lg transition-all duration-200",
                  "hover:bg-muted/40",
                  level.indent && level.indent > 0 && "ml-4"
                )}
              >
                {/* Connector Line */}
                {!isLast && (
                  <div 
                    className={cn(
                      "absolute left-[22px] top-[42px] w-[2px] h-[calc(100%+4px)]",
                      "bg-gradient-to-b from-muted-foreground/20 to-transparent"
                    )}
                  />
                )}
                
                {/* Icon Circle */}
                <div className={cn(
                  "absolute left-3 top-3 w-6 h-6 rounded-full flex items-center justify-center",
                  "bg-background border-2 transition-colors duration-200",
                  level.borderColor?.replace('border-', 'border-') || "border-muted-foreground/20",
                  "group-hover:scale-110"
                )}>
                  <level.icon className="w-3 h-3 text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="pl-9">
                  {/* Title */}
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={cn(
                      "font-semibold",
                      level.indent === 0 ? "text-sm" : "text-xs"
                    )}>
                      {level.title}
                    </h4>
                    {level.indent && level.indent > 0 && (
                      <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-1">
                    {level.description}
                  </p>
                  
                  {/* Details */}
                  {level.details && (
                    <p className="text-[10px] text-muted-foreground/70 italic">
                      {level.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Footer */}
        {footer && (
          <div className="mt-4 pt-3 border-t">
            {footer}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
