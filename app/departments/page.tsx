"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Layers, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  Home,
  DollarSign,
  Building,
  ContactRound,
  TrendingUp,
  Calendar,
  Shield,
  MapPin,
  User
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { structureTranslations } from "@/lib/translations/structure"
import { DataTable } from "@/components/ui/data-table"
import { AddDepartmentModal, EditDepartmentModal, DeleteDepartmentModal, DepartmentData, ChurchData } from "@/components/modals/department"
import { ViewContactModal, ContactData } from "@/components/modals/contact"
import { AnnualBudgetModal, AnnualBudgetData } from "@/components/modals/budget"
import { DepartmentsKPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"

// Charts - usando a lib atual do sistema
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"

// Mock data baseado na estrutura ERD do AdventistGroei
const MOCK_DEPARTMENTS = [
  {
    id: "d1",
    name: "Ministério Jovem",
    description: "Ministério dedicado aos jovens e adolescentes",
    institution_id: "inst1",
    institution_name: "União Sul-Paulista",
    church_id: "c1",
    church_name: "Igreja Central de São Paulo",
    annual_budget: 120000,
    used_budget: 85000,
    remaining_budget: 35000,
    subsidy_requests: 18,
    total_users: 12,
    active_projects: 8,
    contact: {
      name: "Líder João Marcos",
      phone: "(11) 91111-1111",
      email: "joao@jovens.org.br",
      city: "São Paulo"
    },
    created_at: "2024-01-15",
    status: "active"
  },
  {
    id: "d2",
    name: "Educação Cristã",
    description: "Departamento de ensino e educação bíblica",
    institution_id: "inst1",
    institution_name: "União Sul-Paulista",
    church_id: "c1",
    church_name: "Igreja Central de São Paulo",
    annual_budget: 95000,
    used_budget: 68000,
    remaining_budget: 27000,
    subsidy_requests: 14,
    total_users: 8,
    active_projects: 5,
    contact: {
      name: "Professora Maria Silva",
      phone: "(11) 92222-2222",
      email: "maria@educacao.org.br",
      city: "São Paulo"
    },
    created_at: "2024-01-20",
    status: "active"
  },
  {
    id: "d3",
    name: "Diaconia",
    description: "Serviços sociais e assistência comunitária",
    institution_id: "inst1",
    institution_name: "União Sul-Paulista",
    church_id: "c2",
    church_name: "Igreja de Vila Madalena",
    annual_budget: 80000,
    used_budget: 55000,
    remaining_budget: 25000,
    subsidy_requests: 12,
    total_users: 6,
    active_projects: 4,
    contact: {
      name: "Diácono Carlos Santos",
      phone: "(11) 93333-3333",
      email: "carlos@diaconia.org.br",
      city: "São Paulo"
    },
    created_at: "2024-01-25",
    status: "active"
  },
  {
    id: "d4",
    name: "Música e Louvor",
    description: "Ministério musical e de louvor",
    institution_id: "inst1",
    institution_name: "União Sul-Paulista",
    church_id: "c3",
    church_name: "Igreja da Mooca",
    annual_budget: 70000,
    used_budget: 42000,
    remaining_budget: 28000,
    subsidy_requests: 9,
    total_users: 10,
    active_projects: 3,
    contact: {
      name: "Maestro Pedro Lima",
      phone: "(11) 94444-4444",
      email: "pedro@musica.org.br",
      city: "São Paulo"
    },
    created_at: "2024-01-30",
    status: "active"
  },
  {
    id: "d5",
    name: "Evangelismo",
    description: "Departamento de evangelização e missões",
    institution_id: "inst1",
    institution_name: "União Sul-Paulista",
    church_id: "c4",
    church_name: "Igreja de Campinas",
    annual_budget: 110000,
    used_budget: 78000,
    remaining_budget: 32000,
    subsidy_requests: 22,
    total_users: 15,
    active_projects: 7,
    contact: {
      name: "Pastor Roberto Costa",
      phone: "(19) 95555-5555",
      email: "roberto@evangelismo.org.br",
      city: "Campinas"
    },
    created_at: "2024-01-10",
    status: "active"
  }
]

// Mock data para usuários por departamento (quem solicita mais)
const MOCK_USERS_BY_DEPARTMENT = [
  { department: "Ministério Jovem", user: "João Marcos Silva", requests: 8, role: "Líder" },
  { department: "Ministério Jovem", user: "Ana Paula Santos", requests: 6, role: "Coordenadora" },
  { department: "Ministério Jovem", user: "Carlos Eduardo", requests: 4, role: "Voluntário" },
  { department: "Educação Cristã", user: "Maria Silva", requests: 7, role: "Professora" },
  { department: "Educação Cristã", user: "Pedro Oliveira", requests: 4, role: "Coordenador" },
  { department: "Educação Cristã", user: "Lucia Costa", requests: 3, role: "Assistente" },
  { department: "Diaconia", user: "Carlos Santos", requests: 5, role: "Diácono" },
  { department: "Diaconia", user: "Rosa Lima", requests: 4, role: "Coordenadora" },
  { department: "Diaconia", user: "José Silva", requests: 3, role: "Voluntário" },
  { department: "Música e Louvor", user: "Pedro Lima", requests: 4, role: "Maestro" },
  { department: "Música e Louvor", user: "Clara Santos", requests: 3, role: "Pianista" },
  { department: "Música e Louvor", user: "Daniel Costa", requests: 2, role: "Cantor" },
  { department: "Evangelismo", user: "Roberto Costa", requests: 9, role: "Pastor" },
  { department: "Evangelismo", user: "Marcos Silva", requests: 7, role: "Evangelista" },
  { department: "Evangelismo", user: "Patricia Lima", requests: 6, role: "Coordenadora" },
]

// Timeline de orçamento por departamento
const MOCK_BUDGET_TIMELINE = [
  { month: 'Jan', 'Ministério Jovem': 95000, 'Educação Cristã': 80000, 'Diaconia': 65000, 'Música': 55000, 'Evangelismo': 90000 },
  { month: 'Feb', 'Ministério Jovem': 98000, 'Educação Cristã': 82000, 'Diaconia': 67000, 'Música': 57000, 'Evangelismo': 92000 },
  { month: 'Mar', 'Ministério Jovem': 102000, 'Educação Cristã': 85000, 'Diaconia': 70000, 'Música': 60000, 'Evangelismo': 95000 },
  { month: 'Apr', 'Ministério Jovem': 105000, 'Educação Cristã': 87000, 'Diaconia': 72000, 'Música': 62000, 'Evangelismo': 98000 },
  { month: 'May', 'Ministério Jovem': 110000, 'Educação Cristã': 90000, 'Diaconia': 75000, 'Música': 65000, 'Evangelismo': 102000 },
  { month: 'Jun', 'Ministério Jovem': 120000, 'Educação Cristã': 95000, 'Diaconia': 80000, 'Música': 70000, 'Evangelismo': 110000 },
]

// Mock data para churches
const MOCK_CHURCHES: ChurchData[] = [
  { id: "c1", name: "Igreja Central de São Paulo", institution_id: "inst1" },
  { id: "c2", name: "Igreja de Vila Madalena", institution_id: "inst1" },
  { id: "c3", name: "Igreja da Mooca", institution_id: "inst1" },
  { id: "c4", name: "Igreja de Campinas", institution_id: "inst1" },
  { id: "c5", name: "Igreja do Rio de Janeiro", institution_id: "inst1" },
]

/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS
 * Interface dedicada para gerenciar departamentos baseada no ERD do AdventistGroei
 */
export default function DepartmentsPage() {
  const { i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal states
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false)
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false)
  const [isDeleteDepartmentModalOpen, setIsDeleteDepartmentModalOpen] = useState(false)
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
  const [selectedBudget, setSelectedBudget] = useState<AnnualBudgetData | null>(null)
  
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en

  const breadcrumbs = useMemo(() => [
    { name: "Structure & Organization" },
    { name: t.departments }
  ], [t])

  usePageTitle({
    title: t.departmentsTitle,
    breadcrumbs
  })

  // Estatísticas calculadas dos dados
  const kpiData = useMemo(() => {
    const totalDepartments = MOCK_DEPARTMENTS.length
    const totalAnnualBudget = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.annual_budget, 0)
    const totalUsedBudget = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.used_budget, 0)
    const totalRemainingBudget = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.remaining_budget, 0)
    const totalSubsidyRequests = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.subsidy_requests, 0)
    const totalUsers = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.total_users, 0)
    const totalProjects = MOCK_DEPARTMENTS.reduce((sum, d) => sum + d.active_projects, 0)
    const avgEfficiency = Math.round(MOCK_DEPARTMENTS.reduce((sum, d) => sum + ((d.used_budget / d.annual_budget) * 100), 0) / totalDepartments)

    return {
      totalDepartments,
      totalAnnualBudget,
      totalUsedBudget,
      totalRemainingBudget,
      totalSubsidyRequests,
      totalUsers,
      totalProjects,
      avgEfficiency
    }
  }, [])

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_departments",
      title: t.departments,
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: "Total de departamentos",
      trend: {
        value: 12,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "annual_budget",
      title: t.annualBudget,
      value: `$${(kpiData.totalAnnualBudget / 1000).toFixed(0)}K`,
      icon: DollarSign,
      subtitle: "Orçamento total anual",
      trend: {
        value: 8,
        isPositive: true,
        label: "vs. ano anterior"
      }
    },
    {
      id: "used_budget",
      title: t.budgetUsed,
      value: `$${(kpiData.totalUsedBudget / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      subtitle: "Orçamento utilizado",
      trend: {
        value: 15,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "remaining_budget",
      title: t.budgetRemaining,
      value: `$${(kpiData.totalRemainingBudget / 1000).toFixed(0)}K`,
      icon: Shield,
      subtitle: "Orçamento disponível",
      trend: {
        value: 5,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "subsidy_requests",
      title: t.requests,
      value: kpiData.totalSubsidyRequests,
      icon: Calendar,
      subtitle: "Solicitações de subsídio",
      trend: {
        value: 22,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "total_users",
      title: "Usuários",
      value: kpiData.totalUsers,
      icon: Users,
      subtitle: "Total de usuários",
      trend: {
        value: 18,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "active_projects",
      title: "Projetos Ativos",
      value: kpiData.totalProjects,
      icon: Building,
      subtitle: "Projetos em andamento",
      trend: {
        value: 10,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "avg_efficiency",
      title: t.efficiency,
      value: `${kpiData.avgEfficiency}%`,
      icon: TrendingUp,
      subtitle: "Eficiência média",
      trend: {
        value: 3,
        isPositive: true,
        label: "vs. mês anterior"
      }
    }
  ], [kpiData, t])

  // Dados para gráficos
  const chartData = useMemo(() => {
    // Agrupar solicitações por usuário (top 10)
    const userRequests = MOCK_USERS_BY_DEPARTMENT
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 8)
      .map(user => ({
        user: user.user.split(' ').slice(0, 2).join(' '), // Apenas primeiro e segundo nome
        requests: user.requests,
        department: user.department,
        role: user.role
      }))

    return {
      budgetByDepartment: MOCK_DEPARTMENTS.map(d => ({
        department: d.name,
        budget: d.annual_budget,
        used: d.used_budget,
        remaining: d.remaining_budget,
        utilization: Math.round((d.used_budget / d.annual_budget) * 100)
      })),
      subsidyRequestsByDepartment: MOCK_DEPARTMENTS.map(d => ({
        department: d.name,
        requests: d.subsidy_requests
      })),
      userRequests,
      budgetTimeline: MOCK_BUDGET_TIMELINE
    }
  }, [])

  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(t.loading)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success(t.dataRefreshed, { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t.error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [t])

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(t.refreshing)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.dismiss(refreshToast)
      toast.success(t.dataRefreshed, { duration: 2000 })
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(t.errorRefreshing)
    } finally {
      setRefreshing(false)
    }
  }

  const handleCreate = () => {
    setIsAddDepartmentModalOpen(true)
  }
  
  const handleEdit = (id: string) => {
    const department = MOCK_DEPARTMENTS.find(d => d.id === id)
    if (department) {
      // Converter dados do departamento para o formato DepartmentData
      const departmentData: DepartmentData = {
        id: department.id,
        institution_id: department.institution_id,
        church_id: department.church_id,
        name: department.name,
        description: department.description,
        annual_budget: department.annual_budget,
        contact_id: null,
        created_at: department.created_at,
        updated_at: department.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      }
      setSelectedDepartment(departmentData)
      setIsEditDepartmentModalOpen(true)
    }
  }
  
  const handleDelete = (id: string, name: string) => {
    const department = MOCK_DEPARTMENTS.find(d => d.id === id)
    if (department) {
      const departmentData: DepartmentData = {
        id: department.id,
        institution_id: department.institution_id,
        church_id: department.church_id,
        name: department.name,
        description: department.description,
        annual_budget: department.annual_budget,
        contact_id: null,
        created_at: department.created_at,
        updated_at: department.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      }
      setSelectedDepartment(departmentData)
      setIsDeleteDepartmentModalOpen(true)
    }
  }
  
  const handleViewContact = (id: string) => {
    const department = MOCK_DEPARTMENTS.find(d => d.id === id)
    if (department && department.contact) {
      const contactData: ContactData = {
        id: `contact_${department.id}`,
        name: department.contact.name,
        phone: department.contact.phone,
        mobile: null,
        email: department.contact.email,
        country: null,
        city: department.contact.city,
        address: null,
        full_address: null,
        postal_code: null,
        website: null,
        notes: null,
        is_primary: true,
        created_at: department.created_at,
        updated_at: department.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      }
      setSelectedContact(contactData)
      setIsViewContactModalOpen(true)
    }
  }

  const handleViewBudget = (id: string) => {
    const department = MOCK_DEPARTMENTS.find(d => d.id === id)
    if (department) {
      setSelectedDepartment(department as any)
      // Mock budget data
      const budgetData: AnnualBudgetData = {
        id: `budget_${department.id}`,
        year: new Date().getFullYear(),
        planned_budget: department.annual_budget,
        total_expenses: department.used_budget,
        balance: department.remaining_budget,
        notes: `Budget for ${department.name}`,
        approved_by: undefined,
        status: 'approved' as const,
        created_at: department.created_at,
        updated_at: department.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      }
      setSelectedBudget(budgetData)
      setIsBudgetModalOpen(true)
    }
  }
  
  const handleDepartmentSaved = (department: DepartmentData) => {
    toast.success("Department created successfully")
    handleRefresh()
  }
  
  const handleDepartmentUpdated = (department: DepartmentData) => {
    toast.success("Department updated successfully")
    handleRefresh()
  }
  
  const handleDepartmentDeleted = (department: DepartmentData) => {
    toast.success("Department deleted successfully")
    handleRefresh()
  }
  
  const handleBudgetSaved = (budget: AnnualBudgetData) => {
    toast.success("Budget updated successfully")
    handleRefresh()
  }

  // Colunas da tabela
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.church_name}</div>
          </div>
        </div>
      ),
    },
    {
      id: "church",
      accessorKey: "church_name",
      header: t.church,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.church_name}</span>
        </div>
      ),
    },
    {
      id: "annual_budget",
      accessorKey: "annual_budget",
      header: t.annualBudget,
      cell: ({ row }) => (
        <span className="font-medium">${row.original.annual_budget.toLocaleString()}</span>
      ),
    },
    {
      id: "used_budget",
      accessorKey: "used_budget",
      header: t.budgetUsed,
      cell: ({ row }) => (
        <span className="font-medium">${row.original.used_budget.toLocaleString()}</span>
      ),
    },
    {
      id: "remaining_budget",
      accessorKey: "remaining_budget",
      header: t.budgetRemaining,
      cell: ({ row }) => (
        <span className="font-medium text-green-600">${row.original.remaining_budget.toLocaleString()}</span>
      ),
    },
    {
      id: "subsidy_requests",
      accessorKey: "subsidy_requests",
      header: t.requests,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.subsidy_requests}</span>
        </div>
      ),
    },
    {
      id: "efficiency",
      header: t.efficiency,
      cell: ({ row }) => {
        const efficiency = Math.round((row.original.used_budget / row.original.annual_budget) * 100)
        return (
          <Badge variant="outline" className={
            efficiency > 80 ? 'bg-red-100 text-red-700' : 
            efficiency > 60 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-green-100 text-green-700'
          }>
            {efficiency}%
          </Badge>
        )
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status === 'active' ? t.active : t.inactive}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: t.actions,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleViewContact(row.original.id)}>
              <ContactRound className="w-4 h-4 mr-2" />
              {t.viewContact}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewBudget(row.original.id)}>
              <DollarSign className="w-4 h-4 mr-2" />
              View Budget
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.editDepartment}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t.deleteDepartment}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              {t.departmentsTitle}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {t.departmentsSubtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {t.createDepartment}
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* KPI Cards Carrossel */}
        <DepartmentsKPICards 
          data={kpiCardsData}
          isLoading={isLoading}
        />

        <Separator />

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Main Chart - Department Budget Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {t.budgetUtilizationTrends}
              </CardTitle>
              <CardDescription>Orçamento anual vs. Utilizado vs. Disponível por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{
                  budget: { label: "Orçamento Anual", color: "#10b981" },
                  used: { label: "Utilizado", color: "#f59e0b" },
                  remaining: { label: "Disponível", color: "#3b82f6" }
                }} 
                className="h-[300px] sm:h-[360px] w-full"
              >
                <BarChart data={chartData.budgetByDepartment}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="department" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(value) => `$${(value / 1000)}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="budget" fill="#10b981" radius={4} />
                  <Bar dataKey="used" fill="#f59e0b" radius={4} />
                  <Bar dataKey="remaining" fill="#3b82f6" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subsidy Requests by Department */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Solicitações por Departamento
                </CardTitle>
                <CardDescription>Qual departamento tem solicitado mais subsídios</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  config={{
                    requests: { label: "Solicitações", color: "#8b5cf6" }
                  }} 
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={chartData.subsidyRequestsByDepartment}
                      dataKey="requests"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {chartData.subsidyRequestsByDepartment.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Top Users by Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Usuários que Mais Solicitam
                </CardTitle>
                <CardDescription>Top 8 usuários com mais solicitações de subsídio</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  config={{
                    requests: { label: "Solicitações", color: "#f59e0b" }
                  }} 
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <BarChart data={chartData.userRequests} layout="horizontal">
                    <CartesianGrid horizontal={false} />
                    <XAxis type="number" fontSize={11} />
                    <YAxis dataKey="user" type="category" fontSize={10} width={100} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="requests" fill="#f59e0b" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Budget Evolution Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Evolução do Orçamento por Departamento
              </CardTitle>
              <CardDescription>Crescimento mensal do orçamento disponível por departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{
                  'Ministério Jovem': { label: "Ministério Jovem", color: "#3b82f6" },
                  'Educação Cristã': { label: "Educação Cristã", color: "#10b981" },
                  'Diaconia': { label: "Diaconia", color: "#f59e0b" },
                  'Música': { label: "Música", color: "#ef4444" },
                  'Evangelismo': { label: "Evangelismo", color: "#8b5cf6" }
                }} 
                className="h-[300px] sm:h-[400px] w-full"
              >
                <LineChart data={chartData.budgetTimeline}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(value) => `$${(value / 1000)}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line dataKey="Ministério Jovem" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Educação Cristã" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Diaconia" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Música" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Evangelismo" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {t.departments}
            </CardTitle>
            <CardDescription>Lista completa de departamentos com ações de gerenciamento</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <DataTable
              columns={columns}
              data={MOCK_DEPARTMENTS}
              searchKey="name"
              searchPlaceholder={t.searchDepartments}
              filterableColumns={[
                {
                  id: "church",
                  title: t.church,
                  options: [
                    { label: "Igreja Central de São Paulo", value: "Igreja Central de São Paulo" },
                    { label: "Igreja de Vila Madalena", value: "Igreja de Vila Madalena" },
                    { label: "Igreja da Mooca", value: "Igreja da Mooca" },
                    { label: "Igreja de Campinas", value: "Igreja de Campinas" },
                    { label: "Igreja do Rio de Janeiro", value: "Igreja do Rio de Janeiro" },
                  ]
                },
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: t.active, value: "active" },
                    { label: t.inactive, value: "inactive" },
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>
        
        {/* Add Department Modal */}
        <AddDepartmentModal
          isOpen={isAddDepartmentModalOpen}
          onOpenChange={setIsAddDepartmentModalOpen}
          institutionId="inst1"
          churches={MOCK_CHURCHES}
          onSave={handleDepartmentSaved}
        />
        
        {/* Edit Department Modal */}
        {selectedDepartment && (
          <EditDepartmentModal
            isOpen={isEditDepartmentModalOpen}
            onOpenChange={setIsEditDepartmentModalOpen}
            department={selectedDepartment}
            churches={MOCK_CHURCHES}
            onSave={handleDepartmentUpdated}
          />
        )}
        
        {/* Delete Department Modal */}
        {selectedDepartment && (
          <DeleteDepartmentModal
            isOpen={isDeleteDepartmentModalOpen}
            onOpenChange={setIsDeleteDepartmentModalOpen}
            department={selectedDepartment}
            onSuccess={handleDepartmentDeleted}
          />
        )}
        
        {/* View Contact Modal */}
        {selectedContact && (
          <ViewContactModal
            isOpen={isViewContactModalOpen}
            onOpenChange={setIsViewContactModalOpen}
            contact={selectedContact}
          />
        )}
        
        {/* Annual Budget Modal */}
        {selectedDepartment && (
          <AnnualBudgetModal
            isOpen={isBudgetModalOpen}
            onOpenChange={setIsBudgetModalOpen}
            budget={selectedBudget}
            entityType="department"
            entityName={selectedDepartment.name}
            entityId={selectedDepartment.id}
            onSave={handleBudgetSaved}
          />
        )}
      </div>
    </AppLayout>
  )
}
