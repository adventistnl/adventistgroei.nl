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
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { createPrivacyConfig } from "@/config/privacy-roles.config"
import { useComponentPrivacy } from "@/contexts/privacy-context"
import { PrivacyOverlay } from "@/components/shared/privacy-overlay"
import { Skeleton } from "@/components/ui/skeleton"
import { CurrencyConfig, formatCurrency } from "@/types/currency"

interface BudgetDistributionData {
  total: number
  spent: number
  allocated: number
  available: number
  percentageUsed: number
}

interface BudgetDistributionChartProps {
  data: BudgetDistributionData
  year: number
  currency: CurrencyConfig
}

// Department/Entity data for Pie Chart
interface EntityBudgetData {
  name: string
  amount: number
  percentage: number
  fill: string
}

const chartConfig = {
  spent: {
    label: "Spent (Used)",
    color: "hsl(0, 84%, 60%)", // Red for spent
  },
  allocated: {
    label: "Allocated",
    color: "hsl(48, 96%, 53%)", // Yellow for allocated
  },
  available: {
    label: "Available",
    color: "hsl(142, 71%, 45%)", // Green for available
  },
}

const PRIVACY_CONFIG = createPrivacyConfig(
  'budget-distribution-chart',
  'FINANCIAL_DATA' // Uses DEV, ADMIN, FINANCE_MANAGER automatically
)

