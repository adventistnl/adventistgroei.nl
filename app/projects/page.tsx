"use client"

import React, { useState, useEffect, useMemo, Suspense, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useQuery, useMutation } from "@apollo/client"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ProjectTableData } from "@/components/projects/projects-table"
import { useNavigateWithLoading } from "@/hooks/use-navigation-loading"
import { projectTranslations } from "@/lib/translations/projects"
import { GET_PROJECTS_QUERY, GET_PROJECT_KPIS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { DELETE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { Globe, Plus, RefreshCw, Building, MoreHorizontal, Eye, Edit, Activity, TrendingUp, Users, DollarSign, Folder, ArrowRight, Calendar, Building2, Clock, CheckCircle2, ListChecks, LayoutGrid, List, ExternalLink, Info, ShieldAlert } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { useInstitution } from "@/contexts/institution-context"
import { useCurrency } from "@/contexts/currency-context"
import { ProjectsKPIs } from "@/components/projects/projects-kpis"
import { ProjectsByDepartmentChart } from "@/components/projects/charts/projects-by-department-chart"
import { ProjectActivitiesChart } from "@/components/projects/charts/project-activities-chart"
import { ProjectsOverTimeChart } from "@/components/projects/charts/projects-over-time-chart"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"
import { createProjectColumns } from "@/components/projects/projects-table-columns"
import { EditProjectModal } from "@/components/modals/project/edit-project-modal"
import { DetailsViewProjectModal } from "@/components/modals/project/details-view-project-modal"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { SpecialProjectBadge, getSpecialProjectColors } from "@/components/projects/special-project-badge"
import { MyProjectsFilter } from "@/components/shared/my-projects-filter"
import { YearFilter } from "@/components/shared/year-filter"
import { ProjectKanbanView } from "@/components/projects/project-kanban-view"
import { ProjectRefundRequestsCard } from "@/components/projects/project-refund-requests-card"
import { PROJECT_STATUS_CONFIG, PROJECT_STATUS_ORDER } from "@/components/projects/project-header"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import toast from "react-hot-toast"
import "@/lib/i18n"
import { useAuth } from "@/contexts/auth-context"

// Internal component that uses useSearchParams - wrapped in Suspense
function ProjectsPageContent() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { navigateWithLoading } = useNavigateWithLoading()
  const { currentInstitutionData } = useInstitution()
  const { selectedCurrency, formatCurrency } = useCurrency()
  const { roles, user } = useAuth()
  
  const canViewFilters = roles.includes('ADMIN') || roles.includes('INSTITUTIONAL_LEADER') || roles.includes('DEV')

  const [refreshing, setRefreshing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectTableData | undefined>(undefined)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [quickViewProject, setQuickViewProject] = useState<ProjectTableData | undefined>(undefined)

  const institutionId = currentInstitutionData?.id

  // Fetch projects from backend - filter by institution
  const { data: projectsData, loading: isLoading, error, refetch } = useQuery(GET_PROJECTS_QUERY, {
    variables: { institutionId },
    skip: !institutionId
  })

  // Fetch departments
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  // Filter only institutional departments (not church departments)
  const departments = (departmentsData?.departments || []).filter(
    (dept: any) => dept.institution_id && !dept.church_id
  )
  
  // Get churches from institution context
  const churches = currentInstitutionData?.churches || []
  const activeChurches = churches.filter((church: any) => !church.is_deleted)

  // Fetch KPIs and analytics data
  const { data: kpisData, loading: kpisLoading } = useQuery(GET_PROJECT_KPIS_QUERY, {
    variables: { institutionId },
    skip: !institutionId
  })

  // Delete project mutation
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT_MUTATION, {
    refetchQueries: [{ query: GET_PROJECTS_QUERY }, { query: GET_PROJECT_KPIS_QUERY }]
  })

  // Filter states - usando objeto para PageFilters
  const [filterValues, setFilterValues] = useState<Record<string, any>>({
    department: "all",
    church: "all"
  })
  
  // My projects filter state - starts active by default
  const [showMyProjectsOnly, setShowMyProjectsOnly] = useState(true)
  
  // Year filter states
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear()
    return [currentYear, currentYear - 1, currentYear - 2].sort((a, b) => b - a)
  })

  // Get translations for current language
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const breadcrumbs = useMemo(() => [
    { name: t_project.projectsPage }
  ], [t_project])

  usePageTitle({
    title: t_project.projectsPage,
    breadcrumbs
  })

  // Show loading/success toast: track true→false transition of isLoading
  const loadingToastRef = useRef<string | undefined>(undefined)
  const wasLoadingRef = useRef(false)
  const successShownRef = useRef(false)

  useEffect(() => {
    if (successShownRef.current) return

    if (isLoading && !wasLoadingRef.current) {
      // Loading started — show loading toast
      wasLoadingRef.current = true
      loadingToastRef.current = toast.loading(t_project.toasts?.loadingData || 'Loading projects...')
    } else if (!isLoading && wasLoadingRef.current && loadingToastRef.current !== undefined) {
      // Loading finished — show success
      successShownRef.current = true
      toast.dismiss(loadingToastRef.current)
      loadingToastRef.current = undefined
      toast.success(t_project.toasts?.dataRefreshed || 'Projects loaded successfully', { duration: 3000 })
    }
  }, [isLoading])

  // Transform backend data to table format
  const transformProjectsData = (backendProjects: any[]): ProjectTableData[] => {
    return backendProjects.map((project: any) => {
      
      return {
        id: project.id,
        department_id: project.department_id,
        church_department_id: project.church_department_id,
        title: project.title,
        description: project.description,
        budget: Number(project.budget || 0),
        subsidized_budget: Number(project.subsidized_budget || 0),
        is_private: project.is_private,
        required_volunteers: project.required_volunteers,
        start_at: project.start_at,
        end_at: project.end_at,
        created_at: project.created_at,
        language_preference: project.language_preference,
        institutionId: project.institution_id || project.Institution?.id || '',
        status: project.status || 'DRAFT', // Use status from backend
        subsidyRequests: project.subsidies?.length || 0,
        subsidyAmount: project.subsidies?.reduce((sum: number, s: any) => sum + Number(s.requested_amount || 0), 0) || 0,
        is_event: !!project.event_id,
        type: project.type as "Local" | "Global" | undefined,
        specialType: project.special_projects?.some((sp: any) => sp.type === "CHURCH_PLANTING") 
          ? "Church Planting" 
          : project.special_projects?.some((sp: any) => sp.type === "SPECIAL") 
            ? "Projeto Especial" 
            : null,
        eventId: project.event_id || null,
        // Preserve activities data with owners for user avatar display
        activitiesData: project.activities || [],
        // Collaborators from API (owner + co_owner + assignees, deduped)
        collaborators: project.collaborators || [],
        // Preserve owner data for assigned user column
        owner_id: project.owner_id || project.owner?.id,
        owner: project.owner || null,
        // Preserve co-owner data
        co_owner_id: project.co_owner_id || project.co_owner?.id || null,
        co_owner: project.co_owner || null,
        // Preserve church data for church column
        church_id: project.church_id,
        church: project.church,
        Church: project.Church,
        // Preserve department data for charts and filtering
        department: project.department || null,
        church_department: project.church_department || null
      }
    })
  }

  // Transform projects data
  const projects = useMemo(() => {
    if (!projectsData?.projects) return []
    return transformProjectsData(projectsData.projects)
  }, [projectsData])

  // Filter data based on selected year
  const projectsByYear = useMemo(() => {
    return projects.filter(project => {
      const createdDate = new Date(project.created_at || project.start_at)
      return createdDate.getFullYear() === selectedYear
    })
  }, [projects, selectedYear])

  // Filter data based on selected department and church
  const filteredData = useMemo(() => {
    const selectedDepartment = filterValues.department
    const selectedChurch = filterValues.church
    
    let filtered = projectsByYear
    
    // Apply department filter (institutional departments only)
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(project => project.department_id === selectedDepartment)
    }
    
    // Apply church filter
    if (selectedChurch !== "all") {
      filtered = filtered.filter(project => {
        // Filter by church_id if project has a church registered
        return project.church_id === selectedChurch || project.church?.id === selectedChurch || project.Church?.id === selectedChurch
      })
    }
    
    // Apply "My Projects" filter if active
    if (showMyProjectsOnly && user?.id) {
      const uid = user.id
      filtered = filtered.filter(project => {
        // 1. Direct owner check (most reliable field)
        if (project.owner_id === uid || project.owner?.id === uid) return true

        // 2. Direct co-owner check
        if (project.co_owner_id === uid || project.co_owner?.id === uid) return true

        // 3. Collaborators array (consolidates owner + co_owner + assignees from API)
        if (project.collaborators?.some((c: any) => c.user?.id === uid)) return true

        return false
      })
    }
    
    return filtered
  }, [filterValues.department, filterValues.church, projectsByYear, showMyProjectsOnly, user])

  // Apply status filter for the table/kanban section
  const statusFilteredData = useMemo(() => {
    if (statusFilter === 'all') return filteredData
    return filteredData.filter(p => p.status === statusFilter)
  }, [filteredData, statusFilter])

  // Configure PageFilters
  const pageFilters: FilterConfig[] = useMemo(() => {
    const filters: FilterConfig[] = []
    
    // Add department filter (institutional only)
    if (departments.length > 0) {
      filters.push({
        id: "department",
        label: t_project.filters?.filterByDepartment || "Department",
        type: "select",
        placeholder: t_project.filters?.allDepartments || "All Departments",
        icon: Building2,
        options: [
          {
            label: t_project.filters?.allDepartments || "All Departments",
            value: "all"
          },
          ...departments.map((dept: any) => ({
            label: dept.name,
            value: dept.id
          }))
        ],
        defaultValue: "all"
      })
    }
    
    // Add church filter
    if (activeChurches.length > 0) {
      filters.push({
        id: "church",
        label: "Church",
        type: "select",
        placeholder: "All Churches",
        icon: Building,
        options: [
          {
            label: "All Churches",
            value: "all"
          },
          ...activeChurches.map((church: any) => ({
            label: church.name,
            value: church.id
          }))
        ],
        defaultValue: "all"
      })
    }
    
    return filters
  }, [departments, activeChurches, t_project])



  // Get KPIs from backend data filtered by year AND department
  const kpis = useMemo(() => {
    // Use filteredData to include both year and department filtering
    const yearProjects = filteredData
    const totalProjects = yearProjects.length
    // Note: Using Number() to ensure proper numeric addition (values may come as strings from GraphQL/Prisma Decimal)
    const totalBudget = yearProjects.reduce((sum, p) => sum + Number(p.budget || 0), 0)
    
    // Calculate total allocated to projects (subsidized_budget)
    const totalAllocated = yearProjects.reduce((sum, p) => sum + Number(p.subsidized_budget || 0), 0)
    
    // Calculate year progress
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999)
    const totalDaysInYear = Math.ceil((endOfYear.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    const dayOfYear = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
    const daysRemaining = totalDaysInYear - dayOfYear
    const yearProgressPercent = Math.round((dayOfYear / totalDaysInYear) * 100)
    
    return {
      totalProjects,
      completedProjects: yearProjects.filter(p => p.status === 'completed').length,
      upcomingProjects: yearProjects.filter(p => p.status === 'upcoming').length,
      totalBudget,
      totalAllocated,
      projectsWithVolunteers: yearProjects.filter(p => p.required_volunteers).length,
      averageBudgetPerProject: totalProjects > 0 ? totalBudget / totalProjects : 0,
      averageAllocatedPerProject: totalProjects > 0 ? totalAllocated / totalProjects : 0,
      yearProgress: {
        percent: yearProgressPercent,
        dayOfYear,
        totalDaysInYear,
        daysRemaining
      }
    }
  }, [filteredData])

  // Colunas para a tabela de projetos
  const projectColumns: ColumnDef<ProjectTableData>[] = [
    {
      accessorKey: "title",
      header: () => (
        <div className="flex items-center gap-2 pl-0">
          <Folder className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.projectTitle}</span>
        </div>
      ),
      cell: ({ row }) => {
        const specialColors = row.original.specialType 
          ? getSpecialProjectColors(row.original.specialType as any) 
          : null;
        
        return (
          <div className={`flex items-center justify-between gap-3 -ml-4 pl-4 py-1 border-l-4 ${specialColors ? specialColors.border : 'border-transparent'}`}>
            <div className="flex items-center gap-3">
              {row.original.specialType ? (
                <SpecialProjectBadge type={row.original.specialType as any} iconOnly />
              ) : (
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Folder className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="font-medium">{row.original.title}</span>
              </div>
            </div>
          </div>
        )
      },
      meta: {
        className: "pl-0"
      }
    },
    {
      accessorKey: "department_id",
      header: () => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.department}</span>
        </div>
      ),
      cell: ({ row }) => {
        const dept = departments.find((d: any) => d.id === row.original.department_id)
        return (
          <StatusBadge
            label={dept?.name || t_project.unknown}
            variant="neutral"
            size="sm"
          />
        )
      },
    },
    {
      id: "church",
      header: () => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.church || "Church"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const project = row.original

        
        // Try multiple sources for church name
        const churchName = project.church?.name || project.Church?.name
        const churchId = project.church_id || project.church?.id || project.Church?.id

        
        if (churchName) {
          return (
            <StatusBadge
              label={churchName}
              variant="default"
              size="sm"
              showDot={false}
            />
          )
        }
        
        return (
          <StatusBadge
            label={t_project.table.noChurch || "No church"}
            variant="default"
            size="sm"
          />
        )
      },
    },
        {
      id: "collaborators",
      header: () => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.collaborators || "Collaborators"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const project = row.original
        const collaborators = project.collaborators || []

        if (collaborators.length === 0) {
          return (
            <div className="text-xs text-muted-foreground">
              {t_project.table.noCollaborators || "No collaborators"}
            </div>
          )
        }

        const ownerId = collaborators.find((c: any) => c.role === 'owner')?.user?.id
        const coOwnerId = collaborators.find((c: any) => c.role === 'co_owner')?.user?.id

        const users: UserAvatarData[] = collaborators.map((c: any) => ({
          id: c.user.id,
          name: c.user.name,
          email: c.user.email,
          role: c.role === 'owner' ? 'Owner' : c.role === 'co_owner' ? 'Co-Owner' : 'Assignee',
          isOwner: c.role === 'owner',
          isCoOwner: c.role === 'co_owner'
        }))

        return (
          <UsersAvatarGroup
            users={users}
            maxDisplay={2}
            size="sm"
            showLabel={false}
            showAddButton={false}
            ownerUserId={ownerId}
            coOwnerUserId={coOwnerId}
          />
        )
      },
    },
    {
      id: "timeline",
      header: () => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.timeline}</span>
        </div>
      ),
      cell: ({ row }) => {
        const startDate = new Date(row.original.start_at)
        const endDate = new Date(row.original.end_at)
        const now = new Date()
        
        const formatDate = (date: Date) => {
          return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
        }
        
        // Calculate progress percentage with precision (includes hours/minutes)
        const totalDuration = endDate.getTime() - startDate.getTime()
        const elapsed = now.getTime() - startDate.getTime()
        
        // Calculate percentage - will be exactly 100% when now >= endDate
        let progressPercent = totalDuration > 0 ? (elapsed / totalDuration) * 100 : 0
        
        // Clamp between 0 and 100
        progressPercent = Math.min(Math.max(progressPercent, 0), 100)
        
        // Determine color based on progress and time left
        let progressBarColor = "bg-primary"
        if (progressPercent >= 100) {
          progressBarColor = "bg-red-500"
        } else if (progressPercent >= 90) {
          progressBarColor = "bg-orange-500"
        } else if (progressPercent >= 75) {
          progressBarColor = "bg-yellow-500"
        }
        
        return (
          <div className="space-y-1.5 min-w-[140px]">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatDate(startDate)}</span>
              <ArrowRight className="w-3 h-3" />
              <span>{formatDate(endDate)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div 
                className={`${progressBarColor} h-full rounded-full transition-all duration-300`}
                style={{ width: `${progressPercent.toFixed(2)}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      id: "days_left",
      header: () => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.daysLeft}</span>
        </div>
      ),
      cell: ({ row }) => {
        const endDate = new Date(row.original.end_at)
        const today = new Date()
        const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        let variant: "success" | "warning" | "error" = "success"
        let dotColor = "#10b981" // Green
        
        if (daysLeft < 0) {
          variant = "error"
          dotColor = "#ef4444" // Red
        } else if (daysLeft <= 7) {
          variant = "error"
          dotColor = "#f97316" // Orange
        } else if (daysLeft <= 30) {
          variant = "warning"
          dotColor = "#f59e0b" // Yellow
        }
        
        const displayText = daysLeft < 0 
          ? t_project.table.daysOverdue.replace('{{days}}', Math.abs(daysLeft).toString())
          : daysLeft === 0 
            ? t_project.table.today
            : t_project.table.daysRemaining.replace('{{days}}', daysLeft.toString())
        
        return (
          <StatusBadge
            label={displayText}
            variant={variant}
            showDot={true}
            dotColor={dotColor}
            size="sm"
          />
        )
      },
    },
    {
      accessorKey: "status",
      header: () => (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.status}</span>
        </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status
        
        // Map backend status to display text and colors
        const statusConfig: Record<string, { text: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default'; dotColor: string }> = {
          DRAFT: { text: t_project.status?.draft || 'Draft', variant: 'default', dotColor: '#6b7280' },
          OPEN_REQUEST: { text: t_project.status?.openRequest || 'Open Request', variant: 'info', dotColor: '#0ea5e9' },
          IN_REVIEW: { text: t_project.status?.inReview || 'In Review', variant: 'info', dotColor: '#3b82f6' },
          ADJUSTMENTS_NEEDED: { text: t_project.status?.adjustmentsNeeded || 'Adjustments Needed', variant: 'warning', dotColor: '#f97316' },
          IN_PROGRESS: { text: t_project.status?.inProgress || 'In Progress', variant: 'success', dotColor: '#22c55e' },
          PENDING_RECEIPT: { text: t_project.status?.pendingReceipt || 'Pending Receipt', variant: 'info', dotColor: '#06b6d4' },
          WAITING_REFUND: { text: t_project.status?.waitingRefund || 'Waiting Refund', variant: 'info', dotColor: '#14b8a6' },
          OVERDUE: { text: t_project.status?.overdue || 'Overdue', variant: 'error', dotColor: '#ef4444' },
          CONCLUDED: { text: t_project.status?.concluded || 'Concluded', variant: 'success', dotColor: '#16a34a' },
        }
        
        const config = statusConfig[status] || statusConfig.DRAFT
        
        return (
          <StatusBadge
            label={config.text}
            variant={config.variant}
            showDot={true}
            dotColor={config.dotColor}
            size="sm"
          />
        )
      },
    },
    {
      id: "activities",
      header: () => (
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-muted-foreground" />
          <span>{t_project.table.activities || "Activities"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const activitiesCount = row.original.activities || 0
        return (
          <StatusBadge
            label={activitiesCount.toString()}
            variant="default"
            size="sm"
          />
        )
      },
    },
    {
      id: "actions",
      header: t_project.table.actions,
      cell: ({ row }) => {
        const project = row.original

        // Determine membership and ownership from collaborators array
        const projectCollaborators: Array<{ role: string; user: { id: string } }> =
          (project.collaborators as any[]) ?? []
        const isProjectMember =
          projectCollaborators.some((c) => c.user?.id === user?.id) ||
          user?.id === project.owner_id ||
          user?.id === project.owner?.id
        const isOwnerOrCoOwner =
          projectCollaborators.some(
            (c) => c.user?.id === user?.id && (c.role === 'owner' || c.role === 'co_owner')
          ) ||
          user?.id === project.owner_id ||
          user?.id === project.owner?.id

        // Non-members have no action buttons at all
        if (!isProjectMember) return null

        return (
          <div data-action-button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t_project.table.openMenu}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleQuickViewProject(project)
                  }}
                  className="cursor-pointer"
                >
                  <Info className="mr-2 h-4 w-4" />
                  {t_project.table?.details ?? "Details"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewProject(project)
                  }}
                  className="cursor-pointer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t_project.viewProject}
                </DropdownMenuItem>

                {/* Edit: only for owner / co-owner */}
                {isOwnerOrCoOwner && (
                  <WithPermission requiredPermissions={[PermissionResolverName.UpdateProject]}>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProject(project)
                      }}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      {t_project.editProject}
                    </DropdownMenuItem>
                  </WithPermission>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Auto-refresh data when redirected from project creation
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh')
    
    if (shouldRefresh === 'true') {
      // Show loading toast
      const refreshToast = toast.loading(t_project.toasts.dataRefreshing || 'Refreshing data...')
      
      // Refetch data
      refetch().then(() => {
        toast.dismiss(refreshToast)
        toast.success(t_project.toasts.dataRefreshed || 'Data refreshed successfully', {
          duration: 2000
        })
      }).catch(() => {
        toast.dismiss(refreshToast)
        toast.error(t_project.toasts.errorLoading || 'Failed to refresh data')
      })
      
      // Clean up URL by removing the refresh parameter
      router.replace('/projects')
    }
  }, [searchParams, refetch, router, t_project])

  // Show loading/error toasts
  useEffect(() => {
    if (error) {
      toast.error(t_project.toasts.errorLoading)
    }
  }, [error, t_project])

  const handleFilterChange = (filterId: string, value: any) => {
    setFilterValues(prev => ({
      ...prev,
      [filterId]: value
    }))
    
    if (filterId === "department" || filterId === "church") {
      toast.success(t_project.toasts.filterApplied, { duration: 1500 })
    }
  }

  const handleClearFilters = () => {
    setFilterValues({ department: "all", church: "all" })
    toast.success("Filters cleared", { duration: 1500 })
  }

  const handleRefresh = async () => {
    setRefreshing(true)

    const refreshToast = toast.loading(t_project.toasts.dataRefreshing)

    try {
      await refetch()

      toast.dismiss(refreshToast)
      toast.success(t_project.toasts.dataRefreshed, {
        duration: 2000
      })

    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(t_project.toasts.errorLoading)
    } finally {
      setRefreshing(false)
    }
  }

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(t_project.yearFilter.cannotAddBeyond.replace('{{year}}', maxAllowedYear.toString()))
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error(t_project.yearFilter.yearExists.replace('{{year}}', nextYear.toString()))
      return
    }

    setAvailableYears(prev => [...prev, nextYear].sort((a, b) => b - a))
    setSelectedYear(nextYear)
    toast.success(t_project.yearFilter.yearAdded.replace('{{year}}', nextYear.toString()))
  }

  const handleQuickViewProject = (project: ProjectTableData) => {
    setQuickViewProject(project)
    setIsQuickViewOpen(true)
  }

  const handleViewProject = (project: ProjectTableData) => {
    navigateWithLoading(`/projects/${project.id}`, {
      message: t_project.navigation.openingProject.replace('{{title}}', project.title),
      showToast: true
    })
  }

  const handleEditProject = (project: ProjectTableData) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  const handleEditProjectSuccess = () => {
    refetch()
    setIsEditModalOpen(false)
    setSelectedProject(undefined)
  }

  const handleToggleMyProjects = () => {
    const newState = !showMyProjectsOnly
    setShowMyProjectsOnly(newState)
    
    if (newState) {
      toast.success(t_project.filters?.showMyProjects || 'Showing only your projects', {
        duration: 2000,
      })
    } else {
      toast.success(t_project.filters?.showAllProjects || 'Showing all projects', {
        duration: 2000,
      })
    }
  }



  // Year Filter Component - Using reusable component

  if (isLoading || kpisLoading) {
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

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">
              {t_project.projectsDashboard}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {t_project?.pageHeader?.subtitle?.replace('{{year}}', selectedYear.toString()) || `Complete overview of projects - ${selectedYear}`}
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
                {/* Show active filter badge */}
                {showMyProjectsOnly && (
                  <Badge variant="default" className="text-xs animate-in fade-in slide-in-from-left-2">
                    <Users className="w-3 h-3 mr-1" />
                    {t_project.filters?.myProjectsActive || `My Projects (${filteredData.length})`}
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3">
          {/* My Projects Filter - User Avatar */}
          <MyProjectsFilter
            user={user}
            active={showMyProjectsOnly}
            defaultActive={true}
            onToggle={handleToggleMyProjects}
            translations={{
              showMyProjects: t_project.filters?.showMyProjects || 'Show my projects',
              showAllProjects: t_project.filters?.showAllProjects || 'Show all projects'
            }}
          />

          {/* Department Filter */}
            {canViewFilters && pageFilters.length > 0 && (
              <div className="flex items-center gap-2">
                <PageFilters
                  filters={pageFilters}
                  values={filterValues}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                  triggerLabel={"Filters"}
                  align="end"
                  width={320}
                  showClearButton={true}
                />
              </div>
            )}
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <WithPermission requiredPermissions={[PermissionResolverName.CreateProject]}>
              <Button 
                onClick={() => navigateWithLoading('/projects/new-project', {
                  message: t_project.actions.loadingCreator,
                  showToast: true
                })} 
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                {t_project.newProject}
              </Button>
            </WithPermission>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Year Filter */}
          <div className="flex-1 w-full">
            <YearFilter 
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onAddYear={handleAddYear}
              showAddButton={false}
              className="mb-6"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <ProjectsKPIs 
          kpis={kpis}
          t_project={t_project}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          selectedCurrency={selectedCurrency}
        />

        <Separator />

        {/* Charts Section - Using filteredData for all charts */}
        <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
          <ProjectsOverTimeChart data={filteredData} departments={departments} loading={isLoading} selectedYear={selectedYear} />
          <ProjectsByDepartmentChart data={filteredData} departments={departments} />
          <ProjectActivitiesChart data={filteredData} loading={isLoading} selectedYear={selectedYear} />
        </ResponsiveGridCarousel>

        <Separator />

        {/* Subsidy Refund Requests Card */}
        {/* <ProjectRefundRequestsCard /> */}

        {/* Projects Table / Kanban */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Title + description */}
              <div className="grid gap-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  {viewMode === 'kanban'
                    ? <LayoutGrid className="w-5 h-5" />
                    : <Globe className="w-5 h-5" />}
                  {t_project.projectsOverview}
                </CardTitle>
                <CardDescription>
                  {t_project?.pageHeader?.manageDescription || "Manage and track all projects across departments"}
                  {filterValues.department !== 'all' && (
                    <span className="ml-2">
                      • {departments.find((d: any) => d.id === filterValues.department)?.name}
                    </span>
                  )}
                  {filterValues.church !== 'all' && (
                    <span className="ml-2">
                      • {activeChurches.find((c: any) => c.id === filterValues.church)?.name}
                    </span>
                  )}
                </CardDescription>
              </div>

              {/* Controls: status filter + view toggle */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Status filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-[160px] text-xs">
                    <SelectValue placeholder={t_project.table?.status || 'Status'} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-950 border border-border shadow-md">
                    <SelectItem value="all">
                      {t_project.filters?.allDepartments?.split(' ')?.[0] || 'All'} Status
                    </SelectItem>
                    {PROJECT_STATUS_ORDER.map(s => (
                      <SelectItem key={s} value={s}>
                        {(t_project.status as Record<string, string>)?.[PROJECT_STATUS_CONFIG[s]?.labelKey] ?? s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View toggle */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-r-none h-8 px-2"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('kanban')}
                    className="rounded-l-none h-8 px-2"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          {viewMode === 'kanban' ? (
            <CardContent className="overflow-hidden p-0">
              <ProjectKanbanView
                projects={statusFilteredData}
                departments={departments}
                onView={handleViewProject}
                onEdit={handleEditProject}
                onQuickView={handleQuickViewProject}
              />
            </CardContent>
          ) : (
            <CardContent className="overflow-hidden">
              <UseTable
                columns={projectColumns}
                data={statusFilteredData}
                searchKey="title"
                translations={{
                  search: t_project.searchProjects,
                  clearFilters: t_project.table.clearFilters,
                  columns: t_project.table.columns,
                  toggleColumns: t_project.table.toggleColumns,
                  rowsPerPage: t_project.table.rowsPerPage,
                  showingResults: (from, to, total) => t_project.table.showingResults
                    .replace('{{from}}', from.toString())
                    .replace('{{to}}', to.toString())
                    .replace('{{total}}', total.toString()),
                  previous: t_project.table.previous,
                  next: t_project.table.next,
                  noResults: t_project.table.noResults,
                  all: t_project.filters?.allDepartments?.split(' ')?.[0] || 'All'
                }}
              />
            </CardContent>
          )}

          {/* Edit Project Modal */}
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedProject(undefined)
            }}
            onSuccess={handleEditProjectSuccess}
            project={selectedProject}
          />

          {/* Quick View Project Modal */}
          <DetailsViewProjectModal
            isOpen={isQuickViewOpen}
            onClose={() => {
              setIsQuickViewOpen(false)
              setQuickViewProject(undefined)
            }}
            project={quickViewProject ?? null}
            onStatusUpdated={() => refetch()}
          />
        </Card>

      </div>
    </AppLayout>
  )
}

// Main export with Suspense boundary for useSearchParams
export default function ProjectsPage() {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  return (
    <WithPermission
      requiredPermissions={[PermissionResolverName.Projects]}
      fallback={
        <AppLayout>
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-card-foreground flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-xl border p-6 sm:p-8 shadow-sm w-full max-w-md backdrop-blur-sm">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                <ShieldAlert className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {t_project.accessDenied.title}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t_project.accessDenied.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {t_project.accessDenied.contactAdmin}
                </p>
              </div>
            </div>
          </div>
        </AppLayout>
      }
    >
      <Suspense fallback={
        <LoadingSpinner
          text="Loading projects..."
          icon={Building2}
          size="lg"
          fullScreen
        />
      }>
        <ProjectsPageContent />
      </Suspense>
    </WithPermission>
  )
}