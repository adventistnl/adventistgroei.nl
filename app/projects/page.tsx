"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useQuery, useMutation } from "@apollo/client"
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
import { Globe, Plus, RefreshCw, Building, MoreHorizontal, Eye, Edit, Trash2, Activity, TrendingUp, Users, DollarSign } from "lucide-react"
import { useInstitution } from "@/contexts/institution-context"
import { useCurrency } from "@/contexts/currency-context"
import { ProjectsKPIs } from "@/components/projects/projects-kpis"
import { ProjectsByDepartmentChart } from "@/components/projects/charts/projects-by-department-chart"
import { ProjectActivitiesChart } from "@/components/projects/charts/project-activities-chart"
import { ProjectsOverTimeChart } from "@/components/projects/charts/projects-over-time-chart"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { createProjectColumns } from "@/components/projects/projects-table-columns"
import { EditProjectModal } from "@/components/modals/project/edit-project-modal"
import { DeleteProjectModal } from "@/components/modals/project/delete-project-modal"
import toast from "react-hot-toast"
import "@/lib/i18n"
import { useAuth } from "@/contexts/auth-context"

export default function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const { navigateWithLoading } = useNavigateWithLoading()
  const { currentInstitutionData } = useInstitution()
  const { selectedCurrency, formatCurrency } = useCurrency()
  const { roles } = useAuth()
  
  const canViewFilters = roles.includes('ADMIN') || roles.includes('INSTITUTIONAL_LEADER') || roles.includes('DEV')

  const [refreshing, setRefreshing] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectTableData | undefined>(undefined)

  const institutionId = currentInstitutionData?.id

  // Fetch projects from backend
  const { data: projectsData, loading: isLoading, error, refetch } = useQuery(GET_PROJECTS_QUERY)

  // Fetch departments
  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  const departments = departmentsData?.departments || []

  // Fetch KPIs and analytics data
  const { data: kpisData, loading: kpisLoading } = useQuery(GET_PROJECT_KPIS_QUERY, {
    variables: { institutionId },
    skip: !institutionId
  })

  // Delete project mutation
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT_MUTATION, {
    refetchQueries: [{ query: GET_PROJECTS_QUERY }, { query: GET_PROJECT_KPIS_QUERY }]
  })

  // Filter states
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("6m")
  const [chartPeriod, setChartPeriod] = useState("6m")
  
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
      // Calculate status based on dates
      const now = new Date()
      const startDate = new Date(project.start_at)
      const endDate = new Date(project.end_at)

      let status: "active" | "upcoming" | "completed"
      if (startDate > now) {
        status = "upcoming"
      } else if (endDate < now) {
        status = "completed"
      } else {
        status = "active"
      }

      return {
        id: project.id,
        department_id: project.department_id,
        title: project.title,
        description: project.description,
        budget: project.budget,
        is_private: project.is_private,
        required_volunteers: project.required_volunteers,
        start_at: project.start_at,
        end_at: project.end_at,
        created_at: project.created_at,
        language_preference: project.language_preference,
        institutionId: project.institution_id || project.Institution?.id || '',
        status,
        subsidyRequests: 0, // TODO: Will be populated when subsidy data is available
        subsidyAmount: 0, // TODO: Will be populated when subsidy data is available
        activities: project.activities?.length || 0,
        is_event: !!project.event_id,
        type: project.type as "Local" | "Global" | undefined,
        eventId: project.event_id || null,
        // Preserve activities data with owners for user avatar display
        activitiesData: project.activities || [],
        // Preserve owner data for assigned user column
        owner: project.owner || null
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

  // Filter data based on selected department
  const filteredData = useMemo(() => {
    if (selectedDepartment === "all") return projectsByYear
    return projectsByYear.filter(project => project.department_id === selectedDepartment)
  }, [selectedDepartment, projectsByYear])



  // Get KPIs from backend data filtered by year
  const kpis = useMemo(() => {
    if (kpisData?.projectKPIs) {
      return kpisData.projectKPIs
    }
    
    // Fallback calculation if backend data is missing
    const yearProjects = projectsByYear
    const totalProjects = yearProjects.length
    const totalBudget = yearProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
    
    return {
      totalProjects,
      activeProjects: yearProjects.filter(p => p.status === 'active').length,
      completedProjects: yearProjects.filter(p => p.status === 'completed').length,
      upcomingProjects: yearProjects.filter(p => p.status === 'upcoming').length,
      totalBudget,
      totalSubsidyRequests: 0,
      totalSubsidyAmount: 0,
      projectsWithVolunteers: yearProjects.filter(p => p.required_volunteers).length,
      averageBudgetPerProject: totalProjects > 0 ? totalBudget / totalProjects : 0,
    }
  }, [kpisData, projectsByYear])

  // Colunas para a tabela de projetos
  const projectColumns: ColumnDef<ProjectTableData>[] = [
    {
      id: "mobile-expand",
      header: "",
      cell: () => null, // Renderizado pelo UseTable
    },
    {
      accessorKey: "title",
      header: t_project.table.projectTitle,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: "department_id",
      header: t_project.table.department,
      cell: ({ row }) => {
        const dept = departments.find((d: any) => d.id === row.original.department_id)
        return <span className="text-sm">{dept?.name || "Unknown"}</span>
      },
    },
    {
      accessorKey: "budget",
      header: t_project.budget.annualBudget,
      cell: ({ row }) => (
        <span className="font-mono">R$ {row.original.budget.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: t_project.table.status,
      cell: ({ row }) => {
        const status = row.original.status
        const statusText = status === "active" ? t_project.active :
                          status === "completed" ? t_project.completed :
                          t_project.upcoming
        const color = status === "active" ? "bg-green-100 text-green-700" : 
                     status === "completed" ? "bg-blue-100 text-blue-700" : 
                     "bg-yellow-100 text-yellow-700"
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {statusText}
          </span>
        )
      },
    },
    {
      accessorKey: "start_at",
      header: t_project.table.startDate,
      cell: ({ row }) => {
        const date = new Date(row.original.start_at)
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      header: t_project.table.actions,
      cell: ({ row }) => {
        const project = row.original
        
        return (
          <div data-action-button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
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
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteProject(project)
                  }}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t_project.deleteProject}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Show loading/error toasts
  useEffect(() => {
    if (error) {
      toast.error(t_project.toasts.errorLoading)
    }
  }, [error, t_project])

  const handleRefresh = async () => {
    setRefreshing(true)

    const refreshToast = toast.loading(t_project.toasts.dataRefreshed.replace("successfully!", "..."))

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

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    toast.success(t_project.toasts.filterApplied, { duration: 1500 })
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

  const handleViewProject = (project: ProjectTableData) => {
    navigateWithLoading(`/projects/${project.id}`, {
      message: `Opening ${project.title}`,
      showToast: true,
      delay: 1000
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

  const handleDeleteProject = (project: ProjectTableData) => {
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteProjectSuccess = () => {
    refetch()
    setIsDeleteModalOpen(false)
    setSelectedProject(undefined)
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
              Add Year
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
              Visão completa dos projetos e pedidos de subsídio da organização - {selectedYear}
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
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button 
              onClick={() => navigateWithLoading('/projects/new-project', {
                message: "🚀 Loading project creator...",
                showToast: true,
                delay: 800
              })} 
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {t_project.newProject}
            </Button>
          </div>
        </div>

        {/* Year Filter */}
        <YearFilter showAddButton={false} />

        {/* KPI Cards */}
        <ProjectsKPIs 
          kpis={kpis}
          t_project={t_project}
          isLoading={isLoading}
          formatCurrency={formatCurrency}
          selectedCurrency={selectedCurrency}
        />

        <Separator />

        {/* Charts Section */}
        <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
          <ProjectsOverTimeChart data={projectsByYear} departments={departments} loading={isLoading} selectedYear={selectedYear} />
          <ProjectsByDepartmentChart data={filteredData} departments={departments} />
          <ProjectActivitiesChart data={filteredData} />
        </ResponsiveGridCarousel>

        <Separator />

        {/* Projects Table */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="grid gap-1 flex-1">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t_project.projectsOverview}
              </CardTitle>
              <CardDescription>
                Manage and track all projects across departments
              </CardDescription>
            </div>
            {departments.length > 0 && canViewFilters && (
              <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="ml-auto h-9 w-[200px] rounded-lg">
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="all">{t_project.filters.allDepartments}</SelectItem>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardHeader>
          <CardContent className="overflow-hidden">
            <UseTable
              columns={projectColumns}
              data={filteredData}
              searchKey="title"
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

      {/* Delete Project Modal */}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedProject(undefined)
        }}
        onConfirm={handleDeleteProjectSuccess}
        project={selectedProject || null}
      />
        </Card>

      </div>
    </AppLayout>
  )
}