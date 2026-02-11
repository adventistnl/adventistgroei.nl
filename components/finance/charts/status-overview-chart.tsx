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
import { Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react"

interface StatusOverviewChartProps {
  data?: Array<{ status: string; count: number; fill: string }>
  loading?: boolean
  translations?: {
    title: string
    description: string
    allDescription: string
    selectStatus: string
    selectLabel: string
    requests: string
    total: string
    statusLabels: {
      pending: string
      in_review: string
      approved: string
      rejected: string
      closed: string
      advanced_closed: string
      waiting_refund: string
    }
  }
}

export function StatusOverviewChart({ data, loading, translations }: StatusOverviewChartProps) {
  const id = "status-overview"

  // Define all possible statuses with their default colors
  const allStatuses = [
    { status: 'Pending', fill: '#f59e0b' },
    { status: 'In Review', fill: '#3b82f6' },
    { status: 'Approved', fill: '#10b981' },
    { status: 'Rejected', fill: '#ef4444' },
    { status: 'Closed', fill: '#059669' },
    { status: 'Advanced Closed', fill: '#7c3aed' },
    { status: 'Waiting Refund', fill: '#f97316' }
  ]

  // Merge backend data with all statuses, ensuring all statuses appear
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      // No backend data, use defaults with sample counts
      return [
        { status: 'Pending', count: 0, fill: '#f59e0b' },
        { status: 'In Review', count: 0, fill: '#3b82f6' },
        { status: 'Approved', count: 0, fill: '#10b981' },
        { status: 'Closed', count: 0, fill: '#059669' },
        { status: 'Rejected', count: 0, fill: '#ef4444' },
        { status: 'Advanced Closed', count: 0, fill: '#7c3aed' },
        { status: 'Waiting Refund', count: 0, fill: '#f97316' }
      ]
    }

    // Backend data exists, merge with all statuses
    return allStatuses.map(statusDef => {
      // Try to find backend data with case-insensitive and format-flexible matching
      const backendData = data.find(d => {
        const backendStatus = d.status?.toLowerCase().replace(/[_\s]/g, '')
        const defStatus = statusDef.status.toLowerCase().replace(/[_\s]/g, '')
        return backendStatus === defStatus
      })
      
      return {
        status: statusDef.status,
        count: backendData?.count || 0,
        fill: backendData?.fill || statusDef.fill
      }
    })
  }, [data])

  const hasData = chartData.length > 0

  const statusIcons = {
    'Pending': Clock,
    'In Review': AlertCircle,
    'Approved': CheckCircle,
    'Closed': CheckCircle,
    'Rejected': XCircle,
    'Advanced Closed': CheckCircle,
    'Waiting Refund': Clock
  }

  // Generate chart config dynamically
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        color: "hsl(0, 0%, 50%)",
        label: translations?.requests || "Requests",
      }
    }
    
    chartData.forEach((item) => {
      const statusKey = item.status.toLowerCase().replace(' ', '_')
      
      // Map status to translation key
      let translatedLabel = item.status
      if (translations?.statusLabels) {
        const labelKey = statusKey as keyof typeof translations.statusLabels
        if (translations.statusLabels[labelKey]) {
          translatedLabel = translations.statusLabels[labelKey]
        }
      }
      
      config[statusKey] = {
        label: translatedLabel,
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
            {translations?.title || "Status Overview"}
          </CardTitle>
          <CardDescription>
            {translations?.description || "Distribution of requests by current status"}
          </CardDescription>
        </div>
        <Select value={activeStatus} onValueChange={setActiveStatus}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label={translations?.selectLabel || "Select a status"}
          >
            <SelectValue placeholder={translations?.selectStatus || "Select status"} />
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
                    const displayLabel = activeStatus === "All" ? translations?.total || "Total" : translations?.requests || "Requests"
                    
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
          {translations?.total || "Total"}: {totalRequests.toLocaleString()} {translations?.requests.toLowerCase() || "requests"}
        </div>
        {activeStatus === "All" ? (
          <div className="leading-none text-muted-foreground">
            {translations?.allDescription || "Showing all status distributions"}
          </div>
        ) : (
          <div className="leading-none text-muted-foreground">
            {chartConfig[activeStatus.toLowerCase().replace(' ', '_') as keyof typeof chartConfig]?.label || activeStatus}: {chartData[activeIndex]?.count || 0} ({totalRequests > 0 ? Math.round(((chartData[activeIndex]?.count || 0) / totalRequests) * 100) : 0}%)
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
