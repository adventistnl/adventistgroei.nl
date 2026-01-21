"use client"

import React from "react"
import { TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
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
import { getProjectColor } from "@/lib/chart-colors"

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
  // Process data and apply getProjectColor for consistency
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    // Apply getProjectColor to each item
    return data.map((item: any, index: number) => ({
      ...item,
      fill: getProjectColor(index)
    }))
  }, [data])

  const chartConfig = React.useMemo(() => {
    const config: any = { 
      users: { 
        label: "Users",
        color: "var(--chart-1)"
      },
      label: {
        color: "var(--background)",
      }
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
      <Card className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="border-b py-5">
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1 px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-10 bg-muted/30 rounded flex-1 animate-pulse" 
                     style={{ width: `${60 + Math.random() * 40}%` }} />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
          <div className="w-full flex items-center justify-between">
            <div className="h-3 bg-muted rounded w-24 animate-pulse" />
            <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="h-3 bg-muted rounded w-32 animate-pulse" />
            <div className="h-3 bg-muted rounded w-16 animate-pulse" />
          </div>
        </CardFooter>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="border-b py-5">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {title || 'Users by Role'}
          </CardTitle>
          <CardDescription>
            {description || 'Distribution of users by their roles'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="text-center space-y-6 max-w-md">
            {/* Empty state illustration */}
            <div className="relative h-[240px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="space-y-2 w-full px-8">
                {/* Empty bars */}
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="bg-muted/40 rounded h-8"
                      style={{ width: `${40 + (i * 10)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">
                  Nenhum Dado de Função Disponível
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                As funções dos usuários aparecerão aqui assim que forem atribuídas.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
          <div className="w-full flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              <span>Total de Usuários</span>
            </div>
            <span className="font-semibold">0</span>
          </div>
        </CardFooter>
      </Card>
    )
  }

  const totalUsers = chartData.reduce((sum, item) => sum + item.users, 0)
  const totalActiveUsers = chartData.reduce((sum, item) => sum + item.activeUsers, 0)
  const topRole = chartData[0] // Already sorted by users desc

  return (
    <Card className="h-full flex flex-col min-h-[500px]">
      <CardHeader className="border-b py-5">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {title || 'Users by Role'}
        </CardTitle>
        <CardDescription>
          {description || 'Distribution of users by their roles within this church'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="role"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const label = chartConfig[value as keyof typeof chartConfig]?.label || value
                return label.length > 20 ? `${label.substring(0, 20)}...` : label
              }}
              hide
            />
            <XAxis dataKey="users" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="users"
              layout="vertical"
              radius={4}
            >
              <LabelList
                dataKey="role"
                position="insideLeft"
                offset={8}
                className="fill-background"
                fontSize={12}
                formatter={(value: any) => {
                  const label = chartConfig[value as keyof typeof chartConfig]?.label || value
                  return label.length > 20 ? `${label.substring(0, 20)}...` : label
                }}
              />
              <LabelList
                dataKey="users"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs pt-4 border-t">
        <div className="flex items-start gap-1.5 font-medium">
          <TrendingUp className="h-3 w-3" />
          {totalUsers.toLocaleString()} total users
        </div>
        
        {topRole && (
          <div className="text-muted-foreground">
            Most Common: <span className="font-medium text-foreground">{topRole?.fullName}</span> ({topRole?.users} users, {Math.round((topRole?.users / totalUsers) * 100)}%)
          </div>
        )}
        
        <div className="text-muted-foreground">
          Active Rate: <span className="font-medium text-green-600">{totalActiveUsers}</span> active ({Math.round((totalActiveUsers / totalUsers) * 100)}%)
        </div>
      </CardFooter>
    </Card>
  )
}
