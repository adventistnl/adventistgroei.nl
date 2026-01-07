"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"
import { TrendingUp, BarChart3, Activity } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
import { Building2 } from "lucide-react"

interface ProjectsOverTimeChartProps {
  data: any[]
  departments: any[]
  loading?: boolean
  selectedYear?: number
}

export function ProjectsOverTimeChart({ 
  data, 
  departments,
  loading,
  selectedYear
}: ProjectsOverTimeChartProps) {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [chartType, setChartType] = React.useState<"area" | "bar">("area")
  
  // Use selectedYear if provided, otherwise use current year
  const chartYear = selectedYear || new Date().getFullYear()

  // Generate dynamic chart config based on departments
  const chartConfig: ChartConfig = React.useMemo(() => {
    const colors = [
      "hsl(210, 100%, 50%)",
      "hsl(270, 95%, 60%)",
      "hsl(142, 71%, 45%)",
      "hsl(43, 96%, 56%)",
      "hsl(340, 75%, 55%)",
      "hsl(160, 60%, 45%)",
      "hsl(300, 65%, 55%)",
      "hsl(30, 80%, 55%)",
    ]

    const config: ChartConfig = {
      count: {
        label: t_project.charts.projects,
      }
    }

    departments.forEach((dept, index) => {
      const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
      config[deptKey] = {
        label: dept.name,
        color: colors[index % colors.length]
      }
    })

    return config
  }, [departments])

  // Transform data to show months on X-axis and departments as separate areas/bars
  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    // Initialize data structure for each month
    const monthlyData = months.map((month, index) => {
      const monthData: any = { month }
      
      // Initialize all departments to 0
      departments.forEach(dept => {
        const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
        monthData[deptKey] = 0
      })
      
      return monthData
    })

    // Count projects by month and department using created_at
    data.forEach(project => {
      // Use created_at if available, fallback to start_at
      const createdDate = new Date(project.created_at || project.start_at)
      const projectYear = createdDate.getFullYear()
      const projectMonth = createdDate.getMonth()
      
      // Only include projects from the selected year
      if (projectYear === chartYear) {
        const dept = departments.find(d => d.id === project.department_id)
        if (dept) {
          const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
          monthlyData[projectMonth][deptKey] += 1
        }
      }
    })

    return monthlyData
  }, [data, departments, chartYear])

  const totalByDepartment = React.useMemo(() => {
    const totals: Record<string, number> = {}
    
    departments.forEach(dept => {
      const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
      totals[deptKey] = 0
    })
    
    chartData.forEach(month => {
      departments.forEach(dept => {
        const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
        totals[deptKey] += month[deptKey] || 0
      })
    })
    
    return totals
  }, [chartData, departments])

  const topDepartment = React.useMemo(() => {
    const entries = Object.entries(totalByDepartment)
    const top = entries.reduce((max, [dept, total]) => 
      total > max.total ? { dept, total } : max
    , { dept: '', total: 0 })
    
    return {
      name: chartConfig[top.dept as keyof typeof chartConfig]?.label || top.dept,
      total: top.total
    }
  }, [totalByDepartment, chartConfig])

  const totalProjects = React.useMemo(() => {
    return Object.values(totalByDepartment).reduce((sum, val) => sum + val, 0)
  }, [totalByDepartment])

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (departments.length === 0 || data.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {t_project.charts.projectsCreatedOverTime}
          </CardTitle>
          <CardDescription>
            {t_project.charts.monthlyProjectCreation}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t_project.charts.noProjectData}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="space-y-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4" />
              {t_project.charts.projectsCreatedOverTime}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {t_project.charts.monthlyProjectCreation} - {chartYear}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={chartType === "area" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("area")}
              className="h-7 px-3 text-xs"
            >
              <Activity className="w-3 h-3 mr-1" />
            </Button>
            <Button
              variant={chartType === "bar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setChartType("bar")}
              className="h-7 px-3 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          {chartType === "area" ? (
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent hideLabel={false} />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {departments.map((dept, index) => {
                const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                return (
                  <Area
                    key={dept.id}
                    dataKey={deptKey}
                    type="monotone"
                    fill={`var(--color-${deptKey})`}
                    fillOpacity={0.4}
                    stroke={`var(--color-${deptKey})`}
                    stackId="a"
                  />
                )
              })}
            </AreaChart>
          ) : (
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent hideLabel={false} />} 
              />
              <ChartLegend content={<ChartLegendContent />} />
              {departments.map((dept, index) => {
                const deptKey = dept.name.toLowerCase().replace(/\s+/g, '_')
                const isLast = index === departments.length - 1
                return (
                  <Bar
                    key={dept.id}
                    dataKey={deptKey}
                    stackId="a"
                    fill={`var(--color-${deptKey})`}
                    radius={isLast ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  />
                )
              })}
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs pt-3 border-t">
        <div className="flex items-center gap-1.5 font-medium">
          <TrendingUp className="h-3 w-3" />
          {totalProjects} {t_project.charts.projectsCreatedThisYear}
        </div>
        <div className="text-muted-foreground">
          {t_project.charts.top}: <span className="font-medium text-foreground">{topDepartment.name}</span> ({topDepartment.total} {t_project.charts.projects.toLowerCase()})
        </div>
      </CardFooter>
    </Card>
  )
}
