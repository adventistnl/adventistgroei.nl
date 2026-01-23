import * as React from "react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
  actionsOrientation?: "responsive" | "vertical" | "horizontal"
}

/**
 * PageHeader Component
 * 
 * Componente reutilizável para headers de páginas com layout responsivo.
 * 
 * @param title - Título principal da página (string ou ReactNode)
 * @param subtitle - Subtítulo/descrição (opcional)
 * @param actions - Botões, filtros, etc. (opcional)
 * @param children - Conteúdo adicional abaixo do header (ex: filtros de ano)
 * @param className - Classes CSS adicionais
 * @param actionsOrientation - Layout das ações: "responsive" (padrão), "vertical", "horizontal"
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   title="Churches"
 *   subtitle="Manage all churches in your organization"
 *   actions={
 *     <>
 *       <PageFilters {...filtersProps} />
 *       <Button>Create</Button>
 *       <Button variant="outline" size="icon">
 *         <RefreshCw />
 *       </Button>
 *     </>
 *   }
 * >
 *   <YearFilter />
 * </PageHeader>
 * ```
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  children,
  className,
  actionsOrientation = "responsive"
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col justify-between items-start gap-4", className)}>
      {/* Header principal com título e ações */}
      <div
        className={cn(
          "flex gap-4 w-full",
          actionsOrientation === "responsive" && "flex-col sm:flex-row justify-between items-start sm:items-center",
          actionsOrientation === "vertical" && "flex-col justify-between items-start",
          actionsOrientation === "horizontal" && "flex-row justify-between items-center"
        )}
      >
        {/* Título e subtítulo */}
        <div className="flex-1">
          {typeof title === "string" ? (
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              {title}
            </h2>
          ) : (
            <div className="mb-2">{title}</div>
          )}
          
          {subtitle && (
            typeof subtitle === "string" ? (
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {subtitle}
              </p>
            ) : (
              <div className="text-muted-foreground text-0.875rem sm:text-1rem">
                {subtitle}
              </div>
            )
          )}
        </div>

        {/* Ações (botões, filtros, etc) */}
        {actions && (
          <div
            className={cn(
              "flex gap-3",
              actionsOrientation === "responsive" && "w-full sm:w-auto flex-wrap sm:flex-nowrap",
              actionsOrientation === "vertical" && "flex-col w-full",
              actionsOrientation === "horizontal" && "flex-row flex-wrap"
            )}
          >
            {actions}
          </div>
        )}
      </div>

      {/* Conteúdo adicional (ex: filtros de ano, tabs, etc) */}
      {children && <div className="w-full">{children}</div>}
    </div>
  )
}
