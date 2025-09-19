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
  Building, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  Church,
  Globe,
  Mail,
  Phone,
  Layers,
  Home,
  DollarSign,
  TrendingUp,
  Shield,
  Calendar
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Components
import { InstitutionsKPI } from "@/components/institutions/institutions-kpi"
import { InstitutionsCharts } from "@/components/institutions/institutions-charts"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { DataTable } from "@/components/ui/data-table"
import { InstitutionModal } from "@/components/modals/institution-modal"
import { InstitutionProfileHeader } from "@/components/shared"
import { ViewContactModal, ContactData } from "@/components/modals/contact"
import { EditInstitutionModal, DeleteInstitutionModal } from "@/components/modals/institution"

// Data
import {
  getInstitutionData,
  getInstitutionKPIs,
  getChurchesByRegionData,
  getUsersByRoleData,
  getSubsidyRequestsOverTime,
  getMonthlySubsidyData,
} from "@/data/institutionsData"

// Types
interface InstitutionWithDetails {
  id: string
  name: string
  denomination: string
  language_preference: string
  contact_id: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  contact?: {
    name?: string
    country: string
    city: string
    email: string
    phone: string
    mobile?: string
    address?: string
    full_address?: string
    postal_code?: string
    website?: string
    notes?: string
  }
  regions_count: number
  churches_count: number
  users_count: number
  members_count: number
  total_subsidy_budget: number
  annual_department_budget: number
  pending_subsidies: number
}

/**
 * PÁGINA DE GESTÃO DE INSTITUIÇÕES
 * Interface dedicada para gerenciar instituições religiosas
 */
