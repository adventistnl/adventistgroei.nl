"use client"

import * as React from "react"
import { AnalyticsGridCarousel } from "./responsive-grid-carousel"
import { RoleDistributionChart, PermissionsByGroupChart, UserActivityChart } from "@/components/access/access-charts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Users, Shield, Activity } from "lucide-react"

/**
 * Exemplo prático de como usar ResponsiveGridCarousel com gráficos individuais
 * Demonstra a separação de cada gráfico como children independentes
 */

// Dados mock para demonstração
const mockRoleDistributionData = [
  { name: "Admin", value: 5, color: "#ef4444" },
  { name: "Manager", value: 12, color: "#f59e0b" },
  { name: "User", value: 45, color: "#10b981" },
  { name: "Guest", value: 8, color: "#6b7280" },
]

const mockPermissionsByGroupData = [
  { group: "USER", permissions: 15, color: "#3b82f6" },
  { group: "ROLE", permissions: 8, color: "#8b5cf6" },
  { group: "PERMISSION", permissions: 25, color: "#f59e0b" },
  { group: "INSTITUTION", permissions: 12, color: "#10b981" },
]

const mockUserActivityData = [
  { month: "Jan", newUsers: 12, roleAssignments: 8, totalActivity: 45 },
  { month: "Feb", newUsers: 15, roleAssignments: 12, totalActivity: 52 },
  { month: "Mar", newUsers: 8, roleAssignments: 6, totalActivity: 38 },
  { month: "Apr", newUsers: 20, roleAssignments: 15, totalActivity: 65 },
  { month: "May", newUsers: 18, roleAssignments: 10, totalActivity: 58 },
]

// Exemplo 1: Gráficos individuais como children
export function IndividualChartsExample() {
  const charts = [
    <RoleDistributionChart
      key="role_distribution"
      data={mockRoleDistributionData}
      loading={false}
    />,
    <PermissionsByGroupChart
      key="permissions_by_group"
      data={mockPermissionsByGroupData}
      loading={false}
    />,
    <UserActivityChart
      key="user_activity"
      data={mockUserActivityData}
      loading={false}
    />
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Access Analytics
          </h3>
          <p className="text-sm text-muted-foreground">
            Visual insights into system access patterns
          </p>
        </div>
      </div>

      <AnalyticsGridCarousel
        className="w-full"
        enableAutoplay={false}
        autoplayDelay={5000}
      >
        {charts}
      </AnalyticsGridCarousel>
    </div>
  )
}

// Exemplo 2: Mistura de gráficos e outros componentes
export function MixedContentExample() {
  const mixedComponents = [
    // Gráfico de distribuição de roles
    <RoleDistributionChart
      key="role_distribution"
      data={mockRoleDistributionData}
      loading={false}
    />,
    
    // Card de estatísticas
    <Card key="stats_card" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          System Statistics
        </CardTitle>
        <CardDescription>
          Key performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Users</span>
          <Badge variant="secondary">1,234</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active Sessions</span>
          <Badge variant="secondary">89</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">System Uptime</span>
          <Badge variant="secondary">99.9%</Badge>
        </div>
      </CardContent>
    </Card>,
    
    // Gráfico de atividade do usuário
    <UserActivityChart
      key="user_activity"
      data={mockUserActivityData}
      loading={false}
    />,
    
    // Card de métricas rápidas
    <Card key="quick_metrics" className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Quick Metrics
        </CardTitle>
        <CardDescription>
          Real-time system metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <div className="text-xs text-muted-foreground">User Growth</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">+8%</div>
            <div className="text-xs text-muted-foreground">Activity</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Mixed Analytics Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            Charts, metrics, and statistics combined
          </p>
        </div>
      </div>

      <AnalyticsGridCarousel
        className="w-full"
        enableAutoplay={true}
        autoplayDelay={4000}
      >
        {mixedComponents}
      </AnalyticsGridCarousel>
    </div>
  )
}

// Exemplo 3: Configuração customizada para diferentes breakpoints
export function CustomBreakpointExample() {
  const charts = [
    <RoleDistributionChart
      key="role_distribution"
      data={mockRoleDistributionData}
      loading={false}
    />,
    <PermissionsByGroupChart
      key="permissions_by_group"
      data={mockPermissionsByGroupData}
      loading={false}
    />,
    <UserActivityChart
      key="user_activity"
      data={mockUserActivityData}
      loading={false}
    />
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Custom Responsive Configuration
          </h3>
          <p className="text-sm text-muted-foreground">
            Grid changes to carousel only on small screens
          </p>
        </div>
      </div>

      <AnalyticsGridCarousel
        className="w-full"
        enableAutoplay={false}
        autoplayDelay={3000}
        // Usando breakpoint customizado - só vira carousel em telas muito pequenas
        breakpoint="sm"
      >
        {charts}
      </AnalyticsGridCarousel>
    </div>
  )
}
