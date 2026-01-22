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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  DollarSign,
  FolderKanban,
  Layers,
  MoreHorizontal,
  Edit,
  Trash2,
  ContactRound,
  UserX
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
import { BudgetOverviewCard } from "@/components/budget"
import { SpendingOverTimeChart } from "@/components/charts/annual-budget/spending-over-time-chart"
import { UserStructureGrowthChart, UsersByStructureOverviewChart, UserDistributionBarChart } from "@/components/charts/dashboard"
import { UsersRegistrationOverTimeChart, UsersByRoleChart, ChurchesByRegionChart } from "@/components/institutions/charts"
import { InstitutionLeadersCard } from "@/components/institutions/institution-leaders-card"
import { ActivityHeatmapCard } from "@/components/institutions/activity-heatmap-card"
import { ProjectsOverTimeChart } from "@/components/projects/charts/projects-over-time-chart"
import { HierarchicalStructureCard } from "@/components/charts/dashboard/hierarchical-structure-card"
import { StructureBarChart, GrowthLineChart } from "@/components/charts/generic"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { UseTable } from "@/components/ui/use-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionDeniedOverlay } from "@/components/shared/permission-denied-overlay"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { ProtectedKPICard } from "@/components/shared/protected-kpi-card"
import { ProtectedKPICarousel, type ProtectedKPICardData } from "@/components/shared/protected-kpi-carousel"
import type { ColumnDef } from "@tanstack/react-table"
import { InstitutionById_institution_users as User } from "@/types/InstitutionById"

