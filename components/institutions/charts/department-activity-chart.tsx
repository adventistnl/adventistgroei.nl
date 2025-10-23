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
import { useChartColors, CHART_PRESETS, createGradient } from "@/lib/chart-colors"

interface DepartmentActivityChartProps {
  data?: any[]
  loading?: boolean
}

// Dados mockados: Atividades por departamento ao longo do tempo
const generateMockData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month, index) => ({
    month,
    date: `2024-${String(index + 1).padStart(2, '0')}-01`,
    finance: Math.floor(Math.random() * 50) + 20,
    education: Math.floor(Math.random() * 40) + 15,
    youth: Math.floor(Math.random() * 60) + 30,
    missions: Math.floor(Math.random() * 35) + 10,
  }))
}

export function DepartmentActivityChart({ data, loading }: DepartmentActivityChartProps) {
  const [timeRange, setTimeRange] = React.useState("12m")
  const chartData = React.useMemo(() => generateMockData(), [])
  const { colors, theme } = useChartColors()

  // Usar o preset de departamentos
  const departmentColors = CHART_PRESETS.departments(theme as 'light' | 'dark')

  const chartConfig = {
    finance: {
      label: "Finance",
      color: departmentColors.finance,
    },
    education: {
      label: "Education",
      color: departmentColors.education,
    },
    youth: {
      label: "Youth",
      color: departmentColors.youth,
    },
    missions: {
      label: "Missions",
      color: departmentColors.missions,
    },
  } satisfies ChartConfig

  const filteredData = React.useMemo(() => {
    if (timeRange === "6m") {
      return chartData.slice(-6)
    } else if (timeRange === "3m") {
      return chartData.slice(-3)
    }
    return chartData
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

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Department Activity Overview</CardTitle>
          <CardDescription>
            Total actions per department (Projects, Activities, Subsidy Requests)
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 12 months" />
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
              <linearGradient id="fillFinance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={departmentColors.finance} stopOpacity={0.8} />
                <stop offset="95%" stopColor={departmentColors.finance} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillEducation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={departmentColors.education} stopOpacity={0.8} />
                <stop offset="95%" stopColor={departmentColors.education} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillYouth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={departmentColors.youth} stopOpacity={0.8} />
                <stop offset="95%" stopColor={departmentColors.youth} stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMissions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={departmentColors.missions} stopOpacity={0.8} />
                <stop offset="95%" stopColor={departmentColors.missions} stopOpacity={0.1} />
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
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="finance"
              type="natural"
              fill="url(#fillFinance)"
              stroke={departmentColors.finance}
              stackId="a"
            />
            <Area
              dataKey="education"
              type="natural"
              fill="url(#fillEducation)"
              stroke={departmentColors.education}
              stackId="a"
            />
            <Area
              dataKey="youth"
              type="natural"
              fill="url(#fillYouth)"
              stroke={departmentColors.youth}
              stackId="a"
            />
            <Area
              dataKey="missions"
              type="natural"
              fill="url(#fillMissions)"
              stroke={departmentColors.missions}
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
