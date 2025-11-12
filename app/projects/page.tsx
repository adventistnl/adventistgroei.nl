"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
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
import {
  mockProjects,
  mockDepartments,
  mockSubsidyRequests,
  mockSubsidyActivities,
  projectsKPIs,
  projectsByDepartmentData,
  subsidyStatusDistribution,
  projectsTimelineData
} from "@/data/mockData"
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
const ProjectsByDepartmentChart = () => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Projects by Department
        </CardTitle>
        <CardDescription className="mt-1">
          Distribuição de projetos e orçamentos
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={projectsChartConfig} className="h-[300px] w-full">
        <BarChart data={projectsByDepartmentData}>
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
          <Bar dataKey="projects" fill="#3b82f6" radius={4} name="Projetos" />
          <Bar dataKey="budget_used" fill="#10b981" radius={4} name="Orçamento Usado" />
          <Bar dataKey="remaining_budget" fill="#e5e7eb" radius={4} name="Orçamento Restante" />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
)

const SubsidyStatusChart = () => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Subsidy Distribution
        </CardTitle>
        <CardDescription className="mt-1">
          Status dos pedidos de subsídio
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
            data={subsidyStatusDistribution}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            strokeWidth={2}
            paddingAngle={2}
          >
            {subsidyStatusDistribution.map((entry, index) => (
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

const ProjectsTimelineChart = () => (
  <Card className="h-full">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="w-5 h-5" />
          Projects Timeline
        </CardTitle>
        <CardDescription className="mt-1">
          Evolução mensal dos projetos
        </CardDescription>
      </div>
    </CardHeader>
    <CardContent>
      <ChartContainer config={timelineChartConfig} className="h-[300px] w-full">
        <AreaChart data={projectsTimelineData}>
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

export default function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const { navigateWithLoading } = useNavigateWithLoading()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [projects, setProjects] = useState<ProjectTableData[]>([])
  
  
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

  // Transform mock data to table format
  const transformProjectsData = (projectsData: typeof mockProjects): ProjectTableData[] => {
    return projectsData.map(project => {
      const subsidyRequests = mockSubsidyRequests.filter(req => req.project_id === project.id)
      const totalSubsidyAmount = subsidyRequests.reduce((sum, req) => sum + req.total_budget, 0)
      const totalActivities = subsidyRequests.reduce((sum, req) => {
        const activities = mockSubsidyActivities.filter(act => act.subsidy_request_id === req.id)
        return sum + activities.length
      }, 0)

      return {
        ...project,
        status: project.status as "active" | "upcoming" | "completed",
        type: (project as any).type as "Local" | "Global" | undefined,
        is_event: (project as any).is_event || false,
        eventId: (project as any).eventId || null,
        subsidyRequests: subsidyRequests.length,
        subsidyAmount: totalSubsidyAmount,
        activities: totalActivities
      }
    })
  }

  // Filter data based on selected department
  const filteredData = useMemo(() => {
    const allProjects = transformProjectsData(mockProjects)
    if (selectedDepartment === "all") return allProjects
    return allProjects.filter(project => project.department_id === selectedDepartment)
  }, [selectedDepartment])

  // Calculate KPIs based on filtered data
  const kpis = useMemo(() => {
    const filtered = filteredData
    return {
      totalProjects: filtered.length,
      activeProjects: filtered.filter(p => p.status === "active").length,
      completedProjects: filtered.filter(p => p.status === "completed").length,
      upcomingProjects: filtered.filter(p => p.status === "upcoming").length,
      totalBudget: filtered.reduce((sum, p) => sum + p.budget, 0),
      totalSubsidyRequests: filtered.reduce((sum, p) => sum + (p.subsidyRequests || 0), 0),
      totalSubsidyAmount: filtered.reduce((sum, p) => sum + (p.subsidyAmount || 0), 0),
      projectsWithVolunteers: filtered.filter(p => p.required_volunteers).length,
    }
  }, [filteredData])

  // Dados para KPI Cards
  const kpiCardsData = [
    {
      id: "total-projects",
      title: "Total Projects",
      value: kpis.totalProjects.toString(),
      change: `${kpis.activeProjects} active`,
      trend: { value: 12, isPositive: true },
      icon: Globe,
    },
    {
      id: "total-budget",
      title: "Total Budget",
      value: `R$ ${(kpis.totalBudget / 1000).toFixed(0)}K`,
      change: `Avg: R$ ${Math.round(kpis.totalBudget / (kpis.totalProjects || 1)).toLocaleString()}`,
      trend: { value: 8, isPositive: true },
      icon: DollarSign,
    },
    {
      id: "subsidy-requests",
      title: "Subsidy Requests",
      value: kpis.totalSubsidyRequests.toString(),
      change: `R$ ${(kpis.totalSubsidyAmount / 1000).toFixed(0)}K requested`,
      trend: { value: 15, isPositive: true },
      icon: Activity,
    },
    {
      id: "volunteers-projects",
      title: "With Volunteers",
      value: kpis.projectsWithVolunteers.toString(),
      change: `${Math.round((kpis.projectsWithVolunteers / (kpis.totalProjects || 1)) * 100)}% of projects`,
      trend: { value: 5, isPositive: true },
      icon: Users,
    },
  ]

  // Colunas para a tabela de projetos
  const projectColumns: ColumnDef<ProjectTableData>[] = [
    {
      accessorKey: "title",
      header: "Project Title",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: "department_id",
      header: "Department",
      cell: ({ row }) => {
        const dept = mockDepartments.find(d => d.id === row.original.department_id)
        return <span className="text-sm">{dept?.name || "Unknown"}</span>
      },
    },
    {
      accessorKey: "budget",
      header: "Budget",
      cell: ({ row }) => (
        <span className="font-mono">R$ {row.original.budget.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const color = status === "active" ? "bg-green-100 text-green-700" : 
                     status === "completed" ? "bg-blue-100 text-blue-700" : 
                     "bg-yellow-100 text-yellow-700"
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: "start_at",
      header: "Start Date",
      cell: ({ row }) => {
        const date = new Date(row.original.start_at)
        return date.toLocaleDateString()
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const project = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleViewProject(project)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditProject(project)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteProject(project)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Simulate data loading
  useEffect(() => {
    const loadProjectsData = async () => {
      const loadingToast = toast.loading(t_project.toasts.loadingData)
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setProjects(transformProjectsData(mockProjects))
        
        toast.dismiss(loadingToast)
        toast.success("📊 Projects data loaded successfully!", {
          duration: 3000
        })
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t_project.toasts.errorLoading)
        setIsLoading(false)
      }
    }

    loadProjectsData()
  }, [t_project])

  const handleRefresh = async () => {
    setRefreshing(true)
    
    const refreshToast = toast.loading(t_project.toasts.dataRefreshed.replace("successfully!", "..."))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProjects(transformProjectsData(mockProjects))
      
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

  const handleDeleteProject = (project: ProjectTableData) => {
    // Show confirmation before deleting
    if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      setProjects(prev => prev.filter(p => p.id !== project.id))
      toast.success(`🗑️ Project "${project.title}" deleted successfully`, { duration: 3000 })
    }
  }

  const handleCreateEvent = (project: ProjectTableData) => {
    toast.success(`Creating event for: ${project.title}`)
    // Navigate to event creation page or handle inline
  }

  const handleCreateCommunication = (project: ProjectTableData) => {
    toast.success(`Creating communication for: ${project.title}`)
    // Navigate to communication creation page or handle inline
  }

  const handleDuplicateProject = (project: ProjectTableData) => {
    const duplicatedProject: ProjectTableData = {
      ...project,
      id: `duplicate-${Date.now()}`,
      title: `${project.title} (Cópia)`,
      status: "upcoming",
      subsidyRequests: 0,
      subsidyAmount: 0,
      activities: 0
    }
    
    setProjects(prev => [duplicatedProject, ...prev])
    toast.success(`📋 Projeto duplicado: ${project.title}`, { duration: 3000 })
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
                {mockDepartments.map((dept) => (
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
          <h3 className="text-lg sm:text-xl font-semibold">Project Analytics</h3>
          <ResponsiveGridCarousel autoplayDelay={5000} className="">
            <ProjectsByDepartmentChart />
            <SubsidyStatusChart />
            <ProjectsTimelineChart />
          </ResponsiveGridCarousel>
        </div>

        {/* Projects Table */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">Project Management</h3>
          <UseTable
            columns={projectColumns}
            data={filteredData}
            searchKey="title"
            filters={[
              {
                id: "status",
                title: "Status",
                options: [
                  { label: "Active", value: "active" },
                  { label: "Completed", value: "completed" },
                  { label: "Upcoming", value: "upcoming" }
                ]
              },
              {
                id: "department_id",
                title: "Department",
                options: mockDepartments.map(dept => ({
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
