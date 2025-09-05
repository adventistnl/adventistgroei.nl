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

export function AccessCharts({
  roleDistributionData,
  permissionsByGroupData,
  userActivityData,
  loading = false
}: AccessChartsProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Role Distribution - Pie Chart */}
        <Card>
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
              {roleDistributionData.reduce((sum, item) => sum + item.value, 0)} users
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
                  data={roleDistributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  strokeWidth={2}
                  paddingAngle={2}
                >
                  {roleDistributionData.map((entry, index) => (
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

        {/* Permissions by Group - Bar Chart */}
        <Card>
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
              {permissionsByGroupData.reduce((sum, item) => sum + item.permissions, 0)} total
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={permissionsByGroupConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={permissionsByGroupData}>
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
                  fill={(entry) => entry?.color || "#3b82f6"}
                >
                  {permissionsByGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Activity Over Time - Line Chart */}
        <Card>
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
              {userActivityData.reduce((sum, item) => sum + item.totalActivity, 0)} activities
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={userActivityConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={userActivityData}>
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
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Most Active Role
                </p>
                <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                  {roleDistributionData.reduce((max, role) => 
                    role.value > max.value ? role : max, roleDistributionData[0]
                  )?.name || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Largest Permission Group
                </p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">
                  {permissionsByGroupData.reduce((max, group) => 
                    group.permissions > max.permissions ? group : max, permissionsByGroupData[0]
                  )?.group || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Peak Activity Month
                </p>
                <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                  {userActivityData.reduce((max, month) => 
                    month.totalActivity > max.totalActivity ? month : max, userActivityData[0]
                  )?.month || 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
