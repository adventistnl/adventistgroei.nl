"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { ColorBadge } from "@/components/ui/color-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Plus,
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Trash2,
  Home
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
import { AddRegionModal, EditRegionModal, DeleteRegionModal } from "@/components/modals/region"
import { ContactViewEditModal, ContactData } from "@/components/modals/contact"
import { AnnualBudgetViewEditModal, AnnualBudgetData } from "@/components/modals/annual-budget"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"

import { useRegions } from "@/hooks/use-regions"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"

/**
 * PÁGINA DE GESTÃO DE REGIÕES
 * Interface dedicada para gerenciar regiões baseada no ERD do AdventistGroei
 */
export default function RegionsPage() {
  const { i18n } = useTranslation()
  const { updateRegionContact, regions, refetchRegions } = useRegions();
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedBudget, setSelectedBudget] = useState<AnnualBudgetData | null>(null)
  
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const t = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en

  const breadcrumbs = useMemo(() => [
    { name: "Structure & Organization" },
    { name: "Regions" }
  ], [t])

  usePageTitle({
    title: t.regionsTitle,
    breadcrumbs
  })

  // Estatísticas calculadas dos dados
  type RegionType = any;
  const kpiData = useMemo(() => {
    const totalRegions = regions.length;
    const totalChurches = regions.reduce((sum: number, r: RegionType) => sum + (r.churches?.length || 0), 0);
    
    // Contar sub-regiões (provinces) - regiões que têm parent_region_id
    const totalProvinces = regions.filter((r: RegionType) => r.parent_region_id !== null).length;
    
    return {
      totalRegions,
      totalChurches,
      totalProvinces,
    };
  }, [regions]);

  // Dados dos KPIs em formato de array para o componente reutilizável
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total-regions",
      title: t.totalRegions,
      value: kpiData.totalRegions,
      icon: MapPin,
      subtitle: "Active regions"
    },
    {
      id: "total-churches",
      title: t.totalChurches || "Total Churches",
      value: kpiData.totalChurches,
      icon: Home,
      subtitle: "Churches in all regions"
    },
    {
      id: "total-provinces",
      title: "Total Provinces",
      value: kpiData.totalProvinces,
      icon: MapPin,
      subtitle: "Sub-regions"
    }
  ], [kpiData, t])

  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(t.loading)
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        toast.dismiss(loadingToast)
        toast.success(t.dataRefreshed, { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
      toast.dismiss(loadingToast)
        toast.error(t.error)
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
    const refreshToast = toast.loading(t.refreshing)
    
    try {
      await refetchRegions()
      toast.dismiss(refreshToast)
      toast.success(t.dataRefreshed, { duration: 2000 })
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(t.errorRefreshing)
    } finally {
      setRefreshing(false)
    }
  }

  const handleEdit = (region: any) => {
    if (region) {
      setSelectedRegion(region);
      setIsEditModalOpen(true);
    }
  };
  
  const handleDelete = (id: string, name: string) => {
    const region = regions.find((r: RegionType) => r.id === id);
    if (region) {
      setSelectedRegion(region);
      setIsDeleteModalOpen(true);
    }
  };

  // Modal handlers
  const handleRegionCreated = (newRegion: any) => {
    handleRefresh()
  }

  const handleRegionUpdated = (updatedRegion: any) => {
    toast.success(t.itemUpdated)
    handleRefresh()
  }

  const handleRegionDeleted = (deletedRegion: any) => {
    toast.success(t.itemDeleted)
    handleRefresh()
  }
  
  const handleBudgetSaved = (budget: AnnualBudgetData) => {
    toast.success("Budget updated successfully")
    handleRefresh()
  }

  // Colunas da tabela
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t.name,
      cell: ({ row }) => {
        const color = row.original.color || '#10b981'; // Default green color
        return (
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <MapPin 
                className="w-4 h-4" 
                style={{ color: color }}
              />
            </div>
            <div>
              <div className="font-medium">{row.original.name}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: "color",
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => {
        const color = row.original.color || '#10b981';
        return <ColorBadge color={color} showHex={true} />;
      },
    },
    {
      id: "provinces",
      header: "Total Provinces",
      cell: ({ row }) => {
        // Count sub-regions (child regions with this region as parent)
        const provincesCount = regions.filter((r: RegionType) => 
          r.parent_region_id === row.original.id
        ).length;
        
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{provincesCount}</span>
          </div>
        );
      },
    },
    {
      id: "churches",
      accessorKey: "churches_count",
      header: t.churches,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.churches?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          Status
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <StatusBadge
            label={row.original.is_deleted ? t.inactive : t.active}
            variant={row.original.is_deleted ? "neutral" : "success"}
            showDot
          />
        </div>
      ),
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right font-medium text-gray-900">
          {t.actions}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Edit className="w-4 h-4 mr-2" />
                {t.editRegion}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
                <Trash2 className="w-4 h-4 mr-2" />
                {t.deleteRegion}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
      <WithPermission requiredPermissions={[PermissionResolverName.Regions]} fallback={<AccessDenied/>}>
      <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold mb-2">
              {t.regionsTitle}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {t.regionsSubtitle}
          </p>
        </div>
          
          <div className="flex items-center gap-3">
            <AddRegionModal
              onSuccess={handleRegionCreated}
            >
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t.createRegion}
              </Button>
            </AddRegionModal>
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

        {/* KPI Cards */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          showCarousel={true}
          minCardsForCarousel={2}
        />

        <Separator />

        {/* Regions Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Regions
            </CardTitle>
            <CardDescription>Lista completa de regiões com ações de gerenciamento</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <DataTable
              columns={columns}
              data={regions}
              searchKey="name"
              searchPlaceholder={t.searchRegions}
              filterableColumns={[]}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        {selectedRegion && (
          <EditRegionModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            region={selectedRegion}
            onSave={handleRegionUpdated}
          />
        )}

        {selectedRegion && (
          <DeleteRegionModal
            isOpen={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            region={{
              id: selectedRegion.id,
              institution_id: selectedRegion.institution_id,
              name: selectedRegion.name,
              parent_region_id: null,
              contact_id: null,
              created_at: selectedRegion.created_at,
              updated_at: selectedRegion.created_at,
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            onSuccess={handleRegionDeleted}
          />
        )}

        {/* View Contact Modal */}
        <ContactViewEditModal
          isOpen={isViewContactModalOpen}
          onOpenChange={setIsViewContactModalOpen}
          contact={selectedRegion?.contact}
          entityName={selectedRegion?.name}
          entityType="Region"
          entityId={selectedRegion?.id}
          updateMutation={updateRegionContact}
        />
        
        {/* Annual Budget Modal */}
        {selectedRegion && (
          <AnnualBudgetViewEditModal
            isOpen={isBudgetModalOpen}
            onOpenChange={setIsBudgetModalOpen}
            budget={selectedBudget}
            entityType="region"
            entityName={selectedRegion.name}
            onSave={handleBudgetSaved}
          />
        )}
      </div>
      </WithPermission>
    </AppLayout>
  )
}