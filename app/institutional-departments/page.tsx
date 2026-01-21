"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { GET_INSTITUTIONAL_DEPARTMENTS_KPIS } from "@/graphql/queries/ANNUAL_BUDGET_QUERIES"
import {
  GetInstitutionalDepartmentsKPIs,
  GetInstitutionalDepartmentsKPIsVariables
} from "@/types/GetInstitutionalDepartmentsKPIs"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { UsageIndicator } from "@/components/ui/usage-indicator"
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
  BarChart3,
  MapPin,
  User,
  ChevronRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { departmentTranslations } from "@/lib/translations/departments"
import { DataTable } from "@/components/ui/data-table"
import { AddDepartmentModal, EditDepartmentModal, DeleteDepartmentModal } from "@/components/modals/department"
import { useInstitution } from "@/contexts/institution-context"
import { useCurrency } from "@/contexts/currency-context"
import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
import { DepartmentsKPICards, KPICardData, KPICards } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { EntityInfoCard } from "@/components/shared/entity-info-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Eye } from "lucide-react"

import { CreateDepartment } from "@/types/CreateDepartment"
import NotFound from "@/components/shared/not-found"
import {
   InstitutionById_institution_departments as DepartmentData,
   InstitutionById_institution_churches as ChurchData
} from "@/types/InstitutionById"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { WithPermission } from "@/hocs/with-permission"
import { DepartmentActivityChart } from "@/components/institutions/charts/department-activity-chart"


/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS
 * Interface dedicada para gerenciar departamentos baseada no ERD do AdventistGroei
 */
