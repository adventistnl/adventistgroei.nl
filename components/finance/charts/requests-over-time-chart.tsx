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
  translations?: {
    title: string
    description: string
    quarterFilters: {
      all: string
      q1: string
      q2: string
      q3: string
      q4: string
    }
    footer: {
      approvalRate: string
      totalRequests: string
      approved: string
      pending: string
      rejected: string
      in_review: string
    }
    statusLabels: {
      approved: string
      pending: string
      rejected: string
    }
  }
}

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(43, 96%, 56%)",
  },
  in_review: {
    label: "In Review",
    color: "hsl(217, 91%, 60%)",
  },
  approved: {
    label: "Approved",
    color: "hsl(142, 71%, 45%)",
  },
  closed: {
    label: "Closed",
    color: "hsl(158, 64%, 52%)",
  },
  rejected: {
    label: "Rejected",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig

export function RequestsOverTimeChart({ 
  data, 
  loading, 
  selectedYear = new Date().getFullYear(),
  translations
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
      pending: acc.pending + (month.pending || 0),
      in_review: acc.in_review + (month.in_review || 0),
      approved: acc.approved + (month.approved || 0),
      closed: acc.closed + (month.closed || 0),
      rejected: acc.rejected + (month.rejected || 0),
      total: acc.total + (month.pending || 0) + (month.in_review || 0) + (month.approved || 0) + (month.closed || 0) + (month.rejected || 0)
    }), { pending: 0, in_review: 0, approved: 0, closed: 0, rejected: 0, total: 0 })
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
            {translations?.title || "Requests Over Time"}
          </CardTitle>
          <CardDescription>
            {translations?.description.replace('{{year}}', selectedYear.toString()) || `Monthly subsidy request status - ${selectedYear}`}
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
            {translations?.quarterFilters.all || "All"}
          </Button>
          <Button
            variant={selectedQuarter === 'q1' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q1')}
            className="h-7 px-3 text-xs"
          >
            {translations?.quarterFilters.q1 || "Q1"}
          </Button>
          <Button
            variant={selectedQuarter === 'q2' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q2')}
            className="h-7 px-3 text-xs"
          >
            {translations?.quarterFilters.q2 || "Q2"}
          </Button>
          <Button
            variant={selectedQuarter === 'q3' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q3')}
            className="h-7 px-3 text-xs"
          >
            {translations?.quarterFilters.q3 || "Q3"}
          </Button>
          <Button
            variant={selectedQuarter === 'q4' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q4')}
            className="h-7 px-3 text-xs"
          >
            {translations?.quarterFilters.q4 || "Q4"}
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
              dataKey="pending"
              stackId="a"
              fill="var(--color-pending)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="in_review"
              stackId="a"
              fill="var(--color-in_review)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="approved"
              stackId="a"
              fill="var(--color-approved)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="closed"
              stackId="a"
              fill="var(--color-closed)"
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
          {translations?.footer.approvalRate || "Approval rate"}: {approvalRate}% <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {translations?.footer.totalRequests || "Total requests"}: {totals.total} ({totals.pending} {translations?.footer.pending || "pending"}, {totals.in_review} {translations?.footer.in_review || "in review"}, {totals.approved} {translations?.footer.approved || "approved"}, {totals.closed} closed, {totals.rejected} {translations?.footer.rejected || "rejected"})
        </div>
      </CardFooter>
    </Card>
  )
}
