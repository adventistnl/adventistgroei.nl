"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Shield, 
  Lock, 
  UserCheck, 
  TrendingUp,
  Activity,
  Crown
} from "lucide-react"

interface AccessKPIData {
  totalUsers: number
  totalRoles: number
  totalPermissions: number
  activeUsers: number
  userGrowthRate: number
  adminUsers: number
}

interface AccessKPIProps {
  data: AccessKPIData
  loading?: boolean
}

export function AccessKPI({ data, loading = false }: AccessKPIProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value)
  }

  const getGrowthColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 50) return "text-blue-600"
    if (rate >= 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getGrowthBadge = (rate: number) => {
    if (rate >= 80) return { variant: "default" as const, label: "Excellent" }
    if (rate >= 50) return { variant: "secondary" as const, label: "Good" }
    if (rate >= 30) return { variant: "outline" as const, label: "Fair" }
    return { variant: "destructive" as const, label: "Low" }
  }

  const kpiCards = [
    {
      title: t('access.kpis.total_users'),
      value: formatNumber(data.totalUsers),
      icon: Users,
      description: `${data.activeUsers} active this month`,
      color: "text-blue-600"
    },
    {
      title: t('access.kpis.total_roles'),
      value: formatNumber(data.totalRoles),
      icon: Shield,
      description: "System roles available",
      color: "text-green-600"
    },
    {
      title: t('access.kpis.total_permissions'),
      value: formatNumber(data.totalPermissions),
      icon: Lock,
      description: "Granular permissions",
      color: "text-purple-600"
    },
    {
      title: t('access.kpis.active_users'),
      value: formatNumber(data.activeUsers),
      icon: UserCheck,
      description: "Last 30 days activity",
      color: "text-indigo-600"
    },
    {
      title: t('access.kpis.admin_users'),
      value: formatNumber(data.adminUsers),
      icon: Crown,
      description: "Administrative access",
      color: "text-amber-600"
    },
    {
      title: t('access.kpis.user_growth_rate'),
      value: `${data.userGrowthRate}%`,
      icon: TrendingUp,
      description: "Active user ratio",
      color: getGrowthColor(data.userGrowthRate)
    }
  ]

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground mb-1">
                {kpi.value}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {kpi.title.includes('Growth') && (
                  <Activity className={`w-3 h-3 ${kpi.color}`} />
                )}
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Alert */}
      {data.adminUsers > data.totalUsers * 0.3 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  High Admin User Ratio
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  {Math.round((data.adminUsers / data.totalUsers) * 100)}% of users have admin access. Consider reviewing admin assignments for security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
