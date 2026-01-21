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
import { DateTimeDisplay } from "@/components/shared/date-time-display"
import { CalendarCard } from "@/components/shared/calendar-card"
import { CalendarHeatmap } from "@/components/shared/calendar-heatmap"
import { RoleDistributionChart, PermissionsByGroupChart, UserActivityChart } from "@/components/access/access-charts"
import { BudgetSection } from "@/components/budget"
import { UserStructureGrowthChart, UsersByStructureOverviewChart, UserDistributionBarChart } from "@/components/charts/dashboard"
import { HierarchicalStructureCard } from "@/components/charts/dashboard/hierarchical-structure-card"
import { StructureBarChart, GrowthLineChart } from "@/components/charts/generic"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// GraphQL Queries
import { GET_INSTITUTIONS_LIGHT_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { GET_REGIONS_QUERY } from "@/graphql/queries/REGIONS_QUERY"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY"
import { GET_ALL_ROLES_QUERY } from "@/graphql/queries/GET_ROLES_QUERY"

import { structureTranslations } from "@/lib/translations/structure"
import { GridContainer } from "@/components/shared/grid-container"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR, nl, enUS } from "date-fns/locale"

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
  const { data: institutionsData, loading: institutionsLoading, refetch: refetchInstitutions } = useQuery(GET_INSTITUTIONS_LIGHT_QUERY)
  const { data: regionsData, loading: regionsLoading, refetch: refetchRegions } = useQuery(GET_REGIONS_QUERY)
  const { data: churchesData, loading: churchesLoading, refetch: refetchChurches } = useQuery(GET_CHURCHES_QUERY)
  const { data: departmentsData, loading: departmentsLoading, refetch: refetchDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: currentInstitutionData?.id }
  })
  const { data: usersData, loading: usersLoading, refetch: refetchUsers } = useQuery(GET_ALL_USERS_QUERY, {
    variables: { institution_id: currentInstitutionData?.id }
  })
  const { data: rolesData, loading: rolesLoading, refetch: refetchRoles } = useQuery(GET_ALL_ROLES_QUERY)

  // Mock Budget KPIs Query - replace with actual hook when available
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

  // Get displayedInstitution from context - use this for institution-specific data
  const displayedInstitution = currentInstitutionData

  // Calculate KPIs - use displayedInstitution when available for better accuracy
  const kpis = useMemo(() => {
    // Use institution-specific data if available
    const institutionUsers = displayedInstitution?.users || allUsers
    const institutionDepts = displayedInstitution?.departments || allDepartments
    const institutionChurches = displayedInstitution?.churches || allChurches
    // Note: regions come from separate query, not from institution object
    const institutionRegions = allRegions

    const activeUsers = institutionUsers.filter((user: any) => !user.is_deleted).length
    const newUsersThisYear = institutionUsers.filter((user: any) => {
      const createdDate = new Date(user.created_at)
      return createdDate.getFullYear() === selectedYear && !user.is_deleted
    }).length
    
    const previousYearUsers = institutionUsers.filter((user: any) => {
      const createdDate = new Date(user.created_at)
      return createdDate.getFullYear() === selectedYear - 1 && !user.is_deleted
    }).length

    const userGrowthRate = previousYearUsers > 0 
      ? Math.round(((newUsersThisYear - previousYearUsers) / previousYearUsers) * 100)
      : 100

    const institutionDepartments = institutionDepts.filter((dept: any) => !dept.church_id && !dept.is_deleted).length
    const churchDepartments = institutionDepts.filter((dept: any) => dept.church_id && !dept.is_deleted).length
    const activeChurches = institutionChurches.filter((c: any) => !c.is_deleted).length
    const activeRegions = institutionRegions.filter((r: any) => !r.is_deleted).length

    return {
      totalInstitutions: displayedInstitution ? 1 : allInstitutions.length,
      totalRegions: activeRegions,
      activeChurches: filteredChurches.length > 0 ? filteredChurches.length : activeChurches,
      totalDepartments: institutionDepartments + churchDepartments,
      institutionDepartments,
      churchDepartments,
      totalUsers: institutionUsers.filter((u: any) => !u.is_deleted).length,
      activeUsers,
      newUsersThisYear,
      userGrowthRate,
      totalRoles: allRoles.length,
      totalPermissions: allRoles.reduce((sum: number, role: any) => {
        return sum + (role.permissions?.reduce((pSum: number, group: any) => pSum + (group.data?.length || 0), 0) || 0)
      }, 0)
    }
  }, [displayedInstitution, allInstitutions, allRegions, allChurches, allDepartments, filteredChurches, allUsers, allRoles, selectedYear])

  // User Growth Over Time (Monthly data for selected year)
  const userGrowthData = useMemo(() => {
    const institutionUsers = displayedInstitution?.users || allUsers
    
    const monthlyData = MONTHS.map((month, index) => ({
      month: month.substring(0, 3),
      users: 0,
      newUsers: 0
    }))

    institutionUsers.forEach((user: any) => {
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
  }, [displayedInstitution, allUsers, selectedYear])

  // User Distribution by Structure
  const userDistributionData = useMemo(() => {
    const distribution: any[] = []
    const institutionUsers = displayedInstitution?.users || filteredUsers
    const institutions = displayedInstitution ? [displayedInstitution] : allInstitutions

    // Group by institution
    const byInstitution: Record<string, number> = {}
    
    institutionUsers.forEach((user: any) => {
      const institutionName = institutions.find((i: any) => i.id === user.institution_id)?.name || 'Unknown'
      byInstitution[institutionName] = (byInstitution[institutionName] || 0) + 1
    })

    Object.entries(byInstitution).forEach(([name, count]) => {
      distribution.push({ name, users: count })
    })

    return distribution
  }, [displayedInstitution, filteredUsers, allInstitutions])

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
                <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">Dashboard</h2>
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
              </Button>
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
          </div>
        </div>

        <Separator />

        {/* Date & Time Display */}
        <DateTimeDisplay 
          locale={currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'nl' ? 'nl-NL' : 'en-US'}
          showSeconds={false}
        />

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
          {/* Quick Actions - Below */}
          <QuickActions 
            actions={quickActions}
            title="Quick Actions:"
            showTitle={true}
            size="sm"
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
                id: "UserStructureGrowthChart-reduced-width",
                component: (
                  <UserStructureGrowthChart
                    loading={isLoading}
                    users={displayedInstitution?.users || allUsers}
                    departments={displayedInstitution?.departments || allDepartments}
                    regions={allRegions}
                    churches={displayedInstitution?.churches || allChurches}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-5",
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
                          users={displayedInstitution?.users || allUsers}
                          institutions={displayedInstitution ? [displayedInstitution] : allInstitutions}
                          departments={displayedInstitution?.departments || allDepartments}
                          regions={allRegions}
                          churches={displayedInstitution?.churches || allChurches}
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
                            description: `${kpis.totalInstitutions} institution${kpis.totalInstitutions !== 1 ? 's' : ''} with ${kpis.institutionDepartments} department${kpis.institutionDepartments !== 1 ? 's' : ''}`,
                            details: 'Top-level organizational units managing all operations',
                            borderColor: 'border-primary/30',
                            indent: 0
                          },
                          {
                            title: 'Regions',
                            icon: Map,
                            description: `${kpis.totalRegions} region${kpis.totalRegions !== 1 ? 's' : ''} managing ${kpis.activeChurches} church${kpis.activeChurches !== 1 ? 'es' : ''}`,
                            details: 'Geographic divisions containing provinces and churches',
                            borderColor: 'border-blue-500/30',
                            indent: 1
                          },
                          {
                            title: 'Churches',
                            icon: Church,
                            description: `${kpis.activeChurches} active church${kpis.activeChurches !== 1 ? 'es' : ''} with ${kpis.churchDepartments} department${kpis.churchDepartments !== 1 ? 's' : ''}`,
                            details: 'Local congregations with specialized ministry departments',
                            borderColor: 'border-green-500/30',
                            indent: 2
                          }
                        ]}
                        footer={
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs font-medium mb-1">Hierarchy Flow:</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              Institution → Regions → Churches → Departments
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
              {
                id: "calendar-combined",
                component: (
                  <div className="flex flex-col h-full space-y-4">
                    {/* Calendar Heatmap - Acima com altura menor */}
                    <div className="flex-shrink-0 h-[200px]">
                      <CalendarHeatmap
                        title={currentLanguage === 'pt' ? 'Mapa de Atividades' : currentLanguage === 'nl' ? 'Activiteitenkaart' : 'Progress year map'}
                        description={currentLanguage === 'pt' ? 'Visualização de atividades ao longo do ano' : currentLanguage === 'nl' ? 'Visualisatie van activiteiten gedurende het jaar' : 'Progress visualization throughout the year'}
                        variant="full"
                        colorScheme="mono"
                        showLegend={true}
                        showNavigation={false}
                        size="sm"
                        containerSize="md"
                        fixedSize={false}
                        locale={currentLanguage}
                        year={selectedYear}
                        className="h-full"
                        onDayClick={(date, activity) => {
                          if (activity && activity.count > 0) {
                            toast.info(`${activity.count} ${currentLanguage === 'pt' ? 'atividades em' : currentLanguage === 'nl' ? 'activiteiten op' : 'activities on'} ${format(date, 'PPP', { locale: currentLanguage === 'pt' ? ptBR : currentLanguage === 'nl' ? nl : enUS })}`)
                          }
                        }}
                      />
                    </div>
                    
                    {/* Calendar Card - Abaixo com altura maior */}
                    <div className="flex-1">
                      <CalendarCard
                        title={currentLanguage === 'pt' ? 'Calendário' : currentLanguage === 'nl' ? 'Kalender' : 'Calendar'}
                        description={currentLanguage === 'pt' ? 'Navegue pelas datas' : currentLanguage === 'nl' ? 'Navigeer door data' : 'Navigate through dates'}
                        locale={currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'nl' ? 'nl-NL' : 'en-US'}
                        className="h-full"
                        onDateSelect={(date) => {
                          if (date) {
                            toast.info(`${currentLanguage === 'pt' ? 'Data selecionada:' : currentLanguage === 'nl' ? 'Geselecteerde datum:' : 'Selected date:'} ${format(date, 'PPP', { locale: currentLanguage === 'pt' ? ptBR : currentLanguage === 'nl' ? nl : enUS })}`)
                          }
                        }}
                      />
                    </div>
                  </div>
                ),
                colSpan: "col-span-12 lg:col-span-3",
              },
            ]}
            gap="lg"
          />
        </div>

        <Separator />

        {/* Section 3: Budget Overview */}
        <BudgetSection
          selectedYear={selectedYear}
          currentLanguage={currentLanguage}
        />

        <Separator />

        {/* Section 4: Users Overview */}
        <div>
          <SectionHeader
            title="Users Overview"
            icon={Users}
            description="User statistics, growth trends and distribution"
          />
          
          <ResponsiveGridCarousel
            enableAutoplay={false}
            gap="gap-6"
            className="w-full"
          >
            {/* User Growth Over Time */}
            <div className="h-full min-h-[400px] md:min-h-[450px] lg:min-h-[500px]">
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
            </div>

            {/* User Distribution by Structure */}
            <div className="h-full min-h-[400px] md:min-h-[450px] lg:min-h-[500px]">
              <UserDistributionBarChart
                users={displayedInstitution?.users || allUsers}
                departments={displayedInstitution?.departments || allDepartments}
                regions={allRegions}
                churches={displayedInstitution?.churches || allChurches}
                institutions={displayedInstitution ? [displayedInstitution] : allInstitutions}
                loading={isLoading}
              />
            </div>
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
