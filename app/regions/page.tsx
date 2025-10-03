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
  Users,
  Home,
  DollarSign,
  Building,
  ContactRound,
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
import { AnnualBudgetModal, AnnualBudgetData } from "@/components/modals/budget"
import { UseKPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"

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

import { useInstitution } from '@/contexts/institution-context'

// Mock data para timeline de subsídios
const MOCK_SUBSIDY_TIMELINE = [
  { month: 'Jan', 'São Paulo Capital': 15, 'São Paulo Interior': 22, 'Rio de Janeiro': 12, 'Distrito Federal': 8, 'Bahia - Salvador': 18 },
  { month: 'Feb', 'São Paulo Capital': 18, 'São Paulo Interior': 25, 'Rio de Janeiro': 14, 'Distrito Federal': 10, 'Bahia - Salvador': 20 },
  { month: 'Mar', 'São Paulo Capital': 22, 'São Paulo Interior': 28, 'Rio de Janeiro': 16, 'Distrito Federal': 12, 'Bahia - Salvador': 23 },
  { month: 'Apr', 'São Paulo Capital': 19, 'São Paulo Interior': 26, 'Rio de Janeiro': 15, 'Distrito Federal': 11, 'Bahia - Salvador': 21 },
  { month: 'May', 'São Paulo Capital': 25, 'São Paulo Interior': 30, 'Rio de Janeiro': 18, 'Distrito Federal': 14, 'Bahia - Salvador': 25 },
  { month: 'Jun', 'São Paulo Capital': 23, 'São Paulo Interior': 34, 'Rio de Janeiro': 18, 'Distrito Federal': 15, 'Bahia - Salvador': 27 },
]

/**
 * PÁGINA DE GESTÃO DE REGIÕES
 * Interface dedicada para gerenciar regiões baseada no ERD do AdventistGroei
 */
export default function RegionsPage() {
  const { i18n } = useTranslation()
  const { currentInstitutionData, loading: institutionLoading } = useInstitution();
  // Garante que regions venha do dado real da instituição ativa
  console.log(currentInstitutionData)
  const regions = React.useMemo(() => currentInstitutionData?.regions || [], [currentInstitutionData]);
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isViewContactModalOpen, setIsViewContactModalOpen] = useState(false)
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [selectedContact, setSelectedContact] = useState<ContactData | null>(null)
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
  type RegionType = any; // Usar any para contornar limitações do tipo GraphQL
  const kpiData = useMemo(() => {
    const totalRegions = regions.length;
    const totalChurches = regions.reduce((sum: number, r: RegionType) => sum + (r.churches_count || 0), 0);
    const totalMembers = regions.reduce((sum: number, r: RegionType) => sum + (r.members_count || 0), 0);
    const totalSubsidyRequests = regions.reduce((sum: number, r: RegionType) => sum + (r.subsidy_requests || 0), 0);
    const totalBudget = regions.reduce((sum: number, r: RegionType) => sum + (r.total_budget || 0), 0);
    const totalUsedBudget = regions.reduce((sum: number, r: RegionType) => sum + (r.used_budget || 0), 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((totalUsedBudget / totalBudget) * 100) : 0;
    return {
      totalRegions,
      totalChurches,
      totalMembers,
      totalSubsidyRequests,
      totalBudget,
      totalUsedBudget,
      budgetUtilization
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
      id: "total-budget", 
      title: t.totalBudget,
      value: `$${(kpiData.totalBudget / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      subtitle: "Annual budget"
    },
    {
      id: "total-requests",
      title: t.requests,
      value: kpiData.totalSubsidyRequests,
      icon: Calendar,
      subtitle: "Subsidy requests"
    },
    {
      id: "budget-utilization",
      title: t.budgetUtilization,
      value: `${kpiData.budgetUtilization}%`,
      icon: TrendingUp,
      subtitle: "Budget efficiency",
      trend: {
        value: 5.2,
        isPositive: true,
        label: "vs last month"
      }
    }
  ], [kpiData, t])

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
    subsidyTimeline: [] // Timeline ainda mock, backend não fornece
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
      await new Promise(resolve => setTimeout(resolve, 1000))
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
  const handleViewContact = (id: string) => {
    const region = regions.find((r: RegionType) => r.id === id);
    if (region && (region as any).contact) {
      const contactData: ContactData = {
        id: `contact_${region.id}`,
        name: (region as any).contact?.name || null,
        phone: (region as any).contact?.phone || null,
        mobile: null,
        email: (region as any).contact?.email || null,
        country: null,
        city: (region as any).contact?.city || null,
        address: null,
        full_address: null,
        postal_code: null,
        website: null,
        notes: null,
        is_primary: true,
        created_at: region.created_at,
        updated_at: region.created_at,
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setSelectedContact(contactData);
      setIsViewContactModalOpen(true);
    }
  };
  const handleViewBudget = (id: string) => {
    const region = regions.find((r: RegionType) => r.id === id);
    if (region) {
      const budgetData: AnnualBudgetData = {
        id: `budget_${region.id}`,
        year: new Date().getFullYear(),
        planned_budget: (region as any).total_budget || 0,
        total_expenses: (region as any).used_budget || 0,
        balance: ((region as any).total_budget || 0) - ((region as any).used_budget || 0),
        notes: `Budget for ${region.name} region`,
        approved_by: 'admin',
        status: 'in_progress',
        created_at: region.created_at,
        updated_at: new Date().toISOString(),
        created_by: 'system',
        updated_by: 'system',
        is_deleted: false
      };
      setSelectedRegion(region);
      setSelectedBudget(budgetData);
      setIsBudgetModalOpen(true);
    }
  };

  // Modal handlers
  const handleRegionCreated = (newRegion: any) => {
    toast.success(t.itemCreated)
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
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <MapPin className="w-4 h-4 text-green-600" />
                </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.institution_name}</div>
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
          <span className="font-medium">{row.original.churches_count}</span>
                                    </div>
      ),
    },
    // {
    //   id: "members",
    //   accessorKey: "members_count",
    //   header: t.members,
    //   cell: ({ row }) => (
    //     <span className="font-medium">{row.original.members_count.toLocaleString()}</span>
    //   ),
    // },
    {
      id: "subsidy_requests",
      accessorKey: "subsidy_requests",
      header: t.requests,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.original.subsidy_requests}</span>
                    </div>
      ),
    },
    // {
    //   id: "budget",
    //   accessorKey: "total_budget",
    //   header: t.budget,
    //   cell: ({ row }) => (
    //     <span className="font-medium">${row.original.total_budget.toLocaleString()}</span>
    //   ),
    // },
    {
      id: "utilization",
      header: t.utilization,
      cell: ({ row }) => {
        const totalBudget = (row.original as any).total_budget || 1
        const usedBudget = (row.original as any).used_budget || 0
        const utilization = Math.round((usedBudget / totalBudget) * 100)
        return (
          <Badge variant="outline" className={
            utilization > 80 ? 'bg-red-100 text-red-700' : 
            utilization > 60 ? 'bg-yellow-100 text-yellow-700' : 
            'bg-green-100 text-green-700'
          }>
            {utilization}%
          </Badge>
        )
      },
    },
    {
      id: "institution",
      accessorKey: "institution_name",
      header: "Institution",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-xs">{row.original.institution_name}</span>
                      </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status === 'active' ? t.active : t.inactive}
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
            <DropdownMenuItem onClick={() => handleViewBudget(row.original.id)}>
              <DollarSign className="w-4 h-4 mr-2" />
              View Budget
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewContact(row.original.id)}>
              <ContactRound className="w-4 h-4 mr-2" />
              {t.viewContact}
            </DropdownMenuItem>
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
              institutionId={currentInstitutionData?.id || ''}
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
              filterableColumns={[
                {
                  id: "institution",
                  title: "Instituição",
                  options: Array.from(new Set(regions.map((r: any) => r.institution_name))).map(name => ({ label: String(name), value: String(name) }))
                },
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: t.active, value: "active" },
                    { label: t.inactive, value: "inactive" },
                  ]
                }
              ]}
            />
          </CardContent>
        </Card>

        {/* Modals */}
        {selectedRegion && (
          <EditRegionModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
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
            parentRegions={[]}
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
          contact={selectedContact}
          entityName={selectedRegion?.name}
          entityType="Region"
        />
        
        {/* Annual Budget Modal */}
        {selectedRegion && (
          <AnnualBudgetModal
            isOpen={isBudgetModalOpen}
            onOpenChange={setIsBudgetModalOpen}
            budget={selectedBudget}
            entityType="region"
            entityName={selectedRegion.name}
            entityId={selectedRegion.id}
            onSave={handleBudgetSaved}
          />
        )}
      </div>
    </AppLayout>
  )
}
