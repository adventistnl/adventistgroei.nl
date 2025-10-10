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
import { AnnualBudgetViewEditModal, AnnualBudgetData } from "@/components/modals/annual-budget"
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
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { WithPermission } from "@/hocs/with-permission"


/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS DE IGREJA
 * Interface dedicada para gerenciar departamentos a nível de igreja baseada no ERD do AdventistGroei
 */
export default function ChurchDepartmentsPage() {
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

  usePageTitle({
    title: "Church Departments"
  })

  // Estatísticas calculadas dos dados
  type DepartmentType = typeof departments extends (infer U)[] ? U : any;
  // Ajustar cálculo para acessar corretamente planned_budget e total_expenses
  const kpiData = useMemo(() => {
    const totalDepartments = departments.length;
    const totalAnnualBudget = departments.reduce((sum: number, d: DepartmentType) => {
      const plannedBudget = d.annual_budget?.planned_budget || 0;
      return sum + plannedBudget;
    }, 0);
    return {
      totalDepartments,
      totalAnnualBudget
    };
  }, [departments]);

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_departments",
      title: "Church Departments",
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: "Total de departamentos de igreja",
      trend: {
        value: 0,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "annual_budget",
      title: "Annual Budget",
      value: `$${(kpiData.totalAnnualBudget / 1000).toFixed(0)}K`,
      icon: DollarSign,
      subtitle: "Orçamento total anual",
      trend: {
        value: 0,
        isPositive: true,
        label: "vs. ano anterior"
      }
    }
  ], [kpiData]);

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
      const loadingToast = toast.loading("Loading...")
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success("Data loaded successfully", { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error("Error loading data")
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("Refreshing...")
    
    try {
      await refetchInstitutionById()
      toast.success("Data refreshed successfully", { duration: 2000 })
    } catch (error) {
      toast.error("Error refreshing data")
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
        planned_budget: department.annual_budget?.planned_budget || 0,
        total_expenses: department.annual_budget?.total_expenses || 0,
        balance: (department.annual_budget?.planned_budget || 0) - (department.annual_budget?.total_expenses || 0),
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
    toast.success("Church department created successfully")
    handleRefresh()
  }
  
  const handleDepartmentUpdated = (department: DepartmentData) => {
    toast.success("Church department updated successfully")
    handleRefresh()
  }
  
  const handleDepartmentDeleted = (department: DepartmentData) => {
    toast.success("Church department deleted successfully")
    handleRefresh()
  }
  
  const handleBudgetSaved = (budget: AnnualBudgetData) => {
    // Update the selected department's annual_budget if it was changed
    if (selectedDepartment && budget.planned_budget !== selectedDepartment.annual_budget?.planned_budget) {
      const updatedDepartment = {
        ...selectedDepartment,
        annual_budget: {
          ...selectedDepartment.annual_budget,
          planned_budget: budget.planned_budget
        }
      };
      setSelectedDepartment(updatedDepartment);
    }
    
    toast.success("Budget updated successfully", {
      duration: 3000,
      icon: '💰'
    });
    handleRefresh();
  }

  if (!currentInstitutionData) return <NotFound />
  
  // Colunas da tabela
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.description || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      id: "church", 
      accessorKey: "church",
      header: "Church",
      cell: ({ row }) => {
        const church = churches.find(c => c.id === row.original.church);
        const isInstitutional = !church;
        return (
          <div className="flex items-center gap-2">
            {isInstitutional ? (
              <Building className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Home className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="font-medium">
              {isInstitutional ? 'Institutional' : church.name}
            </span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === "institutional") {
          const church = churches.find(c => c.id === row.getValue(id));
          return !church;
        }
        return value.includes(row.getValue(id))
      },
    },
    {
      id: "members",
      accessorKey: "members_count",
      header: "Members",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users.length || 0}</span>
        </div>
      ),
    },
    {
      id: "budget",
      accessorKey: "total_budget",
      header: "Budget",
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const total_expenses = annual_budget ? annual_budget.total_expenses : 0
        return (
        <span className="font-medium">$ {total_expenses}</span>
      )},
    },
    {
      id: "utilization",
      header: "Utilization",
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const totalBudget = annual_budget?.planned_budget || 1;
        const usedBudget = annual_budget?.total_expenses || 0;
        const utilization = Math.round((Number(usedBudget) / Number(totalBudget)) * 100)
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
      id: "remaining_budget",
      header: "Budget Remaining",
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget;
        const totalBudget = annual_budget?.planned_budget || 0;
        const usedBudget = annual_budget?.total_expenses || 0;
        const remainingBudget = totalBudget - usedBudget;
        return (
          <span className="font-medium text-green-700">
            $ {remainingBudget.toFixed(2).toLocaleString()}
          </span>
        );
      },
    },
    {
      id: "subsidy_requests",
      header: "Requests",
      cell: () => (
        <span className="font-medium">0 {/* TODO: subsidy_requests não existe, implementar quando backend fornecer */}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
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
              Edit Department
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewBudget(row.original.id)}>
              <DollarSign className="w-4 h-4 mr-2" />
              Manage Budget
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Department
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
      <WithPermission requiredPermissions={[PermissionResolverName.Departments]} fallback={<AccessDenied/>}>
      
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              Church Departments
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              Manage church-level departments and ministries
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Create Church Department
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
                Budget Utilization Trends
              </CardTitle>
              <CardDescription>Orçamento anual vs. Utilizado vs. Disponível por departamento de igreja</CardDescription>
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
                <CardDescription>Qual departamento de igreja tem solicitado mais subsídios</CardDescription>
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
              <CardDescription>Crescimento mensal do orçamento disponível por departamento de igreja</CardDescription>
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
              Church Departments
            </CardTitle>
            <CardDescription>Lista completa de departamentos de igreja com ações de gerenciamento</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <DataTable
              columns={columns}
              data={departments}
              searchKey="name"
              searchPlaceholder="Search church departments..."
              filterableColumns={[
                {
                  id: "church",
                  title: "Church",
                  options: [
                    { label: "Institutional", value: "institutional" },
                    ...churches.map(church => ({
                      label: church.name,
                      value: church.id
                    }))
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
          <AnnualBudgetViewEditModal
            isOpen={isBudgetModalOpen}
            onOpenChange={setIsBudgetModalOpen}
            budget={selectedBudget}
            entityType="department"
            entityName={selectedDepartment.name}
            onSave={handleBudgetSaved}
          />
        )}
      </div>
      </WithPermission>
    </AppLayout>
  )
}