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
  Filter,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"
import { QuickActions, QuickAction } from "@/components/shared/quick-actions"
import { YearFilter } from "@/components/shared/year-filter"
import { SectionHeader } from "@/components/shared/section-header"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { RoleDistributionChart, PermissionsByGroupChart, UserActivityChart } from "@/components/access/access-charts"
import { UserStructureGrowthChart, UsersByStructureOverviewChart, UserDistributionBarChart } from "@/components/charts/dashboard"
import { HierarchicalStructureCard } from "@/components/charts/dashboard/hierarchical-structure-card"
import { StructureBarChart, GrowthLineChart } from "@/components/charts/generic"
import { ChurchActivityChart } from "@/components/churches/charts/church-activity-chart"
import { MembersByChurchChart } from "@/components/churches/charts/members-by-church-chart"
import { ProjectsByChurchChart } from "@/components/churches/charts/projects-by-church-chart"
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
import { GridContainer } from "@/components/shared/grid-container"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Month names
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { currentInstitutionData, institutions } = useInstitution()  
  const { formatCurrency, selectedCurrency } = useCurrency()
  const currentLanguage = i18n?.language || 'en'
  const ts = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en

  // Filter States
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("structure-chart")
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const current = new Date().getFullYear()
    return [current, current - 1, current - 2]
  })

  // Filter values state for PageFilters component
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    month: "all",
    region: "all"
  })

  // GraphQL Queries
  const { data: institutionsData, loading: institutionsLoading, refetch: refetchInstitutions } = useQuery(GET_INSTITUTIONS_QUERY)
  const { data: regionsData, loading: regionsLoading, refetch: refetchRegions } = useQuery(GET_REGIONS_QUERY)
  const { data: churchesData, loading: churchesLoading, refetch: refetchChurches } = useQuery(GET_CHURCHES_QUERY)
  const { data: departmentsData, loading: departmentsLoading, refetch: refetchDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: currentInstitutionData?.id }
  })
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_ALL_USERS_QUERY, {
    variables: { institution_id: currentInstitutionData?.id }
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
    const monthFilter = filterValues.month || selectedMonth
    return allUsers.filter((user: any) => {
      const createdDate = new Date(user.created_at)
      const yearMatch = createdDate.getFullYear() === selectedYear
      
      if (monthFilter === "all") return yearMatch
      
      const monthMatch = createdDate.getMonth() === parseInt(monthFilter)
      return yearMatch && monthMatch
    })
  }, [allUsers, selectedYear, selectedMonth, filterValues.month])

  const filteredChurches = useMemo(() => {
    const regionFilter = filterValues.region || selectedRegion
    let filtered = allChurches.filter((church: any) => !church.is_deleted)
    
    if (regionFilter !== "all") {
      filtered = filtered.filter((church: any) => church.region_id === regionFilter)
    }
    
    return filtered
  }, [allChurches, selectedRegion, filterValues.region])

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

  // Church Analytics Data
  const churchChartData = useMemo(() => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    // Church Activities by Month
    const churchActivities = months.map((month, index) => {
      const monthData: any = { month }
      
      filteredChurches.slice(0, 5).forEach((church: any, idx: number) => {
        const churchName = church.name.replace('Igreja ', '').replace(' de ', ' ')
        // Simulate activity score based on members and departments
        const baseActivity = (church.users?.length || 0) + (church.departments?.length || 0) * 2
        const variation = Math.sin(index + idx) * 10
        monthData[churchName] = Math.max(5, Math.round(baseActivity + variation))
      })
      
      return monthData
    })

    // Members by Church
    const membersByChurchRaw = filteredChurches.map((church: any, index: number) => ({
      church: church.name.replace('Igreja ', '').replace(' de ', ' '),
      fullName: church.name,
      members: church.users?.length || 0,
      activeMembers: church.users?.filter((u: any) => !u.is_deleted).length || 0,
      fill: colors[index % colors.length]
    }))
    const membersByChurch = membersByChurchRaw.sort((a: any, b: any) => b.members - a.members).slice(0, 8)

    // Projects by Church
    const projectsByChurchRaw = filteredChurches.map((church: any, index: number) => {
      const allProjects = church.departments?.reduce((sum: number, dept: any) => 
        sum + (dept.projects?.length || 0), 0) || 0
      const activeProjects = church.departments?.reduce((sum: number, dept: any) => 
        sum + (dept.projects?.filter((p: any) => !p.is_deleted).length || 0), 0) || 0
      
      return {
        church: church.name.replace('Igreja ', '').replace(' de ', ' '),
        fullName: church.name,
        projects: allProjects,
        activeProjects: activeProjects,
        completedProjects: allProjects - activeProjects,
        fill: colors[index % colors.length]
      }
    })
    const projectsByChurch = projectsByChurchRaw.sort((a: any, b: any) => b.projects - a.projects).slice(0, 8)

    return {
      churchActivities,
      membersByChurch,
      projectsByChurch
    }
  }, [filteredChurches])

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

  // Filter configuration for PageFilters component
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: "month",
      label: "Month",
      type: "select",
      placeholder: "Select month",
      defaultValue: "all",
      options: [
        { label: "All months", value: "all" },
        ...MONTHS.map((month, index) => ({
          label: month,
          value: index.toString()
        }))
      ]
    },
    {
      id: "region",
      label: "Region",
      type: "select",
      placeholder: "Select region",
      icon: MapPin,
      defaultValue: "all",
      description: "Filter churches by region",
      options: [
        { label: "All regions", value: "all" },
        ...allRegions.map((region: any) => ({
          label: region.name,
          value: region.id
        }))
      ]
    }
  ], [allRegions])

  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues(prev => ({ ...prev, [filterId]: value }))
    
    // Update legacy state for backward compatibility
    if (filterId === "month") {
      setSelectedMonth(value)
    } else if (filterId === "region") {
      setSelectedRegion(value)
    }
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setFilterValues({ month: "all", region: "all" })
    setSelectedMonth("all")
    setSelectedRegion("all")
    toast.success("Filters cleared")
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

  // Quick Actions Configuration
  const quickActions: QuickAction[] = [
    {
      id: "new-user",
      label: "New User",
      icon: Plus,
      onClick: () => {
        toast.info("New User modal - Coming soon")
      }
    },
    {
      id: "new-project",
      label: "New Project",
      icon: Plus,
      onClick: () => {
        toast.info("New Project modal - Coming soon")
      }
    },
    {
      id: "new-institution",
      label: "New Institution",
      icon: Building2,
      onClick: () => {
        toast.info("New Institution modal - Coming soon")
      }
    },
    {
      id: "new-church",
      label: "New Church",
      icon: Church,
      onClick: () => {
        toast.info("New Church modal - Coming soon")
      }
    }
  ]

  // Handle add year
  const handleAddYearCallback = (newYear: number) => {
    setAvailableYears(prev => [...prev, newYear].sort((a, b) => b - a))
    setSelectedYear(newYear)
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
                {currentInstitutionData && (
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <Building className="w-3 h-3 mr-1" />
                      {currentInstitutionData.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentInstitutionData.denomination}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div/>

          {/* Year Filter and Action Buttons Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Year Filter - Left Side */}
            <div className="flex-1">
              <YearFilter
                availableYears={availableYears}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                onAddYear={handleAddYearCallback}
                showAddButton={false}
              />
            </div>

            {/* Action Buttons - Right Side */}
            <div className="flex items-center gap-2">
              <PageFilters
                filters={filterConfigs}
                values={filterValues}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                triggerLabel="Filters"
                align="end"
                width={320}
              />

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
          <QuickActions 
            actions={quickActions}
            title="Quick Actions:"
            showTitle={true}
            size="sm"
          />
        </div>

        <Separator />

        {/* Section 1: System Overview KPIs */}
        <div>
          <SectionHeader
            title="System Overview"
            icon={Building2}
            description="Key performance indicators and system statistics"
          />
          <KPICards 
            data={kpiCardsData}
            isLoading={isLoading}
            variant="default"
          />
        </div>

        <Separator />

        {/* Section 2: Institutional Structure */}
        <div>
          <SectionHeader
            title="Institutional Structure"
            icon={Map}
            description="Organizational hierarchy and distribution"
          />

          <GridContainer
            items={[
              {
                id: "UserStructureGrowthChart-full-width",
                component: (
                  <UserStructureGrowthChart
                    loading={isLoading}
                    users={allUsers}
                    departments={allDepartments}
                    regions={allRegions}
                    churches={allChurches}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-8",
              },
              {
                id: "structure-tabs-panel",
                component: (
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Tabs - Chart vs Info */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="structure-chart" className="gap-2">
                          <Building2 className="w-4 h-4" />
                          Chart
                        </TabsTrigger>
                        <TabsTrigger value="structure-info" className="gap-2">
                          <Map className="w-4 h-4" />
                          Info
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Content based on active tab */}
                    <div className="flex-1 min-h-0">
                      {activeTab === "structure-chart" ? (
                        <UsersByStructureOverviewChart
                          loading={isLoading}
                          users={allUsers}
                          institutions={allInstitutions}
                          departments={allDepartments}
                          regions={allRegions}
                          churches={allChurches}
                        />
                      ) : (
                        <HierarchicalStructureCard
                          title="Hierarchical Structure"
                          description="The institutional structure follows a clear hierarchy"
                          icon={Map}
                          loading={isLoading}
                          levels={[
                          {
                            title: 'Institution Level',
                            icon: Building2,
                            description: `${kpis.totalInstitutions} institution(s) with ${kpis.institutionDepartments} department(s)`,
                            details: 'Top-level organizational units managing all operations',
                            borderColor: 'border-primary/30',
                            indent: 0
                          },
                          {
                            title: 'Regions',
                            icon: Map,
                            description: `${kpis.totalRegions} region(s) managing ${kpis.activeChurches} churches`,
                            details: 'Geographic divisions containing provinces and churches',
                            borderColor: 'border-blue-500/30',
                            indent: 1
                          },
                          {
                            title: 'Churches',
                            icon: Church,
                            description: `${kpis.activeChurches} active churches with ${kpis.churchDepartments} departments`,
                            details: 'Local congregations with specialized ministry departments',
                            borderColor: 'border-green-500/30',
                            indent: 2
                          }
                        ]}
                        footer={
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs font-medium mb-1">Hierarchy Flow:</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              Institution → Regions → Provinces → Churches → Departments
                            </div>
                          </div>
                        }
                      />
                    )}
                    </div>
                  </div>
                ),
                colSpan: "col-span-12 lg:col-span-4",
              },
            ]}
            gap="lg"
          />
        </div>

        

        <Separator />

        {/* Section 3: Users Overview */}
        <div>
          <SectionHeader
            title="Users Overview"
            icon={Users}
            description="User statistics, growth trends and distribution"
          />
          
          <ResponsiveGridCarousel
            enableAutoplay={false}
            gap="gap-6"
          >
            {/* User Growth Over Time */}
            <GrowthLineChart
              title="User Growth Over Time"
              description={`New user registrations throughout ${selectedYear}`}
              icon={TrendingUp}
              data={userGrowthData}
              lines={[
                { dataKey: 'users', label: 'Total Users', color: '#3b82f6' },
                { dataKey: 'newUsers', label: 'New Users', color: '#10b981' }
              ]}
              loading={isLoading}
              xAxisKey="month"
              footer={
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Growth rate: {kpis.userGrowthRate}% compared to previous year
                </div>
              }
            />

            {/* User Distribution by Structure */}
            <UserDistributionBarChart
              title="User Distribution"
              description="Users distributed across institutions"
              icon={Building2}
              data={userDistributionData}
              loading={isLoading}
            />
          </ResponsiveGridCarousel>
        </div>

        <Separator />

        {/* Section 4: Churches Analytics */}
        <div>
          <SectionHeader
            title="Churches Analytics"
            icon={Church}
            description="Church activities, member distribution and project tracking"
          />
          
          <ResponsiveGridCarousel
            enableAutoplay={false}
            gap="gap-6"
          >
            {/* Church Activities Timeline */}
            <ChurchActivityChart 
              data={churchChartData.churchActivities}
              loading={churchesLoading}
            />

            {/* Members by Church */}
            <MembersByChurchChart
              data={churchChartData.membersByChurch}
              loading={churchesLoading}
              mode="churches"
            />

            {/* Projects by Church */}
            <ProjectsByChurchChart
              data={churchChartData.projectsByChurch}
              loading={churchesLoading}
            />
          </ResponsiveGridCarousel>
        </div>

        <Separator />

        {/* Section 5: Governance & Compliance */}
        <div>
          <SectionHeader
            title="Governance & Compliance"
            icon={Shield}
            description="Role distribution and permission management"
          />
          
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
