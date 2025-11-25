"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
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
import { departmentTranslations } from "@/lib/translations/departments"


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
  
  // Obter traduções para o idioma atual - EXATAMENTE COMO EM CHURCHES
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en


  
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

  usePageTitle({
    title: t.title
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
      title: t.title || "Institutional Departments",
      value: kpiData.totalDepartments,
      icon: Layers,
      subtitle: t.subtitle || "Manage departments across institutions",
      trend: {
        value: 0,
        isPositive: true,
        label: t.common?.trend?.vs_previous_month || "vs. previous month"
      }
    },
    {
      id: "annual_budget",
      title: t.common?.annual_budget || "Annual Budget",
      value: `$${(kpiData.totalAnnualBudget / 1000).toFixed(0)}K`,
      icon: DollarSign,
      subtitle: t.fields?.annual_budget || "Total annual budget",
      trend: {
        value: 0,
        isPositive: true,
        label: t.common?.trend?.vs_previous_year || "vs. previous year"
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
  }, [t])

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

  const handleDepartmentSaved = (department: CreateDepartment) => {
    toast.success(t.messages?.created_success || "Department created successfully")
    handleRefresh()
  }
  
  const handleDepartmentUpdated = (department: DepartmentData) => {
    toast.success(t.messages?.updated_success || "Department updated successfully")
    handleRefresh()
  }
  
  const handleDepartmentDeleted = (department: DepartmentData) => {
    toast.success(t.messages?.deleted_success || "Department deleted successfully")
    handleRefresh()
  }

  if (!currentInstitutionData) return <NotFound />
  
  // Colunas da tabela de departamentos
  const departmentColumns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t.common?.name || "Name",
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
          {t.churches?.church || "Church"}
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
          {t.common?.members || "Members"}
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
          {t.annual_budget?.table?.headers?.budget_total || "Budget Total"}
        </div>
      ),
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const hasBudget = annual_budget && annual_budget.planned_budget > 0
        return (
          <div className={`text-center ${!hasBudget ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-gray-900">
              ${annual_budget?.planned_budget?.toLocaleString() || '0'}
            </div>
          </div>
        )
      },
    },
    {
      id: "spent_amount",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.annual_budget?.table?.headers?.spent_amount || "Spent Amount"}
        </div>
      ),
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const spentAmount = annual_budget?.total_expenses || 0
        const hasBudget = annual_budget && annual_budget.planned_budget > 0
        
        return (
          <div className={`text-center ${!hasBudget ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-gray-900">
              ${spentAmount.toLocaleString()}
            </div>
          </div>
        )
      },
    },
    {
      id: "usage_percentage",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t.annual_budget?.table?.headers?.usage_percentage || "Usage %"}
        </div>
      ),
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const totalBudget = annual_budget?.planned_budget || 0
        const usedBudget = annual_budget?.total_expenses || 0
        const usagePercentage = totalBudget > 0 ? Math.round((usedBudget / totalBudget) * 100) : 0
        const hasBudget = annual_budget && annual_budget.planned_budget > 0
        
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
          {t.institutions?.table?.budget_status || "Budget Status"}
        </div>
      ),
      cell: ({ row }) => {
        const annual_budget = row.original.annual_budget
        const hasBudget = annual_budget && annual_budget.planned_budget > 0
        
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={hasBudget ? t.annual_budget?.table?.budget_status_labels?.completed : t.annual_budget?.table?.budget_status_labels?.missing}
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
        const annual_budget = row.original.annual_budget
        const hasBudget = annual_budget && annual_budget.planned_budget > 0
        return hasBudget === value
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
              label={isActive ? (t.common?.active || "Active") : (t.common?.inactive || "Inactive")}
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
        const genderLabel = user.gender ? (t.users?.gender as any)?.[user.gender] : 'N/A';
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
              label={isActive ? (t.users?.table?.active || "Active") : (t.users?.table?.inactive || "Inactive")}
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
        {/* Breadcrumbs Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleBackToList();
                }}
                className={viewMode === 'list' ? 'font-semibold' : 'cursor-pointer hover:text-foreground'}
              >
                {t.breadcrumb?.all_departments || "See All Departments"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {viewMode === 'detail' && selectedDepartmentDetail && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold">
                    {selectedDepartmentDetail.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              {viewMode === 'detail' && selectedDepartmentDetail 
                ? `${selectedDepartmentDetail.name} - ${t.detail?.title_suffix || "Details"}`
                : t.title || "Institutional Departments"
              }
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {viewMode === 'detail' && selectedDepartmentDetail
                ? selectedDepartmentDetail.description || (t.detail?.no_description || "Department details and members")
                : t.subtitle || "Manage departments across institutions"
              }
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {viewMode === 'list' && (
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {t.create_department || "Create Department"}
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
              const latestBudget = selectedDepartmentDetail.annual_budgets?.[0];
              const plannedBudget = latestBudget?.planned_budget || 0;
              const totalExpenses = latestBudget?.total_expenses || 0;
              const usagePercentage = plannedBudget > 0 ? Math.round((totalExpenses / plannedBudget) * 100) : 0;
              
              const detailKPIData: KPICardData[] = [
                {
                  id: "budget_total",
                  title: t.kpi?.budget_total?.title || "Budget Total",
                  value: `$${plannedBudget.toLocaleString()}`,
                  icon: DollarSign,
                  subtitle: t.kpi?.budget_total?.subtitle || "Total planned budget",
                },
                {
                  id: "spent_amount",
                  title: t.kpi?.spent_amount?.title || "Spent Amount",
                  value: `$${totalExpenses.toLocaleString()}`,
                  icon: TrendingUp,
                  subtitle: t.kpi?.spent_amount?.subtitle || "Total expenses",
                },
                {
                  id: "members",
                  title: t.kpi?.members?.title || "Members",
                  value: selectedDepartmentDetail.users?.length || 0,
                  icon: Users,
                  subtitle: t.kpi?.members?.subtitle || "Department members",
                }
              ];
              
              const customFirstCard = (
                <EntityInfoCard
                  headerTitle={t.detail?.info_card?.header_title || "Department Info"}
                  name={selectedDepartmentDetail.name}
                  description={selectedDepartmentDetail.description || (t.detail?.info_card?.no_description || "No description available")}
                  icon={Layers}
                  badges={[
                    {
                      label: churches.find(c => c.id === selectedDepartmentDetail.church_id)?.name || (t.detail?.info_card?.institutional || "Institutional"),
                      variant: "outline",
                      className: "text-xs"
                    },
                    {
                      label: !selectedDepartmentDetail.is_deleted ? (t.detail?.info_card?.active || "Active") : (t.detail?.info_card?.inactive || "Inactive"),
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
          <DepartmentActivityChart loading={isLoading} />
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
                  {t.detail?.members_table?.description || `List of all members in ${selectedDepartmentDetail.name}`}
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
                  {t.table_title || "Departments"}
                </CardTitle>
                <CardDescription>{t.table_description || "Complete list of departments with management actions"}</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden p-0">
                <UseTable
                  columns={departmentColumns}
                  data={departments}
                  searchKey="name"
                  emptyEntityName={t.entity_name || "Departments"}
                  filters={[
                {
                  id: "church",
                  title: t.churches?.church || "Church",
                  options: [
                    { label: t.filters?.institutional || "Institutional", value: "institutional" },
                    ...churches.map(church => ({
                      label: church.name,
                      value: church.id
                    }))
                  ]
                },
                {
                  id: "budget_status",
                  title: t.institutions?.table?.budget_status || "Budget Status",
                  options: [
                    { label: t.annual_budget?.table?.budget_status_labels?.completed, value: "true" },
                    { label: t.annual_budget?.table?.budget_status_labels?.missing, value: "false" }
                  ]
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
