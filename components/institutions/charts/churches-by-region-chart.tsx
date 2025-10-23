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
import { useChartColors, CHART_PRESETS } from "@/lib/chart-colors"

interface ChurchesByRegionChartProps {
  regions?: any[]
  churches?: any[]
  loading?: boolean
}

export function ChurchesByRegionChart({ regions, churches, loading }: ChurchesByRegionChartProps) {
  const { theme } = useChartColors()
  const regionColors = CHART_PRESETS.regions(theme as 'light' | 'dark')

  // Dados mockados: Igrejas por região
  const mockRegionsData = [
    { 
      region: "north", 
      name: "North Region",
      churches: 24, 
      provinces: ["Friesland", "Groningen", "Drenthe"],
      fill: regionColors.north
    },
    { 
      region: "south", 
      name: "South Region",
      churches: 18, 
      provinces: ["Limburg", "Noord-Brabant"],
      fill: regionColors.south
    },
    { 
      region: "west", 
      name: "West Region",
      churches: 35, 
      provinces: ["Noord-Holland", "Zuid-Holland", "Utrecht"],
      fill: regionColors.west
    },
    { 
      region: "east", 
      name: "East Region",
      churches: 21, 
      provinces: ["Gelderland", "Overijssel"],
      fill: regionColors.east
    },
    { 
      region: "central", 
      name: "Central Region",
      churches: 16, 
      provinces: ["Flevoland", "Utrecht"],
      fill: regionColors.central
    },
  ]

  const chartConfig = {
    churches: {
      label: "Churches",
    },
    north: {
      label: "North Region",
      color: regionColors.north,
    },
    south: {
      label: "South Region",
      color: regionColors.south,
    },
    west: {
      label: "West Region",
      color: regionColors.west,
    },
    east: {
      label: "East Region",
      color: regionColors.east,
    },
    central: {
      label: "Central Region",
      color: regionColors.central,
    },
  } satisfies ChartConfig

  const id = "churches-by-region"
  const chartData = React.useMemo(() => mockRegionsData, [mockRegionsData])
  
  const [activeRegion, setActiveRegion] = React.useState(chartData[0].region)

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.region === activeRegion),
    [activeRegion, chartData]
  )
  
  const regionKeys = React.useMemo(() => chartData.map((item) => item.region), [chartData])
  const totalChurches = React.useMemo(
    () => chartData.reduce((sum, item) => sum + item.churches, 0),
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
          <CardTitle>Churches by Region</CardTitle>
          <CardDescription>
            Distribution across {chartData.length} regions
          </CardDescription>
        </div>
        <Select value={activeRegion} onValueChange={setActiveRegion}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label="Select a region"
          >
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {regionKeys.map((key) => {
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
              dataKey="churches"
              nameKey="region"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onClick={(data) => {
                // Allow clicking on pie sectors to select them
                if (data && data.region) {
                  setActiveRegion(data.region)
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
                          {activeData.churches.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Churches
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 44}
                          className="fill-muted-foreground text-xs"
                        >
                          {activeData.provinces.length} provinces
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
        {/* Minimalist footer - show selected region data */}
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Churches</span>
          </div>
          <span className="font-semibold text-gray-900">
            {totalChurches.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: chartData[activeIndex]?.fill }}
            ></div>
            <span className="text-muted-foreground">Selected: {chartData[activeIndex]?.name}</span>
          </div>
          <span className="font-medium">
            {chartData[activeIndex]?.churches.toLocaleString()} churches
            <span className="text-muted-foreground ml-1">
              ({Math.round((chartData[activeIndex]?.churches / totalChurches) * 100)}%)
            </span>
          </span>
        </div>
        
        <div className="w-full flex items-center justify-start text-xs">
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-muted-foreground">Provinces:</span>
            <span className="font-medium text-gray-700">
              {chartData[activeIndex]?.provinces.join(", ")}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
