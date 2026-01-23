import * as React from "react"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ChartHeaderProps {
  title: string
  description?: string
  /** Conteúdo adicional (filtros, botões, etc) */
  actions?: React.ReactNode
  /** Classe CSS adicional para o container */
  className?: string
  /** Orientação dos actions: 'horizontal' (padrão desktop) ou 'vertical' (mobile) */
  actionsOrientation?: "horizontal" | "vertical" | "responsive"
}

/**
 * Componente reutilizável para headers de gráficos
 * Gerencia título, descrição e actions (filtros/botões) com responsividade mobile
 */
export function ChartHeader({
  title,
  description,
  actions,
  className,
  actionsOrientation = "responsive"
}: ChartHeaderProps) {
  return (
    <CardHeader
      className={cn(
        "border-b py-5",
        // Layout responsivo baseado na orientação
        actionsOrientation === "responsive" && [
          "flex flex-col gap-4 space-y-0",
          "sm:flex-row sm:items-center sm:gap-2"
        ],
        actionsOrientation === "vertical" && "flex flex-col gap-4 space-y-0",
        actionsOrientation === "horizontal" && "flex flex-row items-center gap-2 space-y-0",
        className
      )}
    >
      {/* Textos (título e descrição) */}
      <div className="grid flex-1 gap-1">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs sm:text-sm">
            {description}
          </CardDescription>
        )}
      </div>

      {/* Actions (filtros, botões, etc) */}
      {actions && (
        <div
          className={cn(
            // Mobile: stack vertical, full width
            "flex flex-wrap gap-3 w-full",
            // Desktop: horizontal, auto width
            "sm:flex-row sm:items-center sm:w-auto sm:ml-auto"
          )}
        >
          {actions}
        </div>
      )}
    </CardHeader>
  )
}
