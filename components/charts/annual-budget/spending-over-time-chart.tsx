"use client"

// 🔴 MOCK_DATA: spendingOverTime - Valores fixos + variação aleatória
import * as React from "react"
import { TrendingUp, BarChart3, Activity } from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MockDataIndicator, useShowMockIndicators } from "@/components/shared/mock-data-indicator"
import { useComponentPrivacy } from "@/contexts/privacy-context"
import { createPrivacyConfig } from "@/config/privacy-roles.config"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { PrivacyOverlay } from "@/components/shared/privacy-overlay"
import { Skeleton } from "@/components/ui/skeleton"

interface SpendingDataPoint {
  date: string
  month: string
  finance: number
  operations: number
  hr: number
  it: number
  marketing: number
}

interface SpendingOverTimeChartProps {
  data: SpendingDataPoint[]
  year: number
}

const chartConfig = {
  finance: {
    label: "Finance",
    color: "hsl(217, 91%, 60%)", // Blue
  },
  operations: {
    label: "Operations",
    color: "hsl(142, 71%, 45%)", // Green
  },
  hr: {
    label: "HR",
    color: "hsl(271, 76%, 53%)", // Purple
  },
  it: {
    label: "IT",
    color: "hsl(38, 92%, 50%)", // Orange
  },
  marketing: {
    label: "Marketing",
    color: "hsl(339, 82%, 52%)", // Pink
  },
} satisfies ChartConfig

const PRIVACY_CONFIG = createPrivacyConfig(
  'spending-over-time-chart',
  'FINANCIAL_DATA' // Uses DEV, ADMIN, FINANCE_MANAGER automatically
)

export function SpendingOverTimeChart({ data, year }: SpendingOverTimeChartProps) {
  const { t } = useTranslation()
  const [timeRange, setTimeRange] = React.useState("12m")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  const showMockIndicators = useShowMockIndicators()
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)
  

  const filteredData = React.useMemo(() => {
    // Se não houver dados, retornar array vazio
    if (!data || data.length === 0) return []

    // Determinar quantos meses filtrar
    const monthsToShow = timeRange === "3m" ? 3 : timeRange === "6m" ? 6 : 12

    // Retornar os últimos N meses
    return data.slice(-monthsToShow)
  }, [data, timeRange])

  const totalSpending = React.useMemo(() => {
    return filteredData.reduce((acc, item) => {
      return acc + item.finance + item.operations + item.hr + item.it + item.marketing
    }, 0)
  }, [filteredData])

  return (
    <Card className="h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t("annual_budget.charts.spending_over_time.title")}
            </CardTitle>
            {showMockIndicators && (
              <MockDataIndicator
                queryName="spendingOverTime"
                description="Valores fixos + variação aleatória"
              />
            )}
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
                    <linearGradient id="fillFinance" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-finance)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-finance)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillOperations" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-operations)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-operations)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillHr" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-hr)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-hr)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillIt" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-it)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-it)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMarketing" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-marketing)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-marketing)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
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
                  <Area
                    dataKey="finance"
                    type="natural"
                    fill="url(#fillFinance)"
                    stroke="var(--color-finance)"
                    fillOpacity={0.4}
                  />
                  <Area
                    dataKey="operations"
                    type="natural"
                    fill="url(#fillOperations)"
                    stroke="var(--color-operations)"
                    fillOpacity={0.4}
                  />
                  <Area
                    dataKey="hr"
                    type="natural"
                    fill="url(#fillHr)"
                    stroke="var(--color-hr)"
                    fillOpacity={0.4}
                  />
                  <Area
                    dataKey="it"
                    type="natural"
                    fill="url(#fillIt)"
                    stroke="var(--color-it)"
                    fillOpacity={0.4}
                  />
                  <Area
                    dataKey="marketing"
                    type="natural"
                    fill="url(#fillMarketing)"
                    stroke="var(--color-marketing)"
                    fillOpacity={0.4}
                  />
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
                  <Bar dataKey="finance" fill="var(--color-finance)" radius={4} />
                  <Bar dataKey="operations" fill="var(--color-operations)" radius={4} />
                  <Bar dataKey="hr" fill="var(--color-hr)" radius={4} />
                  <Bar dataKey="it" fill="var(--color-it)" radius={4} />
                  <Bar dataKey="marketing" fill="var(--color-marketing)" radius={4} />
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
