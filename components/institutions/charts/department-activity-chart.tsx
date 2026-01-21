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

interface DepartmentActivityChartProps {
  loading?: boolean
  departments?: any[]
  projects?: any[]
  selectedYear?: number
}

export function DepartmentActivityChart({ 
  loading, 
  departments = [], 
  projects = [],
  selectedYear = new Date().getFullYear() 
}: DepartmentActivityChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  // Filtrar apenas departamentos ativos de igreja (com church_id)
  const churchDepartments = React.useMemo(() => {
    if (!departments || departments.length === 0) return []

    const filtered = departments.filter((dept: any) => 
      dept && dept.id && dept.name && !dept.is_deleted && dept.church_id
    )
    
    console.log('📊 [DepartmentActivityChart] Church Departments:', {
      total: departments.length,
      filtered: filtered.length,
      departmentsList: filtered.map(d => ({ 
        id: d.id, 
        name: d.name, 
        church_id: d.church_id,
        church_name: d.church_name 
      }))
    })
    
    return filtered
  }, [departments])

  // Filtrar projetos vinculados a church departments
  const churchDepartmentProjects = React.useMemo(() => {
    if (!projects || projects.length === 0) return []
    
    const churchDeptIds = new Set(churchDepartments.map(d => d.id))
    const filtered = projects.filter((p: any) => 
      p.church_department_id && churchDeptIds.has(p.church_department_id)
    )
    
    console.log('📊 [DepartmentActivityChart] Projects filtered:', {
      totalProjects: projects.length,
      churchDepartmentProjects: filtered.length,
      byDepartment: filtered.reduce((acc: any, p: any) => {
        const dept = churchDepartments.find(d => d.id === p.church_department_id)
        const deptName = dept?.name || 'Unknown'
        acc[deptName] = (acc[deptName] || 0) + 1
        return acc
      }, {})
    })
    
    return filtered
  }, [projects, churchDepartments])

  // Gerar dados de criação de projetos ao longo do tempo
  const chartData = React.useMemo(() => {
    if (churchDepartments.length === 0 || churchDepartmentProjects.length === 0) {
      return []
    }

    // Criar mapa para armazenar contagem diária
    const dailyCounts = new Map<string, any>()

    // Contar projetos por data e departamento
    churchDepartmentProjects.forEach((project: any) => {
      const createdDate = new Date(project.created_at || project.start_at)
      const dateKey = createdDate.toISOString().split('T')[0] // YYYY-MM-DD format
      
      if (!dailyCounts.has(dateKey)) {
        const dateData: any = { date: dateKey }
        churchDepartments.forEach(dept => {
          const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
          dateData[deptKey] = 0
        })
        dailyCounts.set(dateKey, dateData)
      }

      const dept = churchDepartments.find(d => d.id === project.church_department_id)
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
    
    console.log('📊 [DepartmentActivityChart] Chart data:', {
      totalDays: sortedData.length,
      dateRange: sortedData.length > 0 ? {
        start: sortedData[0]?.date,
        end: sortedData[sortedData.length - 1]?.date
      } : null,
      sampleData: sortedData.slice(0, 3)
    })
    
    return sortedData
  }, [churchDepartmentProjects, churchDepartments])
  
  const { generatePalette } = useChartColors()

  // Gerar cores dinâmicas para cada departamento
  const departmentColors = React.useMemo(() => {
    const palette = generatePalette(churchDepartments.length)
    const colorMap: { [key: string]: string } = {}

    churchDepartments.forEach((dept, index) => {
      const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
      colorMap[deptKey] = palette[index]
    })

    return colorMap
  }, [churchDepartments, generatePalette])

  // Configuração dinâmica do gráfico baseada nos departamentos reais
  const chartConfig = React.useMemo(() => {
    const config: any = {
      totalProjects: {
        label: t.charts?.projects || "Projects",
      }
    }

    churchDepartments.forEach((dept) => {
      const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
      config[deptKey] = {
        label: dept.name,
        color: departmentColors[deptKey],
      }
    })

    return config
  }, [churchDepartments, departmentColors, t.charts])

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
        churchDepartments.forEach(dept => {
          emptyDay[dept.name.toLowerCase().replace(/\s+/g, '_')] = 0
        })
        allDays.push(emptyDay)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    console.log('📊 [DepartmentActivityChart] Filtered data:', {
      timeRange,
      totalDays: allDays.length,
      daysWithProjects: allDays.filter(d => 
        churchDepartments.some(dept => {
          const key = dept.name.toLowerCase().replace(/\s+/g, '_')
          return d[key] > 0
        })
      ).length
    })
    
    return allDays
  }, [chartData, timeRange, churchDepartments])

  // Calcular totais por departamento
  const totalByDepartment = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    churchDepartments.forEach(dept => {
      totals[dept.name.toLowerCase().replace(/\s+/g, '_')] = 0
    })
    
    filteredData.forEach(day => {
      churchDepartments.forEach(dept => {
        const key = dept.name.toLowerCase().replace(/\s+/g, '_')
        totals[key] += (day[key] || 0)
      })
    })
    
    return totals
  }, [filteredData, churchDepartments])

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
    const timePeriodsKey = t.charts?.projects_over_time?.time_periods
    switch (range) {
      case "7d": return (timePeriodsKey?.last_7_days || "last 7 days").toLowerCase()
      case "30d": return (timePeriodsKey?.last_30_days || "last 30 days").toLowerCase()
      case "90d": return (timePeriodsKey?.last_3_months || "last 3 months").toLowerCase()
      case "180d": return (timePeriodsKey?.last_6_months || "last 6 months").toLowerCase()
      case "365d": return (timePeriodsKey?.last_12_months || "last 12 months").toLowerCase()
      default: return (timePeriodsKey?.last_3_months || "last 3 months").toLowerCase()
    }
  }

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b py-5">
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (churchDepartments.length === 0 || filteredData.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="border-b py-5">
          <CardTitle>{t.charts?.projects_over_time?.title || "Projects Created Over Time"}</CardTitle>
          <CardDescription>
            {t.charts?.projects_over_time?.description || "Visualization of project creation by department over time"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground text-sm">
            {t.charts?.projects_over_time?.no_data || "No project data available"}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{t.charts?.projects_over_time?.title || "Projects Created Over Time"}</CardTitle>
          <CardDescription>
            {t.charts?.projects_over_time?.description || "Visualization of project creation by department over time"}
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
              title={t.charts?.projects_over_time?.chart_type_area || "Area Chart"}
            >
              <Activity className="w-3 h-3" />
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-7 px-2"
              title={t.charts?.projects_over_time?.chart_type_bar || "Bar Chart"}
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
              <SelectValue placeholder={t.charts?.projects_over_time?.time_periods?.last_3_months || "Last 3 months"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d" className="rounded-lg">
                {t.charts?.projects_over_time?.time_periods?.last_7_days || "Last 7 days"}
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                {t.charts?.projects_over_time?.time_periods?.last_30_days || "Last 30 days"}
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                {t.charts?.projects_over_time?.time_periods?.last_3_months || "Last 3 months"}
              </SelectItem>
              <SelectItem value="180d" className="rounded-lg">
                {t.charts?.projects_over_time?.time_periods?.last_6_months || "Last 6 months"}
              </SelectItem>
              <SelectItem value="365d" className="rounded-lg">
                {t.charts?.projects_over_time?.time_periods?.last_12_months || "Last 12 months"}
              </SelectItem>
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
                {churchDepartments.map((dept) => {
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
                tickFormatter={(value) => {
                  if (value === 0) return "0"
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
                  return value.toString()
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
              {churchDepartments.map((dept) => {
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
                tickFormatter={(value) => {
                  if (value === 0) return "0"
                  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
                  return value.toString()
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
              {churchDepartments.map((dept) => {
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
          {totalProjects} {t.charts?.projects_over_time?.footer?.total_projects || t.stats?.projects || "projects"} {t.charts?.projects_over_time?.footer?.in_period || "in"} {getTimeRangeLabel(timeRange)}
        </div>
        <div className="text-muted-foreground">
          {t.charts?.projects_over_time?.footer?.top_department || "Top"}: <span className="font-medium text-foreground">{topDepartment.name}</span> ({topDepartment.total} {t.charts?.projects_over_time?.footer?.total_projects || t.stats?.projects || "projects"})
        </div>
      </CardFooter>
    </Card>
  )
}
