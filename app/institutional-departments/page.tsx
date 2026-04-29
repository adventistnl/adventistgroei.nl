"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery, useMutation } from "@apollo/client"
import { GET_INSTITUTIONAL_DEPARTMENTS_KPIS } from "@/graphql/queries/ANNUAL_BUDGET_QUERIES"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { UPDATE_USER } from "@/graphql/mutations/USER_MUTATIONS"
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
  ShieldAlert,
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
import { ChartHeader } from "@/components/charts/chart-header"
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
import { InstitutionalDepartmentProjectOverTimeChart } from "@/components/institutions/charts/institutional-department-project-over-time-chart"
import { GridContainer } from "@/components/shared/grid-container"
import { DepartmentLeaderInfoCard } from "@/components/modals/department/department-leader-info-card"
import { DepartmentProjectsCard } from "@/components/modals/department/department-projects-card"
import { DepartmentLeadersCard } from "@/components/modals/department/department-leaders-card"
import { PrivacyWrapper, InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { createPrivacyConfig } from "@/config/privacy-roles.config"
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"
import { GlobalPrivacyToggle } from "@/components/shared/global-privacy-toggle"
import { YearFilter } from "@/components/shared/year-filter"


/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS
 * Interface dedicada para gerenciar departamentos baseada no ERD do AdventistGroei
 */
export default function DepartmentsPage() {
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const { formatCurrency } = useCurrency();
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear()
    return [currentYear, currentYear - 1, currentYear - 2].sort((a, b) => b - a)
  })
  const [pageFilters, setPageFilters] = useState<Record<string, any>>({
    status: "true", // Default: active departments only
    budget_status: "" // Default: all
  })
  const [userFilters, setUserFilters] = useState<Record<string, any>>({
    status: "true", // Default: active users only
    roles: [], // Default: all roles
    language: "" // Default: all languages
  })
  
  // Filtrar apenas departamentos INSTITUCIONAIS (sem church_id)
  const allDepartments = currentInstitutionData?.departments || [];
  const unfilteredDepartments: DepartmentData[] = allDepartments.filter(dept => {
    // Filtrar por tipo (institucional)
    if (dept.church_id) return false;
    
    // Filtrar por ano baseado no created_at
    const createdDate = new Date(dept.created_at);
    return createdDate.getFullYear() === selectedYear;
  });
  
  // Aplicar filtros de página
  const departments: DepartmentData[] = useMemo(() => {
    return unfilteredDepartments.filter(dept => {
      // Filter by status
      if (pageFilters.status !== undefined && pageFilters.status !== "") {
        const isActive = !dept.is_deleted;
        if (pageFilters.status === "true" && !isActive) return false;
        if (pageFilters.status === "false" && isActive) return false;
      }
      
      // Filter by budget status
      if (pageFilters.budget_status !== undefined && pageFilters.budget_status !== "") {
        const yearBudget = dept.annual_budgets?.find(
          (budget: any) => budget.year === selectedYear
        );
        const hasBudget = yearBudget && Number(yearBudget.planned_budget) > 0;
        if (pageFilters.budget_status === "true" && !hasBudget) return false;
        if (pageFilters.budget_status === "false" && hasBudget) return false;
      }
      
      return true;
    });
  }, [unfilteredDepartments, pageFilters, selectedYear]);
  const churches: ChurchData[] = currentInstitutionData?.churches || [];

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

  // Page Filters Configuration
  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: "status",
      label: tDept.common?.status || "Status",
      type: "select",
      placeholder: tDept.common?.select_status || "Select status",
      options: [
        { label: tDept.common?.all || "All", value: "" },
        { label: tDept.common?.active || "Active", value: "true" },
        { label: tDept.common?.inactive || "Inactive", value: "false" }
      ],
      defaultValue: "true"
    },
    {
      id: "budget_status",
      label: tDept.institutions?.table?.budget_status || "Budget Status",
      type: "select",
      placeholder: tDept.common?.select_budget_status || "Select budget status",
      options: [
        { label: tDept.common?.all || "All", value: "" },
        { label: tDept.annual_budget?.table?.budget_status_labels?.completed || "With Budget", value: "true" },
        { label: tDept.annual_budget?.table?.budget_status_labels?.missing || "No Budget", value: "false" }
      ],
      defaultValue: ""
    }
  ], [tDept])

  // User Filters Configuration (Detail View)
  const userFilterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: "status",
      label: tDept.common?.status || "Status",
      type: "select",
      placeholder: tDept.common?.select_status || "Select status",
      options: [
        { label: tDept.common?.all || "All", value: "" },
        { label: tDept.users?.table?.active || "Active", value: "true" },
        { label: tDept.users?.table?.inactive || "Inactive", value: "false" }
      ],
      defaultValue: "true"
    },
    {
      id: "language",
      label: tDept.users?.table?.language || "Language",
      type: "select",
      placeholder: tDept.common?.select_language || "Select language",
      options: [
        { label: tDept.common?.all || "All", value: "" },
        { label: "English", value: "en" },
        { label: "Nederlands", value: "nl" },
        { label: "Português", value: "pt" }
      ],
      defaultValue: ""
    },
    {
      id: "roles",
      label: tDept.users?.table?.roles || "Roles",
      type: "multi-select",
      placeholder: tDept.common?.select_roles || "Select roles",
      options: [
        // Get unique roles from all users
        ...Array.from(new Set(
          (selectedDepartmentDetail?.users || [])
            .flatMap(u => u.user_roles?.map(r => r.role.name) || [])
        )).map(role => ({
          label: role,
          value: role
        }))
      ],
      defaultValue: []
    }
  ], [tDept, selectedDepartmentDetail])

  // Privacy configurations for financial data (table columns + KPI cards)
  const PRIVACY_CONFIGS = useMemo(() => ({
    // Table columns
    financial: createPrivacyConfig('institutional-dept-financial-data', 'FINANCIAL_DATA'),
    // KPI Cards - List View
    total_departments: createPrivacyConfig('institutional-dept-kpi-total-departments', 'PUBLIC_DATA'),
    plannedBudgetKPI: createPrivacyConfig('institutional-dept-kpi-planned-budget', 'FINANCIAL_DATA'),
    allocatedBudgetKPI: createPrivacyConfig('institutional-dept-kpi-allocated-budget', 'FINANCIAL_DATA'),
    spentBudgetKPI: createPrivacyConfig('institutional-dept-kpi-spent-budget', 'FINANCIAL_DATA'),
    availableBudgetKPI: createPrivacyConfig('institutional-dept-kpi-available-budget', 'FINANCIAL_DATA'),
    budgetUtilizationKPI: createPrivacyConfig('institutional-dept-kpi-budget-utilization', 'FINANCIAL_DATA'),
    // KPI Cards - Detail View
    detailBudgetTotalKPI: createPrivacyConfig('institutional-dept-detail-kpi-budget-total', 'FINANCIAL_DATA'),
    detailSpentAmountKPI: createPrivacyConfig('institutional-dept-detail-kpi-spent-amount', 'FINANCIAL_DATA'),
    members: createPrivacyConfig('institutional-dept-detail-kpi-members', 'PUBLIC_DATA'),
    // Department Projects Card Footer
    projectsFooterFinancial: createPrivacyConfig('institutional-dept-projects-footer-financial', 'FINANCIAL_DATA'),
  }), [])

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

  // Buscar todos os projetos para o gráfico
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS_QUERY, {
    variables: { institutionId: currentInstitutionData?.id },
    skip: !currentInstitutionData?.id
  })

  // Filtrar projetos pelo ano selecionado baseado no created_at
  const allProjects = useMemo(() => {
    const projects = projectsData?.projects || []
    return projects.filter((project: any) => {
      const createdDate = new Date(project.created_at)
      return createdDate.getFullYear() === selectedYear
    })
  }, [projectsData, selectedYear])

  // Mutation para atualizar usuário (usado no ContactViewEditModal)
  const [updateUserMutation] = useMutation(UPDATE_USER)

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
      },
            privacyConfig: PRIVACY_CONFIGS.total_departments,
      headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.total_departments}  className="w-6 h-6 flex-shrink-0"/>
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
      },
      privacyConfig: PRIVACY_CONFIGS.plannedBudgetKPI,
      headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.plannedBudgetKPI}  className="w-6 h-6 flex-shrink-0"/>
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
      },
      privacyConfig: PRIVACY_CONFIGS.allocatedBudgetKPI,
      headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.allocatedBudgetKPI}  className="w-6 h-6 flex-shrink-0" />
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
      },
      privacyConfig: PRIVACY_CONFIGS.spentBudgetKPI,
      headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.spentBudgetKPI} className="w-6 h-6 flex-shrink-0" />
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
      },
      privacyConfig: PRIVACY_CONFIGS.availableBudgetKPI,
      headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.availableBudgetKPI}  className="w-6 h-6 flex-shrink-0"/>
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
      }      ,
      privacyConfig: PRIVACY_CONFIGS.budgetUtilizationKPI,
      headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.plannedBudgetKPI}  className="w-6 h-6 flex-shrink-0"/>
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

  const hasShownLoadingToast = useRef(false)

  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    if (hasShownLoadingToast.current) return
    hasShownLoadingToast.current = true

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
  }, [])

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

  const handleFilterChange = (filterId: string, value: any) => {
    setPageFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleClearFilters = () => {
    setPageFilters({
      status: "true", // Reset to default active
      budget_status: ""
    });
  };

  const handleUserFilterChange = (filterId: string, value: any) => {
    setUserFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const handleClearUserFilters = () => {
    setUserFilters({
      status: "true", // Reset to default active
      roles: [],
      language: ""
    });
  };

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(tDept.common?.year_filter?.cannot_add_beyond?.replace('{{year}}', maxAllowedYear.toString()) || `Cannot add years beyond ${maxAllowedYear}`)
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error(tDept.common?.year_filter?.year_exists?.replace('{{year}}', nextYear.toString()) || `Year ${nextYear} already exists`)
      return
    }

    setAvailableYears(prev => [...prev, nextYear].sort((a, b) => b - a))
    setSelectedYear(nextYear)
    toast.success(tDept.common?.year_filter?.year_added?.replace('{{year}}', nextYear.toString()) || `Year ${nextYear} added`)
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
    // Buscar usuário do departamento selecionado
    const user = selectedDepartmentDetail?.users?.find(u => u.id === id);
    if (user) {
      // Criar ContactData a partir das informações do usuário
      const contactData: ContactData = {
        id: user.contact_id || `contact_${user.id}`,
        name: user.name,
        phone: user.phone || null,
        mobile: null,
        email: user.email,
        country: null,
        city: null,
        address: user.address || null,
        full_address: null,
        postal_code: null,
        website: null,
        notes: null,
        is_primary: true,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString(),
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setSelectedContact(contactData);
      setIsViewContactModalOpen(true);
    }
  };

  const handleDepartmentSaved = (department: CreateDepartment) => {
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
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground max-w-xs truncate line-clamp-2">{row.original.description || '-'}</div>
          </div>
        </div>
      ),
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
          <PrivacyWrapper
            config={PRIVACY_CONFIGS.financial}
            showToggle={false}
            className="inline-block"
            fallback={
              <div className="flex items-center justify-center gap-1 blur-[1px] opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
                ))}
              </div>
            }
          >
            <div className={`text-center ${!hasBudget ? 'opacity-50' : ''}`}>
              <div className="text-sm font-medium">
                {hasBudget ? formatCurrency(plannedBudget) : '-'}
              </div>
              {hasBudget && (
                <div className="text-xs text-muted-foreground">
                  {tDept.annual_budget?.table?.planned || "Planned"} {selectedYear}
                </div>
              )}
            </div>
          </PrivacyWrapper>
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
          <PrivacyWrapper
            config={PRIVACY_CONFIGS.financial}
            showToggle={false}
            className="inline-block"
            fallback={
              <div className="flex items-center justify-center gap-1 blur-[1px] opacity-40">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-full bg-gray-400" />
                ))}
              </div>
            }
          >
            <div className={`text-center ${!hasBudget ? 'opacity-50' : ''}`}>
              <div className="text-sm font-medium">
                {hasBudget ? formatCurrency(spentAmount) : '-'}
              </div>
              {hasBudget && (
                <div className="text-xs text-muted-foreground">
                  {tDept.common?.spent_of || "of"} {formatCurrency(plannedBudget)}
                </div>
              )}
            </div>
          </PrivacyWrapper>
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
      id: "user",
      accessorKey: "name",
      header: () => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-gray-900">{tDept.users?.table?.name || "User"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                {user.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || '??'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email || '-'}</div>
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
          <Badge variant="outline" className="text-xs font-mono bg-gray-100 text-gray-700 border-gray-300">
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
                variant="outline"
                className="text-xs bg-gray-100 text-gray-700 border-gray-300"
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
    {
      id: "actions",
      header: () => (
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium text-gray-900">{tDept.common?.actions || "Actions"}</span>
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleViewContact(user.id)}>
                  <ContactRound className="h-4 w-4 mr-2" />
                  {tDept.actions?.view_contact || "View Contact"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
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
      <WithPermission
        requiredPermissions={[PermissionResolverName.Departments, PermissionResolverName.Institutions]}
        fallback={
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="text-card-foreground flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-xl border p-6 sm:p-8 shadow-sm w-full max-w-md backdrop-blur-sm">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                <ShieldAlert className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-semibold">
                  {'Access Denied'}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {'You need both Departments and Institutions permissions to view this page.'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {'Contact your administrator to request access.'}
                </p>
              </div>
            </div>
          </div>
        }
      >
      
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

        {/* Header - Show in both views with different content */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {viewMode === 'list' ? (
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
                {tDept.institution_department || "Institution Department"}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {tDept.subtitle || "Manage departments across institutions"}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
                {selectedDepartmentDetail?.name}
              </h2>
              <p className="text-muted-foreground text-0.875rem sm:text-1rem">
                {selectedDepartmentDetail?.description || (tDept.detail?.info_card?.no_description || "No description available")}
              </p>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <GlobalPrivacyToggle
              variant="icon"
              size="default"
              showLabel={true}
            />
            {viewMode === 'list' && (
              <PageFilters
                filters={filterConfigs}
                values={pageFilters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
                triggerLabel={tDept.common?.filters || "Filters"}
              />
            )}
            {viewMode === 'detail' && (
              <PageFilters
                filters={userFilterConfigs}
                values={userFilters}
                onChange={handleUserFilterChange}
                onClear={handleClearUserFilters}
                triggerLabel={tDept.common?.filters || "Filters"}
              />
            )}
            {viewMode === 'list' && (
              <WithPermission requiredPermissions={[PermissionResolverName.CreateDepartment]}>
                <Button onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  {tDept.create_institutional_department || "Create Institutional Department"}
                </Button>
              </WithPermission>
            )}
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

        {/* Year Filter */}
        <YearFilter 
          availableYears={availableYears}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          onAddYear={handleAddYear}
          showAddButton={false}
          className="mb-6"
        />

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
                  privacyConfig: PRIVACY_CONFIGS.detailBudgetTotalKPI,
                  headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.detailBudgetTotalKPI} className="w-6 h-6 flex-shrink-0" />
                },
                {
                  id: "spent_amount",
                  title: tDept.kpi?.spent_amount?.title || "Spent Amount",
                  value: formatCurrency(totalExpenses),
                  icon: TrendingUp,
                  subtitle: tDept.kpi?.spent_amount?.subtitle || "Total expenses",
                  privacyConfig: PRIVACY_CONFIGS.detailSpentAmountKPI,
                  headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.detailSpentAmountKPI} className="w-6 h-6 flex-shrink-0" />
                },
                {
                  id: "members",
                  title: tDept.kpi?.members?.title || "Members",
                  value: selectedDepartmentDetail.users?.length || 0,
                  icon: Users,
                  subtitle: tDept.kpi?.members?.subtitle || "Department members",
                   privacyConfig: PRIVACY_CONFIGS.members,
                  headerAction: <InlinePrivacyToggle config={PRIVACY_CONFIGS.members} className="w-6 h-6 flex-shrink-0" />
                }
              ];
              
              const customFirstCard = (
                <EntityInfoCard
                  headerTitle={tDept.detail?.info_card?.header_title || "Department Info"}
                  name={selectedDepartmentDetail.name}
                  description={selectedDepartmentDetail.description || (tDept.detail?.info_card?.no_description || "No description available")}
                  icon={Layers}
                  invertTheme={true}
                  badges={[
                    {
                      label: churches.find(c => c.id === selectedDepartmentDetail.church_id)?.name || (tDept.detail?.info_card?.institutional || "Institutional"),
                      variant: "default",
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
                      variant: "default",
                      requiredPermissions: [PermissionResolverName.UpdateDepartment]
                    },
                    {
                      label: tDept.actions?.delete_department || "Delete Department",
                      icon: Trash2,
                      onClick: () => handleDelete(selectedDepartmentDetail.id, selectedDepartmentDetail.name),
                      variant: "destructive",
                      showSeparatorAfter: false,
                      requiredPermissions: [PermissionResolverName.DeleteDepartment]
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
            (() => {
              const now = new Date()
              const startOfYear = new Date(now.getFullYear(), 0, 1)
              const totalDays = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0)
              const daysPassed = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1
              const percentage = Math.round((daysPassed / totalDays) * 100)
              
              const YearProgressCard = (
                <EntityInfoCard
                  headerTitle={`Year progress  - ${now.getFullYear()}`}
                  name={`${daysPassed} / ${totalDays} days`}
                  description={`${percentage}%`}
                  icon={Calendar}
                  invertTheme={true}
                  badges={[
                    {
                      label: `Day ${daysPassed}/${totalDays}`,
                      variant: "default",
                      className: "text-xs font-medium"
                    },
                    {
                      label: `Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}`,
                      variant: "default",
                      className: "text-xs "
                    }
                  ]}
                />
              )
              
              return (
                <KPICards
                  data={kpiCardsData}
                  isLoading={isLoading}
                  minCardsForCarousel={2}
                  showCarousel={true}
                  customFirstCard={YearProgressCard}
                />
              )
            })()
        )}

        <Separator />

        {/* Charts Section - Visible in both views */}
        <GridContainer
          items={[
            {
              id: "InstitutionalDepartmentProjectOverTimeChart",
              component: (
                <InstitutionalDepartmentProjectOverTimeChart
                  departments={viewMode === 'detail' && selectedDepartmentDetail 
                    ? [selectedDepartmentDetail] 
                    : (currentInstitutionData?.departments || [])
                  }
                  projects={viewMode === 'detail' && selectedDepartmentDetail
                    ? allProjects.filter((p: any) => p.department_id === selectedDepartmentDetail.id)
                    : allProjects
                  }
                  loading={projectsLoading}
                  selectedYear={selectedYear}
                />
              ),
              colSpan: viewMode === 'detail' ? "col-span-12 lg:col-span-7" : "col-span-12 lg:col-span-8",
            },
            ...(viewMode === 'detail' && selectedDepartmentDetail ? [
              {
                id: "DepartmentInfoAndProjects",
                component: (() => {
                  const departmentProp = {
                    id: selectedDepartmentDetail.id,
                    name: selectedDepartmentDetail.name,
                    leader_id: selectedDepartmentDetail.leader_id
                  }
                  
                  const usersProp = (currentInstitutionData?.users || []).filter(user => !user.is_deleted).map(u => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    language_preference: u.language_preference || undefined
                  }))
                  
                  return (
                    <div className="flex flex-col gap-4 h-[calc(100vh-24rem)] min-h-[600px]">
                      <div className="h-[23%] min-h-[100px]">
                        <DepartmentLeaderInfoCard
                          department={departmentProp}
                          users={usersProp}
                          loading={isLoading}
                          showHeader={false}
                        />
                      </div>
                      <div className="flex-1 h-[77%] min-h-[400px]">
                        <DepartmentProjectsCard
                          projects={allProjects as any}
                          departmentId={selectedDepartmentDetail.id}
                          departmentName={selectedDepartmentDetail.name}
                          loading={projectsLoading}
                          privacyConfig={PRIVACY_CONFIGS.projectsFooterFinancial}
                        />
                      </div>
                    </div>
                  )
                })(),
                colSpan: "col-span-12 lg:col-span-5",
              }
            ] : [
              {
                id: "DepartmentLeadersOverview",
                component: (
                  <DepartmentLeadersCard
                    users={(currentInstitutionData?.users || []).filter(user => !user.is_deleted).map(u => ({
                      id: u.id,
                      name: u.name,
                      email: u.email,
                      language_preference: u.language_preference || undefined,
                      user_roles: u.user_roles || undefined,
                      is_deleted: u.is_deleted
                    }))}
                    departments={departments.map(d => ({
                      id: d.id,
                      name: d.name,
                      church_id: d.church_id,
                      church_name: churches.find(c => c.id === d.church_id)?.name,
                      leader_id: d.leader_id
                    }))}
                    departmentName={tDept.institution_department || "Institutional Departments"}
                    departmentType="institution"
                    loading={isLoading}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-4",
              }
            ])
          ]}
          totalColumns={12}
          gap="md"
        />

        <Separator />

        {/* Conditional Content - Users Table or Departments Table */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <>
            {/* Users Table */}
            <Card>
              <ChartHeader
                title={tDept.detail?.members_table?.title || "Department Members"}
                description={tDept.detail?.members_table?.description || `List of all members in ${selectedDepartmentDetail.name}`}
                actionsOrientation="responsive"
              />
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={userColumns}
                  data={(() => {
                    const users = selectedDepartmentDetail.users || [];
                    return users.filter(user => {
                      // Filter by status
                      if (userFilters.status !== undefined && userFilters.status !== "") {
                        const isActive = !user.is_deleted;
                        if (userFilters.status === "true" && !isActive) return false;
                        if (userFilters.status === "false" && isActive) return false;
                      }
                      
                      // Filter by language
                      if (userFilters.language !== undefined && userFilters.language !== "") {
                        if (user.language_preference !== userFilters.language) return false;
                      }
                      
                      // Filter by roles (multi-select)
                      if (Array.isArray(userFilters.roles) && userFilters.roles.length > 0) {
                        const userRoleNames = user.user_roles?.map(r => r.role.name) || [];
                        const hasMatchingRole = userFilters.roles.some(selectedRole => 
                          userRoleNames.includes(selectedRole)
                        );
                        if (!hasMatchingRole) return false;
                      }
                      
                      return true;
                    });
                  })()}
                  searchKey="name"
                  emptyEntityName={selectedDepartmentDetail.name}
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Departments Table */}
            <Card>
              <ChartHeader
                title={tDept.table_title || "Departments"}
                description={tDept.table_description || "Complete list of departments with management actions"}
                actionsOrientation="responsive"
                actions={
                  <InlinePrivacyToggle
                    config={PRIVACY_CONFIGS.financial}
                  />
                }
              />
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={departmentColumns}
                  data={departments}
                  searchKey="name"
                  emptyEntityName={tDept.entity_name || "Departments"}
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
        {selectedContact && (
          <ContactViewEditModal
            isOpen={isViewContactModalOpen}
            onOpenChange={setIsViewContactModalOpen}
            contact={selectedContact}
            entityName={selectedDepartmentDetail?.name}
            entityType={tDept.institution_department || "Institutional Department"}
            updateMutation={updateUserMutation}
            entityId={selectedDepartmentDetail?.users?.find(u => selectedContact.email === u.email)?.id || ''}
            onSave={() => {
              handleRefresh();
              setIsViewContactModalOpen(false);
            }}
          />
        )}
        
      </div>
      </WithPermission>
    </AppLayout>
  )
}
