"use client"

import React, { useState, useMemo } from "react"
import { TrendingUp, Target, PieChart as PieChartIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label as RechartsLabel,
  PieChart,
  Pie,
  Sector,
} from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

interface BudgetDistributionData {
  total: number
  allocated: number
  remaining: number
  percentageUsed: number
}

interface BudgetDistributionChartProps {
  data: BudgetDistributionData
  year: number
  entityDistribution?: Array<{
    name: string
    amount: number
    percentage: number
    count: number
  }>
}

// Department/Entity data for Pie Chart
interface EntityBudgetData {
  name: string
  amount: number
  percentage: number
  fill: string
}

const chartConfig = {
  allocated: {
    label: "Allocated",
    color: "hsl(0, 84%, 60%)", // Red for allocated (already spent)
  },
  remaining: {
    label: "Remaining",
    color: "hsl(142, 71%, 45%)", // Green for remaining (available)
  },
}

// Dynamic red gradient generator
const generateRedGradient = (count: number): string[] => {
  if (count === 0) return []
  if (count === 1) return ["hsl(0, 75%, 50%)"]
  
  // Generate gradient from dark red to light red
  const colors: string[] = []
  for (let i = 0; i < count; i++) {
    // Lightness from 30% (darkest) to 75% (lightest)
    // Saturation from 70% (rich) to 90% (vibrant)
    const lightness = 30 + (45 * i) / (count - 1)
    const saturation = 70 + (20 * i) / (count - 1)
    colors.push(`hsl(0, ${saturation.toFixed(0)}%, ${lightness.toFixed(0)}%)`)
  }
  
  return colors
}

