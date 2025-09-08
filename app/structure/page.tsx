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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Phone,
  Layers,
  TreePine,
  Home,
  Shield,
  Calendar,
  MessageSquare,
  DollarSign,
  ContactRound
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Charts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
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
  AreaChart,
  Area,
  Legend
} from "recharts"

// Components
import { InstitutionsKPI } from "@/components/institutions/institutions-kpi"
import { InstitutionsCharts } from "@/components/institutions/institutions-charts"
import { DataTable } from "@/components/ui/data-table"
import { InstitutionModal } from "@/components/modals/institution-modal"
import { InstitutionProfileHeader } from "@/components/shared"
import { ContactModal } from "@/components/modals/contact"
import { EditInstitutionModal, DeleteInstitutionModal } from "@/components/modals/institution"
import { AddRegionModal, EditRegionModal, DeleteRegionModal } from "@/components/modals/region"
import { AddChurchModal, EditChurchModal, DeleteChurchModal } from "@/components/modals/church"
import { AddDepartmentModal, EditDepartmentModal, DeleteDepartmentModal } from "@/components/modals/department"

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

// Mock data for hierarchy
const mockRegions = [
  { id: 'r1', name: 'North Region', churches: 45, members: 12500, budget: 850000, used: 620000 },
  { id: 'r2', name: 'South Region', churches: 38, members: 10200, budget: 720000, used: 480000 },
  { id: 'r3', name: 'East Region', churches: 42, members: 11800, budget: 680000, used: 520000 },
  { id: 'r4', name: 'West Region', churches: 31, members: 8900, budget: 590000, used: 410000 },
  { id: 'r5', name: 'Central Region', churches: 28, members: 7600, budget: 520000, used: 380000 }
]

const mockChurches = [
  { id: 'c1', name: 'First Adventist Church', region: 'North Region', members: 850, budget: 45000, requests: 3 },
  { id: 'c2', name: 'Central Community Church', region: 'South Region', members: 720, budget: 38000, requests: 2 },
  { id: 'c3', name: 'Hope Baptist Church', region: 'East Region', members: 620, budget: 42000, requests: 4 },
  { id: 'c4', name: 'Grace Methodist Church', region: 'West Region', members: 580, budget: 35000, requests: 1 },
  { id: 'c5', name: 'Unity Presbyterian Church', region: 'Central Region', members: 490, budget: 32000, requests: 2 },
  { id: 'c6', name: 'Faith Lutheran Church', region: 'North Region', members: 680, budget: 41000, requests: 3 }
]

const mockDepartments = [
  { id: 'd1', name: 'Youth Ministry', church: 'First Adventist Church', budget: 85000, used: 62000, efficiency: 73 },
  { id: 'd2', name: 'Community Outreach', church: 'Central Community Church', budget: 72000, used: 48000, efficiency: 67 },
  { id: 'd3', name: 'Education Department', church: 'Hope Baptist Church', budget: 68000, used: 52000, efficiency: 76 },
  { id: 'd4', name: 'Health Services', church: 'Grace Methodist Church', budget: 59000, used: 41000, efficiency: 69 },
  { id: 'd5', name: 'Music Ministry', church: 'Unity Presbyterian Church', budget: 52000, used: 38000, efficiency: 73 }
]

const mockSubsidyData = [
  { month: 'Jan', budget: 120000, requested: 95000, distributed: 85000 },
  { month: 'Feb', budget: 115000, requested: 88000, distributed: 78000 },
  { month: 'Mar', budget: 130000, requested: 102000, distributed: 92000 },
  { month: 'Apr', budget: 125000, requested: 96000, distributed: 86000 },
  { month: 'May', budget: 135000, requested: 108000, distributed: 98000 },
  { month: 'Jun', budget: 140000, requested: 112000, distributed: 102000 }
]

const mockSubsidyTimeline = [
  { month: 'Jan', youth: 15, community: 8, education: 12, health: 6, music: 4 },
  { month: 'Feb', youth: 18, community: 10, education: 9, health: 8, music: 6 },
  { month: 'Mar', youth: 22, community: 12, education: 15, health: 7, music: 8 },
  { month: 'Apr', youth: 19, community: 9, education: 11, health: 9, music: 5 },
  { month: 'May', youth: 25, community: 14, education: 18, health: 10, music: 7 },
  { month: 'Jun', youth: 21, community: 11, education: 13, health: 8, music: 6 }
]

const mockBudgetUtilization = [
  { department: 'Youth', jan: 65, feb: 72, mar: 78, apr: 71, may: 85, jun: 73, available: 85000, used: 62000 },
  { department: 'Community', jan: 58, feb: 63, mar: 69, apr: 65, may: 74, jun: 67, available: 72000, used: 48000 },
  { department: 'Education', jan: 71, feb: 76, mar: 82, apr: 78, may: 88, jun: 76, available: 68000, used: 52000 },
  { department: 'Health', jan: 62, feb: 68, mar: 73, apr: 69, may: 77, jun: 69, available: 59000, used: 41000 },
  { department: 'Music', jan: 69, feb: 74, mar: 79, apr: 75, may: 82, jun: 73, available: 52000, used: 38000 }
]

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

