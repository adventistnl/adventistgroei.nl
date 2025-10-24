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
  Building2,
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
import { DepartmentActivityChart } from "@/components/institutions/charts/department-activity-chart"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"

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
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS
 * Interface dedicada para gerenciar departamentos baseada no ERD do AdventistGroei
 */
export default function DepartmentsPage() {
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const departments: DepartmentData[] = currentInstitutionData?.departments || [];
  const churches: ChurchData[] = currentInstitutionData?.churches || [];
  const { t } = useTranslation()
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

  usePageTitle({
    title: t('departments.title')
  })

  // Estatísticas calculadas dos dados
  type DepartmentType = typeof departments extends (infer U)[] ? U : any;
  // Ajustar cálculo para acessar corretamente planned_budget e total_expenses
  const kpiData = useMemo(() => {
    const totalDepartments = departments.length;
    const totalAnnualBudget = departments.reduce((sum: number, d: DepartmentType) => {
      const latestBudget = d.annual_budgets?.[0];
      const plannedBudget = latestBudget?.planned_budget || 0;
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
      title: t('departments.title'),
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: t('departments.subtitle'),
      trend: {
        value: 0,
        isPositive: true,
        label: "vs. mês anterior"
      }
    },
    {
      id: "annual_budget",
      title: t('common.annual_budget') || "Annual Budget",
      value: `$${(kpiData.totalAnnualBudget / 1000).toFixed(0)}K`,
      icon: DollarSign,
      subtitle: t('departments.fields.annual_budget') || "Total annual budget",
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
      budgetByDepartment: departments.map(d => {
        const latestBudget = d.annual_budgets?.[0];
        return {
          department: d.name,
          budget: latestBudget?.planned_budget || 0
        };
      }),
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
      const loadingToast = toast.loading(t('common.loading') || "Loading...")
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success(t('common.data_loaded') || "Data loaded successfully", { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t('common.error') || "An error occurred")
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
    const refreshToast = toast.loading(t('common.refreshing') || "Refreshing...")
    
    try {
      await refetchInstitutionById()
      toast.success(t('common.data_refreshed') || "Data refreshed", { duration: 2000 })
    } catch (error) {
      toast.error(t('common.error_refreshing') || "Error refreshing")
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleCreate = () => {
    setIsAddDepartmentModalOpen(true)
  }
  
  const handleCreateInstitutional = () => {
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
      setSelectedDepartment(department);
      // Mock budget data
      const latestBudget = department.annual_budgets?.[0];
      const budgetData: AnnualBudgetData = {
        id: `budget_${department.id}`,
        year: new Date().getFullYear(),
        planned_budget: latestBudget?.planned_budget || 0,
        total_expenses: latestBudget?.total_expenses || 0,
        balance: (latestBudget?.planned_budget || 0) - (latestBudget?.total_expenses || 0),
        notes: `Budget for ${department.name}`,
        approved_by: undefined,
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
    // Update the selected department's annual_budgets if it was changed
    const latestBudget = selectedDepartment?.annual_budgets?.[0];
    if (selectedDepartment && budget.planned_budget !== latestBudget?.planned_budget) {
      const updatedBudget = {
        __typename: "AnnualBudget" as const,
        year: budget.year,
        planned_budget: budget.planned_budget,
        total_expenses: budget.total_expenses
      };
      const updatedDepartment = {
        ...selectedDepartment,
        annual_budgets: [updatedBudget, ...(selectedDepartment.annual_budgets?.slice(1) || [])]
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
      header: t.name,
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
      id: "church_id",
      accessorKey: "church_id",
      header: t('churches.church') || "Church",
      cell: ({ row }) => {
        const church = churches.find((c: any) => c.id === row.original.church_id)
        return church ? (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            {church.name}
          </div>
        ) : 'N/A'
      },
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true
        return row.getValue(id) === value
      },
    },
    {
      id: "members",
      accessorKey: "members_count",
      header: t('common.members') || "Members",
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
      header: t('common.budget') || "Budget",
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const total_expenses = annual_budget ? annual_budget.total_expenses : 0
        return (
        <span className="font-medium">$ {total_expenses}</span>
      )},
    },
    {
      id: "utilization",
      header: t('departments.utilization') || "Utilization",
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
      header: t('departments.budget_remaining') || "Budget Remaining",
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
      id: "status",
      accessorKey: "is_deleted",
      header: t('common.status') || "Status",
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500 hover:bg-green-600" : ""}>
            {isActive ? (t('common.active') || "Active") : (t('common.inactive') || "Inactive")}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
      },
    },
    {
      id: "subsidy_requests",
      header: t('departments.requests') || "Requests",
      cell: () => (
        <span className="font-medium">0 {/* TODO: subsidy_requests não existe, implementar quando backend fornecer */}</span>
      ),
    },
    // {
    //   id: "efficiency",
    //   header: t.efficiency,
    //   cell: () => (
    //     <Badge variant="outline" className="bg-gray-100 text-gray-700">N/A {/* TODO: efficiency não existe, implementar quando backend fornecer */}</Badge>
    //   ),
    // },
    {
      id: "actions",
      header: t('common.actions') || "Actions",
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
              {t('departments.edit_department') || "Edit Department"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewBudget(row.original.id)}>
              <DollarSign className="w-4 h-4 mr-2" />
              Manage Budget
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('departments.delete_department') || "Delete Department"}
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
              {t('departments.title') || "Institutional Departments"}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {t('departments.subtitle') || "Manage departments across institutions"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {t('departments.create_department') || "Create Department"}
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
          <h3 className="text-xl font-semibold">{t('departments.analytics') || "Analytics"}</h3>
          <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
            <DepartmentActivityChart loading={isLoading} />
          </ResponsiveGridCarousel>
        </div>

        <Separator />

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              {t('departments.table_title') || "Departments"}
            </CardTitle>
            <CardDescription>{t('departments.table_description') || "Complete list of departments with management actions"}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden p-0">
            <UseTable
              columns={columns}
              data={departments}
              searchKey="name"
              filters={[
                {
                  id: "church",
                  title: t('churches.church') || "Church",
                  options: [
                    { label: "Institutional", value: "institutional" },
                    ...churches.map(church => ({
                      label: church.name,
                      value: church.id
                    }))
                  ]
                },
                {
                  id: "status",
                  title: t('common.status') || "Status",
                  options: [
                    { label: t('common.active') || "Active", value: "true" },
                    { label: t('common.inactive') || "Inactive", value: "false" }
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>
        
        {/* Add Department Modal - Institutional Department */}
        <AddDepartmentModal
          isOpen={isAddDepartmentModalOpen}
          onOpenChange={setIsAddDepartmentModalOpen}
          institutionId={currentInstitutionData.id}
          churches={churches as any}
          onSave={handleDepartmentSaved}
          departmentType="institutional"
        />
        
        {/* Edit Department Modal */}
        {selectedDepartment && (
          <EditDepartmentModal
            isOpen={isEditDepartmentModalOpen}
            onOpenChange={setIsEditDepartmentModalOpen}
            department={selectedDepartment as any}
            churches={churches as any}
            onSave={handleDepartmentUpdated as any}
          />
        )}
        
        {/* Delete Department Modal */}
        {selectedDepartment && (
          <DeleteDepartmentModal
            isOpen={isDeleteDepartmentModalOpen}
            onOpenChange={setIsDeleteDepartmentModalOpen}
            department={selectedDepartment as any}
            onSuccess={handleDepartmentDeleted as any}
          />
        )}
        
        {/* View Contact Modal */}
        {/* TODO: Fix ContactViewEditModal - requires updateMutation and entityId props */}
        {/* {selectedContact && (
          <ContactViewEditModal
            isOpen={isViewContactModalOpen}
            onOpenChange={setIsViewContactModalOpen}
            contact={selectedContact as any}
          />
        )} */}
        
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
