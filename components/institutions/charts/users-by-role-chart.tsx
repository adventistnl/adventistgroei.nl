"use client"

import * as React from "react"
import { TrendingUp, ChevronLeft, ChevronRight, ChartBarDecreasing, ChartPie } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis, Pie, PieChart, Label, Sector, Cell } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
import { useTranslation } from "react-i18next"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartHeader } from "@/components/charts/chart-header"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getProjectColor } from "@/lib/chart-colors"
import { InstitutionById_institution_institutionChartsData_usersByRole } from "@/types/InstitutionById"

interface UsersByRoleChartProps {
  users?: any[] // Raw users array from API
  data?: InstitutionById_institution_institutionChartsData_usersByRole[] // Legacy support
  monthlyUserGrowth?: number | null
  loading?: boolean
  selectedYear?: number
  showTopNFilter?: boolean
  showSortFilter?: boolean
  showRoleSelector?: boolean
  showViewToggle?: boolean
  defaultView?: 'bar' | 'pie'
}

export function UsersByRoleChart({ 
  users, 
  data, 
  monthlyUserGrowth, 
  loading, 
  selectedYear,
  showTopNFilter = true,
  showSortFilter = true,
  showRoleSelector = true,
  showViewToggle = true,
  defaultView = 'bar'
}: UsersByRoleChartProps) {
  const { t } = useTranslation()
  const id = "users-by-role"
  const [activeView, setActiveView] = React.useState<'bar' | 'pie'>(defaultView)
  const [activeRole, setActiveRole] = React.useState("All")
  const [topN, setTopN] = React.useState<number | 'all'>('all')
  const [sortOrder, setSortOrder] = React.useState<'desc' | 'asc'>('desc')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 5

  // DEBUG: Validate API data
  React.useEffect(() => {
    console.log('🔍 [UsersByRoleChart] API DATA VALIDATION:', {
      receivedData: {
        usersCount: users?.length || 0,
        legacyDataCount: data?.length || 0,
        usersIsArray: Array.isArray(users),
        dataIsArray: Array.isArray(data),
        usersType: typeof users,
        usersIsUndefined: users === undefined,
        usersIsNull: users === null,
      },
      usersSample: users?.slice(0, 3).map(u => ({
        id: u?.id,
        name: u?.name,
        user_roles: u?.user_roles?.map((ur: any) => ur?.role?.name),
        user_roles_count: u?.user_roles?.length || 0,
        is_deleted: u?.is_deleted
      })),
      usersWithRoles: users?.filter(u => u?.user_roles?.length > 0).length || 0,
      usersWithoutRoles: users?.filter(u => !u?.user_roles || u?.user_roles?.length === 0).length || 0,
      deletedUsers: users?.filter(u => u?.is_deleted).length || 0,
      activeUsers: users?.filter(u => !u?.is_deleted).length || 0,
      dataSample: data?.slice(0, 3),
      loading,
    })
  }, [users, data, loading])

  // Process users from API to count by role
  const processedData = React.useMemo(() => {
    console.log('📊 [UsersByRoleChart] Processing users data - START:', {
      usersReceived: users?.length || 0,
      usersType: typeof users,
      usersIsArray: Array.isArray(users),
      dataReceived: data?.length || 0,
      selectedYear
    })
    
    // Use users from API if available, otherwise fall back to legacy data
    const sourceData = users || []
    
    console.log('📊 [UsersByRoleChart] Source data selected:', {
      sourceLength: sourceData.length,
      isFromUsers: !!users,
      isFromData: !users && !!data
    })
    
    if (sourceData.length === 0 && data && data.length > 0) {
      console.log('📊 [UsersByRoleChart] Using legacy data format')
      return data.map((item, index) => ({
        ...item,
        fill: getProjectColor(index)
      }))
    }
    
    if (sourceData.length === 0) {
      console.warn('⚠️ [UsersByRoleChart] NO DATA TO PROCESS - both users and data are empty')
      return []
    }
    
    // Filter users by selected year if provided
    const filteredByYear = selectedYear 
      ? sourceData.filter((user: any) => {
          if (!user?.created_at) return false
          const userYear = new Date(user.created_at).getFullYear()
          return userYear <= selectedYear
        })
      : sourceData
    
    console.log('📊 [UsersByRoleChart] Filtered by year:', {
      selectedYear,
      originalCount: sourceData.length,
      filteredCount: filteredByYear.length
    })
    
    // Count users by role
    const roleCounts = new Map<string, { role: string; count: number; label: string }>()
    
    console.log('📊 [UsersByRoleChart] Processing users:', {
      totalUsers: filteredByYear.length,
      sampleUser: filteredByYear[0]
    })
    
    filteredByYear.forEach((user: any, index: number) => {
      if (user?.is_deleted) {
        console.log(`⏭️ [UsersByRoleChart] Skipping deleted user ${index}:`, user?.name)
        return // Skip deleted users
      }
      
      const userRoles = user?.user_roles || []
      
      if (index < 3) {
        console.log(`📊 [UsersByRoleChart] Processing user ${index}:`, {
          name: user?.name,
          rolesCount: userRoles.length,
          roles: userRoles.map((ur: any) => ur?.role?.name || ur?.role?.key_code)
        })
      }
      
      if (userRoles.length === 0) {
        // User without role
        const key = 'no_role'
        const existing = roleCounts.get(key)
        if (existing) {
          existing.count++
        } else {
          roleCounts.set(key, { role: key, count: 1, label: t('institutions.analytics.usersByRole.noRole') })
        }
      } else {
        // Count each role
        userRoles.forEach((userRole: any) => {
          const roleKey = userRole?.role?.key_code?.toLowerCase() || 'unknown'
          const roleLabel = userRole?.role?.name || 'Unknown'
          
          const existing = roleCounts.get(roleKey)
          if (existing) {
            existing.count++
          } else {
            roleCounts.set(roleKey, { role: roleKey, count: 1, label: roleLabel })
          }
        })
      }
    })
    
    // Convert to array and add colors using getProjectColor
    const result = Array.from(roleCounts.values()).map((item, index) => ({
      ...item,
      fill: getProjectColor(index)
    }))
    
    console.log('📊 [UsersByRoleChart] Processed data - FINAL:', {
      totalRoles: result.length,
      totalUsersInRoles: result.reduce((sum, r) => sum + r.count, 0),
      roles: result.map(r => ({ role: r.role, label: r.label, count: r.count })),
      selectedYear
    })
    
    return result
  }, [users, data, t, selectedYear])

  // Apply sorting, top N filter, and pagination
  const { chartData, totalPages, displayRange } = React.useMemo(() => {
    let sorted = [...processedData].sort((a, b) => 
      sortOrder === 'desc' ? b.count - a.count : a.count - b.count
    )
    
    // Apply topN filter first
    if (topN !== 'all') {
      sorted = sorted.slice(0, topN)
    }
    
    // Calculate pagination
    const total = sorted.length
    const pages = Math.ceil(total / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, total)
    const paginated = sorted.slice(startIndex, endIndex)
    
    console.log('📊 [UsersByRoleChart] Filtered & Paginated data:', {
      topN,
      sortOrder,
      currentPage,
      totalItems: total,
      totalPages: pages,
      displayRange: `${startIndex + 1}-${endIndex}`,
      items: paginated.map(r => ({ role: r.role, count: r.count }))
    })
    
    return {
      chartData: paginated,
      totalPages: pages,
      displayRange: { start: startIndex + 1, end: endIndex, total }
    }
  }, [processedData, topN, sortOrder, currentPage, itemsPerPage])
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [topN, sortOrder])

  // Generate dynamic chart config based on actual data
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: t('institutions.analytics.usersByRole.users'),
      }
    }
    
    chartData.forEach((item, index) => {
      config[item.role] = {
        label: (item as any).label || item.role,
        color: getProjectColor(index)
      }
    })
    
    return config
  }, [chartData, t])

  const activeIndex = React.useMemo(
    () => activeRole === "All" ? -1 : chartData.findIndex((item: any) => item.role === activeRole),
    [activeRole, chartData]
  )

  const roleKeys = React.useMemo(() => chartData.map((item: any) => item.role), [chartData])

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

  const totalUsers = chartData.reduce((sum: number, item: any) => sum + item.count, 0)
  const growthPercentage = monthlyUserGrowth ?? 8.4 // Fallback to mock value if not provided

  // Empty state when no data
  if (!loading && chartData.length === 0) {
    return (
      <Card data-chart={id} className="h-full flex flex-col min-h-[450px]">
        <CardHeader>
          <CardTitle>{t('institutions.analytics.usersByRole.title')}</CardTitle>
          <CardDescription>{t('institutions.analytics.usersByRole.description')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center items-center min-h-[300px]">
          <div className="text-center text-muted-foreground space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="text-lg font-medium mb-2">{t('institutions.analytics.usersByRole.noData')}</p>
              <p className="text-sm">{t('institutions.analytics.usersByRole.noDataDescription')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card data-chart={id} className="h-full flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <ChartHeader
        title={t('institutions.analytics.usersByRole.title')}
        description={t('institutions.analytics.usersByRole.description')}
        actions={
          <>
            {/* Top N Selector */}
            {showTopNFilter && (
              <Select value={topN.toString()} onValueChange={(v) => setTopN(v === 'all' ? 'all' : parseInt(v))}>
                <SelectTrigger
                  className="w-full sm:w-[100px] rounded-lg pl-2.5"
                  aria-label="Select top N"
                >
                  <SelectValue placeholder="Top" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  <SelectItem value="all" className="rounded-lg">{t('institutions.analytics.usersByRole.topN.all')}</SelectItem>
                  <SelectItem value="3" className="rounded-lg">{t('institutions.analytics.usersByRole.topN.top3')}</SelectItem>
                  <SelectItem value="5" className="rounded-lg">{t('institutions.analytics.usersByRole.topN.top5')}</SelectItem>
                  <SelectItem value="10" className="rounded-lg">{t('institutions.analytics.usersByRole.topN.top10')}</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {/* Sort Order Selector */}
            {showSortFilter && (
              <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
                <SelectTrigger
                  className="w-full sm:w-[120px] rounded-lg pl-2.5"
                  aria-label="Sort order"
                >
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  <SelectItem value="desc" className="rounded-lg">{t('institutions.analytics.usersByRole.sortOrder.mostUsers')}</SelectItem>
                  <SelectItem value="asc" className="rounded-lg">{t('institutions.analytics.usersByRole.sortOrder.leastUsers')}</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            {/* Role Selector - Only show in Pie view */}
            {showRoleSelector && activeView === 'pie' && (
              <Select value={activeRole} onValueChange={setActiveRole}>
                <SelectTrigger
                  className="w-full sm:w-[160px] rounded-lg pl-2.5"
                  aria-label="Select a role"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl">
                  <SelectItem value="All" className="rounded-lg [&_span]:flex">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="flex h-3 w-3 shrink-0 rounded-xs bg-gradient-to-r from-red-500 via-amber-500 via-blue-500 via-green-500 to-violet-500" />
                      {t('institutions.analytics.usersByRole.allRoles')}
                    </div>
                  </SelectItem>
                  {roleKeys.map((key: any) => {
                    const config = chartConfig[key as keyof typeof chartConfig]
                    if (!config) return null

                    return (
                      <SelectItem key={key} value={key} className="rounded-lg [&_span]:flex">
                        <div className="flex items-center gap-2 text-xs">
                          <span
                            className="flex h-3 w-3 shrink-0 rounded-xs"
                            style={{
                              backgroundColor: `var(--color-${key})`,
                            }}
                          />
                          {config?.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
            
            {/* View Toggle - Padronizado com UsersRegistrationOverTimeChart */}
            {showViewToggle && (
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={activeView === "bar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("bar")}
                  className="h-7 px-2"
                >
                  <ChartBarDecreasing className="w-3 h-3" />
                </Button>
                <Button
                  variant={activeView === "pie" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView("pie")}
                  className="h-7 px-2"
                >
                  <ChartPie className="w-3 h-3" />
                </Button>
              </div>
            )}
          </>
        }
      />
      
      <CardContent className="flex-1">
        {activeView === 'bar' ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="role"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                hide
              />
              <XAxis dataKey="count" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar 
                dataKey="count" 
                layout="vertical" 
                radius={4}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <LabelList
                  dataKey="role"
                  position="insideLeft"
                  offset={8}
                  style={{ fill: '#ffffff' }}
                  fontSize={12}
                  fontWeight={500}
                  formatter={(value: any) => {
                    const config = chartConfig[value as keyof typeof chartConfig]
                    return config?.label || value
                  }}
                />
                <LabelList
                  dataKey="count"
                  position="right"
                  offset={8}
                  style={{ fill: 'hsl(var(--foreground))' }}
                  fontSize={12}
                  fontWeight={500}
                  formatter={(value: any) => Number(value).toLocaleString()}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="role"
                innerRadius={60}
                strokeWidth={5}
                activeIndex={activeRole === "All" ? undefined : activeIndex}
                onClick={(data: any) => {
                  if (data && data.role) {
                    setActiveRole(data.role)
                  }
                }}
                activeShape={activeRole === "All" ? undefined : ({
                  outerRadius = 0,
                  fill: fillColor,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} fill={fillColor} outerRadius={outerRadius + 10} />
                    <Sector
                      {...props}
                      fill={fillColor}
                      outerRadius={outerRadius + 25}
                      innerRadius={outerRadius + 12}
                    />
                  </g>
                )}
              >
                {chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const activeData = activeRole === "All" ? null : chartData?.[activeIndex]
                      const displayValue = activeRole === "All" ? totalUsers : (activeData?.count || 0)
                      const displayLabel = activeRole === "All" ? t('institutions.analytics.usersByRole.total') : t('institutions.analytics.usersByRole.users')
                      
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
                            {displayValue.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            {displayLabel}
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
      <CardFooter className="flex-col border-t pt-4 pb-4 gap-4">
        {/* Pagination Controls */}
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-muted-foreground">
            {t('institutions.analytics.usersByRole.showing')} {displayRange.start}-{displayRange.end} {t('institutions.analytics.usersByRole.of')} {displayRange.total} {t('institutions.analytics.usersByRole.roles')}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-sm font-medium min-w-[80px] text-center">
              {t('institutions.analytics.usersByRole.page')} {currentPage} {t('institutions.analytics.usersByRole.of')} {totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="h-7 w-7 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Statistics */}
        {/* <div className="flex flex-col items-start gap-2 text-sm w-full border-t pt-4">
          {activeView === 'pie' && activeRole !== "All" ? (
            <>
              <div className="flex gap-2 leading-none font-medium">
                {chartConfig[activeRole as keyof typeof chartConfig]?.label || activeRole}: {chartData[activeIndex]?.count || 0} ({totalUsers > 0 ? Math.round(((chartData[activeIndex]?.count || 0) / totalUsers) * 100) : 0}%)
              </div>
              <div className="text-muted-foreground leading-none">
                Total users across all roles: {totalUsers.toLocaleString()}
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-2 leading-none font-medium">
                Total users: {totalUsers.toLocaleString()} across {processedData.length} roles
              </div>
              {monthlyUserGrowth !== null && monthlyUserGrowth !== undefined && (
                <div className="flex gap-2 leading-none text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Trending up by {growthPercentage}% this month
                </div>
              )}
            </>
          )}
        </div> */}
      </CardFooter>
    </Card>
  )
}
