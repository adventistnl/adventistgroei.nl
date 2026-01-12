"use client"

import React, { useState, useMemo, Suspense } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Building, 
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Church,
  Globe,
  Shield,
  RefreshCw,
  Home,
  Layers,
  DollarSign,
  ChevronRight,
  Building2,
  Map
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import "@/lib/i18n"
import { cn } from "@/lib/utils"

// Components - Lazy load heavy components
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { GridContainer } from "@/components/shared/grid-container"
import { UseTable } from "@/components/ui/use-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { EntityInfoCard, EntityInfoCardAction } from "@/components/shared/entity-info-card"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserStructureGrowthChart, UsersByStructureOverviewChart } from "@/components/charts/dashboard"
import { HierarchicalStructureCard } from "@/components/charts/dashboard/hierarchical-structure-card"
import { allUsers, allInstitutions, allDepartments, allRegions, allChurches } from "@/data/usersData"

// Lazy load modals
const ContactViewEditModal = React.lazy(() => import("@/components/modals/contact").then(module => ({ default: module.ContactViewEditModal })))
const EditInstitutionModal = React.lazy(() => import("@/components/modals/institution").then(module => ({ default: module.EditInstitutionModal })))
const DeleteInstitutionModal = React.lazy(() => import("@/components/modals/institution").then(module => ({ default: module.DeleteInstitutionModal })))
const RegisterInstitutionModal = React.lazy(() => import("@/components/modals/institution").then(module => ({ default: module.RegisterInstitutionModal })))

// Lazy load charts
const DepartmentActivityChart = React.lazy(() => import("@/components/institutions/charts").then(module => ({ default: module.DepartmentActivityChart })))
const UsersByRoleChart = React.lazy(() => import("@/components/institutions/charts").then(module => ({ default: module.UsersByRoleChart })))
const ChurchesByRegionChart = React.lazy(() => import("@/components/institutions/charts").then(module => ({ default: module.ChurchesByRegionChart })))

import { Institutions_institutions } from "@/types/Institutions"
import { useInstitution } from "@/contexts/institution-context"
import { useInstitutionKPI } from "@/hooks/KPI/use-institution-kpi"
import InstitutionsLoading from "./loading"
import { Contact, PermissionResolverName } from "@/types/graphql-global-types"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Additional imports for tabs


