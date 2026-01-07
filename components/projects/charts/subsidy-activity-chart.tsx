"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

interface SubsidyRequestChartData {
  id: string
  title: string
  requested_at: string | Date
  requested_amount: number
  status: "pending" | "approved" | "rejected" | "in_review" | "closed"
}

interface SubsidyActivityChartProps {
  data: SubsidyRequestChartData[]
  loading?: boolean
  selectedYear?: number
}

export function SubsidyActivityChart({ 
  data = [], 
  loading = false,
  selectedYear = new Date().getFullYear() 
}: SubsidyActivityChartProps) {
  const [timeRange, setTimeRange] = React.useState("12m")
  const { i18n } = useTranslation()
  const { formatCurrency, selectedCurrency } = useCurrency()
  const currentLanguage = i18n?.language || 'en'

  // Processar dados de subsídios por mês
  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    
    // Inicializar estrutura com zeros
    const monthlyData = months.map((month, index) => ({
      month,
      date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
      total: 0,
      approved: 0,
      pending: 0,
      in_review: 0,
      rejected: 0,
      count: 0,
    }))

    // Agregar dados reais
    data.forEach((subsidy) => {
      const date = typeof subsidy.requested_at === "string" 
        ? new Date(subsidy.requested_at) 
        : subsidy.requested_at

      const subsidyYear = date.getFullYear()
      const monthIndex = date.getMonth()

      // Apenas incluir se for do ano selecionado
      if (subsidyYear === selectedYear && monthIndex >= 0 && monthIndex < 12) {
        const amount = subsidy.requested_amount / 1000 // Converter para K

        monthlyData[monthIndex].total += amount
        monthlyData[monthIndex].count += 1

        // Categorizar por status
        switch (subsidy.status) {
          case "approved":
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
        }
      }
    })

    return monthlyData
  }, [data, selectedYear])

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
      label: "Total Solicitado",
      color: "hsl(var(--chart-1))",
    },
    approved: {
      label: "Aprovado",
      color: "hsl(142, 76%, 36%)",
    },
    pending: {
      label: "Pendente",
      color: "hsl(45, 93%, 47%)",
    },
    rejected: {
      label: "Rejeitado",
      color: "hsl(0, 84.2%, 60.2%)", // Red
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
        count: acc.count + month.count,
      }),
      { total: 0, approved: 0, pending: 0, in_review: 0, rejected: 0, count: 0 }
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
          <CardTitle>Atividade de Solicitações de Subsídio</CardTitle>
          <CardDescription>
            Valores solicitados ao longo dos meses - {totals.count} solicitações totalizando €{totals.total.toFixed(0)}K
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Selecionar período"
          >
            <SelectValue placeholder="Últimos 12 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              Últimos 12 meses
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Últimos 6 meses
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillApproved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-approved)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-approved)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
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
              tickMargin={8}
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
                      return `${data.month} - ${data.count} solicitaç${data.count === 1 ? 'ão' : 'ões'}`
                    }
                    return value
                  }}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = {
                      total: "Total",
                      approved: "Aprovado",
                      pending: "Pendente",
                      in_review: "Em Análise",
                      rejected: "Rejeitado",
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
              dataKey="total"
              type="monotone"
              fill="url(#fillTotal)"
              stroke="var(--color-total)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 justify-center mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-gray-600">Aprovado: €{totals.approved.toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600">Pendente: €{totals.pending.toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-gray-600">Em Análise: €{totals.in_review.toFixed(0)}K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Rejeitado: €{totals.rejected.toFixed(0)}K</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
