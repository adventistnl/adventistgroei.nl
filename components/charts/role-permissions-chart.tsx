"use client"

import * as React from "react"
import { TrendingUp, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"
import { useTranslation } from "react-i18next"
import { accessTranslations } from "@/lib/translations/access"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface RolePermissionsData {
  id: string
  name: string
  key_code: string
  permissionCount: number
}

interface RolePermissionsChartProps {
  roles: RolePermissionsData[]
  isLoading?: boolean
  className?: string
}

export function RolePermissionsChart({
  roles,
  isLoading = false,
  className = ""
}: RolePermissionsChartProps) {
  const { i18n } = useTranslation()
  const t = accessTranslations[i18n.language as keyof typeof accessTranslations] || accessTranslations.en
  
  const [sortOrder, setSortOrder] = React.useState<'top' | 'least'>('top')
  const [currentPage, setCurrentPage] = React.useState(0)
  const itemsPerPage = 5

  // Processar e ordenar dados por quantidade de permissões
  const sortedRoles = React.useMemo(() => {
    const filtered = roles.filter(role => role.permissionCount > 0)
    return sortOrder === 'top'
      ? filtered.sort((a, b) => b.permissionCount - a.permissionCount)
      : filtered.sort((a, b) => a.permissionCount - b.permissionCount)
  }, [roles, sortOrder])

  // Calcular total de páginas
  const totalPages = Math.ceil(sortedRoles.length / itemsPerPage)

  // Reset página quando mudar ordenação
  React.useEffect(() => {
    setCurrentPage(0)
  }, [sortOrder])

  // Dados paginados
  const chartData = React.useMemo(() => {
    const start = currentPage * itemsPerPage
    const end = start + itemsPerPage
    
    return sortedRoles
      .slice(start, end)
      .map(role => ({
        name: role.name,
        key_code: role.key_code,
        permissions: role.permissionCount,
        fill: 'var(--chart-2)'
      }))
  }, [sortedRoles, currentPage, itemsPerPage])

  const chartConfig: ChartConfig = {
    permissions: {
      label: "Permissions",
      color: "var(--chart-2)",
    },
    label: {
      color: "var(--background)",
    },
  }

  // Calcular estatísticas
  const stats = React.useMemo(() => {
    if (roles.length === 0) return { total: 0, avg: 0, max: 0 }
    
    const total = roles.reduce((sum, role) => sum + role.permissionCount, 0)
    const avg = Math.round(total / roles.length)
    const max = Math.max(...roles.map(r => r.permissionCount))
    
    return { total, avg, max }
  }, [roles])

  return (
    <Card className={`bg-card text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full flex flex-col ${className}`}>
      <CardHeader className="flex-row items-start space-y-0 pb-4">
        <div className="flex-1">
          <CardTitle>{t.charts.role_permissions.title}</CardTitle>
          <CardDescription>
            {sortOrder === 'top' ? t.charts.role_permissions.description_top : t.charts.role_permissions.description_least}
          </CardDescription>
        </div>
        <Select value={sortOrder} onValueChange={(value: 'top' | 'least') => setSortOrder(value)}>
          <SelectTrigger
            className="ml-auto h-7 w-[160px] rounded-lg pl-2.5"
            aria-label={t.charts.role_permissions.sort_by}
          >
            <SelectValue placeholder={t.charts.role_permissions.sort_by} />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            <SelectItem value="top" className="rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">{t.charts.role_permissions.top_roles}</span>
              </div>
            </SelectItem>
            <SelectItem value="least" className="rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3" />
                <span className="text-xs">{t.charts.role_permissions.least_permissions}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center pb-0">{isLoading ? (
          <div className="space-y-4 py-8">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Lock className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>{t.charts.role_permissions.no_permissions}</p>
            <p className="text-sm">{t.charts.role_permissions.no_permissions_description}</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 32,
                left: 12,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 15)}
                hide
              />
              <XAxis dataKey="permissions" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent 
                  indicator="line"
                  formatter={(value, name, props) => {
                    const item = chartData.find(d => d.permissions === value)
                    return [
                      `${value} permissions`,
                      item?.name || name
                    ]
                  }}
                />}
              />
                <Bar
                  dataKey="permissions"
                  layout="vertical"
                  fill="var(--color-permissions)"
                  radius={6}
                >
                  <LabelList
                    dataKey="name"
                    position="insideLeft"
                    offset={8}
                    className="fill-white"
                    fontSize={12}
                    fontWeight={600}
                  />
                  <LabelList
                    dataKey="permissions"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                    fontWeight={700}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
          { totalPages > 1 && (
            <div className="flex items-center justify-between w-full mt-4 px-2">
              <span className="text-xs text-muted-foreground">
                {t.charts.role_permissions.showing} {currentPage * itemsPerPage + 1}-{Math.min((currentPage + 1) * itemsPerPage, sortedRoles.length)} {t.charts.role_permissions.of} {sortedRoles.length}
              </span>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  {currentPage + 1}/{totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      {!isLoading && chartData.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 text-sm border-t pt-3 pb-3">
          <div className="grid grid-cols-3 gap-4 w-full text-center">
            <div>
              <p className="text-xs text-muted-foreground">{t.charts.role_permissions.stats.total}</p>
              <p className="font-bold text-sm">{stats.total}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.charts.role_permissions.stats.avg}</p>
              <p className="font-bold text-sm text-primary">{stats.avg}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t.charts.role_permissions.stats.max}</p>
              <p className="font-bold text-sm">{stats.max}</p>
          </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}
