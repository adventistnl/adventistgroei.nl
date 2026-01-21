"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building, 
  MapPin, 
  Church, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface KPIData {
  institutions_count?: number
  churches_count: number
  users_count: number
  members_count?: number
  total_subsidy_budget: number
  annual_department_budget: number
  pending_subsidies: number
  budget_utilization: number
}

interface InstitutionsKPIProps {
  data: KPIData
  loading?: boolean
  institutionName?: string
}

export function InstitutionsKPI({ data, loading = false, institutionName }: InstitutionsKPIProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value)
  }

  const getBudgetUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-600"
    if (utilization >= 75) return "text-yellow-600"
    if (utilization >= 50) return "text-blue-600"
    return "text-green-600"
  }

  const getBudgetUtilizationBadge = (utilization: number) => {
    if (utilization >= 90) return { variant: "destructive" as const, label: "High" }
    if (utilization >= 75) return { variant: "secondary" as const, label: "Medium" }
    if (utilization >= 50) return { variant: "default" as const, label: "Normal" }
    return { variant: "outline" as const, label: "Low" }
  }

  const kpiCards = [
    // Show institutions count only if viewing all institutions
    ...(data.institutions_count ? [{
      title: t('institutions.kpis.total_institutions'),
      value: formatNumber(data.institutions_count),
      icon: Building,
      description: `${data.institutions_count} ${t('institutions.kpis.total_institutions').toLowerCase()}`,
      color: "text-blue-600"
    }] : []),
    {
      title: t('institutions.kpis.total_users'),
      value: formatNumber(data.users_count),
      icon: Users,
      description: institutionName ? `${data.churches_count} churches` : "Active users",
      color: "text-purple-600"
    },
    
    {
      title: t('institutions.kpis.total_budget'),
      value: formatCurrency(data.total_subsidy_budget),
      icon: DollarSign,
      description: `vs ${formatCurrency(data.annual_department_budget)} annual`,
      color: "text-indigo-600"
    },
    
    {
      title: t('institutions.kpis.pending_subsidies'),
      value: formatNumber(data.pending_subsidies),
      icon: AlertCircle,
      description: `${data.budget_utilization}% ${t('institutions.kpis.budget_utilization').toLowerCase()}`,
      color: data.pending_subsidies > 0 ? "text-yellow-600" : "text-green-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {institutionName ? `${institutionName} - ${t('institutions.overview')}` : t('institutions.overview')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {institutionName ? 'Institution-specific metrics' : 'System-wide metrics and statistics'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data.budget_utilization > 0 && (
            <Badge {...getBudgetUtilizationBadge(data.budget_utilization)}>
              {data.budget_utilization}% Utilization
            </Badge>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
                {kpi.title.includes('Budget') && data.budget_utilization > 0 && (
                  <TrendingUp className={`w-3 h-3 ${getBudgetUtilizationColor(data.budget_utilization)}`} />
                )}
                {kpi.title.includes('Pending') && data.pending_subsidies === 0 && (
                  <CheckCircle className="w-3 h-3 text-green-500" />
                )}
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Utilization Alert */}
      {data.budget_utilization >= 90 && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  High Budget Utilization
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  Budget utilization is at {data.budget_utilization}%. Consider reviewing subsidy requests.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
