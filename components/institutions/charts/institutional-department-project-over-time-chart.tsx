"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Bar, BarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
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
import { useChartColors } from "@/lib/chart-colors"
import { departmentTranslations } from "@/lib/translations/departments"
import { TrendingUp, Activity, BarChart3 } from "lucide-react"

interface InstitutionalDepartmentProjectOverTimeChartProps {
  loading?: boolean
  departments?: any[]
  projects?: any[]
  selectedYear?: number
}

export function InstitutionalDepartmentProjectOverTimeChart({ 
  loading, 
  departments = [], 
  projects = [],
  selectedYear = new Date().getFullYear() 
}: InstitutionalDepartmentProjectOverTimeChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  // Filtrar apenas departamentos institucionais ativos (sem church_id)
  const institutionalDepartments = React.useMemo(() => {
    if (!departments || departments.length === 0) return []

    const filtered = departments.filter((dept: any) => 
      dept && dept.id && dept.name && !dept.is_deleted && !dept.church_id
    )
    
    return filtered
  }, [departments])

  // Filtrar projetos vinculados a institutional departments
  const institutionalDepartmentProjects = React.useMemo(() => {
    if (!projects || projects.length === 0) return []
    
    const institutionalDeptIds = new Set(institutionalDepartments.map(d => d.id))
    const filtered = projects.filter((p: any) => 
      p.department_id && institutionalDeptIds.has(p.department_id)
    )
    
    return filtered
  }, [projects, institutionalDepartments])

  // Gerar dados de criação de projetos ao longo do tempo
  const chartData = React.useMemo(() => {
    if (institutionalDepartments.length === 0 || institutionalDepartmentProjects.length === 0) {
      return []
    }

    // Criar mapa para armazenar contagem diária
    const dailyCounts = new Map<string, any>()

    // Contar projetos por data e departamento
    institutionalDepartmentProjects.forEach((project: any) => {
      const createdDate = new Date(project.created_at || project.start_at)
      const dateKey = createdDate.toISOString().split('T')[0] // YYYY-MM-DD format
      
      if (!dailyCounts.has(dateKey)) {
        const dateData: any = { date: dateKey }
        institutionalDepartments.forEach(dept => {
          const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
          dateData[deptKey] = 0
        })
        dailyCounts.set(dateKey, dateData)
      }

      const dept = institutionalDepartments.find(d => d.id === project.department_id)
      if (dept) {
        const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
        const dateData = dailyCounts.get(dateKey)!
        dateData[deptKey] += 1
      }
    })

    // Converter map para array e ordenar por data
    const sortedData = Array.from(dailyCounts.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    return sortedData
  }, [institutionalDepartmentProjects, institutionalDepartments])
  
  const { generatePalette } = useChartColors()

  // Gerar cores dinâmicas para cada departamento
  const departmentColors = React.useMemo(() => {
    const palette = generatePalette(institutionalDepartments.length)
    const colorMap: { [key: string]: string } = {}

    institutionalDepartments.forEach((dept, index) => {
      const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
      colorMap[deptKey] = palette[index]
    })

    return colorMap
  }, [institutionalDepartments, generatePalette])

  // Configuração dinâmica do gráfico baseada nos departamentos reais
  const chartConfig = React.useMemo(() => {
    const config: any = {
      totalProjects: {
        label: t.charts?.projects || "Projects",
      }
    }

    institutionalDepartments.forEach((dept) => {
      const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
      config[deptKey] = {
        label: dept.name,
        color: departmentColors[deptKey],
      }
    })

    return config
  }, [institutionalDepartments, departmentColors, t.charts])

  // Filtrar dados baseado no intervalo de tempo
  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return []
    
    // Data atual em timezone local
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}`
    
    // Calcular dias a subtrair baseado no intervalo
    const daysMap: Record<string, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "180d": 180,
      "365d": 365
    }
    const daysToSubtract = daysMap[timeRange] || 90
    
    // Data inicial (X dias atrás)
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    const startYear = startDate.getFullYear()
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
    const startDay = String(startDate.getDate()).padStart(2, '0')
    const startDateStr = `${startYear}-${startMonth}-${startDay}`
    
    // Filtrar dados dentro do intervalo
    const filtered = chartData.filter(item => 
      item.date >= startDateStr && item.date <= todayStr
    )
    
    // Preencher dias faltantes com zeros
    const dataMap = new Map(filtered.map(item => [item.date, item]))
    const allDays: any[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= today) {
      const y = currentDate.getFullYear()
      const m = String(currentDate.getMonth() + 1).padStart(2, '0')
      const d = String(currentDate.getDate()).padStart(2, '0')
      const dateKey = `${y}-${m}-${d}`
      
      if (dataMap.has(dateKey)) {
        allDays.push(dataMap.get(dateKey))
      } else {
        const emptyDay: any = { date: dateKey }
        institutionalDepartments.forEach(dept => {
          emptyDay[dept.name.toLowerCase().replace(/\s+/g, '_')] = 0
        })
        allDays.push(emptyDay)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return allDays
  }, [chartData, timeRange, institutionalDepartments])

  // Calcular totais por departamento
  const totalByDepartment = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    institutionalDepartments.forEach(dept => {
      totals[dept.name.toLowerCase().replace(/\s+/g, '_')] = 0
    })
    
    filteredData.forEach(day => {
      institutionalDepartments.forEach(dept => {
        const key = dept.name.toLowerCase().replace(/\s+/g, '_')
        totals[key] += (day[key] || 0)
      })
    })
    
    return totals
  }, [filteredData, institutionalDepartments])

  const topDepartment = React.useMemo(() => {
    const entries = Object.entries(totalByDepartment)
    if (entries.length === 0) return { name: '', total: 0 }
    
    const top = entries.reduce((max, [dept, total]) => 
      total > max.total ? { dept, total } : max
    , { dept: '', total: 0 })
    
    return {
      name: chartConfig[top.dept as keyof typeof chartConfig]?.label || top.dept,
      total: top.total
    }
  }, [totalByDepartment, chartConfig])

  const totalProjects = React.useMemo(() => {
    return Object.values(totalByDepartment).reduce((sum, val) => sum + val, 0)
  }, [totalByDepartment])

  // Helper para obter label do intervalo de tempo
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d": return t.charts?.time_ranges?.last_7_days || "last 7 days"
      case "30d": return t.charts?.time_ranges?.last_30_days || "last 30 days"
      case "90d": return t.charts?.time_ranges?.last_3_months || "last 3 months"
      case "180d": return t.charts?.time_ranges?.last_6_months || "last 6 months"
      case "365d": return t.charts?.time_ranges?.last_12_months || "last 12 months"
      default: return "last 3 months"
    }
  }

  if (loading) {
    return (
      <Card className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="border-b py-5">
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1 px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="space-y-4">
            {/* Chart skeleton */}
            <div className="h-[300px] bg-muted/30 rounded-lg animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around p-4 gap-2">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-muted/60 rounded-t animate-pulse w-full"
                    style={{ 
                      height: `${Math.random() * 60 + 30}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Legend skeleton */}
            <div className="flex items-center justify-center gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-muted rounded-full animate-pulse" />
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-3 border-t">
          <div className="h-4 bg-muted rounded w-40 animate-pulse" />
          <div className="h-3 bg-muted rounded w-32 animate-pulse mt-1" />
        </CardFooter>
      </Card>
    )
  }

  if (institutionalDepartments.length === 0 || filteredData.length === 0) {
    return (
      <Card className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="border-b py-5">
          <CardTitle>{t.charts?.projects_over_time?.title || "Projects Created Over Time"}</CardTitle>
          <CardDescription>
            {t.charts?.projects_over_time?.description || "Project creation timeline by institutional departments"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="text-center space-y-6 max-w-md">
            {/* Empty state illustration */}
            <div className="relative h-[240px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="space-y-2 w-full px-8">
                {/* Empty chart bars */}
                <div className="flex items-end justify-around gap-2 h-32">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      className="bg-muted/40 rounded-t w-full"
                      style={{ height: `${20 + (i % 3) * 15}%` }}
                    />
                  ))}
                </div>
                {/* X-axis line */}
                <div className="h-px bg-muted" />
              </div>
            </div>
            
            {/* Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">
                  {t.charts?.no_data?.title || "No Project Data Available"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.charts?.no_data?.description || "Projects will appear here once they are created in the selected time period."}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-3 border-t">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            0 {t.stats?.projects || "projects"} {getTimeRangeLabel(timeRange)}
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{t.charts?.projects_over_time?.title || "Projects Created Over Time"}</CardTitle>
          <CardDescription>
            {t.charts?.projects_over_time?.description || `Project creation timeline by institutional departments - ${getTimeRangeLabel(timeRange)}`}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("area")}
              className="h-7 px-2"
            >
              <Activity className="w-3 h-3" />
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-7 px-2"
            >
              <BarChart3 className="w-3 h-3" />
            </Button>
          </div>
          {/* Time Range Select */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">{t.charts?.time_ranges?.last_7_days || "Last 7 days"}</SelectItem>
              <SelectItem value="30d" className="rounded-lg">{t.charts?.time_ranges?.last_30_days || "Last 30 days"}</SelectItem>
              <SelectItem value="90d" className="rounded-lg">{t.charts?.time_ranges?.last_3_months || "Last 3 months"}</SelectItem>
              <SelectItem value="180d" className="rounded-lg">{t.charts?.time_ranges?.last_6_months || "Last 6 months"}</SelectItem>
              <SelectItem value="365d" className="rounded-lg">{t.charts?.time_ranges?.last_12_months || "Last 12 months"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          {chartType === "area" ? (
            <AreaChart data={filteredData}>
              <defs>
                {institutionalDepartments.map((dept) => {
                  const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                  return (
                    <linearGradient key={dept.id} id={`fill${deptKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={departmentColors[deptKey]} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={departmentColors[deptKey]} stopOpacity={0.1} />
                    </linearGradient>
                  )
                })}
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  if (timeRange === "7d" || timeRange === "30d") {
                    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
                      month: "short",
                      day: "numeric"
                    })
                  }
                  return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
                    month: "short",
                    year: timeRange === "365d" ? "2-digit" : undefined,
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                allowDecimals={false}
                tickFormatter={(value) => {
                  const intValue = Math.floor(value)
                  if (intValue === 0) return "0"
                  if (intValue >= 1000) return `${Math.floor(intValue / 1000)}k`
                  return intValue.toString()
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              {institutionalDepartments.map((dept) => {
                const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                return (
                  <Area
                    key={dept.id}
                    dataKey={deptKey}
                    type="natural"
                    fill={`url(#fill${deptKey})`}
                    stroke={departmentColors[deptKey]}
                    strokeWidth={2}
                    stackId="a"
                  />
                )
              })}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          ) : (
            <BarChart data={filteredData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  if (timeRange === "7d" || timeRange === "30d") {
                    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
                      month: "short",
                      day: "numeric"
                    })
                  }
                  return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
                    month: "short"
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                tickFormatter={(value) => {
                  const intValue = Math.floor(value)
                  if (intValue === 0) return "0"
                  if (intValue >= 1000) return `${Math.floor(intValue / 1000)}k`
                  return intValue.toString()
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    }}
                    hideLabel={false}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {institutionalDepartments.map((dept) => {
                const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                return (
                  <Bar
                    key={dept.id}
                    dataKey={deptKey}
                    fill={departmentColors[deptKey]}
                    stackId="a"
                    radius={[0, 0, 0, 0]}
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
          {totalProjects} {t.stats?.projects || "projects"} {getTimeRangeLabel(timeRange)}
        </div>
        <div className="text-muted-foreground">
          {t.common?.top || "Top"}: <span className="font-medium text-foreground">{topDepartment.name}</span> ({topDepartment.total} {t.stats?.projects || "projects"})
        </div>
      </CardFooter>
    </Card>
  )
}
