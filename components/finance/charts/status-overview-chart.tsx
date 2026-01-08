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
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface StatusOverviewChartProps {
  data?: Array<{ status: string; count: number; fill: string }>
  loading?: boolean
}

export function StatusOverviewChart({ data, loading }: StatusOverviewChartProps) {
  const id = "status-overview"

  const chartData = data || [
    { status: 'Pending', count: 0, fill: '#f59e0b' },
    { status: 'In Review', count: 0, fill: '#3b82f6' },
    { status: 'Approved', count: 0, fill: '#10b981' },
    { status: 'Closed', count: 0, fill: '#059669' },
    { status: 'Rejected', count: 0, fill: '#ef4444' }
  ]

  const hasData = chartData.length > 0 && chartData.some(item => item.count > 0)

  const statusIcons = {
    'Pending': Clock,
    'In Review': AlertCircle,
    'Approved': CheckCircle,
    'Closed': CheckCircle,
    'Rejected': XCircle
  }

  // Generate chart config dynamically
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: "Requests",
        color: "hsl(0, 0%, 50%)"
      }
    }
    
    chartData.forEach((item) => {
      const statusKey = item.status.toLowerCase().replace(' ', '_')
      config[statusKey] = {
        label: item.status,
        color: item.fill,
        icon: statusIcons[item.status as keyof typeof statusIcons]
      }
    })
    
    return config satisfies ChartConfig
  }, [chartData])

  const [activeStatus, setActiveStatus] = React.useState("All")

  const activeIndex = React.useMemo(
    () => activeStatus === "All" ? -1 : (hasData ? chartData.findIndex((item) => item.status === activeStatus) : 0),
    [activeStatus, chartData, hasData]
  )

  const statusKeys = React.useMemo(() => hasData ? chartData.map((item) => item.status) : [], [chartData, hasData])

  const totalRequests = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.count, 0)
  }, [chartData])

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

  return (
    <Card data-chart={id} className="h-full flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1 flex-1">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-gray-600" />
            Status Overview
          </CardTitle>
          <CardDescription>
            Distribution of requests by current status
          </CardDescription>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label="Select a status"
          >
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            <SelectItem
              value="All"
              className="rounded-lg [&_span]:flex"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="flex h-3 w-3 shrink-0 rounded-xs bg-gradient-to-r from-amber-500 via-green-500 to-blue-500" />
                All Status
              </div>
            </SelectItem>
            {statusKeys.map((key) => {
              const config = chartConfig[key.toLowerCase().replace(' ', '_') as keyof typeof chartConfig]
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
                        backgroundColor: `var(--color-${key.toLowerCase().replace(' ', '_')})`,
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
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeStatus === "All" ? undefined : activeIndex}
              onClick={(data) => {
                if (data && data.status) {
                  setActiveStatus(data.status)
                }
              }}
              activeShape={activeStatus === "All" ? undefined : ({
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
                    const activeData = activeStatus === "All" ? null : chartData?.[activeIndex]
                    const displayValue = activeStatus === "All" ? totalRequests : (activeData?.count || 0)
                    const displayLabel = activeStatus === "All" ? "Total" : "Requests"
                    
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
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Total: {totalRequests.toLocaleString()} requests
        </div>
        {activeStatus === "All" ? (
          <div className="leading-none text-muted-foreground">
            Showing all status distributions
          </div>
        ) : (
          <div className="leading-none text-muted-foreground">
            {activeStatus}: {chartData[activeIndex]?.count || 0} ({totalRequests > 0 ? Math.round(((chartData[activeIndex]?.count || 0) / totalRequests) * 100) : 0}%)
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
