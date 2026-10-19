"use client"

import { AppLayout } from "@/components/layouts/app-layout"
import { useAvailableYears } from "@/hooks/use-available-years"
import { useHasPermission } from "@/hooks/use-has-permission"
import { usePageTitle } from "@/hooks/use-page-title"
import { AvailableYearsEntity } from "@/types/globalTypes"
import { useQuery } from "@apollo/client"
import * as React from "react"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { DateTimeDisplay } from "@/components/shared/date-time-display"
import { FilterConfig, PageFilters } from "@/components/shared/page-filters"
import { DashboardPageSkeleton } from "@/components/shared/page-skeleton"
import { PermissionDeniedOverlay } from "@/components/shared/permission-denied-overlay"
import { ProtectedKPICarousel } from "@/components/shared/protected-kpi-carousel"
import { QuickAction } from "@/components/shared/quick-actions"
import { SectionHeader } from "@/components/shared/section-header"
import { YearFilter } from "@/components/shared/year-filter"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusBadge } from "@/components/ui/status-badge"
import { UseTable } from "@/components/ui/use-table"
import { useCurrency } from "@/contexts/currency-context"
import { useInstitution } from "@/contexts/institution-context"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { InstitutionById_institution_users as User } from "@/types/InstitutionById"
import type { ColumnDef } from "@tanstack/react-table"
import {
  Building,
  Building2,
  Church,
  ContactRound,
  Crown,
  FolderKanban,
  Layers,
  Map,
  MapPin,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Shield,
  Users
} from "lucide-react"
import dynamic from "next/dynamic"
import { toast } from "sonner"

const BudgetOverviewCard = dynamic(() => import("@/components/budget").then(mod => mod.BudgetOverviewCard), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> })

// Only keeping the charts that are actually used in the JSX
const UsersRegistrationOverTimeChart = dynamic(() => import("@/components/institutions/charts").then(mod => mod.UsersRegistrationOverTimeChart), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> })
const UsersByRoleChart = dynamic(() => import("@/components/institutions/charts").then(mod => mod.UsersByRoleChart), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> })
const ProjectsOverTimeChart = dynamic(() => import("@/components/projects/charts/projects-over-time-chart").then(mod => mod.ProjectsOverTimeChart), { ssr: false, loading: () => <Skeleton className="h-[400px] w-full" /> })

