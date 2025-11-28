"use client"

import * as React from "react"
import { TrendingUp, BarChart3, Activity, Filter, X } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useComponentPrivacy } from "@/contexts/privacy-context"
import { createPrivacyConfig } from "@/config/privacy-roles.config"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { PrivacyOverlay } from "@/components/shared/privacy-overlay"
import { Skeleton } from "@/components/ui/skeleton"

interface DepartmentSpending {
  departmentId: string
  departmentName: string
  amount: number
}

interface SpendingDataPoint {
  date: string
  month: string
  departments: DepartmentSpending[]
}

interface SpendingOverTimeChartProps {
  data: SpendingDataPoint[]
  year: number
}

const PRIVACY_CONFIG = createPrivacyConfig(
  'spending-over-time-chart',
  'FINANCIAL_DATA'
)

// Função para gerar cores HSL espaçadas uniformemente
const generateColors = (count: number): string[] => {
  const colors: string[] = []
  const hueStep = 360 / count
  
  for (let i = 0; i < count; i++) {
    const hue = (i * hueStep) % 360
    // Variação de saturação e luminosidade para melhor contraste
    const saturation = 70 + (i % 3) * 10
    const lightness = 45 + (i % 2) * 10
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
  }
  
  return colors
}

export function SpendingOverTimeChart({ data, year }: SpendingOverTimeChartProps) {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = React.useState("12m")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)
  
  // Extrair lista única de departamentos de todos os dados
  const allDepartments = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    const deptMap = new Map<string, string>()
    data.forEach(dataPoint => {
      dataPoint.departments?.forEach(dept => {
        if (!deptMap.has(dept.departmentId)) {
          deptMap.set(dept.departmentId, dept.departmentName)
        }
      })
    })
    
    return Array.from(deptMap.entries()).map(([id, name]) => ({ id, name }))
  }, [data])

  // State para departamentos selecionados (todos por padrão)
  const [selectedDepartments, setSelectedDepartments] = React.useState<string[]>([])

  // Inicializar seleção com todos os departamentos quando allDepartments mudar
  React.useEffect(() => {
    if (allDepartments.length > 0 && selectedDepartments.length === 0) {
      setSelectedDepartments(allDepartments.map(d => d.id))
    }
  }, [allDepartments])

  // Gerar configuração de cores dinâmica
  const chartConfig = React.useMemo(() => {
    const colors = generateColors(allDepartments.length)
    const config: ChartConfig = {}
    
    allDepartments.forEach((dept, index) => {
      config[dept.id] = {
        label: dept.name,
        color: colors[index]
      }
    })
    
    return config
  }, [allDepartments])

  // Transformar dados para formato compatível com o gráfico
  const transformedData = React.useMemo(() => {
    if (!data || data.length === 0) return []

    return data.map(dataPoint => {
      const transformed: any = {
        date: dataPoint.date,
        month: dataPoint.month
      }
      
      // Adicionar cada departamento como propriedade
      dataPoint.departments?.forEach(dept => {
        transformed[dept.departmentId] = dept.amount
      })
      
      return transformed
    })
  }, [data])

  const filteredData = React.useMemo(() => {
    if (!transformedData || transformedData.length === 0) return []

    const monthsToShow = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12
    return transformedData.slice(-monthsToShow)
  }, [transformedData, timeRange])

  const totalSpending = React.useMemo(() => {
    return filteredData.reduce((acc, item) => {
      let itemTotal = 0
      selectedDepartments.forEach(deptId => {
        itemTotal += item[deptId] || 0
      })
      return acc + itemTotal
    }, 0)
  }, [filteredData, selectedDepartments])

  // Handlers para seleção de departamentos
  const handleToggleDepartment = (deptId: string) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId)
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    )
  }

  const handleSelectAll = () => {
    setSelectedDepartments(allDepartments.map(d => d.id))
  }

  const handleClearAll = () => {
    setSelectedDepartments([])
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t("annual_budget.charts.spending_over_time.title")}
            </CardTitle>
          </div>
          <CardDescription>
            {t("annual_budget.charts.spending_over_time.subtitle", { year })}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("area")}
              className={cn(
                "h-8 px-3 rounded-md transition-all",
                chartType === "area"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Activity className="w-4 h-4 mr-1" />
              {t("annual_budget.charts.spending_over_time.chart_types.area")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("bar")}
              className={cn(
                "h-8 px-3 rounded-md transition-all",
                chartType === "bar"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              {t("annual_budget.charts.spending_over_time.chart_types.bar")}
            </Button>
          </div>

          {/* Time Range Selector */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Select time range"
            >
              <SelectValue placeholder={t("annual_budget.charts.spending_over_time.time_ranges.12m")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12m" className="rounded-lg">
                {t("annual_budget.charts.spending_over_time.time_ranges.12m")}
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                {t("annual_budget.charts.spending_over_time.time_ranges.6m")}
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                {t("annual_budget.charts.spending_over_time.time_ranges.3m")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="w-4 h-4 mr-2" />
                Departments
                {selectedDepartments.length > 0 && selectedDepartments.length < allDepartments.length && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {selectedDepartments.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center justify-between">
                Select Departments
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleSelectAll}
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleClearAll}
                  >
                    None
                  </Button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {allDepartments.map(dept => (
                  <DropdownMenuCheckboxItem
                    key={dept.id}
                    checked={selectedDepartments.includes(dept.id)}
                    onCheckedChange={() => handleToggleDepartment(dept.id)}
                  >
                    {dept.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <InlinePrivacyToggle 
            config={PRIVACY_CONFIG} 
            className="privacy-toggle-button-header flex-shrink-0" 
          />
        </div>
      </CardHeader>
      { isHidden ? (
        <PrivacyOverlay height="300px" blurIntensity="medium">
          {/* Skeleton Customizado */}
          <div className="space-y-4 p-4">
            <Skeleton className="h-64 w-full" />
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </PrivacyOverlay>
      ) : (
        <>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              {chartType === "area" ? (
                <AreaChart data={filteredData}>
                  <defs>
                    {selectedDepartments.map(deptId => (
                      <linearGradient key={deptId} id={`fill-${deptId}`} x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={chartConfig[deptId]?.color || "hsl(0, 0%, 50%)"}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartConfig[deptId]?.color || "hsl(0, 0%, 50%)"}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `${value} ${year}`}
                        indicator="dot"
                      />
                    }
                  />
                  {selectedDepartments.map(deptId => (
                    <Area
                      key={deptId}
                      dataKey={deptId}
                      type="natural"
                      fill={`url(#fill-${deptId})`}
                      stroke={chartConfig[deptId]?.color || "hsl(0, 0%, 50%)"}
                      fillOpacity={0.4}
                      name={chartConfig[deptId]?.label}
                    />
                  ))}
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              ) : (
                <BarChart data={filteredData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => `${value} ${year}`}
                        indicator="dashed"
                      />
                    }
                  />
                  {selectedDepartments.map(deptId => (
                    <Bar
                      key={deptId}
                      dataKey={deptId}
                      fill={chartConfig[deptId]?.color || "hsl(0, 0%, 50%)"}
                      radius={4}
                      name={chartConfig[deptId]?.label}
                    />
                  ))}
                  <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
              )}
            </ChartContainer>
          </CardContent>
        </>
      )}
    </Card>
  )
}
