"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"
import { TrendingUp, Building2, Activity, BarChart3 } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
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

interface ProjectsOverTimeChartProps {
  data: any[]
  departments: any[]
  loading?: boolean
  selectedYear?: number
}

export function ProjectsOverTimeChart({ 
  data, 
  departments,
  loading,
  selectedYear
}: ProjectsOverTimeChartProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  
  // Use departments directly - they should already be filtered by the parent component
  // The parent page filters to only institutional departments (with institution_id and no church_id)
  const institutionalDepartments = React.useMemo(() => {
    // Ensure departments are valid and have required fields
    const filtered = departments.filter(dept => dept && dept.id && dept.name)
    
    console.log('📊 [ProjectsOverTimeChart] Departments received:', {
      total: departments.length,
      filtered: filtered.length,
      departmentsList: filtered.map(d => ({ id: d.id, name: d.name, institution_id: d.institution_id, church_id: d.church_id }))
    })
    
    return filtered
  }, [departments])
  
  // Use selectedYear if provided, otherwise use current year
  const chartYear = selectedYear || new Date().getFullYear()

  // Generate dynamic chart config based on institutional departments - using system colors
  const chartConfig: ChartConfig = React.useMemo(() => {
    const colors = [
      "var(--chart-1)",      // Blue
      "var(--chart-2)",      // Teal
      "var(--chart-3)",      // Dark Gray / Orange
      "var(--chart-4)",      // Yellow / Purple
      "var(--chart-5)",      // Orange / Red
      "var(--chart-2-light)",
      "var(--chart-2-dark)",
      "var(--chart-2-muted)",
      "var(--chart-2-accent)",
      "var(--chart-2-green)",
    ]

    const config: ChartConfig = {
      totalProjects: {
        label: t.charts.projects,
      }
    }

    institutionalDepartments.forEach((dept, index) => {
      const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
      config[deptKey] = {
        label: dept.name,
        color: colors[index % colors.length]
      }
    })

    return config
  }, [institutionalDepartments, t.charts.projects])

  // Transform data to show dates on X-axis and institutional departments as separate areas
  const chartData = React.useMemo(() => {
    console.log('📊 [ProjectsOverTimeChart] Data received:', {
      totalProjects: data.length,
      sampleProjects: data.slice(0, 3).map(p => ({
        id: p.id,
        title: p.title,
        department_id: p.department_id,
        church_department_id: p.church_department_id,
        created_at: p.created_at,
        start_at: p.start_at
      }))
    })
    
    // Get all projects that belong to institutional departments
    // Include ANY project that has a department_id matching institutional departments
    // This includes both pure institutional projects and church projects (which also have a department_id)
    const institutionalProjects = data.filter(project => {
      // INCLUDE all projects that have a department_id matching institutional departments
      const projectDept = institutionalDepartments.find(d => d.id === project.department_id)
      return projectDept !== undefined
    })
    
    console.log('📊 [ProjectsOverTimeChart] Institutional projects filtered:', {
      total: institutionalProjects.length,
      includesChurchProjects: institutionalProjects.filter(p => p.church_department_id || p.church_department).length,
      pureInstitutionalProjects: institutionalProjects.filter(p => !p.church_department_id && !p.church_department).length,
      byDepartment: institutionalProjects.reduce((acc, p) => {
        const dept = institutionalDepartments.find(d => d.id === p.department_id)
        const deptName = dept?.name || 'Unknown'
        acc[deptName] = (acc[deptName] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    })

    // Create a map to store daily counts
    const dailyCounts = new Map<string, any>()

    // Count projects by date and department
    institutionalProjects.forEach(project => {
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

    // Convert map to array and sort by date
    const sortedData = Array.from(dailyCounts.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    console.log('📊 [ProjectsOverTimeChart] Chart data transformed:', {
      totalDays: sortedData.length,
      dateRange: sortedData.length > 0 ? {
        start: sortedData[0]?.date,
        end: sortedData[sortedData.length - 1]?.date
      } : null,
      sampleData: sortedData.slice(0, 3)
    })
    
    return sortedData
  }, [data, institutionalDepartments])

  // Filter data based on time range - fixed timezone issue
  const filteredData = React.useMemo(() => {
    if (chartData.length === 0) return []
    
    // Get today's date in local timezone (not UTC)
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const todayStr = `${year}-${month}-${day}` // YYYY-MM-DD in local timezone
    
    // Calculate days to subtract based on time range
    const daysMap: Record<string, number> = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "180d": 180,
      "365d": 365
    }
    const daysToSubtract = daysMap[timeRange] || 90
    
    // Start date (X days ago from today) - in local timezone
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    const startYear = startDate.getFullYear()
    const startMonth = String(startDate.getMonth() + 1).padStart(2, '0')
    const startDay = String(startDate.getDate()).padStart(2, '0')
    const startDateStr = `${startYear}-${startMonth}-${startDay}` // YYYY-MM-DD in local timezone
    
    console.log('📊 [ProjectsOverTimeChart] Time range setup:', {
      timeRange,
      todayRaw: today.toString(),
      todayStr,
      startDateStr,
      chartDataDates: chartData.map(d => d.date)
    })
    
    // Filter existing data within time range - using string comparison
    const filtered = chartData.filter(item => {
      const inRange = item.date >= startDateStr && item.date <= todayStr
      if (!inRange) {
        console.log(`📊 Excluding ${item.date} (not in range ${startDateStr} to ${todayStr})`)
      }
      return inRange
    })
    
    console.log('📊 [ProjectsOverTimeChart] After filter:', {
      filteredCount: filtered.length,
      filteredDates: filtered.map(d => d.date),
      filtered: filtered
    })
    
    // Fill missing days with zeros
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
    
    const daysWithData = allDays.filter(d => {
      return institutionalDepartments.some(dept => {
        const key = dept.name.toLowerCase().replace(/\s+/g, '_')
        return d[key] > 0
      })
    })
    
    console.log('📊 [ProjectsOverTimeChart] Final filtered data:', {
      timeRange,
      totalDays: allDays.length,
      daysWithData: daysWithData.length,
      sampleWithData: daysWithData.slice(0, 5)
    })
    
    return allDays
  }, [chartData, timeRange, institutionalDepartments])

  // Calculate total by department - simplified and direct
  const totalByDepartment = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    // Initialize all departments with 0
    institutionalDepartments.forEach(dept => {
      totals[dept.name.toLowerCase().replace(/\s+/g, '_')] = 0
    })
    
    // Sum all values from filteredData
    filteredData.forEach(day => {
      institutionalDepartments.forEach(dept => {
        const key = dept.name.toLowerCase().replace(/\s+/g, '_')
        totals[key] += (day[key] || 0)
      })
    })
    
    const totalProjects = Object.values(totals).reduce((sum, val) => sum + val, 0)
    
    console.log('📊 [ProjectsOverTimeChart] Totals calculated:', {
      timeRange,
      totals,
      totalProjects,
      filteredDataLength: filteredData.length,
      sampleFilteredData: filteredData.slice(0, 3)
    })
    
    return totals
  }, [filteredData, institutionalDepartments, timeRange])

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
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[250px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (institutionalDepartments.length === 0 || filteredData.length === 0) {
    return (
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
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4" />
            {t.charts.projectsCreatedOverTime}
          </CardTitle>
          <CardDescription className="text-xs">
            {t.charts.showingTotal} {getTimeRangeLabel(timeRange)}
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
              className="w-[160px] rounded-lg"
              aria-label={t.charts.selectTimeRange}
            >
              <SelectValue placeholder={t.charts.last3Months} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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
        </div>
      </CardHeader>
      <CardContent className="pr-2 pt-4 sm:pr-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          {chartType === "area" ? (
            <AreaChart data={filteredData}>
              <defs>
                {institutionalDepartments.map((dept) => {
                  const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                  return (
                    <linearGradient key={dept.id} id={`fill${deptKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig[deptKey]?.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig[deptKey]?.color}
                        stopOpacity={0.1}
                      />
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
                  // Para períodos curtos (7d, 30d), mostrar dia/mês
                  // Para períodos longos (90d+), mostrar apenas mês
                  if (timeRange === "7d" || timeRange === "30d") {
                    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
                      day: "numeric",
                      month: "short",
                    })
                  }
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
              {institutionalDepartments.map((dept) => {
                const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                
                return (
                  <Area
                    key={dept.id}
                    dataKey={deptKey}
                    type="natural"
                    fill={`url(#fill${deptKey})`}
                    stroke={chartConfig[deptKey]?.color}
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
                  // Para períodos curtos (7d, 30d), mostrar dia/mês
                  // Para períodos longos (90d+), mostrar apenas mês
                  if (timeRange === "7d" || timeRange === "30d") {
                    return date.toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US', {
                      day: "numeric",
                      month: "short",
                    })
                  }
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
              {institutionalDepartments.map((dept, index) => {
                const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                const isLast = index === institutionalDepartments.length - 1
                
                return (
                  <Bar
                    key={dept.id}
                    dataKey={deptKey}
                    stackId="a"
                    fill={chartConfig[deptKey]?.color}
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
          {t.charts.top}: <span className="font-medium text-foreground">{topDepartment.name}</span> ({topDepartment.total} {t.charts.projects.toLowerCase()})
        </div>
      </CardFooter>
    </Card>
  )
}