// GraphQL Queries
import { GridContainer } from "@/components/shared/grid-container"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_ALL_ROLES_QUERY } from "@/graphql/queries/GET_ROLES_QUERY"
import { GET_INSTITUTIONS_LIGHT_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { GET_REGIONS_QUERY } from "@/graphql/queries/REGIONS_QUERY"
import { GET_DASHBOARD_KPIS } from "@/graphql/queries/DASHBOARD_QUERIES"
import { useProtectedQuery } from "@/hooks/graphql/use-protected-query"
import { dashboardTranslations } from "@/lib/translations/dashboard"

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { currentInstitutionData, refetchInstitutionById } = useInstitution()
  const { formatCurrency, selectedCurrency } = useCurrency()
  const currentLanguage = i18n?.language || 'en'
  const dt = dashboardTranslations[currentLanguage as keyof typeof dashboardTranslations] || dashboardTranslations.en

  // Month names from translations
  const MONTHS = [
    dt.january, dt.february, dt.march, dt.april, dt.may, dt.june,
    dt.july, dt.august, dt.september, dt.october, dt.november, dt.december
  ]

  // Filter States
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [activeTab, setActiveTab] = useState<string>("structure-chart")
  const { availableYears, setAvailableYears } = useAvailableYears([AvailableYearsEntity.INSTITUTION, AvailableYearsEntity.PROJECT, AvailableYearsEntity.USER])

  // Filter values state for PageFilters component
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    month: "all",
    region: "all",
    status: "all"
  })

  // User modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewContactOpen, setIsViewContactOpen] = useState(false)

  // Permissions check
  const canReadInstitutions = useHasPermission([PermissionResolverName.Institutions], [], true)
  const canReadRegions = useHasPermission([PermissionResolverName.Regions], [], true)
  const canReadChurches = useHasPermission([PermissionResolverName.Churches], [], true)
  const canReadDepartments = useHasPermission([PermissionResolverName.Departments], [], true)
  const canReadRoles = useHasPermission([PermissionResolverName.Roles], [], true)
  const canReadSubsidyRequests = useHasPermission([PermissionResolverName.SubsidyRequests], [], true)
  const canReadProjects = useHasPermission([PermissionResolverName.Projects], [], true)

  // GraphQL Queries
  const { data: institutionsData, loading: institutionsLoading, refetch: refetchInstitutions } = useProtectedQuery(GET_INSTITUTIONS_LIGHT_QUERY, [PermissionResolverName.Institutions])
  const { data: regionsData, loading: regionsLoading, refetch: refetchRegions } = useProtectedQuery(GET_REGIONS_QUERY, [PermissionResolverName.Regions])
  const { data: departmentsData, loading: departmentsLoading, refetch: refetchDepartments } = useProtectedQuery(GET_DEPARTMENTS_QUERY, [PermissionResolverName.Departments], {
    variables: { institution_id: currentInstitutionData?.id },
    skip: !currentInstitutionData?.id
  })
  const { data: rolesData, loading: rolesLoading, refetch: refetchRoles } = useProtectedQuery(GET_ALL_ROLES_QUERY, [PermissionResolverName.Roles])
  const { data: allProjectsData, loading: allProjectsLoading } = useQuery(GET_PROJECTS_QUERY, {
    variables: { institutionId: currentInstitutionData?.id },
    skip: !canReadProjects || !currentInstitutionData?.id,
    fetchPolicy: 'cache-and-network'
  })
  const { data: dashboardKPIsData, loading: dashboardKPIsLoading, refetch: refetchDashboardKPIs } = useQuery(GET_DASHBOARD_KPIS, {
    variables: {
      institutionId: currentInstitutionData?.id,
      year: selectedYear,
      month: selectedMonth !== "all" ? parseInt(selectedMonth) : undefined,
    },
    skip: !currentInstitutionData?.id,
    fetchPolicy: 'cache-and-network',
  })


  // Combine critical loading states to ensure shell renders quickly.
  const isLoadingData = institutionsLoading || departmentsLoading || rolesLoading || dashboardKPIsLoading

  // Track initial page load - only show full loading on first load
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const loadingToastId = useRef<string | number | undefined>(undefined)
  const wasLoadingRef = useRef(false)
  const successShownRef = useRef(false)

  // Mark initial load as complete once critical data is loaded
  React.useEffect(() => {
    if (!isLoadingData && isInitialLoad) {
      const timer = setTimeout(() => {
        setIsInitialLoad(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isLoadingData, isInitialLoad])



  // Show loading/success toast tracking isLoadingData transition true→false
  React.useEffect(() => {
    if (successShownRef.current) return

    if (isLoadingData && !wasLoadingRef.current) {
      wasLoadingRef.current = true
      loadingToastId.current = toast.loading(dt.loadingData || 'Loading dashboard...')
    } else if (!isLoadingData && wasLoadingRef.current && loadingToastId.current !== undefined) {
      successShownRef.current = true
      toast.dismiss(loadingToastId.current)
      loadingToastId.current = undefined
      toast.success(dt.dataLoaded || 'Dashboard loaded successfully', { duration: 3000 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingData])

  const isLoading = institutionsLoading || regionsLoading || departmentsLoading || rolesLoading

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
  const allRoles = rolesData?.roles || []

  // KPIs — read directly from backend endpoint (no frontend calculations)
  const kpis = dashboardKPIsData?.dashboardKPIs ?? {
    __typename: "DashboardKPIs" as const,
    totalUsers: 0, newUsersThisYear: 0, previousYearUsers: 0, userGrowthRate: 0,
    totalProjects: 0, newProjectsThisYear: 0, previousYearProjects: 0, projectGrowthRate: 0,
    institutionDepartments: 0, churchDepartments: 0, totalDepartments: 0, activeChurches: 0, totalRegions: 0,
  }

  // Get displayedInstitution from context
  const displayedInstitution = currentInstitutionData

  // Filter ALL projects by year (created_at)
  const allProjectsByYear = React.useMemo(() => {
    const allProjects = allProjectsData?.projects || []
    return allProjects.filter((project: any) => {
      if (!project.created_at) return true
      const projectYear = new Date(project.created_at).getFullYear()
      return projectYear === selectedYear
    })
  }, [allProjectsData, selectedYear])

  const institutionProjects = React.useMemo(() => allProjectsByYear, [allProjectsByYear])

  // Users from current institution — for the users table (TODO: replace with paginated query)
  const allUsersFromInstitutions = React.useMemo(() => {
    const users = currentInstitutionData?.users || []
    return users.filter((user: any) => {
      if (user.is_deleted) return false
      if (user.created_at) {
        const userYear = new Date(user.created_at).getFullYear()
        if (userYear > selectedYear) return false
      }
      return true
    })
  }, [currentInstitutionData, selectedYear])

  const filteredUsers = useMemo(() => {
    const monthFilter = filterValues.month || selectedMonth
    return allUsersFromInstitutions.filter((user: any) => {
      if (!user.created_at) return true
      const createdDate = new Date(user.created_at)
      const yearMatch = createdDate.getFullYear() === selectedYear
      if (monthFilter === "all") return yearMatch
      return yearMatch && createdDate.getMonth() === parseInt(monthFilter)
    })
  }, [allUsersFromInstitutions, selectedYear, selectedMonth, filterValues.month])

  // Departments and churches for getDepartmentInfo (used in users table)
  const allChurchesFromInstitutions = React.useMemo(() =>
    currentInstitutionData?.churches?.filter((c: any) => !c.is_deleted) || [],
    [currentInstitutionData]
  )
  const allDepartmentsFromInstitutions = React.useMemo(() =>
    currentInstitutionData?.departments?.filter((d: any) => !d.is_deleted) || [],
    [currentInstitutionData]
  )

  // Helper function to get department info for users
  const getDepartmentInfo = React.useCallback((user: User) => {
    // Check if user has department_id in church context
    const churchDepartment = allChurchesFromInstitutions
      .flatMap(church => church.departments || [])
      .find(dept => dept.users?.some((u: any) => u.id === user.id))

    if (churchDepartment) {
      return {
        type: 'Church Departmental',
        departmentName: churchDepartment.name,
        departmentId: churchDepartment.id
      }
    }

    // Check if user has department_id in institutional context
    const institutionalDepartment = allDepartmentsFromInstitutions.find(dept =>
      dept.users?.some((u: any) => u.id === user.id)
    )

    if (institutionalDepartment) {
      return {
        type: 'Institutional Departmental',
        departmentName: institutionalDepartment.name,
        departmentId: institutionalDepartment.id
      }
    }

    return {
      type: 'No Departmental',
      departmentName: '-',
      departmentId: null
    }
  }, [allChurchesFromInstitutions, allDepartmentsFromInstitutions])

  // User action handlers
  const handleViewContact = (user: User) => {
    setSelectedUser(user)
    setIsViewContactOpen(true)
  }

  // Calculate KPIs - now provided entirely by backend dashboardKPIs endpoint
  // (kpis is already set above from dashboardKPIsData)



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

  // Department Budget Data
  const departmentBudgetData = useMemo(() => {
    if (!currentInstitutionData?.departments) return []

    return currentInstitutionData.departments.map((department: any) => {
      const annualBudget = department.annual_budgets?.find(
        (budget: any) => budget.year === selectedYear
      )

      return {
        id: department.id,
        departmentId: department.id,
        departmentName: department.name,
        departmentDescription: department.description,
        annualBudget: (annualBudget && annualBudget.has_budget_record) ? {
          id: annualBudget.id,
          allocated_amount: parseFloat(annualBudget.allocated_amount) || 0,
          planned_budget: parseFloat(annualBudget.planned_budget) || 0,
          total_expenses: parseFloat(annualBudget.total_expenses) || 0,
          balance: parseFloat(annualBudget.balance) || 0,
        } : null,
        hasBudgetRecord: annualBudget?.has_budget_record || false,
      }
    })
  }, [currentInstitutionData, selectedYear])


  // Refresh all data
  const handleRefresh = async () => {
    const refreshToast = toast.loading(dt.refreshingData)

    try {
      await Promise.all([
        refetchInstitutions(),
        refetchRegions(),
        refetchDepartments(),
        refetchRoles(),
        refetchDashboardKPIs(),
      ])

      // Refetch institution context data
      await refetchInstitutionById()

      toast.dismiss(refreshToast)
      toast.success(dt.dataRefreshed)
    } catch (error) {
      console.error('Error refreshing data:', error)
      toast.dismiss(refreshToast)
      toast.error(dt.refreshFailed)
    }
  }

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(dt.cannotAddYear.replace('{year}', maxAllowedYear.toString()))
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error(dt.yearExists.replace('{year}', nextYear.toString()))
      return
    }

    setAvailableYears(prev => [...prev, nextYear].sort((a, b) => b - a))
    setSelectedYear(nextYear)
    toast.success(dt.yearAdded.replace('{year}', nextYear.toString()))
  }

  // Filter configuration for PageFilters component
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: "month",
      label: dt.month,
      type: "select",
      placeholder: dt.month,
      defaultValue: "all",
      options: [
        { label: dt.allMonths, value: "all" },
        ...MONTHS.map((month, index) => ({
          label: month,
          value: index.toString()
        }))
      ]
    },
    {
      id: "region",
      label: dt.region,
      type: "select",
      placeholder: dt.region,
      icon: MapPin,
      defaultValue: "all",
      description: dt.filterByRegion,
      options: [
        { label: dt.allRegions, value: "all" },
        ...allRegions.map((region: any) => ({
          label: region.name,
          value: region.id
        }))
      ]
    },
    {
      id: "status",
      label: dt.statusFilter,
      type: "select",
      placeholder: dt.statusFilter,
      icon: Shield,
      defaultValue: "all",
      description: dt.filterByStatus,
      options: [
        { label: dt.all, value: "all" },
        { label: dt.active, value: "true" },
        { label: dt.inactive, value: "false" }
      ]
    }
  ], [allRegions, dt])

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
    setFilterValues({ month: "all", region: "all", status: "all" })
    setSelectedMonth("all")
    setSelectedRegion("all")
    toast.success(dt.filtersCleared)
  }

  // Quick Actions Configuration
  const quickActions: QuickAction[] = [
    {
      id: "new-user",
      label: dt.newUser,
      icon: Plus,
      onClick: () => {
        toast.info(dt.newUserModalComingSoon)
      }
    },
    {
      id: "new-project",
      label: dt.newProject,
      icon: Plus,
      onClick: () => {
        toast.info(dt.newProjectModalComingSoon)
      }
    },
    {
      id: "new-institution",
      label: dt.newInstitution,
      icon: Building2,
      onClick: () => {
        toast.info(dt.newInstitutionModalComingSoon)
      }
    },
    {
      id: "new-church",
      label: dt.newChurch,
      icon: Church,
      onClick: () => {
        toast.info(dt.newChurchModalComingSoon)
      }
    }
  ]

  // Handle add year
  const handleAddYearCallback = (newYear: number) => {
    setAvailableYears(prev => [...prev, newYear].sort((a, b) => b - a))
    setSelectedYear(newYear)
  }

  // User table columns
  const userColumns: ColumnDef<User>[] = [
    {
      id: "user",
      accessorKey: "name",
      header: dt.name,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 border-2 border-border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.email}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "church_name",
      accessorKey: "church.name",
      header: () => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          <span>{dt.church}</span>
        </div>
      ),
      cell: ({ row }) => {
        const churchName = row.original.church?.name

        if (!churchName) {
          return <StatusBadge label={dt.noChurch} variant="neutral" size="sm" />
        }

        return <StatusBadge label={churchName} variant="info" size="sm" icon={Building2} />
      },
    },
    {
      id: "department_type",
      header: dt.departmentType,
      cell: ({ row }) => {
        const user = row.original
        const deptInfo = getDepartmentInfo(user)

        if (deptInfo.type === 'No Departmental') {
          return <StatusBadge label={dt.noDepartmental} variant="neutral" size="sm" />
        } else if (deptInfo.type === 'Church Departmental') {
          return <StatusBadge label={dt.churchDepartmental} variant="info" size="sm" icon={Building2} />
        } else {
          return <StatusBadge label={dt.institutionalDepartmental} variant="default" size="sm" icon={Building} />
        }
      },
    },
    {
      id: "department_name",
      header: () => (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" />
          <span>{dt.department}</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        const deptInfo = getDepartmentInfo(user)

        if (deptInfo.type === 'No Departmental' || deptInfo.departmentName === '-') {
          return <StatusBadge label={dt.noDepartment} variant="neutral" size="sm" />
        }

        const icon = deptInfo.type === 'Church Departmental' ? Building2 : Building

        return <StatusBadge label={deptInfo.departmentName} variant="default" size="sm" icon={icon} />
      },
    },
    {
      id: "roles",
      header: dt.roles,
      cell: ({ row }) => {
        const user = row.original

        if (!user.user_roles || user.user_roles.length === 0) {
          return <StatusBadge label={dt.noRole} variant="neutral" size="sm" />
        }

        return (
          <div className="flex flex-wrap gap-1">
            {user.user_roles?.map((userRole: any) => {
              const isAdmin = userRole.role.key_code === 'ADMIN'
              return (
                <StatusBadge
                  key={userRole.id}
                  label={userRole.role.name}
                  variant="neutral"
                  icon={isAdmin ? Crown : Shield}
                  size="sm"
                />
              )
            })}
          </div>
        )
      },
    },
    {
      id: "status",
      header: dt.status,
      cell: ({ row }) => {
        const user = row.original
        return (
          <StatusBadge
            label={user.is_deleted ? dt.inactive : dt.active}
            variant={user.is_deleted ? 'error' : 'success'}
            showDot
            size="sm"
          />
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{dt.actions}</div>,
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-end" data-action-button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewContact(user)}>
                  <ContactRound className="mr-2 h-4 w-4" />
                  {dt.viewContact}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Show skeleton layout while data loads — keeps the page visible
  if (isInitialLoad || isLoadingData) {
    return <DashboardPageSkeleton />
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
                <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">{dt.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {dt.subtitle} {selectedYear}
                  {selectedMonth !== "all" && ` - ${MONTHS[parseInt(selectedMonth)]}`}
                  {selectedRegion !== "all" && ` - ${allRegions.find((r: any) => r.id === selectedRegion)?.name || dt.region}`}
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
                  triggerLabel={dt.filters}
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

          {/* Year Filter and Action Buttons Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Year Filter - Left Side */}
            <div className="flex-1 w-full flex justify-between items-center">
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



        {/* Section 1: System Overview KPIs */}
        <div>
          <SectionHeader
            title={dt.systemOverview}
            icon={Building2}
            description={dt.systemOverviewDescription}
          />

          {/* 
            Carrossel de KPIs Protegidos com Privacy Protection
            
            Cada KPI é protegido individualmente por permissões específicas:
            - ✅ Com permissão: Exibe dados reais
            - 🔒 Sem permissão: Exibe skeleton com overlay "Acesso Negado"
            - 📊 Sempre renderiza: Mantém layout consistente
            
            Permissões por KPI:
            - Total Projects: [Projects, Departments]
            - Total Users: Users
            - Institution Departments: InstitutionalDepartmentsKpIs
            - Church Departments: DepartmentKpIs
            - Total Churches: Churches
            - Total Regions: Regions
          */}
          <ProtectedKPICarousel
            data={[
              {
                id: "total-projects",
                title: dt.totalProjects,
                value: kpis.totalProjects,
                icon: FolderKanban,
                subtitle: `${kpis.newProjectsThisYear ?? 0} ${dt.totalProjectsSubtitle} ${selectedYear}`,
                trend: {
                  value: kpis.projectGrowthRate ?? 0,
                  isPositive: (kpis.projectGrowthRate ?? 0) >= 0
                },
                requiredPermission: [PermissionResolverName.Projects, PermissionResolverName.Departments]
              },
              {
                id: "total-users",
                title: dt.totalUsers,
                value: kpis.totalUsers,
                icon: Users,
                subtitle: `${kpis.newUsersThisYear ?? 0} ${dt.totalUsersSubtitle} ${selectedYear}`,
                trend: {
                  value: kpis.userGrowthRate ?? 0,
                  isPositive: (kpis.userGrowthRate ?? 0) >= 0
                },
                requiredPermission: PermissionResolverName.Users
              },
              {
                id: "institution-departments",
                title: dt.institutionDepartments,
                value: kpis.institutionDepartments,
                icon: Building,
                subtitle: dt.institutionDepartmentsSubtitle,
                trend: {
                  value: 0,
                  isPositive: true
                },
                requiredPermission: PermissionResolverName.InstitutionalDepartmentsKpIs
              },
              {
                id: "church-departments",
                title: dt.churchDepartments,
                value: kpis.churchDepartments,
                icon: Layers,
                subtitle: dt.churchDepartmentsSubtitle,
                trend: {
                  value: 0,
                  isPositive: true
                },
                requiredPermission: PermissionResolverName.DepartmentKpIs
              },
              {
                id: "total-churches",
                title: dt.totalChurches,
                value: kpis.activeChurches,
                icon: Church,
                subtitle: selectedRegion === "all" ? dt.totalChurchesSubtitle : dt.totalChurchesSubtitleRegion,
                trend: {
                  value: 0,
                  isPositive: true
                },
                requiredPermission: PermissionResolverName.Churches
              },
              {
                id: "total-regions",
                title: dt.totalRegions,
                value: kpis.totalRegions,
                icon: Map,
                subtitle: dt.totalRegionsSubtitle,
                trend: {
                  value: 0,
                  isPositive: true
                },
                requiredPermission: PermissionResolverName.Regions
              }
            ]}
            showCarousel={true}
            minCardsForCarousel={4}
            isLoading={isLoading}
            skeletonCount={6}
          />
          {/* Quick Actions - Below */}
          {/* <QuickActions 
            actions={quickActions}
            title="Quick Actions:"
            showTitle={true}
            size="sm"
          /> */}
        </div>

        {/* Date & Time Display */}
        <DateTimeDisplay
          locale={currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'nl' ? 'nl-NL' : 'en-US'}
          showSeconds={false}
        />

        <GridContainer
          items={[
            {
              id: "projects-over-time-chart",
              component: (
                <ProjectsOverTimeChart
                  data={institutionProjects}
                  institutions={displayedInstitution ? [displayedInstitution] : allInstitutions}
                  loading={allProjectsLoading}
                  selectedYear={selectedYear}
                />
              ),
              colSpan: "col-span-12 lg:col-span-8",
            },
            {
              id: "budget-overview-card",
              component: (
                <>
                  {currentInstitutionData && (
                    <BudgetOverviewCard
                      institutionId={currentInstitutionData.id}
                      year={selectedYear}
                      currentLanguage={currentLanguage}
                      departmentBudgetData={departmentBudgetData}
                    />
                  )
                  }
                </>
              ),
              colSpan: "col-span-12 lg:col-span-4",
            },
          ]}
          gap="lg"
        />

        <Separator />

        <GridContainer
          items={[
            // {
            //   id: "activity-heatmap-card",
            //   component: (
            //     <ChurchesByRegionChart
            //       churches={displayedInstitution?.churches || allChurches}
            //       regions={allRegions}
            //       loading={allInstitutionsLoading || regionsLoading}
            //     />
            //   ),
            //   colSpan: "col-span-12 lg:col-span-4",
            // },
            {
              id: "institution-leaders-card",
              component: (
                <UsersByRoleChart
                  showTopNFilter={false}
                  showSortFilter={false}
                  showRoleSelector={false}
                  data={displayedInstitution?.institutionChartsData?.usersByRole}
                  loading={institutionsLoading || rolesLoading}
                  selectedYear={selectedYear}
                />
              ),
              colSpan: "col-span-12 lg:col-span-4",
            },
            {
              id: "users-registration-over-time-chart",
              component: (
                <UsersRegistrationOverTimeChart
                  institutions={displayedInstitution ? [displayedInstitution] : []}
                  monthlyData={displayedInstitution?.institutionChartsData?.monthlyUserRegistrations}
                  loading={institutionsLoading}
                  selectedYear={selectedYear}
                />
              ),
              colSpan: "col-span-12 lg:col-span-8",
            },


          ]}
          gap="lg"
        />

        <Separator />

        {/* Users Table */}
        <WithPermission
          requiredPermissions={[PermissionResolverName.Users]}
          fallback={
            <PermissionDeniedOverlay height="600px" blurIntensity="medium">
              {/* Skeleton da tabela de usuários */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="overflow-hidden p-0">
                  <div className="p-6 space-y-4">
                    {/* Search bar skeleton */}
                    <Skeleton className="h-10 w-full" />
                    {/* Table header skeleton */}
                    <div className="border rounded-lg">
                      <div className="p-4 border-b">
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                      </div>
                      {/* Table rows skeleton */}
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 border-b flex gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                      ))}
                    </div>
                    {/* Pagination skeleton */}
                    <div className="flex justify-between items-center pt-4">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-4 w-40" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </PermissionDeniedOverlay>
          }
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {dt.allUsers}
                  </CardTitle>
                  <CardDescription>
                    {dt.allUsersDescription} {selectedYear}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="overflow-hidden p-0">
              <UseTable
                columns={userColumns}
                data={filteredUsers}
                searchKey="name"
                emptyMessage={dt.noUsersFound}
                emptyEntityName={dt.emptyUser}
              />
            </CardContent>
          </Card>
        </WithPermission>

        {/* Contact View Modal */}
        {selectedUser && (
          <React.Suspense fallback={<div>Loading...</div>}>
            {(() => {
              const ContactViewEditModal = React.lazy(() =>
                import("@/components/modals/contact/contact-view-edit-modal").then(module => ({
                  default: module.ContactViewEditModal
                }))
              )

              return (
                <ContactViewEditModal
                  isOpen={isViewContactOpen}
                  onOpenChange={setIsViewContactOpen}
                  contact={{
                    __typename: 'Contact',
                    id: selectedUser.contact_id || '',
                    name: selectedUser.name,
                    email: selectedUser.email,
                    phone: null,
                    mobile: null,
                    country: null,
                    city: null,
                    address: null,
                    full_address: null,
                    postal_code: null,
                    website: null,
                    notes: null,
                    is_primary: true,
                    is_deleted: selectedUser.is_deleted,
                    created_at: selectedUser.created_at,
                    updated_at: selectedUser.updated_at,
                    created_by: selectedUser.created_by,
                    updated_by: selectedUser.updated_by,
                    deleted_at: selectedUser.deleted_at,
                    deleted_by: selectedUser.deleted_by,
                    _count: {
                      __typename: 'ContactCount',
                      Church: 0,
                      Department: 0,
                      Event: 0,
                      User: 1
                    }
                  }}
                  entityName={selectedUser.name}
                  entityType="User"
                  readonly={true}
                  updateMutation={async () => ({ data: undefined })}
                  entityId={selectedUser.id}
                />
              )
            })()}
          </React.Suspense>
        )}
      </div>
    </AppLayout>
  )
}
