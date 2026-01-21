"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { 
  Building, 
  MoreHorizontal, 
  LucideIcon 
} from "lucide-react"

export interface EntityInfoCardAction {
  label: string
  icon: LucideIcon
  onClick: () => void
  variant?: "default" | "destructive"
  showSeparatorAfter?: boolean
}

export interface EntityInfoCardProps {
  /** Título do header (ex: "Entity Info", "Institution Info") */
  headerTitle?: string
  
  /** Nome da entidade (bold) */
  name: string
  
  /** Descrição da entidade (máximo 2 linhas com quebra) */
  description: string
  
  /** Ícone principal dinâmico (padrão: Building) */
  icon?: LucideIcon
  
  /** Ações disponíveis no dropdown */
  actions?: EntityInfoCardAction[]
  
  /** Badges customizáveis para exibir no footer */
  badges?: {
    label: string
    variant?: "default" | "secondary" | "outline"
    className?: string
  }[]
  
  /** Cor de destaque do card (padrão: gray para tema) */
  accentColor?: "gray" | "blue" | "purple" | "green" | "orange" | "red"
  
  /** Classes CSS adicionais */
  className?: string
  
  /** Callback quando o card é clicado */
  onClick?: () => void
  
  /** Inverter tema: dark bg com light text no light mode, e vice-versa */
  invertTheme?: boolean
}

// Aliases para compatibilidade com código existente
export type InstitutionInfoCardAction = EntityInfoCardAction
export type InstitutionInfoCardProps = Omit<EntityInfoCardProps, 'name' | 'description'> & {
  /** @deprecated Use name */
  title?: string
  /** @deprecated Use description */
  subtitle?: string
  /** Backward compatibility */
  name?: string
  description?: string
  /** @deprecated Use badges */
  status?: "active" | "inactive"
  /** @deprecated Use badges */
  establishedYear?: number
  /** @deprecated Use badges */
  language?: string
}

/**
 * Card genérico e reutilizável para exibir informações de entidades
 * Ideal para uso no carrossel de KPI Cards ou grids
 */
export function EntityInfoCard(props: EntityInfoCardProps) {
  const {
    headerTitle = "Entity Info",
    name,
    description,
    icon: Icon = Building,
    actions = [],
    badges = [],
    accentColor = "gray",
    className,
    onClick,
    invertTheme = false,
  } = props
  
  // Backward compatibility - casting para acessar props antigas
  const legacyProps = props as InstitutionInfoCardProps
  const legacyTitle = legacyProps.title
  const legacySubtitle = legacyProps.subtitle
  const status = legacyProps.status
  const establishedYear = legacyProps.establishedYear
  const language = legacyProps.language
  
  // Suporte a props antigas (backward compatibility)
  const displayName = name || legacyTitle || ""
  const displayDescription = description || legacySubtitle || ""
  
  // Criar badges automaticamente se usar props antigas
  const displayBadges = badges.length > 0 ? badges : []
  
  if (status && badges.length === 0) {
    const isActive = status === "active"
    displayBadges.push({
      label: isActive ? "Active" : "Inactive",
      variant: isActive ? "default" : "secondary",
      className: cn(
        "text-xs",
        isActive 
          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" 
          : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
      )
    })
  }
  
  if (establishedYear && badges.length === 0) {
    displayBadges.push({
      label: `Est. ${establishedYear}`,
      variant: "outline",
      className: "text-xs font-normal"
    })
  }
  
  if (language && badges.length === 0) {
    displayBadges.push({
      label: language.toUpperCase(),
      variant: "outline",
      className: "text-xs font-mono"
    })
  }
  
  // Mapa de cores de destaque (gray como padrão theme-aware)
  const accentColorMap = {
    gray: {
      bg: "bg-muted/30",
      border: "border-muted",
      icon: "text-muted-foreground",
      iconBg: "bg-muted/50",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      icon: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/50",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-950/30",
      border: "border-orange-200 dark:border-orange-800",
      icon: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-900/50",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/50",
    },
  }

  const colors = accentColorMap[accentColor]

  return (
    <Card 
      className={cn(
        "w-full h-full flex flex-col relative",
        invertTheme ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 border-gray-800 dark:border-gray-200" : cn(colors.bg, colors.border),
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col h-full space-y-3">
        {/* Header - Título do card, Action Button e Ícone */}
        <div className="flex items-center justify-between">
          {/* Título do Header */}
          <h4 className={cn(
            "text-xs font-medium uppercase tracking-wide",
            invertTheme ? "text-white/70 dark:text-gray-900/70" : "text-muted-foreground"
          )}>
            {headerTitle}
          </h4>

          {/* Action Button e Ícone no extremo direito */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Menu de Ações */}
            {actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "h-7 w-7 p-0",
                      invertTheme ? "hover:bg-white/20 dark:hover:bg-gray-900/20 text-white dark:text-gray-900" : "hover:bg-background/80"
                    )}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {actions.map((action, index) => (
                    <React.Fragment key={index}>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          action.onClick()
                        }}
                        className={action.variant === "destructive" ? "text-red-600" : ""}
                      >
                        <action.icon className="mr-2 h-4 w-4" />
                        {action.label}
                      </DropdownMenuItem>
                      {action.showSeparatorAfter && <DropdownMenuSeparator />}
                    </React.Fragment>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {/* Ícone Dinâmico */}
            <div className={cn(
              "p-1.5 rounded-md border",
              invertTheme ? "bg-white/20 dark:bg-gray-900/20 border-white/30 dark:border-gray-900/30" : cn(colors.iconBg, colors.border)
            )}>
              <Icon className={cn(
                "h-4 w-4",
                invertTheme ? "text-white dark:text-gray-900" : colors.icon
              )} />
            </div>
          </div>
        </div>

        {/* Conteúdo - Nome (bold) e Descrição */}
        <div className="flex-1 space-y-1">
          {/* Nome da entidade (bold) */}
          <h3 className="font-bold text-base leading-tight line-clamp-1">
            {displayName}
          </h3>
          
          {/* Descrição */}
          <p className={cn(
            "text-xs leading-relaxed line-clamp-2",
            invertTheme ? "text-white/80 dark:text-gray-900/80" : "text-muted-foreground"
          )}>
            {displayDescription}
          </p>
        </div>

        {/* Footer com badges (tags info) */}
        {displayBadges.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {displayBadges.map((badge, index) => (
              <Badge 
                key={index}
                variant={badge.variant || "default"}
                className={badge.className}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Alias para compatibilidade com código existente
export const InstitutionInfoCard = EntityInfoCard

/**
 * Função helper para criar EntityInfoCard dentro do carrossel de KPI Cards
 */
export function createEntityKPICard(
  props: EntityInfoCardProps
): React.ReactNode {
  return <EntityInfoCard {...props} />
}

// Alias para compatibilidade
export const createInstitutionKPICard = createEntityKPICard
