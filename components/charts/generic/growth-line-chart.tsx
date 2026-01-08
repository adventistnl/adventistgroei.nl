"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"
import { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export interface GrowthLineChartData {
  [key: string]: string | number
}

export interface GrowthLineChartLine {
  dataKey: string
  label: string
  color: string
  strokeWidth?: number
}

export interface GrowthLineChartProps {
  /**
   * Chart title
   */
  title: string
  
  /**
   * Chart description
   */
  description?: string
  
  /**
   * Optional icon for the title
   */
  icon?: LucideIcon
  
  /**
   * Data to display in the chart
   */
  data: GrowthLineChartData[]
  
  /**
   * Lines to display on the chart
   */
  lines: GrowthLineChartLine[]
  
  /**
   * Whether the chart is loading
   */
  loading?: boolean
  
  /**
   * X-axis data key
   * @default "month"
   */
  xAxisKey?: string
  
  /**
   * Chart height
   * @default 300
   */
  height?: number
  
  /**
   * Footer content/message
   */
  footer?: React.ReactNode
  
  /**
   * Show legend
   * @default true
   */
  showLegend?: boolean
  
  /**
   * Line type
   * @default "monotone"
   */
  lineType?: "basis" | "basisClosed" | "basisOpen" | "linear" | "linearClosed" | "natural" | "monotoneX" | "monotoneY" | "monotone" | "step" | "stepBefore" | "stepAfter"
  
  /**
   * Enable dots on the lines
   * @default true
   */
  showDots?: boolean
}

/**
 * GrowthLineChart Component
 * 
 * A reusable line chart component for visualizing growth and trend data over time.
 * Supports multiple lines with customizable colors and labels.
 * 
 * @example
 * ```tsx
 * <GrowthLineChart
 *   title="User Growth Over Time"
 *   description="New user registrations throughout 2024"
 *   icon={TrendingUp}
 *   data={[
 *     { month: 'Jan', users: 100, newUsers: 20 },
 *     { month: 'Feb', users: 120, newUsers: 25 }
 *   ]}
 *   lines={[
 *     { dataKey: 'users', label: 'Total Users', color: '#3b82f6' },
 *     { dataKey: 'newUsers', label: 'New Users', color: '#10b981' }
 *   ]}
 *   footer={<div>Growth rate: 25%</div>}
 * />
 * ```
 */
export function GrowthLineChart({
  title,
  description,
  icon: Icon,
  data,
  lines,
  loading = false,
  xAxisKey = "month",
  height = 300,
  footer,
  showLegend = true,
  lineType = "monotone",
  showDots = true
}: GrowthLineChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          {description && <Skeleton className="h-4 w-64 mt-2" />}
        </CardHeader>
        <CardContent>
          <Skeleton className={`h-[${height}px] w-full`} />
        </CardContent>
      </Card>
    )
  }

  // Build chart config from lines
  const chartConfig = lines.reduce((config, line) => {
    config[line.dataKey] = {
      label: line.label,
      color: line.color
    }
    return config
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className={`h-[${height}px] w-full`}
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type={lineType}
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={line.strokeWidth || 2}
                dot={showDots ? { r: 4 } : false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
      {footer && (
        <CardFooter>
          <div className="text-sm text-muted-foreground w-full">
            {footer}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
