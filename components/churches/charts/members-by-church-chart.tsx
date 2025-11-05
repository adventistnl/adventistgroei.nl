"use client"

import React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Users } from "lucide-react"

interface MembersByChurchChartProps {
  data?: any[]
  loading?: boolean
  title?: string
  description?: string
  mode?: 'churches' | 'departments'
}

export function MembersByChurchChart({ 
  data, 
  loading,
  title,
  description,
  mode = 'churches'
}: MembersByChurchChartProps) {
  // Mock data: Members by church
  const mockMembersData = [
    { 
      church: "Central SP",
      fullName: "Igreja Central de São Paulo",
      members: 450,
      activeMembers: 420,
      fill: "#3b82f6" // blue
    },
    { 
      church: "Campinas",
      fullName: "Igreja de Campinas",
      members: 380,
      activeMembers: 350,
      fill: "#8b5cf6" // purple
    },
    { 
      church: "Rio",
      fullName: "Igreja do Rio de Janeiro",
      members: 320,
      activeMembers: 295,
      fill: "#ef4444" // red
    },
    { 
      church: "Vila Madalena",
      fullName: "Igreja de Vila Madalena",
      members: 280,
      activeMembers: 260,
      fill: "#10b981" // green
    },
    { 
      church: "Mooca",
      fullName: "Igreja da Mooca",
      members: 220,
      activeMembers: 200,
      fill: "#f59e0b" // orange
    },
  ]

  const itemKey = mode === 'departments' ? 'department' : 'church'
  
  const chartData = data || mockMembersData

  const chartConfig = React.useMemo(() => {
    const config: any = { 
      members: { label: "Members" }
    }
    
    chartData.forEach((item: any) => {
      const key = mode === 'departments' ? item.department : item.church
      config[key] = {
        label: item.fullName || key,
        color: item.fill
      }
    })
    
    return config as ChartConfig
  }, [chartData, mode])

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

  const totalMembers = chartData.reduce((sum, item) => sum + item.members, 0)
  const totalActiveMembers = chartData.reduce((sum, item) => sum + item.activeMembers, 0)
  const activePercentage = Math.round((totalActiveMembers / totalMembers) * 100)
  const topChurch = chartData[0] // Already sorted by members desc

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {title || (mode === 'departments' ? 'Membros por Departamento' : 'Membros por Igreja')}
        </CardTitle>
        <CardDescription>
          {description || (mode === 'departments' 
            ? 'Qual departamento tem mais membros registrados' 
            : 'Qual igreja tem mais membros registrados')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey={itemKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label || value
              }
            />
            <XAxis dataKey="members" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="members" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
        {/* Minimalist footer - show total and top item */}
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Members</span>
          </div>
          <span className="font-semibold text-gray-900">
            {totalMembers.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: topChurch?.fill }}
            ></div>
            <span className="text-muted-foreground">
              {mode === 'departments' ? 'Top Department' : 'Top Church'}: {topChurch?.fullName}
            </span>
          </div>
          <span className="font-medium">
            {topChurch?.members.toLocaleString()} members
            <span className="text-muted-foreground ml-1">
              ({Math.round((topChurch?.members / totalMembers) * 100)}%)
            </span>
          </span>
        </div>
        
        <div className="w-full flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Active Members:</span>
            <span className="font-medium text-green-600">
              {totalActiveMembers.toLocaleString()}
            </span>
            <span className="text-muted-foreground">
              ({activePercentage}% active rate)
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
