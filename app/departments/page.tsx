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
import { AddDepartmentModal, EditDepartmentModal, DeleteDepartmentModal } from "@/components/modals/department"
import { useInstitution } from "@/contexts/institution-context"
import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
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
import { CreateDepartment } from "@/types/CreateDepartment"
import NotFound from "@/components/shared/not-found"
import {
   InstitutionById_institution_departments as DepartmentData,
   InstitutionById_institution_churches as ChurchData
} from "@/types/InstitutionById"


/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS
 * Interface dedicada para gerenciar departamentos baseada no ERD do AdventistGroei
 */
export default function DepartmentsPage() {
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const departments: DepartmentData[] = currentInstitutionData?.departments || [];
  const churches: ChurchData[] = currentInstitutionData?.churches || [];
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
  type DepartmentType = typeof departments extends (infer U)[] ? U : any;
  const kpiData = useMemo(() => {
    const totalDepartments = departments.length;
    const totalAnnualBudget = departments.reduce((sum: number, d: DepartmentType) => sum + (d.annual_budget || 0), 0);
    return {
      totalDepartments,
      totalAnnualBudget
    };
  }, [departments]);

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_departments",
      title: t.departments,
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: "Total de departamentos",
      trend: {
        value: 0,
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
        value: 0,
        isPositive: true,
        label: "vs. ano anterior"
      }
    }
  ], [kpiData, t]);

  // Dados para gráficos (apenas nome e orçamento)
  const chartData = useMemo(() => {
    return {
      budgetByDepartment: departments.map(d => ({
        department: d.name,
        budget: d.annual_budget
      })),
      userRequests: [],
      budgetTimeline: [],
      subsidyRequestsByDepartment: [] // TODO: implementar quando backend fornecer
    };
  }, [departments]);

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
      toast.success(t.dataRefreshed, { duration: 2000 })
    } catch (error) {
      toast.error(t.errorRefreshing)
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleCreate = () => {
    setIsAddDepartmentModalOpen(true)
  }
  
  const handleEdit = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setSelectedDepartment(department);
      setIsEditDepartmentModalOpen(true);
    }
  };
  
  const handleDelete = (id: string, name: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setSelectedDepartment(department);
      setIsDeleteDepartmentModalOpen(true);
    }
  };
  
  const handleViewContact = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department && (department as any).contact) {
      const contact = (department as any).contact;
      const contactData: ContactData = {
        id: `contact_${department.id}`,
        name: contact.name,
        phone: contact.phone,
        mobile: null,
        email: contact.email,
        country: null,
        city: contact.city,
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
      };
      setSelectedContact(contactData);
      setIsViewContactModalOpen(true);
    }
  };

  const handleViewBudget = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setSelectedDepartment(department as any);
      // Mock budget data
      const budgetData: AnnualBudgetData = {
        id: `budget_${department.id}`,
        year: new Date().getFullYear(),
        planned_budget: department.annual_budget,
        total_expenses: department.used_budget || 0, // TODO: implementar used_budget
        balance: (department.annual_budget || 0) - (department.used_budget || 0),
        notes: `Budget for ${department.name}`,
        approved_by: undefined,
        status: 'approved' as const,
        created_at: department.created_at,
        updated_at: department.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setSelectedBudget(budgetData);
      setIsBudgetModalOpen(true);
    }
  };
  
  const handleDepartmentSaved = (department: CreateDepartment) => {
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

  if (!currentInstitutionData) return <NotFound />
  
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
            <div className="text-xs text-muted-foreground">{row.original.church_name || '-'} {/* TODO: church_name não existe, implementar quando backend fornecer */}</div>
          </div>
        </div>
      ),
    },
    {
      id: "annual_budget",
      accessorKey: "annual_budget",
      header: t.annualBudget,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.annual_budget?.toLocaleString() ?? 'N/A'}</span>
      ),
    },
    {
      id: "used_budget",
      header: t.budgetUsed,
      cell: () => (
        <span className="font-medium">0 {/* TODO: used_budget não existe, implementar quando backend fornecer */}</span>
      ),
    },
    {
      id: "remaining_budget",
      header: t.budgetRemaining,
      cell: () => (
        <span className="font-medium text-green-600">0 {/* TODO: remaining_budget não existe, implementar quando backend fornecer */}</span>
      ),
    },
    {
      id: "subsidy_requests",
      header: t.requests,
      cell: () => (
        <span className="font-medium">0 {/* TODO: subsidy_requests não existe, implementar quando backend fornecer */}</span>
      ),
    },
    {
      id: "efficiency",
      header: t.efficiency,
      cell: () => (
        <Badge variant="outline" className="bg-gray-100 text-gray-700">N/A {/* TODO: efficiency não existe, implementar quando backend fornecer */}</Badge>
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
              data={departments}
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
          institutionId={currentInstitutionData.id}
          churches={churches}
          onSave={handleDepartmentSaved}
        />
        
        {/* Edit Department Modal */}
        {selectedDepartment && (
          <EditDepartmentModal
            isOpen={isEditDepartmentModalOpen}
            onOpenChange={setIsEditDepartmentModalOpen}
            department={selectedDepartment}
            churches={churches}
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
          <ContactViewEditModal
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
