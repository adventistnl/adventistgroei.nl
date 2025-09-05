"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { LanguageSelector } from "@/components/language-selector"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Phone
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Components
import { InstitutionsKPI } from "@/components/institutions/institutions-kpi"
import { InstitutionsCharts } from "@/components/institutions/institutions-charts"
import { DataTable } from "@/components/ui/data-table"
import { InstitutionModal } from "@/components/modals/institution-modal"

// Data
import {
  institutions,
  contacts,
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
  contact?: {
    country: string
    city: string
    email: string
    phone: string
    website?: string
  }
  regions_count: number
  churches_count: number
  users_count: number
  members_count: number
  total_subsidy_budget: number
  annual_department_budget: number
  pending_subsidies: number
}

export default function InstitutionsPage() {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all")
  
  // Data states
  const [institutionsData, setInstitutionsData] = useState<InstitutionWithDetails[]>([])
  const [kpiData, setKpiData] = useState<any>(null)
  const [chartData, setChartData] = useState<any>({
    churchesByRegion: [],
    usersByRole: [],
    subsidyOverTime: [],
    monthlySubsidies: []
  })

  const breadcrumbs = useMemo(() => [
    { name: t('institutions.title') }
  ], [t])

  usePageTitle({
    title: t('institutions.title'),
    breadcrumbs
  })

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const loadingToast = toast.loading(t('institutions.toasts.loaded'))
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Load institutions data
        const institutionsList = getInstitutionData()
        setInstitutionsData(institutionsList)
        
        // Load initial KPIs and charts for all institutions
        updateDataForInstitution("all")
        
        toast.dismiss(loadingToast)
        toast.success(t('institutions.toasts.loaded'), {
          duration: 3000
        })
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error(t('institutions.toasts.error_loading'))
        setIsLoading(false)
      }
    }

    loadData()
  }, [t])

  // Update data when institution filter changes
  const updateDataForInstitution = (institutionId: string) => {
    const targetId = institutionId === "all" ? undefined : institutionId
    
    // Update KPIs
    const kpis = getInstitutionKPIs(targetId)
    setKpiData(kpis)
    
    // Update chart data
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

  // Handle institution filter change
  const handleInstitutionChange = (institutionId: string) => {
    setSelectedInstitution(institutionId)
    updateDataForInstitution(institutionId)
    
    const institutionName = institutionId === "all" 
      ? "All Institutions" 
      : institutionsData.find(i => i.id === institutionId)?.name || "Unknown"
    
    toast.success(t('institutions.toasts.institution_switched'), {
      duration: 2000
    })
  }

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    
    const refreshToast = toast.loading("🔄 Refreshing data...")
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh data
      const institutionsList = getInstitutionData()
      setInstitutionsData(institutionsList)
      updateDataForInstitution(selectedInstitution)
      
      toast.dismiss(refreshToast)
      toast.success("✅ Data refreshed successfully!", {
        duration: 2000
      })
      
    } catch (error) {
      toast.dismiss(refreshToast)
      toast.error("❌ Failed to refresh data")
    } finally {
      setRefreshing(false)
    }
  }

  // Handle institution creation
  const handleInstitutionCreated = (data: any) => {
    // In a real app, this would make an API call
    // For now, we'll just show a success message and refresh
    handleRefresh()
  }

  // Table columns definition
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
      id: "contact",
      header: "Contact",
      cell: ({ row }) => {
        const contact = row.original.contact
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Mail className="w-3 h-3 text-muted-foreground" />
              <span>{contact?.email}</span>
            </div>
            {contact?.phone && (
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-3 h-3 text-muted-foreground" />
                <span>{contact.phone}</span>
              </div>
            )}
          </div>
        )
      },
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
      id: "denomination",
      title: t('institutions.filters.denomination'),
      options: [
        { label: "Seventh-day Adventist", value: "Seventh-day Adventist" },
        { label: "Baptist", value: "Baptist" },
        { label: "Methodist", value: "Methodist" },
      ]
    },
    {
      id: "language_preference",
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {t('institutions.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('institutions.subtitle')}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedInstitution} onValueChange={handleInstitutionChange}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('institutions.all_institutions')}</SelectItem>
                {institutionsData.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    {institution.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            <InstitutionModal onSuccess={handleInstitutionCreated}>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                {t('actions.create_institution')}
              </Button>
            </InstitutionModal>
            
            <LanguageSelector />
          </div>
        </div>

        {/* KPI Section */}
        {kpiData && (
          <InstitutionsKPI 
            data={kpiData} 
            loading={isLoading}
            institutionName={selectedInstitutionName}
          />
        )}

        <Separator />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              Overview
            </TabsTrigger>
            <TabsTrigger value="institutions" className="data-[state=active]:bg-background">
              Institutions List
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Charts */}
          <TabsContent value="overview" className="space-y-6">
            <InstitutionsCharts
              churchesByRegionData={chartData.churchesByRegion}
              usersByRoleData={chartData.usersByRole}
              subsidyOverTimeData={chartData.subsidyOverTime}
              monthlySubsidiesData={chartData.monthlySubsidies}
              loading={isLoading}
              institutionName={selectedInstitutionName}
            />
          </TabsContent>

          {/* Institutions List Tab - Data Table */}
          <TabsContent value="institutions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Institutions Management
                </CardTitle>
                <CardDescription>
                  Detailed view of all institutions with filtering and search capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={institutionsData}
                  searchKey="name"
                  searchPlaceholder={t('institutions.table.search_placeholder')}
                  filterableColumns={filterableColumns}
                  onRowClick={(institution) => {
                    toast.success(`Viewing ${institution.name} details`)
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}