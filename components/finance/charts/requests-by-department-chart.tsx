"use client"

import * as React from "react"
import { TrendingUp, BarChart3, Activity } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { PrivacyWrapper, InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { PrivacyConfig } from "@/contexts/privacy-context"
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
import { getProjectColor } from "@/lib/chart-colors"

interface RequestsByDepartmentChartProps {
  data?: any[]
  loading?: boolean
  selectedYear?: number
  privacyConfig?: PrivacyConfig
  translations?: {
    title: string
    description: string
    descriptionWithYear: string
    noData: string
    departmentsTracked: string
    top: string
    chartTypes: {
      area: string
      bar: string
    }
  }
}

export function RequestsByDepartmentChart({ 
  data, 
  loading,
  selectedYear = new Date().getFullYear(),
  privacyConfig,
  translations
}: RequestsByDepartmentChartProps) {
  const { formatCurrency } = useCurrency()
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  const [timeRange, setTimeRange] = React.useState("12m")

  // Helper function to sanitize department names for use as HTML IDs
  const sanitizeId = (dept: string) => dept.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')

  // Generate dynamic chart config based on actual departments in data
  const chartConfig = React.useMemo(() => {
    if (!data || data.length === 0) return {}
    
    const departments = new Set<string>()
    data.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'month' && key !== 'date') {
          departments.add(key)
        }
      })
    })
    
    const config: any = {}
    Array.from(departments).forEach((dept, index) => {
      const color = getProjectColor(index)
      console.log(`🎨 [RequestsByDepartmentChart] Departamento #${index}:`, {
        dept,
        index,
        color,
        colorType: typeof color
      })
      config[dept] = {
        label: dept,
        color: color
      }
    })
    
    console.log('✅ [RequestsByDepartmentChart] chartConfig gerado:', config)
    return config as ChartConfig
  }, [data])

  // Transform data to ensure date field exists
  const chartData = React.useMemo(() => {
    console.log('� [RequestsByDepartmentChart] Dados originais recebidos:', data)
    
    if (!data || data.length === 0) {
      return []
    }
    
    // Transform month strings to date format if needed
    const transformed = data.map((item, index) => {
      // If already has date field, use it
      if (item.date) {
        return item
      }
      
      // If has month field (like "Jan", "Feb"), convert to date
      if (item.month) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        const monthIndex = monthNames.indexOf(item.month)
        const year = selectedYear
        
        // Create date string directly to avoid timezone issues
        const month = monthIndex >= 0 ? monthIndex + 1 : index + 1
        const dateString = `${year}-${String(month).padStart(2, '0')}-01`
        
        console.log(`🗓️ [RequestsByDepartmentChart] Convertendo mês para data:`, {
          monthName: item.month,
          monthIndex,
          year,
          generatedDate: dateString,
          departments: Object.keys(item).filter(k => k !== 'month'),
          values: item
        })
        
        return {
          ...item,
          date: dateString
        }
      }
      
      // Fallback: use index as month
      const month = index + 1
      const dateString = `${selectedYear}-${String(month).padStart(2, '0')}-01`

      
      return {
        ...item,
        date: dateString
      }
    })
  
    return transformed
  }, [data, selectedYear])

  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let monthsToShow = 12
    if (timeRange === "6m") {
      monthsToShow = 6
    } else if (timeRange === "3m") {
      monthsToShow = 3
    }
    
    // Calcular data de início baseada em meses
    const startDate = new Date(today)
    startDate.setMonth(startDate.getMonth() - monthsToShow)
    startDate.setDate(1) // Primeiro dia do mês
    
    
    // Criar array de todos os meses no intervalo
    const allMonths: any[] = []
    const current = new Date(startDate)
    
    while (current <= today) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-01`
      
      // Verificar se já temos dados para este mês
      const existingData = chartData.find(item => {
        const itemDate = new Date(item.date)
        return itemDate.getFullYear() === current.getFullYear() && 
               itemDate.getMonth() === current.getMonth()
      })
      
      if (existingData) {
        allMonths.push(existingData)
      } else {
        // Criar dados vazios para este mês
        const emptyMonth: any = { date: monthKey }
        Object.keys(chartConfig).forEach(dept => {
          emptyMonth[dept] = 0
        })
        allMonths.push(emptyMonth)
      }
      
      // Avançar para o próximo mês
      current.setMonth(current.getMonth() + 1)
    }
    
    // Retornar apenas os últimos N meses
    const filtered = allMonths.slice(-monthsToShow)

    
    return filtered
  }, [timeRange, chartData, chartConfig])

  const totalByDepartment = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    filteredData.forEach(monthData => {
      Object.keys(monthData).forEach(key => {
        if (key !== 'month' && key !== 'date') {
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
            {translations?.title || "Requests Over Time by Department"}
          </CardTitle>
          <CardDescription>
            {translations?.description || "Monthly subsidy requests by all departments"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{translations?.noData || "No department data available"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4" />
              {translations?.title || "Requests Over Time by Department"}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {translations?.descriptionWithYear.replace('{{year}}', selectedYear.toString()) || `Monthly subsidy requests by all departments - ${selectedYear}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 border rounded-md p-1">
            {privacyConfig && (
              <InlinePrivacyToggle 
                config={privacyConfig}
                className="w-8 h-8"
              />
            )}
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
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("area")}
              className="h-7 px-3 text-xs"
            >
              <Activity className="w-3 h-3 mr-1" />
              {translations?.chartTypes.area || "Area"}
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-7 px-3 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              {translations?.chartTypes.bar || "Bar"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-2 pt-4 sm:px-6 sm:pt-6">
        {privacyConfig ? (
          <PrivacyWrapper
            config={privacyConfig}
            showToggle={false}
          >
            <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          {chartType === "area" ? (
            <AreaChart accessibilityLayer data={filteredData}>
              <defs>
                {Object.keys(chartConfig).map((dept, index) => {
                  const color = getProjectColor(index)
                  const gradientId = `fill-${sanitizeId(dept)}`
                  console.log(`🌈 [AreaChart Gradient] ${dept}:`, { index, color, gradientId })
                  return (
                    <linearGradient key={dept} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent 
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                  formatter={(value: any) => formatCurrency(typeof value === 'number' ? value : 0)}
                />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map((dept, index) => {
                const strokeColor = getProjectColor(index)
                const gradientId = `fill-${sanitizeId(dept)}`
                console.log(`📊 [Area] ${dept}:`, { index, strokeColor, fill: `url(#${gradientId})` })
                return (
                  <Area
                    key={dept}
                    dataKey={dept}
                    type="natural"
                    fill={`url(#${gradientId})`}
                    stroke={strokeColor}
                    strokeWidth={2}
                    stackId="a"
                  />
                )
              })}
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  hideLabel={false}
                  formatter={(value: any) => formatCurrency(typeof value === 'number' ? value : 0)}
                />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map((dept, index) => {
                const barColor = getProjectColor(index)
                console.log(`📊 [Bar] ${dept}:`, { index, barColor })
                return (
                  <Bar
                    key={dept}
                    dataKey={dept}
                    stackId="a"
                    fill={barColor}
                    radius={index === Object.keys(chartConfig).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                )
              })}
            </BarChart>
          )}
            </ChartContainer>
          </PrivacyWrapper>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          {chartType === "area" ? (
            <AreaChart accessibilityLayer data={filteredData}>
              <defs>
                {Object.keys(chartConfig).map((dept, index) => {
                  const color = getProjectColor(index)
                  const gradientId = `fill-${sanitizeId(dept)}`
                  console.log(`🌈 [AreaChart Gradient] ${dept}:`, { index, color, gradientId })
                  return (
                    <linearGradient key={dept} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent 
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                  formatter={(value: any) => formatCurrency(typeof value === 'number' ? value : 0)}
                />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map((dept, index) => {
                const strokeColor = getProjectColor(index)
                const gradientId = `fill-${sanitizeId(dept)}`
                console.log(`📊 [Area] ${dept}:`, { index, strokeColor, fill: `url(#${gradientId})` })
                return (
                  <Area
                    key={dept}
                    dataKey={dept}
                    type="natural"
                    fill={`url(#${gradientId})`}
                    stroke={strokeColor}
                    strokeWidth={2}
                    stackId="a"
                  />
                )
              })}
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={filteredData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value, { compact: true })}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  hideLabel={false}
                  formatter={(value: any) => formatCurrency(typeof value === 'number' ? value : 0)}
                />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {Object.keys(chartConfig).map((dept, index) => {
                const barColor = getProjectColor(index)
                console.log(`📊 [Bar] ${dept}:`, { index, barColor })
                return (
                  <Bar
                    key={dept}
                    dataKey={dept}
                    stackId="a"
                    fill={barColor}
                    radius={index === Object.keys(chartConfig).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                )
              })}
            </BarChart>
          )}
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs pt-3 border-t">
        <div className="flex items-center gap-1.5 font-medium">
          <TrendingUp className="h-3 w-3" />
          {translations?.departmentsTracked.replace('{{count}}', Object.keys(chartConfig).length.toString()) || `${Object.keys(chartConfig).length} departments tracked`}
        </div>
        <div className="text-muted-foreground">
          {translations?.top || "Top"}: <span className="font-medium text-foreground">{topDepartment.name}</span>
          {privacyConfig ? (
            <PrivacyWrapper
              config={privacyConfig}
              showToggle={false}
              className="inline-block ml-1"
              fallback={
                <span className="inline-flex items-center gap-0.5 blur-[1px] opacity-40">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full bg-gray-400 inline-block" />
                  ))}
                </span>
              }
            >
              <span>({formatCurrency(topDepartment.total)})</span>
            </PrivacyWrapper>
          ) : (
            <span> ({formatCurrency(topDepartment.total)})</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
