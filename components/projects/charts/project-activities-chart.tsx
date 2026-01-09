"use client"

import * as React from "react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts"
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
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { projectTranslations } from "@/lib/translations/projects"

interface ProjectActivitiesChartProps {
  data: any[]
  loading?: boolean
  selectedYear?: number
}

export function ProjectActivitiesChart({ 
  data, 
  loading,
  selectedYear = new Date().getFullYear() 
}: ProjectActivitiesChartProps) {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [selectedQuarter, setSelectedQuarter] = useState<"all" | "q1" | "q2" | "q3" | "q4">("all")

  // Cores dinâmicas para os top 5 projetos
  const projectColors = [
    "hsl(217, 91%, 60%)",  // Deep Blue
    "hsl(142, 76%, 36%)",  // Deep Green
    "hsl(32, 95%, 44%)",   // Deep Orange
    "hsl(271, 91%, 65%)",  // Deep Purple
    "hsl(330, 81%, 60%)",  // Deep Pink
  ]

  // Transformar dados para mostrar atividades por mês e projeto
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    // Encontrar top 5 projetos com mais atividades
    const projectActivityCounts = data.reduce((acc: Record<string, number>, project) => {
      const key = project.title || 'Unknown'
      acc[key] = (acc[key] || 0) + (project.activities || 0)
      return acc
    }, {})

    const topProjects = Object.entries(projectActivityCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name]) => name)

    // Inicializar estrutura de dados por mês
    const monthlyData = months.map((month, index) => {
      const monthData: any = { 
        month,
        quarter: Math.floor(index / 3) + 1
      }
      
      topProjects.forEach(projectName => {
        monthData[projectName] = 0
      })
      
      return monthData
    })

    // Contar atividades por mês para cada projeto
    data.forEach(project => {
      const projectName = project.title || 'Unknown'
      if (!topProjects.includes(projectName)) return

      // Usar created_at ou start_at para determinar o mês
      const createdDate = new Date(project.created_at || project.start_at)
      const projectYear = createdDate.getFullYear()
      const projectMonth = createdDate.getMonth()
      
      // Apenas incluir projetos do ano selecionado
      if (projectYear === selectedYear) {
        monthlyData[projectMonth][projectName] += (project.activities || 0)
      }
    })

    return monthlyData
  }, [data, selectedYear])

  // Mapeamento de nomes de projetos para keys seguras
  const projectKeyMap = useMemo(() => {
    const map: Record<string, string> = {}
    if (chartData.length === 0) return map

    const firstMonth = chartData[0]
    Object.keys(firstMonth)
      .filter(key => key !== 'month' && key !== 'quarter')
      .forEach(projectName => {
        const safeKey = projectName.replace(/[^a-zA-Z0-9]/g, '_')
        map[projectName] = safeKey
      })
    
    return map
  }, [chartData])

  // Configuração dinâmica do chart baseada nos top 5 projetos
  const chartConfig: ChartConfig = useMemo(() => {
    if (chartData.length === 0) return {}

    const config: ChartConfig = {}
    const firstMonth = chartData[0]
    
    Object.keys(firstMonth)
      .filter(key => key !== 'month' && key !== 'quarter')
      .forEach((projectName, index) => {
        const truncatedName = projectName.length > 15 
          ? projectName.substring(0, 15) + '...' 
          : projectName
        
        // Criar uma key segura para CSS variables (remover espaços e caracteres especiais)
        const safeKey = projectName.replace(/[^a-zA-Z0-9]/g, '_')
        
        config[safeKey] = {
          label: truncatedName,
          color: projectColors[index % projectColors.length]
        }
      })
    
    return config
  }, [chartData, projectColors])

  const filteredData = useMemo(() => {
    if (selectedQuarter === "all") return chartData
    const quarterNum = parseInt(selectedQuarter.charAt(1))
    return chartData.filter(item => item.quarter === quarterNum)
  }, [chartData, selectedQuarter])

  const totals = useMemo(() => {
    const projectKeys = Object.keys(chartConfig)
    const totalsObj: Record<string, number> = { total: 0 }

    projectKeys.forEach(safeKey => {
      // Encontrar o nome original do projeto
      const originalName = Object.entries(projectKeyMap).find(([_, safe]) => safe === safeKey)?.[0] || safeKey
      totalsObj[safeKey] = filteredData.reduce((sum, month) => sum + (month[originalName] || 0), 0)
      totalsObj.total += totalsObj[safeKey]
    })

    return totalsObj
  }, [filteredData, chartConfig, projectKeyMap])

  const topProject = useMemo(() => {
    const projectKeys = Object.keys(chartConfig)
    if (projectKeys.length === 0) return null

    let maxActivities = 0
    let topProjectName = ''

    projectKeys.forEach(key => {
      if (totals[key] > maxActivities) {
        maxActivities = totals[key]
        topProjectName = key
      }
    })

    return { name: topProjectName, activities: maxActivities }
  }, [totals, chartConfig])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
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
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t_project.charts.projectsWithMostActivities}
          </CardTitle>
          <CardDescription>
            {t_project.charts.top10Activities} - {selectedYear}
          </CardDescription>
        </div>
        
        {/* Quarter Filter Toggle */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={selectedQuarter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('all')}
            className="h-7 px-3 text-xs"
          >
            All
          </Button>
          <Button
            variant={selectedQuarter === 'q1' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q1')}
            className="h-7 px-3 text-xs"
          >
            Q1
          </Button>
          <Button
            variant={selectedQuarter === 'q2' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q2')}
            className="h-7 px-3 text-xs"
          >
            Q2
          </Button>
          <Button
            variant={selectedQuarter === 'q3' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q3')}
            className="h-7 px-3 text-xs"
          >
            Q3
          </Button>
          <Button
            variant={selectedQuarter === 'q4' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q4')}
            className="h-7 px-3 text-xs"
          >
            Q4
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            {Object.entries(projectKeyMap).map(([originalName, safeKey], index) => (
              <Bar
                key={safeKey}
                dataKey={originalName}
                stackId="a"
                fill={chartConfig[safeKey]?.color || projectColors[index % projectColors.length]}
                radius={index === Object.entries(projectKeyMap).length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total: {totals.total.toLocaleString()} {t_project.charts.activities} <TrendingUp className="h-4 w-4" />
        </div>
        {topProject && topProject.name && (
          <div className="leading-none text-muted-foreground">
            Top: {chartConfig[topProject.name]?.label || topProject.name} with {topProject.activities} {t_project.charts.activities}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
