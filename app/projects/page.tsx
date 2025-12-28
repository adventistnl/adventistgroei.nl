"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@apollo/client"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { LanguageSelector } from "@/components/shared/language-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { ProjectsTable, ProjectTableData } from "@/components/projects/projects-table"
import { useRouter } from "next/navigation"
import { useNavigateWithLoading } from "@/hooks/use-navigation-loading"
import { projectTranslations } from "@/lib/translations/projects"
import { GET_PROJECTS_QUERY, GET_PROJECT_KPIS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { DELETE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { useMutation } from "@apollo/client"
import {
  Globe,
  DollarSign,
  Users,
  Plus,
  RefreshCw,
  TrendingUp,
  Building,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useInstitution } from "@/contexts/institution-context"
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { ColumnDef } from "@tanstack/react-table"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Chart configurations with duotone colors
const projectsChartConfig = {
  projects: {
    label: "Projetos",
    color: "#3b82f6", // Blue
  },
  budget: {
    label: "Orçamento",
    color: "#10b981", // Green
  },
  subsidies: {
    label: "Subsídios",
    color: "#f59e0b", // Amber
  },
} satisfies ChartConfig

const timelineChartConfig = {
  created: {
    label: "Criados",
    color: "#3b82f6", // Blue
  },
  completed: {
    label: "Concluídos",
    color: "#10b981", // Green
  },
  budget: {
    label: "Orçamento",
    color: "#8b5cf6", // Purple
  },
} satisfies ChartConfig

const statusChartConfig = {
  approved: {
    label: "Aprovado",
    color: "#22c55e", // Green
  },
  pending: {
    label: "Pendente",
    color: "#f59e0b", // Amber
  },
  analysis: {
    label: "Em Análise",
    color: "#3b82f6", // Blue
  },
  rejected: {
    label: "Rejeitado",
    color: "#ef4444", // Red
  },
} satisfies ChartConfig

// Componentes individuais dos gráficos
const ProjectsByDepartmentChart = ({ data }: { data: any[] }) => {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  return (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {t_project.charts.projectsByDepartment}
        </CardTitle>
        <CardDescription className="mt-1">
          {t_project.charts.budgetVsSubsidies}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={projectsChartConfig} className="h-[300px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="department"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={11}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
          <Legend />
          <Bar dataKey="projects" fill="#3b82f6" radius={4} name={t_project.projects} />
          <Bar dataKey="budget_used" fill="#10b981" radius={4} name={t_project.budget.budgetUsed} />
          <Bar dataKey="remaining_budget" fill="#e5e7eb" radius={4} name={t_project.budget.remainingBudget} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
  )
}

const SubsidyStatusChart = ({ data }: { data: any[] }) => {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  return (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          {t_project.charts.subsidyDistribution}
        </CardTitle>
        <CardDescription className="mt-1">
          {t_project.charts.subsidyStatusBreakdown}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={statusChartConfig} className="h-[300px] w-full">
        <RechartsPieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            strokeWidth={2}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
              />
            ))}
          </Pie>
          <Legend />
        </RechartsPieChart>
      </ChartContainer>
    </CardContent>
  </Card>
  )
}

const ProjectsTimelineChart = ({ data }: { data: any[] }) => {
  const { i18n } = useTranslation()
  const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  return (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          {t_project.charts.projectsTimeline}
        </CardTitle>
        <CardDescription className="mt-1">
          {t_project.charts.monthlyProgress}
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={timelineChartConfig} className="h-[300px] w-full">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fillCreated" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            fontSize={12}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Area
            dataKey="created"
            type="natural"
            fill="url(#fillCreated)"
            stroke="#3b82f6"
            stackId="a"
          />
          <Area
            dataKey="completed"
            type="natural"
            fill="url(#fillCompleted)"
            stroke="#10b981"
            stackId="a"
          />
          <Legend />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
  )
}

