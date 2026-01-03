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

  return (
    <Card className="h-full">
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
      <CardContent>
        <ChartContainer config={projectsChartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} layout="vertical">
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
              fill="#3b82f6" 
              radius={[0, 4, 4, 0]}
              name="Activities"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
