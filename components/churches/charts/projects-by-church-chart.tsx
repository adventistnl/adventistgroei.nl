"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
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
import { Layers, TrendingUp } from "lucide-react"
import { getProjectColor } from "@/lib/chart-colors"
import { churchTranslations } from "@/lib/translations/churches"
import { ChartHeader } from "@/components/charts/chart-header"

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
  const { i18n } = useTranslation()
  const id = mode === 'departments' ? "projects-by-department" : "projects-by-church"
  
  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  
  // Process data and apply getProjectColor for consistency
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return []
    
    // Apply getProjectColor to each item
    const processedData = data.map((item: any, index: number) => ({
      ...item,
      fill: getProjectColor(index)
    }))
    
    return processedData
  }, [data])
  
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
  const [activeItem, setActiveItem] = React.useState<string>('__ALL__') // Default: All Churches

  const activeIndex = React.useMemo(
    () => {
      // Se for 'All Churches', não tem índice ativo (mostra todas)
      if (activeItem === '__ALL__') return -1
      return chartData.findIndex((item) => item[itemKey] === activeItem)
    },
    [activeItem, chartData, itemKey]
  )
  
  
  const itemKeys = React.useMemo(() => chartData.map((item) => item[itemKey]), [chartData, itemKey])
  const totalProjects = React.useMemo(() => {
    const total = chartData.reduce((sum, item) => sum + item.projects, 0)
    
    return total
  }, [chartData, itemKey, activeItem])
  
  // Dados ativos baseados na seleção
  const activeData = React.useMemo(() => {
    if (activeItem === '__ALL__') {
      // Modo All: retorna dados agregados
      return {
        projects: totalProjects,
        activeProjects: chartData.reduce((sum, item) => sum + item.activeProjects, 0),
        completedProjects: chartData.reduce((sum, item) => sum + item.completedProjects, 0),
        fullName: mode === 'departments' 
          ? tChurch.charts.projectsByChurch.allDepartments
          : tChurch.charts.projectsByChurch.allChurches
      }
    }
    // Modo Single: retorna dados da igreja/departamento selecionado
    return chartData[activeIndex] || chartData[0]
  }, [activeItem, chartData, activeIndex, totalProjects, mode, tChurch])

  if (loading) {
    return (
      <Card data-chart={id} className="h-full flex flex-col min-h-[500px]">
        <ChartHeader
          title={
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            </div>
          }
          description={<div className="h-4 bg-muted rounded w-64 animate-pulse mt-2" />}
          actions={
            <div className="h-9 w-full sm:w-[160px] bg-muted rounded-lg animate-pulse" />
          }
        />
        <CardContent className="flex flex-1 justify-center items-center pb-0 px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="space-y-4 w-full max-w-[300px]">
            {/* Pie chart skeleton */}
            <div className="w-[300px] h-[300px] bg-muted/30 rounded-full animate-pulse relative overflow-hidden mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[120px] h-[120px] bg-background rounded-full" />
              </div>
              {/* Animated segments */}
              <div className="absolute top-0 left-1/2 w-px h-full bg-muted/20" />
              <div className="absolute top-1/2 left-0 w-full h-px bg-muted/20" />
              <div className="absolute top-1/4 left-1/4 w-px h-full bg-muted/20 rotate-45 origin-center" />
              <div className="absolute top-1/4 right-1/4 w-px h-full bg-muted/20 -rotate-45 origin-center" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
          <div className="w-full flex items-center justify-between">
            <div className="h-3 bg-muted rounded w-32 animate-pulse" />
            <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="h-3 bg-muted rounded w-40 animate-pulse" />
            <div className="h-3 bg-muted rounded w-24 animate-pulse" />
          </div>
          <div className="w-full flex items-center justify-between">
            <div className="h-3 bg-muted rounded w-28 animate-pulse" />
            <div className="h-3 bg-muted rounded w-20 animate-pulse" />
          </div>
        </CardFooter>
      </Card>
    )
  }

  // Empty state when no data
  if (!chartData || chartData.length === 0) {
    return (
      <Card data-chart={id} className="h-full flex flex-col min-h-[500px]">
        <ChartHeader
          title={
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-600" />
              {title || (mode === 'departments' ? tChurch.charts.projectsByChurch.titleDepartments : tChurch.charts.projectsByChurch.title)}
            </div>
          }
          description={
            description || (mode === 'departments' 
              ? tChurch.charts.projectsByChurch.descriptionDepartments
              : tChurch.charts.projectsByChurch.description)
          }
          actions={
            <Select disabled>
              <SelectTrigger
                className="h-9 w-full sm:w-[160px] rounded-lg pl-2.5 opacity-50"
                aria-label={mode === 'departments' ? tChurch.charts.projectsByChurch.selectDepartment : tChurch.charts.projectsByChurch.selectChurch}
              >
                <SelectValue placeholder={mode === 'departments' ? tChurch.charts.projectsByChurch.selectPlaceholderDept : tChurch.charts.projectsByChurch.selectPlaceholder} />
              </SelectTrigger>
            </Select>
          }
        />
        <CardContent className="flex flex-1 justify-center items-center pb-0 px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="text-center space-y-6 max-w-md">
            {/* Empty state illustration */}
            <div className="relative h-[240px] w-full flex items-center justify-center">
              <div className="space-y-4">
                {/* Empty pie chart illustration */}
                <div className="w-[200px] h-[200px] border-[12px] border-muted/30 rounded-full mx-auto relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[100px] h-[100px] bg-muted/10 rounded-full border-4 border-muted/20 flex items-center justify-center">
                      <Layers className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  </div>
                  {/* Empty segments visual */}
                  <div className="absolute top-0 left-1/2 w-px h-full bg-muted/20" />
                  <div className="absolute top-1/2 left-0 w-full h-px bg-muted/20" />
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 left-1/4 w-px h-1/2 bg-muted/15 rotate-45 origin-bottom" />
                    <div className="absolute top-1/4 right-1/4 w-px h-1/2 bg-muted/15 -rotate-45 origin-bottom" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message */}
            <div className="space-y-2 px-4">
              <h3 className="text-lg font-semibold text-foreground">
                {tChurch.charts.projectsByChurch.noData.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tChurch.charts.projectsByChurch.noData.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
          <div className="w-full flex items-center justify-between text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              <span>{tChurch.charts.projectsByChurch.footer.totalProjects}</span>
            </div>
            <span className="font-semibold">0</span>
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="h-full flex flex-col min-h-[500px]">
      <ChartStyle id={id} config={chartConfig} />
      <ChartHeader
        title={
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gray-600" />
            {title || (mode === 'departments' ? tChurch.charts.projectsByChurch.titleDepartments : tChurch.charts.projectsByChurch.title)}
          </div>
        }
        description={
          description || (mode === 'departments' 
            ? tChurch.charts.projectsByChurch.descriptionDepartments
            : tChurch.charts.projectsByChurch.description)
        }
        actions={
          <Select value={activeItem} onValueChange={setActiveItem}>
            <SelectTrigger
              className="h-9 w-full sm:w-[160px] rounded-lg pl-2.5"
              aria-label={mode === 'departments' ? tChurch.charts.projectsByChurch.selectDepartment : tChurch.charts.projectsByChurch.selectChurch}
            >
              <SelectValue placeholder={mode === 'departments' ? tChurch.charts.projectsByChurch.selectPlaceholderDept : tChurch.charts.projectsByChurch.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {/* Opção All Churches como primeira opção */}
              <SelectItem
                value="__ALL__"
                className="rounded-lg [&_span]:flex font-semibold"
              >
                <div className="flex items-center gap-2 text-xs">
                  <Layers className="w-3 h-3" />
                  {mode === 'departments' 
                    ? tChurch.charts.projectsByChurch.allDepartments
                    : tChurch.charts.projectsByChurch.allChurches}
                </div>
              </SelectItem>
              
              {/* Igrejas/Departamentos individuais */}
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
        }
      />
      <CardContent className="flex flex-1 justify-center items-center pb-0 px-2 pt-4 sm:px-6 sm:pt-6">
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
              activeIndex={activeItem === '__ALL__' ? undefined : activeIndex}
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
                    if (!activeData) return null
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
                          {tChurch.charts.projectsByChurch.chart.projects}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 44}
                          className="fill-muted-foreground text-xs"
                        >
                          {activeData.activeProjects} {tChurch.charts.projectsByChurch.chart.activeLabel}
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
            <span className="text-muted-foreground">{tChurch.charts.projectsByChurch.footer.totalProjects}</span>
          </div>
          <span className="font-semibold text-gray-900">
            {totalProjects.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {activeItem !== '__ALL__' && (
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: chartData[activeIndex]?.fill }}
              ></div>
            )}
            {activeItem === '__ALL__' && <Layers className="w-3 h-3 text-muted-foreground" />}
            <span className="text-muted-foreground">{tChurch.charts.projectsByChurch.footer.selected} {activeData?.fullName}</span>
          </div>
          <span className="font-medium">
            {activeData?.projects.toLocaleString()} {tChurch.charts.projectsByChurch.footer.projects}
            {activeItem !== '__ALL__' && totalProjects > 0 && (
              <span className="text-muted-foreground ml-1">
                ({Math.round((activeData?.projects / totalProjects) * 100)}%)
              </span>
            )}
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{tChurch.charts.projectsByChurch.footer.status}</span>
            <span className="font-medium text-green-600">
              {activeData?.activeProjects} {tChurch.charts.projectsByChurch.footer.active}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium text-gray-600">
              {activeData?.completedProjects} {tChurch.charts.projectsByChurch.footer.completed}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
