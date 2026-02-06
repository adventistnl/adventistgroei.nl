"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Activity, BarChart3, TrendingUp } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartHeader } from "@/components/charts/chart-header"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartLegendContainer, ChartLegendItem } from "@/components/charts/chart-legend-item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { churchTranslations } from "@/lib/translations/churches"
import { getProjectColor } from "@/lib/chart-colors"

interface ChurchProjectOverTimeChartProps {
  loading?: boolean
  churches?: any[]
  projects?: any[]
  selectedYear?: number
}

export function ChurchProjectOverTimeChart({ 
  loading, 
  churches = [], 
  projects = [],
  selectedYear = new Date().getFullYear() 
}: ChurchProjectOverTimeChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en

  // Filtrar apenas igrejas ativas
  const activeChurches = React.useMemo(() => {
    if (!churches || churches.length === 0) return []

    const filtered = churches.filter((church: any) => 
      church && church.id && church.name && !church.is_deleted
    )
    
    return filtered
  }, [churches])

  // Filtrar projetos vinculados a churches (tanto diretamente quanto por departamentos de igreja)
  const churchProjects = React.useMemo(() => {
    if (!projects || projects.length === 0) return []
    
    const churchIds = new Set(activeChurches.map(c => c.id))
    
    // Buscar projetos que:
    // 1. Têm church_id direto OU
    // 2. Têm church_department_id vinculado a uma igreja ativa OU
    // 3. Através do objeto Church/church
    const filtered = projects.filter((p: any) => {
      const directChurchId = p.church_id || p.church?.id || p.Church?.id
      
      // Se tem church_id direto
      if (directChurchId && churchIds.has(directChurchId)) {
        return true
      }
      
      // Se tem church_department_id, procurar a church através dos departments
      if (p.church_department_id) {
        const churchDept = activeChurches.find(church => 
          church.departments?.some((d: any) => d.id === p.church_department_id)
        )
        if (churchDept) {
          return true
        }
      }
      
      return false
    })
    
    return filtered
  }, [projects, activeChurches])

  // Gerar dados de criação de projetos ao longo do tempo
  const chartData = React.useMemo(() => {
    if (activeChurches.length === 0 || churchProjects.length === 0) {
      return []
    }

    // Criar mapa para armazenar contagem diária
    const dailyCounts = new Map<string, any>()

    // Contar projetos por data e igreja
    churchProjects.forEach((project: any) => {
      const createdDate = new Date(project.created_at || project.start_at)
      const dateKey = createdDate.toISOString().split('T')[0] // YYYY-MM-DD format
      
      if (!dailyCounts.has(dateKey)) {
        const dateData: any = { date: dateKey }
        activeChurches.forEach(church => {
          const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
          dateData[churchKey] = 0
        })
        dailyCounts.set(dateKey, dateData)
      }

      // Identificar a igreja do projeto
      const churchId = project.church_id || project.church?.id || project.Church?.id
      let church = activeChurches.find(c => c.id === churchId)
      
      // Se não encontrou pela church_id, tentar pelo church_department_id
      if (!church && project.church_department_id) {
        church = activeChurches.find(c => 
          c.departments?.some((d: any) => d.id === project.church_department_id)
        )
      }
      
      if (church) {
        const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
        const dateData = dailyCounts.get(dateKey)!
        dateData[churchKey] += 1
      }
    })

    // Converter map para array e ordenar por data
    const sortedData = Array.from(dailyCounts.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    return sortedData
  }, [churchProjects, activeChurches])

  // Gerar cores dinâmicas para cada igreja usando getProjectColor
  const churchColors = React.useMemo(() => {
    const colorMap: { [key: string]: string } = {}

    activeChurches.forEach((church, index) => {
      const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
      colorMap[churchKey] = getProjectColor(index)
    })

    return colorMap
  }, [activeChurches])

  // Configuração dinâmica do gráfico baseada nas igrejas reais
  const chartConfig = React.useMemo(() => {
    const config: any = {
      totalProjects: {
        label: t.charts?.projects || "Projects",
      }
    }

    activeChurches.forEach((church) => {
      const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
      config[churchKey] = {
        label: church.name,
        color: churchColors[churchKey],
      }
    })

    return config
  }, [activeChurches, churchColors, t.charts])

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
        activeChurches.forEach(church => {
          emptyDay[church.name.toLowerCase().replace(/\s+/g, '_')] = 0
        })
        allDays.push(emptyDay)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return allDays
  }, [chartData, timeRange, activeChurches])

  // Calcular totais por igreja
  const totalByChurch = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    activeChurches.forEach(church => {
      totals[church.name.toLowerCase().replace(/\s+/g, '_')] = 0
    })
    
    filteredData.forEach(day => {
      activeChurches.forEach(church => {
        const key = church.name.toLowerCase().replace(/\s+/g, '_')
        totals[key] += (day[key] || 0)
      })
    })
    
    return totals
  }, [filteredData, activeChurches])

  const topChurch = React.useMemo(() => {
    const entries = Object.entries(totalByChurch)
    if (entries.length === 0) return { name: '', total: 0 }
    
    const top = entries.reduce((max, [church, total]) => 
      total > max.total ? { church, total } : max
    , { church: '', total: 0 })
    
    return {
      name: chartConfig[top.church as keyof typeof chartConfig]?.label || top.church,
      total: top.total
    }
  }, [totalByChurch, chartConfig])

  const totalProjects = React.useMemo(() => {
    return Object.values(totalByChurch).reduce((sum, val) => sum + val, 0)
  }, [totalByChurch])

  // Helper para obter label do intervalo de tempo
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d": return t.charts?.timeRanges?.last7Days || "last 7 days"
      case "30d": return t.charts?.timeRanges?.last30Days || "last 30 days"
      case "90d": return t.charts?.timeRanges?.last3Months || "last 3 months"
      case "180d": return t.charts?.timeRanges?.last6Months || "last 6 months"
      case "365d": return t.charts?.timeRanges?.last12Months || "last 12 months"
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

  if (activeChurches.length === 0 || filteredData.length === 0) {
    return (
      <Card className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="border-b py-5">
          <CardTitle>{t.charts?.projectsOverTime?.title || "Projects Created Over Time"}</CardTitle>
          <CardDescription>
            {t.charts?.projectsOverTime?.description || "Project creation timeline by churches"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="text-center space-y-6 max-w-md">
            {/* Empty state illustration */}
            <div className="relative h-[240px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="space-y-2 w-full px-8">
                {/* Empty bars */}
                <div className="flex items-end justify-around gap-2 h-32">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="bg-muted/40 rounded-t w-full"
                      style={{ height: `${30 + (i * 10)}%` }}
                    />
                  ))}
                </div>
                {/* Axis line */}
                <div className="h-px bg-muted" />
              </div>
            </div>
            
            {/* Message */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">
                  {t.charts?.noData?.title || "No Project Data Available"}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {t.charts?.noData?.description || "Projects will appear here once they are created in the selected time period."}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-xs pt-3 border-t">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            0 {t.page?.totalProjects || "projects"} {getTimeRangeLabel(timeRange)}
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <ChartHeader
        title={t.charts?.projectsOverTime?.title || "Projects Created Over Time"}
        description={t.charts?.projectsOverTime?.description || `Project creation timeline by churches - ${getTimeRangeLabel(timeRange)}`}
        actions={
          <>
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
                className="w-full sm:w-[160px] rounded-lg"
                aria-label="Select time range"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  {t.charts?.timeRanges?.last7Days || "Last 7 days"}
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  {t.charts?.timeRanges?.last30Days || "Last 30 days"}
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  {t.charts?.timeRanges?.last3Months || "Last 3 months"}
                </SelectItem>
                <SelectItem value="180d" className="rounded-lg">
                  {t.charts?.timeRanges?.last6Months || "Last 6 months"}
                </SelectItem>
                <SelectItem value="365d" className="rounded-lg">
                  {t.charts?.timeRanges?.last12Months || "Last 12 months"}
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          {chartType === "area" ? (
            <AreaChart data={filteredData}>
              <defs>
                {activeChurches.map((church) => {
                  const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
                  return (
                    <linearGradient key={church.id} id={`fill${churchKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={churchColors[churchKey]} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={churchColors[churchKey]} stopOpacity={0.1} />
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
              {activeChurches.map((church) => {
                const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
                return (
                  <Area
                    key={church.id}
                    dataKey={churchKey}
                    type="natural"
                    fill={`url(#fill${churchKey})`}
                    stroke={churchColors[churchKey]}
                    strokeWidth={2}
                    stackId="a"
                  />
                )
              })}
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
              {activeChurches.map((church) => {
                const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
                return (
                  <Bar
                    key={church.id}
                    dataKey={churchKey}
                    fill={churchColors[churchKey]}
                    stackId="a"
                    radius={[0, 0, 0, 0]}
                  />
                )
              })}
            </BarChart>
          )}
        </ChartContainer>
        
        {/* Custom Legend with tooltips */}
        <ChartLegendContainer layout="horizontal" className="mt-4">
          {activeChurches.map((church, index) => {
            const churchKey = church.name.toLowerCase().replace(/\s+/g, '_')
            const projectCount = totalByChurch[churchKey] || 0
            const percentage = totalProjects > 0 
              ? Math.round((projectCount / totalProjects) * 100) 
              : 0
            
            return (
              <ChartLegendItem
                key={church.id}
                label={church.name}
                description={`${church.name} • ${projectCount} ${t.charts?.projects || 'projects'} • ${percentage}%`}
                color={churchColors[churchKey]}
                value={projectCount}
                valueFormatter={(val) => `${val} ${t.charts?.projects || 'projects'}`}
                variant="compact"
              />
            )
          })}
        </ChartLegendContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs pt-3 border-t">
        <div className="flex items-center gap-1.5 font-medium">
          <TrendingUp className="h-3 w-3" />
          {totalProjects} {t.page?.totalProjects || "projects"} {getTimeRangeLabel(timeRange)}
        </div>
        <div className="text-muted-foreground">
          Top: <span className="font-medium text-foreground">{topChurch.name}</span> ({topChurch.total} {t.page?.totalProjects || "projects"})
        </div>
      </CardFooter>
    </Card>
  )
}
