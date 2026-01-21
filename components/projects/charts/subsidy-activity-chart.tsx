"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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

import { SubsidyRequestCardData } from "../subsidy-request-card"
import { ChartColumnBig, ChartLine } from "lucide-react"

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
  const { formatCurrency, selectedCurrency } = useCurrency()
  const currentLanguage = i18n?.language || 'en'
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  // Processar dados de subsídios por mês
  const chartData = React.useMemo(() => {
    // Usar nomes dos meses baseados no idioma
    const getMonthNames = (lang: string) => {
      const months = {
        'pt': ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        'en': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'nl': ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']
      }
      return months[lang as keyof typeof months] || months.en
    }
    
    const months = getMonthNames(currentLanguage)
    
    // Inicializar estrutura com zeros
    const monthlyData = months.map((month, index) => ({
      month,
      date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
      total: 0,
      approved: 0,
      pending: 0,
      in_review: 0,
      rejected: 0,
      closed: 0,
      count: 0,
    }))

    // Agregar dados reais usando a estrutura correta do SubsidyRequestCardData
    data.forEach((subsidy) => {
      const date = new Date(subsidy.requested_at)
      const subsidyYear = date.getFullYear()
      const monthIndex = date.getMonth()

      // Apenas incluir se for do ano selecionado
      if (subsidyYear === selectedYear && monthIndex >= 0 && monthIndex < 12) {
        const amount = subsidy.requested_amount / 1000 // Converter para K

        monthlyData[monthIndex].total += amount
        monthlyData[monthIndex].count += 1

        // Categorizar por status usando os mesmos status do container
        switch (subsidy.status) {
          case "approved":
          case "accepted": // Fallback para compatibilidade
            monthlyData[monthIndex].approved += amount
            break
          case "pending":
            monthlyData[monthIndex].pending += amount
            break
          case "in_review":
            monthlyData[monthIndex].in_review += amount
            break
          case "rejected":
            monthlyData[monthIndex].rejected += amount
            break
          case "closed":
            monthlyData[monthIndex].closed += amount
            break
          default:
            // Status desconhecido, adicionar ao pending como fallback
            monthlyData[monthIndex].pending += amount
            break
        }
      }
    })

    return monthlyData
  }, [data, selectedYear, currentLanguage])

  const filteredData = React.useMemo(() => {
    if (timeRange === "6m") {
      return chartData.slice(-6)
    } else if (timeRange === "3m") {
      return chartData.slice(-3)
    }
    return chartData
  }, [timeRange, chartData])

  const chartConfig = {
    total: {
      label: t.charts?.subsidyActivity?.totalRequested || "Total Requested",
      color: "hsl(var(--primary))",
    },
    approved: {
      label: t.subsidy?.deleteRequest?.statusLabels?.approved || t.subsidy?.approvedLower || "Approved",
      color: "hsl(142, 76%, 36%)", // Verde - aprovado
    },
    pending: {
      label: t.subsidy?.deleteRequest?.statusLabels?.pending || t.charts?.legend?.pending || t.subsidy?.pending || "Pending", 
      color: "hsl(45, 93%, 47%)", // Amarelo - pendente
    },
    in_review: {
      label: t.subsidy?.deleteRequest?.statusLabels?.in_review || t.charts?.legend?.inReview || "In Review",
      color: "hsl(217, 91%, 60%)", // Azul - em revisão
    },
    rejected: {
      label: t.subsidy?.deleteRequest?.statusLabels?.rejected || t.charts?.legend?.rejected || t.subsidy?.rejected || "Rejected",
      color: "hsl(0, 84%, 60%)", // Vermelho - rejeitado
    },
    closed: {
      label: t.subsidy?.deleteRequest?.statusLabels?.closed || t.charts?.legend?.closed || t.subsidy?.closed || "Closed",
      color: "hsl(240, 5%, 41%)", // Cinza - fechado
    },
  }

  // Calcular totais para o período
  const totals = React.useMemo(() => {
    return filteredData.reduce(
      (acc, month) => ({
        total: acc.total + month.total,
        approved: acc.approved + month.approved,
        pending: acc.pending + month.pending,
        in_review: acc.in_review + month.in_review,
        rejected: acc.rejected + month.rejected,
        closed: acc.closed + month.closed,
        count: acc.count + month.count,
      }),
      { total: 0, approved: 0, pending: 0, in_review: 0, rejected: 0, closed: 0, count: 0 }
    )
  }, [filteredData])

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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>{t.charts?.subsidyActivity?.title || t.subsidy?.requestsTitle || "Subsidy Activity"}</CardTitle>
          <CardDescription>
            {(t.charts?.subsidyActivity?.description || "{{count}} requests totaling {{total}}K")
              .replace('{{count}}', String(totals.count))
              .replace('{{total}}', formatCurrency(totals.total * 1000, { compact: true }))}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
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
            <SelectTrigger
              className="w-[160px] rounded-lg sm:ml-auto"
              aria-label="Selecionar período"
            >
              <SelectValue placeholder={t.charts.subsidyActivity.last12Months} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="12m" className="rounded-lg">
                {t.charts?.subsidyActivity?.last12Months || t.common?.last12Months || "Last 12 months"}
              </SelectItem>
              <SelectItem value="6m" className="rounded-lg">
                {t.charts?.subsidyActivity?.last6Months || t.common?.last6Months || "Last 6 months"}
              </SelectItem>
              <SelectItem value="3m" className="rounded-lg">
                {t.charts?.subsidyActivity?.last3Months || t.common?.last3Months || "Last 3 months"}
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
                <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillInReview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-in_review)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-in_review)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-rejected)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-rejected)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillClosed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-closed)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-closed)" stopOpacity={0.1} />
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
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tickFormatter={(value) => formatCurrency(value * 1000, { compact: true })}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload
                        return `${data.month} - ${data.count} ${t.charts?.tooltip?.requests || t.subsidy?.requests || "requests"}`
                      }
                      return value
                    }}
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        total: t.charts?.subsidyActivity?.totalRequested || "Total Requested",
                        approved: t.subsidy?.deleteRequest?.statusLabels?.approved || t.subsidy?.approvedLower || "Approved",
                        pending: t.subsidy?.deleteRequest?.statusLabels?.pending || t.charts?.legend?.pending || t.subsidy?.pending || "Pending",
                        in_review: t.subsidy?.deleteRequest?.statusLabels?.in_review || t.charts?.legend?.inReview || "In Review",
                        rejected: t.subsidy?.deleteRequest?.statusLabels?.rejected || t.charts?.legend?.rejected || t.subsidy?.rejected || "Rejected",
                        closed: t.subsidy?.deleteRequest?.statusLabels?.closed || t.charts?.legend?.closed || t.subsidy?.closed || "Closed",
                      }
                      return [
                        formatCurrency(Number(value) * 1000, { compact: true }),
                        labels[name as string] || name
                      ]
                    }}
                  />
                }
              />
              <Area
                dataKey="approved"
                type="monotone"
                fill="url(#fillApproved)"
                stroke="#22c55e"
                strokeWidth={2}
              />
              <Area
                dataKey="in_review"
                type="monotone"
                fill="url(#fillInReview)"
                stroke="var(--color-in_review)"
                strokeWidth={2}
              />
              <Area
                dataKey="pending"
                type="monotone"
                fill="url(#fillPending)"
                stroke="var(--color-pending)"
                strokeWidth={2}
              />
              <Area
                dataKey="rejected"
                type="monotone"
                fill="url(#fillRejected)"
                stroke="var(--color-rejected)"
                strokeWidth={2}
              />
              <Area
                dataKey="closed"
                type="monotone"
                fill="url(#fillClosed)"
                stroke="#22c55e"
                strokeWidth={2}

              />
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={filteredData}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                tickFormatter={(value) => formatCurrency(value * 1000, { compact: true })}
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dashed"
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload
                        return `${data.month} - ${data.count} ${t.charts?.tooltip?.requests || t.subsidy?.requests || "requests"}`
                      }
                      return value
                    }}
                    formatter={(value, name) => {
                      const labels: Record<string, string> = {
                        approved: t.subsidy?.deleteRequest?.statusLabels?.approved || t.subsidy?.approvedLower || "Approved",
                        pending: t.subsidy?.deleteRequest?.statusLabels?.pending || t.charts?.legend?.pending || t.subsidy?.pending || "Pending",
                        in_review: t.subsidy?.deleteRequest?.statusLabels?.in_review || t.charts?.legend?.inReview || "In Review",
                        rejected: t.subsidy?.deleteRequest?.statusLabels?.rejected || t.charts?.legend?.rejected || t.subsidy?.rejected || "Rejected",
                        closed: t.subsidy?.deleteRequest?.statusLabels?.closed || t.charts?.legend?.closed || t.subsidy?.closed || "Closed",
                      }
                      return [
                        formatCurrency(Number(value) * 1000, { compact: true }),
                        labels[name as string] || name
                      ]
                    }}
                  />
                }
              />
              <Bar dataKey="approved" fill="var(--color-approved)" radius={4} />
              <Bar dataKey="in_review" fill="var(--color-in_review)" radius={4} />
              <Bar dataKey="pending" fill="var(--color-pending)" radius={4} />
              <Bar dataKey="rejected" fill="var(--color-rejected)" radius={4} />
              <Bar dataKey="closed" fill="var(--color-closed)" radius={4} />
            </BarChart>
          )}
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {t.subsidy?.deleteRequest?.statusLabels?.approved || t.subsidy?.approvedLower || "Approved"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {t.charts?.legend?.inReview || "In Review"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {t.charts?.legend?.pending || "Pending"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {t.charts?.legend?.rejected || "Rejected"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400" />
            <span className="text-gray-600 dark:text-gray-300">
              {t.charts?.legend?.closed || "Closed"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