export default function StructurePage() {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedInstitution, setSelectedInstitution] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createModalType, setCreateModalType] = useState<'institution' | 'region' | 'church' | 'department'>('institution')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isEditInstitutionModalOpen, setIsEditInstitutionModalOpen] = useState(false)
  const [isDeleteInstitutionModalOpen, setIsDeleteInstitutionModalOpen] = useState(false)
  const [isAddRegionModalOpen, setIsAddRegionModalOpen] = useState(false)
  const [isEditRegionModalOpen, setIsEditRegionModalOpen] = useState(false)
  const [isDeleteRegionModalOpen, setIsDeleteRegionModalOpen] = useState(false)
  const [isRegionContactModalOpen, setIsRegionContactModalOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [isAddChurchModalOpen, setIsAddChurchModalOpen] = useState(false)
  const [isEditChurchModalOpen, setIsEditChurchModalOpen] = useState(false)
  const [isDeleteChurchModalOpen, setIsDeleteChurchModalOpen] = useState(false)
  const [isChurchContactModalOpen, setIsChurchContactModalOpen] = useState(false)
  const [selectedChurch, setSelectedChurch] = useState<any>(null)
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false)
  const [isEditDepartmentModalOpen, setIsEditDepartmentModalOpen] = useState(false)
  const [isDeleteDepartmentModalOpen, setIsDeleteDepartmentModalOpen] = useState(false)
  const [isDepartmentContactModalOpen, setIsDepartmentContactModalOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  
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
      return institutionsData[0] || null // Default to first institution or null if empty
    }
    return institutionsData.find(inst => inst.id === selectedInstitution) || institutionsData[0] || null
  }, [selectedInstitution, institutionsData])

  const breadcrumbs = useMemo(() => [
    { name: "Structure & Organization" }
  ], [])

  usePageTitle({
    title: "Structure & Organization",
    breadcrumbs
  })

  // Derived datasets for Regions charts
  const subsidyRequestsByRegion = useMemo(() => {
    const regionToRequests = mockChurches.reduce<Record<string, number>>((acc, church) => {
      acc[church.region] = (acc[church.region] || 0) + (church.requests || 0)
      return acc
    }, {})
    return Object.entries(regionToRequests).map(([region, requests]) => ({ region, requests }))
  }, [])

  const budgetByRegion = useMemo(() => {
    return mockRegions.map(r => ({ region: r.name, budget: r.budget, used: r.used }))
  }, [])

  const membersByRegion = useMemo(() => {
    return mockRegions.map(r => ({ region: r.name, members: r.members }))
  }, [])

  const membersGrowthByRegion = useMemo(() => {
    // Mock growth data for top regions
    const north = mockRegions.find(r => r.name.includes('North'))?.members || 12000
    const south = mockRegions.find(r => r.name.includes('South'))?.members || 10000
    const east = mockRegions.find(r => r.name.includes('East'))?.members || 11000
    return [
      { month: 'Jan', 'North Region': Math.round(north * 0.96), 'South Region': Math.round(south * 0.95), 'East Region': Math.round(east * 0.95) },
      { month: 'Feb', 'North Region': Math.round(north * 0.97), 'South Region': Math.round(south * 0.96), 'East Region': Math.round(east * 0.96) },
      { month: 'Mar', 'North Region': Math.round(north * 0.985), 'South Region': Math.round(south * 0.975), 'East Region': Math.round(east * 0.975) },
      { month: 'Apr', 'North Region': Math.round(north * 1.0), 'South Region': Math.round(south * 0.99), 'East Region': Math.round(east * 0.99) },
      { month: 'May', 'North Region': Math.round(north * 1.01), 'South Region': Math.round(south * 1.0), 'East Region': Math.round(east * 1.0) },
      { month: 'Jun', 'North Region': Math.round(north * 1.02), 'South Region': Math.round(south * 1.01), 'East Region': Math.round(east * 1.01) },
    ]
  }, [])

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

  // Handle creation
  const handleCreate = (type: 'institution' | 'region' | 'church' | 'department') => {
    if (type === 'region') {
      setIsAddRegionModalOpen(true)
    } else if (type === 'church') {
      setIsAddChurchModalOpen(true)
    } else if (type === 'department') {
      setIsAddDepartmentModalOpen(true)
    } else {
      setCreateModalType(type)
      setIsCreateModalOpen(true)
    }
  }

  const handleCreateSubmit = async (data: any) => {
    const loadingToast = toast.loading(`Creating ${createModalType}...`)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(loadingToast)
      toast.success(`${createModalType.charAt(0).toUpperCase() + createModalType.slice(1)} created successfully!`)
      setIsCreateModalOpen(false)
      handleRefresh()
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(`Failed to create ${createModalType}`)
    }
  }

  const handleEdit = (type: string, id: string) => {
    if (type === 'region') {
      const region = mockRegions.find(r => r.id === id)
      if (region) {
        setSelectedRegion(region as any)
        setIsEditRegionModalOpen(true)
      }
    } else if (type === 'church') {
      const church = mockChurches.find(c => c.id === id)
      if (church) {
        setSelectedChurch(church as any)
        setIsEditChurchModalOpen(true)
      }
    } else if (type === 'department') {
      const department = mockDepartments.find(d => d.id === id)
      if (department) {
        setSelectedDepartment(department)
        setIsEditDepartmentModalOpen(true)
      }
    } else {
      toast.success(`Opening edit modal for ${type} ${id}`)
    }
  }

  const handleDelete = (type: string, id: string, name: string) => {
    if (type === 'region') {
      const region = mockRegions.find(r => r.id === id)
      if (region) {
        setSelectedRegion(region as any)
        setIsDeleteRegionModalOpen(true)
      }
    } else if (type === 'church') {
      const church = mockChurches.find(c => c.id === id)
      if (church) {
        setSelectedChurch(church as any)
        setIsDeleteChurchModalOpen(true)
      }
    } else if (type === 'department') {
      const department = mockDepartments.find(d => d.id === id)
      if (department) {
        setSelectedDepartment(department)
        setIsDeleteDepartmentModalOpen(true)
      }
    } else {
      toast.success(`Delete confirmation for ${type}: ${name}`)
    }
  }

  const handleView = (type: string, id: string) => {
    toast.success(`Viewing ${type} details: ${id}`)
  }

  const handleViewRegionContact = (type: string, id: string) => {
    if (type === 'region') {
      const region = mockRegions.find(r => r.id === id)
      if (region) {
        setSelectedRegion(region as any)
        setIsRegionContactModalOpen(true)
      }
    } else {
      toast.success(`Viewing contact for ${type}: ${id}`)
    }
  }

  const handleViewChurchContact = (type: string, id: string) => {
    if (type === 'church') {
      const church = mockChurches.find(c => c.id === id)
      if (church) {
        setSelectedChurch(church as any)
        setIsChurchContactModalOpen(true)
      }
    } else {
      toast.success(`Viewing contact for ${type}: ${id}`)
    }
  }

  const handleViewDepartmentContact = (type: string, id: string) => {
    if (type === 'department') {
      const department = mockDepartments.find(d => d.id === id)
      if (department) {
        setSelectedDepartment(department)
        setIsDepartmentContactModalOpen(true)
      }
    } else {
      toast.success(`Viewing contact for ${type}: ${id}`)
    }
  }

  // Handle institution creation
  const handleInstitutionCreated = (data: any) => {
    // In a real app, this would make an API call
    // For now, we'll just show a success message and refresh
    handleRefresh()
  }

  // Header action handlers
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
    if (activeInstitution) {
      setIsContactModalOpen(true)
    }
  }

  const handleManageRegions = () => {
    setActiveTab('regions')
    toast.success('Navigating to Regions management')
  }

  const handleManageChurches = () => {
    setActiveTab('churches')
    toast.success('Navigating to Churches management')
  }

  const handleManageDepartments = () => {
    setActiveTab('departments')
    toast.success('Navigating to Departments management')
  }

  // Modal handlers
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

  // Image upload handlers
  const handleInstitutionImageUpload = async (file: File) => {
    const loadingToast = toast.loading(t('institutions.toasts.image_uploading'))
    
    try {
      // Simulate API call for image upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would upload the file to your server and get back a URL
      const imageUrl = URL.createObjectURL(file) // Temporary URL for demo
      
      // Update the institution data with the new image URL
      if (activeInstitution) {
        const updatedInstitution = {
          ...activeInstitution,
          image_url: imageUrl
        }
        
        // Update the institutions data
        setInstitutionsData(prev => 
          prev.map(inst => 
            inst.id === activeInstitution.id ? updatedInstitution : inst
          )
        )
      }
      
      toast.dismiss(loadingToast)
      toast.success(t('institutions.toasts.image_uploaded'), {
        duration: 3000,
        icon: '✅'
      })
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('institutions.toasts.image_upload_failed'))
    }
  }

  const handleInstitutionImageRemove = async () => {
    const loadingToast = toast.loading(t('institutions.toasts.image_removing'))
    
    try {
      // Simulate API call for image removal
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the institution data to remove the image URL
      if (activeInstitution) {
        const updatedInstitution = {
          ...activeInstitution,
          image_url: undefined
        }
        
        // Update the institutions data
        setInstitutionsData(prev => 
          prev.map(inst => 
            inst.id === activeInstitution.id ? updatedInstitution : inst
          )
        )
      }
      
      toast.dismiss(loadingToast)
      toast.success(t('institutions.toasts.image_removed'), {
        duration: 3000,
        icon: '✅'
      })
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('institutions.toasts.image_remove_failed'))
    }
  }

  const handleRegionSaved = (regionData: any) => {
    toast.success(t('regions.toasts.created'))
    handleRefresh()
  }

  const handleRegionUpdated = (regionData: any) => {
    toast.success(t('regions.toasts.updated'))
    handleRefresh()
  }

  const handleRegionDeleted = (regionData: any) => {
    toast.success(t('regions.toasts.deactivated'))
    handleRefresh()
  }

  const handleRegionContactSaved = (contactData: any) => {
    toast.success(t('contacts.toasts.updated'))
    handleRefresh()
  }

  const handleChurchSaved = (churchData: any) => {
    toast.success(t('churches.toasts.created'))
    handleRefresh()
  }

  const handleDepartmentSaved = (departmentData: any) => {
    toast.success(t('departments.toasts.created'))
    handleRefresh()
  }

  const handleChurchUpdated = (churchData: any) => {
    toast.success(t('churches.toasts.updated'))
    handleRefresh()
  }

  const handleChurchDeleted = (churchData: any) => {
    toast.success(t('churches.toasts.deactivated'))
    handleRefresh()
  }

  const handleChurchContactSaved = (contactData: any) => {
    toast.success(t('contacts.toasts.updated'))
    handleRefresh()
  }

  const handleDepartmentUpdated = (departmentData: any) => {
    toast.success(t('departments.toasts.updated'))
    handleRefresh()
  }

  const handleDepartmentDeleted = (departmentData: any) => {
    toast.success(t('departments.toasts.deactivated'))
    handleRefresh()
  }

  const handleDepartmentContactSaved = (contactData: any) => {
    toast.success(t('contacts.toasts.updated'))
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
              Structure & Organization
            </h2>
            <p className="text-muted-foreground">
              Complete management of institutions, regions, churches, and departments
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
            onManageRegions={handleManageRegions}
            onManageChurches={handleManageChurches}
            onManageDepartments={handleManageDepartments}
            onImageUpload={handleInstitutionImageUpload}
            onImageRemove={handleInstitutionImageRemove}
          />
        )}

        {/* KPI Section */}
        {kpiData && (
          <InstitutionsKPI 
            data={kpiData} 
            loading={isLoading}
            institutionName={selectedInstitutionName}
          />
        )}

        <Separator />

        {/* Organizational Structure Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background flex items-center gap-2">
              <Building className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="regions" className="data-[state=active]:bg-background flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Regions
            </TabsTrigger>
            <TabsTrigger value="churches" className="data-[state=active]:bg-background flex items-center gap-2">
              <Home className="w-4 h-4" />
              Churches
            </TabsTrigger>
            <TabsTrigger value="departments" className="data-[state=active]:bg-background flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Departments
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Analytics */}
          <TabsContent value="overview" className="space-y-6">
            {/* Budget Highlights */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">Budget Overview</h3>
                <p className="text-muted-foreground">Comprehensive budget analysis across organizational levels</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Regions Budget Highlight */}
                <Card className="border-green-200 dark:border-green-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <MapPin className="w-5 h-5" />
                      Regions Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Allocated</span>
                      <span className="font-bold text-lg">${mockRegions.reduce((sum, r) => sum + r.budget, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Utilized</span>
                      <span className="font-bold text-lg text-green-600">${mockRegions.reduce((sum, r) => sum + r.used, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Efficiency</span>
                      <Badge className="bg-green-100 text-green-700">
                        {Math.round((mockRegions.reduce((sum, r) => sum + r.used, 0) / mockRegions.reduce((sum, r) => sum + r.budget, 0)) * 100)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Churches Budget Highlight */}
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Home className="w-5 h-5" />
                      Churches Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Allocated</span>
                      <span className="font-bold text-lg">${mockChurches.reduce((sum, c) => sum + c.budget, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Active Churches</span>
                      <span className="font-bold text-lg text-blue-600">{mockChurches.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg per Church</span>
                      <Badge className="bg-blue-100 text-blue-700">
                        ${Math.round(mockChurches.reduce((sum, c) => sum + c.budget, 0) / mockChurches.length).toLocaleString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Departments Budget Highlight */}
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                      <Layers className="w-5 h-5" />
                      Departments Budget
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Allocated</span>
                      <span className="font-bold text-lg">${mockDepartments.reduce((sum, d) => sum + d.budget, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Utilized</span>
                      <span className="font-bold text-lg text-emerald-600">${mockDepartments.reduce((sum, d) => sum + d.used, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg Efficiency</span>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {Math.round(mockDepartments.reduce((sum, d) => sum + d.efficiency, 0) / mockDepartments.length)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <InstitutionsCharts
              churchesByRegionData={chartData.churchesByRegion}
              usersByRoleData={chartData.usersByRole}
              subsidyOverTimeData={chartData.subsidyOverTime}
              monthlySubsidiesData={chartData.monthlySubsidies}
              loading={isLoading}
              institutionName={selectedInstitutionName}
            />
          </TabsContent>


          {/* Regions Tab */}
          <TabsContent value="regions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Regions Management</h3>
                <p className="text-muted-foreground">Manage regional structure and organization</p>
              </div>
              <Button onClick={() => handleCreate('region')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Region
              </Button>
            </div>

            {/* Regional Subsidy Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Budget</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${(kpiData?.totalBudget || 2500000).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Requested</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${(kpiData?.totalRequested || 1800000).toLocaleString()}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Distributed</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${(kpiData?.totalDistributed || 1200000).toLocaleString()}
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Utilization</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {kpiData?.totalBudget ? Math.round((kpiData.totalDistributed / kpiData.totalBudget) * 100) : 48}%
                      </p>
                    </div>
                    <Building className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Regions Chart */}
            <div className="space-y-6">
              {/* Main Chart - Regional Budget Distribution */}
              <div className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Regional Budget Distribution
              </CardTitle>
                    <CardDescription>Budget vs. Used amounts by region</CardDescription>
            </CardHeader>
            <CardContent>
                    <ChartContainer 
                      config={{
                        budget: { label: "Budget", color: "#10b981" },
                        used: { label: "Used", color: "#f59e0b" },
                      }} 
                      className="h-[360px] w-full"
                    >
                      <BarChart data={budgetByRegion}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="region" fontSize={11} />
                        <YAxis fontSize={11} tickFormatter={(value) => `$${(value / 1000)}K`} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="budget" fill="#10b981" radius={4} />
                        <Bar dataKey="used" fill="#f59e0b" radius={4} />
                      </BarChart>
                    </ChartContainer>
            </CardContent>
          </Card>
              </div>

              {/* Secondary Charts - 2 columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subsidy Requests by Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Subsidy Requests by Region
              </CardTitle>
                    <CardDescription>Total requests grouped by region</CardDescription>
            </CardHeader>
            <CardContent>
                    <ChartContainer 
                      config={{
                        requests: { label: "Requests", color: "#3b82f6" }
                      }} 
                      className="h-[300px] w-full"
                    >
                      <BarChart data={subsidyRequestsByRegion}>
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

                {/* Members Growth by Region */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Members Growth by Region
              </CardTitle>
                    <CardDescription>Monthly members growth trend</CardDescription>
            </CardHeader>
            <CardContent>
                    <ChartContainer 
                      config={{
                        north: { label: "North Region", color: "#3b82f6" },
                        south: { label: "South Region", color: "#10b981" },
                        east: { label: "East Region", color: "#f59e0b" },
                      }} 
                      className="h-[300px] w-full"
                    >
                      <LineChart data={membersGrowthByRegion}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" fontSize={11} />
                        <YAxis fontSize={11} tickFormatter={(value) => value.toLocaleString()} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line dataKey="North Region" stroke="#3b82f6" strokeWidth={2} dot={{ r: 2 }} />
                        <Line dataKey="South Region" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                        <Line dataKey="East Region" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                      </LineChart>
                    </ChartContainer>
            </CardContent>
          </Card>
        </div>
            </div>

            {/* Regions Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Regions List
              </CardTitle>
                <CardDescription>Complete list of regions with management actions</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                  columns={[
                    {
                      id: "name",
                      accessorKey: "name",
                      header: "Region Name",
                      cell: ({ row }) => (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="font-medium">{row.original.name}</div>
                        </div>
                      ),
                    },
                    {
                      id: "churches",
                      accessorKey: "churches",
                      header: "Churches",
                      cell: ({ row }) => (
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{row.original.churches}</span>
                        </div>
                      ),
                    },
                    {
                      id: "members",
                      accessorKey: "members",
                      header: "Members",
                      cell: ({ row }) => (
                        <span className="font-medium">{row.original.members.toLocaleString()}</span>
                      ),
                    },
                    {
                      id: "budget",
                      accessorKey: "budget",
                      header: "Budget",
                      cell: ({ row }) => (
                        <span className="font-medium">${row.original.budget.toLocaleString()}</span>
                      ),
                    },
                    {
                      id: "utilization",
                      header: "Utilization",
                      cell: ({ row }) => {
                        const utilization = Math.round((row.original.used / row.original.budget) * 100)
                        return (
                          <Badge variant="outline" className={utilization > 80 ? 'bg-red-100 text-red-700' : utilization > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                            {utilization}%
                          </Badge>
                        )
                      },
                    },
                    {
                      id: "actions",
                      header: "Actions",
                      cell: ({ row }) => (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleViewRegionContact('region', row.original.id)}>
                              <ContactRound className="w-4 h-4 mr-2" />
                              View Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit('region', row.original.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Region
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete('region', row.original.id, row.original.name)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Region
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ),
                    },
                  ]}
                  data={mockRegions}
                  searchKey="name"
                  searchPlaceholder="Search regions..."
                />
            </CardContent>
          </Card>
          </TabsContent>

          {/* Churches Tab */}
          <TabsContent value="churches" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Churches Management</h3>
                <p className="text-muted-foreground">Manage churches across all regions</p>
        </div>
              <Button onClick={() => handleCreate('church')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Church
              </Button>
            </div>

            {/* Church Subsidy Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Church Budget</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${(kpiData?.churchBudget || 1800000).toLocaleString()}
                      </p>
                    </div>
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Churches</p>
                      <p className="text-2xl font-bold text-green-600">
                        {kpiData?.activeChurches || 156}
                      </p>
                    </div>
                    <Building className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Subsidy Requests</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {kpiData?.pendingRequests || 23}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {(kpiData?.totalMembers || 55800).toLocaleString()}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Churches Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Churches by Region
                  </CardTitle>
                  <CardDescription>Distribution of churches across regions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer 
                    config={{
                      count: { label: "Churches", color: "#3b82f6" }
                    }} 
                    className="h-[300px] w-full"
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
                        <Legend />
                      </Pie>
                    </RechartsPieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Subsidy Distribution
                  </CardTitle>
                  <CardDescription>Budget allocation across churches</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer 
                    config={{
                      budget: { label: "Budget", color: "#10b981" },
                      requested: { label: "Requested", color: "#f59e0b" },
                      distributed: { label: "Distributed", color: "#3b82f6" }
                    }} 
                    className="h-[300px] w-full"
                  >
                    <BarChart data={mockSubsidyData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="month" fontSize={11} />
                      <YAxis 
                        fontSize={11} 
                        tickFormatter={(value) => `$${(value / 1000)}K`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="budget" fill="#10b981" radius={4} />
                      <Bar dataKey="requested" fill="#f59e0b" radius={4} />
                      <Bar dataKey="distributed" fill="#3b82f6" radius={4} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Churches Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Churches List
                </CardTitle>
                <CardDescription>Complete list of churches with management actions</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    {
                      id: "name",
                      accessorKey: "name",
                      header: "Church Name",
                      cell: ({ row }) => (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Home className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="font-medium">{row.original.name}</div>
                        </div>
                      ),
                    },
                    {
                      id: "region",
                      accessorKey: "region",
                      header: "Region",
                      cell: ({ row }) => (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{row.original.region}</span>
                        </div>
                      ),
                    },
                    {
                      id: "members",
                      accessorKey: "members",
                      header: "Members",
                      cell: ({ row }) => (
                        <span className="font-medium">{row.original.members.toLocaleString()}</span>
                      ),
                    },
                    {
                      id: "budget",
                      accessorKey: "budget",
                      header: "Budget",
                      cell: ({ row }) => (
                        <span className="font-medium">${row.original.budget.toLocaleString()}</span>
                      ),
                    },
                    {
                      id: "requests",
                      accessorKey: "requests",
                      header: "Subsidy Requests",
                      cell: ({ row }) => (
                        <Badge variant="outline" className={row.original.requests > 3 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                          {row.original.requests}
                        </Badge>
                      ),
                    },
                    {
                      id: "actions",
                      header: "Actions",
                      cell: ({ row }) => (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleViewChurchContact('church', row.original.id)}>
                              <ContactRound className="w-4 h-4 mr-2" />
                              View Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit('church', row.original.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Church
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete('church', row.original.id, row.original.name)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Church
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ),
                    },
                  ]}
                  data={mockChurches}
                  searchKey="name"
                  searchPlaceholder="Search churches..."
                  filterableColumns={[
                    {
                      id: "region",
                      title: "Region",
                      options: mockRegions.map(region => ({ label: region.name, value: region.name }))
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Departments Management</h3>
                <p className="text-muted-foreground">Manage departments and their budgets</p>
              </div>
              <Button onClick={() => handleCreate('department')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Department
              </Button>
            </div>

            {/* Department Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Budget</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        ${(kpiData?.annualBudget || 850000).toLocaleString()}
                      </p>
                    </div>
                    <Layers className="w-8 h-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget Used</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${(kpiData?.budgetUsed || 620000).toLocaleString()}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${((kpiData?.annualBudget || 850000) - (kpiData?.budgetUsed || 620000)).toLocaleString()}
                      </p>
                    </div>
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Efficiency</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {kpiData?.annualBudget ? Math.round(((kpiData.budgetUsed || 620000) / (kpiData.annualBudget || 850000)) * 100) : 73}%
                      </p>
                    </div>
                    <Building className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Departments Charts */}
            <div className="space-y-6">
              {/* Main Chart - Budget Utilization Trends (Flex 1) */}
              <div className="w-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Budget Utilization Trends
                    </CardTitle>
                    <CardDescription>Available, used, and remaining budget by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer 
                      config={{
                        available: { label: "Available Budget", color: "#10b981" },
                        used: { label: "Used Budget", color: "#f59e0b" },
                        remaining: { label: "Remaining Budget", color: "#3b82f6" }
                      }} 
                      className="h-[400px] w-full"
                    >
                      <BarChart data={mockBudgetUtilization.map(dept => ({
                        name: dept.department,
                        available: dept.available,
                        used: dept.used,
                        remaining: dept.available - dept.used,
                        utilization: Math.round((dept.used / dept.available) * 100)
                      }))}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" fontSize={11} />
                        <YAxis 
                          fontSize={11}
                          tickFormatter={(value) => `$${(value / 1000)}K`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="available" fill="#10b981" radius={4} />
                        <Bar dataKey="used" fill="#f59e0b" radius={4} />
                        <Bar dataKey="remaining" fill="#3b82f6" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Secondary Charts - Grid 2 columns (Flex 2) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subsidy Requests Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Subsidy Requests Timeline
                    </CardTitle>
                    <CardDescription>Monthly subsidy requests by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer 
                      config={{
                        youth: { label: "Youth Ministry", color: "#3b82f6" },
                        community: { label: "Community", color: "#10b981" },
                        education: { label: "Education", color: "#f59e0b" },
                        health: { label: "Health", color: "#ef4444" },
                        music: { label: "Music", color: "#8b5cf6" }
                      }} 
                      className="h-[300px] w-full"
                    >
                      <LineChart data={mockSubsidyTimeline}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" fontSize={11} />
                        <YAxis fontSize={11} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line dataKey="youth" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                        <Line dataKey="community" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                        <Line dataKey="education" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                        <Line dataKey="health" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                        <Line dataKey="music" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Department Budget Allocation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="w-5 h-5" />
                      Budget Allocation
                    </CardTitle>
                    <CardDescription>Current budget vs used by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer 
                      config={{
                        budget: { label: "Budget", color: "#10b981" },
                        used: { label: "Used", color: "#f59e0b" }
                      }} 
                      className="h-[300px] w-full"
                    >
                      <BarChart data={mockDepartments.map(dept => ({ 
                        name: dept.name.split(' ')[0], 
                        budget: dept.budget, 
                        used: dept.used 
                      }))}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" fontSize={11} />
                        <YAxis 
                          fontSize={11}
                          tickFormatter={(value) => `$${(value / 1000)}K`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="budget" fill="#10b981" radius={4} />
                        <Bar dataKey="used" fill="#f59e0b" radius={4} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Departments Table (Flex 1) */}
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Departments List
                </CardTitle>
                <CardDescription>Complete list of departments with budget tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={[
                    {
                      id: "name",
                      accessorKey: "name",
                      header: "Department Name",
                      cell: ({ row }) => (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Layers className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="font-medium">{row.original.name}</div>
                        </div>
                      ),
                    },
                    {
                      id: "church",
                      accessorKey: "church",
                      header: "Church",
                      cell: ({ row }) => (
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{row.original.church}</span>
                        </div>
                      ),
                    },
                    {
                      id: "budget",
                      accessorKey: "budget",
                      header: "Annual Budget",
                      cell: ({ row }) => (
                        <span className="font-medium">${row.original.budget.toLocaleString()}</span>
                      ),
                    },
                    {
                      id: "used",
                      accessorKey: "used",
                      header: "Budget Used",
                      cell: ({ row }) => (
                        <span className="font-medium">${row.original.used.toLocaleString()}</span>
                      ),
                    },
                    {
                      id: "efficiency",
                      accessorKey: "efficiency",
                      header: "Efficiency",
                      cell: ({ row }) => (
                        <Badge variant="outline" className={row.original.efficiency > 80 ? 'bg-red-100 text-red-700' : row.original.efficiency > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                          {row.original.efficiency}%
                        </Badge>
                      ),
                    },
                    {
                      id: "actions",
                      header: "Actions",
                      cell: ({ row }) => (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleViewDepartmentContact('department', row.original.id)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Contact
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit('department', row.original.id)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Department
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete('department', row.original.id, row.original.name)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Department
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ),
                    },
                  ]}
                  data={mockDepartments}
                  searchKey="name"
                  searchPlaceholder="Search departments..."
                  filterableColumns={[
                    {
                      id: "church",
                      title: "Church",
                      options: mockChurches.map(church => ({ label: church.name, value: church.name }))
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New {createModalType.charAt(0).toUpperCase() + createModalType.slice(1)}
              </DialogTitle>
              <DialogDescription>
                Add a new {createModalType} to the organizational structure
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" placeholder={`Enter ${createModalType} name`} />
              </div>
              
              {createModalType === 'institution' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="denomination">Denomination</Label>
                    <Input id="denomination" placeholder="Enter denomination" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language Preference</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="nl">Nederlands</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              {createModalType === 'department' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter department description" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Annual Budget</Label>
                    <Input id="budget" type="number" placeholder="Enter annual budget" />
                  </div>
                </>
              )}
              
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleCreateSubmit({})}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create {createModalType.charAt(0).toUpperCase() + createModalType.slice(1)}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contact Modal */}
        {activeInstitution && (
          <ContactModal
            isOpen={isContactModalOpen}
            onOpenChange={setIsContactModalOpen}
            contact={activeInstitution.contact ? {
              id: activeInstitution.contact_id || '',
              name: activeInstitution.contact?.name || '',
              phone: activeInstitution.contact?.phone || '',
              mobile: activeInstitution.contact?.mobile || '',
              email: activeInstitution.contact?.email || '',
              country: activeInstitution.contact?.country || '',
              city: activeInstitution.contact?.city || '',
              address: activeInstitution.contact?.address || '',
              full_address: activeInstitution.contact?.full_address || '',
              postal_code: activeInstitution.contact?.postal_code || '',
              website: activeInstitution.contact?.website || '',
              notes: activeInstitution.contact?.notes || '',
              is_primary: true,
              created_at: activeInstitution.created_at,
              updated_at: activeInstitution.updated_at,
              created_by: activeInstitution.created_by || '',
              updated_by: activeInstitution.updated_by || '',
              is_deleted: false,
              deleted_at: null,
              deleted_by: null
            } : null}
            entityName={activeInstitution.name}
            entityType="institution"
            onSave={handleContactSaved}
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

        {/* Add Region Modal */}
        {activeInstitution && (
          <AddRegionModal
            isOpen={isAddRegionModalOpen}
            onOpenChange={setIsAddRegionModalOpen}
            institutionId={activeInstitution.id}
            parentRegions={mockRegions.map(region => ({
              id: region.id,
              institution_id: activeInstitution.id,
              name: region.name,
              parent_region_id: null,
              contact_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }))}
            onSave={handleRegionSaved}
          />
        )}

        {/* Add Church Modal */}
        {activeInstitution && (
          <AddChurchModal
            isOpen={isAddChurchModalOpen}
            onOpenChange={setIsAddChurchModalOpen}
            institutionId={activeInstitution.id}
            regions={mockRegions.map(region => ({
              id: region.id,
              name: region.name,
              institution_id: activeInstitution.id
            }))}
            onSave={handleChurchSaved}
          />
        )}

        {/* Add Department Modal */}
        {activeInstitution && (
          <AddDepartmentModal
            isOpen={isAddDepartmentModalOpen}
            onOpenChange={setIsAddDepartmentModalOpen}
            institutionId={activeInstitution.id}
            churches={mockChurches.map(church => ({
              id: church.id,
              name: church.name,
              institution_id: activeInstitution.id
            }))}
            onSave={handleDepartmentSaved}
          />
        )}

        {/* Edit Department Modal */}
        {selectedDepartment && (
          <EditDepartmentModal
            isOpen={isEditDepartmentModalOpen}
            onOpenChange={setIsEditDepartmentModalOpen}
            department={{
              id: selectedDepartment.id,
              institution_id: activeInstitution?.id || '',
              church_id: selectedDepartment.church_id || '',
              name: selectedDepartment.name,
              description: selectedDepartment.description || '',
              annual_budget: selectedDepartment.budget,
              contact_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            churches={mockChurches.map(church => ({
              id: church.id,
              name: church.name,
              institution_id: activeInstitution?.id || ''
            }))}
            onSave={handleDepartmentUpdated}
          />
        )}

        {/* Delete Department Modal */}
        {selectedDepartment && (
          <DeleteDepartmentModal
            isOpen={isDeleteDepartmentModalOpen}
            onOpenChange={setIsDeleteDepartmentModalOpen}
            department={{
              id: selectedDepartment.id,
              institution_id: activeInstitution?.id || '',
              church_id: selectedDepartment.church_id || '',
              name: selectedDepartment.name,
              description: selectedDepartment.description || '',
              annual_budget: selectedDepartment.budget,
              contact_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            onSuccess={handleDepartmentDeleted}
          />
        )}

        {/* Department Contact Modal */}
        {selectedDepartment && (
          <ContactModal
            isOpen={isDepartmentContactModalOpen}
            onOpenChange={setIsDepartmentContactModalOpen}
            contact={{
              id: 'contact_' + selectedDepartment.id,
              name: 'Department Contact',
              phone: '+1 (555) 123-4567',
              mobile: '+1 (555) 987-6543',
              email: 'contact@department.com',
              country: 'Netherlands',
              city: 'Amsterdam',
              address: '123 Department Street',
              full_address: '123 Department Street, Amsterdam, Netherlands',
              postal_code: '1000 AB',
              website: 'https://department.example.com',
              notes: 'Primary contact for department inquiries',
              is_primary: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            entityName={selectedDepartment.name}
            entityType="department"
            onSave={handleDepartmentContactSaved}
          />
        )}

        {/* Edit Region Modal */}
        {selectedRegion && (
          <EditRegionModal
            isOpen={isEditRegionModalOpen}
            onOpenChange={setIsEditRegionModalOpen}
            region={{
              id: selectedRegion.id,
              institution_id: activeInstitution?.id || '',
              name: selectedRegion.name,
              parent_region_id: null,
              contact_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            parentRegions={mockRegions.map(region => ({
              id: region.id,
              name: region.name,
              institution_id: activeInstitution?.id || ''
            }))}
            onSave={handleRegionUpdated}
          />
        )}

        {/* Delete Region Modal */}
        {selectedRegion && (
          <DeleteRegionModal
            isOpen={isDeleteRegionModalOpen}
            onOpenChange={setIsDeleteRegionModalOpen}
            region={{
              id: selectedRegion.id,
              institution_id: activeInstitution?.id || '',
              name: selectedRegion.name,
              parent_region_id: null,
              contact_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            onSuccess={handleRegionDeleted}
          />
        )}

        {/* Region Contact Modal */}
        {selectedRegion && (
          <ContactModal
            isOpen={isRegionContactModalOpen}
            onOpenChange={setIsRegionContactModalOpen}
            contact={{
              id: 'contact_' + selectedRegion.id,
              name: 'Region Contact',
              phone: '+1 (555) 123-4567',
              mobile: '+1 (555) 987-6543',
              email: 'contact@region.com',
              country: 'Netherlands',
              city: 'Amsterdam',
              address: '123 Region Street',
              full_address: '123 Region Street, Amsterdam, Netherlands',
              postal_code: '1000 AB',
              website: 'https://region.example.com',
              notes: 'Primary contact for region inquiries',
              is_primary: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            entityName={selectedRegion.name}
            entityType="institution"
            onSave={handleRegionContactSaved}
          />
        )}

        {/* Edit Church Modal */}
        {selectedChurch && (
          <EditChurchModal
            isOpen={isEditChurchModalOpen}
            onOpenChange={setIsEditChurchModalOpen}
            church={{
              id: selectedChurch.id,
              institution_id: activeInstitution?.id || '',
              name: selectedChurch.name,
              region_id: selectedChurch.region_id || '',
              contact_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            regions={mockRegions.map(region => ({
              id: region.id,
              name: region.name,
              institution_id: activeInstitution?.id || ''
            }))}
            onSave={handleChurchUpdated}
          />
        )}

        {/* Delete Church Modal */}
        {selectedChurch && (
          <DeleteChurchModal
            isOpen={isDeleteChurchModalOpen}
            onOpenChange={setIsDeleteChurchModalOpen}
            church={{
              id: selectedChurch.id,
              institution_id: activeInstitution?.id || '',
              name: selectedChurch.name,
              region_id: selectedChurch.region_id || '',
              contact_id: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            onSuccess={handleChurchDeleted}
          />
        )}

        {/* Church Contact Modal */}
        {selectedChurch && (
          <ContactModal
            isOpen={isChurchContactModalOpen}
            onOpenChange={setIsChurchContactModalOpen}
            contact={{
              id: 'contact_' + selectedChurch.id,
              name: 'Church Contact',
              phone: '+1 (555) 123-4567',
              mobile: '+1 (555) 987-6543',
              email: 'contact@church.com',
              country: 'Netherlands',
              city: 'Amsterdam',
              address: '123 Church Street',
              full_address: '123 Church Street, Amsterdam, Netherlands',
              postal_code: '1000 AB',
              website: 'https://church.example.com',
              notes: 'Primary contact for church inquiries',
              is_primary: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              created_by: 'system',
              updated_by: 'system',
              is_deleted: false
            }}
            entityName={selectedChurch.name}
            entityType="church"
            onSave={handleChurchContactSaved}
          />
        )}
      </div>
    </AppLayout>
  )
}
