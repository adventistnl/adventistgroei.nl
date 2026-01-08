"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, Map, Building2, Church, Building } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

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
   * Card title
   */
  title?: string
  
  /**
   * Card description
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
 * A reusable card component for displaying hierarchical organizational structures
 * with visual indentation and border indicators.
 * 
 * @example
 * ```tsx
 * <HierarchicalStructureCard
 *   title="Hierarchical Structure"
 *   description="The institutional structure follows a clear hierarchy"
 *   icon={Map}
 *   levels={[
 *     {
 *       title: 'Institution Level',
 *       icon: Building2,
 *       description: '5 institutions with 12 departments',
 *       details: 'Top-level organizational units',
 *       borderColor: 'border-primary/30',
 *       indent: 0
 *     },
 *     {
 *       title: 'Regions',
 *       icon: Map,
 *       description: '3 regions managing 45 churches',
 *       borderColor: 'border-blue-500/30',
 *       indent: 1
 *     }
 *   ]}
 *   footer={
 *     <div className="p-3 bg-muted/30 rounded-lg">
 *       <div className="text-xs font-medium">Hierarchy Flow:</div>
 *       <div className="text-xs text-muted-foreground font-mono">
 *         Institution → Regions → Churches → Departments
 *       </div>
 *     </div>
 *   }
 * />
 * ```
 */
export function HierarchicalStructureCard({
  title = "Hierarchical Structure",
  description = "The institutional structure follows a clear hierarchy",
  icon: Icon = Map,
  levels,
  loading = false,
  footer,
  className = ""
}: HierarchicalStructureCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getIndentClass = (indent: number = 0) => {
    const indentMap: Record<number, string> = {
      0: 'pl-4',
      1: 'pl-8',
      2: 'pl-12',
      3: 'pl-16'
    }
    return indentMap[indent] || 'pl-4'
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {levels.map((level, index) => (
            <div 
              key={index}
              className={`${getIndentClass(level.indent)} border-l-4 ${level.borderColor || 'border-muted/30'}`}
            >
              <div className={`font-semibold ${level.indent === 0 ? 'text-lg' : 'text-base'} mb-2 flex items-center gap-2`}>
                <level.icon className="w-4 h-4" />
                {level.title}
              </div>
              <div className="text-sm text-muted-foreground">
                {level.description}
              </div>
              {level.details && (
                <div className="text-xs text-muted-foreground mt-1">
                  {level.details}
                </div>
              )}
            </div>
          ))}

          {footer && (
            <div className="mt-4">
              {footer}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
