"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useQuery, useMutation } from "@apollo/client"
import { useRouter, useSearchParams } from "next/navigation"
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
import { Globe, Plus, RefreshCw, Building, MoreHorizontal, Eye, Edit, Activity, TrendingUp, Users, DollarSign, Folder, ArrowRight, Calendar, Building2, Clock, CheckCircle2, ListChecks } from "lucide-react"
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
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { MyProjectsFilter } from "@/components/shared/my-projects-filter"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import toast from "react-hot-toast"
import "@/lib/i18n"
import { useAuth } from "@/contexts/auth-context"
export default function ProjectsPage() {
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

  const institutionId = currentInstitutionData?.id

  // Fetch projects from backend
  const { data: projectsData, loading: isLoading, error, refetch } = useQuery(GET_PROJECTS_QUERY)

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
        activities: project.activities?.length || 0,
        is_event: !!project.event_id,
        type: project.type as "Local" | "Global" | undefined,
        eventId: project.event_id || null,
        // Preserve activities data with owners for user avatar display
        activitiesData: project.activities || [],
        // Preserve owner data for assigned user column
        owner_id: project.owner_id || project.owner?.id,
        owner: project.owner || null,
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
      filtered = filtered.filter(project => {
        // Check if user is the owner
        const isOwner = user.id === project.owner_id || user.id === project.owner?.id
        
        // Check if user is a collaborator in any activity
        const isCollaborator = project.activitiesData?.some((activity: any) => 
          activity.assignees?.some((assignee: any) => assignee.user?.id === user.id)
        )
        
        return isOwner || isCollaborator
      })
    }
    
    return filtered
  }, [filterValues.department, filterValues.church, projectsByYear, showMyProjectsOnly, user])

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
      cell: ({ row }) => (
        <div className="flex items-center justify-between gap-3 pl-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Folder className="w-4 h-4 text-primary" />
            </div>
            <div className="font-medium">{row.original.title}</div>
          </div>
        </div>
      ),
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

        
        // Get unique users from activities - extract user from assignees
        const activityUsers = project.activitiesData?.flatMap((activity: any) => 
          activity.assignees?.map((assignee: any) => assignee.user) || []
        ) || []

        
        // Remove duplicates by id
        const uniqueUsers = Array.from(
          new Map(activityUsers.map((user: any) => [user.id, user])).values()
        )
        // Get owner
        const ownerId = project.owner?.id || project.owner_id
        // Reorder users to show owner first
        let orderedUsers: UserAvatarData[] = []
        
        if (ownerId) {
          const ownerInUsers = uniqueUsers.find((user: any) => user.id === ownerId)
          
          // If owner is in activity users, use that data
          if (ownerInUsers) {
            const otherUsers = uniqueUsers.filter((user: any) => user.id !== ownerId)
            orderedUsers = [
              {
                id: (ownerInUsers as any).id,
                name: (ownerInUsers as any).name,
                email: (ownerInUsers as any).email,
                role: 'Owner',
                isOwner: true
              },
              ...otherUsers.map((user: any) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'Colaborador'
              }))
            ]
          } else if (project.owner) {
            // If owner is not in activities, add from project.owner
            orderedUsers = [
              {
                id: project.owner.id,
                name: project.owner.name,
                email: project.owner.email,
                role: 'Owner',
                isOwner: true
              },
              ...uniqueUsers.map((user: any) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: 'Colaborador'
              }))
            ]
          } else {
            // No owner data available
            orderedUsers = uniqueUsers.map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              role: 'Colaborador'
            }))
          }
        } else {
          // No owner ID
          orderedUsers = uniqueUsers.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'Colaborador'
          }))
        }
        
        
        if (orderedUsers.length === 0) {
          return (
            <div className="text-xs text-muted-foreground">
              {t_project.table.noCollaborators || "No collaborators"}
            </div>
          )
        }
        
        return (
          <UsersAvatarGroup
            users={orderedUsers}
            maxDisplay={2}
            size="sm"
            showLabel={false}
            showAddButton={false}
            ownerUserId={ownerId}
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
          IN_PROGRESS: { text: t_project.status?.inProgress || 'In Progress', variant: 'success', dotColor: '#10b981' },
          IN_REVIEW: { text: t_project.status?.inReview || 'In Review', variant: 'info', dotColor: '#3b82f6' },
          ON_HOLD: { text: t_project.status?.onHold || 'On Hold', variant: 'warning', dotColor: '#f59e0b' },
          EXPIRED: { text: t_project.status?.expired || 'Expired', variant: 'error', dotColor: '#ef4444' },
          CONCLUDED: { text: t_project.status?.concluded || 'Concluded', variant: 'default', dotColor: '#64748b' },
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
        
        // Validate ownership: only project owner can edit/delete
        const isProjectOwner = user?.id === project.owner_id || user?.id === project.owner?.id
        
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
                    handleViewProject(project)
                  }}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {t_project.viewProject}
                </DropdownMenuItem>
                
                {/* Only show Edit option if user is the project owner */}
                {isProjectOwner && (
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



  // Year Filter Component
  const YearFilter = ({ showAddButton = true }: { showAddButton?: boolean }) => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const canAddMore = Math.max(...availableYears) < maxAllowedYear

    return (
      <div className="mb-6">
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
          
          {/* Add New Year Button */}
          {showAddButton && (
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
              {t_project.yearFilter.addYear}
            </Button>
          )}
        </div>
      </div>
    )
  }

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
            <YearFilter showAddButton={false} />
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

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <div className="grid gap-1">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t_project.projectsOverview}
              </CardTitle>
              <CardDescription>
                {t_project?.pageHeader?.manageDescription || "Manage and track all projects across departments"}
                {filterValues.department !== "all" && (
                  <span className="ml-2">
                    • Department: {departments.find((d: any) => d.id === filterValues.department)?.name}
                  </span>
                )}
                {filterValues.church !== "all" && (
                  <span className="ml-2">
                    • Church: {activeChurches.find((c: any) => c.id === filterValues.church)?.name}
                  </span>
                )}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <UseTable
              columns={projectColumns}
              data={filteredData}
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
                all: t_project.filters?.allDepartments?.split(' ')?.[0] || "All"
              }}
            />
          </CardContent>

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
        </Card>

      </div>
    </AppLayout>
  )
}