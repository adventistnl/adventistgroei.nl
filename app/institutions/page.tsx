"use client"

import React, { useState, useMemo, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@apollo/client"
import { ColumnDef } from "@tanstack/react-table"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Layouts & Hooks
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { useInstitution } from "@/contexts/institution-context"
import { useInstitutionKPI } from "@/hooks/KPI/use-institution-kpi"

// UI Components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { UseTable } from "@/components/ui/use-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Icons
import { 
  Building,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Church,
  Globe,
  Shield,
  RefreshCw,
  Home,
  Layers,
  DollarSign,
  ChevronRight,
  Calendar
} from "lucide-react"

// Utils & Config
import { cn } from "@/lib/utils"
import { createPrivacyConfig } from "@/config/privacy-roles.config"

// Shared Components
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { GridContainer } from "@/components/shared/grid-container"
import { EntityInfoCard, EntityInfoCardAction } from "@/components/shared/entity-info-card"
import { ChartHeader } from "@/components/charts/chart-header"
import { YearFilter } from "@/components/shared/year-filter"

// Modals - Lazy loaded
const ContactViewEditModal = React.lazy(() => import("@/components/modals/contact").then(module => ({ default: module.ContactViewEditModal })))
const EditInstitutionModal = React.lazy(() => import("@/components/modals/institution").then(module => ({ default: module.EditInstitutionModal })))
const DeleteInstitutionModal = React.lazy(() => import("@/components/modals/institution").then(module => ({ default: module.DeleteInstitutionModal })))
const RegisterInstitutionModal = React.lazy(() => import("@/components/modals/institution").then(module => ({ default: module.RegisterInstitutionModal })))

// Charts - Lazy loaded
const UsersByRoleChart = React.lazy(() => import("@/components/institutions/charts").then(module => ({ default: module.UsersByRoleChart })))
const ChurchesByRegionChart = React.lazy(() => import("@/components/institutions/charts").then(module => ({ default: module.ChurchesByRegionChart })))
const InstitutionLeadersCard = React.lazy(() => import("@/components/institutions/institution-leaders-card").then(module => ({ default: module.InstitutionLeadersCard })))
const ActivityHeatmapCard = React.lazy(() => import("@/components/institutions/activity-heatmap-card").then(module => ({ default: module.ActivityHeatmapCard })))
const UsersRegistrationOverTimeChart = React.lazy(() => import("@/components/institutions/charts").then(module => ({ default: module.UsersRegistrationOverTimeChart })))
const ProjectsOverTimeChart = React.lazy(() => import("@/components/projects/charts/projects-over-time-chart").then(module => ({ default: module.ProjectsOverTimeChart })))

// GraphQL Queries
import { GET_INSTITUTIONS_QUERY } from "@/graphql/queries/INSTITUTIONS_QUERY"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"

// Types & Permissions
import { Institutions_institutions } from "@/types/Institutions"
import { Contact, PermissionResolverName } from "@/types/graphql-global-types"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"
import InstitutionsLoading from "./loading"


export default function InstitutionsPage() {
  // ============================================================================
  // HOOKS & CONTEXT
  // ============================================================================
  const { t } = useTranslation()
  const { institutions: institutionsData, currentInstitutionData, loading: isLoading, updateInstitutionContact, refetchInstitutionById} = useInstitution();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview')
  
  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false)
  const [editInstitutionId, setEditInstitutionId] = useState<string | null>(null)
  const [isDeleteInstitutionModalOpen, setIsDeleteInstitutionModalOpen] = useState(false)
  const [deleteInstitutionId, setDeleteInstitutionId] = useState<string | null>(null)

  // Filter states - usando objeto para PageFilters
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    language: "all",
    status: "true", // Default to active institutions
    budget_status: "all"
  })
  
  // Year filter states
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear()
    return [currentYear, currentYear - 1, currentYear - 2].sort((a, b) => b - a)
  })

  // ============================================================================
  // GRAPHQL QUERIES
  // ============================================================================
  const { data: allInstitutionsData, loading: allInstitutionsLoading } = useQuery(GET_INSTITUTIONS_QUERY, {
    fetchPolicy: 'cache-and-network'
  })

  // Query to fetch ALL projects with complete data for the chart
  const { data: allProjectsData, loading: allProjectsLoading } = useQuery(GET_PROJECTS_QUERY, {
    variables: { institutionId: currentInstitutionData?.id },
    skip: !currentInstitutionData?.id,
    fetchPolicy: 'cache-and-network'
  })

  // ============================================================================
  // DATA PROCESSING & FILTERING
  // ============================================================================
  const institutionsWithUsers = React.useMemo(() => {
    return allInstitutionsData?.institutions || []
  }, [allInstitutionsData])

  // Process projects data for the current institution
  const institutionProjects = React.useMemo(() => {
    return allProjectsData?.projects || []
  }, [allProjectsData])

  // Filter institutions by year (based on created_at)
  // Use institutionsWithUsers for KPIs (has complete data with churches, departments, users)
  const institutionsByYear = React.useMemo(() => {
    return institutionsWithUsers.filter((institution: any) => {
      const createdYear = new Date(institution.created_at).getFullYear()
      return createdYear <= selectedYear
    })
  }, [institutionsWithUsers, selectedYear])

  // Filter projects by year
  const projectsByYear = React.useMemo(() => {
    return institutionProjects.filter((project: any) => {
      const projectYear = new Date(project.created_at || project.start_at).getFullYear()
      return projectYear === selectedYear
    })
  }, [institutionProjects, selectedYear])

  // Apply PageFilters to institutions (MUST be before lists that depend on it)
  const filteredInstitutions = React.useMemo(() => {
    let filtered = institutionsByYear

    // Apply language filter
    if (filterValues.language !== "all") {
      filtered = filtered.filter((inst: any) => inst.language_preference === filterValues.language)
    }

    // Apply status filter
    if (filterValues.status !== "all") {
      const isActive = filterValues.status === "true"
      filtered = filtered.filter((inst: any) => !inst.is_deleted === isActive)
    }

    // Apply budget status filter
    if (filterValues.budget_status !== "all") {
      const hasBudget = filterValues.budget_status === "true"
      filtered = filtered.filter((inst: any) => !!inst.has_budget_record === hasBudget)
    }

    return filtered
  }, [institutionsByYear, filterValues])

  // Extract ALL churches from filtered institutions (following church-departments pattern)
  const allChurches = React.useMemo(() => {
    return filteredInstitutions.flatMap((inst: any) => 
      (inst.churches || []).map((church: any) => ({
        ...church,
        institution_id: inst.id,
        institution_name: inst.name
      }))
    )
  }, [filteredInstitutions])

  // Extract ALL departments from filtered institutions
  const allDepartments = React.useMemo(() => {
    return filteredInstitutions.flatMap((inst: any) => 
      (inst.departments || []).map((dept: any) => ({
        ...dept,
        institution_id: inst.id,
        institution_name: inst.name
      }))
    )
  }, [filteredInstitutions])

  // Separate Institution Departments and Church Departments (following church-departments pattern)
  const institutionDepartmentsList = React.useMemo(() => {
    // Institution departments are those WITHOUT church_id (null or undefined)
    return allDepartments.filter((dept: any) => !dept.church_id && !dept.is_deleted)
  }, [allDepartments])

  const churchDepartmentsList = React.useMemo(() => {
    // Church departments are those WITH church_id (has value)
    // Following church-departments pattern: departments extracted from churches.departments
    // But here we filter from all departments where church_id exists
    return allDepartments.filter((dept: any) => dept.church_id && !dept.is_deleted)
  }, [allDepartments])

  // ADDITIONAL: Extract church departments DIRECTLY from churches (like church-departments page)
  const churchDepartmentsFromChurches = React.useMemo(() => {
    return filteredInstitutions.flatMap((inst: any) => 
      (inst.churches || []).flatMap((church: any) => 
        (church.departments || []).map((dept: any) => ({
          ...dept,
          church_id: church.id,
          church_name: church.name,
          institution_id: inst.id,
          institution_name: inst.name
        }))
      )
    ).filter((dept: any) => !dept.is_deleted)
  }, [filteredInstitutions])

  // Extract ALL users from filtered institutions
  const allUsers = React.useMemo(() => {
    return filteredInstitutions.flatMap((inst: any) => 
      (inst.users || []).map((user: any) => ({
        ...user,
        institution_id: inst.id,
        institution_name: inst.name
      }))
    )
  }, [filteredInstitutions])

  // Computed state - institution being displayed
  const displayedInstitution = useMemo(() => {
    if (selectedInstitutionId) {
      return institutionsData.find(inst => inst.id === selectedInstitutionId) || null
    }
    return currentInstitutionData
  }, [selectedInstitutionId, institutionsData, currentInstitutionData])
  const institutionKPIs = useInstitutionKPI(displayedInstitution);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  React.useEffect(() => {
    if (currentInstitutionData && !selectedInstitutionId) {
      setSelectedInstitutionId(currentInstitutionData.id)
    }
  }, [currentInstitutionData, selectedInstitutionId])

  // Sync selectedInstitutionId with currentInstitutionData changes (from global switcher) - only in overview mode
  React.useEffect(() => {
    if (viewMode === 'overview' && currentInstitutionData && currentInstitutionData.id !== selectedInstitutionId) {
      setSelectedInstitutionId(currentInstitutionData.id)
    }
  }, [currentInstitutionData?.id, selectedInstitutionId, viewMode])

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  const handleViewInstitutionDetails = (institutionId: string) => {
    setSelectedInstitutionId(institutionId)
    setViewMode('detail')
    
    // Scroll to top of the page smoothly
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
    
    toast.success(t('institutions.toasts.institution_details_loaded'))
  }

  // Function to go back to overview
  const handleBackToOverview = () => {
    setViewMode('overview')
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }

  // ============================================================================
  // KPI CALCULATIONS
  // ============================================================================
  const kpiCardsData: KPICardData[] = useMemo(() => {
    // Calculate KPIs from DIRECT lists (following church-departments pattern)
    // This ensures KPIs show the SAME data as the table
    
    // Total active churches from direct list
    const totalChurches = allChurches.filter((c: any) => !c.is_deleted).length
    
    // Institution Departments from direct list (already filtered for active)
    const institutionDepartments = institutionDepartmentsList.length
    
    // Church Departments from churches.departments (following church-departments pattern)
    const churchDepartments = churchDepartmentsFromChurches.length
    
    // Total active users from direct list
    const totalUsers = allUsers.filter((u: any) => !u.is_deleted).length
    
    // Year Progress calculation
    const now = new Date()
    const startOfYear = new Date(selectedYear, 0, 1)
    const endOfYear = new Date(selectedYear, 11, 31)
    const totalDays = 365 + (selectedYear % 4 === 0 ? 1 : 0)
    
    // Only calculate progress if selected year is current year or past
    const currentYear = now.getFullYear()
    let daysPassed = 0
    let percentage = 0
    
    if (selectedYear === currentYear) {
      daysPassed = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
      percentage = Math.round((daysPassed / totalDays) * 100)
    } else if (selectedYear < currentYear) {
      daysPassed = totalDays
      percentage = 100
    }

    return [
      {
        id: "total_institutions",
        title: t('institutions.kpis.total_institutions') || "Total Institutions",
        value: filteredInstitutions.length,
        icon: Building,
        subtitle: `${t('common.in')} ${selectedYear}`,
        trend: undefined
      },
      {
        id: "total_churches",
        title: t('institutions.kpis.total_churches') || "Total Churches",
        value: totalChurches,
        icon: Church,
        subtitle: t('churches.active_churches') || "Active churches",
        trend: undefined
      },
      {
        id: "institution_departments",
        title: t('institutions.kpis.institution_departments') || "Institution Departments",
        value: institutionDepartments,
        icon: Shield,
        subtitle: t('institutions.kpis.institution_level') || "Institution level",
        trend: undefined
      },
      {
        id: "church_departments",
        title: t('institutions.kpis.church_departments') || "Church Departments",
        value: churchDepartments,
        icon: Layers,
        subtitle: t('institutions.kpis.church_level') || "Church level",
        trend: undefined
      },
      {
        id: "total_users",
        title: t('institutions.kpis.total_users') || "Total Users",
        value: totalUsers,
        icon: Users,
        subtitle: t('users.registered_users') || "Registered users",
        trend: undefined
      },
      {
        id: "year_progress",
        title: `${t('common.year_progress') || 'Year Progress'} - ${selectedYear}`,
        value: `${daysPassed} / ${totalDays} ${t('common.days') || 'days'}`,
        icon: Calendar,
        subtitle: `${percentage}%.`,
        trend: undefined
      },
    ]
  }, [filteredInstitutions, selectedYear, t, allChurches, institutionDepartmentsList, churchDepartmentsFromChurches, allUsers])

  // ============================================================================
  // PAGE CONFIGURATION
  // ============================================================================
  const pageTitle = useMemo(() => (
    <span className="flex items-center gap-2">
      {t('common.structure_organization')}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      {t('institutions.title')}
    </span>
  ), [t])

  usePageTitle({
    title: pageTitle,
    showBreadcrumbsInHeader: true
  })

  const budgetPrivacyConfig = React.useMemo(() => 
    createPrivacyConfig('institutions-table-budget', 'FINANCIAL_DATA'),
    []
  )

  const [activeTab, setActiveTab] = useState<string>("structure-chart")

  const kpis = React.useMemo(() => {
    if (!displayedInstitution) return {
      totalInstitutions: 0,
      totalRegions: 0,
      activeChurches: 0,
      totalDepartments: 0,
      institutionDepartments: 0,
      churchDepartments: 0,
      totalUsers: 0
    }

    const institutionDepartments = displayedInstitution.departments?.filter((d: any) => !d.church_id && !d.is_deleted).length || 0
    const churchDepartments = displayedInstitution.departments?.filter((d: any) => d.church_id && !d.is_deleted).length || 0
    const activeChurches = displayedInstitution.churches?.filter((c: any) => !c.is_deleted).length || 0
    const activeRegions = displayedInstitution.regions?.filter((r: any) => !r.is_deleted).length || 0

    return {
      totalInstitutions: 1,
      totalRegions: activeRegions,
      activeChurches,
      totalDepartments: institutionDepartments + churchDepartments,
      institutionDepartments,
      churchDepartments,
      totalUsers: displayedInstitution.users?.filter((u: any) => !u.is_deleted).length || 0
    }
  }, [displayedInstitution])

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(t('institutions.toasts.refreshing_data'))
    
    try {
      await refetchInstitutionById()
      toast.success(t('institutions.toasts.data_refreshed'), { duration: 2000 })
    } catch (error) {
      toast.error(t('institutions.toasts.error_refreshing_data'))
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleInstitutionCreated = (data: any) => {
    // Toast já exibido no modal
  }

  const handleEditInstitution = () => {
    if (displayedInstitution) {
      setIsEditInstitutionModalOpen(true)
    }
  }

  const handleDeleteInstitution = () => {
    if (displayedInstitution) {
      setIsDeleteInstitutionModalOpen(true)
    }
  }

  const handleViewInstitutionContact = () => {
    if (displayedInstitution) {
      // Sempre abrir o modal de contato, mesmo se não houver dados existentes
      // O modal permite criar novos dados de contato se não existirem
      setIsContactModalOpen(true)
    } else {
      toast.error(t('institutions.toasts.no_institution_selected'))
    }
  }

  const handleContactSaved = (contactData: any) => {
    refetchInstitutionById()
    toast.success(t('contacts.toasts.updated'))
  }

  const handleInstitutionSaved = (institutionData: any) => {
    // Toast já exibido no modal
  }

  const handleInstitutionDeleted = (institutionData: any) => {
    toast.success(t('institutions.toasts.deactivated'))
  }

  // Ações para o Entity Info Card
  const institutionCardActions: EntityInfoCardAction[] = useMemo(() => [
    {
      label: t('institutions.actions.view_contact_details'),
      icon: Eye,
      onClick: handleViewInstitutionContact,
      showSeparatorAfter: true
    },
    {
      label: t('institutions.actions.manage_churches'),
      icon: Home,
      onClick: () => {}
    },
    {
      label: t('institutions.actions.manage_departments'),
      icon: Layers,
      onClick: () => {}
    },
    {
      label: t('institutions.actions.manage_annual_budgets'),
      icon: DollarSign,
      onClick: () => {},
      showSeparatorAfter: true
    },
    {
      label: t('institutions.actions.edit_institution'),
      icon: Edit,
      onClick: handleEditInstitution
    },
    {
      label: t('institutions.actions.delete_institution'),
      icon: Trash2,
      onClick: handleDeleteInstitution,
      variant: "destructive"
    }
  ], [t, handleViewInstitutionContact, handleEditInstitution, handleDeleteInstitution])

  // Custom First Card com informações da instituição
  const customFirstCard = useMemo(() => {
    if (!displayedInstitution) return null
    
    const isActive = !displayedInstitution.is_deleted
    
    return (
      <EntityInfoCard
        headerTitle={t('institutions.entity_info.header_title')}
        name={displayedInstitution.name}
        description={displayedInstitution.denomination}
        icon={Building}
        invertTheme={true}
        actions={institutionCardActions}
        accentColor="gray"
        badges={[
          {
            label: isActive ? t('institutions.entity_info.active') : t('institutions.entity_info.inactive'),
            variant: isActive ? "default" : "secondary",
            className: cn(
              "text-xs",
              isActive 
                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" 
                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
            )
          },
          {
            label: `${t('institutions.entity_info.established')} ${new Date(displayedInstitution.created_at).getFullYear()}`,
            variant: "default",
            className: "text-xs font-normal"
          },
          {
            label: displayedInstitution.language_preference.toUpperCase(),
            variant: "default",
            className: "text-xs font-mono"
          }
        ]}
      />
    )
  }, [displayedInstitution, institutionCardActions, t])

  // ============================================================================
  // TABLE CONFIGURATION
  // ============================================================================
  const columns: ColumnDef<Institutions_institutions>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t('institutions.table.name'),
      cell: ({ row }) => {
        const institution = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{institution.name}</div>
              <div className="text-xs text-muted-foreground">
                {institution.denomination}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "country",
      accessorKey: "contact.country",
      header: t('institutions.table.country'),
      cell: ({ row }) => {
        const country = row.original.contact?.country
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{country}</div>
            </div>
          </div>
        )
      },
    },
    {
      id: "language",
      accessorKey: "language_preference",
      header: t('institutions.table.language'),
      cell: ({ row }) => {
        const lang = row.original.language_preference
        const langLabel = lang === "en" ? t('common.english') : lang === "nl" ? t('common.dutch') : lang
        return (
          <Badge variant="outline">
            {langLabel}
          </Badge>
        )
      },
    },
    {
      id: "churches",
      accessorKey: "churches_count",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.churches')}
        </div>
      ),
      cell: ({ row }) => {
        const count = row.original.churches_count || 0
        return (
          <div className="flex items-center justify-center gap-2">
            <Church className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{count}</span>
          </div>
        )
      },
    },
    {
      id: "users",
      accessorKey: "users_count",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.users')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users_count}</span>
        </div>
      ),
    },
    {
      id: "budget",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.budget')}
        </div>
      ),
      cell: ({ row }) => {
        const institution = row.original;
        const budgetAmount = institution.current_year_budget || 0;
        const hasBudget = budgetAmount > 0;
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { useComponentPrivacy } = require('@/contexts/privacy-context')
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { isHidden } = useComponentPrivacy(budgetPrivacyConfig)

        return (
          <div className="text-center">
            {isHidden ? (
              <div className="text-sm font-semibold text-muted-foreground">
                ••••••
              </div>
            ) : (
              <div className="text-sm font-semibold">
                {hasBudget ? `$${budgetAmount.toLocaleString()}` : '-'}
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "budget_status",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.budget_status')}
        </div>
      ),
      cell: ({ row }) => {
        const institution = row.original;
        const hasBudget = institution.has_budget_record;

        return (
          <div className="flex justify-center">
            <StatusBadge
              label={hasBudget ? t('annual_budget.table.budget_status_labels.completed') : t('annual_budget.table.budget_status_labels.missing')}
              variant={hasBudget ? "success" : "neutral"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        // For filtering: "completed" = true, "missing" = false
        if (value === undefined || value === null || value === "") {
          return true
        }
        const institution = row.original;
        const hasBudget = institution.has_budget_record;
        return hasBudget === value
      },
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="text-center font-medium">
          {t('common.status')}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? t('common.active') : t('common.inactive')}
              variant={isActive ? "success" : "neutral"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        // Convert string to boolean for filtering
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
      },
    },
    {
      id: "actions",
      header: t('institutions.table.actions'),
      cell: ({ row }) => {
        const institution = row.original;
        const isInactive = institution.is_deleted;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-action-button>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  handleViewInstitutionDetails(institution.id)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('actions.view_details')}
              </DropdownMenuItem>
              {!isInactive && (
                <>
                  <WithPermission requiredPermissions={[PermissionResolverName.UpdateInstitution]}>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditInstitutionId(institution.id);
                        setIsEditInstitutionModalOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t('common.edit')}
                    </DropdownMenuItem>
                  </WithPermission>
                  <WithPermission requiredPermissions={[PermissionResolverName.DeleteInstitution]}>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        setDeleteInstitutionId(institution.id);
                        setIsDeleteInstitutionModalOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('common.deactivate')}
                    </DropdownMenuItem>
                  </WithPermission>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]

  // Configure PageFilters
  const pageFilters: FilterConfig[] = useMemo(() => [
    {
      id: "language",
      label: t('common.language'),
      type: "select",
      placeholder: t('common.all_languages') || "All Languages",
      icon: Globe,
      options: [
        { label: t('common.all') || "All", value: "all" },
        { label: t('common.english'), value: "en" },
        { label: t('common.dutch'), value: "nl" },
        { label: "Português", value: "pt" },
      ],
      defaultValue: "all"
    },
    {
      id: "status",
      label: t('common.status'),
      type: "select",
      placeholder: t('common.select_status') || "Select status",
      icon: Shield,
      options: [
        { label: t('common.all') || "All", value: "all" },
        { label: t('common.active'), value: "true" },
        { label: t('common.inactive'), value: "false" },
      ],
      defaultValue: "true"
    }
  ], [t])

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }))
  }

  const handleClearFilters = () => {
    setFilterValues({
      language: "all",
      status: "true",
      budget_status: "all"
    })
    toast.success(t('common.filters_cleared') || "Filters cleared", { duration: 1500 })
  }

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(`Cannot add year beyond ${maxAllowedYear}`)
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

  // Filterable columns for DataTable (mantido para compatibilidade, mas não usado)
  const filterableColumns = [
    {
      id: "language",
      title: t('common.language'),
      options: [
        { label: t('common.english'), value: "en" },
        { label: t('common.dutch'), value: "nl" },
        { label: "Português", value: "pt" },
      ]
    },
    {
      id: "status",
      title: t('common.status'),
      options: [
        { label: t('common.active'), value: "true" },
        { label: t('common.inactive'), value: "false" },
      ]
    },
    {
      id: "budget_status",
      title: t('institutions.table.budget_status'),
      options: [
        { label: t('annual_budget.table.budget_status_labels.completed'), value: "true" },
        { label: t('annual_budget.table.budget_status_labels.missing'), value: "false" },
      ]
    }
  ]

  // ============================================================================
  // RENDER CONDITIONS
  // ============================================================================
  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!displayedInstitution) {
    return <InstitutionsLoading />
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  return (
    <AppLayout>
      <WithPermission requiredPermissions={[PermissionResolverName.Institutions]} fallback={<AccessDenied/>}>
      
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden" ref={scrollContainerRef}>
        {/* Breadcrumbs Navigation - Only show in detail view */}
        {viewMode === 'detail' && displayedInstitution && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToOverview();
                  }}
                  className="cursor-pointer hover:text-foreground"
                >
                  {t('institutions.breadcrumb.see_all') || "See All Institutions"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {displayedInstitution.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}



        {/* Header */}
        <div className="flex flex-col justify-between items-start gap-4">
          <div className="flex w-full justify-between">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">
                {t('institutions.page_header.title')}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {t('institutions.page_header.subtitle')}
              </p>
            </div>

  

            <div className="flex items-center gap-3">
              <PageFilters
                filters={pageFilters}
                values={filterValues}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                triggerLabel={t('common.filters') || "Filters"}
                align="end"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <WithPermission requiredPermissions={[PermissionResolverName.CreateInstitution]}>
                <RegisterInstitutionModal onSuccess={handleInstitutionCreated}>
                  <Button className="bg-primary hover:bg-primary/80">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('institutions.page_header.new_institution')}
                  </Button>
                </RegisterInstitutionModal>
              </WithPermission>
            </div>

          </div>

          {/* Year Filter */}
          <YearFilter 
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onAddYear={handleAddYear}
            showAddButton={false}
            className="mb-0"
          />
        </div>

        {/* KPI Cards Carousel */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          minCardsForCarousel={3}
          showCarousel={true}
          customFirstCard={customFirstCard}
        />

        <Separator />

        {/* Charts Section */}

           <GridContainer
            items={[
              {
                id: "users-registration-over-time-chart",
                component: (
                  <UsersRegistrationOverTimeChart
                    institutions={institutionsWithUsers}
                    loading={allInstitutionsLoading}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-8",
              },
               {
                id: "institution-leaders-card-top",
                component: (
                  <InstitutionLeadersCard
                    users={currentInstitutionData?.users || []}
                    institutionName={currentInstitutionData?.name || ''}
                    loading={isLoading}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-4",
              }
              
            ]}
            gap="lg"
          />         

          <GridContainer
            items={[
              {
                id: "activity-heatmap-card",
                component: (
                  <ActivityHeatmapCard
                    projects={institutionProjects}
                    users={currentInstitutionData?.users || []}
                    loading={allProjectsLoading || isLoading}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-3",
              },
              {
                id: "projects-over-time-chart",
                component: (
                  <ProjectsOverTimeChart
                    data={institutionProjects}
                    institutions={institutionsWithUsers}
                    loading={allProjectsLoading}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-9",
              }
              
            ]}
            gap="lg"
          />     

          <GridContainer
            items={[
              {
                id: "users-by-role-chart",
                component: (
                  <UsersByRoleChart
                      users={currentInstitutionData?.users || []}
                      data={displayedInstitution?.institutionChartsData?.usersByRole}
                      monthlyUserGrowth={displayedInstitution?.institutionChartsData?.monthlyUserGrowth}
                      loading={isLoading}
                      selectedYear={selectedYear}
                    />
                ),
                colSpan: "col-span-12 lg:col-span-6",
              },

               {
                id: "institution-leaders-card-bottom",
                component: (
                  <ChurchesByRegionChart
                    churches={currentInstitutionData?.churches || []}
                    regions={currentInstitutionData?.regions || []}
                    data={displayedInstitution?.institutionChartsData?.churchesByRegion}
                    loading={isLoading}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-6",
              }
            ]}
            gap="lg"
          />    

        <Separator />

        {/* Institutions Table */}
        <Card>
          <ChartHeader
            title={t('institutions.table_card.title')}
            description={t('institutions.table_card.description')}
            actionsOrientation="responsive"
            actions={
              <InlinePrivacyToggle 
                config={budgetPrivacyConfig}
                className="flex-shrink-0"
              />
            }
          />
          <CardContent className="overflow-hidden">
            <UseTable
              columns={columns}
              data={filteredInstitutions}
              searchKey="name"
            />
          </CardContent>
        </Card>

        {/* Contact Modal */}
        {displayedInstitution && (
          <Suspense fallback={<div>Loading...</div>}>
            <ContactViewEditModal
              isOpen={isContactModalOpen}
              onOpenChange={setIsContactModalOpen}
              contact={(displayedInstitution.contact || null) as Contact | null}
              entityName={displayedInstitution.name || t('institutions.title')}
              entityType={t('institutions.title')}
              onSave={handleContactSaved}
              entityId={displayedInstitution.id}
              updateMutation={updateInstitutionContact}
            />
          </Suspense>
        )}

        {/* Edit Institution Modal */}
        <Suspense fallback={<div>Loading...</div>}>
          <EditInstitutionModal
            isOpen={isEditInstitutionModalOpen}
            onOpenChange={(open) => {
              setIsEditInstitutionModalOpen(open);
              if (!open) setEditInstitutionId(null);
            }}
            institution={
              (institutionsData.find(i => i.id === (editInstitutionId || displayedInstitution?.id)) || null) as any
            }
            onSave={handleInstitutionSaved}
          />
        </Suspense>

        {/* Delete Institution Modal */}
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteInstitutionModal
            isOpen={isDeleteInstitutionModalOpen}
            onOpenChangeAction={(open) => {
              setIsDeleteInstitutionModalOpen(open);
              if (!open) setDeleteInstitutionId(null);
            }}
            institution={
              (institutionsData.find(i => i.id === (deleteInstitutionId || displayedInstitution?.id)) || null) as any
            }
            onSuccess={handleInstitutionDeleted}
          />
        </Suspense>
      </div>
      </WithPermission>
    </AppLayout>
  )
}