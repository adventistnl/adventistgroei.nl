"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useChartColors, CHART_PRESETS } from "@/lib/chart-colors"

interface UsersByRoleChartProps {
  data?: any[]
  loading?: boolean
}

export function UsersByRoleChart({ data, loading }: UsersByRoleChartProps) {
  const { theme } = useChartColors()
  const roleColors = CHART_PRESETS.roles(theme as 'light' | 'dark')

  // Dados mockados: Usuários por role
  const mockData = [
    { role: "admin", users: 12, fill: roleColors.admin },
    { role: "finance_manager", users: 28, fill: roleColors.finance_manager },
    { role: "department_head", users: 45, fill: roleColors.department_head },
    { role: "church_leader", users: 89, fill: roleColors.church_leader },
    { role: "volunteer", users: 156, fill: roleColors.volunteer },
  ]

  const chartConfig = {
    users: {
      label: "Users",
    },
    admin: {
      label: "Administrator",
      color: roleColors.admin,
    },
    finance_manager: {
      label: "Finance Manager",
      color: roleColors.finance_manager,
    },
    department_head: {
      label: "Department Head",
      color: roleColors.department_head,
    },
    church_leader: {
      label: "Church Leader",
      color: roleColors.church_leader,
    },
    volunteer: {
      label: "Volunteer",
      color: roleColors.volunteer,
    },
  } satisfies ChartConfig

  const chartData = data || mockData

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  const totalUsers = chartData.reduce((sum, item) => sum + item.users, 0)
  const growthPercentage = 8.4 // Mock growth

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Users by Role</CardTitle>
        <CardDescription>Distribution across all user types</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="role"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis dataKey="users" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="users" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by {growthPercentage}% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Total users: {totalUsers.toLocaleString()}
        </div>
      </CardFooter>
    </Card>
  )
}
