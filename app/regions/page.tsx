"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
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
  ChevronRight,
  Navigation,
  Eye
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
import { regionsPageTranslations } from "@/lib/translations/regions-page"
import { DataTable } from "@/components/ui/data-table"
import { AddRegionModal, EditRegionModal, DeleteRegionModal, RegionViewEditModal } from "@/components/modals/region"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { ChartHeader } from "@/components/shared/chart-header"
import MapLibre, { NETHERLANDS_CENTER, generateCityMarkers, RegionConfig as MapRegionConfig } from "@/components/maps/map-libre-refactored"
import { useTheme } from "next-themes"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from "@apollo/client"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"

import { useRegions } from "@/hooks/use-regions"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { Regions_regions } from "@/types/Regions"
import { getCoordinatesFromZipCode } from "@/lib/geocoding"
import { 
  enrichChurchesWithAutoLink, 
  calculateAutoLinkStats,
  findMatchingRegion,
  type EnrichedChurch 
} from "@/lib/church-region-matcher"

/**
 * PÁGINA DE GESTÃO DE REGIÕES
 * Interface dedicada para gerenciar regiões baseada no ERD do AdventistGroei
 */
export default function RegionsPage() {
  const { t, i18n } = useTranslation()
  const { theme, resolvedTheme } = useTheme()
  const { regions, refetchRegions } = useRegions();
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'regions' | 'churches'>('churches')
  
  // Fetch churches data
  const { data: churchesData, loading: churchesLoading, refetch: refetchChurches } = useQuery(GET_CHURCHES_QUERY);
  const churches = useMemo(() => churchesData?.churches?.filter((c: any) => !c.is_deleted) || [], [churchesData]);
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<Regions_regions | null>(null)
  
  // Map ref for refocus functionality
  const [mapInstance, setMapInstance] = useState<any>(null)
  
  // ============================================================================
  // TRANSLATIONS & PAGE CONFIG
  // ============================================================================
  
  const currentLanguage = i18n?.language || 'en'
  const tStructure = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en
  const tRegion = regionTranslations[currentLanguage as keyof typeof regionTranslations] || regionTranslations.en
  const tPage = regionsPageTranslations[currentLanguage as keyof typeof regionsPageTranslations] || regionsPageTranslations.en
  
  // ============================================================================
  // PRELOADING & PERFORMANCE OPTIMIZATION
  // ============================================================================
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  
  // Debug removido para otimização de performance
  // Para habilitar debug em desenvolvimento: configurar variável de ambiente
  
  // ============================================================================
  // AUTO-LINKING: Apply suggestions to churches data
  // ============================================================================
  
  /**
   * Cria versão enriquecida de churches com auto-linking aplicado
   * Usa funções do @/lib/church-region-matcher
   */
  const churchesWithAutoLink = useMemo<EnrichedChurch[]>(() => {
    if (churches.length === 0 || regions.length === 0) return [];
    
    return enrichChurchesWithAutoLink(churches, regions);
  }, [churches, regions]);
  
  /**
   * Estatísticas de auto-linking para debug e UI
   * Usa funções do @/lib/church-region-matcher
   */
  const autoLinkStats = useMemo(() => {
    return calculateAutoLinkStats(churchesWithAutoLink);
  }, [churchesWithAutoLink]);
  
  /**
   * Contagem de igrejas por região (centralizada)
   * Usa churchesWithAutoLink para contar apenas igrejas COM region_id
   */
  const churchCountByRegion = useMemo(() => {
    const countMap: Record<string, number> = {};
    
    // Inicializar todas as regiões com 0
    regions.forEach(region => {
      if (!region.is_deleted) {
        countMap[region.id] = 0;
      }
    });
    
    // Contar igrejas que TÊM region_id (linkadas)
    churchesWithAutoLink.forEach(church => {
      if (church.region_id && countMap[church.region_id] !== undefined) {
        countMap[church.region_id]++;
      }
    });
    
    return countMap;
  }, [churchesWithAutoLink, regions]);
  
  /**
   * Enriquecer selectedRegion com churches do churchesWithAutoLink
   * O objeto region do useRegions() não vem com churches populadas,
   * então precisamos adicionar manualmente do churchesWithAutoLink
   */
  const selectedRegionEnriched = useMemo(() => {
    if (!selectedRegion) return null;
    
    // Filtrar churches que pertencem a esta região
    const regionChurches = churchesWithAutoLink.filter(
      church => church.region_id === selectedRegion.id
    );
    
    console.log('🔧 ENRICHING - Region:', selectedRegion.name);
    console.log('🔧 ENRICHING - Churches found:', regionChurches.length);
    console.log('🔧 ENRICHING - Churches data:', regionChurches);
    
    return {
      ...selectedRegion,
      churches: regionChurches as any // EnrichedChurch é compatível para visualização
    };
  }, [selectedRegion, churchesWithAutoLink]);
  
  // ============================================================================
  // CITY MARKERS: Generate city markers with region colors
  // ============================================================================
  const cityMarkers = useMemo(() => {
    if (regions.length === 0) return [];
    
    // Converter regiões para formato do MapLibre com territory real
    const mapRegions: MapRegionConfig[] = regions
      .filter(region => !region.is_deleted)
      .map(region => {
        const churchesWithLocation = region.churches?.map(church => {
          // Usar dados de contact diretamente da church (já vem da query de regions)
          // Ou buscar do array churches como fallback
          const contactData = church.contact || churches.find((c: any) => c.id === church.id)?.contact;
          const city = contactData?.city;
          const province = contactData?.state; // state = província
          
          return {
            id: church.id,
            name: church.name,
            city: city,
            province: province,
          };
        }) || [];
        
        return {
          id: region.id,
          name: region.name,
          color: region.color || '#10b981',
          provinces: getProvincesFromTerritory(region.territory),
          territory: region.territory,
          churches: churchesWithLocation,
          churches_count: region.churches?.length || 0,
        };
      });
    
    const generatedMarkers = generateCityMarkers(mapRegions);
    
    // Adicionar popupHTML customizado a cada marker
    return generatedMarkers.map(marker => {
      // Extrair nome da região da descrição existente (formato: "Região: Nome da Região")
      const regionName = marker.description?.replace('Região: ', '') || '';
      const region = regions.find(r => r.name === regionName);
      const regionColor = region?.color || marker.color || '#10b981';
      // Usar contagem centralizada que considera apenas igrejas linkadas
      const churchesCount = region ? (churchCountByRegion[region.id] || 0) : 0;
      
      return {
        ...marker,
        popupHTML: `
          <div style="
            padding: 6px; 
            width: 100px;
            max-height: 150px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid ${regionColor};
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            overflow: hidden;
          ">
            <div style="margin-bottom: 4px;">
              <h3 style="
                margin: 0; 
                font-size: 10px; 
                font-weight: 700; 
                color: ${regionColor};
                line-height: 1.2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">
                ${marker.title}
              </h3>
            </div>
            
            <div style="
              font-size: 8px; 
              color: #6b7280;
              margin-bottom: 3px;
              line-height: 1.2;
            ">
              ${tPage.cityPopup.city_label}
            </div>
            
            <div style="
              padding: 3px 4px;
              background: ${regionColor}15;
              border-left: 2px solid ${regionColor};
              border-radius: 3px;
              font-size: 8px;
              color: ${regionColor};
              font-weight: 600;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-bottom: 3px;
            ">
              ${regionName || tPage.cityPopup.region_label}
            </div>
            
            ${churchesCount > 0 ? `
              <div style="
                padding: 3px 4px;
                background: rgba(16, 185, 129, 0.1);
                border-left: 2px solid #9ca3af;
                border-radius: 3px;
                font-size: 8px;
                color: #6b7280;
                font-weight: 600;
              ">
                ${churchesCount} ${tPage.cityPopup.churches_count}
              </div>
            ` : ''}
          </div>
        `,
      };
    });
  }, [regions, tPage, churchCountByRegion]);
  
  // ============================================================================
  // PRELOAD: Geocoding de churches (inicia imediatamente para otimizar UX)
  // ============================================================================
  const [churchMarkersState, setChurchMarkersState] = useState<any[]>([]);
  
  // Processar churches de forma assíncrona para geocoding com PRELOAD
  useEffect(() => {
    if (churchesWithAutoLink.length === 0) return;
    
    const processChurches = async () => {
      setIsPreloading(true);
      setPreloadProgress(0);
      const markers: any[] = [];
      const total = churchesWithAutoLink.length;
      
      for (let i = 0; i < total; i++) {
        const church = churchesWithAutoLink[i];
        
        // Atualizar progresso
        setPreloadProgress(Math.round(((i + 1) / total) * 100));
        
        // Obter coordenadas usando sistema de geocoding melhorado
        const coords = church.zip_code 
          ? await getCoordinatesFromZipCode(church.zip_code, church.house_number?.toString() || null)
          : null;
        
        if (!coords) continue;
        
        const hasRegion = !!church.region_id;
        const churchColor = hasRegion && church.region?.color ? church.region.color : '#9ca3af';
        const churchRegion = church.region || regions.find(r => r.id === church.region_id);
        
        markers.push({
          lngLat: coords,
          title: church.name,
          description: hasRegion ? churchRegion?.name : tPage.popup.without_region,
          color: churchColor,
          popupHTML: `
            <div style="
              padding: 12px; 
              min-width: 180px;
              max-width: 220px;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            ">
              <h3 style="
                margin: 0 0 8px 0; 
                font-size: 13px; 
                font-weight: 600; 
                color: #1f2937;
                line-height: 1.4;
              ">
                ${church.name}
              </h3>
              
              ${church.contact?.city && church.contact?.state ? `
                <div style="
                  font-size: 11px; 
                  color: #6b7280; 
                  margin-bottom: 6px;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <span style="color: #9ca3af;">${MapPin}</span>
                  ${church.contact.city}, ${church.contact.state}
                </div>
              ` : ''}
              
              ${church.zip_code ? `
                <div style="
                  font-size: 11px; 
                  color: #6b7280; 
                  margin-bottom: 8px;
                  display: flex;
                  align-items: center;
                  gap: 4px;
                ">
                  <span style="color: #9ca3af;">${Navigation}</span>
                  ${church.zip_code}${church.house_number ? ` #${church.house_number}` : ''}
                </div>
              ` : ''}
              
              ${hasRegion && churchRegion ? `
                <div style="
                  padding: 6px 10px;
                  background: ${churchRegion.color}15;
                  border-left: 3px solid ${churchRegion.color};
                  border-radius: 4px;
                  font-size: 11px;
                  color: ${churchRegion.color};
                  font-weight: 600;
                ">
                  ${churchRegion.name}
                </div>
              ` : `
                <div style="
                  padding: 6px 10px;
                  background: #f3f4f6;
                  border-left: 3px solid #d1d5db;
                  border-radius: 4px;
                  font-size: 11px;
                  color: #9ca3af;
                  font-weight: 500;
                ">
                  Sem região
                </div>
              `}
            </div>
          `,
        });
      }
      
      setChurchMarkersState(markers);
      setIsPreloading(false);
      setPreloadProgress(100);
    };
    
    // Iniciar processamento imediatamente (preload)
    processChurches();
  }, [churchesWithAutoLink, regions, tPage, autoLinkStats]);
  
  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  // Extrair províncias do território JSON
  function getProvincesFromTerritory(territory: any): string[] {
    if (!territory) return [];
    
    try {
      const parsed = typeof territory === 'string' ? JSON.parse(territory) : territory;
      if (parsed?.NL) {
        return Object.keys(parsed.NL).map(provinceCode => `NL${provinceCode}`);
      }
      return parsed?.provinces || [];
    } catch {
      return [];
    }
  }
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  const handleRefocusMap = () => {
    if (mapInstance) {
      mapInstance.flyTo({
        center: NETHERLANDS_CENTER,
        zoom: 7,
        duration: 1500
      })
      toast.success(tRegion.map?.refocus_success || 'Map repositioned to Netherlands')
    }
  }
  
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

  // ============================================================================
  // KPI DATA
  // ============================================================================
  const kpiCardsData: KPICardData[] = useMemo(() => {
    // Usar soma do churchCountByRegion para garantir consistência
    const churchesWithRegionAssigned = Object.values(churchCountByRegion).reduce((sum, count) => sum + count, 0);
    
    return [
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
        value: churchesWithRegionAssigned,
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
    ]
  }, [regions, tRegion, churchCountByRegion])
  
  const hasShownLoadingToast = useRef(false)

  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================
  useEffect(() => {
    if (hasShownLoadingToast.current) return
    hasShownLoadingToast.current = true

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
  }, [])

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(tRegion.messages.loading)
    
    try {
      await Promise.all([refetchRegions(), refetchChurches()])
      toast.dismiss(refreshToast)
      toast.success(tRegion.messages.refresh_success, { duration: 2000 })
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error(tRegion.messages.refresh_failed)
    } finally {
      setRefreshing(false)
    }
  }

  const handleView = (region: Regions_regions) => {
    if (region) {
      setSelectedRegion(region);
      setIsViewModalOpen(true);
    }
  };
  
  const handleEditFromView = (region: Regions_regions) => {
    setSelectedRegion(region);
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };
  
  const handleEdit = (region: Regions_regions) => {
    if (region) {
      setSelectedRegion(region);
      setIsEditModalOpen(true);
    }
  };
  
  const handleDelete = (region: Regions_regions) => {
    if (region) {
      setSelectedRegion(region);
      setIsDeleteModalOpen(true);
    }
  };

  // Modal handlers
  const handleRegionCreated = () => {
    handleRefresh()
  }

  const handleRegionUpdated = () => {
    toast.success(tRegion.toasts.updated)
    handleRefresh()
  }

  const handleRegionDeleted = () => {
    toast.success(tRegion.toasts.deactivated)
    handleRefresh()
  }

  // ============================================================================
  // TABLE COLUMNS DEFINITION
  // ============================================================================
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
      cell: ({ row }) => {
        // Usar contagem centralizada que considera apenas igrejas COM region_id
        const count = churchCountByRegion[row.original.id] || 0;
        return (
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{count}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right font-medium">
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
              <DropdownMenuItem onClick={() => handleView(row.original)}>
                <Eye className="w-4 h-4 mr-2" />
                {tRegion.messages.view_details}
              </DropdownMenuItem>
              <WithPermission requiredPermissions={[PermissionResolverName.UpdateRegion]}>
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {tRegion.messages.edit_region}
                </DropdownMenuItem>
              </WithPermission>
              <WithPermission requiredPermissions={[PermissionResolverName.DeleteRegion]}>
                <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  {tRegion.messages.delete_region}
                </DropdownMenuItem>
              </WithPermission>
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
            <WithPermission requiredPermissions={[PermissionResolverName.CreateRegion]}>
              <AddRegionModal
                onSuccess={handleRegionCreated}
              >
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {tStructure.createRegion}
                </Button>
              </AddRegionModal>
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

        {/* KPI Cards */}
        <KPICards 
          data={kpiCardsData}
          isLoading={isLoading}
          showCarousel={true}
          minCardsForCarousel={2}
        />

        <Separator />

        {/* MapLibre - Netherlands Overview with Tabs */}
        <Card>
          <ChartHeader
            title={activeTab === 'regions' 
              ? (tRegion.map?.title || 'Netherlands Regions Map')
              : tPage.map.churches_title || ''}
            description={activeTab === 'regions'
              ? (tRegion.map?.description || 'Interactive geographic visualization')
              : tPage.map.churches_description || ''}
            actions={
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefocusMap}
                disabled={!mapInstance}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {tRegion.map?.refocus_button || 'Refocus'}
              </Button>
            }
          />
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'churches' | 'regions')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
             
                <TabsTrigger value="churches" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {tPage.tabs.churches_registered}
                </TabsTrigger>
                <TabsTrigger value="regions" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {tPage.tabs.regions_cities}
              </TabsTrigger>
              </TabsList>

              <TabsContent value="churches" className="mt-0">
                <MapLibre
                  center={NETHERLANDS_CENTER}
                  zoom={7}
                  height="500px"
                  theme={(resolvedTheme === 'dark' ? 'dark' : 'light') as 'dark' | 'light' | 'voyager'}
                  showControls={true}
                  showGeolocation={true}
                  showFullscreen={true}
                  showScale={true}
                  markers={churchMarkersState}
                  onLoad={(map) => {
                    setMapInstance(map)
                  }}
                />
              </TabsContent>
              
              <TabsContent value="regions" className="mt-0">
                <MapLibre
                  center={NETHERLANDS_CENTER}
                  zoom={7}
                  height="500px"
                  theme={(resolvedTheme === 'dark' ? 'dark' : 'light') as 'dark' | 'light' | 'voyager'}
                  showControls={true}
                  showGeolocation={true}
                  showFullscreen={true}
                  showScale={true}
                  markers={cityMarkers}
                  onLoad={(map) => {
                    setMapInstance(map)
                  }}
                />
              </TabsContent>
              
            </Tabs>
          </CardContent>
        </Card>

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
              searchPlaceholder="Search regions..."
              filterableColumns={[]}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        {selectedRegionEnriched && (
          <RegionViewEditModal
            isOpen={isViewModalOpen}
            onOpenChange={setIsViewModalOpen}
            region={selectedRegionEnriched}
            onEdit={handleEditFromView}
            churchCountByRegion={churchCountByRegion}
          />
        )}
        
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