export function BudgetDistributionChart({ data, year, entityDistribution = [] }: BudgetDistributionChartProps) {
  console.log("Entity Distribution Data:", data, entityDistribution)
  const { t } = useTranslation()
  const [chartType, setChartType] = useState<"radial" | "pie">("radial")
  
  // Use entity distribution data directly from backend (no calculations needed)
  const entityBudgetData: EntityBudgetData[] = useMemo(() => {
    if (!entityDistribution || entityDistribution.length === 0) {
      // Fallback to remaining budget if no distribution data
      if (data.remaining > 0) {
        return [{
          name: "Available",
          amount: data.remaining,
          percentage: 100,
          fill: "hsl(142, 71%, 45%)", // Green for available
        }]
      }
      return []
    }

    // Convert backend data to chart format
    const entities = entityDistribution.map((entity) => ({
      name: entity.name.charAt(0).toUpperCase() + entity.name.slice(1), // Capitalize
      amount: entity.amount,
      percentage: entity.percentage,
    }))

    // Sort by amount descending
    entities.sort((a, b) => b.amount - a.amount)
    
    // Generate colors for entities
    const redGradient = generateRedGradient(entities.length)
    
    return entities.map((entity, index) => ({
      ...entity,
      fill: redGradient[index] || "hsl(0, 75%, 50%)",
    }))
  }, [entityDistribution, data.remaining])

  // Add remaining budget as first item in pie chart
  const pieChartData = useMemo(() => {
    if (data.remaining <= 0) return entityBudgetData
    
    const remainingItem: EntityBudgetData = {
      name: "Available",
      amount: data.remaining,
      percentage: Math.round((data.remaining / data.total) * 100),
      fill: "hsl(142, 71%, 45%)", // Static green for available budget
    }
    
    return [remainingItem, ...entityBudgetData]
  }, [data.remaining, data.total, entityBudgetData])

  const [activeEntity, setActiveEntity] = useState(pieChartData[0]?.name || "Available")

  const activeIndex = useMemo(
    () => pieChartData.findIndex((item) => item.name === activeEntity),
    [activeEntity, pieChartData]
  )
  
  return (
    <Card className="h-full">
      <CardHeader className="items-center pb-2">
        <div className="w-full flex items-start justify-between">
          <div>
            <CardTitle className="text-sm">{t("annual_budget.charts.budget_distribution.title", { year })}</CardTitle>
            <CardDescription className="text-xs">{t("annual_budget.charts.budget_distribution.subtitle")}</CardDescription>
          </div>
          
          {/* Toggle Button */}
          <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("radial")}
              className={cn(
                "h-7 px-2 rounded-md transition-all text-xs",
                chartType === "radial"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Target className="w-3.5 h-3.5 mr-1" />
              Radial
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChartType("pie")}
              className={cn(
                "h-7 px-2 rounded-md transition-all text-xs",
                chartType === "pie"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <PieChartIcon className="w-3.5 h-3.5 mr-1" />
              Pie
            </Button>
          </div>
        </div>
        
        {/* Entity Selector for Pie Chart */}
        {chartType === "pie" && pieChartData.length > 0 && (
          <div className="w-full mt-3">
            <Select value={activeEntity} onValueChange={setActiveEntity}>
              <SelectTrigger
                className="h-8 w-full rounded-lg text-xs"
                aria-label="Select an entity"
              >
                <SelectValue placeholder="Select entity" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                {pieChartData.map((entity) => (
                  <SelectItem
                    key={entity.name}
                    value={entity.name}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className="flex h-3 w-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: entity.fill }}
                      />
                      <span className="font-medium">{entity.name}</span>
                      <span className="text-muted-foreground">
                        (${(entity.amount / 1000).toFixed(0)}K - {entity.percentage}%)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-2">
        {chartType === "radial" ? (
          // Radial Bar Chart
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[350px]"
          >
            <RadialBarChart
              data={[
                {
                  name: 'Budget',
                  allocated: data.allocated,
                  remaining: data.remaining
                }
              ]}
              endAngle={180}
              innerRadius={90}
              outerRadius={140}
            >
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value: any) => [`$${(typeof value === 'number' ? value : 0).toLocaleString()}`, '']}
                  />
                }
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <RechartsLabel
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const percentage = data.percentageUsed
                      
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {percentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground text-xs"
                          >
                            {t("annual_budget.charts.budget_distribution.label.percentage_text")}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs font-medium"
                          >
                            ${(data.allocated / 1000).toFixed(0)}K / ${(data.total / 1000).toFixed(0)}K
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="allocated"
                stackId="a"
                cornerRadius={5}
                fill="var(--color-allocated)"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="remaining"
                fill="var(--color-remaining)"
                stackId="a"
                cornerRadius={5}
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        ) : (
          // Pie Chart
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[350px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieChartData}
                dataKey="amount"
                nameKey="name"
                innerRadius={70}
                outerRadius={120}
                strokeWidth={5}
                activeIndex={activeIndex}
                onClick={(data, index) => {
                  // Allow clicking on pie sectors to select them
                  if (data && data.name) {
                    setActiveEntity(data.name)
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
                <RechartsLabel
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const activeData = pieChartData[activeIndex]
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
                            className="fill-foreground text-2xl font-bold"
                          >
                            ${(activeData.amount / 1000).toFixed(0)}K
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-muted-foreground text-xs"
                          >
                            {activeData.name}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 36}
                            className="fill-muted-foreground text-xs font-medium"
                          >
                            {activeData.percentage}% of total
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs pt-2">
        {/* Minimalist footer - only show total values */}
        <div className="w-full flex items-center justify-between text-xs border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Budget</span>
          </div>
          <span className="font-semibold text-gray-900">
            ${data.total.toLocaleString()}
          </span>
        </div>
        
        {chartType === "radial" && (
          <>
            <div className="w-full flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[hsl(0,84%,60%)]"></div>
                <span className="text-muted-foreground">Allocated</span>
              </div>
              <span className="font-medium text-red-600">
                ${data.allocated.toLocaleString()}
              </span>
            </div>
            <div className="w-full flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[hsl(142,71%,45%)]"></div>
                <span className="text-muted-foreground">Available</span>
              </div>
              <span className="font-medium text-green-600">
                ${data.remaining.toLocaleString()}
              </span>
            </div>
          </>
        )}
        
        {chartType === "pie" && (
          <div className="w-full flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Selected: {activeEntity}</span>
            </div>
            <span className="font-medium">
              ${pieChartData.find(e => e.name === activeEntity)?.amount.toLocaleString()} 
              <span className="text-muted-foreground ml-1">
                ({pieChartData.find(e => e.name === activeEntity)?.percentage}%)
              </span>
            </span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