export default function InstitutionsPage() {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all")
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false)
  const [isDeleteInstitutionModalOpen, setIsDeleteInstitutionModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
  
  // Data states
  const [institutionsData, setInstitutionsData] = useState<InstitutionWithDetails[]>([])
  const [kpiData, setKpiData] = useState<any>(null)
  const [chartData, setChartData] = useState<any>({
    churchesByRegion: [],
    usersByRole: [],
    subsidyOverTime: [],
    monthlySubsidies: []
  })
  
  // Get current active institution
  const activeInstitution = useMemo(() => {
    if (selectedInstitution === "all" || institutionsData.length === 0) {
      return institutionsData[0] || null
    }
    return institutionsData.find(inst => inst.id === selectedInstitution) || institutionsData[0] || null
  }, [selectedInstitution, institutionsData])

  const breadcrumbs = useMemo(() => [
    { name: "Structure & Organization" },
    { name: "Institutions" }
  ], [])

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => {
    if (!kpiData) return []
    
    return [
      {
        id: "total_institutions",
        title: "Total Institutions",
        value: kpiData.totalInstitutions || 0,
        icon: Building,
        subtitle: "Active institutions",
        trend: {
          value: 8,
          isPositive: true,
          label: "vs. last month"
        }
      },
      {
        id: "total_regions",
        title: "Total Regions",
        value: kpiData.totalRegions || 0,
        icon: MapPin,
        subtitle: "Geographic regions",
        trend: {
          value: 12,
          isPositive: true,
          label: "vs. last month"
        }
      },
      {
        id: "total_churches",
        title: "Total Churches",
        value: kpiData.totalChurches || 0,
        icon: Church,
        subtitle: "Active churches",
        trend: {
          value: 15,
          isPositive: true,
          label: "vs. last month"
        }
      },
      {
        id: "total_users",
        title: "Total Users",
        value: kpiData.totalUsers || 0,
        icon: Users,
        subtitle: "Registered users",
        trend: {
          value: 22,
          isPositive: true,
          label: "vs. last month"
        }
      },
      {
        id: "total_members",
        title: "Total Members",
        value: `${((kpiData.totalMembers || 0) / 1000).toFixed(1)}K`,
        icon: Users,
        subtitle: "Church members",
        trend: {
          value: 5,
          isPositive: true,
          label: "vs. last month"
        }
      },
      {
        id: "subsidy_budget",
        title: "Subsidy Budget",
        value: `$${((kpiData.totalSubsidyBudget || 0) / 1000).toFixed(0)}K`,
        icon: DollarSign,
        subtitle: "Total subsidy budget",
        trend: {
          value: 18,
          isPositive: true,
          label: "vs. last year"
        }
      },
      {
        id: "department_budget",
        title: "Department Budget",
        value: `$${((kpiData.totalDepartmentBudget || 0) / 1000).toFixed(0)}K`,
        icon: Shield,
        subtitle: "Department budgets",
        trend: {
          value: 10,
          isPositive: true,
          label: "vs. last year"
        }
      },
      {
        id: "pending_subsidies",
        title: "Pending Subsidies",
        value: kpiData.pendingSubsidies || 0,
        icon: Calendar,
        subtitle: "Awaiting approval",
        trend: {
          value: 3,
          isPositive: false,
          label: "vs. last month"
        }
      }
    ]
  }, [kpiData])

  usePageTitle({
    title: "Institutions Management",
    breadcrumbs
  })

  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(t('institutions.toasts.loaded'))
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const institutionsList = getInstitutionData()
        setInstitutionsData(institutionsList)
        updateDataForInstitution("all")
        
        toast.dismiss(loadingToast)
        toast.success(t('institutions.toasts.loaded'), { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t('institutions.toasts.error_loading'))
        setIsLoading(false)
      }
    }

    loadData()
  }, [t])

  /**
   * Atualizar dados quando filtro de instituição muda
   */
  const updateDataForInstitution = (institutionId: string) => {
    const targetId = institutionId === "all" ? undefined : institutionId
    
    const kpis = getInstitutionKPIs(targetId)
    setKpiData(kpis)
    
    const churchesByRegion = getChurchesByRegionData(targetId)
    const usersByRole = getUsersByRoleData(targetId)
    const subsidyOverTime = getSubsidyRequestsOverTime(targetId)
    const monthlySubsidies = getMonthlySubsidyData(targetId)
    
    setChartData({
      churchesByRegion,
      usersByRole,
      subsidyOverTime,
      monthlySubsidies
    })
  }

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("🔄 Refreshing data...")
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const institutionsList = getInstitutionData()
      setInstitutionsData(institutionsList)
      updateDataForInstitution(selectedInstitution)
      
      toast.dismiss(refreshToast)
      toast.success("✅ Data refreshed successfully!", { duration: 2000 })
      
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error("❌ Failed to refresh data")
    } finally {
      setRefreshing(false)
    }
  }

  const handleInstitutionCreated = (data: any) => {
    handleRefresh()
  }

  const handleEditInstitution = () => {
    if (activeInstitution) {
      setIsEditInstitutionModalOpen(true)
    }
  }

  const handleDeleteInstitution = () => {
    if (activeInstitution) {
      setIsDeleteInstitutionModalOpen(true)
    }
  }

  const handleViewInstitutionContact = () => {
    if (activeInstitution && activeInstitution.contact) {
      const contactData: ContactData = {
        id: activeInstitution.contact_id || '',
        name: activeInstitution.contact?.name || null,
        phone: activeInstitution.contact?.phone || null,
        mobile: activeInstitution.contact?.mobile || null,
        email: activeInstitution.contact?.email || null,
        country: activeInstitution.contact?.country || null,
        city: activeInstitution.contact?.city || null,
        address: activeInstitution.contact?.address || null,
        full_address: activeInstitution.contact?.full_address || null,
        postal_code: activeInstitution.contact?.postal_code || null,
        website: activeInstitution.contact?.website || null,
        notes: activeInstitution.contact?.notes || null,
        is_primary: true,
        created_at: activeInstitution.created_at,
        updated_at: activeInstitution.updated_at,
        created_by: activeInstitution.created_by || '',
        updated_by: activeInstitution.updated_by || '',
        is_deleted: false,
        deleted_at: null,
        deleted_by: null
      }
      setSelectedContact(contactData)
      setIsContactModalOpen(true)
    }
  }

  const handleContactSaved = (contactData: any) => {
    toast.success(t('contacts.toasts.updated'))
    handleRefresh()
  }

  const handleInstitutionSaved = (institutionData: any) => {
    toast.success(t('institutions.toasts.updated'))
    handleRefresh()
  }

  const handleInstitutionDeleted = (institutionData: any) => {
    toast.success(t('institutions.toasts.deactivated'))
    handleRefresh()
  }

  // Colunas da tabela
  const columns: ColumnDef<InstitutionWithDetails>[] = [
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
        const city = row.original.contact?.city
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{country}</div>
              <div className="text-xs text-muted-foreground">{city}</div>
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
      id: "regions",
      accessorKey: "regions_count",
      header: t('institutions.table.regions'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.regions_count}</span>
        </div>
      ),
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
      id: "members",
      accessorKey: "members_count",
      header: t('institutions.table.members'),
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.members_count.toLocaleString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: t('institutions.table.actions'),
      cell: ({ row }) => {
        const institution = row.original
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
                  toast.success(t('institutions.toasts.institution_details_loaded'))
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('actions.view_details')}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
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

  const selectedInstitutionName = selectedInstitution === "all" 
    ? undefined 
    : institutionsData.find(i => i.id === selectedInstitution)?.name

  return (
    <AppLayout>
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground mb-2">
              Institutions Management
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              Manage religious institutions and their organizational structure
            </p>
            {activeInstitution && selectedInstitution !== "all" && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  <Building className="w-3 h-3 mr-1" />
                  Viewing: {activeInstitution.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {activeInstitution.denomination}
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <InstitutionModal onSuccess={handleInstitutionCreated}>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {t('actions.create_institution')}
              </Button>
            </InstitutionModal>
            
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

        {/* Institution Profile Header */}
        {activeInstitution && (
          <InstitutionProfileHeader
            institution={activeInstitution}
            onEdit={handleEditInstitution}
            onDelete={handleDeleteInstitution}
            onViewContact={handleViewInstitutionContact}
            onManageRegions={() => window.location.href = '/regions'}
            onManageChurches={() => window.location.href = '/churches'}
            onManageDepartments={() => window.location.href = '/departments'}
          />
        )}

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
          institutionName={selectedInstitutionName}
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

        {/* Contact Modal */}
        {selectedContact && (
          <ViewContactModal
            isOpen={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
            contact={selectedContact}
            entityName={activeInstitution?.name}
            entityType="Institution"
          />
        )}

        {/* Edit Institution Modal */}
        {activeInstitution && (
          <EditInstitutionModal
            isOpen={isEditInstitutionModalOpen}
            onOpenChange={setIsEditInstitutionModalOpen}
            institution={{
              id: activeInstitution.id,
              name: activeInstitution.name,
              denomination: activeInstitution.denomination,
              language_preference: activeInstitution.language_preference as "en" | "nl",
              contact_id: activeInstitution.contact_id,
              created_at: activeInstitution.created_at,
              updated_at: activeInstitution.updated_at,
              created_by: activeInstitution.created_by || '',
              updated_by: activeInstitution.updated_by || '',
              is_deleted: activeInstitution.is_deleted || false,
              deleted_at: null,
              deleted_by: null
            }}
            onSave={handleInstitutionSaved}
          />
        )}

        {/* Delete Institution Modal */}
        {activeInstitution && (
          <DeleteInstitutionModal
            isOpen={isDeleteInstitutionModalOpen}
            onOpenChange={setIsDeleteInstitutionModalOpen}
            institution={{
              id: activeInstitution.id,
              name: activeInstitution.name,
              denomination: activeInstitution.denomination,
              language_preference: activeInstitution.language_preference as "en" | "nl",
              contact_id: activeInstitution.contact_id,
              created_at: activeInstitution.created_at,
              updated_at: activeInstitution.updated_at,
              created_by: activeInstitution.created_by || '',
              updated_by: activeInstitution.updated_by || '',
              is_deleted: activeInstitution.is_deleted || false,
              deleted_at: null,
              deleted_by: null,
              regions_count: activeInstitution.regions_count,
              churches_count: activeInstitution.churches_count,
              users_count: activeInstitution.users_count,
              members_count: activeInstitution.members_count,
              departments_count: 0
            }}
            onSuccess={handleInstitutionDeleted}
          />
        )}
      </div>
    </AppLayout>
  )
}