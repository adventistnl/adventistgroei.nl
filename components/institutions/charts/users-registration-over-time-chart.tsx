"use client"

import * as React from "react"
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
import { Activity, BarChart3, TrendingUp, Users as UsersIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { getProjectColor } from "@/lib/chart-colors"
import { ChartHeader } from "@/components/charts/chart-header"

interface UsersRegistrationOverTimeChartProps {
  institutions: any[] // Accept any[] to handle different institution types
  loading?: boolean
  selectedYear?: number
  defaultChartType?: "area" | "bar"
}

export function UsersRegistrationOverTimeChart({ 
  institutions,
  loading,
  selectedYear,
  defaultChartType = "bar"
}: UsersRegistrationOverTimeChartProps) {
  const { t, i18n } = useTranslation()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartType, setChartType] = React.useState<"area" | "bar">(defaultChartType)
  
  // Filter active institutions
  const activeInstitutions = React.useMemo(() => {
    return institutions.filter(inst => inst && inst.id && inst.name)
  }, [institutions])
  
  // Use selectedYear if provided, otherwise use current year
  const chartYear = selectedYear || new Date().getFullYear()

  // Generate dynamic chart config based on institutions - using getProjectColor
  const chartConfig: ChartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      totalUsers: {
        label: t('users.title') || "Users",
      }
    }

    activeInstitutions.forEach((inst, index) => {
      const instKey = inst.name.toLowerCase().replace(/\s+/g, '_')
      config[instKey] = {
        label: inst.name,
        color: getProjectColor(index)
      }
    })

    return config
  }, [activeInstitutions, t])

  // Transform data to show dates on X-axis and institutions as separate areas
  const chartData = React.useMemo(() => {
    // Get all users from all institutions and filter by selected year
    const allUsers = activeInstitutions.flatMap((inst: any) => {
      const users = inst.users || []
      
      return users
        .filter((user: any) => {
          if (user.is_deleted) return false
          
          // Filter by selected year if provided - only users created in the selected year
          if (selectedYear) {
            const userDate = new Date(user.created_at)
            const userYear = userDate.getFullYear()
            return userYear === selectedYear
          }
          
          return true
        })
        .map((user: any) => ({
          ...user,
          institution_id: inst.id,
          institution_name: inst.name
        }))
    })

    // Create a map to store daily counts
    const dailyCounts = new Map<string, any>()

    // Count users by date and institution
    allUsers.forEach(user => {
      const createdDate = new Date(user.created_at)
      const dateKey = createdDate.toISOString().split('T')[0] // YYYY-MM-DD format
      
      if (!dailyCounts.has(dateKey)) {
        const dateData: any = { date: dateKey }
        activeInstitutions.forEach(inst => {
          const instKey = inst.name.toLowerCase().replace(/\s+/g, '_')
          dateData[instKey] = 0
        })
        dailyCounts.set(dateKey, dateData)
      }

      const instKey = user.institution_name.toLowerCase().replace(/\s+/g, '_')
      const dateData = dailyCounts.get(dateKey)!
      dateData[instKey] += 1
    })

    // Convert map to array and sort by date
    const sortedData = Array.from(dailyCounts.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    
    return sortedData
  }, [institutions, activeInstitutions, selectedYear])

  // Filter data based on time range
  const filteredData = React.useMemo(() => {
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
    
    // Filter existing data within time range
    const filtered = chartData.filter(item => {
      return item.date >= startDateStr && item.date <= endDateStr
    })
    
    // ALWAYS fill all days in the selected range with data (zeros if no registrations)
    // This ensures the chart always displays, even if there's no data
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
        // Create empty day with zeros for all institutions
        const emptyDay: any = { date: dateKey }
        activeInstitutions.forEach(inst => {
          emptyDay[inst.name.toLowerCase().replace(/\s+/g, '_')] = 0
        })
        allDays.push(emptyDay)
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return allDays
  }, [chartData, timeRange, activeInstitutions, selectedYear])

  // Calculate total by institution
  const totalByInstitution = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    // Initialize all institutions with 0
    activeInstitutions.forEach(inst => {
      totals[inst.name.toLowerCase().replace(/\s+/g, '_')] = 0
    })
    
    // Sum all values from filteredData
    filteredData.forEach(day => {
      activeInstitutions.forEach(inst => {
        const key = inst.name.toLowerCase().replace(/\s+/g, '_')
        totals[key] += (day[key] || 0)
      })
    })
    
    return totals
  }, [filteredData, activeInstitutions])

  const topInstitution = React.useMemo(() => {
    const entries = Object.entries(totalByInstitution)
    if (entries.length === 0) return { name: '', total: 0 }
    
    const top = entries.reduce((max, [inst, total]) => 
      total > max.total ? { inst, total } : max
    , { inst: '', total: 0 })
    
    return {
      name: chartConfig[top.inst as keyof typeof chartConfig]?.label || top.inst,
      total: top.total
    }
  }, [totalByInstitution, chartConfig])

  const totalUsers = React.useMemo(() => {
    return Object.values(totalByInstitution).reduce((sum, val) => sum + val, 0)
  }, [totalByInstitution])

  const xAxisTickGap = React.useMemo(() => {
    switch (timeRange) {
      case "7d": return 18
      case "30d": return 26
      case "90d": return 34
      case "180d": return 44
      case "365d": return 54
      default: return 32
    }
  }, [timeRange])

  const formatXAxisTick = React.useCallback((value: string) => {
    const [y, m, d] = value.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    const locale = i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US'
    if (timeRange === "365d") {
      return date.toLocaleDateString(locale, { month: "short", year: "2-digit" })
    }
    return date.toLocaleDateString(locale, { day: "numeric", month: "short" })
  }, [timeRange, i18n.language])

  const formatTooltipLabel = React.useCallback((value: string) => {
    const [y, m, d] = value.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    const locale = i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'nl' ? 'nl-NL' : 'en-US'
    return date.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" })
  }, [i18n.language])

  // Helper function to get time range label
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d":
        return (t('charts.last7Days') || "Last 7 days").toLowerCase()
      case "30d":
        return (t('charts.last30Days') || "Last 30 days").toLowerCase()
      case "90d":
        return (t('charts.last3Months') || "Last 3 months").toLowerCase()
      case "180d":
        return (t('charts.last6Months') || "Last 6 months").toLowerCase()
      case "365d":
        return (t('charts.last12Months') || "Last 12 months").toLowerCase()
      default:
        return (t('charts.last3Months') || "Last 3 months").toLowerCase()
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

  if (activeInstitutions.length === 0 || filteredData.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <UsersIcon className="w-4 h-4" />
            {t('users.charts.usersRegisteredOverTime') || "Users Registered Over Time"}
          </CardTitle>
          <CardDescription className="text-xs">
            {t('users.charts.userRegistrationTrend') || "User registration trend"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{t('users.charts.noUserData') || "No user data available"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <ChartHeader
        title={t('users.charts.usersRegisteredOverTime') || "Users Registered Over Time"}
        description={`${t('users.charts.showing') || "Showing"} ${getTimeRangeLabel(timeRange)}`}
        actionsOrientation="responsive"
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
                className="w-[160px] rounded-lg"
                aria-label={t('charts.selectTimeRange') || "Select time range"}
              >
                <SelectValue placeholder={t('charts.last3Months') || "Last 3 months"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  {t('charts.last7Days') || "Last 7 days"}
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  {t('charts.last30Days') || "Last 30 days"}
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  {t('charts.last3Months') || "Last 3 months"}
                </SelectItem>
                <SelectItem value="180d" className="rounded-lg">
                  {t('charts.last6Months') || "Last 6 months"}
                </SelectItem>
                <SelectItem value="365d" className="rounded-lg">
                  {t('charts.last12Months') || "Last 12 months"}
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
                {activeInstitutions.map((inst, index) => {
                  const instKey = inst.name.toLowerCase().replace(/\s+/g, '_')
                  const color = getProjectColor(index)
                  return (
                    <linearGradient key={inst.id} id={`fill${instKey}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={color} stopOpacity={0.1} />
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
                minTickGap={xAxisTickGap}
                tickFormatter={formatXAxisTick}
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
                    labelFormatter={formatTooltipLabel}
                    indicator="dot"
                  />
                }
              />
              {activeInstitutions.map((inst, index) => {
                const instKey = inst.name.toLowerCase().replace(/\s+/g, '_')
                
                return (
                  <Area
                    key={inst.id}
                    dataKey={instKey}
                    type="natural"
                    fill={`url(#fill${instKey})`}
                    stroke={getProjectColor(index)}
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
                minTickGap={xAxisTickGap}
                tickFormatter={formatXAxisTick}
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
                    labelFormatter={formatTooltipLabel}
                    hideLabel={false}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              {activeInstitutions.map((inst, index) => {
                const instKey = inst.name.toLowerCase().replace(/\s+/g, '_')
                return (
                  <Bar
                    key={inst.id}
                    dataKey={instKey}
                    stackId="a"
                    fill={getProjectColor(index)}
                    radius={4}
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
          {totalUsers} {(t('users.title') || "users").toLowerCase()} {t('users.charts.registered') || "registered"} {getTimeRangeLabel(timeRange)}
        </div>
        <div className="text-muted-foreground">
          {t('charts.top') || "Top"}: <span className="font-medium text-foreground">{topInstitution.name}</span> ({topInstitution.total} {(t('users.title') || "users").toLowerCase()})
        </div>
      </CardFooter>
    </Card>
  )
}
