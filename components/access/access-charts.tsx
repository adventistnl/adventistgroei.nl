"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { 
  PieChart as PieChartIcon, 
  BarChart3, 
  TrendingUp,
  Users,
  Shield,
  Activity
} from "lucide-react"

// Chart configurations
const roleDistributionConfig = {
  users: {
    label: "Users",
    color: "#f59e0b",
  },
} satisfies ChartConfig

const permissionsByGroupConfig = {
  permissions: {
    label: "Permissions",
    color: "#3b82f6",
  },
} satisfies ChartConfig

const userActivityConfig = {
  newUsers: {
    label: "New Users",
    color: "#10b981",
  },
  roleAssignments: {
    label: "Role Assignments",
    color: "#8b5cf6",
  },
  totalActivity: {
    label: "Total Activity",
    color: "#ef4444",
  },
} satisfies ChartConfig

interface AccessChartsProps {
  roleDistributionData: Array<{
    name: string
    value: number
    color: string
  }>
  permissionsByGroupData: Array<{
    group: string
    permissions: number
    color: string
  }>
  userActivityData: Array<{
    month: string
    newUsers: number
    roleAssignments: number
    totalActivity: number
  }>
  loading?: boolean
}

// Componente individual para Role Distribution Chart
export function RoleDistributionChart({
  data,
  loading = false
}: {
  data: Array<{
    name: string
    value: number
    color: string
  }>
  loading?: boolean
}) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-amber-600" />
            {t('access.charts.role_distribution')}
          </CardTitle>
          <CardDescription className="mt-1">
            User distribution by role
          </CardDescription>
        </div>
        <Badge variant="outline">
          {data.reduce((sum, item) => sum + item.value, 0)} users
        </Badge>
      </CardHeader>
      <CardContent>
        <ChartContainer config={roleDistributionConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              strokeWidth={2}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
              <Legend />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Componente individual para Permissions by Group Chart
export function PermissionsByGroupChart({
  data,
  loading = false
}: {
  data: Array<{
    group: string
    permissions: number
    color: string
  }>
  loading?: boolean
}) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            {t('access.charts.permissions_by_group')}
          </CardTitle>
          <CardDescription className="mt-1">
            Permission count by category
          </CardDescription>
        </div>
        <Badge variant="outline">
          {data.reduce((sum, item) => sum + item.permissions, 0)} total
        </Badge>
      </CardHeader>
      <CardContent>
        <ChartContainer config={permissionsByGroupConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="group"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar 
              dataKey="permissions" 
              radius={4}
              fill="#3b82f6"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Componente individual para User Activity Chart
export function UserActivityChart({
  data,
  loading = false
}: {
  data: Array<{
    month: string
    newUsers: number
    roleAssignments: number
    totalActivity: number
  }>
  loading?: boolean
}) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {t('access.charts.user_activity')}
          </CardTitle>
          <CardDescription className="mt-1">
            Monthly access activity trends
          </CardDescription>
        </div>
        <Badge variant="outline">
          {data.reduce((sum, item) => sum + item.totalActivity, 0)} activities
        </Badge>
      </CardHeader>
      <CardContent>
        <ChartContainer config={userActivityConfig} className="h-[300px] w-full">
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={12}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Legend />
            <Line
              dataKey="newUsers"
              type="monotone"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
            />
            <Line
              dataKey="roleAssignments"
              type="monotone"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
            />
            <Line
              dataKey="totalActivity"
              type="monotone"
              stroke="#ef4444"
              strokeWidth={3}
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// Componente principal que mantém compatibilidade
export function AccessCharts({
  roleDistributionData,
  permissionsByGroupData,
  userActivityData,
  loading = false
}: AccessChartsProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {t('access.charts.title', { defaultValue: 'Access Analytics' })}
          </h3>
          <p className="text-sm text-muted-foreground">
            Visual insights into system access patterns
          </p>
        </div>
      </div>

      {/* Charts Grid - Agora usando componentes individuais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RoleDistributionChart data={roleDistributionData} loading={loading} />
        <PermissionsByGroupChart data={permissionsByGroupData} loading={loading} />
        <UserActivityChart data={userActivityData} loading={loading} />
      </div>
    </div>
  )
}