export function BudgetDistributionChart({ data, year, currency }: BudgetDistributionChartProps) {
  const { t } = useTranslation()
  const [chartType, setChartType] = useState<"radial" | "pie">("radial")
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)
  
  // Build PIE chart data - shows the same 3 categories as radial chart
  const pieChartData = useMemo(() => {
    const chartItems: EntityBudgetData[] = []

    // Add Spent (if > 0)
    if (data.spent > 0) {
      chartItems.push({
        name: "Spent (Used)",
        amount: data.spent,
        percentage: Math.round((data.spent / data.total) * 100),
        fill: "hsl(0, 84%, 60%)", // Red for spent
      })
    }

    // Add Allocated (if > 0)
    if (data.allocated > 0) {
      chartItems.push({
        name: "Allocated (Reserved)",
        amount: data.allocated,
        percentage: Math.round((data.allocated / data.total) * 100),
        fill: "hsl(48, 96%, 53%)", // Yellow for allocated
      })
    }

    // Add Available (if > 0)
    if (data.available > 0) {
      chartItems.push({
        name: "Available",
        amount: data.available,
        percentage: Math.round((data.available / data.total) * 100),
        fill: "hsl(142, 71%, 45%)", // Green for available
      })
    }

    // If no items, show placeholder
    if (chartItems.length === 0) {
      return [{
        name: "No Data",
        amount: 0,
        percentage: 0,
        fill: "hsl(0, 0%, 80%)",
      }]
    }

    return chartItems
  }, [data.spent, data.allocated, data.available, data.total])

  const [activeEntity, setActiveEntity] = useState<string>("")

  // Set initial active entity when data loads
  React.useEffect(() => {
    if (pieChartData.length > 0 && !activeEntity) {
      setActiveEntity(pieChartData[0].name)
    }
  }, [pieChartData, activeEntity])

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
          
          <div className="flex items-center gap-2">
            {/* Toggle Button */}
            <div className="flex items-center border border-border rounded-lg p-1 bg-muted">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChartType("radial")}
                className={cn(
                  "h-7 px-2 rounded-md transition-all text-xs",
                  chartType === "radial"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
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
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                <PieChartIcon className="w-3.5 h-3.5 mr-1" />
                Pie
              </Button>
            </div>
            <InlinePrivacyToggle 
              config={PRIVACY_CONFIG} 
              className="privacy-toggle-button-header flex-shrink-0" 
            />
          </div>
        </div>
        
        {/* Department/Entity Selector for Pie Chart */}
        {chartType === "pie" && pieChartData.length > 0 && pieChartData[0].name !== "No Data" && (
          <div className="w-full mt-3">
            <Select value={activeEntity} onValueChange={setActiveEntity}>
              <SelectTrigger
                className="ml-auto h-7 w-full rounded-lg pl-2.5"
                aria-label="Select a department"
              >
                <SelectValue placeholder="Select department" />
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
                        className="flex h-3 w-3 shrink-0 rounded-xs"
                        style={{ backgroundColor: entity.fill }}
                      />
                      <span className="font-medium">{entity.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      {isHidden ? (
        <PrivacyOverlay height="300px" blurIntensity="medium">
          {/* Skeleton Customizado */}
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-64 w-full" />
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-2 justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </PrivacyOverlay>
      ) : (
        <>
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
                      spent: data.spent,
                      allocated: data.allocated,
                      available: data.available
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
                        formatter={(value: any) => [formatCurrency(typeof value === 'number' ? value : 0, currency), '']}
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
                                {formatCurrency(data.spent + data.allocated, currency, { compact: true })} / {formatCurrency(data.total, currency, { compact: true })}
                              </tspan>
                            </text>
                          )
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  <RadialBar
                    dataKey="spent"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-spent)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="allocated"
                    stackId="a"
                    cornerRadius={5}
                    fill="var(--color-allocated)"
                    className="stroke-transparent stroke-2"
                  />
                  <RadialBar
                    dataKey="available"
                    fill="var(--color-available)"
                    stackId="a"
                    cornerRadius={5}
                    className="stroke-transparent stroke-2"
                  />
                </RadialBarChart>
              </ChartContainer>
            ) : (
              // Pie Chart - Shows departments and available budget
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-w-[300px]"
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
                    innerRadius={60}
                    strokeWidth={5}
                    activeIndex={activeIndex}
                    onClick={(data) => {
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
                                className="fill-foreground text-3xl font-bold"
                              >
                                {formatCurrency(activeData.amount, currency, { compact: true })}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                {activeData.name === "Available" ? "Available Budget" : activeData.name}
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
          
          <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
            {/* Minimalist footer - show total and selected entity */}
            <div className="w-full flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">
                  {chartType === "radial" ? "Total Budget" : "Total Institution Budget"}
                </span>
              </div>
              <span className="font-semibold text-foreground">
                {formatCurrency(data.total, currency)}
              </span>
            </div>
            
            {chartType === "radial" && (
              <>
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[hsl(0,84%,60%)]" />
                    <span className="text-muted-foreground">Spent (Used)</span>
                  </div>
                  <span className="font-medium text-red-600">
                    {formatCurrency(data.spent, currency)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[hsl(48,96%,53%)]" />
                    <span className="text-muted-foreground">Allocated (Reserved)</span>
                  </div>
                  <span className="font-medium text-yellow-600">
                    {formatCurrency(data.allocated, currency)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[hsl(142,71%,45%)]" />
                    <span className="text-muted-foreground">Available</span>
                  </div>
                  <span className="font-medium text-green-600">
                    {formatCurrency(data.available, currency)}
                  </span>
                </div>
              </>
            )}
            
            {chartType === "pie" && pieChartData[0]?.name !== "No Data" && (
              <div className="w-full flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: pieChartData[activeIndex]?.fill }}
                  />
                  <span className="text-muted-foreground">
                    Selected: {pieChartData[activeIndex]?.name === "Available" 
                      ? "Available Budget" 
                      : pieChartData[activeIndex]?.name}
                  </span>
                </div>
                <span className="font-medium">
                  {formatCurrency(pieChartData[activeIndex]?.amount || 0, currency)}
                  <span className="text-muted-foreground ml-1">
                    ({pieChartData[activeIndex]?.percentage}%)
                  </span>
                </span>
              </div>
            )}
          </CardFooter>
        </>
      )}
    </Card>
  )
}
