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
  Home, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Trash2,
  Users,
  MapPin,
  DollarSign,
  Building,
  ContactRound,
  TrendingUp,
  Calendar,
  Layers,
  Shield
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
import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
import { AnnualBudgetModal, AnnualBudgetData } from "@/components/modals/budget"
import { AddChurchModal, EditChurchModal, DeleteChurchModal, ChurchData, RegionData } from "@/components/modals/church"
import { ChurchesKPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"

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

import { useInstitution } from '@/contexts/institution-context'
import { CreateChurch } from "@/types/CreateChurch"

// Dados reais de igrejas virão do contexto da instituição

// Mock data para departamentos por igreja
const MOCK_DEPARTMENTS_BY_CHURCH = [
  { church: "Igreja Central de São Paulo", department: "Ministério Jovem", subsidy_requests: 5 },
  { church: "Igreja Central de São Paulo", department: "Educação Cristã", subsidy_requests: 4 },
  { church: "Igreja Central de São Paulo", department: "Diaconia", subsidy_requests: 3 },
  { church: "Igreja de Vila Madalena", department: "Ministério Jovem", subsidy_requests: 4 },
  { church: "Igreja de Vila Madalena", department: "Música", subsidy_requests: 2 },
  { church: "Igreja de Vila Madalena", department: "Evangelismo", subsidy_requests: 2 },
  { church: "Igreja da Mooca", department: "Ministério Jovem", subsidy_requests: 3 },
  { church: "Igreja da Mooca", department: "Diaconia", subsidy_requests: 2 },
  { church: "Igreja da Mooca", department: "Educação Cristã", subsidy_requests: 1 },
  { church: "Igreja de Campinas", department: "Ministério Jovem", subsidy_requests: 6 },
  { church: "Igreja de Campinas", department: "Evangelismo", subsidy_requests: 5 },
  { church: "Igreja de Campinas", department: "Música", subsidy_requests: 4 },
  { church: "Igreja do Rio de Janeiro", department: "Ministério Jovem", subsidy_requests: 5 },
  { church: "Igreja do Rio de Janeiro", department: "Diaconia", subsidy_requests: 3 },
  { church: "Igreja do Rio de Janeiro", department: "Educação Cristã", subsidy_requests: 3 },
]

// Mock data para usuários por igreja
const MOCK_USERS_BY_CHURCH = [
  { church: "Igreja Central de São Paulo", users: 45, active_users: 38 },
  { church: "Igreja de Vila Madalena", users: 32, active_users: 28 },
  { church: "Igreja da Mooca", users: 24, active_users: 20 },
  { church: "Igreja de Campinas", users: 38, active_users: 35 },
  { church: "Igreja do Rio de Janeiro", users: 30, active_users: 26 },
]

// Mock data para regiões
const MOCK_REGIONS: RegionData[] = [
  { id: "r1", name: "São Paulo Capital", institution_id: "inst1" },
  { id: "r2", name: "São Paulo Interior", institution_id: "inst1" },
  { id: "r3", name: "Rio de Janeiro", institution_id: "inst1" },
  { id: "r4", name: "Distrito Federal", institution_id: "inst1" },
  { id: "r5", name: "Bahia - Salvador", institution_id: "inst1" },
]

// Timeline de solicitações de subsídio por igreja
const MOCK_SUBSIDY_TIMELINE = [
  { month: 'Jan', 'Central SP': 8, 'Vila Madalena': 5, 'Mooca': 4, 'Campinas': 10, 'Rio de Janeiro': 7 },
  { month: 'Feb', 'Central SP': 10, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 12, 'Rio de Janeiro': 8 },
  { month: 'Mar', 'Central SP': 9, 'Vila Madalena': 7, 'Mooca': 4, 'Campinas': 13, 'Rio de Janeiro': 9 },
  { month: 'Apr', 'Central SP': 11, 'Vila Madalena': 6, 'Mooca': 5, 'Campinas': 14, 'Rio de Janeiro': 10 },
  { month: 'May', 'Central SP': 12, 'Vila Madalena': 8, 'Mooca': 6, 'Campinas': 15, 'Rio de Janeiro': 11 },
  { month: 'Jun', 'Central SP': 12, 'Vila Madalena': 8, 'Mooca': 6, 'Campinas': 15, 'Rio de Janeiro': 11 },
]

/**
 * PÁGINA DE GESTÃO DE IGREJAS
 * Interface dedicada para gerenciar igrejas baseada no ERD do AdventistGroei
 */
export default function ChurchesPage() {
  const { i18n } = useTranslation()
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const churches = React.useMemo(() => currentInstitutionData?.churches || [], [currentInstitutionData]);
  
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  console.log('churches', currentInstitutionData)
  // Modal states
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [isAddChurchModalOpen, setIsAddChurchModalOpen] = useState(false)
  const [isEditChurchModalOpen, setIsEditChurchModalOpen] = useState(false)
  const [isDeleteChurchModalOpen, setIsDeleteChurchModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
  const [selectedChurch, setSelectedChurch] = useState<any>(null)
  const [selectedBudget, setSelectedBudget] = useState<AnnualBudgetData | null>(null)
  const [churchToEdit, setChurchToEdit] = useState<ChurchData | null>(null)
  const [churchToDelete, setChurchToDelete] = useState<ChurchData | null>(null)
  
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en

  const breadcrumbs = useMemo(() => [
    { name: "Structure & Organization" },
    { name: t.churches }
  ], [t])

  usePageTitle({
    title: t.churchesTitle,
    breadcrumbs
  })

  // Estatísticas calculadas dos dados
  type ChurchType = typeof churches extends (infer U)[] ? U : any;
  const kpiData = useMemo(() => {
    const totalChurches = churches.length;
    const totalMembers = churches.reduce((sum: number, c: ChurchType) => sum + (c.members_count || 0), 0);
    const totalDepartments = churches.reduce((sum: number, c: ChurchType) => sum + (c.departments_count || 0), 0);
    const totalSubsidyRequests = churches.reduce((sum: number, c: ChurchType) => sum + (c.subsidy_requests || 0), 0);
    const totalBudget = churches.reduce((sum: number, c: ChurchType) => sum + (c.total_budget || 0), 0);
    const totalUsedBudget = churches.reduce((sum: number, c: ChurchType) => sum + (c.used_budget || 0), 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((totalUsedBudget / totalBudget) * 100) : 0;
    const avgMembersPerChurch = totalChurches > 0 ? Math.round(totalMembers / totalChurches) : 0;
    return {
      totalChurches,
      totalMembers,
      totalDepartments,
      totalSubsidyRequests,
      totalBudget,
      totalUsedBudget,
      budgetUtilization,
      avgMembersPerChurch
    };
  }, [churches]);

  // Dados dos KPIs em formato de array para o componente reutilizável
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total-churches",
      title: t.totalChurches,
      value: kpiData.totalChurches,
      icon: Home,
      subtitle: "Active churches"
    },
    {
      id: "total-members", 
      title: t.totalMembers,
      value: `${(kpiData.totalMembers / 1000).toFixed(1)}K`,
      icon: Users,
      subtitle: "Total members"
    },
    {
      id: "total-departments",
      title: t.departments,
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: "Active departments"
    },
    {
      id: "budget-utilization",
      title: t.budgetUtilization,
      value: `${kpiData.budgetUtilization}%`,
      icon: TrendingUp,
      subtitle: "Budget efficiency",
      trend: {
        value: 3.8,
        isPositive: true,
        label: "vs last month"
      }
    }
  ], [kpiData, t])

  // Dados para gráficos
  const chartData = useMemo(() => ({
    budgetByChurch: churches.map((c: ChurchType) => ({
      church: c.name,
      budget: c.total_budget,
      used: c.used_budget,
      remaining: (c.total_budget || 0) - (c.used_budget || 0)
    })),
    subsidyRequestsByChurch: churches.map((c: ChurchType) => ({
      church: c.name,
      requests: c.subsidy_requests
    })),
    subsidyByDepartment: [], // Não migrado ainda
    usersByChurch: [], // Não migrado ainda
    subsidyTimeline: [] // Não migrado ainda
  }), [churches]);

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
      await refetchInstitutionById()
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
    setIsAddChurchModalOpen(true)
  }
  
  const handleEdit = (id: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      const churchData: ChurchData = {
        id: church.id,
        institution_id: church.institution_id,
        name: church.name,
        region_id: church.region_id,
        contact_id: null,
        created_at: church.created_at,
        updated_at: church.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setChurchToEdit(churchData);
      setIsEditChurchModalOpen(true);
    }
  };
  const handleDelete = (id: string, name: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      const churchData: ChurchData = {
        id: church.id,
        institution_id: church.institution_id,
        name: church.name,
        region_id: church.region_id,
        contact_id: null,
        created_at: church.created_at,
        updated_at: church.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setChurchToDelete(churchData);
      setIsDeleteChurchModalOpen(true);
    }
  };
  const handleViewContact = (id: string) => {
    // Não implementado pois não há contact no church do backend
  };
  const handleViewBudget = (id: string) => {
    const church = churches.find((c: ChurchType) => c.id === id);
    if (church) {
      const budgetData: AnnualBudgetData = {
        id: `budget_${church.id}`,
        year: new Date().getFullYear(),
        planned_budget: church.total_budget,
        total_expenses: church.used_budget,
        balance: (church.total_budget || 0) - (church.used_budget || 0),
        notes: `Budget for ${church.name} church`,
        approved_by: 'admin',
        status: 'in_progress',
        created_at: church.created_at,
        updated_at: new Date().toISOString(),
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setSelectedChurch(church);
      setSelectedBudget(budgetData);
      setIsBudgetModalOpen(true);
    }
  };
  
  const handleBudgetSaved = (budget: AnnualBudgetData) => {
    toast.success("Budget updated successfully")
    handleRefresh()
  }
  
  const handleChurchSaved = (church: CreateChurch) => {
    handleRefresh()
  }
  
  const handleChurchUpdated = (church: ChurchData) => {
    toast.success("Church updated successfully")
    handleRefresh()
  }
  
  const handleChurchDeleted = (church: ChurchData) => {
    toast.success("Church deleted successfully")
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
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Home className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
          </div>
        </div>
      ),
    },
    {
      id: "region",
      accessorKey: "region_name",
      header: t.region,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.region.name}</span>
        </div>
      ),
    },
    {
      id: "members",
      accessorKey: "members_count",
      header: t.members,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users.length || 0}</span>
        </div>
      ),
    },
    {
      id: "departments",
      accessorKey: "departments_count",
      header: t.departments,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.departments.length}</span>
        </div>
      ),
    },
    {
      id: "subsidy_requests",
      accessorKey: "subsidy_requests",
      header: t.requests,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.subsidy_requests || 0}</span>
        </div>
      ),
    },
    {
      id: "budget",
      accessorKey: "total_budget",
      header: t.budget,
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const total_expenses = annual_budget ? annual_budget.total_expenses : 0
        return (
        <span className="font-medium">$ {total_expenses}</span>
      )},
    },
    {
      id: "utilization",
      header: t.utilization,
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const totalBudget = annual_budget?.planned_budget || 1;
        const usedBudget = annual_budget?.total_expenses || 0;
        const utilization = Math.round((usedBudget / totalBudget) * 100)
        return (
          <Badge variant="outline" className={
            utilization > 80 ? 'bg-red-100 text-red-700' : 
            utilization > 60 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-green-100 text-green-700'
          }>
            {utilization}%
          </Badge>
        )
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.is_deleted === false ? 'default' : 'secondary'}>
          {row.original.is_deleted === true ? t.inactive : t.active}
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
            <DropdownMenuItem onClick={() => handleViewBudget(row.original.id)}>
              <DollarSign className="w-4 h-4 mr-2" />
              View Budget
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewContact(row.original.id)}>
              <ContactRound className="w-4 h-4 mr-2" />
              {t.viewContact}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.editChurch}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t.deleteChurch}
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
              {t.churchesTitle}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {t.churchesSubtitle}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {t.createChurch}
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

        {/* KPI Cards */}
        <ChurchesKPICards data={kpiCardsData} />

        <Separator />

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Main Chart - Church Budget Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Distribuição de Orçamento por Igreja
              </CardTitle>
              <CardDescription>Orçamento vs. Valores utilizados por igreja</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{
                  budget: { label: "Orçamento", color: "#10b981" },
                  used: { label: "Utilizado", color: "#f59e0b" },
                  remaining: { label: "Restante", color: "#3b82f6" }
                }} 
                className="h-[300px] sm:h-[360px] w-full"
              >
                <BarChart data={chartData.budgetByChurch}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="church" fontSize={11} />
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
                  <Layers className="w-5 h-5" />
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
                      data={chartData.subsidyByDepartment}
                      dataKey="requests"
                      nameKey="department"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {chartData.subsidyByDepartment.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"][index % 6]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Users by Church */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Usuários por Igreja
                </CardTitle>
                <CardDescription>Total de usuários cadastrados por igreja</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer 
                  config={{
                    users: { label: "Total", color: "#3b82f6" },
                    active_users: { label: "Ativos", color: "#10b981" }
                  }} 
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <BarChart data={chartData.usersByChurch}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="church" fontSize={11} />
                    <YAxis fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="users" fill="#3b82f6" radius={4} />
                    <Bar dataKey="active_users" fill="#10b981" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Subsidy Requests Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Timeline de Solicitações de Subsídio
              </CardTitle>
              <CardDescription>Evolução mensal das solicitações por igreja</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{
                  'Central SP': { label: "Central SP", color: "#3b82f6" },
                  'Vila Madalena': { label: "Vila Madalena", color: "#10b981" },
                  'Mooca': { label: "Mooca", color: "#f59e0b" },
                  'Campinas': { label: "Campinas", color: "#ef4444" },
                  'Rio de Janeiro': { label: "Rio de Janeiro", color: "#8b5cf6" }
                }} 
                className="h-[300px] sm:h-[400px] w-full"
              >
                <LineChart data={chartData.subsidyTimeline}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line dataKey="Central SP" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Vila Madalena" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Mooca" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Campinas" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Rio de Janeiro" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Churches Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              {t.churches}
            </CardTitle>
            <CardDescription>Lista completa de igrejas com ações de gerenciamento</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <DataTable
              columns={columns}
              data={churches}
              searchKey="name"
              searchPlaceholder={t.searchChurches}
              filterableColumns={[
                {
                  id: "region",
                  title: t.region,
                  options: Array.from(new Set(churches.map((c: any) => c.region_name))).map(name => ({ label: String(name), value: String(name) }))
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

        {/* View Contact Modal */}
        {/* <ContactViewEditModal
          isOpen={isViewContactModalOpen}
          onOpenChange={setIsViewContactModalOpen}
          contact={selectedContact}
          entityName={selectedChurch?.name}
          entityType="Church"
          entityId={selectedChurch?.id}
          updateMutation={null}
        /> */}
        
        {/* Annual Budget Modal */}
        {selectedChurch && (
          <AnnualBudgetModal
            isOpen={isBudgetModalOpen}
            onOpenChange={setIsBudgetModalOpen}
            budget={selectedBudget}
            entityType="church"
            entityName={selectedChurch.name}
            entityId={selectedChurch.id}
            onSave={handleBudgetSaved}
          />
        )}
        
        {/* Add Church Modal */}
        <AddChurchModal
          isOpen={isAddChurchModalOpen}
          onOpenChange={setIsAddChurchModalOpen}
          institutionId={currentInstitutionData?.id || ''}
          regions={currentInstitutionData?.regions || []}
          onSave={handleChurchSaved}
        />
        
        {/* Edit Church Modal */}
        {churchToEdit && (
          <EditChurchModal
            isOpen={isEditChurchModalOpen}
            onOpenChange={setIsEditChurchModalOpen}
            church={churchToEdit}
            regions={[]}
            onSave={handleChurchUpdated}
          />
        )}
        
        {/* Delete Church Modal */}
        {churchToDelete && (
          <DeleteChurchModal
            isOpen={isDeleteChurchModalOpen}
            onOpenChange={setIsDeleteChurchModalOpen}
            church={churchToDelete}
            onSuccess={handleChurchDeleted}
          />
        )}
      </div>
    </AppLayout>
  )
}
