"use client"

import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart3 } from "lucide-react"
import { projectTranslations } from "@/lib/translations/projects"

const projectsChartConfig = {
  projects: {
    label: "Projetos",
    color: "#3b82f6", // Blue
  },
  budget: {
    label: "Orçamento",
    color: "#10b981", // Green
  },
  subsidies: {
    label: "Subsídios",
    color: "#f59e0b", // Amber
  },
} satisfies ChartConfig

interface ProjectActivitiesChartProps {
  data: any[]
}

export function ProjectActivitiesChart({ data }: ProjectActivitiesChartProps) {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  // Ordenar projetos por quantidade de atividades (top 10)
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => (b.activities || 0) - (a.activities || 0))
      .slice(0, 10)
      .map(project => ({
        name: project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title,
        activities: project.activities || 0
      }))
  }, [data])

  // Total de atividades
  const totalActivities = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.activities, 0)
  }, [chartData])

  // Projeto com mais atividades
  const topProject = useMemo(() => {
    return chartData.length > 0 ? chartData[0] : null
  }, [chartData])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Projects with Most Activities
          </CardTitle>
          <CardDescription className="mt-1">
            Top 10 projects by number of registered activities
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={projectsChartConfig} className="h-full min-h-[300px] w-full">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={120}
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar 
              dataKey="activities" 
              fill="hsl(var(--chart-1))" 
              radius={[0, 4, 4, 0]}
              name="Activities"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-4">
        <div className="flex gap-2 font-medium leading-none">
          Total: {totalActivities.toLocaleString()} activities
        </div>
        {topProject && (
          <div className="leading-none text-muted-foreground">
            Top: {topProject.name} with {topProject.activities} activities
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
