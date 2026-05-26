"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { projectTranslations } from "@/lib/translations/projects"
import {
  ChartContainer,
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
import { ChartHeader } from "@/components/shared/chart-header"
import { SubsidyRequestCardData } from "../subsidy-request-card"
import { ChartColumnBig, ChartLine } from "lucide-react"
import { useSubsidyStatuses } from "@/hooks/use-subsidy-statuses"

interface SubsidyActivityChartProps {
  data: SubsidyRequestCardData[]
  loading?: boolean
  selectedYear?: number
}

export function SubsidyActivityChart({ 
  data = [], 
  loading = false,
  selectedYear = new Date().getFullYear() 
}: SubsidyActivityChartProps) {
  const [timeRange, setTimeRange] = React.useState("12m")
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const currentLanguage = i18n?.language || 'en'
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  // ── Centralised status metadata (labels, colors, etc.) ──────────────────────
  const { statuses, chartConfig } = useSubsidyStatuses()

  // ── Chart data — dynamically built from all known statuses ──────────────────
  const chartData = React.useMemo(() => {
    const getMonthNames = (lang: string) => {
      const months: Record<string, string[]> = {
        pt: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        nl: ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
      }
      return months[lang] ?? months.en
    }

    const months = getMonthNames(currentLanguage)

    // Initialise one entry per month — zero for each known status
    const monthlyData: Array<Record<string, number>> = months.map((month, index) => {
      const entry: Record<string, number> = {
        month: month as unknown as number, // stored as string but typed as number for Record
        date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01` as unknown as number,
        total: 0,
        count: 0,
      }
      statuses.forEach((s) => { entry[s.id] = 0 })
      return entry
    })

    // Aggregate real data
    data.forEach((subsidy) => {
      const date = new Date(subsidy.requested_at)
      if (date.getFullYear() !== selectedYear) return
      const monthIndex = date.getMonth()
      if (monthIndex < 0 || monthIndex > 11) return

      const amount = subsidy.requested_amount / 1000
      monthlyData[monthIndex].total += amount
      monthlyData[monthIndex].count += 1

      const key = subsidy.status
      if (key in monthlyData[monthIndex]) {
        monthlyData[monthIndex][key] += amount
      } else {
        monthlyData[monthIndex].pending += amount // fallback for unknown statuses
      }
    })

    return monthlyData
  }, [data, selectedYear, currentLanguage, statuses])

  const filteredData = React.useMemo(() => {
    if (timeRange === "6m") return chartData.slice(-6)
    if (timeRange === "3m") return chartData.slice(-3)
    return chartData
  }, [timeRange, chartData])

  // ── Totals — dynamic across all statuses ────────────────────────────────────
  const totals = React.useMemo(() => {
    const init: Record<string, number> = { total: 0, count: 0 }
    statuses.forEach((s) => { init[s.id] = 0 })
    return filteredData.reduce((acc, month) => {
      acc.total += month.total ?? 0
      acc.count += month.count ?? 0
      statuses.forEach((s) => { acc[s.id] = (acc[s.id] ?? 0) + (month[s.id] ?? 0) })
      return acc
    }, init)
  }, [filteredData, statuses])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <ChartHeader title="" description="" className="border-b py-5" />
        <CardContent className="flex-1">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  // ── Shared tooltip formatter ─────────────────────────────────────────────────
  const tooltipFormatter = (value: unknown, name: string | number) => [
    formatCurrency(Number(value) * 1000, { compact: true }),
    chartConfig[String(name) as keyof typeof chartConfig]?.label ?? String(name),
  ]

  const tooltipLabelFormatter = (value: string, payload: any[]) => {
    if (payload?.[0]) {
      const d = payload[0].payload
      return `${d.month} - ${d.count} ${t.charts?.tooltip?.requests || "requests"}`
    }
    return value
  }

  return (
    <Card className="h-full flex flex-col">
      <ChartHeader
        title={t.charts?.subsidyActivity?.title || t.subsidy?.requestsTitle || "Subsidy Activity"}
        description={
          (t.charts?.subsidyActivity?.description || "{{count}} requests totaling {{total}}K")
            .replace('{{count}}', String(totals.count))
            .replace('{{total}}', formatCurrency(totals.total * 1000, { compact: true }))
        }
        actionsOrientation="responsive"
        actions={
          <>
            <div className="flex items-center border rounded-md">
              <Button
                variant={chartType === "area" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("area")}
                className="rounded-r-none border-r-0 h-8"
              >
                <ChartLine />
              </Button>
              <Button
                variant={chartType === "bar" ? "default" : "ghost"}
                size="sm"
                onClick={() => setChartType("bar")}
                className="rounded-l-none h-8"
              >
                <ChartColumnBig />
              </Button>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] rounded-lg" aria-label="Selecionar período">
                <SelectValue placeholder={t.charts.subsidyActivity.last12Months} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="12m" className="rounded-lg">
                  {t.charts?.subsidyActivity?.last12Months || "Last 12 months"}
                </SelectItem>
                <SelectItem value="6m" className="rounded-lg">
                  {t.charts?.subsidyActivity?.last6Months || "Last 6 months"}
                </SelectItem>
                <SelectItem value="3m" className="rounded-lg">
                  {t.charts?.subsidyActivity?.last3Months || "Last 3 months"}
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          {chartType === "area" ? (
            <AreaChart data={filteredData}>
              {/* Gradient fills — generated for every status */}
              <defs>
                {statuses.map((s) => (
                  <linearGradient key={s.id} id={`fill_${s.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={s.chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={s.chartColor} stopOpacity={0}   />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tickFormatter={(v) => formatCurrency(v * 1000, { compact: true })}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={tooltipLabelFormatter}
                    formatter={tooltipFormatter}
                  />
                }
              />
              {/* Area series — one per status, in workflow order */}
              {statuses.map((s) => (
                <Area
                  key={s.id}
                  dataKey={s.id}
                  type="monotone"
                  fill={`url(#fill_${s.id})`}
                  stroke={s.chartColor}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={filteredData}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tickFormatter={(v) => formatCurrency(v * 1000, { compact: true })}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) => String(v).slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dashed"
                    labelFormatter={tooltipLabelFormatter}
                    formatter={tooltipFormatter}
                  />
                }
              />
              {/* Bar series — one per status, in workflow order */}
              {statuses.map((s) => (
                <Bar key={s.id} dataKey={s.id} fill={s.chartColor} radius={4} />
              ))}
            </BarChart>
          )}
        </ChartContainer>

        {/* Legend — generated for every status */}
        <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs">
          {statuses.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${s.dotClass}`} />
              <span className="text-gray-600 dark:text-gray-300">{s.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