export default function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { navigateWithLoading } = useNavigateWithLoading()
  const { currentInstitutionData } = useInstitution()
  const [refreshing, setRefreshing] = useState(false)

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
        language_preference: project.language_preference,
        institutionId: project.institution_id || project.Institution?.id || '',
        status,
        subsidyRequests: 0, // TODO: Will be populated when subsidy data is available
        subsidyAmount: 0, // TODO: Will be populated when subsidy data is available
        activities: project.activities?.length || 0,
        is_event: !!project.event_id,
        type: project.type as "Local" | "Global" | undefined,
        eventId: project.event_id || null
      }
    })
  }

  // Transform projects data
  const projects = useMemo(() => {
    if (!projectsData?.projects) return []
    return transformProjectsData(projectsData.projects)
  }, [projectsData])

  // Filter data based on selected department
  const filteredData = useMemo(() => {
    if (selectedDepartment === "all") return projects
    return projects.filter(project => project.department_id === selectedDepartment)
  }, [selectedDepartment, projects])

  // Get KPIs from backend data
  const kpis = useMemo(() => {
    if (!kpisData?.projectKPIs) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        completedProjects: 0,
        upcomingProjects: 0,
        totalBudget: 0,
        totalSubsidyRequests: 0,
        totalSubsidyAmount: 0,
        projectsWithVolunteers: 0,
        averageBudgetPerProject: 0,
      }
    }
    return kpisData.projectKPIs
  }, [kpisData])

  // Dados para KPI Cards - Métricas mais relevantes
  const kpiCardsData = useMemo(() => {
    const completionRate = kpis.totalProjects > 0 
      ? Math.round((kpis.completedProjects / kpis.totalProjects) * 100) 
      : 0
    
    const budgetUtilization = kpis.totalBudget > 0
      ? Math.round(((kpis.totalBudget - (kpis.totalBudget * 0.15)) / kpis.totalBudget) * 100) // Mock: 85% utilizado
      : 0
    
    const subsidyApprovalRate = kpis.totalSubsidyRequests > 0
      ? Math.round((kpis.totalSubsidyRequests * 0.65) / kpis.totalSubsidyRequests * 100) // Mock: 65% aprovado
      : 0

    return [
      {
        id: "total-projects",
        title: t_project.kpis.totalProjects,
        value: kpis.totalProjects.toString(),
        subtitle: `${kpis.activeProjects} ativos | ${kpis.completedProjects} concluídos`,
        trend: { 
          value: 12, 
          isPositive: true,
          label: "vs mês anterior"
        },
        icon: Globe,
      },
      {
        id: "active-projects",
        title: "Projetos Ativos",
        value: kpis.activeProjects.toString(),
        subtitle: `${kpis.upcomingProjects} aguardando início`,
        trend: { 
          value: 8, 
          isPositive: true,
          label: "novos este mês"
        },
        icon: Activity,
      },
      {
        id: "total-budget",
        title: t_project.kpis.totalBudget,
        value: `R$ ${(kpis.totalBudget / 1000).toFixed(1)}K`,
        subtitle: `Média: R$ ${Math.round(kpis.averageBudgetPerProject).toLocaleString()}`,
        trend: { 
          value: budgetUtilization, 
          isPositive: budgetUtilization > 70,
          label: `${budgetUtilization}% utilizado`
        },
        icon: DollarSign,
      },
      {
        id: "completion-rate",
        title: "Taxa de Conclusão",
        value: `${completionRate}%`,
        subtitle: `${kpis.completedProjects} de ${kpis.totalProjects} finalizados`,
        trend: { 
          value: 5, 
          isPositive: true,
          label: "vs mês anterior"
        },
        icon: TrendingUp,
      },
      {
        id: "subsidy-requests",
        title: "Pedidos de Subsídio",
        value: kpis.totalSubsidyRequests.toString(),
        subtitle: `R$ ${(kpis.totalSubsidyAmount / 1000).toFixed(1)}K solicitado`,
        trend: { 
          value: subsidyApprovalRate, 
          isPositive: subsidyApprovalRate > 50,
          label: `${subsidyApprovalRate}% aprovados`
        },
        icon: DollarSign,
      },
      {
        id: "volunteers-projects",
        title: "Projetos com Voluntários",
        value: kpis.projectsWithVolunteers.toString(),
        subtitle: `${Math.round((kpis.projectsWithVolunteers / (kpis.totalProjects || 1)) * 100)}% dos projetos`,
        trend: { 
          value: 15, 
          isPositive: true,
          label: "engajamento crescente"
        },
        icon: Users,
      },
    ]
  }, [kpis, t_project])

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
        const dept = departments.find(d => d.id === row.original.department_id)
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


  const handleViewProject = (project: ProjectTableData) => {
    navigateWithLoading(`/projects/${project.id}`, {
      message: `📋 Opening project: ${project.title}...`,
      showToast: true,
      delay: 1000
    })
  }

  const handleEditProject = (project: ProjectTableData) => {
    navigateWithLoading(`/projects/new-project?edit=${project.id}`, {
      message: `✏️ Loading project editor: ${project.title}...`,
      showToast: true,
      delay: 1000
    })
  }

  const handleDeleteProject = async (project: ProjectTableData) => {
    // Show confirmation before deleting
    if (window.confirm(`${t_project.deleteProject}: "${project.title}"?`)) {
      const deleteToast = toast.loading(`Deleting project: ${project.title}...`)

      try {
        await deleteProjectMutation({
          variables: { id: project.id }
        })

        toast.dismiss(deleteToast)
        toast.success(t_project.toasts.projectDeleted, { duration: 3000 })
      } catch (error) {
        toast.dismiss(deleteToast)
        toast.error(`Failed to delete project: ${error}`)
      }
    }
  }

  const handleCreateEvent = (project: ProjectTableData) => {
    toast.success(t_project.toasts.eventCreated)
    // Navigate to event creation page or handle inline
  }

  const handleCreateCommunication = (project: ProjectTableData) => {
    toast.success(t_project.toasts.communicationCreated)
    // Navigate to communication creation page or handle inline
  }

  const handleDuplicateProject = (project: ProjectTableData) => {
    const duplicatedProject: ProjectTableData = {
      ...project,
      id: `duplicate-${Date.now()}`,
      title: `${project.title} (${i18n.language === 'pt' ? 'Cópia' : i18n.language === 'nl' ? 'Kopie' : 'Copy'})`,
      status: "upcoming",
      subsidyRequests: 0,
      subsidyAmount: 0,
      activities: 0
    }
    
    setProjects(prev => [duplicatedProject, ...prev])
    toast.success(`${t_project.actions.duplicateProject}: ${project.title}`, { duration: 3000 })
  }

  // Period selector component
  const PeriodSelector = ({ value, onChange, options }: {
    value: string
    onChange: (value: string) => void
    options: { value: string; label: string }[]
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32 h-8 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t_project.projectsDashboard}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Visão completa dos projetos e pedidos de subsídio da organização
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t_project.filters.allDepartments}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button onClick={() => navigateWithLoading('/projects/new-project', {
                message: "🚀 Loading project creator...",
                showToast: true,
                delay: 800
              })} className="gap-2 flex-1 sm:flex-none">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t_project.newProject}</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          minCardsForCarousel={4}
          showCarousel={true}
        />

        {/* Charts Section */}
        <div className="space-y-6">
          <h3 className="text-lg sm:text-xl font-semibold">{t_project.charts.projectsByDepartment}</h3>
          <ResponsiveGridCarousel autoplayDelay={5000} className="">
            <ProjectsByDepartmentChart data={kpisData?.projectsByDepartment || []} />
            <SubsidyStatusChart data={kpisData?.subsidyStatusDistribution || []} />
            <ProjectsTimelineChart data={kpisData?.projectsTimeline || []} />
          </ResponsiveGridCarousel>
        </div>

        {/* Projects Table */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">{t_project.projectsOverview}</h3>
          <UseTable
            columns={projectColumns}
            data={filteredData}
            searchKey="title"
            filters={[
              {
                id: "status",
                title: t_project.table.status,
                options: [
                  { label: t_project.active, value: "active" },
                  { label: t_project.completed, value: "completed" },
                  { label: t_project.upcoming, value: "upcoming" }
                ]
              },
              {
                id: "department_id",
                title: t_project.table.department,
                options: departments.map(dept => ({
                  label: dept.name,
                  value: dept.id
                }))
              }
            ]}
          />
        </div>

      </div>
    </AppLayout>
  )
}
