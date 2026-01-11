"use client"

import { TrendingUp, Building2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { LucideIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export interface UserDistributionBarChartData {
  name: string
  users: number
}

export interface UserDistributionBarChartProps {
  /**
   * Chart title
   */
  title?: string
  
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
  data: UserDistributionBarChartData[]
  
  /**
   * Whether the chart is loading
   */
  loading?: boolean
  
  /**
   * Footer content/message
   */
  footer?: React.ReactNode
}

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

/**
 * UserDistributionBarChart Component
 * 
 * A bar chart component for visualizing user distribution across institutions.
 * Features custom labels inside and outside bars for better readability.
 * 
 * @example
 * ```tsx
 * <UserDistributionBarChart
 *   title="User Distribution"
 *   description="Users distributed across institutions"
 *   icon={Building2}
 *   data={[
 *     { name: 'Institution A', users: 50 },
 *     { name: 'Institution B', users: 120 }
 *   ]}
 *   footer={<div>Total: 170 users</div>}
 * />
 * ```
 */
export function UserDistributionBarChart({
  title = "User Distribution",
  description = "Users distributed across institutions",
  icon: Icon = Building2,
  data,
  loading = false,
  footer
}: UserDistributionBarChartProps) {
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

  // Calculate total users
  const totalUsers = data.reduce((sum, item) => sum + item.users, 0)
  
  // Find institution with most users
  const topInstitution = data.reduce((max, item) => 
    item.users > max.users ? item : max
  , data[0] || { name: "", users: 0 })

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="users" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="users"
              layout="vertical"
              fill="var(--color-users)"
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
                dataKey="users"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      {footer ? (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footer}
        </CardFooter>
      ) : (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            {topInstitution.name} has the most users <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Total of {totalUsers} users across {data.length} institution{data.length !== 1 ? 's' : ''}
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
