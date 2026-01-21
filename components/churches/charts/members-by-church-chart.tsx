"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TrendingUp, Users } from "lucide-react"
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
import { getProjectColor } from "@/lib/chart-colors"
import { churchTranslations } from "@/lib/translations/churches"

interface MembersByChurchChartProps {
  churches?: any[]
  loading?: boolean
  title?: string
  description?: string
  selectedYear?: number
}

export function MembersByChurchChart({ 
  churches = [],
  loading,
  title,
  description,
  selectedYear = new Date().getFullYear()
}: MembersByChurchChartProps) {
  const { i18n } = useTranslation()
  const [selectedQuarter, setSelectedQuarter] = useState<"all" | "q1" | "q2" | "q3" | "q4">("all")
  
  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  // Filter active churches
  const activeChurches = useMemo(() => 
    churches.filter(church => !church.is_deleted),
    [churches]
  )
  
  // Process data: Group members by month and church based on created_at
  const processedData = useMemo(() => {
    if (!activeChurches || activeChurches.length === 0) return []
    
    // Define all months
    const months = [
      { key: 'jan', label: 'January', quarter: 1 },
      { key: 'feb', label: 'February', quarter: 1 },
      { key: 'mar', label: 'March', quarter: 1 },
      { key: 'apr', label: 'April', quarter: 2 },
      { key: 'may', label: 'May', quarter: 2 },
      { key: 'jun', label: 'June', quarter: 2 },
      { key: 'jul', label: 'July', quarter: 3 },
      { key: 'aug', label: 'August', quarter: 3 },
      { key: 'sep', label: 'September', quarter: 3 },
      { key: 'oct', label: 'October', quarter: 4 },
      { key: 'nov', label: 'November', quarter: 4 },
      { key: 'dec', label: 'December', quarter: 4 }
    ]
    
    // Initialize data structure
    const monthlyData = months.map(month => {
      const dataPoint: any = { 
        month: month.label,
        quarter: month.quarter
      }
      
      // Initialize each church with 0
      activeChurches.forEach(church => {
        dataPoint[church.id] = 0
      })
      
      return dataPoint
    })
    
    // Count members by month for each church
    activeChurches.forEach(church => {
      const members = church.users || []
      
      members.forEach((user: any) => {
        if (!user.created_at) return
        
        const createdDate = new Date(user.created_at)
        const createdYear = createdDate.getFullYear()
        
        // Only count members created in the selected year
        if (createdYear !== selectedYear) return
        
        const createdMonth = createdDate.getMonth() // 0-11
        
        // Increment the count for this church in this month
        if (monthlyData[createdMonth]) {
          monthlyData[createdMonth][church.id] += 1
        }
      })
    })
    
    return monthlyData
  }, [activeChurches, selectedYear])
  
  // Filter data by selected quarter
  const filteredData = useMemo(() => {
    if (selectedQuarter === "all") return processedData
    const quarterNum = parseInt(selectedQuarter.charAt(1))
    return processedData.filter(item => item.quarter === quarterNum)
  }, [processedData, selectedQuarter])
  
  // Create chart config with colors from getProjectColor
  const chartConfig = useMemo(() => {
    const config: any = {}
    
    activeChurches.forEach((church, index) => {
      config[church.id] = {
        label: church.name,
        color: getProjectColor(index)
      }
    })
    
    return config as ChartConfig
  }, [activeChurches])
  
  // Calculate totals for footer
  const totals = useMemo(() => {
    const churchTotals: Record<string, number> = {}
    let grandTotal = 0
    
    filteredData.forEach(monthData => {
      activeChurches.forEach(church => {
        const count = monthData[church.id] || 0
        churchTotals[church.id] = (churchTotals[church.id] || 0) + count
        grandTotal += count
      })
    })
    
    return { churchTotals, grandTotal }
  }, [filteredData, activeChurches])
  
  // Find top church
  const topChurch = useMemo(() => {
    if (activeChurches.length === 0) return null
    
    let maxCount = 0
    let topChurch = activeChurches[0]
    
    Object.entries(totals.churchTotals).forEach(([churchId, count]) => {
      if (count > maxCount) {
        maxCount = count
        topChurch = activeChurches.find(c => c.id === churchId) || topChurch
      }
    })
    
    return { church: topChurch, count: maxCount }
  }, [activeChurches, totals])
  
  if (loading) {
    return (
      <Card className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-4 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-muted rounded animate-pulse" />
              <div className="h-6 bg-muted rounded w-48 animate-pulse" />
            </div>
            <div className="h-4 bg-muted rounded w-64 animate-pulse mt-2" />
          </div>
          
          {/* Quarter Filter Skeleton */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-7 w-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-1 pt-6">
          <div className="h-[300px] bg-muted rounded animate-pulse" />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
          <div className="h-4 bg-muted rounded w-40 animate-pulse" />
          <div className="h-4 bg-muted rounded w-56 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </CardFooter>
      </Card>
    )
  }
  
  if (activeChurches.length === 0) {
    return (
      <Card className="h-full flex flex-col min-h-[500px]">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-4 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-600" />
              {title || tChurch.charts.membersByChurch.title}
            </CardTitle>
            <CardDescription>
              {description || `${tChurch.charts.membersByChurch.description} - ${selectedYear}`}
            </CardDescription>
          </div>
          
          {/* Quarter Filter (disabled state) */}
          <div className="flex items-center gap-1 border rounded-md p-1 opacity-50">
            <Button
              variant='ghost'
              size="sm"
              disabled
              className="h-7 px-3 text-xs"
            >
              {tChurch.charts.membersByChurch.filters.all}
            </Button>
            <Button
              variant='ghost'
              size="sm"
              disabled
              className="h-7 px-3 text-xs"
            >
              {tChurch.charts.membersByChurch.filters.q1}
            </Button>
            <Button
              variant='ghost'
              size="sm"
              disabled
              className="h-7 px-3 text-xs"
            >
              {tChurch.charts.membersByChurch.filters.q2}
            </Button>
            <Button
              variant='ghost'
              size="sm"
              disabled
              className="h-7 px-3 text-xs"
            >
              {tChurch.charts.membersByChurch.filters.q3}
            </Button>
            <Button
              variant='ghost'
              size="sm"
              disabled
              className="h-7 px-3 text-xs"
            >
              {tChurch.charts.membersByChurch.filters.q4}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center py-12">
          <div className="text-center max-w-md space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-muted p-6">
                <Users className="w-16 h-16 text-muted-foreground/40" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {tChurch.charts.membersByChurch.noData.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tChurch.charts.membersByChurch.noData.description}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1 text-sm border-t pt-4">
          <div className="flex gap-2 font-medium text-muted-foreground">
            0 {tChurch.charts.membersByChurch.footer.newMembers}
          </div>
          <div className="text-muted-foreground">
            {tChurch.charts.membersByChurch.footer.yearView} • 0 {tChurch.charts.membersByChurch.footer.churches}
          </div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col min-h-[500px]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b pb-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            {title || tChurch.charts.membersByChurch.title}
          </CardTitle>
          <CardDescription>
            {description || `${tChurch.charts.membersByChurch.description} - ${selectedYear}`}
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
            {tChurch.charts.membersByChurch.filters.all}
          </Button>
          <Button
            variant={selectedQuarter === 'q1' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q1')}
            className="h-7 px-3 text-xs"
          >
            {tChurch.charts.membersByChurch.filters.q1}
          </Button>
          <Button
            variant={selectedQuarter === 'q2' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q2')}
            className="h-7 px-3 text-xs"
          >
            {tChurch.charts.membersByChurch.filters.q2}
          </Button>
          <Button
            variant={selectedQuarter === 'q3' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q3')}
            className="h-7 px-3 text-xs"
          >
            {tChurch.charts.membersByChurch.filters.q3}
          </Button>
          <Button
            variant={selectedQuarter === 'q4' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedQuarter('q4')}
            className="h-7 px-3 text-xs"
          >
            {tChurch.charts.membersByChurch.filters.q4}
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
            {activeChurches.map((church, index) => (
              <Bar
                key={church.id}
                dataKey={church.id}
                stackId="a"
                fill={getProjectColor(index)}
                radius={index === activeChurches.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm border-t pt-4">
        <div className="flex gap-2 font-medium text-foreground">
          {totals.grandTotal} {tChurch.charts.membersByChurch.footer.newMembers} <TrendingUp className="h-4 w-4" />
        </div>
        {topChurch && topChurch.count > 0 && (
          <div className="text-muted-foreground">
            {tChurch.charts.membersByChurch.footer.top}: {topChurch.church.name} ({topChurch.count} {tChurch.charts.membersByChurch.footer.members})
          </div>
        )}
        <div className="text-muted-foreground">
          {selectedQuarter === 'all' ? tChurch.charts.membersByChurch.footer.yearView : `${tChurch.charts.membersByChurch.filters[selectedQuarter]}`} • {activeChurches.length} {tChurch.charts.membersByChurch.footer.churches}
        </div>
      </CardFooter>
    </Card>
  )
}
