"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
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
          config={{
            [dataKey]: {
              label: dataKeyLabel,
              color: "#3b82f6"
            }
          }}
          className={`h-[${height}px] w-full`}
        >
          <BarChart 
            data={data}
            layout={layout}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={layout === "vertical"}
              vertical={layout === "horizontal"}
            />
            {layout === "vertical" ? (
              <>
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100}
                  tickLine={false}
                  axisLine={false}
                />
              </>
            ) : (
              <>
                <XAxis dataKey="name" />
                <YAxis />
              </>
            )}
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey={dataKey}
              radius={layout === "vertical" ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            />
          </BarChart>
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
