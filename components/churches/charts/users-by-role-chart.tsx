"use client"

import React from "react"
import { Users } from "lucide-react"
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

interface UsersByRoleChartProps {
  data?: any[]
  loading?: boolean
  title?: string
  description?: string
}

export function UsersByRoleChart({ 
  data, 
  loading,
  title,
  description
}: UsersByRoleChartProps) {
  const chartData = data || []

  const chartConfig = React.useMemo(() => {
    const config: any = { 
      users: { label: "Users" }
    }
    
    chartData.forEach((item: any) => {
      config[item.role] = {
        label: item.fullName || item.role,
        color: item.fill
      }
    })
    
    return config as ChartConfig
  }, [chartData])

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

  if (chartData.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {title || 'Users by Role'}
          </CardTitle>
          <CardDescription>
            {description || 'Distribution of users by their roles'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No role data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalUsers = chartData.reduce((sum, item) => sum + item.users, 0)
  const totalActiveUsers = chartData.reduce((sum, item) => sum + item.activeUsers, 0)
  const topRole = chartData[0] // Already sorted by users desc

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {title || 'Users by Role'}
        </CardTitle>
        <CardDescription>
          {description || 'Distribution of users by their roles within this church'}
        </CardDescription>
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
              tickFormatter={(value) => {
                const label = chartConfig[value as keyof typeof chartConfig]?.label || value
                // Limitar nome a 20 caracteres
                return label.length > 20 ? `${label.substring(0, 20)}...` : label
              }}
              width={140}
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
      <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Users</span>
          </div>
          <span className="font-semibold text-gray-900">
            {totalUsers.toLocaleString()}
          </span>
        </div>
        
        {topRole && (
          <div className="w-full flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: topRole?.fill }}
              ></div>
              <span className="text-muted-foreground">
                Most Common Role: {topRole?.fullName}
              </span>
            </div>
            <span className="font-medium">
              {topRole?.users.toLocaleString()} users
              <span className="text-muted-foreground ml-1">
                ({Math.round((topRole?.users / totalUsers) * 100)}%)
              </span>
            </span>
          </div>
        )}
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Active Users:</span>
            <span className="font-medium text-green-600">
              {totalActiveUsers.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              ({Math.round((totalActiveUsers / totalUsers) * 100)}% active rate)
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
