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
  MapPin,
  Users,
  Church,
  Globe,
  Shield,
  RefreshCw
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
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { UseTable } from "@/components/ui/use-table"
import { InstitutionProfileHeader } from "@/components/shared"
import { ContactViewEditModal } from "@/components/modals/contact"
import { EditInstitutionModal, DeleteInstitutionModal, RegisterInstitutionModal } from "@/components/modals/institution"
import { DepartmentActivityChart, UsersByRoleChart, ChurchesByRegionChart } from "@/components/institutions/charts"

import { Institutions_institutions } from "@/types/Institutions"
import { useInstitution } from "@/contexts/institution-context"
import { useInstitutionKPI } from "@/hooks/KPI/use-institution-kpi"
import InstitutionsLoading from "./loading"
import { Contact, PermissionResolverName } from "@/types/graphql-global-types"
import { WithPermission } from "@/hocs/with-permission"
import { AccessDenied } from "@/components/access/access-denied"

// Additional imports for tabs


export default function InstitutionsPage() {
  const { t } = useTranslation()
  const { institutions: institutionsData, currentInstitutionData, loading: isLoading, updateInstitutionContact, refetchInstitutionById} = useInstitution();
  const institutionKPIs = useInstitutionKPI();

  // State
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false)
  const [editInstitutionId, setEditInstitutionId] = useState<string | null>(null)
  const [isDeleteInstitutionModalOpen, setIsDeleteInstitutionModalOpen] = useState(false)
  const [deleteInstitutionId, setDeleteInstitutionId] = useState<string | null>(null)
  


  const breadcrumbs = useMemo(() => [
    { name: "Structure & Organization" },
    { name: "Institutions" }
  ], [])

  // Dados para KPI Cards Carrossel
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_regions",
      title: "Total Regions",
      value: institutionKPIs.totalRegions,
      icon: MapPin,
      subtitle: "Geographic regions",
      trend: undefined
    },
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
        // const city = row.original.contact?.city //TODO: usar cidade se disponível
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{country}</div>
              {/* <div className="text-xs text-muted-foreground">{city}</div> */}
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
      id: "status",
      accessorKey: "is_deleted",
      header: "Status",
      cell: ({ row }) => {
        const isActive = !row.original.is_deleted
        return (
          <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500 hover:bg-green-600" : ""}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        // Convert string to boolean for filtering
        if (value === "all") return true
        const isActive = !row.original.is_deleted
        return value === "true" ? isActive : !isActive
      },
    },
    // {
    //   id: "members",
    //   accessorKey: "members_count",
    //   header: t('institutions.table.members'),
    //   cell: ({ row }) => (
    //     <span className="font-medium">
    //       {row.original.members_count.toLocaleString()} //TODO: add members_count
    //     </span>
    //   ),
    // },
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
      title: "Language",
      options: [
        { label: "English", value: "en" },
        { label: "Nederlands", value: "nl" },
        { label: "Português", value: "pt" },
      ]
    },
    {
      id: "status",
      title: "Status",
      options: [
        { label: "Active", value: "true" },
        { label: "Inactive", value: "false" },
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
            onManageRegions={() => {}}
            onManageChurches={() => {}}
            onManageDepartments={() => {}}
          />
        )}

        {/* KPI Cards Carousel */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          minCardsForCarousel={4}
          showCarousel={true}
        />

        <Separator />

        {/* Charts Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Institution Analytics</h3>
          <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
            <DepartmentActivityChart loading={isLoading} />
            
            <UsersByRoleChart loading={isLoading} />
            
            <ChurchesByRegionChart 
              regions={currentInstitutionData?.regions || undefined}
              churches={currentInstitutionData?.churches || undefined}
              loading={isLoading}
            />
          </ResponsiveGridCarousel>
        </div>

        <Separator />

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
            <UseTable
              columns={columns}
              data={institutionsData}
              filters={filterableColumns}
              searchKey="name"
            />
          </CardContent>
        </Card>

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