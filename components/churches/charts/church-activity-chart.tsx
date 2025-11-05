"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
import { TrendingUp } from "lucide-react"

interface ChurchActivityChartProps {
  data?: any[]
  loading?: boolean
  title?: string
  description?: string
  mode?: 'churches' | 'departments' // Determina se mostra igrejas ou departamentos
}

// Mock data: Activities & Projects by church over time
const MOCK_CHURCH_ACTIVITIES = [
  { month: 'Jan', 'Central SP': 8, 'Vila Madalena': 5, 'Mooca': 4, 'Campinas': 10, 'Rio': 7 },
  { month: 'Feb', 'Central SP': 10, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 12, 'Rio': 8 },
  { month: 'Mar', 'Central SP': 9, 'Vila Madalena': 7, 'Mooca': 4, 'Campinas': 13, 'Rio': 9 },
  { month: 'Apr', 'Central SP': 11, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 14, 'Rio': 10 },
  { month: 'May', 'Central SP': 12, 'Vila Madalena': 8, 'Mooca': 6, 'Campinas': 15, 'Rio': 11 },
  { month: 'Jun', 'Central SP': 13, 'Vila Madalena': 9, 'Mooca': 7, 'Campinas': 16, 'Rio': 12 },
]

export function ChurchActivityChart({ 
  data, 
  loading,
  title,
  description,
  mode = 'churches'
}: ChurchActivityChartProps) {
  const [timeRange, setTimeRange] = React.useState("6m")
  const chartData = React.useMemo(() => data || MOCK_CHURCH_ACTIVITIES, [data])

  // Paleta de cores para as séries (igrejas ou departamentos)
  const colorPalette = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']

  // Gera chartConfig dinamicamente baseado nas keys dos dados
  const chartConfig = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return {}
    
    // Pega todas as keys exceto 'month'
    const dataKeys = Object.keys(chartData[0]).filter(key => key !== 'month')
    
    const config: any = {}
    dataKeys.forEach((key, index) => {
      config[key] = {
        label: key,
        color: colorPalette[index % colorPalette.length],
      }
    })
    
    return config as ChartConfig
  }, [chartData])

  // Extrai as keys de dados para renderizar os componentes Area dinamicamente
  const dataKeys = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return []
    return Object.keys(chartData[0]).filter(key => key !== 'month')
  }, [chartData])

  const filteredData = React.useMemo(() => {
    if (timeRange === "3m") {
      return chartData.slice(-3)
    } else if (timeRange === "12m") {
      return chartData
    }
    return chartData.slice(-6)
  }, [timeRange, chartData])

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

  // Títulos padrão baseados no modo
  const defaultTitle = mode === 'departments' 
    ? 'Atividades em Projetos por Departamento' 
    : 'Atividades e Projetos por Igreja'
  
  const defaultDescription = mode === 'departments'
    ? 'Qual departamento tem feito mais atividades em projetos ao longo do tempo'
    : 'Qual igreja tem feito mais atividades ao longo do tempo'

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {title || defaultTitle}
          </CardTitle>
          <CardDescription>
            {description || defaultDescription}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 6 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              Last 12 months
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              Last 6 months
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Last 3 months
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
              {/* Gera gradientes dinamicamente para cada série de dados */}
              {dataKeys.map((key) => {
                const color = chartConfig[key]?.color || '#3b82f6'
                const gradientId = `fill${key.replace(/\s+/g, '')}`
                return (
                  <linearGradient key={gradientId} id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                )
              })}
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
              content={<ChartTooltipContent indicator="dot" />}
            />
            {/* Gera componentes Area dinamicamente para cada série de dados */}
            {dataKeys.map((key) => {
              const color = chartConfig[key]?.color || '#3b82f6'
              const gradientId = `fill${key.replace(/\s+/g, '')}`
              return (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`url(#${gradientId})`}
                  stroke={color}
                  stackId="a"
                />
              )
            })}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
