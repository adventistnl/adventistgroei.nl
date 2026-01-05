"use client"

import * as React from "react"
import { TrendingUp, BarChart3, Activity } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface RequestsByDepartmentChartProps {
  data?: any[]
  loading?: boolean
  selectedYear?: number
}

export function RequestsByDepartmentChart({ 
  data, 
  loading,
  selectedYear = new Date().getFullYear()
}: RequestsByDepartmentChartProps) {
  const { formatCurrency } = useCurrency()
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")

  // Generate dynamic chart config based on actual departments in data
  const chartConfig = React.useMemo(() => {
    if (!data || data.length === 0) return {}
    
    const departments = new Set<string>()
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'month') {
          departments.add(key)
        }
      })
    })
    
    const colors = [
      "hsl(210, 100%, 50%)",   // Blue
      "hsl(270, 95%, 60%)",    // Purple
      "hsl(142, 71%, 45%)",    // Green
      "hsl(43, 96%, 56%)",     // Yellow
      "hsl(340, 75%, 55%)",    // Pink
      "hsl(160, 60%, 45%)",    // Teal
      "hsl(300, 65%, 55%)",    // Magenta
      "hsl(30, 80%, 55%)",     // Orange
      "hsl(190, 70%, 50%)",    // Cyan
      "hsl(15, 85%, 60%)",     // Red-Orange
    ]
    
    const config: any = {}
    Array.from(departments).forEach((dept, index) => {
      config[dept] = {
        label: dept,
        color: colors[index % colors.length]
      }
    })
    
    return config as ChartConfig
  }, [data])

  // Transform data to show months on X-axis and departments as separate areas
  const chartData = React.useMemo(() => {
    // If data is provided, use it; otherwise return empty
    if (!data || data.length === 0) {
      return []
    }
    
    return data
  }, [data])

  const totalByDepartment = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    chartData.forEach(monthData => {
      Object.keys(monthData).forEach(key => {
        if (key !== 'month') {
          if (!totals[key]) {
            totals[key] = 0
          }
          totals[key] += monthData[key] || 0
        }
      })
    })
    
    return totals
  }, [chartData])

  const topDepartment = React.useMemo(() => {
    const entries = Object.entries(totalByDepartment)
    if (entries.length === 0) {
      return { name: 'N/A', total: 0 }
    }
    
    const top = entries.reduce((max, [dept, total]) => 
      total > max.total ? { dept, total } : max
    , { dept: '', total: 0 })
    
    return {
      name: top.dept || 'Unknown',
      total: top.total
    }
  }, [totalByDepartment])

  const totalRequested = React.useMemo(() => {
    return Object.values(totalByDepartment).reduce((sum, val) => sum + val, 0)
  }, [totalByDepartment])

  const avgMonthlyRequest = React.useMemo(() => {
    const currentMonth = new Date().getMonth()
    return totalRequested / (currentMonth + 1)
  }, [totalRequested])

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
            <Building2 className="w-5 h-5" />
            Requests Over Time by Department
          </CardTitle>
          <CardDescription>
            Monthly subsidy requests by all departments
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No department data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4" />
              Requests Over Time by Department
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Monthly subsidy requests by all departments - {selectedYear}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("area")}
              className="h-7 px-3 text-xs"
            >
              <Activity className="w-3 h-3 mr-1" />
              {/* Area */}
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-7 px-3 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              {/* Bar */}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {chartType === "area" ? (
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  hideLabel={false}
                  formatter={(value: any) => formatCurrency(typeof value === 'number' ? value : 0)}
                />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map((dept) => {
                const config = chartConfig[dept as keyof typeof chartConfig]
                return (
                  <Area
                    key={dept}
                    dataKey={dept}
                    type="monotone"
                    fill={config?.color || 'hsl(210, 100%, 50%)'}
                    fillOpacity={0.4}
                    stroke={config?.color || 'hsl(210, 100%, 50%)'}
                    stackId="a"
                  />
                )
              })}
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  hideLabel={false}
                  formatter={(value: any) => formatCurrency(typeof value === 'number' ? value : 0)}
                />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map((dept, index) => {
                const config = chartConfig[dept as keyof typeof chartConfig]
                return (
                  <Bar
                    key={dept}
                    dataKey={dept}
                    stackId="a"
                    fill={config?.color || 'hsl(210, 100%, 50%)'}
                    radius={index === Object.keys(chartConfig).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                )
              })}
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs pt-3 border-t">
        <div className="flex items-center gap-1.5 font-medium">
          <TrendingUp className="h-3 w-3" />
          {Object.keys(chartConfig).length} departments tracked
        </div>
        <div className="text-muted-foreground">
          Top: <span className="font-medium text-foreground">{topDepartment.name}</span> ({formatCurrency(topDepartment.total)})
        </div>
      </CardFooter>
    </Card>
  )
}
