"use client"

import React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionDeniedOverlay } from "@/components/shared/permission-denied-overlay"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProtectedKPICardProps {
  id: string
  title: string
  value: string | number | React.ReactNode
  icon: LucideIcon
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  requiredPermission: PermissionResolverName | PermissionResolverName[]
  className?: string
  /** Altura do overlay quando sem permissão (padrão: 160px) */
  overlayHeight?: string
  /** Intensidade do blur no overlay (padrão: medium) */
  blurIntensity?: "low" | "medium" | "high"
}

/**
 * KPI Card protegido com validação de permissões individual
 * 
 * Este componente implementa proteção de privacidade em nível de card individual,
 * garantindo que dados sensíveis sejam protegidos mas mantendo a estrutura visual.
 * 
 * Comportamento:
 * - ✅ Com permissão: Exibe os dados reais do KPI
 * - 🔒 Sem permissão: Exibe skeleton com overlay de "Acesso Negado"
 * - 📊 Sempre renderiza: Card permanece visível mantendo layout consistente
 * 
 * Recursos:
 * - Suporta permissão única ou múltiplas permissões
 * - Overlay de bloqueio com blur e ícone de cadeado
 * - Skeleton mantém mesma estrutura visual do card real
 * - Transições suaves e hover effects
 * 
 * @example
 * ```tsx
 * <ProtectedKPICard
 *   id="total-users"
 *   title="Total Users"
 *   value={1234}
 *   icon={Users}
 *   subtitle="45 new this year"
 *   trend={{ value: 12.5, isPositive: true }}
 *   requiredPermission={PermissionResolverName.Users}
 * />
 * ```
 * 
 * @example Com múltiplas permissões
 * ```tsx
 * <ProtectedKPICard
 *   id="projects"
 *   title="Projects"
 *   value={89}
 *   icon={FolderKanban}
 *   requiredPermission={[
 *     PermissionResolverName.Projects,
 *     PermissionResolverName.Departments
 *   ]}
 * />
 * ```
 */
export function ProtectedKPICard({
  id,
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  requiredPermission,
  className,
  overlayHeight = "160px",
  blurIntensity = "medium"
}: ProtectedKPICardProps) {
  // Normalizar permissões para array
  const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission]
  
  // Debug: Log permissões e configuração do card
  React.useEffect(() => {
    console.log(`🔐 [ProtectedKPICard - ${id}] Card Configuration:`, {
      id,
      title,
      value,
      hasSubtitle: !!subtitle,
      hasTrend: !!trend,
      requiredPermissions: permissions,
      permissionCount: permissions.length,
      overlayHeight,
      blurIntensity,
      note: 'WithPermission HOC will validate access - if denied, fallback (skeleton + overlay) will render'
    })
  }, [id, title, value, permissions, overlayHeight, blurIntensity])
  
  // Skeleton do card mantendo a mesma estrutura visual para proteção de privacidade
  const cardSkeleton = (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent className="flex mt-4 flex-col justify-between gap-8">
        <Skeleton className="h-8 w-24 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-36 mb-1" />
          {trend && (
            <Skeleton className="h-3 w-12 mt-2" />
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <WithPermission
      requiredPermissions={permissions}
      fallback={
        <PermissionDeniedOverlay height={overlayHeight} blurIntensity={blurIntensity}>
          {cardSkeleton}
        </PermissionDeniedOverlay>
      }
    >
      <Card className={cn(
        "w-full h-full transition-all hover:shadow-md",
        className
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex mt-4 flex-col justify-between gap-8">
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="flex items-center gap-2">
            {subtitle && (
                <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
                </p>
            )}
            {trend && (
                <div className={cn(
                "flex items-center gap-1 text-xs mt-2",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                {trend.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                ) : (
                    <TrendingDown className="h-3 w-3" />
                )}
                <span>{Math.abs(trend.value)}%</span>
                {trend.label && <span className="text-muted-foreground ml-1">{trend.label}</span>}
                </div>
            )}
          </div>

        </CardContent>
      </Card>
    </WithPermission>
  )
}
