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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import { useChartColors } from "@/lib/chart-colors"

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
  const [timeRange, setTimeRange] = React.useState("12m")
  const { generatePalette } = useChartColors()

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
    
    const palette = generatePalette(departments.size)
    
    const config: any = {}
    Array.from(departments).forEach((dept, index) => {
      config[dept] = {
        label: dept,
        color: palette[index]
      }
    })
    
    return config as ChartConfig
  }, [data, generatePalette])

  // Transform data to show months on X-axis and departments as separate areas
  const chartData = React.useMemo(() => {
    // If data is provided, use it; otherwise return empty
    if (!data || data.length === 0) {
      return []
    }
    
    return data
  }, [data])

  const filteredData = React.useMemo(() => {
    if (timeRange === "6m") {
      return chartData.slice(-6)
    } else if (timeRange === "3m") {
      return chartData.slice(-3)
    }
    return chartData
  }, [timeRange, chartData])

  const totalByDepartment = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    filteredData.forEach(monthData => {
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
  }, [filteredData])

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
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gray-600" />
            Requests by Department
          </CardTitle>
          <CardDescription>
            Monthly subsidy requests by department - {selectedYear}
          </CardDescription>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Time Range Selector */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 12 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12m" className="rounded-lg">
                Last 12 months
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                Last 3 months
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Chart Type Toggle */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("area")}
              className="h-7 px-3 text-xs"
            >
              <Activity className="w-3 h-3 mr-1" />
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-7 px-3 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          {chartType === "area" ? (
            <AreaChart accessibilityLayer data={filteredData}>
              <defs>
                {Object.keys(chartConfig).map((dept) => {
                  const config = chartConfig[dept as keyof typeof chartConfig]
                  return (
                    <linearGradient key={dept} id={`fill${dept}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={config?.color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={config?.color} stopOpacity={0.1} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                minTickGap={32}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent 
                  hideLabel={false}
                  indicator="dot"
                  formatter={(value: any) => formatCurrency(typeof value === 'number' ? value : 0)}
                />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map((dept) => (
                <Area
                  key={dept}
                  dataKey={dept}
                  type="monotone"
                  fill={`url(#fill${dept})`}
                  stroke={chartConfig[dept as keyof typeof chartConfig]?.color}
                  strokeWidth={2}
                  dot={{
                    fill: chartConfig[dept as keyof typeof chartConfig]?.color,
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    strokeWidth: 2,
                  }}
                  stackId="a"
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                minTickGap={32}
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
