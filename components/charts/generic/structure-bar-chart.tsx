"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from "recharts"
import { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export interface StructureBarChartData {
  name: string
  count: number
  fill?: string
}

export interface StructureBarChartProps {
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
  data: StructureBarChartData[]
  
  /**
   * Whether the chart is loading
   */
  loading?: boolean
  
  /**
   * Chart layout orientation
   * @default "vertical"
   */
  layout?: "horizontal" | "vertical"
  
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
   * Data key for the value
   * @default "count"
   */
  dataKey?: string
  
  /**
   * Label for the data key (used in tooltip)
   * @default "Count"
   */
  dataKeyLabel?: string
}

/**
 * StructureBarChart Component
 * 
 * A reusable bar chart component for visualizing organizational structure data.
 * Supports both horizontal and vertical orientations.
 * 
 * @example
 * ```tsx
 * <StructureBarChart
 *   title="Structure Overview"
 *   description="Quantitative breakdown"
 *   icon={Building2}
 *   data={[
 *     { name: 'Institutions', count: 5, fill: '#3b82f6' },
 *     { name: 'Regions', count: 12, fill: '#10b981' }
 *   ]}
 *   footer={<div>Total entities: 17</div>}
 * />
 * ```
 */
export function StructureBarChart({
  title,
  description,
  icon: Icon,
  data,
  loading = false,
  layout = "vertical",
  height = 300,
  footer,
  dataKey = "count",
  dataKeyLabel = "Count"
}: StructureBarChartProps) {
  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          {description && <Skeleton className="h-4 w-64 mt-2" />}
        </CardHeader>
        <CardContent className="flex-1">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={{
            [dataKey]: {
              label: dataKeyLabel,
              color: "var(--chart-2)"
            },
            label: {
              color: "var(--background)"
            }
          }}
          className="h-full w-full"
        >
          <BarChart 
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
            accessibilityLayer
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis 
              dataKey={dataKey} 
              type="number" 
              hide 
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar 
              dataKey={dataKey}
              layout="vertical"
              fill={`var(--color-${dataKey})`}
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey={dataKey}
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {footer && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}
