"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { LanguageSelector } from "@/components/language-selector"
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
import { AddProjectModal, ProjectFormData } from "@/components/modals/project/add-project-modal"
import { EditProjectModal, EditProjectFormData } from "@/components/modals/project/edit-project-modal"
import { CreateEventModal, EventFormData } from "@/components/modals/project/create-event-modal"
import { CreateCommunicationModal, CommunicationFormData } from "@/components/modals/project/create-communication-modal"
import { ProjectsTable, ProjectTableData } from "@/components/projects/projects-table"
import { useRouter } from "next/navigation"
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
  Eye
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

export default function ProjectsPage() {
  const { t, i18n } = useTranslation()
  const { activeInstitution } = useInstitution()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [projects, setProjects] = useState<ProjectTableData[]>([])
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectTableData | undefined>(undefined)
  
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

  const handleAddProject = (data: ProjectFormData) => {
    const newProject: ProjectTableData = {
      id: `new-${Date.now()}`,
      department_id: data.department_id,
      title: data.title,
      description: data.description,
      budget: data.budget,
      is_private: data.is_private,
      required_volunteers: data.required_volunteers,
      start_at: data.start_at.toISOString(),
      end_at: data.end_at.toISOString(),
      language_preference: data.language_preference,
      institutionId: activeInstitution.id,
      status: "upcoming",
      subsidyRequests: 0,
      subsidyAmount: 0,
      activities: 0
    }

    setProjects(prev => [newProject, ...prev])
    setIsAddModalOpen(false)
    toast.success(t_project.toasts.projectCreated, { duration: 3000 })
  }

  const handleViewProject = (project: ProjectTableData) => {
    router.push(`/projects/${project.id}`)
  }

  const handleEditProject = (project: ProjectTableData) => {
    setSelectedProject(project)
    setIsEditModalOpen(true)
  }

  const handleDeleteProject = (project: ProjectTableData) => {
    setProjects(prev => prev.filter(p => p.id !== project.id))
    toast.success(t_project.toasts.projectDeleted, { duration: 3000 })
  }

  const handleCreateEvent = (project: ProjectTableData) => {
    setSelectedProject(project)
    setIsEventModalOpen(true)
  }

  const handleCreateCommunication = (project: ProjectTableData) => {
    setSelectedProject(project)
    setIsCommunicationModalOpen(true)
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

  const handleEditSubmit = (data: EditProjectFormData) => {
    if (selectedProject) {
      setProjects(prev => prev.map(p => 
        p.id === selectedProject.id 
          ? {
              ...p,
              ...data,
              start_at: data.start_at.toISOString(),
              end_at: data.end_at.toISOString(),
            }
          : p
      ))
      setIsEditModalOpen(false)
      setSelectedProject(undefined)
      toast.success(t_project.toasts.projectUpdated, { duration: 3000 })
    }
  }

  const handleEventSubmit = (data: EventFormData) => {
    // Here you would typically send the event data to your API
    console.log('Creating event:', data)
    setIsEventModalOpen(false)
    setSelectedProject(undefined)
    toast.success(t_project.toasts.eventCreated, { duration: 3000 })
  }

  const handleCommunicationSubmit = (data: CommunicationFormData) => {
    // Here you would typically send the communication data to your API
    console.log('Creating communication:', data)
    setIsCommunicationModalOpen(false)
    setSelectedProject(undefined)
    toast.success(t_project.toasts.communicationCreated, { duration: 3000 })
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t_project.projectsDashboard}
            </h2>
            <p className="text-muted-foreground">
              Visão completa dos projetos e pedidos de subsídio da organização
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
              <SelectTrigger className="w-48">
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
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              {t_project.newProject}
            </Button>
            
            <LanguageSelector />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_project.kpis.totalProjects}</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalProjects}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                {kpis.activeProjects} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_project.kpis.totalBudget}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {kpis.totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Média: R$ {Math.round(kpis.totalBudget / (kpis.totalProjects || 1)).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_project.kpis.totalSubsidyRequests}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalSubsidyRequests}</div>
              <p className="text-xs text-muted-foreground">
                R$ {kpis.totalSubsidyAmount.toLocaleString()} solicitado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t_project.kpis.projectsWithVolunteers}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.projectsWithVolunteers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((kpis.projectsWithVolunteers / (kpis.totalProjects || 1)) * 100)}% dos projetos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Projects by Department */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {t_project.charts.projectsByDepartment}
                </CardTitle>
                <CardDescription className="mt-1">
                  Distribuição de projetos e orçamentos
                </CardDescription>
              </div>
              <PeriodSelector
                value={chartPeriod}
                onChange={setChartPeriod}
                options={[
                  { value: "3m", label: "3M" },
                  { value: "6m", label: "6M" },
                  { value: "1y", label: "1A" }
                ]}
              />
            </CardHeader>
            <CardContent>
              <ChartContainer config={projectsChartConfig} className="h-[350px] w-full">
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

          {/* Subsidy Status Distribution */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  {t_project.charts.subsidyDistribution}
                </CardTitle>
                <CardDescription className="mt-1">
                  Status dos pedidos de subsídio
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={statusChartConfig} className="h-[350px] w-full">
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
        </div>

        {/* Timeline Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="w-5 h-5" />
                {t_project.charts.projectsTimeline}
              </CardTitle>
              <CardDescription className="mt-1">
                Evolução mensal dos projetos
              </CardDescription>
            </div>
            <PeriodSelector
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={[
                { value: "6m", label: t_project.filters.last6Months },
                { value: "1y", label: t_project.filters.lastYear },
                { value: "current", label: t_project.filters.currentYear }
              ]}
            />
          </CardHeader>
          <CardContent>
            <ChartContainer config={timelineChartConfig} className="h-[400px] w-full">
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

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Lista de Projetos
            </CardTitle>
            <CardDescription>
              Tabela detalhada com todos os projetos e suas informações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsTable
              data={filteredData}
              onView={handleViewProject}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onCreateEvent={handleCreateEvent}
              onCreateCommunication={handleCreateCommunication}
              onDuplicate={handleDuplicateProject}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        <AddProjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddProject}
        />
        
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProject(undefined)
          }}
          onSubmit={handleEditSubmit}
          project={selectedProject}
        />
        
        <CreateEventModal
          isOpen={isEventModalOpen}
          onClose={() => {
            setIsEventModalOpen(false)
            setSelectedProject(undefined)
          }}
          onSubmit={handleEventSubmit}
          project={selectedProject}
        />
        
        <CreateCommunicationModal
          isOpen={isCommunicationModalOpen}
          onClose={() => {
            setIsCommunicationModalOpen(false)
            setSelectedProject(undefined)
          }}
          onSubmit={handleCommunicationSubmit}
          project={selectedProject}
        />
      </div>
    </AppLayout>
  )
}
