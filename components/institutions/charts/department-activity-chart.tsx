"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
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
import { departmentTranslations } from "@/lib/translations/departments"

interface DepartmentActivityChartProps {
  data?: any[]
  loading?: boolean
  departments?: any[]
}

export function DepartmentActivityChart({ data, loading, departments = [] }: DepartmentActivityChartProps) {
  const [timeRange, setTimeRange] = React.useState("12m")
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en
  
  // Usar apenas dados reais dos departamentos
  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    if (!departments || departments.length === 0) {
      // Se não há departamentos, retornar dados zerados
      return months.map((month, index) => ({
        month,
        date: `2024-${String(index + 1).padStart(2, '0')}-01`,
        finance: 0,
        education: 0,
        youth: 0,
        missions: 0,
      }))
    }

    // Agrupar departamentos por categoria baseado em dados reais
    const departmentCategories: { [key: string]: number } = {
      finance: 0,
      education: 0,
      youth: 0,
      missions: 0,
    }

    departments.forEach((dept: any) => {
      const name = dept.name?.toLowerCase() || ''
      const budget = dept.annual_budgets?.[0]?.planned_budget || 0
      const userCount = dept.users?.length || 0
      
      // Calcular atividade baseado em orçamento e usuários reais (sem randomização)
      const activityValue = Math.floor((budget / 1000) + (userCount * 2))
      
      // Categorizar departamentos baseado no nome
      if (name.includes('youth') || name.includes('jovem') || name.includes('juventude')) {
        departmentCategories.youth += activityValue
      } else if (name.includes('education') || name.includes('educação') || name.includes('school') || name.includes('escola')) {
        departmentCategories.education += activityValue
      } else if (name.includes('finance') || name.includes('financ') || name.includes('tesour')) {
        departmentCategories.finance += activityValue
      } else {
        departmentCategories.missions += activityValue
      }
    })
    
    // Distribuir os valores pelos meses baseado apenas nos dados reais
    return months.map((month, index) => ({
      month,
      date: `2024-${String(index + 1).padStart(2, '0')}-01`,
      finance: Math.floor(departmentCategories.finance / 12), // Distribuição uniforme pelos meses
      education: Math.floor(departmentCategories.education / 12),
      youth: Math.floor(departmentCategories.youth / 12),
      missions: Math.floor(departmentCategories.missions / 12),
    }))
  }, [departments])
  
  const { colors, theme } = useChartColors()

  // Usar o preset de departamentos
  const departmentColors = CHART_PRESETS.departments(theme as 'light' | 'dark')

  const chartConfig = {
    finance: {
      label: t.charts?.activity_overview?.categories?.finance || "Finance",
      color: departmentColors.finance,
    },
    education: {
      label: t.charts?.activity_overview?.categories?.education || "Education",
      color: departmentColors.education,
    },
    youth: {
      label: t.charts?.activity_overview?.categories?.youth || "Youth",
      color: departmentColors.youth,
    },
    missions: {
      label: t.charts?.activity_overview?.categories?.missions || "Missions",
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
          <CardTitle>{t.charts?.activity_overview?.title || "Department Activity Overview"}</CardTitle>
          <CardDescription>
            {t.charts?.activity_overview?.description || "Activity metrics based on real budget allocation and active users data"}
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder={t.charts?.activity_overview?.time_periods?.last_12_months || "Last 12 months"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="12m" className="rounded-lg">
              {t.charts?.activity_overview?.time_periods?.last_12_months || "Last 12 months"}
            </SelectItem>
            <SelectItem value="6m" className="rounded-lg">
              {t.charts?.activity_overview?.time_periods?.last_6_months || "Last 6 months"}
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              {t.charts?.activity_overview?.time_periods?.last_3_months || "Last 3 months"}
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
