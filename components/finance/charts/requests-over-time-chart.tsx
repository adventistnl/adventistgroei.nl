"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { DollarSign } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface RequestsOverTimeChartProps {
  data?: any[]
  loading?: boolean
  selectedYear?: number
}

const chartConfig = {
  approved: {
    label: "Approved",
    color: "hsl(142, 71%, 45%)",
  },
  pending: {
    label: "Pending",
    color: "hsl(43, 96%, 56%)",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export function RequestsOverTimeChart({ 
  data, 
  loading, 
  selectedYear = new Date().getFullYear() 
}: RequestsOverTimeChartProps) {
  const { formatCurrency } = useCurrency()
  const [selectedQuarter, setSelectedQuarter] = React.useState<"all" | "q1" | "q2" | "q3" | "q4">("all")

  const chartData = React.useMemo(() => {
    // Use data from props if available, otherwise return empty array
    if (!data || data.length === 0) {
      return []
    }
    
    return data
  }, [data])

  const filteredData = React.useMemo(() => {
    if (selectedQuarter === "all") return chartData
    const quarterNum = parseInt(selectedQuarter.charAt(1))
    return chartData.filter(item => item.quarter === quarterNum)
  }, [chartData, selectedQuarter])

  const totals = React.useMemo(() => {
    return filteredData.reduce((acc, month) => ({
      approved: acc.approved + month.approved,
      pending: acc.pending + month.pending,
      rejected: acc.rejected + month.rejected,
      total: acc.total + month.approved + month.pending + month.rejected
    }), { approved: 0, pending: 0, rejected: 0, total: 0 })
  }, [filteredData])

  const approvalRate = totals.total > 0 
    ? Math.round((totals.approved / totals.total) * 100) 
    : 0

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-64 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            Requests Over Time
          </CardTitle>
          <CardDescription>
            Monthly subsidy request status - {selectedYear}
          </CardDescription>
        </div>
        
        {/* Quarter Filter Toggle */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={selectedQuarter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('all')}
            className="h-7 px-3 text-xs"
          >
            All
          </Button>
          <Button
            variant={selectedQuarter === 'q1' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q1')}
            className="h-7 px-3 text-xs"
          >
            Q1
          </Button>
          <Button
            variant={selectedQuarter === 'q2' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q2')}
            className="h-7 px-3 text-xs"
          >
            Q2
          </Button>
          <Button
            variant={selectedQuarter === 'q3' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q3')}
            className="h-7 px-3 text-xs"
          >
            Q3
          </Button>
          <Button
            variant={selectedQuarter === 'q4' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q4')}
            className="h-7 px-3 text-xs"
          >
            Q4
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="approved"
              stackId="a"
              fill="var(--color-approved)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill="var(--color-pending)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="rejected"
              stackId="a"
              fill="var(--color-rejected)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Approval rate: {approvalRate}% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total requests: {totals.total} ({totals.approved} approved, {totals.pending} pending, {totals.rejected} rejected)
        </div>
      </CardFooter>
    </Card>
  )
}
