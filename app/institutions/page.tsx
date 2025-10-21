"use client"

import React, { useState, useMemo } from "react"
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
  Settings,
  RefreshCw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Components
import { InstitutionsCharts } from "@/components/institutions/institutions-charts"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { DataTable } from "@/components/ui/data-table"
import { InstitutionProfileHeader } from "@/components/shared"
import { ContactViewEditModal } from "@/components/modals/contact"
import { EditInstitutionModal, DeleteInstitutionModal, RegisterInstitutionModal } from "@/components/modals/institution"

import { Institutions_institutions } from "@/types/Institutions"
import { useInstitution } from "@/contexts/institution-context"
import { useInstitutionKPI } from "@/hooks/KPI/use-institution-kpi"
import { InstitutionById_institution_departments, InstitutionById_institution_subsidy_requests } from "@/types/InstitutionById"
import InstitutionsLoading from "./loading"
import { Contact, PermissionResolverName } from "@/types/graphql-global-types"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"

// Funding Rules Component
import { FundingRulesManager } from "@/components/funding-rules/funding-rules-manager"

// Funding Rules Tab Component has been moved to /components/funding-rules/funding-rules-manager.tsx

export default function InstitutionsPage() {
  const { t } = useTranslation()
  const { institutions: institutionsData, currentInstitutionData, loading: isLoading, updateInstitutionContact, refetchInstitutionById} = useInstitution();
  const institutionKPIs = useInstitutionKPI();

  // Tab state
  const [activeTab, setActiveTab] = useState("overview")
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false)
  const [editInstitutionId, setEditInstitutionId] = useState<string | null>(null)
  const [isDeleteInstitutionModalOpen, setIsDeleteInstitutionModalOpen] = useState(false)
  const [deleteInstitutionId, setDeleteInstitutionId] = useState<string | null>(null)
  
  // Data states
  // const [institutionsData, setInstitutionsData] = useState<InstitutionWithDetails[]>([])

  // Geração dos dados dos gráficos a partir da currentInstitutionData
  const chartData = useMemo(() => {
    if (!currentInstitutionData) {
      return {
        churchesByRegion: [],
        usersByRole: [],
        subsidyOverTime: [],
        monthlySubsidies: []
      }
    }

    // Churches by Region
    // Supondo que cada departamento tem um campo church_id e region (não temos region, então agrupamos por church_id)
    const churchesByRegion: Array<{ region: string, churches: number, members: number }> = [];
    // Se existisse region, poderíamos agrupar por ela. Aqui apenas um exemplo fictício:
    // Agrupamento fictício por church_id
    if (currentInstitutionData.departments) {
      const regionMap: Record<string, { churches: number, members: number }> = {};
      currentInstitutionData.departments.forEach((dep: InstitutionById_institution_departments) => {
        const region = dep.church_id || '';
        if (!regionMap[region]) regionMap[region] = { churches: 0, members: 0 };
        regionMap[region].churches += 1;
        // Não temos members, então deixamos 0
      });
      for (const region in regionMap) {
        churchesByRegion.push({ region, ...regionMap[region] });
      }
    }

    // Users by Role
    // Não temos roles, então agrupamos todos como "User"
    const usersByRole = [
      {
        name: 'User',
        value: currentInstitutionData.users?.length || 0,
        color: '#f59e0b',
      }
    ];

    // Subsidy Over Time
    // Agrupar subsidy_requests por mês
    const subsidyOverTimeMap: Record<string, { requests: number, amount: number }> = {};
    if (currentInstitutionData.subsidy_requests) {
      currentInstitutionData.subsidy_requests.forEach((req: InstitutionById_institution_subsidy_requests) => {
        const date = new Date(req.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!subsidyOverTimeMap[month]) subsidyOverTimeMap[month] = { requests: 0, amount: 0 };
        subsidyOverTimeMap[month].requests += 1;
        subsidyOverTimeMap[month].amount += Number(req.total_budget) || 0;
      });
    }
    const subsidyOverTime = Object.entries(subsidyOverTimeMap).map(([month, data]) => ({ month, ...data }));

    // Monthly Subsidies (por status)
    // Supondo que subsidy_statuses_id: 'approved', 'pending', 'under_review'
    const monthlySubsidiesMap: Record<string, { approved: number, pending: number, under_review: number }> = {};
    if (currentInstitutionData.subsidy_requests) {
      currentInstitutionData.subsidy_requests.forEach((req: InstitutionById_institution_subsidy_requests) => {
        const date = new Date(req.created_at);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlySubsidiesMap[month]) monthlySubsidiesMap[month] = { approved: 0, pending: 0, under_review: 0 };
        if (req.subsidy_statuses_id === 'approved') monthlySubsidiesMap[month].approved += 1;
        else if (req.subsidy_statuses_id === 'pending') monthlySubsidiesMap[month].pending += 1;
        else monthlySubsidiesMap[month].under_review += 1;
      });
    }
    const monthlySubsidies = Object.entries(monthlySubsidiesMap).map(([month, data]) => ({ month, ...data }));

    return {
      churchesByRegion,
      usersByRole,
      subsidyOverTime,
      monthlySubsidies,
    }
  }, [currentInstitutionData]);

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_churches",
      title: "Total Churches",
      value: institutionKPIs.totalChurches,
      icon: Church,
      subtitle: "Active churches",
      trend: undefined
    },
    {
      id: "total_departments",
      title: "Total Departments",
      value: institutionKPIs.totalDepartments,
      icon: Shield,
      subtitle: "Departments",
      trend: undefined
    },
    {
      id: "total_users",
      title: "Total Users",
      value: institutionKPIs.totalUsers,
      icon: Users,
      subtitle: "Registered users",
      trend: undefined
    },
  ], [institutionKPIs])

  usePageTitle({
    title: "Institutions Management"
  })

  // Refresh handler
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("Refreshing data...")
    
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

  const handleInstitutionCreated = (data: any) => {
    toast.success(t('institutions.toasts.created'))
  }

  const handleEditInstitution = () => {
    if (currentInstitutionData) {
      setIsEditInstitutionModalOpen(true)
    }
  }

  const handleDeleteInstitution = () => {
    if (currentInstitutionData) {
      setIsDeleteInstitutionModalOpen(true)
    }
  }

  const handleViewInstitutionContact = () => {
    if (currentInstitutionData) {
      // Sempre abrir o modal de contato, mesmo se não houver dados existentes
      // O modal permite criar novos dados de contato se não existirem
      setIsContactModalOpen(true)
    } else {
      toast.error('Nenhuma instituição selecionada')
    }
  }

  const handleContactSaved = (contactData: any) => {
    refetchInstitutionById()
    toast.success(t('contacts.toasts.updated'))
  }

  const handleInstitutionSaved = (institutionData: any) => {
    toast.success(t('institutions.toasts.updated'))
  }

  const handleInstitutionDeleted = (institutionData: any) => {
    toast.success(t('institutions.toasts.deactivated'))
  }

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
        const langLabel = lang === "en" ? "English" : lang === "nl" ? "Nederlands" : lang
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
      header: t('institutions.table.churches'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Church className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.churches_count}</span>
        </div>
      ),
    },
    {
      id: "users",
      accessorKey: "users_count",
      header: t('institutions.table.users'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.users_count}</span>
        </div>
      ),
    },
    {
      id: "actions",
      header: t('institutions.table.actions'),
      cell: ({ row }) => {
        const institution = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  // Exemplo: abrir modal de detalhes
                  toast.success(t('institutions.toasts.institution_details_loaded'));
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
      title: t('institutions.filters.language'),
      options: [
        { label: "English", value: "en" },
        { label: "Nederlands", value: "nl" },
        { label: "Português", value: "pt" },
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

  if (!currentInstitutionData) {
    return <InstitutionsLoading />
  }

  return (
    <AppLayout>
      <WithPermission requiredPermissions={[PermissionResolverName.Institutions]} fallback={<AccessDenied/>}>
      
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">
              Institution Overview
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              Complete management interface for institutional structure
            </p>
            {currentInstitutionData && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Building className="w-3 h-3 mr-1" />
                  {currentInstitutionData.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {currentInstitutionData.denomination}
                </Badge>
              </div>
            )}
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
                New Institution
              </Button>
            </RegisterInstitutionModal>
          </div>
        </div>

        {/* Institution Profile Header */}
        {currentInstitutionData && (
          <InstitutionProfileHeader
            institution={currentInstitutionData}
            onEdit={handleEditInstitution}
            onDelete={handleDeleteInstitution}
            onViewContact={handleViewInstitutionContact}
            onManageChurches={() => setActiveTab('churches')}
            onManageDepartments={() => setActiveTab('departments')}
          />
        )}

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="funding-rules" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Funding Rules
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* KPI Cards Carrossel */}
            <KPICards 
              data={kpiCardsData}
              isLoading={isLoading}
              minCardsForCarousel={4}
              showCarousel={true}
            />

            <Separator />

            {/* Charts Section */}
            <InstitutionsCharts
              churchesByRegionData={chartData.churchesByRegion}
              usersByRoleData={chartData.usersByRole}
              subsidyOverTimeData={chartData.subsidyOverTime}
              monthlySubsidiesData={chartData.monthlySubsidies}
              loading={isLoading}
              institutionName={currentInstitutionData?.name}
            />

            {/* Institutions Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Institutions List
                </CardTitle>
                <CardDescription>Complete list of institutions with management actions</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <DataTable
                  columns={columns}
                  data={institutionsData}
                  searchKey="name"
                  searchPlaceholder="Search institutions..."
                  filterableColumns={filterableColumns}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funding Rules Tab */}
          <TabsContent value="funding-rules" className="space-y-6">
            <FundingRulesManager 
              context="institution"
              entityId={currentInstitutionData?.id}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              title="Institution Funding Rules"
              description="Manage funding rules and groups for this institution's subsidy requests"
              showCharts={true}
              showKPICards={true}
            />
          </TabsContent>
        </Tabs>

        {/* Contact Modal */}
        {currentInstitutionData && (
          <ContactViewEditModal
            isOpen={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
            contact={(currentInstitutionData.contact || null) as Contact | null}
            entityName={currentInstitutionData.name || 'Institution'}
            entityType="Institution"
            onSave={handleContactSaved}
            entityId={currentInstitutionData.id}
            updateMutation={updateInstitutionContact}
          />
        )}

        {/* Edit Institution Modal */}
        <EditInstitutionModal
          isOpen={isEditInstitutionModalOpen}
          onOpenChange={(open) => {
            setIsEditInstitutionModalOpen(open);
            if (!open) setEditInstitutionId(null);
          }}
          institution={
            (institutionsData.find(i => i.id === (editInstitutionId || currentInstitutionData?.id)) || null) as any
          }
          onSave={handleInstitutionSaved}
        />

        {/* Delete Institution Modal */}
        <DeleteInstitutionModal
          isOpen={isDeleteInstitutionModalOpen}
          onOpenChangeAction={(open) => {
            setIsDeleteInstitutionModalOpen(open);
            if (!open) setDeleteInstitutionId(null);
          }}
          institution={
            (institutionsData.find(i => i.id === (deleteInstitutionId || currentInstitutionData?.id)) || null) as any
          }
          onSuccess={handleInstitutionDeleted}
        />
      </div>
      </WithPermission>
    </AppLayout>
  )
}