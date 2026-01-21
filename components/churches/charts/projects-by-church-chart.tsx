"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
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
  ChartStyle,
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
import { Layers } from "lucide-react"

interface ProjectsByChurchChartProps {
  data?: any[]
  loading?: boolean
  title?: string
  description?: string
  mode?: 'churches' | 'departments' // Determina se mostra igrejas ou departamentos
  onItemClick?: (item: any) => void // Callback quando clicar em um item
}

export function ProjectsByChurchChart({ 
  data, 
  loading,
  title,
  description,
  mode = 'churches',
  onItemClick
}: ProjectsByChurchChartProps) {
  // Mock data: Projects by church
  const mockProjectsData = [
    { 
      church: "Campinas",
      fullName: "Igreja de Campinas",
      projects: 15,
      activeProjects: 12,
      completedProjects: 3,
      fill: "#8b5cf6" // purple
    },
    { 
      church: "Central SP",
      fullName: "Igreja Central de São Paulo",
      projects: 12,
      activeProjects: 9,
      completedProjects: 3,
      fill: "#3b82f6" // blue
    },
    { 
      church: "Rio",
      fullName: "Igreja do Rio de Janeiro",
      projects: 10,
      activeProjects: 7,
      completedProjects: 3,
      fill: "#ef4444" // red
    },
    { 
      church: "Vila Madalena",
      fullName: "Igreja de Vila Madalena",
      projects: 8,
      activeProjects: 6,
      completedProjects: 2,
      fill: "#10b981" // green
    },
    { 
      church: "Mooca",
      fullName: "Igreja da Mooca",
      projects: 6,
      activeProjects: 4,
      completedProjects: 2,
      fill: "#f59e0b" // orange
    },
  ]

  const id = mode === 'departments' ? "projects-by-department" : "projects-by-church"
  const chartData = React.useMemo(() => data || mockProjectsData, [data, mockProjectsData])
  
  // Gera chartConfig dinamicamente baseado nos dados
  const chartConfig = React.useMemo(() => {
    const config: any = {
      projects: {
        label: "Projects",
      },
    }
    
    chartData.forEach((item: any) => {
      const key = mode === 'departments' ? item.department : item.church
      config[key] = {
        label: item.fullName || key,
        color: item.fill,
      }
    })
    
    return config as ChartConfig
  }, [chartData, mode])
  
  // Define a key baseada no modo (church ou department)
  const itemKey = mode === 'departments' ? 'department' : 'church'
  const [activeItem, setActiveItem] = React.useState(chartData[0]?.[itemKey])

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item[itemKey] === activeItem),
    [activeItem, chartData, itemKey]
  )
  
  const itemKeys = React.useMemo(() => chartData.map((item) => item[itemKey]), [chartData, itemKey])
  const totalProjects = React.useMemo(
    () => chartData.reduce((sum, item) => sum + item.projects, 0),
    [chartData]
  )

  if (loading) {
    return (
      <Card data-chart={id} className="h-full flex flex-col">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1 flex-1">
            <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          <div className="w-[300px] h-[300px] bg-muted rounded-full animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="h-full flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1 flex-1">
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            {title || (mode === 'departments' ? 'Projetos por Departamento' : 'Projetos por Igreja')}
          </CardTitle>
          <CardDescription>
            {description || (mode === 'departments' 
              ? 'Qual departamento tem mais projetos ativos' 
              : 'Qual igreja tem mais projetos ativos')}
          </CardDescription>
        </div>
        <Select value={activeItem} onValueChange={setActiveItem}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label={mode === 'departments' ? "Select a department" : "Select a church"}
          >
            <SelectValue placeholder={mode === 'departments' ? "Select department" : "Select church"} />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {itemKeys.map((key: string) => {
              const config = chartConfig[key as keyof typeof chartConfig]
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
                        backgroundColor: `var(--color-${key})`,
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
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="projects"
              nameKey={itemKey}
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onClick={(data) => {
                // Allow clicking on pie sectors to select them
                const clickedItem = data?.[itemKey]
                if (clickedItem) {
                  setActiveItem(clickedItem)
                  // Chama callback se fornecido
                  if (onItemClick) {
                    onItemClick(data)
                  }
                }
              }}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
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
                    const activeData = chartData[activeIndex]
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
                          {activeData.projects.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Projects
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 44}
                          className="fill-muted-foreground text-xs"
                        >
                          {activeData.activeProjects} active
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
        {/* Minimalist footer - show selected church data */}
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Projects</span>
          </div>
          <span className="font-semibold text-gray-900">
            {totalProjects.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: chartData[activeIndex]?.fill }}
            ></div>
            <span className="text-muted-foreground">Selected: {chartData[activeIndex]?.fullName}</span>
          </div>
          <span className="font-medium">
            {chartData[activeIndex]?.projects.toLocaleString()} projects
            <span className="text-muted-foreground ml-1">
              ({Math.round((chartData[activeIndex]?.projects / totalProjects) * 100)}%)
            </span>
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium text-green-600">
              {chartData[activeIndex]?.activeProjects} active
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium text-gray-600">
              {chartData[activeIndex]?.completedProjects} completed
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
