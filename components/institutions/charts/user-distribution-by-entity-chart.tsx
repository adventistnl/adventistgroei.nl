"use client"

import * as React from "react"
import { TrendingUp, Users } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { useTranslation } from "react-i18next"

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

interface UserDistributionByEntityChartProps {
  institutionData?: any
  loading?: boolean
}

export function UserDistributionByEntityChart({ 
  institutionData, 
  loading 
}: UserDistributionByEntityChartProps) {
  const { t } = useTranslation()

  // Calculate user distribution across entities
  const chartData = React.useMemo(() => {
    if (!institutionData) return []

    const data = []
    
    // Institution level users
    const institutionUsers = institutionData.users?.filter((u: any) => 
      !u.is_deleted && u.institution_id === institutionData.id && !u.church_id && !u.region_id
    ).length || 0
    
    if (institutionUsers > 0) {
      data.push({
        entity: t('institutions.analytics.userDistribution.institution') || "Institution",
        users: institutionUsers,
        fill: "var(--chart-1)"
      })
    }

    // Regions users
    const regions = institutionData.regions || []
    regions.forEach((region: any) => {
      if (region.is_deleted) return
      const regionUsers = institutionData.users?.filter((u: any) => 
        !u.is_deleted && u.region_id === region.id
      ).length || 0
      
      if (regionUsers > 0) {
        data.push({
          entity: region.name,
          users: regionUsers,
          fill: "var(--chart-2)"
        })
      }
    })

    // Churches users
    const churches = institutionData.churches || []
    churches.forEach((church: any) => {
      if (church.is_deleted) return
      const churchUsers = institutionData.users?.filter((u: any) => 
        !u.is_deleted && u.church_id === church.id
      ).length || 0
      
      if (churchUsers > 0) {
        data.push({
          entity: church.name,
          users: churchUsers,
          fill: "var(--chart-3)"
        })
      }
    })

    // Institution Departments users
    const institutionDepts = institutionData.departments?.filter((d: any) => 
      !d.is_deleted && !d.church_id
    ) || []
    
    institutionDepts.forEach((dept: any) => {
      const deptUsers = institutionData.users?.filter((u: any) => 
        !u.is_deleted && u.department_id === dept.id && !u.church_id
      ).length || 0
      
      if (deptUsers > 0) {
        data.push({
          entity: `${dept.name} (Dept)`,
          users: deptUsers,
          fill: "var(--chart-4)"
        })
      }
    })

    // Church Departments users
    const churchDepts = institutionData.departments?.filter((d: any) => 
      !d.is_deleted && d.church_id
    ) || []
    
    churchDepts.forEach((dept: any) => {
      const deptUsers = institutionData.users?.filter((u: any) => 
        !u.is_deleted && u.department_id === dept.id && u.church_id
      ).length || 0
      
      if (deptUsers > 0) {
        data.push({
          entity: `${dept.name} (Church Dept)`,
          users: deptUsers,
          fill: "var(--chart-5)"
        })
      }
    })

    // Sort by number of users descending
    return data.sort((a, b) => b.users - a.users).slice(0, 10) // Top 10
  }, [institutionData, t])

  const chartConfig = {
    users: {
      label: t('institutions.analytics.userDistribution.users') || "Users",
      color: "var(--chart-1)",
    },
    label: {
      color: "var(--background)",
    },
  } satisfies ChartConfig

  const totalUsers = React.useMemo(() => 
    chartData.reduce((sum, item) => sum + item.users, 0), 
    [chartData]
  )

  if (loading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse mt-2" />
        </CardHeader>
        <CardContent className="flex-1 flex justify-center items-center">
          <div className="w-full h-[400px] bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{t('institutions.analytics.userDistribution.title') || "User Distribution by Entity"}</CardTitle>
          <CardDescription>
            {t('institutions.analytics.userDistribution.description') || "Distribution across organizational entities"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex justify-center items-center">
          <div className="text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-lg font-medium mb-2">{t('institutions.analytics.noData')}</p>
            <p className="text-sm">{t('institutions.analytics.userDistribution.noData') || "No user data available"}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{t('institutions.analytics.userDistribution.title') || "User Distribution by Entity"}</CardTitle>
        <CardDescription>
          {t('institutions.analytics.userDistribution.description') || "Top entities by user count"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
              left: 16,
              top: 5,
              bottom: 5
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="entity"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.length > 20 ? value.slice(0, 20) + '...' : value}
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
              radius={4}
            >
              <LabelList
                dataKey="entity"
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
      <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-4">
        <div className="flex gap-2 leading-none font-medium">
          <Users className="h-4 w-4" />
          {t('institutions.analytics.totalUsers') || "Total Users"}: {totalUsers.toLocaleString()}
        </div>
        <div className="text-muted-foreground leading-none">
          {t('institutions.analytics.userDistribution.footer') || "Showing user distribution across entities"}
        </div>
      </CardFooter>
    </Card>
  )
}
