"use client"

import * as React from "react"
import { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@apollo/client"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { useInstitution } from "@/contexts/institution-context"
import { useCurrency } from "@/contexts/currency-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Building2,
  MapPin,
  UserCheck,
  Plus,
  RefreshCw,
  Shield,
  Lock,
  Crown,
  Building,
  Map,
  Church,
  Filter
} from "lucide-react"
import { toast } from "sonner"
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { RoleDistributionChart, PermissionsByGroupChart, UserActivityChart } from "@/components/access/access-charts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// GraphQL Queries
import { GET_INSTITUTIONS_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { GET_REGIONS_QUERY } from "@/graphql/queries/REGIONS_QUERY"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY"
import { GET_ALL_ROLES_QUERY } from "@/graphql/queries/GET_ROLES_QUERY"

import { structureTranslations } from "@/lib/translations/structure"

// Month names
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { currentInstitution, institutions } = useInstitution()  
  const { formatCurrency, selectedCurrency } = useCurrency()
  const currentLanguage = i18n?.language || 'en'
  const ts = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en

  // Filter States
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const current = new Date().getFullYear()
    return [current, current - 1, current - 2]
  })

  // GraphQL Queries
  const { data: institutionsData, loading: institutionsLoading, refetch: refetchInstitutions } = useQuery(GET_INSTITUTIONS_QUERY)
  const { data: regionsData, loading: regionsLoading, refetch: refetchRegions } = useQuery(GET_REGIONS_QUERY)
  const { data: churchesData, loading: churchesLoading, refetch: refetchChurches } = useQuery(GET_CHURCHES_QUERY)
  const { data: departmentsData, loading: departmentsLoading, refetch: refetchDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: currentInstitution?.id }
  })
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_ALL_USERS_QUERY, {
    variables: { institution_id: currentInstitution?.id }
  })
  const { data: rolesData, loading: rolesLoading, refetch: refetchRoles } = useQuery(GET_ALL_ROLES_QUERY)

  const isLoading = institutionsLoading || regionsLoading || churchesLoading || departmentsLoading || usersLoading || rolesLoading

  const breadcrumbs = useMemo(() => [
    { name: t('dashboard.title') }
  ], [t])

  usePageTitle({
    title: t('dashboard.title'),
    breadcrumbs
  })

  // Extract data from queries
  const allInstitutions = institutionsData?.institutions || []
  const allRegions = regionsData?.regions || []
  const allChurches = churchesData?.churches || []
  const allDepartments = departmentsData?.departments || []
  const allUsers = usersData?.users || []
  const allRoles = rolesData?.roles || []

  // Filter data by selected year and month
  const filteredUsers = useMemo(() => {
    return allUsers.filter((user: any) => {
      const createdDate = new Date(user.created_at)
      const yearMatch = createdDate.getFullYear() === selectedYear
      
      if (selectedMonth === "all") return yearMatch
      
      const monthMatch = createdDate.getMonth() === parseInt(selectedMonth)
      return yearMatch && monthMatch
    })
  }, [allUsers, selectedYear, selectedMonth])

  const filteredChurches = useMemo(() => {
    let filtered = allChurches.filter((church: any) => !church.is_deleted)
    
    if (selectedRegion !== "all") {
      filtered = filtered.filter((church: any) => church.region_id === selectedRegion)
    }
    
    return filtered
  }, [allChurches, selectedRegion])

  // Calculate KPIs
  const kpis = useMemo(() => {
    const activeUsers = filteredUsers.filter((user: any) => !user.is_deleted).length
    const newUsersThisYear = allUsers.filter((user: any) => {
      const createdDate = new Date(user.created_at)
      return createdDate.getFullYear() === selectedYear && !user.is_deleted
    }).length
    
    const previousYearUsers = allUsers.filter((user: any) => {
      const createdDate = new Date(user.created_at)
      return createdDate.getFullYear() === selectedYear - 1 && !user.is_deleted
    }).length

    const userGrowthRate = previousYearUsers > 0 
      ? Math.round(((newUsersThisYear - previousYearUsers) / previousYearUsers) * 100)
      : 100

    const institutionDepartments = allDepartments.filter((dept: any) => !dept.church_id && !dept.is_deleted).length
    const churchDepartments = allDepartments.filter((dept: any) => dept.church_id && !dept.is_deleted).length

    return {
      totalInstitutions: allInstitutions.length,
      totalRegions: allRegions.length,
      activeChurches: filteredChurches.length,
      totalDepartments: institutionDepartments + churchDepartments,
      institutionDepartments,
      churchDepartments,
      totalUsers: allUsers.filter((u: any) => !u.is_deleted).length,
      activeUsers,
      newUsersThisYear,
      userGrowthRate,
      totalRoles: allRoles.length,
      totalPermissions: allRoles.reduce((sum: number, role: any) => {
        return sum + (role.permissions?.reduce((pSum: number, group: any) => pSum + (group.data?.length || 0), 0) || 0)
      }, 0)
    }
  }, [allInstitutions, allRegions, filteredChurches, allDepartments, filteredUsers, allUsers, allRoles, selectedYear])

  // User Growth Over Time (Monthly data for selected year)
  const userGrowthData = useMemo(() => {
    const monthlyData = MONTHS.map((month, index) => ({
      month: month.substring(0, 3),
      users: 0,
      newUsers: 0
    }))

    allUsers.forEach((user: any) => {
      const createdDate = new Date(user.created_at)
      if (createdDate.getFullYear() === selectedYear && !user.is_deleted) {
        const monthIndex = createdDate.getMonth()
        monthlyData[monthIndex].newUsers += 1
      }
    })

    // Calculate cumulative users
    let cumulative = 0
    monthlyData.forEach(month => {
      cumulative += month.newUsers
      month.users = cumulative
    })

    return monthlyData
  }, [allUsers, selectedYear])

  // User Distribution by Structure
  const userDistributionData = useMemo(() => {
    const distribution: any[] = []

    // Group by institution
    const byInstitution: Record<string, number> = {}
    
    filteredUsers.forEach((user: any) => {
      const institutionName = allInstitutions.find((i: any) => i.id === user.institution_id)?.name || 'Unknown'
      byInstitution[institutionName] = (byInstitution[institutionName] || 0) + 1
    })

    Object.entries(byInstitution).forEach(([name, count]) => {
      distribution.push({ name, users: count })
    })

    return distribution
  }, [filteredUsers, allInstitutions])

  // Role Distribution Data for Charts
  const roleDistributionData = useMemo(() => {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']
    
    return allRoles.map((role: any, index: number) => ({
      name: role.name,
      value: role.users?.filter((u: any) => !u.is_deleted).length || 0,
      color: role.color || COLORS[index % COLORS.length]
    }))
  }, [allRoles])

  // Permissions by Group Data
  const permissionsByGroupData = useMemo(() => {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const groupMap: Record<string, number> = {}

    allRoles.forEach((role: any) => {
      role.permissions?.forEach((permGroup: any) => {
        const group = permGroup.group || 'Other'
        groupMap[group] = (groupMap[group] || 0) + (permGroup.data?.length || 0)
      })
    })

    return Object.entries(groupMap).map(([group, permissions], index) => ({
      group,
      permissions,
      color: COLORS[index % COLORS.length]
    }))
  }, [allRoles])

  // Refresh all data
  const handleRefresh = async () => {
    const refreshToast = toast.loading("Refreshing dashboard data...")
    
    try {
      await Promise.all([
        refetchInstitutions(),
        refetchRegions(),
        refetchChurches(),
        refetchDepartments(),
        refetchUsers(),
        refetchRoles()
      ])
      
      toast.dismiss(refreshToast)
      toast.success("Dashboard data refreshed successfully")
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error("Failed to refresh dashboard data")
    }
  }

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(`Cannot add years beyond ${maxAllowedYear}`)
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error(`Year ${nextYear} already exists`)
      return
    }

    setAvailableYears(prev => [...prev, nextYear].sort((a, b) => b - a))
    setSelectedYear(nextYear)
    toast.success(`Year ${nextYear} added successfully`)
  }

  // KPI Cards Data
  const kpiCardsData = [
    {
      id: "total-institutions",
      title: "Total Institutions",
      value: kpis.totalInstitutions,
      icon: Building2,
      subtitle: "Active organizations",
      trend: {
        value: 0,
        isPositive: true
      }
    },
    {
      id: "total-regions",
      title: "Total Regions",
      value: kpis.totalRegions,
      icon: Map,
      subtitle: `${kpis.activeChurches} churches`,
      trend: {
        value: 0,
        isPositive: true
      }
    },
    {
      id: "active-churches",
      title: "Active Churches",
      value: kpis.activeChurches,
      icon: Church,
      subtitle: selectedRegion === "all" ? "All regions" : "Selected region",
      trend: {
        value: 0,
        isPositive: true
      }
    },
    {
      id: "departments",
      title: "Departments",
      value: kpis.totalDepartments,
      icon: Building,
      subtitle: `${kpis.institutionDepartments} inst. | ${kpis.churchDepartments} church`,
      trend: {
        value: 0,
        isPositive: true
      }
    },
    {
      id: "total-users",
      title: "Total Users",
      value: kpis.totalUsers,
      icon: Users,
      subtitle: `${kpis.newUsersThisYear} new this year`,
      trend: {
        value: kpis.userGrowthRate,
        isPositive: kpis.userGrowthRate >= 0
      }
    },
    {
      id: "active-users",
      title: "Active Users",
      value: kpis.activeUsers,
      icon: UserCheck,
      subtitle: "Currently active",
      trend: {
        value: 0,
        isPositive: true
      }
    }
  ]

  // Year Filter Component
  const YearFilter = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const canAddMore = Math.max(...availableYears) < maxAllowedYear

    return (
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
        {availableYears.map((year) => (
          <Button
            key={year}
            variant="outline"
            size="sm"
            onClick={() => setSelectedYear(year)}
            className={`
              flex-shrink-0 min-w-[80px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
              ${
                selectedYear === year 
                  ? 'bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground border-muted hover:bg-muted/80 hover:text-foreground hover:border-muted-foreground/50'
              }
            `}
          >
            {year}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddYear}
          disabled={!canAddMore}
          className={`
            flex-shrink-0 min-w-[100px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
            ${
              canAddMore 
                ? 'border-dashed border-muted-foreground/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 hover:bg-muted/50' 
                : 'opacity-40 cursor-not-allowed border-dashed border-muted-foreground/20 text-muted-foreground/50'
            }
          `}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Year
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header with Filters */}
        <div className="flex flex-col gap-4">
          {/* Title and Institution Info */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Dashboard</h2>
                <p className="text-muted-foreground text-sm">
                  Strategic institutional overview for {selectedYear}
                  {selectedMonth !== "all" && ` - ${MONTHS[parseInt(selectedMonth)]}`}
                  {selectedRegion !== "all" && ` - ${allRegions.find((r: any) => r.id === selectedRegion)?.name || 'Region'}`}
                </p>
                {currentInstitution && (
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <Building className="w-3 h-3 mr-1" />
                      {currentInstitution.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentInstitution.denomination}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Year Filter and Action Buttons Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Year Filter - Left Side */}
            <div className="flex-1">
              <YearFilter />
            </div>

            {/* Action Buttons - Right Side */}
            <div className="flex items-center gap-2">
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {(selectedMonth !== "all" || selectedRegion !== "all") && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {(selectedMonth !== "all" ? 1 : 0) + (selectedRegion !== "all" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Additional Filters
                      </h4>
                    </div>

                    {/* Month Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Month</label>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All months</SelectItem>
                          {MONTHS.map((month, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Region Filter */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Region</label>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All regions</SelectItem>
                          {allRegions.map((region: any) => (
                            <SelectItem key={region.id} value={region.id}>
                              {region.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear Filters */}
                    {(selectedMonth !== "all" || selectedRegion !== "all") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedMonth("all")
                          setSelectedRegion("all")
                          toast.success("Filters cleared")
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Actions - Below */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Quick Actions:</span>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              New User
            </Button>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              New Project
            </Button>
            <Button size="sm" variant="outline">
              <Building2 className="w-4 h-4 mr-1" />
              New Institution
            </Button>
            <Button size="sm" variant="outline">
              <Church className="w-4 h-4 mr-1" />
              New Church
            </Button>
          </div>
        </div>

        <Separator />

        {/* Section 1: System Overview KPIs */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            System Overview
          </h2>
          <KPICards 
            data={kpiCardsData}
            isLoading={isLoading}
            variant="default"
          />
        </div>

        <Separator />

        {/* Section 2: Institutional Structure */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Map className="w-5 h-5" />
            Institutional Structure
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Structure Overview Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Structure Overview
                </CardTitle>
                <CardDescription>
                  Quantitative breakdown of organizational structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "#3b82f6"
                    }
                  }}
                  className="h-[300px] w-full"
                >
                  <BarChart 
                    data={[
                      { name: 'Institutions', count: kpis.totalInstitutions, fill: '#3b82f6' },
                      { name: 'Regions', count: kpis.totalRegions, fill: '#10b981' },
                      { name: 'Churches', count: kpis.activeChurches, fill: '#f59e0b' },
                      { name: 'Inst. Depts', count: kpis.institutionDepartments, fill: '#8b5cf6' },
                      { name: 'Church Depts', count: kpis.churchDepartments, fill: '#ec4899' },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="count" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  Total entities: {kpis.totalInstitutions + kpis.totalRegions + kpis.activeChurches + kpis.totalDepartments}
                </div>
              </CardFooter>
            </Card>

            {/* Hierarchical Structure Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Hierarchical Structure
                </CardTitle>
                <CardDescription>
                  The institutional structure follows a clear hierarchy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="pl-4 border-l-4 border-primary/30">
                    <div className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Institution Level
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {kpis.totalInstitutions} institution(s) with {kpis.institutionDepartments} department(s)
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Top-level organizational units managing all operations
                    </div>
                  </div>
                  
                  <div className="pl-8 border-l-4 border-blue-500/30">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <Map className="w-4 h-4" />
                      Regions
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {kpis.totalRegions} region(s) managing {kpis.activeChurches} churches
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Geographic divisions containing provinces and churches
                    </div>
                  </div>
                  
                  <div className="pl-12 border-l-4 border-green-500/30">
                    <div className="font-semibold mb-2 flex items-center gap-2">
                      <Church className="w-4 h-4" />
                      Churches
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {kpis.activeChurches} active churches with {kpis.churchDepartments} departments
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Local congregations with specialized ministry departments
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                    <div className="text-xs font-medium mb-1">Hierarchy Flow:</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Institution → Regions → Provinces → Churches → Departments
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Section 3: Users Overview */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Users Overview
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Over Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  User Growth Over Time
                </CardTitle>
                <CardDescription>
                  New user registrations throughout {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: {
                      label: "Total Users",
                      color: "#3b82f6"
                    },
                    newUsers: {
                      label: "New Users",
                      color: "#10b981"
                    }
                  }}
                  className="h-[300px] w-full"
                >
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="var(--color-users)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="newUsers" 
                      stroke="var(--color-newUsers)" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  Growth rate: {kpis.userGrowthRate}% compared to previous year
                </div>
              </CardFooter>
            </Card>

            {/* User Distribution by Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  User Distribution
                </CardTitle>
                <CardDescription>
                  Users distributed across institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    users: {
                      label: "Users",
                      color: "#f59e0b"
                    }
                  }}
                  className="h-[300px] w-full"
                >
                  <BarChart data={userDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="users" 
                      fill="var(--color-users)" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Section 4: Governance & Compliance */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Governance & Compliance
          </h2>
          
          {/* Role Distribution */}
          <RoleDistributionChart 
            data={roleDistributionData}
            loading={rolesLoading}
          />
        </div>
      </div>
    </AppLayout>
  )
}
