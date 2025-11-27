"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
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
  Home,
  ChevronRight
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { structureTranslations } from "@/lib/translations/structure"
import { regionTranslations } from "@/lib/translations/regions"
import { DataTable } from "@/components/ui/data-table"
import { AddRegionModal, EditRegionModal, DeleteRegionModal } from "@/components/modals/region"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"

import { useRegions } from "@/hooks/use-regions"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { Regions_regions } from "@/types/Regions"

/**
 * PÁGINA DE GESTÃO DE REGIÕES
 * Interface dedicada para gerenciar regiões baseada no ERD do AdventistGroei
 */
export default function RegionsPage() {
  const { t, i18n } = useTranslation()
  const { regions, refetchRegions } = useRegions();
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<Regions_regions | null>(null)
  
  // Obter traduções para o idioma atual
  const currentLanguage = i18n?.language || 'en'
  const tStructure = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en
  const tRegion = regionTranslations[currentLanguage as keyof typeof regionTranslations] || regionTranslations.en

  const pageTitle = useMemo(() => (
    <span className="flex items-center gap-2">
      {t('common.structure_organization')}
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      {t('regions.title')}
    </span>
  ), [t])

  usePageTitle({
    title: pageTitle,
    showBreadcrumbsInHeader: true
  })

  // Dados dos KPIs em formato de array para o componente reutilizável
  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total-regions",
      title: tRegion.page.totalRegions,
      value: regions.reduce((count, region) => count + (region.is_deleted ? 0 : 1), 0),
      icon: MapPin,
      subtitle: tRegion.page.active_regions
    },
    {
      id: "total-churches",
      title: tRegion.page.totalChurches,
      value: regions.reduce((count, region) => !region.is_deleted ? count + (region.kpiData?.totalChurches || 0) : count, 0),
      icon: Home,
      subtitle: tRegion.page.churches_in_regions
    },
    {
      id: "total-provinces",
      title: tRegion.page.totalProvinces,
      value: regions.reduce((count, region) => !region.is_deleted ? count + (region.kpiData?.totalProvinces || 0) : count, 0),
      icon: MapPin,
      subtitle: tRegion.page.provinces_in_regions
    },
        {
      id: "total-cities",
      title: tRegion.page.totalCities,
      value: regions.reduce((count, region) => !region.is_deleted ? count + (region.kpiData?.totalCities || 0) : count, 0),
      icon: MapPin,
      subtitle: tRegion.page.cities_in_regions
    }
  ], [regions, tRegion])
  /**
   * Carregamento inicial dos dados
   */
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(tRegion.messages.loading)
      
      try {
        await refetchRegions()
        
        toast.dismiss(loadingToast)
        toast.success(tRegion.messages.refresh_success, { duration: 3000 })
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(tRegion.messages.error_loading)
        setIsLoading(false)
      }
    }

    loadData()
  }, [refetchRegions, tRegion])

  /**
   * Handlers para ações
   */
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(tRegion.messages.loading)
    
    try {
      await refetchRegions()
      toast.dismiss(refreshToast)
      toast.success(tRegion.messages.refresh_success, { duration: 2000 })
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(tRegion.messages.refresh_failed)
    } finally {
      setRefreshing(false)
    }
  }

  const handleEdit = (region: Regions_regions) => {
    if (region) {
      setSelectedRegion(region);
      setIsEditModalOpen(true);
    }
  };
  
  const handleDelete = (region: Regions_regions) => {
    // Check if region is already inactive
    if (region.is_deleted) {
      toast.error("Cannot delete an inactive region. Only active regions can be deleted.", {
        duration: 4000,
        icon: '⚠️'
      });
      return;
    }
    
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
    toast.success(tRegion.toasts.updated)
    handleRefresh()
  }

  const handleRegionDeleted = (deletedRegion: string) => {
    toast.success(tRegion.toasts.deactivated)
    handleRefresh()
  }

  // Colunas da tabela
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: tRegion.table.name,
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
      header: tRegion.table.color,
      cell: ({ row }) => {
        const color = row.original.color || '#10b981';
        return <ColorBadge color={color} showHex={true} />;
      },
    },
    {
      id: "provinces",
      header: tRegion.table.provinces,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{row.original.kpiData?.totalProvinces || 0}</span>
          </div>
        );
      },
    },
    {
      id: "cities",
      header: tRegion.table.cities,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{row.original.kpiData?.totalCities || 0}</span>
          </div>
        );
      },
    },
    {
      id: "churches",
      accessorKey: "churches_count",
      header: tRegion.table.churches,
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
          {tRegion.table.status}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <StatusBadge
            label={row.original.is_deleted ? t('common.inactive') : t('common.active')}
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
          {t('common.actions')}
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
                {tRegion.messages.edit_region}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(row.original)}
                disabled={row.original.is_deleted}
                className={row.original.is_deleted ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {tRegion.messages.delete_region}
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
              {tStructure.regionsTitle}
            </h2>
            <p className="text-muted-foreground text-0.875rem sm:text-1rem">
              {tStructure.regionsSubtitle}
          </p>
        </div>
          
          <div className="flex items-center gap-3">
            <AddRegionModal
              onSuccess={handleRegionCreated}
            >
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {tStructure.createRegion}
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
              {tRegion.page.title}
            </CardTitle>
            <CardDescription>{tRegion.page.description}</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <DataTable
              columns={columns}
              data={regions}
              searchKey="name"
              searchPlaceholder={tStructure.searchRegions}
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
            region={selectedRegion}
            onSuccess={handleRegionDeleted}
          />
        )}
      </div>
      </WithPermission>
    </AppLayout>
  )
}