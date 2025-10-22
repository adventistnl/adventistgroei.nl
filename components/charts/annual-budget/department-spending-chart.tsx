"use client"

import React, { useMemo } from "react"
import { Building, TrendingUp } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { PrivacyOverlay } from "@/components/shared/privacy-overlay"
import { useComponentPrivacy } from "@/contexts/privacy-context"
import { createPrivacyConfig } from "@/config/privacy-roles.config"

interface DepartmentData {
  name: string
  planned: number
  approved: number
  reserved: number
  institution: string
}

interface DepartmentSpendingChartProps {
  data: DepartmentData[]
}

const chartConfig = {
  spent: {
    label: "Spent (Used)",
    color: "hsl(0, 84%, 60%)", // Red for spent/used
  },
  reserved: {
    label: "Reserved",
    color: "hsl(220, 13%, 69%)", // Gray for reserved
  },
  available: {
    label: "Available",
    color: "hsl(142, 71%, 45%)", // Green for available
  },
} satisfies ChartConfig

// Privacy configuration - Simple and dynamic!
// Option 1: Using preset (recommended)
const PRIVACY_CONFIG = createPrivacyConfig(
  'department-spending-chart',
  'FINANCIAL_DATA' // Uses DEV, ADMIN, FINANCE_MANAGER automatically
)

// Option 2: Using custom configuration (uncomment to use)
// const PRIVACY_CONFIG = createPrivacyConfig(
//   'department-spending-chart',
//   'confidential',
//   ['DEV', 'ADMIN'] // Only DEV and ADMIN can access
// )

export function DepartmentSpendingChart({ data }: DepartmentSpendingChartProps) {
  // Use privacy hook
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  // Transform data to stacked format
  const chartData = useMemo(() => {
    return data.map(dept => {
      // Spent = approved - reserved (what has been used)
      const spent = dept.approved - dept.reserved
      // Available = planned - approved (what's still available)
      const available = dept.planned - dept.approved
      
      return {
        department: dept.name,
        spent: spent > 0 ? spent : 0,
        reserved: dept.reserved,
        available: available > 0 ? available : 0,
        total: dept.planned
      }
    })
  }, [data])

  // Calculate totals for footer
  const totals = useMemo(() => {
    return chartData.reduce((acc, dept) => ({
      spent: acc.spent + dept.spent,
      reserved: acc.reserved + dept.reserved,
      available: acc.available + dept.available,
      total: acc.total + dept.total
    }), { spent: 0, reserved: 0, available: 0, total: 0 })
  }, [chartData])

  const utilizationRate = totals.total > 0 
    ? Math.round(((totals.spent + totals.reserved) / totals.total) * 100) 
    : 0

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Building className="w-4 h-4" />
              Institution Department Spending
            </CardTitle>
            <CardDescription className="text-xs">
              Budget allocation: Spent, Reserved, and Available per department
            </CardDescription>
          </div>
          
          {/* Privacy Toggle Button - ÚNICO BOTÃO */}
          <InlinePrivacyToggle 
            config={PRIVACY_CONFIG} 
            className="privacy-toggle-button-header flex-shrink-0" 
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 relative">
        {isHidden ? (
          // Privacy Mode: Usar PrivacyOverlay Component
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
            </div>
          </PrivacyOverlay>
        ) : (
          // Normal Mode: Show actual chart
          <ChartContainer 
            config={chartConfig}
            className="h-[300px] w-full"
          >
              <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={10}
                tickFormatter={(value) => value.length > 12 ? value.slice(0, 12) + '...' : value}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000)}K`} 
                fontSize={10}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent
                    hideLabel={false}
                    formatter={(value: any, name: any) => [
                      `$${(typeof value === 'number' ? value : 0).toLocaleString()}`,
                      chartConfig[name as keyof typeof chartConfig]?.label || name
                    ]}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="spent"
                stackId="a"
                fill="var(--color-spent)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="reserved"
                stackId="a"
                fill="var(--color-reserved)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="available"
                stackId="a"
                fill="var(--color-available)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-xs pt-4 border-t">
        {isHidden ? (
          // Privacy Mode: Show skeleton footer
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-48" />
            <div className="w-full grid grid-cols-3 gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          // Normal Mode: Show actual footer
          <>
            <div className="flex items-center gap-2 leading-none font-medium">
              Budget utilization: {utilizationRate}% <TrendingUp className="h-3 w-3" />
            </div>
            <div className="w-full grid grid-cols-3 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Spent</span>
                <span className="font-medium text-red-600">${(totals.spent / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Reserved</span>
                <span className="font-medium text-gray-600">${(totals.reserved / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Available</span>
                <span className="font-medium text-green-600">${(totals.available / 1000).toFixed(0)}K</span>
              </div>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