// GraphQL Queries
import { GET_INSTITUTIONS_LIGHT_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { GET_REGIONS_QUERY } from "@/graphql/queries/REGIONS_QUERY"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY"
import { GET_ALL_ROLES_QUERY } from "@/graphql/queries/GET_ROLES_QUERY"
import { GET_ALL_SUBSIDY_REQUESTS } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_SUBSIDY_STATUS_HISTORY } from "@/graphql/queries/SUBSIDY_STATUS_HISTORY_QUERIES"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { GET_INSTITUTIONS_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { structureTranslations } from "@/lib/translations/structure"
import { dashboardTranslations } from "@/lib/translations/dashboard"
import { GridContainer } from "@/components/shared/grid-container"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR, nl, enUS } from "date-fns/locale"

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const { currentInstitutionData, institutions } = useInstitution()  
  const { formatCurrency, selectedCurrency } = useCurrency()
  const currentLanguage = i18n?.language || 'en'
  const ts = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en
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
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const current = new Date().getFullYear()
    return [current, current - 1, current - 2]
  })

  // Filter values state for PageFilters component
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    month: "all",
    region: "all",
    status: "all"
  })

  // User modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isViewContactOpen, setIsViewContactOpen] = useState(false)

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
  const { data: subsidyData, loading: subsidyLoading } = useQuery(GET_ALL_SUBSIDY_REQUESTS)
  const { data: subsidyStatusHistoryData, loading: subsidyStatusLoading } = useQuery(GET_SUBSIDY_STATUS_HISTORY, {
    variables: { subsidyRequestId: "ALL" },
    skip: !subsidyData?.subsidyRequests?.length,
  })
  const { data: allProjectsData, loading: allProjectsLoading } = useQuery(GET_PROJECTS_QUERY, {
    variables: { institutionId: currentInstitutionData?.id },
    skip: !currentInstitutionData?.id,
    fetchPolicy: 'cache-and-network'
  })
  const { data: allInstitutionsData, loading: allInstitutionsLoading } = useQuery(GET_INSTITUTIONS_QUERY, {
    fetchPolicy: 'cache-and-network'
  })

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

  // Process institutions data with complete information (from GET_INSTITUTIONS_QUERY with full data)
  const institutionsWithUsers = React.useMemo(() => {
    return allInstitutionsData?.institutions || []
  }, [allInstitutionsData])

  // Filter ALL projects by year (created_at)
  const allProjectsByYear = React.useMemo(() => {
    const allProjects = allProjectsData?.projects || []
    return allProjects.filter((project: any) => {
      if (!project.created_at) return true
      const projectYear = new Date(project.created_at).getFullYear()
      return projectYear === selectedYear
    })
  }, [allProjectsData, selectedYear])

  // Process projects data for the current institution (filtered by year)
  const institutionProjects = React.useMemo(() => {
    return allProjectsByYear
  }, [allProjectsByYear])

  // Filter institutions by year (based on created_at) - following institutions page pattern
  const institutionsByYear = React.useMemo(() => {
    return institutionsWithUsers.filter((institution: any) => {
      if (!institution.created_at) return true
      const institutionYear = new Date(institution.created_at).getFullYear()
      return institutionYear <= selectedYear // Include all institutions created up to selected year
    })
  }, [institutionsWithUsers, selectedYear])

  // Apply PageFilters to data - following institutions page pattern
  const filteredInstitutionsByYear = React.useMemo(() => {
    let filtered = institutionsByYear
    
    // Filter by status (active/inactive)
    const statusFilter = filterValues.status || "all"
    if (statusFilter !== "all") {
      const isActive = statusFilter === "true"
      filtered = filtered.filter((inst: any) => !inst.is_deleted === isActive)
    }
    
    return filtered
  }, [institutionsByYear, filterValues])

  // Extract ALL users from filtered institutions (filtered by created_at year)
  // CORRIGIDO: Usa allUsers da query diretamente se disponível, senão extrai de institutions
  const allUsersFromInstitutions = React.useMemo(() => {
    // Se temos users direto da query, use-os (mais rápido e confiável)
    if (allUsers && allUsers.length > 0) {
      console.log('📊 [Dashboard] Usando users direto da query:', allUsers.length)
      return allUsers.filter((user: any) => {
        if (user.is_deleted) return false
        
        // Filter users by created_at year
        if (user.created_at) {
          const userYear = new Date(user.created_at).getFullYear()
          if (userYear > selectedYear) return false
        }
        
        return true
      })
    }
    
    // Fallback: Extrair de institutions (caso allUsers não esteja disponível)
    console.log('📊 [Dashboard] Extraindo users de institutions:', filteredInstitutionsByYear.length)
    const users: any[] = []
    filteredInstitutionsByYear.forEach((institution: any) => {
      if (institution.users) {
        institution.users.forEach((user: any) => {
          if (!user.is_deleted) {
            // Filter users by created_at year (users created up to selected year)
            if (user.created_at) {
              const userYear = new Date(user.created_at).getFullYear()
              if (userYear > selectedYear) return // Skip users created after selected year
            }
            
            users.push(user)
          }
        })
      }
    })
    console.log('📊 [Dashboard] Total users extraídos:', users.length)
    return users
  }, [allUsers, filteredInstitutionsByYear, selectedYear])

  // Filter users by selected year and month
  const filteredUsers = useMemo(() => {
    const monthFilter = filterValues.month || selectedMonth
    return allUsersFromInstitutions.filter((user: any) => {
      if (!user.created_at) return true
      const createdDate = new Date(user.created_at)
      const yearMatch = createdDate.getFullYear() === selectedYear
      
      if (monthFilter === "all") return yearMatch
      
      const monthMatch = createdDate.getMonth() === parseInt(monthFilter)
      return yearMatch && monthMatch
    })
  }, [allUsersFromInstitutions, selectedYear, selectedMonth, filterValues.month])

  // Extract ALL churches from filtered institutions
  const allChurchesFromInstitutions = React.useMemo(() => {
    const churches: any[] = []
    filteredInstitutionsByYear.forEach((institution: any) => {
      if (institution.churches) {
        institution.churches.forEach((church: any) => {
          if (!church.is_deleted) {
            churches.push(church)
          }
        })
      }
    })
    return churches
  }, [filteredInstitutionsByYear])

  // Filter churches by region
  const filteredChurches = useMemo(() => {
    const regionFilter = filterValues.region || selectedRegion
    let filtered = allChurchesFromInstitutions
    
    if (regionFilter !== "all") {
      filtered = filtered.filter((church: any) => church.region_id === regionFilter)
    }
    
    return filtered
  }, [allChurchesFromInstitutions, selectedRegion, filterValues.region])

  // Extract ALL departments from filtered institutions
  const allDepartmentsFromInstitutions = React.useMemo(() => {
    const departments: any[] = []
    filteredInstitutionsByYear.forEach((institution: any) => {
      if (institution.departments) {
        institution.departments.forEach((dept: any) => {
          if (!dept.is_deleted) {
            departments.push({
              ...dept,
              institution_id: institution.id,
              institution_name: institution.name
            })
          }
        })
      }
    })
    return departments
  }, [filteredInstitutionsByYear])

  // Separate Institution Departments (departments WITHOUT church_id)
  const institutionDepartmentsList = React.useMemo(() => {
    return allDepartmentsFromInstitutions.filter((dept: any) => !dept.church_id)
  }, [allDepartmentsFromInstitutions])

  // Extract Church Departments DIRECTLY from churches.departments (following church-departments pattern)
  const churchDepartmentsList = React.useMemo(() => {
    const churchDepartments: any[] = []
    
    filteredInstitutionsByYear.forEach((institution: any) => {
      if (institution.churches) {
        institution.churches.forEach((church: any) => {
          if (!church.is_deleted && church.departments) {
            church.departments.forEach((dept: any) => {
              if (!dept.is_deleted) {
                churchDepartments.push({
                  ...dept,
                  church_id: church.id,
                  church_name: church.name,
                  institution_id: institution.id,
                  institution_name: institution.name
                })
              }
            })
          }
        })
      }
    })
    
    return churchDepartments
  }, [filteredInstitutionsByYear])

  // Extract active regions (filtered by year)
  const activeRegions = React.useMemo(() => {
    return allRegions.filter((r: any) => {
      if (r.is_deleted) return false
      
      // Filter regions by created_at year (regions created up to selected year)
      if (r.created_at) {
        const regionYear = new Date(r.created_at).getFullYear()
        return regionYear <= selectedYear
      }
      
      return true // Include regions without created_at
    })
  }, [allRegions, selectedYear])

  // Get displayedInstitution from context - use this for institution-specific data
  const displayedInstitution = currentInstitutionData

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

  // Calculate KPIs - use filtered data by year and filters
  const kpis = useMemo(() => {
    // Use institution-specific data if available, otherwise use filtered data
    const institutionUsers = displayedInstitution?.users?.filter((u: any) => !u.is_deleted) || allUsersFromInstitutions
    const institutionDepts = displayedInstitution?.departments?.filter((d: any) => !d.is_deleted) || allDepartmentsFromInstitutions
    const institutionChurches = displayedInstitution?.churches?.filter((c: any) => !c.is_deleted) || allChurchesFromInstitutions
    
    // Projects - use filtered by year
    const totalProjects = allProjectsByYear.length
    const activeProjects = allProjectsByYear.filter((p: any) => p.status === 'active' || p.status === 'in_progress').length
    
    // Projects created this year (new projects)
    const newProjectsThisYear = allProjectsByYear.filter((p: any) => {
      if (!p.created_at) return false
      return new Date(p.created_at).getFullYear() === selectedYear
    }).length
    
    // Projects from previous year for growth calculation
    const previousYearProjects = (allProjectsData?.projects || []).filter((p: any) => {
      if (!p.created_at) return false
      return new Date(p.created_at).getFullYear() === selectedYear - 1
    }).length
    
    const projectGrowthRate = previousYearProjects > 0 
      ? Math.round(((newProjectsThisYear - previousYearProjects) / previousYearProjects) * 100)
      : newProjectsThisYear > 0 ? 100 : 0

    // Users calculations
    const activeUsers = institutionUsers.length
    const newUsersThisYear = institutionUsers.filter((user: any) => {
      if (!user.created_at) return false
      return new Date(user.created_at).getFullYear() === selectedYear
    }).length
    
    const previousYearUsers = (displayedInstitution?.users || allUsersFromInstitutions).filter((user: any) => {
      if (!user.created_at || user.is_deleted) return false
      return new Date(user.created_at).getFullYear() === selectedYear - 1
    }).length

    const userGrowthRate = previousYearUsers > 0 
      ? Math.round(((newUsersThisYear - previousYearUsers) / previousYearUsers) * 100)
      : newUsersThisYear > 0 ? 100 : 0

    // Departments calculations
    const institutionDepartmentsCount = institutionDepartmentsList.length
    const churchDepartmentsCount = churchDepartmentsList.length
    
    // Churches and regions
    const activeChurchesCount = filteredChurches.length
    const activeRegionsCount = activeRegions.length
    
    // Debug: Log KPI data to verify correct extraction and year filtering
    console.log('📊 [Dashboard KPIs] Data Summary:', {
      selectedYear,
      totalUsers: activeUsers,
      totalRegions: activeRegionsCount,
      departments: {
        institutionDepartments: institutionDepartmentsCount,
        churchDepartments: churchDepartmentsCount,
        totalDepartments: institutionDepartmentsCount + churchDepartmentsCount,
        institutionDeptsSample: institutionDepartmentsList.slice(0, 3).map((d: any) => ({ 
          id: d.id, 
          name: d.name, 
          church_id: d.church_id,
          institution_name: d.institution_name 
        })),
        churchDeptsSample: churchDepartmentsList.slice(0, 3).map((d: any) => ({ 
          id: d.id, 
          name: d.name, 
          church_id: d.church_id,
          church_name: d.church_name,
          institution_name: d.institution_name 
        }))
      }
    })

    return {
      // Projects KPIs
      totalProjects,
      activeProjects,
      newProjectsThisYear,
      projectGrowthRate,
      
      // Users KPIs
      totalUsers: activeUsers,
      activeUsers,
      newUsersThisYear,
      userGrowthRate,
      
      // Structure KPIs
      totalInstitutions: filteredInstitutionsByYear.length,
      institutionDepartments: institutionDepartmentsCount,
      churchDepartments: churchDepartmentsCount,
      totalDepartments: institutionDepartmentsCount + churchDepartmentsCount,
      activeChurches: activeChurchesCount,
      totalRegions: activeRegionsCount,
      
      // Roles & Permissions
      totalRoles: allRoles.length,
      totalPermissions: allRoles.reduce((sum: number, role: any) => {
        return sum + (role.permissions?.reduce((pSum: number, group: any) => pSum + (group.data?.length || 0), 0) || 0)
      }, 0)
    }
  }, [
    displayedInstitution,
    filteredInstitutionsByYear,
    allUsersFromInstitutions,
    allDepartmentsFromInstitutions,
    allChurchesFromInstitutions,
    institutionDepartmentsList,
    churchDepartmentsList,
    filteredChurches,
    activeRegions,
    allProjectsByYear,
    allProjectsData,
    allRoles,
    selectedYear
  ])

  // User Growth Over Time (Monthly data for selected year)
  const userGrowthData = useMemo(() => {
    const institutionUsers = displayedInstitution?.users?.filter((u: any) => !u.is_deleted) || allUsersFromInstitutions
    
    const monthlyData = MONTHS.map((month, index) => ({
      month: month.substring(0, 3),
      users: 0,
      newUsers: 0
    }))

    institutionUsers.forEach((user: any) => {
      if (!user.created_at) return
      const createdDate = new Date(user.created_at)
      if (createdDate.getFullYear() === selectedYear) {
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
  }, [displayedInstitution, allUsersFromInstitutions, selectedYear])

  // User Distribution by Structure
  const userDistributionData = useMemo(() => {
    const distribution: any[] = []
    const institutionUsers = displayedInstitution?.users?.filter((u: any) => !u.is_deleted) || allUsersFromInstitutions
    const institutions = displayedInstitution ? [displayedInstitution] : filteredInstitutionsByYear

    // Group by institution
    const byInstitution: Record<string, number> = {}
    
    institutionUsers.forEach((user: any) => {
      const institutionName = user.institution?.name || 'Unknown'
      byInstitution[institutionName] = (byInstitution[institutionName] || 0) + 1
    })

    Object.entries(byInstitution).forEach(([name, count]) => {
      distribution.push({ name, value: count })
    })

    return distribution
  }, [displayedInstitution, allUsersFromInstitutions, filteredInstitutionsByYear])

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

  // Spending Over Time Data
  const spendingOverTimeData = useMemo(() => {
    const findRealApprovalDate = (subsidyId: string, subsidyApprovedAt: string | null, subsidyUpdatedAt: string) => {
      if (subsidyApprovedAt) return subsidyApprovedAt

      if (subsidyStatusHistoryData?.getSubsidyStatusHistory) {
        const approvalHistory = subsidyStatusHistoryData.getSubsidyStatusHistory.find((history: any) => 
          history.subsidy_request_id === subsidyId && 
          ['APPROVED', 'CLOSED'].includes(history.status?.name?.toUpperCase())
        )
        if (approvalHistory) return approvalHistory.changed_at
      }
      return subsidyUpdatedAt
    }

    if (!subsidyData?.subsidyRequests) return []

    const allMonths = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ]

    // Use Record instead of Map for better TypeScript compatibility
    const monthlySpending: Record<string, any> = {}
    allMonths.forEach((month, index) => {
      const date = new Date(selectedYear, index, 1)
      monthlySpending[month] = {
        month: month,
        date: format(date, 'yyyy-MM-dd'),
        departments: []
      }
    })

    const approvedSubsidies = subsidyData.subsidyRequests.filter((subsidy: any) => {
      const statusMatch = ['APPROVED', 'CLOSED'].includes(subsidy.subsidy_status?.name)
      const hasDepartment = subsidy.department_id
      return statusMatch && hasDepartment
    })

    approvedSubsidies.forEach((subsidy: any) => {
      const deptId = subsidy.department_id
      const deptName = subsidy.department?.name || `Departamento ${deptId}`
      const approvalDate = findRealApprovalDate(subsidy.id, subsidy.approved_at, subsidy.updated_at)
      const approvedAmount = parseFloat(subsidy.approved_amount) || parseFloat(subsidy.total_budget) || 0

      if (approvalDate && new Date(approvalDate).getFullYear() === selectedYear) {
        const monthKey = format(new Date(approvalDate), 'MMM', { locale: ptBR })
        const normalizedMonthKey = monthKey.charAt(0).toUpperCase() + monthKey.slice(1)

        if (monthlySpending[normalizedMonthKey]) {
          const monthData = monthlySpending[normalizedMonthKey]
          let deptIndex = monthData.departments.findIndex((d: any) => d.departmentId === deptId)
          
          if (deptIndex === -1) {
            monthData.departments.push({
              departmentId: deptId,
              departmentName: deptName,
              amount: approvedAmount
            })
          } else {
            monthData.departments[deptIndex].amount += approvedAmount
          }
        }
      }
    })

    return Object.values(monthlySpending)
  }, [subsidyData, subsidyStatusHistoryData, selectedYear])

  // Refresh all data
  const handleRefresh = async () => {
    const refreshToast = toast.loading(dt.refreshingData)
    
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
      toast.success(dt.dataRefreshed)
    } catch (error) {
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
          <div/>

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

          {/* Carrossel de KPIs protegidos com permissões individuais */}
          <ProtectedKPICarousel
            data={[
              {
                id: "total-projects",
                title: dt.totalProjects,
                value: kpis.totalProjects,
                icon: FolderKanban,
                subtitle: `${kpis.newProjectsThisYear} ${dt.totalProjectsSubtitle} ${selectedYear}`,
                trend: {
                  value: kpis.projectGrowthRate,
                  isPositive: kpis.projectGrowthRate >= 0
                },
                requiredPermission: [PermissionResolverName.Projects, PermissionResolverName.Departments]
              },
              {
                id: "total-users",
                title: dt.totalUsers,
                value: kpis.totalUsers,
                icon: Users,
                subtitle: `${kpis.newUsersThisYear} ${dt.totalUsersSubtitle} ${selectedYear}`,
                trend: {
                  value: kpis.userGrowthRate,
                  isPositive: kpis.userGrowthRate >= 0
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
                id: "projects-over-time-chart",
                component: (
                  <>
                    { currentInstitutionData && (
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
                    users={displayedInstitution?.users || allUsers}
                    loading={allInstitutionsLoading || rolesLoading}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-4",
              },
              {
                id: "users-registration-over-time-chart",
                component: (
                  <UsersRegistrationOverTimeChart
                    institutions={displayedInstitution ? [displayedInstitution] : allInstitutions}
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
                  data={allUsersFromInstitutions}
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
