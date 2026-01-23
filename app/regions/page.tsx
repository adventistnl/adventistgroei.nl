"use client"

import React, { useState, useEffect, useMemo } from "react"
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
  Navigation
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
import { AddRegionModal, EditRegionModal, DeleteRegionModal } from "@/components/modals/region"
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
  const [activeTab, setActiveTab] = useState<'regions' | 'churches'>('regions')
  
  // Fetch churches data
  const { data: churchesData, loading: churchesLoading, refetch: refetchChurches } = useQuery(GET_CHURCHES_QUERY);
  const churches = useMemo(() => churchesData?.churches?.filter((c: any) => !c.is_deleted) || [], [churchesData]);
  
  // Modal states
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
  
  // Gerar markers de cidades com cores das regiões
  const cityMarkers = useMemo(() => {
    if (regions.length === 0) return [];
    
    // Converter regiões para formato do MapLibre com territory real
    const mapRegions: MapRegionConfig[] = regions
      .filter(region => !region.is_deleted)
      .map(region => ({
        id: region.id,
        name: region.name,
        color: region.color || '#10b981',
        provinces: getProvincesFromTerritory(region.territory),
        territory: region.territory,
        churches: region.churches?.map(church => ({
          id: church.id,
          name: church.name,
          city: undefined,
          province: undefined,
        })) || [],
        churches_count: region.churches?.length || 0,
      }));
    
    const generatedMarkers = generateCityMarkers(mapRegions);
    
    // Adicionar popupHTML customizado a cada marker
    return generatedMarkers.map(marker => {
      // Extrair nome da região da descrição existente (formato: "Região: Nome da Região")
      const regionName = marker.description?.replace('Região: ', '') || '';
      const region = regions.find(r => r.name === regionName);
      const regionColor = region?.color || marker.color || '#10b981';
      const churchesCount = region?.churches?.length || 0;
      
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
  }, [regions, tPage]);
  
  // Helper: Converter zip code holandês para coordenadas aproximadas
  const getCoordinatesFromZipCode = (zipCode: string): [number, number] | null => {
    if (!zipCode) return null;
    
    // Remover espaços e converter para maiúsculas
    const cleanZip = zipCode.replace(/\s+/g, '').toUpperCase();
    
    // Zip code holandês: 4 dígitos + 2 letras (ex: 1012AB)
    const match = cleanZip.match(/^(\d{4})([A-Z]{2})$/);
    if (!match) return null;
    
    const digits = match[1];
    const firstDigit = parseInt(digits[0]);
    const secondDigit = parseInt(digits[1]);
    
    // Mapeamento aproximado baseado nos primeiros dígitos do zip code
    // Referência: https://nl.wikipedia.org/wiki/Postcodes_in_Nederland
    const zipToCoords: Record<string, [number, number]> = {
      // Amsterdam região (1000-1099)
      '10': [4.9041, 52.3676],
      '11': [4.9200, 52.3700],
      // Den Haag (2500-2599)
      '25': [4.3007, 52.0705],
      '26': [4.3200, 52.0800],
      // Rotterdam (3000-3099)
      '30': [4.4777, 51.9244],
      '31': [4.5000, 51.9300],
      // Utrecht (3500-3599)
      '35': [5.1214, 52.0907],
      '36': [5.1400, 52.1000],
      // Eindhoven (5600-5699)
      '56': [5.4697, 51.4416],
      '57': [5.4800, 51.4500],
      // Groningen (9700-9799)
      '97': [6.5665, 53.2194],
      '98': [6.5800, 53.2300],
      // Maastricht (6200-6299)
      '62': [5.6913, 50.8514],
      '63': [5.7000, 50.8600],
    };
    
    // Tentar match com primeiros 2 dígitos
    const key = digits.substring(0, 2);
    if (zipToCoords[key]) {
      // Adicionar pequena variação baseada nos outros dígitos para espalhar pins
      const base = zipToCoords[key];
      const offset = parseInt(digits.substring(2)) * 0.0001;
      return [base[0] + offset, base[1] + offset * 0.5];
    }
    
    // Fallback: Centro da Holanda
    return [5.2913, 52.1326];
  };
  
  // Gerar markers de TODAS as churches usando zip_code
  const churchMarkers = useMemo(() => {
    if (churches.length === 0) return [];
    
    const markers: any[] = [];
    
    churches.forEach((church: any) => {
      // Obter coordenadas do zip_code
      const coords = church.zip_code ? getCoordinatesFromZipCode(church.zip_code) : null;
      
      if (!coords) {
        return;
      }
      
      // Determinar cor do pin
      const hasInstitution = !!church.institution_id;
      const churchColor = hasInstitution ? '#083e55' : '#9ca3af';
      const bgOpacity = hasInstitution ? '0.95' : '0.5';
      const borderColor = hasInstitution ? churchColor : '#d1d5db';
      
      // Buscar dados da região
      const churchRegion = church.region || regions.find(r => r.id === church.region_id);
      
      // SVG do ícone Church do Lucide
      const churchIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${churchColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>`;
      
      markers.push({
        lngLat: coords,
        title: church.name,
        description: hasInstitution 
          ? `Região: ${churchRegion?.name || tPage.popup.zip_code_not_available}` 
          : tPage.popup.without_region,
        color: churchColor,
        popupHTML: `
          <div style="
            padding: 6px; 
            width: 100px;
            max-height: 150px;
            background: rgba(255, 255, 255, ${bgOpacity});
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid ${borderColor};
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
                color: ${hasInstitution ? churchColor : '#6b7280'};
                line-height: 1.2;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">
                ${church.name}
              </h3>
            </div>
            
            <div style="
              font-size: 8px; 
              color: #6b7280;
              margin-bottom: 3px;
              line-height: 1.2;
            ">
              ${church.zip_code || '${tPage.popup.zip_code_not_available}'}
            </div>
            
            ${hasInstitution && churchRegion ? `
              <div style="
                padding: 3px 4px;
                background: ${churchRegion.color}15;
                border-left: 2px solid ${churchRegion.color};
                border-radius: 3px;
                font-size: 8px;
                color: ${churchRegion.color};
                font-weight: 600;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              ">
                ${churchRegion.name}
              </div>
            ` : `
              <div style="
                padding: 3px 4px;
                background: rgba(156, 163, 175, 0.1);
                border-left: 2px solid #9ca3af;
                border-radius: 3px;
                font-size: 8px;
                color: #6b7280;
                font-weight: 600;
              ">
                ${tPage.popup.without_region}
              </div>
            `}
          </div>
        `,
      });
    });
    
    return markers;
  }, [churches, regions, tPage]);
  
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
  
  // ============================================================================
  // LIFECYCLE EFFECTS
  // ============================================================================
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.churches?.length || 0}</span>
        </div>
      ),
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
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'regions' | 'churches')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="regions" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {tPage.tabs.regions_cities}
                </TabsTrigger>
                <TabsTrigger value="churches" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  {tPage.tabs.churches_registered}
                </TabsTrigger>
              </TabsList>
              
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
                  markers={churchMarkers}
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