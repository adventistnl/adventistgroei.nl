"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"
import { TrendingUp, Building2, Activity, BarChart3 } from "lucide-react"
import { getProjectColor } from "@/lib/chart-colors"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionDeniedOverlay } from "@/components/shared/permission-denied-overlay"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { Skeleton } from "@/components/ui/skeleton"
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

interface ProjectsOverTimeChartProps {
  data: any[]
  institutions?: any[]
  departments?: any[]
  loading?: boolean
  selectedYear?: number
}

export function ProjectsOverTimeChart({ 
  data = [], 
  institutions = [],
  departments = [],
  loading = false,
  selectedYear
}: ProjectsOverTimeChartProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  
  
  // Determine grouping mode: departments (for projects page) or institutions (for institutions page)
  const groupingMode = React.useMemo(() => {
    if (departments.length > 0) return 'departments'
    if (institutions.length > 0) return 'institutions'
    return 'none'
  }, [departments.length, institutions.length])

  // Use departments or institutions based on what's available
  const activeGroups = React.useMemo(() => {
    if (groupingMode === 'departments') {
      // Filter valid departments
      if (!departments || !Array.isArray(departments)) {
        return []
      }
      
      const filtered = departments.filter(dept => dept && dept.id && dept.name)
      

      
      return filtered
    } else if (groupingMode === 'institutions') {
      // Filter valid institutions
      if (!institutions || !Array.isArray(institutions)) {
        return []
      }
      
      const filtered = institutions.filter(inst => inst && inst.id && inst.name)
      
      return filtered
    }
    
    return []
  }, [institutions, departments, groupingMode])
  
  // Use selectedYear if provided, otherwise use current year
  const chartYear = selectedYear || new Date().getFullYear()

  // Generate dynamic chart config based on active groups (departments or institutions)
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      totalProjects: {
        label: t.charts.projects,
      }
    }

    activeGroups.forEach((group, index) => {
      config[group.id] = {
        label: group.name,
        color: getProjectColor(index)
      }
    })

    return config
  }, [activeGroups, groupingMode, t.charts.projects])

  // Transform data to show dates on X-axis and groups (departments/institutions) as separate areas
  const chartData = React.useMemo(() => {
    // Filter projects based on grouping mode and selected year
    let filteredProjects: any[]
    
    if (groupingMode === 'departments') {
      // Filter projects by department_id and selected year
      filteredProjects = data.filter(project => {
        const projectDept = activeGroups.find(d => d.id === project.department_id)
        if (projectDept === undefined) return false
        
        // Filter by selected year if provided
        if (selectedYear) {
          const projectDate = new Date(project.created_at || project.start_at)
          const projectYear = projectDate.getFullYear()
          return projectYear === selectedYear
        }
        
        return true
      })
      
    } else if (groupingMode === 'institutions') {
      // Filter projects by institution_id and selected year
      filteredProjects = data.filter(project => {
        const projectInst = activeGroups.find(i => i.id === project.institution_id)
        if (projectInst === undefined) return false
        
        // Filter by selected year if provided
        if (selectedYear) {
          const projectDate = new Date(project.created_at || project.start_at)
          const projectYear = projectDate.getFullYear()
          return projectYear === selectedYear
        }
        
        return true
      })
    } else {
      filteredProjects = []
    }

    // Create a map to store daily counts
    const dailyCounts = new Map<string, any>()

    // Count projects by date and group (department or institution)
    filteredProjects.forEach(project => {
      const createdDate = new Date(project.created_at || project.start_at)
      const dateKey = createdDate.toISOString().split('T')[0] // YYYY-MM-DD format
      
      if (!dailyCounts.has(dateKey)) {
        const dateData: any = { date: dateKey }
        activeGroups.forEach(group => {
          dateData[group.id] = 0
        })
        dailyCounts.set(dateKey, dateData)
      }

      // Find the group based on grouping mode
      let group: any
      if (groupingMode === 'departments') {
        group = activeGroups.find(d => d.id === project.department_id)
      } else if (groupingMode === 'institutions') {
        group = activeGroups.find(i => i.id === project.institution_id)
      }
      
      if (group) {
        const dateData = dailyCounts.get(dateKey)!
        dateData[group.id] += 1
      }
    })

    // Convert map to array and sort by date
    const sortedData = Array.from(dailyCounts.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    return sortedData
  }, [data, activeGroups, groupingMode, selectedYear])

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return []
    
    // Define date range based on selected year
    let endDate: Date
    let endDateStr: string
    
    if (selectedYear) {
      // If a specific year is selected, limit to that year
      const today = new Date()
      const isCurrentYear = selectedYear === today.getFullYear()
      
      if (isCurrentYear) {
        // For current year, use today as end date
        endDate = today
      } else {
        // For past/future years, use December 31st
        endDate = new Date(selectedYear, 11, 31) // Month 11 = December
      }
      
      const year = endDate.getFullYear()
      const month = String(endDate.getMonth() + 1).padStart(2, '0')
      const day = String(endDate.getDate()).padStart(2, '0')
      endDateStr = `${year}-${month}-${day}`
    } else {
      // If no year selected, use today
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0')
      const day = String(today.getDate()).padStart(2, '0')
      endDateStr = `${year}-${month}-${day}`
      endDate = today
    }
    
    // Calculate start date based on time range
    const daysMap: Record<string, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "180d": 180,
      "365d": 365
    }
    const daysToSubtract = daysMap[timeRange] || 90
    
    // Start date (X days ago from end date)
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    
    // If selected year is set, ensure start date is not before January 1st of that year
    if (selectedYear) {
      const yearStart = new Date(selectedYear, 0, 1) // Month 0 = January
      if (startDate < yearStart) {
        startDate.setTime(yearStart.getTime())
      }
    }
    
    const startYear = startDate.getFullYear()
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
    const startDay = String(startDate.getDate()).padStart(2, '0')
    const startDateStr = `${startYear}-${startMonth}-${startDay}`
    
    
    // Filter existing data within time range - using string comparison
    const filtered = chartData.filter(item => {
      const inRange = item.date >= startDateStr && item.date <= endDateStr
      if (!inRange) {
      }
      return inRange
    })
    
    
    // Para períodos >= 90 dias, agrupar por mês
    const shouldGroupByMonth = timeRange === "90d" || timeRange === "180d" || timeRange === "365d"
    
    if (shouldGroupByMonth) {
      // Agrupar dados por mês
      const monthlyData = new Map<string, any>()
      
      filtered.forEach(item => {
        const date = new Date(item.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!monthlyData.has(monthKey)) {
          const monthData: any = { date: `${monthKey}-15` } // Usar dia 15 para melhor centralização
          activeGroups.forEach(group => {
            monthData[group.id] = 0
          })
          monthlyData.set(monthKey, monthData)
        }
        
        const monthData = monthlyData.get(monthKey)!
        activeGroups.forEach(group => {
          monthData[group.id] += (item[group.id] || 0)
        })
      })
      
      // Calcular meses a partir da data final
      const monthsToShow = timeRange === "90d" ? 3 : timeRange === "180d" ? 6 : 12
      const allMonths: any[] = []
      
      // Começar do mês da endDate e voltar X meses
      const currentMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 15)
      
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const targetDate = new Date(endDate.getFullYear(), endDate.getMonth() - i, 15)
        const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`
        const dateKey = `${monthKey}-15`
        
        if (monthlyData.has(monthKey)) {
          allMonths.push(monthlyData.get(monthKey))
        } else {
          const emptyMonth: any = { date: dateKey }
          activeGroups.forEach(group => {
            emptyMonth[group.id] = 0
          })
          allMonths.push(emptyMonth)
        }
      }
      
      return allMonths
    }
    
    // Fill missing days with zeros (para períodos < 90 dias)
    const dataMap = new Map(filtered.map(item => [item.date, item]))
    const allDays: any[] = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      const y = currentDate.getFullYear()
      const m = String(currentDate.getMonth() + 1).padStart(2, '0')
      const d = String(currentDate.getDate()).padStart(2, '0')
      const dateKey = `${y}-${m}-${d}`
      
      if (dataMap.has(dateKey)) {
        allDays.push(dataMap.get(dateKey))
      } else {
        const emptyDay: any = { date: dateKey }
        activeGroups.forEach(group => {
          emptyDay[group.id] = 0
        })
        allDays.push(emptyDay)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    const daysWithData = allDays.filter(d => {
      return activeGroups.some(group => d[group.id] > 0)
    })
    
    
    return allDays
  }, [chartData, timeRange, activeGroups, selectedYear])

  // Calculate total by group (department or institution)
  const totalByGroup = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    // Initialize all groups with 0
    activeGroups.forEach(group => {
      totals[group.id] = 0
    })
    
    // Sum all values from filteredData
    filteredData.forEach(day => {
      activeGroups.forEach(group => {
        totals[group.id] += (day[group.id] || 0)
      })
    })
    
    const totalProjects = Object.values(totals).reduce((sum, val) => sum + val, 0)
    
    
    return totals
  }, [filteredData, activeGroups, timeRange])

  const topGroup = React.useMemo(() => {
    const entries = Object.entries(totalByGroup)
    if (entries.length === 0) return { name: '', total: 0 }
    
    const top = entries.reduce((max, [group, total]) => 
      total > max.total ? { group, total } : max
    , { group: '', total: 0 })
    
    return {
      name: chartConfig[top.group as keyof typeof chartConfig]?.label || top.group,
      total: top.total
    }
  }, [totalByGroup, chartConfig])

  const totalProjects = React.useMemo(() => {
    return Object.values(totalByGroup).reduce((sum, val) => sum + val, 0)
  }, [totalByGroup])

  // Helper function to get time range label
  const getTimeRangeLabel = (range: string) => {
    const charts = t.charts as any // Type assertion para acesso seguro às propriedades
    switch (range) {
      case "7d":
        return (charts.last7Days || charts.last7Days || "Last 7 days").toLowerCase()
      case "30d":
        return (charts.last30Days || charts.last30Days || "Last 30 days").toLowerCase()
      case "90d":
        return (charts.last3Months || charts.last3Months || "Last 3 months").toLowerCase()
      case "180d":
        return (charts.last6Months || charts.last6Months || "Last 6 months").toLowerCase()
      case "365d":
        return (charts.last12Months || charts.last12Months || "Last 12 months").toLowerCase()
      default:
        return (charts.last3Months || charts.last3Months || "Last 3 months").toLowerCase()
    }
  }

  if (loading) {
    return (
      <WithPermission
        requiredPermissions={[PermissionResolverName.Projects]}
        fallback={<PermissionDeniedOverlay height="500px" blurIntensity="medium">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
            <CardContent className="flex-1">
              <Skeleton className="h-[250px] w-full" />
            </CardContent>
          </Card>
        </PermissionDeniedOverlay>}
      >
        <Card className="h-full flex flex-col">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-[250px] bg-muted rounded animate-pulse" />
          </CardContent>
        </Card>
      </WithPermission>
    )
  }

  if (activeGroups.length === 0 || filteredData.length === 0) {
    return (
      <WithPermission
        requiredPermissions={[PermissionResolverName.Projects, PermissionResolverName.Departments]}
        fallback={<PermissionDeniedOverlay height="500px" blurIntensity="medium">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        </PermissionDeniedOverlay>}
      >
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4" />
              {t.charts.projectsCreatedOverTime}
            </CardTitle>
            <CardDescription className="text-xs">
              {t.charts.monthlyProjectCreation}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t.charts.noProjectData}</p>
            </div>
          </CardContent>
        </Card>
      </WithPermission>
    )
  }

  return (
    <WithPermission
      requiredPermissions={[PermissionResolverName.Projects]}
      fallback={<PermissionDeniedOverlay height="500px" blurIntensity="medium">
        {/* Skeleton do Projects Over Time Chart */}
        <Card className="h-full flex flex-col">
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32 mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-[160px]" />
            </div>
          </CardHeader>
          <CardContent className="pr-2 pt-4 sm:pr-6 sm:pt-6">
            <Skeleton className="h-[250px] w-full" />
          </CardContent>
          <div className="flex-col items-start gap-1 text-xs pt-3 border-t px-6 pb-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56 mt-1" />
          </div>
        </Card>
      </PermissionDeniedOverlay>}
    >
    <Card className="h-full flex flex-col">
      <ChartHeader
        title={
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4" />
            {t.charts.projectsCreatedOverTime}
          </div>
        }
        description={`${t.charts.showingTotal} ${getTimeRangeLabel(timeRange)}`}
        actions={
          <>
            {/* Chart Type Toggle */}
            <div className="flex max-w-[80px] items-center gap-1 border rounded-lg p-1">
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
                aria-label={t.charts.selectTimeRange}
              >
                <SelectValue placeholder={t.charts.last3Months} />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-sidebar">
                <SelectItem value="7d" className="rounded-lg">
                  {(t.charts as any).last7Days || "Last 7 days"}
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  {(t.charts as any).last30Days || "Last 30 days"}
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  {(t.charts as any).last3Months || "Last 3 months"}
                </SelectItem>
                <SelectItem value="180d" className="rounded-lg">
                  {(t.charts as any).last6Months || "Last 6 months"}
                </SelectItem>
                <SelectItem value="365d" className="rounded-lg">
                  {(t.charts as any).last12Months || "Last 12 months"}
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />
      <CardContent className="pr-2 pt-4 sm:pr-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          {chartType === "area" ? (
            <AreaChart data={filteredData}>
              <defs>
                {activeGroups.map((group) => (
                    <linearGradient key={group.id} id={`fill_${group.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig[group.id]?.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig[group.id]?.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                ))}
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
                  // Para períodos curtos (7d, 30d), mostrar dia/mês
                  if (timeRange === "7d" || timeRange === "30d") {
                    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
                      day: "numeric",
                      month: "short",
                    })
                  }
                  // Para períodos longos (90d+), mostrar apenas mês
                  return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
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
                      return new Date(value).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              {activeGroups.map((group) => (
                  <Area
                    key={group.id}
                    dataKey={group.id}
                    type="natural"
                    fill={`url(#fill_${group.id})`}
                    stroke={chartConfig[group.id]?.color}
                    strokeWidth={2}
                    stackId="a"
                  />
              ))}
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
                  // Para períodos curtos (7d, 30d), mostrar dia/mês
                  if (timeRange === "7d" || timeRange === "30d") {
                    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
                      day: "numeric",
                      month: "short",
                    })
                  }
                  // Para períodos longos (90d+), mostrar apenas mês
                  return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
                    month: "short",
                    year: timeRange === "365d" ? "2-digit" : undefined,
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
                      return new Date(value).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
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
              {activeGroups.map((group, index) => {
                const isLast = index === activeGroups.length - 1
                return (
                  <Bar
                    key={group.id}
                    dataKey={group.id}
                    stackId="a"
                    fill={chartConfig[group.id]?.color}
                    radius={isLast ? [4, 4, 0, 0] : [0, 0, 0, 0]}
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
          {totalProjects} {t.charts.projects.toLowerCase()} {getTimeRangeLabel(timeRange)}
        </div>
        <div className="text-muted-foreground">
          {t.charts.top}: <span className="font-medium text-foreground">{topGroup.name}</span> ({topGroup.total} {t.charts.projects.toLowerCase()})
        </div>
      </CardFooter>
    </Card>
    </WithPermission>
  )
}