export default function DepartmentsPage() {
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const { formatCurrency } = useCurrency();
  // Filtrar apenas departamentos INSTITUCIONAIS (sem church_id)
  const allDepartments = currentInstitutionData?.departments || [];
  const departments: DepartmentData[] = allDepartments.filter(dept => !dept.church_id);
  const churches: ChurchData[] = currentInstitutionData?.churches || [];
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Debug: verificar se annual_budgets está chegando
  useEffect(() => {
    if (departments.length > 0) {
      console.log('🔍 Institutional Departments:', departments);
      console.log('🔍 First department annual_budgets:', departments[0]?.annual_budgets);
    }
  }, [departments]);

  // Obter traduções para o idioma atual - EXATAMENTE COMO EM CHURCHES
  const currentLanguage = i18n?.language || 'en'
  const tDept = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  // View mode states - controla se está na lista ou em detalhes
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [selectedDepartmentDetail, setSelectedDepartmentDetail] = useState<DepartmentData | null>(null)
  
  // Modal states
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false)
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false)
  const [isDeleteDepartmentModalOpen, setIsDeleteDepartmentModalOpen] = useState(false)
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null)
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  // Buscar KPIs dos departamentos institucionais do backend
  const { data: kpisData, loading: kpisLoading, refetch: refetchKPIs } = useQuery<
    GetInstitutionalDepartmentsKPIs,
    GetInstitutionalDepartmentsKPIsVariables
  >(GET_INSTITUTIONAL_DEPARTMENTS_KPIS, {
    variables: {
      year: selectedYear,
      institutionId: currentInstitutionData?.id || ''
    },
    skip: !currentInstitutionData?.id
  });

  const pageTitle = useMemo(() => (
    <span className="flex items-center gap-2">
      {t('common.structure_organization')}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      {tDept.institution_department || "Institutional Department"}
    </span>
  ), [t])

  usePageTitle({
    title: pageTitle,
    showBreadcrumbsInHeader: true
  })

  // Estatísticas dos KPIs vindas do backend
  const kpiData = useMemo(() => {
    if (!kpisData?.institutionalDepartmentsKPIs) {
      return {
        totalDepartments: 0,
        totalPlannedBudget: 0,
        totalAllocatedBudget: 0,
        totalSpentBudget: 0,
        totalAvailableBudget: 0,
        avgUtilization: 0,
        departmentsWithCurrentYearBudget: 0
      };
    }

    const kpis = kpisData.institutionalDepartmentsKPIs;

    // Calcular utilização média baseado no totalPlanned
    const avgUtilization = kpis.totalPlanned > 0
      ? Math.round(((kpis.totalAllocated + kpis.totalSpent) / kpis.totalPlanned) * 100)
      : 0;

    return {
      totalDepartments: kpis.totalDepartments,
      totalPlannedBudget: kpis.totalPlanned,
      totalAllocatedBudget: kpis.totalAllocated,
      totalSpentBudget: kpis.totalSpent,
      totalAvailableBudget: kpis.totalAvailable,
      avgUtilization,
      departmentsWithCurrentYearBudget: kpis.departmentsWithBudget
    };
  }, [kpisData]);

  // Dados para KPI Cards Carrossel - KPIs de budget do backend
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_departments",
      title: "Total Institutional Departments",
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: tDept.subtitle || "Manage departments across institutions",
      trend: {
        value: 0,
        isPositive: true,
        label: tDept.common?.trend?.vs_previous_month || "vs. previous month"
      }
    },
    {
      id: "planned_budget",
      title: tDept.common?.planned_budget || "Planned Budget",
      value: formatCurrency(kpiData.totalPlannedBudget, { compact: true }),
      icon: DollarSign,
      subtitle: `${tDept.fields?.planned_budget || "Planned budget"} ${selectedYear}`,
      trend: {
        value: 0,
        isPositive: true,
        label: tDept.common?.trend?.vs_previous_year || "vs. previous year"
      }
    },
    {
      id: "allocated_budget",
      title: tDept.common?.allocated_budget || "Allocated Budget",
      value: formatCurrency(kpiData.totalAllocatedBudget, { compact: true }),
      icon: Building2,
      subtitle: `${tDept.fields?.allocated_budget || "Allocated budget"} ${selectedYear}`,
      trend: {
        value: 0,
        isPositive: true,
        label: tDept.common?.trend?.vs_previous_year || "vs. previous year"
      }
    },
    {
      id: "spent_budget",
      title: tDept.common?.spent_budget || "Spent Budget",
      value: formatCurrency(kpiData.totalSpentBudget, { compact: true }),
      icon: TrendingUp,
      subtitle: `${tDept.common?.spent_this_year || "Spent this year"} ${selectedYear}`,
      trend: {
        value: 0,
        isPositive: true,
        label: tDept.common?.trend?.vs_previous_month || "vs. previous month"
      }
    },
    {
      id: "available_budget",
      title: tDept.common?.available_budget || "Available Budget",
      value: formatCurrency(kpiData.totalAvailableBudget, { compact: true }),
      icon: Shield,
      subtitle: tDept.common?.available_budget || "Available budget",
      trend: {
        value: 0,
        isPositive: kpiData.totalAvailableBudget >= 0,
        label: tDept.common?.trend?.budget_status || "budget status"
      }
    },
    {
      id: "avg_utilization",
      title: tDept.common?.budget_utilization || "Budget Utilization",
      value: `${kpiData.avgUtilization}%`,
      icon: BarChart3,
      subtitle: `${kpiData.departmentsWithCurrentYearBudget}/${kpiData.totalDepartments} ${tDept.common?.with_budget || "with budget"}`,
      trend: {
        value: 0,
        isPositive: kpiData.avgUtilization < 90,
        label: tDept.common?.trend?.efficiency || "efficiency"
      }
    }
  ], [kpiData, tDept, selectedYear]);

  // Dados para gráficos - CORRIGIDOS para usar ano selecionado
  const chartData = useMemo(() => {
    return {
      budgetByDepartment: departments.map(d => {
        // Buscar orçamento do ano selecionado em vez do primeiro
        const yearBudget = d.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        return {
          department: d.name,
          allocated: Number(yearBudget?.allocated_amount) || 0,
          spent: Number(yearBudget?.total_expenses) || 0,
          remaining: (Number(yearBudget?.allocated_amount) || 0) - (Number(yearBudget?.total_expenses) || 0)
        };
      }).filter(d => d.allocated > 0), // Filtrar departamentos que têm orçamento
      userRequests: [],
      budgetTimeline: [],
      subsidyRequestsByDepartment: [] // TODO: implementar quando backend fornecer
    };
  }, [departments, selectedYear]);

  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(tDept.common?.loading || "Loading...")
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success(tDept.common?.data_loaded || "Data loaded successfully", { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(tDept.common?.error || "An error occurred")
        setIsLoading(false)
      }
    }

    loadData()
  }, [tDept])

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(tDept.common?.refreshing || "Refreshing...")

    try {
      await Promise.all([
        refetchInstitutionById(),
        refetchKPIs()
      ])
      toast.success(tDept.common?.data_refreshed || "Data refreshed", { duration: 2000 })
    } catch (error) {
      toast.error(tDept.common?.error_refreshing || "Error refreshing")
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
  
  const handleViewDetails = (id: string) => {
    const department = departments.find(d => d.id === id);
    if (department) {
      setSelectedDepartmentDetail(department);
      setViewMode('detail');
    }
  };
  
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDepartmentDetail(null);
  };
  
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

  const handleDepartmentSaved = (department: CreateDepartment) => {
    toast.success(tDept.messages?.created_success || "Department created successfully")
    handleRefresh()
  }
  
  const handleDepartmentUpdated = (department: DepartmentData) => {
    toast.success(tDept.messages?.updated_success || "Department updated successfully")
    handleRefresh()
  }
  
  const handleDepartmentDeleted = (department: DepartmentData) => {
    toast.success(tDept.messages?.deleted_success || "Department deleted successfully")
    handleRefresh()
  }

  if (!currentInstitutionData) return <NotFound />
  
  // Colunas da tabela de departamentos
  const departmentColumns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: tDept.common?.name || "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground max-w-xs truncate line-clamp-2">{row.original.description || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      id: "church_id",
      accessorKey: "church_id",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.churches?.church || "Church"}
        </div>
      ),
      cell: ({ row }) => {
        const church = churches.find((c: any) => c.id === row.original.church_id)
        return (
          <div className="flex items-center justify-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{church ? church.name : '0'}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (!value || value === "all") return true
        return row.getValue(id) === value
      },
    },
    {
      id: "members",
      accessorKey: "members_count",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.common?.members || "Members"}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users.length || 0}</span>
        </div>
      ),
    },
    {
      id: "budget_total",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.annual_budget?.table?.headers?.budget_total || "Total Budget"}
        </div>
      ),
      cell: ({ row }) => {
        // Buscar orçamento do ano selecionado
        const yearBudget = row.original.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        const plannedBudget = Number(yearBudget?.planned_budget) || 0;
        const hasBudget = plannedBudget > 0;

        return (
          <div className={`text-center ${!hasBudget ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-gray-900">
              {hasBudget ? formatCurrency(plannedBudget) : '-'}
            </div>
            {hasBudget && (
              <div className="text-xs text-gray-500">
                {tDept.annual_budget?.table?.planned || "Planned"} {selectedYear}
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "spent_amount",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.annual_budget?.table?.headers?.spent_amount || "Spent Amount"}
        </div>
      ),
      cell: ({ row }) => {
        // Buscar orçamento do ano selecionado
        const yearBudget = row.original.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        const spentAmount = Number(yearBudget?.total_expenses) || 0;
        const plannedBudget = Number(yearBudget?.planned_budget) || 0;
        const hasBudget = plannedBudget > 0;

        return (
          <div className={`text-center ${!hasBudget ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-gray-900">
              {hasBudget ? formatCurrency(spentAmount) : '-'}
            </div>
            {hasBudget && (
              <div className="text-xs text-gray-500">
                {tDept.common?.spent_of || "of"} {formatCurrency(plannedBudget)}
              </div>
            )}
          </div>
        )
      },
    },
    {
      id: "usage_percentage",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.annual_budget?.table?.headers?.usage_percentage || "Usage %"}
        </div>
      ),
      cell: ({ row }) => {
        // Buscar orçamento do ano selecionado
        const yearBudget = row.original.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        const plannedBudget = Number(yearBudget?.planned_budget) || 0;
        const usedBudget = Number(yearBudget?.total_expenses) || 0;
        const usagePercentage = plannedBudget > 0 ? Math.round((usedBudget / plannedBudget) * 100) : 0;
        const hasBudget = plannedBudget > 0;

        return (
          <div className="flex justify-center">
            <UsageIndicator
              percentage={usagePercentage}
              disabled={!hasBudget}
              size="md"
            />
          </div>
        )
      },
    },
    {
      id: "budget_status",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.institutions?.table?.budget_status || "Budget Status"}
        </div>
      ),
      cell: ({ row }) => {
        // Buscar orçamento do ano selecionado
        const yearBudget = row.original.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        const hasBudget = yearBudget && Number(yearBudget.planned_budget) > 0;

        return (
          <div className="flex justify-center">
            <StatusBadge
              label={hasBudget ?
                (tDept.annual_budget?.table?.budget_status_labels?.completed || "Active") :
                (tDept.annual_budget?.table?.budget_status_labels?.missing || "No Budget")
              }
              variant={hasBudget ? "success" : "neutral"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === undefined || value === null || value === "") {
          return true
        }
        // Buscar orçamento do ano selecionado
        const yearBudget = row.original.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        const hasBudget = yearBudget && Number(yearBudget.planned_budget) > 0;
        return hasBudget === value
      },
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.common?.status || "Status"}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? (tDept.common?.active || "Active") : (tDept.common?.inactive || "Inactive")}
              variant={isActive ? "success" : "neutral"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
      },
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
      header: tDept.common?.actions || "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleViewDetails(row.original.id)}>
              <Eye className="w-4 h-4 mr-2" />
              {tDept.actions?.view_details || "View Details"}
            </DropdownMenuItem>
            <WithPermission requiredPermissions={[PermissionResolverName.UpdateDepartment]}>
              <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
                <Edit className="w-4 h-4 mr-2" />
                {tDept.actions?.edit_department || "Edit Department"}
              </DropdownMenuItem>
            </WithPermission>
            <WithPermission requiredPermissions={[PermissionResolverName.DeleteDepartment]}>
              <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
                <Trash2 className="w-4 h-4 mr-2" />
                {tDept.actions?.delete_department || "Delete Department"}
              </DropdownMenuItem>
            </WithPermission>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Colunas da tabela de usuários (para detail view)
  const userColumns: ColumnDef<any>[] = [
    {
      id: "avatar",
      header: tDept.users?.table?.avatar || "Avatar",
      cell: ({ row }) => {
        const user = row.original
        return (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>
              {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
        )
      },
    },
    {
      id: "name",
      accessorKey: "name",
      header: tDept.users?.table?.name || "Name",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {user.email || '-'}
            </div>
          </div>
        )
      },
    },
    {
      id: "language",
      accessorKey: "language_preference",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.users?.table?.language || "Language"}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-xs font-mono">
            {row.original.language_preference?.toUpperCase() || 'N/A'}
          </Badge>
        </div>
      ),
    },
    {
      id: "roles",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.users?.table?.roles || "Roles"}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {user.user_roles?.map((role: any) => (
              <Badge 
                key={role.id} 
                variant={role.role.key_code === 'ADMIN' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {role.role.key_code === 'ADMIN' && <Crown className="w-3 h-3 mr-1" />}
                {role.role.name}
              </Badge>
            )) || <span className="text-xs text-muted-foreground">{tDept.users?.table?.no_roles || "No roles"}</span>}
          </div>
        )
      },
    },
    {
      id: "gender",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.users?.table?.gender || "Gender"}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const genderLabel = user.gender ? `${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1).toLowerCase()}` : 'N/A';
        return (
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              {genderLabel}
            </Badge>
          </div>
        )
      },
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {tDept.users?.table?.status || "Status"}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? (tDept.users?.table?.active || "Active") : (tDept.users?.table?.inactive || "Inactive")}
              variant={isActive ? "success" : "error"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
      },
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
        {/* Breadcrumbs Navigation - Only show in detail view */}
        {viewMode === 'detail' && selectedDepartmentDetail && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToList();
                  }}
                  className="cursor-pointer hover:text-foreground"
                >
                  {tDept.institution_department || "Institution Department"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {selectedDepartmentDetail.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Header - Only show in list view */}
        {viewMode === 'list' && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
                {tDept.institution_department || "Institution Department"}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {tDept.subtitle || "Manage departments across institutions"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <WithPermission requiredPermissions={[PermissionResolverName.CreateDepartment]}>
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  {tDept.create_department || "Create Department"}
                </Button>
              </WithPermission>
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
        )}

        {/* KPI Cards - Conditional Rendering */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <>
            {/* Detail View KPI Cards usando KPICards component com carrossel */}
            {(() => {
              const latestBudget = selectedDepartmentDetail.annual_budgets?.[0];
              const plannedBudget = latestBudget?.planned_budget || 0;
              const totalExpenses = latestBudget?.total_expenses || 0;
              const usagePercentage = plannedBudget > 0 ? Math.round((totalExpenses / plannedBudget) * 100) : 0;
              
              const detailKPIData: KPICardData[] = [
                {
                  id: "budget_total",
                  title: tDept.kpi?.budget_total?.title || "Budget Total",
                  value: formatCurrency(plannedBudget),
                  icon: DollarSign,
                  subtitle: tDept.kpi?.budget_total?.subtitle || "Total planned budget",
                },
                {
                  id: "spent_amount",
                  title: tDept.kpi?.spent_amount?.title || "Spent Amount",
                  value: formatCurrency(totalExpenses),
                  icon: TrendingUp,
                  subtitle: tDept.kpi?.spent_amount?.subtitle || "Total expenses",
                },
                {
                  id: "members",
                  title: tDept.kpi?.members?.title || "Members",
                  value: selectedDepartmentDetail.users?.length || 0,
                  icon: Users,
                  subtitle: tDept.kpi?.members?.subtitle || "Department members",
                }
              ];
              
              const customFirstCard = (
                <EntityInfoCard
                  headerTitle={tDept.detail?.info_card?.header_title || "Department Info"}
                  name={selectedDepartmentDetail.name}
                  description={selectedDepartmentDetail.description || (tDept.detail?.info_card?.no_description || "No description available")}
                  icon={Layers}
                  badges={[
                    {
                      label: churches.find(c => c.id === selectedDepartmentDetail.church_id)?.name || (tDept.detail?.info_card?.institutional || "Institutional"),
                      variant: "outline",
                      className: "text-xs"
                    },
                    {
                      label: !selectedDepartmentDetail.is_deleted ? (tDept.detail?.info_card?.active || "Active") : (tDept.detail?.info_card?.inactive || "Inactive"),
                      variant: !selectedDepartmentDetail.is_deleted ? "default" : "secondary",
                      className: !selectedDepartmentDetail.is_deleted 
                        ? "text-xs bg-green-100 text-green-700" 
                        : "text-xs bg-gray-100 text-gray-700"
                    }
                  ]}
                  actions={[
                    {
                      label: tDept.actions?.edit_department || "Edit Department",
                      icon: Edit,
                      onClick: () => handleEdit(selectedDepartmentDetail.id),
                      variant: "default"
                    },
                    {
                      label: tDept.actions?.delete_department || "Delete Department",
                      icon: Trash2,
                      onClick: () => handleDelete(selectedDepartmentDetail.id, selectedDepartmentDetail.name),
                      variant: "destructive",
                      showSeparatorAfter: false
                    }
                  ]}
                />
              );
              
              return (
                <KPICards
                  data={detailKPIData}
                  isLoading={false}
                  minCardsForCarousel={3}
                  showCarousel={true}
                  customFirstCard={customFirstCard}
                />
              );
            })()}
          </>
        ) : (
            <KPICards
              data={kpiCardsData}
              isLoading={isLoading}
              minCardsForCarousel={2}
              showCarousel={true}
            />
        )}

        <Separator />

        {/* Charts Section - Visible in both views */}
        <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
          <DepartmentActivityChart
            departments={departments}
            selectedYear={selectedYear}
            loading={isLoading}
          />
        </ResponsiveGridCarousel>

        <Separator />

        {/* Conditional Content - Users Table or Departments Table */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <>
            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {tDept.detail?.members_table?.title || "Department Members"}
                </CardTitle>
                <CardDescription>
                  {tDept.detail?.members_table?.description || `List of all members in ${selectedDepartmentDetail.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={userColumns}
                  data={selectedDepartmentDetail.users || []}
                  searchKey="name"
                  emptyEntityName={selectedDepartmentDetail.name}
                  filters={[
                    {
                      id: "status",
                      title: tDept.common?.status || "Status",
                      options: [
                        { label: tDept.common?.active || "Active", value: "true" },
                        { label: tDept.common?.inactive || "Inactive", value: "false" }
                      ]
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Departments Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  {tDept.table_title || "Departments"}
                </CardTitle>
                <CardDescription>{tDept.table_description || "Complete list of departments with management actions"}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={departmentColumns}
                  data={departments}
                  searchKey="name"
                  emptyEntityName={tDept.entity_name || "Departments"}
                  filters={[
                {
                  id: "church_id",
                  title: tDept.churches?.church || "Church",
                  options: [
                    { label: tDept.filters?.institutional || "Institutional", value: "institutional" },
                    ...churches.map(church => ({
                      label: church.name,
                      value: church.id
                    }))
                  ]
                },
                {
                  id: "budget_status",
                  title: tDept.institutions?.table?.budget_status || "Budget Status",
                  options: [
                    { label: tDept.annual_budget?.table?.budget_status_labels?.completed, value: "true" },
                    { label: tDept.annual_budget?.table?.budget_status_labels?.missing, value: "false" }
                  ]
                },
                {
                  id: "status",
                  title: tDept.common?.status || "Status",
                  options: [
                    { label: tDept.common?.active || "Active", value: "true" },
                    { label: tDept.common?.inactive || "Inactive", value: "false" }
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>
          </>
        )}
        
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
            departmentType="institutional"
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
        
      </div>
      </WithPermission>
    </AppLayout>
  )
}