export default function InstitutionsPage() {
  const { t } = useTranslation()
  const { institutions: institutionsData, currentInstitutionData, loading: isLoading, updateInstitutionContact, refetchInstitutionById} = useInstitution();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)

  // State
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'overview' | 'detail'>('overview')
  
  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false)
  const [editInstitutionId, setEditInstitutionId] = useState<string | null>(null)
  const [isDeleteInstitutionModalOpen, setIsDeleteInstitutionModalOpen] = useState(false)
  const [deleteInstitutionId, setDeleteInstitutionId] = useState<string | null>(null)

  // Computed state - institution being displayed
  const displayedInstitution = useMemo(() => {
    if (selectedInstitutionId) {
      return institutionsData.find(inst => inst.id === selectedInstitutionId) || null
    }
    return currentInstitutionData
  }, [selectedInstitutionId, institutionsData, currentInstitutionData])
  const institutionKPIs = useInstitutionKPI(displayedInstitution);

  // Initialize selectedInstitutionId with currentInstitutionData.id when available
  React.useEffect(() => {
    if (currentInstitutionData && !selectedInstitutionId) {
      setSelectedInstitutionId(currentInstitutionData.id)
    }
  }, [currentInstitutionData, selectedInstitutionId])

  // Sync selectedInstitutionId with currentInstitutionData changes (from global switcher) - only in overview mode
  React.useEffect(() => {
    if (viewMode === 'overview' && currentInstitutionData && currentInstitutionData.id !== selectedInstitutionId) {
      setSelectedInstitutionId(currentInstitutionData.id)
    }
  }, [currentInstitutionData?.id, selectedInstitutionId, viewMode])

  // Function to handle institution selection
  const handleViewInstitutionDetails = (institutionId: string) => {
    setSelectedInstitutionId(institutionId)
    setViewMode('detail')
    
    // Scroll to top of the page smoothly
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
    
    toast.success(t('institutions.toasts.institution_details_loaded'))
  }

  // Function to go back to overview
  const handleBackToOverview = () => {
    setViewMode('overview')
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }


  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_churches",
      title: t('institutions.kpis.total_churches'),
      value: institutionKPIs.totalChurches,
      icon: Church,
      subtitle: t('churches.active_churches'),
      trend: undefined
    },
    {
      id: "total_departments",
      title: t('institutions.kpis.total_departments'),
      value: institutionKPIs.totalDepartments,
      icon: Shield,
      subtitle: t('departments.title'),
      trend: undefined
    },
    {
      id: "total_users",
      title: t('institutions.kpis.total_users'),
      value: institutionKPIs.totalUsers,
      icon: Users,
      subtitle: t('users.registered_users'),
      trend: undefined
    },
  ], [institutionKPIs, t])

  const pageTitle = useMemo(() => (
    <span className="flex items-center gap-2">
      {t('common.structure_organization')}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      {t('institutions.title')}
    </span>
  ), [t])

  usePageTitle({
    title: pageTitle,
    showBreadcrumbsInHeader: true
  })

  // Local filter state used by charts/tabs
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [activeTab, setActiveTab] = useState<string>("structure-chart")

  const kpis = React.useMemo(() => {
    const institutionDepartments = allDepartments.filter(d => !d.church_id && !d.is_deleted).length
    const churchDepartments = allDepartments.filter(d => d.church_id && !d.is_deleted).length
    const filteredChurches = allChurches.filter(c => !c.is_deleted)

    return {
      totalInstitutions: allInstitutions.length,
      totalRegions: allRegions.filter(r => !r.is_deleted).length,
      activeChurches: filteredChurches.length,
      totalDepartments: institutionDepartments + churchDepartments,
      institutionDepartments,
      churchDepartments,
      totalUsers: allUsers.filter(u => !u.is_deleted).length
    }
  }, [allInstitutions, allRegions, allChurches, allDepartments, allUsers, selectedYear])

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(t('institutions.toasts.refreshing_data'))
    
    try {
      await refetchInstitutionById()
      toast.success(t('institutions.toasts.data_refreshed'), { duration: 2000 })
    } catch (error) {
      toast.error(t('institutions.toasts.error_refreshing_data'))
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleInstitutionCreated = (data: any) => {
    // Toast já exibido no modal
  }

  const handleEditInstitution = () => {
    if (displayedInstitution) {
      setIsEditInstitutionModalOpen(true)
    }
  }

  const handleDeleteInstitution = () => {
    if (displayedInstitution) {
      setIsDeleteInstitutionModalOpen(true)
    }
  }

  const handleViewInstitutionContact = () => {
    if (displayedInstitution) {
      // Sempre abrir o modal de contato, mesmo se não houver dados existentes
      // O modal permite criar novos dados de contato se não existirem
      setIsContactModalOpen(true)
    } else {
      toast.error(t('institutions.toasts.no_institution_selected'))
    }
  }

  const handleContactSaved = (contactData: any) => {
    refetchInstitutionById()
    toast.success(t('contacts.toasts.updated'))
  }

  const handleInstitutionSaved = (institutionData: any) => {
    // Toast já exibido no modal
  }

  const handleInstitutionDeleted = (institutionData: any) => {
    toast.success(t('institutions.toasts.deactivated'))
  }

  // Ações para o Entity Info Card
  const institutionCardActions: EntityInfoCardAction[] = useMemo(() => [
    {
      label: t('institutions.actions.view_contact_details'),
      icon: Eye,
      onClick: handleViewInstitutionContact,
      showSeparatorAfter: true
    },
    {
      label: t('institutions.actions.manage_churches'),
      icon: Home,
      onClick: () => {}
    },
    {
      label: t('institutions.actions.manage_departments'),
      icon: Layers,
      onClick: () => {}
    },
    {
      label: t('institutions.actions.manage_annual_budgets'),
      icon: DollarSign,
      onClick: () => {},
      showSeparatorAfter: true
    },
    {
      label: t('institutions.actions.edit_institution'),
      icon: Edit,
      onClick: handleEditInstitution
    },
    {
      label: t('institutions.actions.delete_institution'),
      icon: Trash2,
      onClick: handleDeleteInstitution,
      variant: "destructive"
    }
  ], [t, handleViewInstitutionContact, handleEditInstitution, handleDeleteInstitution])

  // Custom First Card com informações da instituição
  const customFirstCard = useMemo(() => {
    if (!displayedInstitution) return null
    
    const isActive = !displayedInstitution.is_deleted
    
    return (
      <EntityInfoCard
        headerTitle={t('institutions.entity_info.header_title')}
        name={displayedInstitution.name}
        description={displayedInstitution.denomination}
        icon={Building}
        actions={institutionCardActions}
        accentColor="gray"
        badges={[
          {
            label: isActive ? t('institutions.entity_info.active') : t('institutions.entity_info.inactive'),
            variant: isActive ? "default" : "secondary",
            className: cn(
              "text-xs",
              isActive 
                ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" 
                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700"
            )
          },
          {
            label: `${t('institutions.entity_info.established')} ${new Date(displayedInstitution.created_at).getFullYear()}`,
            variant: "outline",
            className: "text-xs font-normal"
          },
          {
            label: displayedInstitution.language_preference.toUpperCase(),
            variant: "outline",
            className: "text-xs font-mono"
          }
        ]}
      />
    )
  }, [displayedInstitution, institutionCardActions, t])

  // Colunas da tabela
  const columns: ColumnDef<Institutions_institutions>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t('institutions.table.name'),
      cell: ({ row }) => {
        const institution = row.original
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="font-medium">{institution.name}</div>
              <div className="text-xs text-muted-foreground">
                {institution.denomination}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: "country",
      accessorKey: "contact.country",
      header: t('institutions.table.country'),
      cell: ({ row }) => {
        const country = row.original.contact?.country
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{country}</div>
            </div>
          </div>
        )
      },
    },
    {
      id: "language",
      accessorKey: "language_preference",
      header: t('institutions.table.language'),
      cell: ({ row }) => {
        const lang = row.original.language_preference
        const langLabel = lang === "en" ? t('common.english') : lang === "nl" ? t('common.dutch') : lang
        return (
          <Badge variant="outline">
            {langLabel}
          </Badge>
        )
      },
    },
    {
      id: "churches",
      accessorKey: "churches_count",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.churches')}
        </div>
      ),
      cell: ({ row }) => {
        const count = row.original.churches_count || 0
        return (
          <div className="flex items-center justify-center gap-2">
            <Church className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{count}</span>
          </div>
        )
      },
    },
    {
      id: "users",
      accessorKey: "users_count",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.users')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users_count}</span>
        </div>
      ),
    },
    {
      id: "budget",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.budget')}
        </div>
      ),
      cell: ({ row }) => {
        const institution = row.original;
        const budgetAmount = institution.current_year_budget || 0;
        const hasBudget = budgetAmount > 0;

        return (
          <div className="text-center">
            <div className="text-sm font-semibold">
              {hasBudget ? `$${budgetAmount.toLocaleString()}` : '-'}
            </div>
          </div>
        )
      },
    },
    {
      id: "budget_status",
      header: () => (
        <div className="text-center font-medium">
          {t('institutions.table.budget_status')}
        </div>
      ),
      cell: ({ row }) => {
        const institution = row.original;
        const hasBudget = institution.has_budget_record;

        return (
          <div className="flex justify-center">
            <StatusBadge
              label={hasBudget ? t('annual_budget.table.budget_status_labels.completed') : t('annual_budget.table.budget_status_labels.missing')}
              variant={hasBudget ? "success" : "neutral"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        // For filtering: "completed" = true, "missing" = false
        if (value === undefined || value === null || value === "") {
          return true
        }
        const institution = row.original;
        const hasBudget = institution.has_budget_record;
        return hasBudget === value
      },
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="text-center font-medium">
          {t('common.status')}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={isActive ? t('common.active') : t('common.inactive')}
              variant={isActive ? "success" : "neutral"}
              showDot
            />
          </div>
        )
      },
      filterFn: (row, id, value) => {
        // Convert string to boolean for filtering
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
      },
    },
    {
      id: "actions",
      header: t('institutions.table.actions'),
      cell: ({ row }) => {
        const institution = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-action-button>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  handleViewInstitutionDetails(institution.id)
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('actions.view_details')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditInstitutionId(institution.id);
                  setIsEditInstitutionModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setDeleteInstitutionId(institution.id);
                  setIsDeleteInstitutionModalOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ]

  // Filterable columns for DataTable
  const filterableColumns = [
    {
      id: "language",
      title: t('common.language'),
      options: [
        { label: t('common.english'), value: "en" },
        { label: t('common.dutch'), value: "nl" },
        { label: "Português", value: "pt" },
      ]
    },
    {
      id: "status",
      title: t('common.status'),
      options: [
        { label: t('common.active'), value: "true" },
        { label: t('common.inactive'), value: "false" },
      ]
    },
    {
      id: "budget_status",
      title: t('institutions.table.budget_status'),
      options: [
        { label: t('annual_budget.table.budget_status_labels.completed'), value: "true" },
        { label: t('annual_budget.table.budget_status_labels.missing'), value: "false" },
      ]
    }
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

  if (!displayedInstitution) {
    return <InstitutionsLoading />
  }

  return (
    <AppLayout>
      <WithPermission requiredPermissions={[PermissionResolverName.Institutions]} fallback={<AccessDenied/>}>
      
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden" ref={scrollContainerRef}>
        {/* Breadcrumbs Navigation - Only show in detail view */}
        {viewMode === 'detail' && displayedInstitution && (
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleBackToOverview();
                  }}
                  className="cursor-pointer hover:text-foreground"
                >
                  {t('institutions.breadcrumb.see_all') || "See All Institutions"}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">
                  {displayedInstitution.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">
              {t('institutions.page_header.title')}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {t('institutions.page_header.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <RegisterInstitutionModal onSuccess={handleInstitutionCreated}>
              <Button className="bg-primary hover:bg-primary/80">
                <Plus className="w-4 h-4 mr-2" />
                {t('institutions.page_header.new_institution')}
              </Button>
            </RegisterInstitutionModal>
          </div>
        </div>

        {/* KPI Cards Carousel */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          minCardsForCarousel={3}
          showCarousel={true}
          customFirstCard={customFirstCard}
        />

        <Separator />

        {/* Charts Section */}

           <GridContainer
            items={[
              {
                id: "UserStructureGrowthChart-full-width",
                component: (
                  <UserStructureGrowthChart
                    loading={isLoading}
                    users={allUsers}
                    departments={allDepartments}
                    regions={allRegions}
                    churches={allChurches}
                    selectedYear={selectedYear}
                  />
                ),
                colSpan: "col-span-12 lg:col-span-8",
              },
              {
                id: "structure-tabs-panel",
                component: (
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Tabs - Chart vs Info */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="structure-chart" className="gap-2">
                          <Building2 className="w-4 h-4" />
                          Chart
                        </TabsTrigger>
                        <TabsTrigger value="structure-info" className="gap-2">
                          <Map className="w-4 h-4" />
                          Info
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Content based on active tab */}
                    <div className="flex-1 min-h-0">
                      {activeTab === "structure-chart" ? (
                        <UsersByStructureOverviewChart
                          loading={isLoading}
                          users={allUsers}
                          institutions={allInstitutions}
                          departments={allDepartments}
                          regions={allRegions}
                          churches={allChurches}
                        />
                      ) : (
                        <HierarchicalStructureCard
                          title="Hierarchical Structure"
                          description="The institutional structure follows a clear hierarchy"
                          icon={Map}
                          loading={isLoading}
                          levels={[
                          {
                            title: 'Institution Level',
                            icon: Building2,
                            description: `${kpis.totalInstitutions} institution(s) with ${kpis.institutionDepartments} department(s)`,
                            details: 'Top-level organizational units managing all operations',
                            borderColor: 'border-primary/30',
                            indent: 0
                          },
                          {
                            title: 'Regions',
                            icon: Map,
                            description: `${kpis.totalRegions} region(s) managing ${kpis.activeChurches} churches`,
                            details: 'Geographic divisions containing provinces and churches',
                            borderColor: 'border-blue-500/30',
                            indent: 1
                          },
                          {
                            title: 'Churches',
                            icon: Church,
                            description: `${kpis.activeChurches} active churches with ${kpis.churchDepartments} departments`,
                            details: 'Local congregations with specialized ministry departments',
                            borderColor: 'border-green-500/30',
                            indent: 2
                          }
                        ]}
                        footer={
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <div className="text-xs font-medium mb-1">Hierarchy Flow:</div>
                            <div className="text-xs text-muted-foreground font-mono">
                              Institution → Regions → Provinces → Churches → Departments
                            </div>
                          </div>
                        }
                      />
                    )}
                    </div>
                  </div>
                ),
                colSpan: "col-span-12 lg:col-span-4",
              },
            ]}
            gap="lg"
          />
          <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
            <UsersByRoleChart
              data={displayedInstitution?.institutionChartsData?.usersByRole}
              monthlyUserGrowth={displayedInstitution?.institutionChartsData?.monthlyUserGrowth}
              loading={isLoading}
            />
            <ChurchesByRegionChart
              data={displayedInstitution?.institutionChartsData?.churchesByRegion}
              loading={isLoading}
            />
          </ResponsiveGridCarousel>

        <Separator />

        {/* Institutions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {t('institutions.table_card.title')}
            </CardTitle>
            <CardDescription>{t('institutions.table_card.description')}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <UseTable
              columns={columns}
              data={institutionsData}
              filters={filterableColumns}
              searchKey="name"
            />
          </CardContent>
        </Card>

        {/* Contact Modal */}
        {displayedInstitution && (
          <Suspense fallback={<div>Loading...</div>}>
            <ContactViewEditModal
              isOpen={isContactModalOpen}
              onOpenChange={setIsContactModalOpen}
              contact={(displayedInstitution.contact || null) as Contact | null}
              entityName={displayedInstitution.name || t('institutions.title')}
              entityType={t('institutions.title')}
              onSave={handleContactSaved}
              entityId={displayedInstitution.id}
              updateMutation={updateInstitutionContact}
            />
          </Suspense>
        )}

        {/* Edit Institution Modal */}
        <Suspense fallback={<div>Loading...</div>}>
          <EditInstitutionModal
            isOpen={isEditInstitutionModalOpen}
            onOpenChange={(open) => {
              setIsEditInstitutionModalOpen(open);
              if (!open) setEditInstitutionId(null);
            }}
            institution={
              (institutionsData.find(i => i.id === (editInstitutionId || displayedInstitution?.id)) || null) as any
            }
            onSave={handleInstitutionSaved}
          />
        </Suspense>

        {/* Delete Institution Modal */}
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteInstitutionModal
            isOpen={isDeleteInstitutionModalOpen}
            onOpenChangeAction={(open) => {
              setIsDeleteInstitutionModalOpen(open);
              if (!open) setDeleteInstitutionId(null);
            }}
            institution={
              (institutionsData.find(i => i.id === (deleteInstitutionId || displayedInstitution?.id)) || null) as any
            }
            onSuccess={handleInstitutionDeleted}
          />
        </Suspense>
      </div>
      </WithPermission>
    </AppLayout>
  )
}