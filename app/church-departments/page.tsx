"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
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
  User,
  FileText,
  CheckCircle2
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
import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
import { AnnualBudgetViewEditModal, AnnualBudgetData } from "@/components/modals/annual-budget"
import { DepartmentsKPICards, KPICardData, KPICards } from "@/components/shared/kpi-cards-carousel"
import { DepartmentActivityChart } from "@/components/institutions/charts/department-activity-chart"
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


/**
 * PÁGINA DE GESTÃO DE DEPARTAMENTOS DE IGREJAS
 * Interface dedicada para gerenciar departamentos vinculados a igrejas
 */
export default function ChurchDepartmentsPage() {
  const { currentInstitutionData, refetchInstitutionById } = useInstitution();
  const churches: ChurchData[] = currentInstitutionData?.churches || [];
  const departments: DepartmentData[] = churches.flatMap(church => church.departments?.flatMap(department => ({ ...department, church_name: church.name })) || []);
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // View mode states - controla se está na lista ou em detalhes
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [selectedDepartmentDetail, setSelectedDepartmentDetail] = useState<DepartmentData | null>(null)
  
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
    title: t.church_page?.title || "Church Departments"
  })

  // Estatísticas calculadas dos dados
  type DepartmentType = typeof departments extends (infer U)[] ? U : any;
  const kpiData = useMemo(() => {
    const totalDepartments = departments.length;
    
    // Total de churches únicas que têm departamentos
    const uniqueChurches = new Set(departments.map(d => d.church_id));
    const totalChurches = uniqueChurches.size;
    
    // Total de projetos registrados, em aberto e concluídos
    let totalProjects = 0;
    let openProjects = 0;
    let completedProjects = 0;
    
    departments.forEach((d: DepartmentType) => {
      const projects = (d as any).projects || [];
      totalProjects += projects.length;
      
      projects.forEach((project: any) => {
        if (project.status === 'COMPLETED' || project.is_completed) {
          completedProjects++;
        } else {
          openProjects++;
        }
      });
    });
    
    return {
      totalDepartments,
      totalChurches,
      totalProjects,
      openProjects,
      completedProjects
    };
  }, [departments]);

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => {
    const kpiCardsTranslations = (t.church_page as any)?.kpi_cards || {}
    
    return [
      {
        id: "total_departments",
        title: kpiCardsTranslations.total_departments || "Church Departments",
        value: kpiData.totalDepartments,
        icon: Layers,
        subtitle: kpiCardsTranslations.total_departments_subtitle || "Total church departments"
      },
      {
        id: "total_churches",
        title: kpiCardsTranslations.total_churches || "Total Churches",
        value: kpiData.totalChurches,
        icon: Home,
        subtitle: kpiCardsTranslations.total_churches_subtitle || "Churches with departments"
      },
      {
        id: "total_projects",
        title: kpiCardsTranslations.total_projects || "Total Projects",
        value: kpiData.totalProjects,
        icon: TrendingUp,
        subtitle: kpiCardsTranslations.total_projects_subtitle || "All registered projects"
      },
      {
        id: "open_projects",
        title: kpiCardsTranslations.open_projects || "Open Projects",
        value: kpiData.openProjects,
        icon: Calendar,
        subtitle: kpiCardsTranslations.open_projects_subtitle || "Projects in progress"
      },
      {
        id: "completed_projects",
        title: kpiCardsTranslations.completed_projects || "Completed Projects",
        value: kpiData.completedProjects,
        icon: Shield,
        subtitle: kpiCardsTranslations.completed_projects_subtitle || "Successfully completed"
      }
    ]
  }, [kpiData, t]);

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
      const loadingToast = toast.loading(t.common?.loading || "Loading...")
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success(t.common?.data_loaded || "Data loaded successfully", { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t.common?.error || "An error occurred")
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
    const refreshToast = toast.loading(t.common?.refreshing || "Refreshing...")
    
    try {
      await refetchInstitutionById()
      toast.success(t.common?.data_refreshed || "Data refreshed", { duration: 2000 })
    } catch (error) {
      toast.error(t.common?.error_refreshing || "Error refreshing")
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
    toast.success(t.toasts?.created || "Church department created successfully")
    handleRefresh()
  }
  
  const handleDepartmentUpdated = (department: DepartmentData) => {
    toast.success(t.toasts?.updated || "Church department updated successfully")
    handleRefresh()
  }
  
  const handleDepartmentDeleted = (department: DepartmentData) => {
    toast.success(t.toasts?.deleted || "Church department deleted successfully")
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
    
    toast.success(t.annual_budget?.messages?.updated_success || "Budget updated successfully", {
      duration: 3000,
      icon: '💰'
    });
    handleRefresh();
  }

  if (!currentInstitutionData) return <NotFound />
  
  // Colunas da tabela de departamentos
  const departmentColumns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t.labels?.name || "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3 max-w-[300px]">
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
          {t.labels?.church || "Church"}
        </div>
      ),
      cell: ({ row }) => {
        const church = churches.find((c: ChurchData) => c.id === row.original.church_id)
        return (
          <div className="flex items-center justify-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{church ? church.name : '-'}</span>
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
          {t.stats?.members || "Members"}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "open_projects",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.stats?.projects || "Projects"} ({t.common?.status || "Status"})
        </div>
      ),
      cell: ({ row }) => {
        const projects = (row.original.projects as any) || [];
        const openCount = projects.filter((p: any) => 
          p.status !== 'COMPLETED' && !p.is_completed
        ).length;
        
        return (
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{openCount}</span>
          </div>
        )
      },
    },
    {
      id: "completed_projects",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.stats?.projects || "Projects"} ({t.common?.status || "Status"})
        </div>
      ),
      cell: ({ row }) => {
        const projects = (row.original.projects as any) || [];
        const completedCount = projects.filter((p: any) => 
          p.status === 'COMPLETED' || p.is_completed
        ).length;
        
        return (
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{completedCount}</span>
          </div>
        )
      },
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.common?.status || "Status"}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? t.common?.active || "Active" : t.common?.inactive || "Inactive"}
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
      header: t.common?.actions || "Actions",
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
              {t.actions?.view_details || "View Details"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.actions?.edit_department || "Edit Department"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t.actions?.delete_department || "Delete Department"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  // Colunas da tabela de usuários (para detail view)
  const userColumns: ColumnDef<any>[] = [
    {
      id: "avatar",
      header: t.users?.table?.avatar || "Avatar",
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
      header: t.users?.table?.name || "Name",
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
          {t.users?.table?.language || "Language"}
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
          {t.users?.table?.roles || "Roles"}
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
            )) || <span className="text-xs text-muted-foreground">{t.users?.table?.no_roles || "No roles"}</span>}
          </div>
        )
      },
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.users?.table?.gender || "Gender"}
        </div>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const genderLabel = user.gender ? `${user.gender.charAt(0).toUpperCase()}${user.gender.slice(1)}` : 'N/A';
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
          {t.users?.table?.status || "Status"}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? t.users?.table?.active || "Active" : t.users?.table?.inactive || "Inactive"}
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
        {/* Breadcrumbs Navigation - Only in Detail View */}
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
                  {t.breadcrumb?.all_departments || "See All Church Departments"}
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              {viewMode === 'detail' && selectedDepartmentDetail 
                ? `${selectedDepartmentDetail.name} - ${t.title || "Details"}`
                : t.page?.title || "Church Departments"
              }
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {viewMode === 'detail' && selectedDepartmentDetail
                ? selectedDepartmentDetail.description || t.detail?.no_description || "Department details and members"
                : t.page?.description || "Manage church-level departments and ministries"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {viewMode === 'list' && (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {t.create_department || "Create Church Department"}
              </Button>
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

        {/* KPI Cards - Conditional Rendering */}
        {viewMode === 'detail' && selectedDepartmentDetail ? (
          <>
            {/* Detail View KPI Cards usando KPICards component com carrossel */}
            {(() => {
              const projects = (selectedDepartmentDetail as any).projects || [];
              const openProjectsCount = projects.filter((p: any) => 
                p.status !== 'COMPLETED' && !p.is_completed
              ).length;
              const completedProjectsCount = projects.filter((p: any) => 
                p.status === 'COMPLETED' || p.is_completed
              ).length;
              
              const kpiCardsTranslations = ((t as any).church_page?.kpi_cards) || {}
              const detailKPIData: KPICardData[] = [
                {
                  id: "members",
                  title: kpiCardsTranslations.members || "Members",
                  value: selectedDepartmentDetail.users?.length || 0,
                  icon: Users,
                  subtitle: kpiCardsTranslations.members_subtitle || "Department members",
                },
                {
                  id: "total_projects",
                  title: kpiCardsTranslations.total_projects || "Total Projects",
                  value: projects.length,
                  icon: TrendingUp,
                  subtitle: kpiCardsTranslations.total_projects_subtitle || "All registered projects",
                },
                {
                  id: "open_projects",
                  title: kpiCardsTranslations.open_projects || "Open Projects",
                  value: openProjectsCount,
                  icon: Calendar,
                  subtitle: kpiCardsTranslations.open_projects_subtitle || "Projects in progress",
                },
                {
                  id: "completed_projects",
                  title: kpiCardsTranslations.completed_projects || "Completed Projects",
                  value: completedProjectsCount,
                  icon: Shield,
                  subtitle: kpiCardsTranslations.completed_projects_subtitle || "Successfully completed",
                }
              ];
              
              const customFirstCard = (
                <EntityInfoCard
                  headerTitle={t.detail?.info_card?.header_title || "Department Info"}
                  name={selectedDepartmentDetail.name}
                  description={selectedDepartmentDetail.description || t.detail?.info_card?.no_description || "No description available"}
                  icon={Layers}
                  badges={[
                    {
                      label: churches.find(c => c.id === selectedDepartmentDetail.church_id)?.name || t.labels?.institutional || "Institutional",
                      variant: "outline",
                      className: "text-xs"
                    },
                    {
                      label: !selectedDepartmentDetail.is_deleted ? t.common?.active || "Active" : t.common?.inactive || "Inactive",
                      variant: !selectedDepartmentDetail.is_deleted ? "default" : "secondary",
                      className: !selectedDepartmentDetail.is_deleted 
                        ? "text-xs bg-green-100 text-green-700" 
                        : "text-xs bg-gray-100 text-gray-700"
                    }
                  ]}
                  actions={[
                    {
                      label: t.actions?.edit_department || "Edit Department",
                      icon: Edit,
                      onClick: () => handleEdit(selectedDepartmentDetail.id),
                      variant: "default"
                    },
                    {
                      label: t.actions?.manage_budget || "Manage Budget",
                      icon: DollarSign,
                      onClick: () => handleViewBudget(selectedDepartmentDetail.id),
                      variant: "default"
                    },
                    {
                      label: t.actions?.delete_department || "Delete Department",
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
          <DepartmentActivityChart loading={isLoading} departments={departments} />
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
                  {t.detail?.members_table?.title || "Department Members"}
                </CardTitle>
                <CardDescription>
                  {`${t.detail?.members_table?.description || "List of all members in"} ${selectedDepartmentDetail.name}`}
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
                      title: t.common?.status || "Status",
                      options: [
                        { label: t.common?.active || "Active", value: "true" },
                        { label: t.common?.inactive || "Inactive", value: "false" }
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
                  {t.table_title || "Church Departments"}
                </CardTitle>
                <CardDescription>{t.table_description || "Complete list of church departments with management actions"}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={departmentColumns}
                  data={departments}
                  searchKey="name"
                  emptyEntityName={t.entity_name || "Church Departments"}
                  filters={[
                {
                  id: "church_id",
                  title: t.labels?.church || "Church",
                  options: churches.map(church => ({
                    label: church.name,
                    value: church.id
                  }))
                },
                {
                  id: "status",
                  title: t.common?.status || "Status",
                  options: [
                    { label: t.common?.active || "Active", value: "true" },
                    { label: t.common?.inactive || "Inactive", value: "false" }
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>
          </>
        )}
        
        {/* Add Department Modal - CHURCH DEPARTMENT */}
        <AddDepartmentModal
          isOpen={isAddDepartmentModalOpen}
          onOpenChange={setIsAddDepartmentModalOpen}
          institutionId={currentInstitutionData.id}
          churches={churches as any}
          onSave={handleDepartmentSaved}
          departmentType="church"
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
