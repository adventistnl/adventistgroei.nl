"use client"

import React from "react"
import { LucideIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export interface ChartLegendItemProps {
  /** Ícone do Lucide React */
  icon?: LucideIcon
  /** Nome/label do item */
  label: string
  /** Descrição completa para exibir no tooltip */
  description?: string
  /** Cor do item (hex, rgb, ou nome de cor CSS) */
  color: string
  /** Se o item está ativo/selecionado */
  active?: boolean
  /** Valor/contador opcional */
  value?: number | string
  /** Formatador customizado para o valor */
  valueFormatter?: (value: number | string) => string
  /** Callback ao clicar no item */
  onClick?: () => void
  /** Classes CSS adicionais */
  className?: string
  /** Tamanho do ícone */
  iconSize?: "sm" | "md" | "lg"
  /** Variante visual */
  variant?: "default" | "compact" | "detailed"
}

export function ChartLegendItem({
  icon: Icon,
  label,
  description,
  color,
  active = true,
  value,
  valueFormatter,
  onClick,
  className,
  iconSize = "md",
  variant = "default"
}: ChartLegendItemProps) {
  // Tamanhos de ícone
  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }

  // Renderizar indicador de cor
  const ColorIndicator = () => (
    <div
      className={cn(
        "flex-shrink-0 transition-opacity rounded-md",
        active ? "opacity-100" : "opacity-40",
        variant === "compact" ? "w-3 h-3" : "w-4 h-4"
      )}
      style={{ backgroundColor: color }}
    />
  )

  // Renderizar ícone
  const IconElement = Icon ? (
    <Icon 
      className={cn(
        iconSizeClasses[iconSize],
        "flex-shrink-0 transition-opacity",
        active ? "opacity-100" : "opacity-40"
      )}
      style={{ color }}
    />
  ) : null

  // Renderizar valor
  const ValueElement = value !== undefined ? (
    <span 
      className={cn(
        "font-medium tabular-nums transition-opacity",
        active ? "opacity-100" : "opacity-40",
        variant === "compact" ? "text-xs" : "text-sm"
      )}
    >
      {valueFormatter ? valueFormatter(value) : value}
    </span>
  ) : null

  // Conteúdo do item baseado na variante
  const ItemContent = () => {
    // Extrair iniciais do label para modo compacto com description
    const getInitials = (text: string) => {
      return text
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2) // Máximo 2 letras
    }
    
    if (variant === "compact") {
      return (
        <div className="flex items-center gap-2">
          {Icon ? IconElement : <ColorIndicator />}
          <span className={cn(
            "text-xs font-medium transition-opacity",
            active ? "text-foreground" : "text-muted-foreground",
            description ? "font-mono" : "truncate"
          )}>
            {description ? getInitials(label) : label}
          </span>
          
        </div>
      )
    }

    if (variant === "detailed") {
      return (
        <div className="flex items-start gap-3">
          {Icon ? IconElement : <ColorIndicator />}
          <div className="flex-1 min-w-0">
            <div className={cn(
              "text-sm font-medium truncate transition-opacity",
              active ? "text-foreground" : "text-muted-foreground"
            )}>
              {label}
            </div>
            {description && (
              <div className="text-xs text-muted-foreground truncate mt-0.5">
                {description}
              </div>
            )}
          </div>
          {ValueElement}
        </div>
      )
    }

    // Default variant
    return (
      <div className="flex items-center gap-2.5">
        {Icon ? IconElement : <ColorIndicator />}
        <span className={cn(
          "text-sm font-medium truncate transition-opacity",
          active ? "text-foreground" : "text-muted-foreground"
        )}>
          {label}
        </span>
        {ValueElement}
      </div>
    )
  }

  // Wrapper com ou sem tooltip
  const ItemWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!description && !Icon) {
      return <>{children}</>
    }

    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full cursor-help">
              {children}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <div className="font-semibold text-sm">{label}</div>
              {description && (
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </div>
              )}
              {value !== undefined && (
                <div className="text-xs font-medium pt-1 border-t">
                  {valueFormatter ? valueFormatter(value) : `${value}`}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div
      className={cn(
        "group rounded-lg transition-all duration-200",
        onClick && "cursor-pointer hover:bg-muted/50",
        variant === "compact" ? "px-2 py-1" : "px-3 py-2",
        !active && "opacity-60",
        className
      )}
      onClick={onClick}
    >
      <ItemWrapper>
        <ItemContent />
      </ItemWrapper>
    </div>
  )
}

// Container para agrupar múltiplos itens de legenda
export interface ChartLegendContainerProps {
  children: React.ReactNode
  /** Layout da legenda */
  layout?: "horizontal" | "vertical" | "grid"
  /** Classes CSS adicionais */
  className?: string
  /** Título da legenda */
  title?: string
}

export function ChartLegendContainer({
  children,
  layout = "horizontal",
  className,
  title
}: ChartLegendContainerProps) {
  const layoutClasses = {
    horizontal: "flex flex-wrap items-center justify-center gap-2",
    vertical: "flex flex-col items-center gap-1",
    grid: "grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 justify-items-center"
  }

  return (
    <div className={cn("w-full flex justify-center", className)}>
      {title && (
        <div className="text-sm font-semibold text-foreground mb-3">
          {title}
        </div>
      )}
      <div className={layoutClasses[layout]}>
        {children}
      </div>
    </div>
  )
}
