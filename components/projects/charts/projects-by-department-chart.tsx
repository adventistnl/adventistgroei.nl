"use client"

import * as React from "react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Label, Pie, PieChart as RechartsPieChart, Sector } from "recharts"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PieChart } from "lucide-react"
import { projectTranslations } from "@/lib/translations/projects"

interface ProjectsByDepartmentChartProps {
  data: any[]
  departments: any[]
}

export function ProjectsByDepartmentChart({ data, departments }: ProjectsByDepartmentChartProps) {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const id = "projects-by-department"

  // Cores para o gráfico PIE - adaptáveis ao tema
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))'
  ]

  // Transformar dados para o PIE chart
  const pieData = useMemo(() => {
    const projectsByDept = data.reduce((acc: any, project: any) => {
      const deptId = project.department_id
      if (!acc[deptId]) {
        acc[deptId] = {
          department_id: deptId,
          count: 0
        }
      }
      acc[deptId].count += 1
      return acc
    }, {})

    return Object.values(projectsByDept).map((item: any, index) => {
      const dept = departments.find(d => d.id === item.department_id)
      return {
        department: dept?.name || 'Unknown',
        count: item.count,
        fill: COLORS[index % COLORS.length]
      }
    })
  }, [data, departments])

  const hasData = pieData.length > 0

  // Generate chart config dynamically
  const chartConfig: ChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      count: {
        label: t_project.charts.projects,
        color: "hsl(var(--chart-1))"
      }
    }
    
    pieData.forEach((item, index) => {
      const deptKey = item.department.toLowerCase().replace(/\s+/g, '_')
      config[deptKey] = {
        label: item.department,
        color: item.fill
      }
    })
    
    return config as ChartConfig
  }, [pieData])

  const [activeDepartment, setActiveDepartment] = React.useState(hasData ? pieData[0].department : "")

  const activeIndex = useMemo(
    () => hasData ? pieData.findIndex((item) => item.department === activeDepartment) : 0,
    [activeDepartment, pieData, hasData]
  )

  const departmentKeys = useMemo(() => hasData ? pieData.map((item) => item.department) : [], [pieData, hasData])

  const totalProjects = useMemo(() => {
    return pieData.reduce((sum, item) => sum + item.count, 0)
  }, [pieData])

  return (
    <Card data-chart={id} className="h-full flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="grid gap-1 flex-1">
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            {t_project.charts.projectsByDepartment}
          </CardTitle>
          <CardDescription>
            {t_project.charts.distributionByDepartment}
          </CardDescription>
        </div>
        <Select value={activeDepartment} onValueChange={setActiveDepartment}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label="Select a department"
          >
            <SelectValue placeholder={t_project.charts.selectDepartment} />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {departmentKeys.map((key) => {
              const deptKey = key.toLowerCase().replace(/\s+/g, '_')
              const config = chartConfig[deptKey as keyof typeof chartConfig]
              if (!config) return null

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: `var(--color-${deptKey})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <RechartsPieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={pieData}
              dataKey="count"
              nameKey="department"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onClick={(data) => {
                if (data && data.department) {
                  setActiveDepartment(data.department)
                }
              }}
              activeShape={({
                outerRadius = 0,
                ...props
              }: any) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const activeData = pieData?.[activeIndex]
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {activeData?.count.toLocaleString() || 0}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {t_project.charts.projects}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </RechartsPieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col  items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Total: {totalProjects.toLocaleString()} {t_project.charts.projects.toLowerCase()}
        </div>
        <div className="leading-none text-muted-foreground">
          {activeDepartment}: {pieData[activeIndex]?.count || 0} ({Math.round(((pieData[activeIndex]?.count || 0) / totalProjects) * 100)}%)
        </div>
      </CardFooter>
    </Card>
  )
}
