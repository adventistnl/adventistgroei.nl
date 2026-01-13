"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Pie, PieChart, Label, Sector, Cell } from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useChartColors, CHART_PRESETS } from "@/lib/chart-colors"
import { InstitutionById_institution_institutionChartsData_usersByRole } from "@/types/InstitutionById"

interface UsersByRoleChartProps {
  data?: InstitutionById_institution_institutionChartsData_usersByRole[]
  monthlyUserGrowth?: number | null
  loading?: boolean
}

export function UsersByRoleChart({ data, monthlyUserGrowth, loading }: UsersByRoleChartProps) {
  const id = "users-by-role"
  const { theme } = useChartColors()
  const [activeView, setActiveView] = React.useState<'bar' | 'pie'>('bar')
  const [activeRole, setActiveRole] = React.useState("All")

  // Dynamic color generation function for roles
  const getRoleColors = React.useCallback(() => {
    return {
      admin: '#ef4444',        // Red
      finance_manager: '#f59e0b', // Amber
      department_head: '#3b82f6', // Blue
      church_leader: '#10b981',   // Green
      volunteer: '#8b5cf6',       // Violet
    }
  }, [])

  const roleColors = getRoleColors()

  // Dados mockados: Usuários por role com cores dinâmicas
  const mockData = [
    { role: "admin", count: 12, fill: roleColors.admin },
    { role: "finance_manager", count: 28, fill: roleColors.finance_manager },
    { role: "department_head", count: 45, fill: roleColors.department_head },
    { role: "church_leader", count: 89, fill: roleColors.church_leader },
    { role: "volunteer", count: 156, fill: roleColors.volunteer },
  ]

  const chartConfig = {
    count: {
      label: "Users",
    },
    admin: {
      label: "Administrator",
      color: roleColors.admin,
    },
    finance_manager: {
      label: "Finance Manager",
      color: roleColors.finance_manager,
    },
    department_head: {
      label: "Department Head",
      color: roleColors.department_head,
    },
    church_leader: {
      label: "Church Leader",
      color: roleColors.church_leader,
    },
    volunteer: {
      label: "Volunteer",
      color: roleColors.volunteer,
    },
  } satisfies ChartConfig

  // Merge backend data with colors
  const chartData = React.useMemo(() => {
    if (data && data.length > 0) {
      return data.map(item => ({
        ...item,
        fill: roleColors[item.role as keyof typeof roleColors] || '#6b7280'
      }))
    }
    return mockData
  }, [data, mockData, roleColors])

  const activeIndex = React.useMemo(
    () => activeRole === "All" ? -1 : chartData.findIndex((item: any) => item.role === activeRole),
    [activeRole, chartData]
  )

  const roleKeys = React.useMemo(() => chartData.map((item: any) => item.role), [chartData])

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

  const totalUsers = chartData.reduce((sum: number, item: any) => sum + item.count, 0)
  const growthPercentage = monthlyUserGrowth ?? 8.4 // Fallback to mock value if not provided

  return (
    <Card data-chart={id} className="h-full flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="auto-rows-min grid-rows-[auto_auto] flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row justify-between ">
          <div>    
            <CardTitle>Users by Role</CardTitle>
            <CardDescription>Distribution across all user types</CardDescription>
          </div>
              <div className="flex items-center gap-2">
                {/* Role Selector - Only show in Pie view */}
                {activeView === 'pie' && (
                  <Select value={activeRole} onValueChange={setActiveRole}>
                    <SelectTrigger
                      className="h-7 w-[160px] rounded-lg pl-2.5"
                      aria-label="Select a role"
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                      <SelectItem value="All" className="rounded-lg [&_span]:flex">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="flex h-3 w-3 shrink-0 rounded-xs bg-gradient-to-r from-red-500 via-amber-500 via-blue-500 via-green-500 to-violet-500" />
                          All Roles
                        </div>
                      </SelectItem>
                      {roleKeys.map((key: any) => {
                        const config = chartConfig[key as keyof typeof chartConfig]
                        if (!config) return null

                        return (
                          <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
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
                )}
                
                {/* View Switcher Tabs - Right aligned */}
                <Tabs value={activeView} onValueChange={(v: any) => setActiveView(v as 'bar' | 'pie')}>
                  <TabsList className="grid w-full grid-cols-2 h-7 bg-black/5 dark:bg-white/5">
                    <TabsTrigger 
                      value="bar" 
                      className="text-xs data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                    >
                      Bar
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pie" 
                      className="text-xs data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
                    >
                      Pie
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
          </div>
          
    
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        {activeView === 'bar' ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="role"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar 
                dataKey="count" 
                layout="vertical" 
                radius={4}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="role"
                  position="insideLeft"
                  offset={8}
                  style={{ fill: '#ffffff' }}
                  fontSize={12}
                  fontWeight={500}
                  formatter={(value: any) => {
                    const config = chartConfig[value as keyof typeof chartConfig]
                    return config?.label || value
                  }}
                />
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  style={{ fill: 'hsl(var(--foreground))' }}
                  fontSize={12}
                  fontWeight={500}
                  formatter={(value: any) => Number(value).toLocaleString()}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
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
                dataKey="count"
                nameKey="role"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeRole === "All" ? undefined : activeIndex}
                onClick={(data: any) => {
                  if (data && data.role) {
                    setActiveRole(data.role)
                  }
                }}
                activeShape={activeRole === "All" ? undefined : ({
                  outerRadius = 0,
                  fill: fillColor,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} fill={fillColor} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      fill={fillColor}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const activeData = activeRole === "All" ? null : chartData?.[activeIndex]
                      const displayValue = activeRole === "All" ? totalUsers : (activeData?.count || 0)
                      const displayLabel = activeRole === "All" ? "Total" : "Users"
                      
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
                            {displayValue.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {displayLabel}
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
      <CardFooter className="flex-col  border-t items-start gap-2 text-sm">
        {activeView === 'pie' && activeRole !== "All" ? (
          <>
            <div className="flex gap-2 leading-none font-medium">
              {chartConfig[activeRole as keyof typeof chartConfig]?.label || activeRole}: {chartData[activeIndex]?.count || 0} ({totalUsers > 0 ? Math.round(((chartData[activeIndex]?.count || 0) / totalUsers) * 100) : 0}%)
            </div>
            <div className="text-muted-foreground leading-none">
              Total users: {totalUsers.toLocaleString()}
            </div>
          </>
        ) : (
          <>
            {monthlyUserGrowth !== null && monthlyUserGrowth !== undefined ? (
              <div className="flex gap-2 leading-none font-medium">
                Trending up by {growthPercentage}% this month <TrendingUp className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex gap-2 leading-none font-medium text-muted-foreground">
                Growth data not available
              </div>
            )}
            <div className="text-muted-foreground leading-none">
              Total users: {totalUsers.toLocaleString()}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
