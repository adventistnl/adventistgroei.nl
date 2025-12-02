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
import { useChartColors } from "@/lib/chart-colors"
import { departmentTranslations } from "@/lib/translations/departments"

interface DepartmentActivityChartProps {
  data?: any[]
  loading?: boolean
  departments?: any[]
  selectedYear?: number
}

export function DepartmentActivityChart({ data, loading, departments = [], selectedYear = new Date().getFullYear() }: DepartmentActivityChartProps) {
  const [timeRange, setTimeRange] = React.useState("12m")
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  // Processar departamentos reais e seus valores
  const departmentsList = React.useMemo(() => {
    if (!departments || departments.length === 0) return []
    
    return departments
      .filter((dept: any) => !dept.is_deleted) // Filtrar departamentos ativos
      .map((dept: any) => {
        // Buscar orçamento do ano selecionado
        const yearBudget = dept.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        
        const allocatedAmount = Number(yearBudget?.allocated_amount) || 0;
        const spentAmount = Number(yearBudget?.total_expenses) || 0;
        const userCount = dept.users?.length || 0;

        // Calcular atividade baseado em orçamento alocado e gastos reais
        const activityValue = Math.floor((allocatedAmount / 1000) + (spentAmount / 1000) + (userCount * 2));

        return {
          id: dept.id,
          name: dept.name,
          allocated: allocatedAmount,
          spent: spentAmount,
          value: activityValue,
        }
      })
      .filter(dept => dept.allocated > 0) // Mostrar apenas departamentos com orçamento
  }, [departments, selectedYear])

  // Gerar dados realistas baseados nos orçamentos anuais
  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth();

    if (departmentsList.length === 0) {
      // Se não há departamentos, retornar dados zerados
      return months.map((month, index) => ({
        month,
        date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
      }))
    }

    // Gerar dados baseados no progresso real do ano
    return months.map((month, index) => {
      const monthData: any = {
        month,
        date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
      }

      // Adicionar cada departamento como uma propriedade
      departmentsList.forEach((dept) => {
        // Simular gastos progressivos ao longo do ano
        const monthlyProgress = index <= currentMonth ? (index + 1) / 12 : 0;
        const monthlySpent = Math.floor(dept.spent * monthlyProgress);
        
        monthData[dept.id] = monthlySpent / 1000; // Converter para K
      })

      return monthData
    })
  }, [departmentsList, selectedYear])
  
  const { generatePalette } = useChartColors()

  // Gerar cores dinâmicas para cada departamento
  const departmentColors = React.useMemo(() => {
    const palette = generatePalette(departmentsList.length)
    const colorMap: { [key: string]: string } = {}

    departmentsList.forEach((dept, index) => {
      colorMap[dept.id] = palette[index]
    })

    return colorMap
  }, [departmentsList, generatePalette])

  // Configuração dinâmica do gráfico baseada nos departamentos reais
  const chartConfig = React.useMemo(() => {
    const config: any = {}

    departmentsList.forEach((dept) => {
      config[dept.id] = {
        label: dept.name,
        color: departmentColors[dept.id],
      }
    })

    return config
  }, [departmentsList, departmentColors])

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
          <CardTitle>{t.charts?.activity_overview?.title || "Department Budget Activity"}</CardTitle>
          <CardDescription>
            {t.charts?.activity_overview?.description || `Monthly budget utilization by departments for ${selectedYear}`}
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
              {departmentsList.map((dept) => (
                <linearGradient key={dept.id} id={`fill${dept.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={departmentColors[dept.id]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={departmentColors[dept.id]} stopOpacity={0.1} />
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
              content={<ChartTooltipContent indicator="dot" />}
            />
            {departmentsList.map((dept) => (
              <Area
                key={dept.id}
                dataKey={dept.id}
                type="natural"
                fill={`url(#fill${dept.id})`}
                stroke={departmentColors[dept.id]}
                stackId="a"
              />
            ))}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
