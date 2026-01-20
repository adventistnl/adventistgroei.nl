"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { Shield, Crown, Users as UsersIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { accessTranslations } from "@/lib/translations/access"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { PROJECT_CHART_COLORS, getProjectColor } from "@/lib/chart-colors"

// Função para obter cores dinâmicas dos roles

interface RoleData {
  id: string
  name: string
  key_code: string
  userCount: number
}

interface RoleDistributionChartProps {
  roles: RoleData[]
  totalUsers: number
  isLoading?: boolean
  className?: string
}

export function RoleDistributionChart({
  roles,
  totalUsers,
  isLoading = false,
  className = ""
}: RoleDistributionChartProps) {
  const { i18n } = useTranslation()
  const t = accessTranslations[i18n.language as keyof typeof accessTranslations] || accessTranslations.en
  const id = "role-distribution-pie"

  // Processar dados dos roles
  const processedRoles = React.useMemo(() => {
    return roles
      .filter(role => role.userCount > 0)
      .sort((a, b) => b.userCount - a.userCount)
  }, [roles])

  // Dados para o gráfico
  const { chartData, chartConfig } = React.useMemo(() => {
    if (processedRoles.length === 0) {
      return { chartData: [], chartConfig: {} }
    }

    const data: Array<{
      name: string
      value: number
      userCount: number
      fill: string
      percentage: number
      roleId: string
      roleName: string
      roleKey: string
    }> = []

    const config: ChartConfig = {
      value: { label: "Users" }
    }

    processedRoles.forEach((role, index) => {
      const roleKey = `role_${role.id}`
      const color = getProjectColor(index)
      const percentage = totalUsers > 0 
        ? Math.round((role.userCount / totalUsers) * 100) 
        : 0
      
      data.push({
        name: roleKey,
        value: role.userCount,
        userCount: role.userCount,
        fill: color,
        percentage,
        roleId: role.id,
        roleName: role.name,
        roleKey: role.key_code
      })
      
      config[roleKey] = {
        label: role.name,
        color
      }
    })

    return { chartData: data, chartConfig: config }
  }, [processedRoles, totalUsers])

  // Estado para controlar o item ativo no gráfico
  const [activeItem, setActiveItem] = React.useState<string>('')
  
  // Atualizar activeItem quando chartData muda
  React.useEffect(() => {
    if (chartData.length > 0 && !activeItem) {
      setActiveItem(chartData[0].name)
    }
  }, [chartData, activeItem])
  
  // Index do item ativo
  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.name === activeItem),
    [activeItem, chartData]
  )

  // Lista de chaves para o select
  const itemKeys = React.useMemo(() => chartData.map((item) => item.name), [chartData])

  // Função para lidar com o click no PIE chart
  const handlePieClick = (data: any, index: number) => {
    if (data && data.name) {
      setActiveItem(data.name)
    }
  }

  // Dados do item ativo
  const activeData = React.useMemo(() => {
    if (activeIndex >= 0 && chartData[activeIndex]) {
      return chartData[activeIndex]
    }
    return chartData[0] || { 
      name: '', 
      value: 0, 
      userCount: 0, 
      percentage: 0, 
      fill: '', 
      roleId: '',
      roleName: '',
      roleKey: ''
    }
  }, [chartData, activeIndex])

  return (
    <Card data-chart={id} className={`bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col ${className}`}>
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-4">
        <div className="flex-1">
          <CardTitle>{t.charts.role_distribution.title}</CardTitle>
          <CardDescription>
            {processedRoles.length} {t.charts.role_distribution.description_with_users}
          </CardDescription>
        </div>
        {chartData.length > 0 && (
          <Select value={activeItem} onValueChange={setActiveItem}>
            <SelectTrigger
              className="ml-auto h-7 w-[180px] rounded-lg pl-2.5"
              aria-label={t.charts.role_distribution.select_role}
            >
              <SelectValue placeholder={t.charts.role_distribution.select_role} />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl max-h-[200px] overflow-y-auto">
              {itemKeys.map((key, index) => {
                const config = chartConfig[key as keyof typeof chartConfig]
                const chartItem = chartData.find(item => item.name === key)
                if (!config || !chartItem) return null

                const isAdmin = chartItem.roleKey.includes('ADMIN') || chartItem.roleKey.includes('SUPER')

                return (
                  <SelectItem
                    key={key}
                    value={key}
                    className="rounded-lg [&_span]:flex"
                  >
                    <div className="flex items-center justify-between w-full text-xs">
                      <div className="flex items-center gap-2">
                        {isAdmin ? (
                          <Crown className="h-3 w-3" style={{ color: config.color as string }} />
                        ) : (
                          <Shield className="h-3 w-3" style={{ color: config.color as string }} />
                        )}
                        <span className="font-medium">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-muted-foreground">{chartItem.userCount}</span>
                        <span className="font-semibold" style={{ color: config.color as string }}>
                          {chartItem.percentage}%
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pb-0">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="w-24 h-4" />
          </div>
        ) : totalUsers === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t.charts.role_distribution.no_users}</p>
            <p className="text-sm">{t.charts.role_distribution.no_users_description}</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t.charts.role_distribution.no_roles}</p>
            <p className="text-sm">{t.charts.role_distribution.no_roles_description}</p>
          </div>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  hideLabel 
                  formatter={(value, name) => {
                    const item = chartData.find(item => item.name === name)
                    return [
                      `${item?.userCount || 0} users (${item?.percentage || 0}%)`,
                      chartConfig[name as keyof typeof chartConfig]?.label || name
                    ]
                  }}
                />}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={120}
                strokeWidth={2}
                stroke="hsl(var(--background))"
                activeIndex={activeIndex}
                onClick={handlePieClick}
                className="cursor-pointer"
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 8} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 20}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox && activeData) {
                      const isAdmin = activeData.roleKey.includes('ADMIN') || activeData.roleKey.includes('SUPER')
                      
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {activeData.userCount.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-sm"
                          >
                            users ({activeData.percentage}%)
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 42}
                            className="fill-muted-foreground text-xs font-medium"
                          >
                            {activeData.roleName.length > 8 ? activeData.roleName.slice(0, 8) + '...' : activeData.roleName}
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      
      {/* Summary Info - Minimalista */}
      {!isLoading && totalUsers > 0 && chartData.length > 0 && (
        <div className="mt-4 pt-3 border-t mx-6 pb-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">{t.charts.role_distribution.stats.total_users}</p>
              <p className="font-bold text-sm">{totalUsers}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.charts.role_distribution.stats.total_roles}</p>
              <p className="font-bold text-sm text-primary">{processedRoles.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.charts.role_distribution.stats.avg_users}</p>
              <p className="font-bold text-sm">{Math.round(totalUsers / processedRoles.length)}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
