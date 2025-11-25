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
  MapPin,
  Plus,
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Trash2,
  Home,
  DollarSign,
  TrendingUp,
  Calendar
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
import { UseKPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { EuropeRegionsMap, RegionData as MapRegionData } from "@/components/maps/europe-regions-map-mapbox"
import MapLibre, { 
  MarkerConfig, 
  RegionConfig as MapLibreRegionConfig,
  NETHERLANDS_CENTER, 
  NETHERLANDS_CITIES, 
  EXAMPLE_REGIONS,
  createMarker,
  createRegion 
} from "@/components/maps/map-libre-refactored"

// Charts - usando a lib atual do sistema
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts"

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
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  
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
    const totalChurches = regions.reduce((sum: number, r: RegionType) => sum + (r.churches_count || 0), 0);
    return {
      totalRegions,
      totalChurches,
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
    }
  ], [kpiData, t])

  // Dados mock para o mapa de regiões
  const mapRegionsData: MapRegionData[] = useMemo(() => [
    {
      id: 'region-norte',
      name: 'Distrito Norte',
      color: '#3b82f6', // blue
      provinces: ['NLGR', 'NLFR', 'NLDR'], // Groningen, Friesland, Drenthe
      churches_count: 8,
      members_count: 320
    },
    {
      id: 'region-oeste',
      name: 'Distrito Oeste',
      color: '#10b981', // green
      provinces: ['NLNH', 'NLZH', 'NLUT', 'NLFL'], // Noord-Holland, Zuid-Holland, Utrecht, Flevoland
      churches_count: 15,
      members_count: 650
    },
    {
      id: 'region-sul',
      name: 'Distrito Sul',
      color: '#f59e0b', // amber
      provinces: ['NLZL', 'NLNB', 'NLLI'], // Zeeland, Noord-Brabant, Limburg
      churches_count: 12,
      members_count: 480
    },
    {
      id: 'region-leste',
      name: 'Distrito Leste',
      color: '#ef4444', // red
      provinces: ['NLOV', 'NLGE'], // Overijssel, Gelderland
      churches_count: 10,
      members_count: 410
    }
  ], [])

  // Handler para clique em região do mapa
  const handleMapRegionClick = (region: MapRegionData) => {
    toast.success(`Region selected: ${region.name}`)
    console.log('Region clicked:', region)
  }

  // Marcadores para o mapa MapLibre
  const mapLibreMarkers: MarkerConfig[] = useMemo(() => [
    createMarker(NETHERLANDS_CITIES.amsterdam, {
      title: 'Amsterdam',
      description: '15 igrejas adventistas',
      color: '#3b82f6',
    }),
    createMarker(NETHERLANDS_CITIES.rotterdam, {
      title: 'Rotterdam',
      description: '8 igrejas adventistas',
      color: '#10b981',
    }),
    createMarker(NETHERLANDS_CITIES.utrecht, {
      title: 'Utrecht',
      description: '6 igrejas adventistas',
      color: '#f59e0b',
    }),
    createMarker(NETHERLANDS_CITIES.groningen, {
      title: 'Groningen',
      description: '4 igrejas adventistas',
      color: '#ef4444',
    }),
  ], [])

  // Regiões para colorir províncias no MapLibre
  // 🎨 SISTEMA DE COLORAÇÃO INTELIGENTE:
  // - Províncias COM região: usam a cor configurada
  // - Províncias SEM região: usam cor padrão cinza (#d1d5db)
  // 
  // TODAS as 12 províncias dos Países Baixos são SEMPRE exibidas!
  //
  // Exemplo 1: Apenas 2 províncias em 1 região (10 ficam cinzas)
  // const mapLibreRegions: MapLibreRegionConfig[] = [
  //   createRegion('region-1', 'Distrito Norte', '#3b82f6', ['NLFL', 'NLFR'], {
  //     churches_count: 8,
  //     members_count: 320
  //   }),
  // ];
  //
  // Exemplo 2: Todas as 12 províncias distribuídas em 4 regiões (nenhuma cinza)
  const mapLibreRegions: MapLibreRegionConfig[] = useMemo(() => [
    createRegion('region-norte', 'Distrito Norte', '#3b82f6', ['NLGR', 'NLFR', 'NLDR'], {
      churches_count: 8,
      members_count: 320
    }),
    createRegion('region-oeste', 'Distrito Oeste', '#10b981', ['NLNH', 'NLZH', 'NLUT', 'NLFL'], {
      churches_count: 15,
      members_count: 650
    }),
    createRegion('region-sul', 'Distrito Sul', '#f59e0b', ['NLZL', 'NLNB', 'NLLI'], {
      churches_count: 12,
      members_count: 480
    }),
    createRegion('region-leste', 'Distrito Leste', '#ef4444', ['NLOV', 'NLGE'], {
      churches_count: 10,
      members_count: 410
    }),
  ], [])

  // Handlers para interação com províncias
  const handleProvinceClick = (provinceCode: string, regionName?: string) => {
    toast.success(`Província clicada: ${provinceCode}${regionName ? ` (${regionName})` : ''}`)
    console.log('Province clicked:', { provinceCode, regionName })
  }

  const handleProvinceHover = (provinceCode: string | null, regionName?: string) => {
    if (provinceCode) {
      console.log('Province hover:', { provinceCode, regionName })
    }
  }

  // Dados para gráficos
  const chartData = useMemo(() => ({
    budgetByRegion: regions.map((r: RegionType) => ({
      region: r.name,
      budget: (r as any).total_budget || 0,
      used: (r as any).used_budget || 0,
      remaining: ((r as any).total_budget || 0) - ((r as any).used_budget || 0)
    })),
    subsidyRequestsByRegion: regions.map((r: RegionType) => ({
      region: r.name,
      requests: (r as any).subsidy_requests || 0
    })),
    churchesByRegion: regions.map((r: RegionType) => ({
      region: r.name,
      churches: (r as any).churches_count || 0
    })),
    subsidyTimeline: []
  }), [regions]);

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

  // Colunas da tabela
  const columns: ColumnDef<any>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: t.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
          </div>
        </div>
      ),
    },
    {
      id: "churches",
      accessorKey: "churches_count",
      header: t.churches,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.churches.length}</span>
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "is_deleted",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.is_deleted ? 'secondary' : 'default'}>
          {row.original.is_deleted ? t.inactive : t.active}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: t.actions,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
              <Edit className="w-4 h-4 mr-2" />
              {t.editRegion}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(row.original.id, row.original.name)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t.deleteRegion}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
        <UseKPICards data={kpiCardsData} />

        <Separator />

        {/* Europe Regions Map - Interactive (Mapbox) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa de Regiões - Mapbox GL
            </CardTitle>
            <CardDescription>Províncias dos Países Baixos coloridas por região</CardDescription>
          </CardHeader>
          <CardContent>
            <EuropeRegionsMap 
              regions={mapRegionsData}
              onRegionClick={handleMapRegionClick}
              height={600}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* MapLibre Map - Alternative Free Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Mapa de Regiões - MapLibre GL (Gratuito)
            </CardTitle>
            <CardDescription>
              Mapa interativo com províncias coloridas por região (sem necessidade de token de API)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Legenda de Regiões */}
            <div className="flex flex-wrap gap-3 p-4 bg-muted/50 rounded-lg">
              {mapLibreRegions.map((region) => (
                <div key={region.id} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: region.color }}
                  />
                  <span className="text-sm font-medium">{region.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({region.provinces.length} províncias)
                  </span>
                </div>
              ))}
            </div>

            {/* Mapa */}
            <MapLibre
              center={NETHERLANDS_CENTER}
              zoom={7}
              height="600px"
              theme="light"
              regions={mapLibreRegions}
              markers={mapLibreMarkers}
              showControls={true}
              showGeolocation={true}
              showFullscreen={true}
              showScale={true}
              showDebugPanel={true}
              onProvinceClick={handleProvinceClick}
              onProvinceHover={handleProvinceHover}
              onClick={(e) => {
                console.log('Map clicked:', e.lngLat);
              }}
              onLoad={(map) => {
                console.log('MapLibre with regions loaded successfully');
              }}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Main Chart - Regional Budget Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {t.regionalBudgetDistribution}
              </CardTitle>
              <CardDescription>Orçamento vs. Valores utilizados por região</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer 
                config={{
                  budget: { label: "Orçamento", color: "#10b981" },
                  used: { label: "Utilizado", color: "#f59e0b" },
                  remaining: { label: "Restante", color: "#3b82f6" }
                }} 
                className="h-[300px] sm:h-[360px] w-full"
              >
                <BarChart data={chartData.budgetByRegion}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="region" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(value) => `$${(value / 1000)}K`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="budget" fill="#10b981" radius={4} />
                  <Bar dataKey="used" fill="#f59e0b" radius={4} />
                  <Bar dataKey="remaining" fill="#3b82f6" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Secondary Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subsidy Requests by Region */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t.subsidyRequestsByRegion}
                </CardTitle>
                <CardDescription>Qual região tem solicitado mais subsídios</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer 
                  config={{
                    requests: { label: "Solicitações", color: "#3b82f6" }
                  }} 
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <BarChart data={chartData.subsidyRequestsByRegion}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="region" fontSize={11} />
                    <YAxis fontSize={11} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="requests" fill="#3b82f6" radius={4} />
                  </BarChart>
                </ChartContainer>
            </CardContent>
          </Card>

            {/* Churches Distribution by Region */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  {t.churchesByRegion}
                </CardTitle>
                <CardDescription>Distribuição de igrejas por região</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer 
                  config={{
                    churches: { label: "Igrejas", color: "#10b981" }
                  }} 
                  className="h-[250px] sm:h-[300px] w-full"
                >
                  <RechartsPieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={chartData.churchesByRegion}
                      dataKey="churches"
                      nameKey="region"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {chartData.churchesByRegion.map((entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index % 5]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ChartContainer>
            </CardContent>
          </Card>
        </div>

          {/* Subsidy Requests Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t.subsidyRequestsTimeline}
            </CardTitle>
              <CardDescription>Evolução mensal das solicitações de subsídio por região</CardDescription>
          </CardHeader>
          <CardContent>
              <ChartContainer 
                config={{
                  'São Paulo Capital': { label: "SP Capital", color: "#3b82f6" },
                  'São Paulo Interior': { label: "SP Interior", color: "#10b981" },
                  'Rio de Janeiro': { label: "Rio de Janeiro", color: "#f59e0b" },
                  'Distrito Federal': { label: "Distrito Federal", color: "#ef4444" },
                  'Bahia - Salvador': { label: "Bahia - Salvador", color: "#8b5cf6" }
                }} 
                className="h-[300px] sm:h-[400px] w-full"
              >
                <LineChart data={chartData.subsidyTimeline}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line dataKey="São Paulo Capital" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="São Paulo Interior" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Rio de Janeiro" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Distrito Federal" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="Bahia - Salvador" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ChartContainer>
          </CardContent>
        </Card>
        </div>

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
        
      </div>
      </WithPermission>
    </AppLayout>
  )
}