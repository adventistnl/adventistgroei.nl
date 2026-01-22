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
  }
  requiredPermission: PermissionResolverName | PermissionResolverName[]
  className?: string
}

/**
 * KPI Card protegido com validação de permissões individual
 * 
 * Aplica WithPermission + PermissionDeniedOverlay para cada KPI
 * Garante que apenas usuários com a permissão adequada visualizem os dados
 */
export function ProtectedKPICard({
  id,
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  requiredPermission,
  className
}: ProtectedKPICardProps) {
  // Skeleton do card mantendo a mesma estrutura visual
  const cardSkeleton = (
    <Card className={cn("w-full h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32 mb-1" />
        {trend && <Skeleton className="h-3 w-16 mt-2" />}
      </CardContent>
    </Card>
  )

  return (
    <WithPermission
      requiredPermissions={[requiredPermission]}
      fallback={
        <PermissionDeniedOverlay height="160px" blurIntensity="medium">
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
                </div>
            )}
          </div>

        </CardContent>
      </Card>
    </WithPermission>
  )
}
