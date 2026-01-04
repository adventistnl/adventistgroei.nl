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

const chartConfig = {
  education: {
    label: "Education",
    color: "hsl(210, 100%, 50%)",
  },
  youthMinistry: {
    label: "Youth Ministry",
    color: "hsl(270, 95%, 60%)",
  },
  evangelism: {
    label: "Evangelism",
    color: "hsl(142, 71%, 45%)",
  },
  healthMinistry: {
    label: "Health Ministry",
    color: "hsl(43, 96%, 56%)",
  },
  communications: {
    label: "Communications",
    color: "hsl(340, 75%, 55%)",
  },
  sabbathSchool: {
    label: "Sabbath School",
    color: "hsl(160, 60%, 45%)",
  },
  womensMinistry: {
    label: "Women's Ministry",
    color: "hsl(300, 65%, 55%)",
  },
  adventurers: {
    label: "Adventurers",
    color: "hsl(30, 80%, 55%)",
  },
} satisfies ChartConfig

export function RequestsByDepartmentChart({ 
  data, 
  loading,
  selectedYear = new Date().getFullYear()
}: RequestsByDepartmentChartProps) {
  const { formatCurrency } = useCurrency()
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")

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
              <Area
                dataKey="education"
                type="monotone"
                fill="var(--color-education)"
                fillOpacity={0.4}
                stroke="var(--color-education)"
                stackId="a"
              />
              <Area
                dataKey="youthMinistry"
                type="monotone"
                fill="var(--color-youthMinistry)"
                fillOpacity={0.4}
                stroke="var(--color-youthMinistry)"
                stackId="a"
              />
              <Area
                dataKey="evangelism"
                type="monotone"
                fill="var(--color-evangelism)"
                fillOpacity={0.4}
                stroke="var(--color-evangelism)"
                stackId="a"
              />
              <Area
                dataKey="healthMinistry"
                type="monotone"
                fill="var(--color-healthMinistry)"
                fillOpacity={0.4}
                stroke="var(--color-healthMinistry)"
                stackId="a"
              />
              <Area
                dataKey="communications"
                type="monotone"
                fill="var(--color-communications)"
                fillOpacity={0.4}
                stroke="var(--color-communications)"
                stackId="a"
              />
              <Area
                dataKey="sabbathSchool"
                type="monotone"
                fill="var(--color-sabbathSchool)"
                fillOpacity={0.4}
                stroke="var(--color-sabbathSchool)"
                stackId="a"
              />
              <Area
                dataKey="womensMinistry"
                type="monotone"
                fill="var(--color-womensMinistry)"
                fillOpacity={0.4}
                stroke="var(--color-womensMinistry)"
                stackId="a"
              />
              <Area
                dataKey="adventurers"
                type="monotone"
                fill="var(--color-adventurers)"
                fillOpacity={0.4}
                stroke="var(--color-adventurers)"
                stackId="a"
              />
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
              <Bar
                dataKey="education"
                stackId="a"
                fill="var(--color-education)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="youthMinistry"
                stackId="a"
                fill="var(--color-youthMinistry)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="evangelism"
                stackId="a"
                fill="var(--color-evangelism)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="healthMinistry"
                stackId="a"
                fill="var(--color-healthMinistry)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="communications"
                stackId="a"
                fill="var(--color-communications)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="sabbathSchool"
                stackId="a"
                fill="var(--color-sabbathSchool)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="womensMinistry"
                stackId="a"
                fill="var(--color-womensMinistry)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="adventurers"
                stackId="a"
                fill="var(--color-adventurers)"
                radius={[4, 4, 0, 0]}
              />
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
