"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Building,
  Users,
  LayoutGrid,
  List,
  AlertTriangle,
  FileText,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import toast from "react-hot-toast"
import { DataTable } from "@/components/ui/data-table"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { KanbanBoard, KanbanGroup, KanbanItem, KanbanAction } from "@/components/ui/kanban-board"
import { useInstitution } from "@/contexts/institution-context"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { WithPermission } from "@/hocs/with-permission"

// Charts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
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
  Legend,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label as RechartsLabel,
  Area,
  AreaChart
} from "recharts"
import { CreateAnnualBudgetModal } from "@/components/modals/annual-budget/create-annual-budget-modal"
import { Label } from "@radix-ui/react-label"

// Interfaces for Budget Management
interface BudgetRequest {
  id: string
  entity_type: 'institution' | 'region' | 'church' | 'department'
  entity_id: string
  entity_name: string
  year: number
  requested_amount: number
  approved_amount?: number
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_revision'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'operational' | 'project' | 'maintenance' | 'emergency' | 'expansion'
  description: string
  justification: string
  requested_by: string
  reviewed_by?: string
  submitted_date: string
  review_date?: string
  approval_date?: string
  notes?: string
  documents?: string[]
  created_at: string
  updated_at: string
}

interface BudgetRequestGroup {
  id: string
  name: string
  description: string
  color: string
  status: string
  requests: BudgetRequest[]
}

/**
 * PÁGINA DE GESTÃO DE ORÇAMENTO ANUAL
 * Interface para gerenciar solicitações de orçamento de todas as entidades da organização
 */
export default function AnnualBudgetPage() {
  const { t } = useTranslation()
  const { currentInstitutionData } = useInstitution()
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban')
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  
  // Modal states
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false)
  const [isEditRequestModalOpen, setIsEditRequestModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null)

  usePageTitle({
    title: t('annual_budget.title')
  })

  // Mock data para solicitações de orçamento
  const [budgetRequests, setBudgetRequests] = useState<BudgetRequest[]>([
    {
      id: '1',
      entity_type: 'church',
      entity_id: 'church-1',
      entity_name: 'Central Church São Paulo',
      year: 2024,
      requested_amount: 125000,
      approved_amount: 100000,
      status: 'approved',
      priority: 'high',
      category: 'operational',
      description: 'Annual operational budget for church activities and ministries',
      justification: 'Essential funding for maintaining regular church operations, youth programs, and community outreach initiatives.',
      requested_by: 'Pastor João Silva',
      reviewed_by: 'Finance Committee',
      submitted_date: '2024-01-15',
      review_date: '2024-02-01',
      approval_date: '2024-02-10',
      notes: 'Approved with minor adjustments to equipment budget',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-02-10T14:15:00Z'
    },
    {
      id: '2',
      entity_type: 'department',
      entity_id: 'dept-youth',
      entity_name: 'Youth Ministry Department',
      year: 2024,
      requested_amount: 45000,
      status: 'under_review',
      priority: 'medium',
      category: 'project',
      description: 'Youth camp and evangelistic activities budget',
      justification: 'Special funding for youth summer camp, evangelistic programs, and leadership training initiatives.',
      requested_by: 'Maria Santos',
      reviewed_by: 'Budget Review Committee',
      submitted_date: '2024-02-20',
      review_date: '2024-03-01',
      notes: 'Under review - awaiting additional documentation',
      created_at: '2024-02-20T09:15:00Z',
      updated_at: '2024-03-01T11:30:00Z'
    },
    {
      id: '3',
      entity_type: 'region',
      entity_id: 'region-sp',
      entity_name: 'São Paulo Region',
      year: 2024,
      requested_amount: 350000,
      status: 'pending',
      priority: 'urgent',
      category: 'expansion',
      description: 'Regional expansion and new church plant initiatives',
      justification: 'Strategic investment in church planting, regional coordination, and infrastructure development.',
      requested_by: 'Pastor Carlos Mendes',
      submitted_date: '2024-03-10',
      created_at: '2024-03-10T16:20:00Z',
      updated_at: '2024-03-10T16:20:00Z'
    },
    {
      id: '4',
      entity_type: 'department',
      entity_id: 'dept-education',
      entity_name: 'Christian Education Department',
      year: 2024,
      requested_amount: 28000,
      status: 'requires_revision',
      priority: 'medium',
      category: 'operational',
      description: 'Educational materials and training programs',
      justification: 'Investment in curriculum development, teacher training, and educational resources.',
      requested_by: 'Ana Costa',
      reviewed_by: 'Education Committee',
      submitted_date: '2024-02-28',
      review_date: '2024-03-15',
      notes: 'Requires revision - need detailed breakdown of material costs',
      created_at: '2024-02-28T13:45:00Z',
      updated_at: '2024-03-15T10:00:00Z'
    },
    {
      id: '5',
      entity_type: 'church',
      entity_id: 'church-2',
      entity_name: 'Vila Madalena Church',
      year: 2024,
      requested_amount: 18000,
      status: 'rejected',
      priority: 'low',
      category: 'maintenance',
      description: 'Building maintenance and repairs',
      justification: 'Necessary repairs to church building and facilities.',
      requested_by: 'Elder Roberto Lima',
      reviewed_by: 'Facilities Committee',
      submitted_date: '2024-01-30',
      review_date: '2024-02-20',
      notes: 'Rejected - insufficient budget allocation for maintenance category',
      created_at: '2024-01-30T11:00:00Z',
      updated_at: '2024-02-20T15:30:00Z'
    },
    // Previous year requests (2023)
    {
      id: '6',
      entity_type: 'church',
      entity_id: 'church-3',
      entity_name: 'Liberdade Church',
      year: 2023,
      requested_amount: 95000,
      approved_amount: 85000,
      status: 'approved',
      priority: 'high',
      category: 'operational',
      description: '2023 Annual operational budget',
      justification: 'Funding for church operations and ministry activities for 2023.',
      requested_by: 'Pastor Maria Silva',
      reviewed_by: 'Finance Committee',
      submitted_date: '2023-01-10',
      review_date: '2023-01-25',
      approval_date: '2023-02-01',
      notes: 'Approved with conditions',
      created_at: '2023-01-10T10:30:00Z',
      updated_at: '2023-02-01T14:15:00Z'
    },
    {
      id: '7',
      entity_type: 'department',
      entity_id: 'dept-music',
      entity_name: 'Music Ministry Department',
      year: 2023,
      requested_amount: 22000,
      approved_amount: 20000,
      status: 'approved',
      priority: 'medium',
      category: 'project',
      description: 'Music equipment and training budget 2023',
      justification: 'Investment in new audio equipment and training for music ministry.',
      requested_by: 'Director Carlos Santos',
      reviewed_by: 'Ministry Committee',
      submitted_date: '2023-02-15',
      review_date: '2023-03-01',
      approval_date: '2023-03-10',
      created_at: '2023-02-15T09:15:00Z',
      updated_at: '2023-03-10T11:30:00Z'
    },
    // Future year requests (2025)
    {
      id: '8',
      entity_type: 'region',
      entity_id: 'region-rj',
      entity_name: 'Rio de Janeiro Region',
      year: 2025,
      requested_amount: 420000,
      status: 'pending',
      priority: 'urgent',
      category: 'expansion',
      description: 'Strategic expansion plan for Rio de Janeiro region 2025',
      justification: 'Major investment in church planting and regional development for 2025.',
      requested_by: 'Pastor Fernando Costa',
      submitted_date: '2024-12-01',
      created_at: '2024-12-01T16:20:00Z',
      updated_at: '2024-12-01T16:20:00Z'
    }
  ])

  // Form state


  // Available years for filtering
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(budgetRequests.map(req => req.year))).sort((a, b) => b - a)
    return years.length > 0 ? years : [new Date().getFullYear()]
  }, [budgetRequests])

  // Filtered budget requests based on selected year
  const filteredBudgetRequests = useMemo(() => {
    return budgetRequests.filter(req => req.year === selectedYear)
  }, [budgetRequests, selectedYear])

  // KPI Data
  const kpiData = useMemo(() => {
    const totalRequests = filteredBudgetRequests.length
    const totalRequested = filteredBudgetRequests.reduce((sum, req) => sum + req.requested_amount, 0)
    const totalApproved = filteredBudgetRequests
      .filter(req => req.status === 'approved')
      .reduce((sum, req) => sum + (req.approved_amount || 0), 0)
    const pendingReview = filteredBudgetRequests.filter(req => 
      req.status === 'pending' || req.status === 'under_review'
    ).length
    const approvalRate = totalRequests > 0 
      ? Math.round((filteredBudgetRequests.filter(req => req.status === 'approved').length / totalRequests) * 100)
      : 0

    return {
      totalRequests,
      totalRequested,
      totalApproved,
      pendingReview,
      approvalRate
    }
  }, [filteredBudgetRequests])

  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_requests",
      title: t('annual_budget.kpi_cards.total_requests.title'),
      value: kpiData.totalRequests,
      icon: FileText,
      subtitle: t('annual_budget.kpi_cards.total_requests.subtitle'),
      trend: {
        value: 12,
        isPositive: true,
        label: t('annual_budget.kpi_cards.total_requests.trend')
      }
    },
    {
      id: "total_requested",
      title: t('annual_budget.kpi_cards.total_requested.title'),
      value: `$${(kpiData.totalRequested / 1000).toFixed(0)}K`,
      icon: DollarSign,
      subtitle: t('annual_budget.kpi_cards.total_requested.subtitle'),
      trend: {
        value: 8,
        isPositive: true,
        label: t('annual_budget.kpi_cards.total_requested.trend')
      }
    },
    {
      id: "total_approved",
      title: t('annual_budget.kpi_cards.total_approved.title'),
      value: `$${(kpiData.totalApproved / 1000).toFixed(0)}K`,
      icon: CheckCircle,
      subtitle: t('annual_budget.kpi_cards.total_approved.subtitle'),
      trend: {
        value: 15,
        isPositive: true,
        label: t('annual_budget.kpi_cards.total_approved.trend')
      }
    },
    {
      id: "pending_review",
      title: t('annual_budget.kpi_cards.pending_review.title'),
      value: kpiData.pendingReview,
      icon: Clock,
      subtitle: t('annual_budget.kpi_cards.pending_review.subtitle'),
      trend: {
        value: 3,
        isPositive: false,
        label: t('annual_budget.kpi_cards.pending_review.trend')
      }
    },
    {
      id: "approval_rate",
      title: t('annual_budget.kpi_cards.approval_rate.title'),
      value: `${kpiData.approvalRate}%`,
      icon: TrendingUp,
      subtitle: t('annual_budget.kpi_cards.approval_rate.subtitle'),
      trend: {
        value: 5,
        isPositive: true,
        label: t('annual_budget.kpi_cards.approval_rate.trend')
      }
    }
  ], [kpiData, t])

  // Chart data
  const chartData = useMemo(() => {
    const totalBudgetForYear = 1000000 // Mock total annual budget
    const totalUsed = filteredBudgetRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + (r.approved_amount || 0), 0)
    const remaining = totalBudgetForYear - totalUsed

    // Generate mock spending data over time for area chart
    const generateSpendingData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.map((month, index) => {
        const baseChurch = 15000 + (index * 2000) + Math.random() * 5000
        const baseDepartment = 8000 + (index * 1500) + Math.random() * 3000
        const baseRegion = 25000 + (index * 3000) + Math.random() * 8000
        const baseInstitution = 12000 + (index * 1800) + Math.random() * 4000
        
        return {
          date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
          month: month,
          churches: Math.round(baseChurch),
          departments: Math.round(baseDepartment),
          regions: Math.round(baseRegion),
          institutions: Math.round(baseInstitution),
        }
      })
    }

    return {
      requestsByStatus: [
        { status: 'Approved', count: filteredBudgetRequests.filter(r => r.status === 'approved').length, color: '#10b981' },
        { status: 'Under Review', count: filteredBudgetRequests.filter(r => r.status === 'under_review').length, color: '#f59e0b' },
        { status: 'Pending', count: filteredBudgetRequests.filter(r => r.status === 'pending').length, color: '#3b82f6' },
        { status: 'Rejected', count: filteredBudgetRequests.filter(r => r.status === 'rejected').length, color: '#ef4444' },
        { status: 'Needs Revision', count: filteredBudgetRequests.filter(r => r.status === 'requires_revision').length, color: '#8b5cf6' }
      ],
      budgetDistribution: [
        { 
          year: selectedYear.toString(), 
          used: totalUsed, 
          remaining: remaining > 0 ? remaining : 0 
        }
      ],
      entitySpending: [
        { 
          entity: 'Churches', 
          approved: filteredBudgetRequests
            .filter(r => r.entity_type === 'church' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0), 0),
          spent: filteredBudgetRequests
            .filter(r => r.entity_type === 'church' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0) * 0.75, 0) // Mock 75% spent
        },
        { 
          entity: 'Departments', 
          approved: filteredBudgetRequests
            .filter(r => r.entity_type === 'department' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0), 0),
          spent: filteredBudgetRequests
            .filter(r => r.entity_type === 'department' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0) * 0.60, 0) // Mock 60% spent
        },
        { 
          entity: 'Regions', 
          approved: filteredBudgetRequests
            .filter(r => r.entity_type === 'region' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0), 0),
          spent: filteredBudgetRequests
            .filter(r => r.entity_type === 'region' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0) * 0.40, 0) // Mock 40% spent
        },
        { 
          entity: 'Institution', 
          approved: filteredBudgetRequests
            .filter(r => r.entity_type === 'institution' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0), 0),
          spent: filteredBudgetRequests
            .filter(r => r.entity_type === 'institution' && r.status === 'approved')
            .reduce((sum, r) => sum + (r.approved_amount || 0) * 0.85, 0) // Mock 85% spent
        }
      ],
      spendingOverTime: generateSpendingData()
    }
  }, [filteredBudgetRequests, selectedYear])

  // Chart configuration for area chart
  const spendingChartConfig = {
    spending: {
      label: "Spending",
    },
    churches: {
      label: "Churches",
      color: "var(--chart-1)",
    },
    departments: {
      label: "Departments", 
      color: "var(--chart-2)",
    },
    regions: {
      label: "Regions",
      color: "var(--chart-3)",
    },
    institutions: {
      label: "Institutions",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig

  // Time range state for area chart
  const [timeRange, setTimeRange] = useState("12m")

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading(t('annual_budget.messages.refreshing'))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(t('annual_budget.messages.refresh_success'), { duration: 2000 })
    } catch (error) {
      toast.error(t('annual_budget.messages.refresh_error'))
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(`Cannot add years beyond ${maxAllowedYear}`)
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error('This year already exists')
      return
    }

    // Add a placeholder budget request for the new year to make it available
    const placeholderRequest: BudgetRequest = {
      id: `placeholder-${nextYear}`,
      entity_type: 'institution',
      entity_id: `institution-${nextYear}`,
      entity_name: `System Placeholder ${nextYear}`,
      year: nextYear,
      requested_amount: 0,
      status: 'pending',
      priority: 'low',
      category: 'operational',
      description: `Placeholder for year ${nextYear}`,
      justification: 'System generated placeholder',
      requested_by: 'System',
      submitted_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setBudgetRequests([...budgetRequests, placeholderRequest])
    setSelectedYear(nextYear)
    toast.success(`Year ${nextYear} added successfully`)
  }

  const handleApproveRequest = (requestId: string, approvedAmount?: number) => {
    const updatedRequests = budgetRequests.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: 'approved' as const,
            approved_amount: approvedAmount || req.requested_amount,
            approval_date: new Date().toISOString().split('T')[0],
            reviewed_by: 'Finance Committee',
            updated_at: new Date().toISOString()
          }
        : req
    )
    setBudgetRequests(updatedRequests)
    toast.success('Budget request approved successfully')
  }

  const handleRejectRequest = (requestId: string, reason: string) => {
    const updatedRequests = budgetRequests.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: 'rejected' as const,
            review_date: new Date().toISOString().split('T')[0],
            reviewed_by: 'Finance Committee',
            notes: reason,
            updated_at: new Date().toISOString()
          }
        : req
    )
    setBudgetRequests(updatedRequests)
    toast.success('Budget request rejected')
  }

  const handleRequestRevision = (requestId: string, revisionNotes: string) => {
    const updatedRequests = budgetRequests.map(req =>
      req.id === requestId
        ? {
            ...req,
            status: 'requires_revision' as const,
            review_date: new Date().toISOString().split('T')[0],
            reviewed_by: 'Finance Committee',
            notes: revisionNotes,
            updated_at: new Date().toISOString()
          }
        : req
    )
    setBudgetRequests(updatedRequests)
    toast.success('Revision requested successfully')
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
      case 'under_review': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'requires_revision': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle
      case 'rejected': return XCircle
      case 'under_review': return Eye
      case 'requires_revision': return AlertTriangle
      case 'pending': return Clock
      default: return Clock
    }
  }

  // Table columns
  const columns: ColumnDef<BudgetRequest>[] = useMemo(() => [
    {
      id: "entity",
      accessorKey: "entity_name",
      header: t('annual_budget.table.headers.entity'),
      cell: ({ row }) => {
        const entityIcon = row.original.entity_type === 'church' ? Building : 
                          row.original.entity_type === 'region' ? Users : 
                          row.original.entity_type === 'department' ? Users : Building
        const EntityIcon = entityIcon
        
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <EntityIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">{row.original.entity_name}</div>
              <div className="text-xs text-muted-foreground capitalize">{row.original.entity_type}</div>
            </div>
          </div>
        )
      },
    },
    {
      id: "amount",
      accessorKey: "requested_amount",
      header: t('annual_budget.table.headers.amount'),
      cell: ({ row }) => (
        <div className="text-right">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
            ${row.original.requested_amount.toLocaleString()}
          </Badge>
          {row.original.approved_amount && (
            <div className="text-xs text-green-600 mt-1">
              Approved: ${row.original.approved_amount.toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: t('annual_budget.table.headers.status'),
      cell: ({ row }) => {
        const StatusIcon = getStatusIcon(row.original.status)
        return (
          <Badge className={`${getStatusColor(row.original.status)} flex items-center gap-1 font-medium`}>
            <StatusIcon className="w-3 h-3" />
            {row.original.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        )
      },
    },
    {
      id: "submitted_date",
      accessorKey: "submitted_date",
      header: t('annual_budget.table.headers.submitted'),
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300 font-medium">
          {new Date(row.original.submitted_date).toLocaleDateString()}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: t('annual_budget.table.headers.actions'),
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => {
              setSelectedRequest(row.original)
              setIsReviewModalOpen(true)
            }}>
              <Eye className="w-4 h-4 mr-2" />
              Review Request
            </DropdownMenuItem>
            {row.original.status === 'pending' && (
              <>
                <DropdownMenuItem onClick={() => handleApproveRequest(row.original.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Quick Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRequestRevision(row.original.id, 'Needs additional information')}>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Request Revision
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => {
              setSelectedRequest(row.original)
              setIsEditRequestModalOpen(true)
            }}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [t])

  // Kanban setup
  const kanbanGroups: KanbanGroup[] = [
    { id: 'pending', name: 'Pending Review', description: 'New requests awaiting initial review', color: '#3b82f6', active: true },
    { id: 'under_review', name: 'Under Review', description: 'Requests being evaluated', color: '#f59e0b', active: true },
    { id: 'requires_revision', name: 'Needs Revision', description: 'Requests requiring additional information', color: '#8b5cf6', active: true },
    { id: 'approved', name: 'Approved', description: 'Approved budget requests', color: '#10b981', active: true },
    { id: 'rejected', name: 'Rejected', description: 'Rejected requests', color: '#ef4444', active: true }
  ]

  const kanbanItems: KanbanItem[] = useMemo(() => {
    return filteredBudgetRequests.map(request => ({
      id: request.id,
      groupId: request.status,
      title: request.entity_name,
      description: request.description,
      metadata: {
        amount: `$${request.requested_amount.toLocaleString()}`,
        priority: request.priority,
        category: request.category,
        entity_type: request.entity_type,
        submitted_date: request.submitted_date
      }
    }))
  }, [filteredBudgetRequests])

  const kanbanActions: KanbanAction[] = [
    {
      id: 'review-request',
      label: 'Review',
      icon: Eye,
      showInItem: true,
      onClick: (group, item) => {
        const request = budgetRequests.find(r => r.id === item?.id)
        if (request) {
          setSelectedRequest(request)
          setIsReviewModalOpen(true)
        }
      }
    },
    {
      id: 'approve-request',
      label: 'Approve',
      icon: CheckCircle,
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) {
          handleApproveRequest(item.id)
        }
      }
    },
    {
      id: 'request-revision',
      label: 'Request Revision',
      icon: AlertTriangle,
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) {
          handleRequestRevision(item.id, 'Needs additional information')
        }
      }
    }
  ]

  const handleKanbanItemMove = (itemId: string, fromGroupId: string, toGroupId: string) => {
    const request = budgetRequests.find(req => req.id === itemId)
    if (!request) return

    const updatedRequests = budgetRequests.map(req =>
      req.id === itemId
        ? { 
            ...req, 
            status: toGroupId as BudgetRequest['status'], 
            updated_at: new Date().toISOString(),
            review_date: toGroupId !== 'pending' ? new Date().toISOString().split('T')[0] : req.review_date
          }
        : req
    )
    setBudgetRequests(updatedRequests)
    
    const statusNames = {
      pending: 'Pending Review',
      under_review: 'Under Review',
      requires_revision: 'Needs Revision',
      approved: 'Approved',
      rejected: 'Rejected'
    }
    
    toast.success(`${request.entity_name} moved to ${statusNames[toGroupId as keyof typeof statusNames]}`)
  }

  // Year Filter Component
  const YearFilter = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const canAddMore = Math.max(...availableYears) < maxAllowedYear

    return (
      <div className="mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">{t('annual_budget.year_filter.title')}</h3>
          <p className="text-sm text-muted-foreground">
            {filteredBudgetRequests.length === 1 
              ? t('annual_budget.year_filter.subtitle_single', { count: filteredBudgetRequests.length, year: selectedYear })
              : t('annual_budget.year_filter.subtitle_plural', { count: filteredBudgetRequests.length, year: selectedYear })
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: 'thin' }}>
          {availableYears.map((year) => (
            <Button
              key={year}
              variant="outline"
              size="sm"
              onClick={() => setSelectedYear(year)}
              className={`
                flex-shrink-0 min-w-[80px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
                ${selectedYear === year 
                  ? 'bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground border-muted hover:bg-muted/80 hover:text-foreground hover:border-muted-foreground/50'
                }
              `}
            >
              {year}
            </Button>
          ))}
          
          {/* Add New Year Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddYear}
            disabled={!canAddMore}
            className={`
              flex-shrink-0 min-w-[100px] h-10 text-sm font-medium transition-all duration-200 rounded-lg border-2
              ${canAddMore 
                ? 'border-dashed border-muted-foreground/40 text-muted-foreground hover:text-foreground hover:border-muted-foreground/60 hover:bg-muted/50' 
                : 'opacity-40 cursor-not-allowed border-dashed border-muted-foreground/20 text-muted-foreground/50'
              }
            `}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('annual_budget.buttons.add_year')}
          </Button>
        </div>
      </div>
    )
  }

  // View Toggle Component
  const ViewToggle = () => (
    <div className="flex items-center border rounded-md">
      <Button
        variant={viewMode === 'table' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('table')}
        className="rounded-r-none border-r"
      >
        <List className="w-4 h-4 mr-2" />
        Table
      </Button>
      <Button
        variant={viewMode === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('kanban')}
        className="rounded-l-none"
      >
        <LayoutGrid className="w-4 h-4 mr-2" />
        Kanban
      </Button>
    </div>
  )

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
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
      <WithPermission requiredPermissions={[PermissionResolverName.Settings]} fallback={<AccessDenied/>}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                {t('annual_budget.title')}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t('annual_budget.subtitle')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={() => setIsCreateRequestModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t('annual_budget.buttons.new_budget_request')}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                title={t('annual_budget.buttons.refresh')}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Year Filter */}
          <YearFilter />

          {/* KPI Cards */}
          <KPICards 
            data={kpiCardsData}
            isLoading={isLoading}
            minCardsForCarousel={5}
            showCarousel={true}
          />

          <Separator />

          {/* Charts Section */}
          <div className="space-y-6">
            {/* Entity Spending Over Time - Full Width Area Chart */}
            <Card>
              <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    {t('annual_budget.charts.spending_over_time.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('annual_budget.charts.spending_over_time.subtitle', { year: selectedYear })}
                  </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger
                    className="w-[160px] rounded-lg"
                    aria-label="Select time range"
                  >
                    <SelectValue placeholder="Last 12 months" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="12m" className="rounded-lg">
                      {t('annual_budget.charts.spending_over_time.time_ranges.12m')}
                    </SelectItem>
                    <SelectItem value="6m" className="rounded-lg">
                      {t('annual_budget.charts.spending_over_time.time_ranges.6m')}
                    </SelectItem>
                    <SelectItem value="3m" className="rounded-lg">
                      {t('annual_budget.charts.spending_over_time.time_ranges.3m')}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                  config={spendingChartConfig}
                  className="aspect-auto h-[300px] w-full"
                >
                  <AreaChart data={chartData.spendingOverTime}>
                    <defs>
                      <linearGradient id="fillChurches" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-churches)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-churches)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillDepartments" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-departments)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-departments)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillRegions" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-regions)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-regions)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient id="fillInstitutions" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="var(--color-institutions)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-institutions)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={32}
                    />
                    <YAxis tickFormatter={(value) => `$${(value / 1000)}K`} />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) => `${value} ${selectedYear}`}
                          indicator="dot"
                          formatter={(value: any, name: any) => [
                            `$${(typeof value === 'number' ? value : 0).toLocaleString()}`,
                            spendingChartConfig[name as keyof typeof spendingChartConfig]?.label || String(name)
                          ]}
                        />
                      }
                    />
                    <Area
                      dataKey="institutions"
                      type="natural"
                      fill="url(#fillInstitutions)"
                      stroke="var(--color-institutions)"
                      stackId="a"
                    />
                    <Area
                      dataKey="regions"
                      type="natural"
                      fill="url(#fillRegions)"
                      stroke="var(--color-regions)"
                      stackId="a"
                    />
                    <Area
                      dataKey="departments"
                      type="natural"
                      fill="url(#fillDepartments)"
                      stroke="var(--color-departments)"
                      stackId="a"
                    />
                    <Area
                      dataKey="churches"
                      type="natural"
                      fill="url(#fillChurches)"
                      stroke="var(--color-churches)"
                      stackId="a"
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Other Charts - Reorganized Layout */}
            <div className="grid lg:grid-cols-7 gap-6">
              {/* Left Column - Smaller Charts */}
              <div className="lg:col-span-3 space-y-6">
                {/* Requests by Status - PIE Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="w-4 h-4" />
                      Requests by Status
                    </CardTitle>
                    <CardDescription className="text-sm">Status distribution for {selectedYear}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer 
                      config={{
                        count: { label: "Count", color: "#3b82f6" }
                      }} 
                      className="h-[200px] w-full"
                    >
                      <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie
                          data={chartData.requestsByStatus}
                          dataKey="count"
                          nameKey="status"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          paddingAngle={2}
                        >
                          {chartData.requestsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                      </RechartsPieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Budget Distribution - Radial Chart */}
                <Card className="flex flex-col">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="text-lg">Budget Distribution {selectedYear}</CardTitle>
                    <CardDescription className="text-sm">Total budget allocation and usage</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-center pb-0">
                    <ChartContainer
                      config={{
                        used: {
                          label: "Used",
                          color: "var(--chart-1)",
                        },
                        remaining: {
                          label: "Remaining",
                          color: "var(--chart-2)",
                        },
                      }}
                      className="mx-auto aspect-square w-full max-w-[180px]"
                    >
                      <RadialBarChart
                        data={chartData.budgetDistribution}
                        endAngle={180}
                        innerRadius={60}
                        outerRadius={90}
                      >
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                          <RechartsLabel
                            content={({ viewBox }) => {
                              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                const totalBudget = chartData.budgetDistribution[0]?.used + chartData.budgetDistribution[0]?.remaining || 0
                                const usedAmount = chartData.budgetDistribution[0]?.used || 0
                                const percentage = totalBudget > 0 ? Math.round((usedAmount / totalBudget) * 100) : 0
                                
                                return (
                                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) - 10}
                                      className="fill-foreground text-xl font-bold"
                                    >
                                      {percentage}%
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 8}
                                      className="fill-muted-foreground text-sm"
                                    >
                                      Used
                                    </tspan>
                                  </text>
                                )
                              }
                            }}
                          />
                        </PolarRadiusAxis>
                        <RadialBar
                          dataKey="used"
                          stackId="a"
                          cornerRadius={5}
                          fill="var(--color-used)"
                          className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                          dataKey="remaining"
                          fill="var(--color-remaining)"
                          stackId="a"
                          cornerRadius={5}
                          className="stroke-transparent stroke-2"
                        />
                      </RadialBarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col gap-1 text-xs">
                    <div className="flex items-center gap-1 leading-none font-medium">
                      Budget utilization tracking <TrendingUp className="h-3 w-3" />
                    </div>
                    <div className="text-muted-foreground leading-none">
                      Showing budget usage for {selectedYear}
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Right Column - Entity Spending Bar Chart */}
              <div className="lg:col-span-4">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Entity Spending Limits
                    </CardTitle>
                    <CardDescription>
                      Approved vs spent amounts by entity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ChartContainer 
                      config={{
                        approved: {
                          label: "Approved",
                          color: "var(--chart-1)",
                        },
                        spent: {
                          label: "Spent",
                          color: "var(--chart-2)",
                        },
                      }}
                      className="h-[400px] w-full"
                    >
                      <BarChart data={chartData.entitySpending}>
                        <XAxis
                          dataKey="entity"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 10)}
                        />
                        <YAxis tickFormatter={(value) => `$${(value / 1000)}K`} />
                        <Bar
                          dataKey="approved"
                          stackId="a"
                          fill="var(--color-approved)"
                          radius={[0, 0, 4, 4]}
                        />
                        <Bar
                          dataKey="spent"
                          stackId="a"
                          fill="var(--color-spent)"
                          radius={[4, 4, 0, 0]}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent labelKey="entity" indicator="line" />
                          }
                          cursor={false}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Separator />

          {/* Budget Requests - Table or Kanban View */}
          {viewMode === 'table' ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Budget Requests
                    </CardTitle>
                    <CardDescription>
                      Manage and review budget requests from all organizational entities
                    </CardDescription>
                  </div>
                  
                  <ViewToggle />
                </div>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <DataTable
                  columns={columns}
                  data={filteredBudgetRequests}
                  searchKey="entity_name"
                  searchPlaceholder="Search budget requests..."
                  filterableColumns={[
                    {
                      id: "status",
                      title: "Status",
                      options: [
                        { label: "Pending", value: "pending" },
                        { label: "Under Review", value: "under_review" },
                        { label: "Approved", value: "approved" },
                        { label: "Rejected", value: "rejected" },
                        { label: "Needs Revision", value: "requires_revision" },
                      ]
                    },
                    {
                      id: "entity_type",
                      title: "Entity Type",
                      options: [
                        { label: "Church", value: "church" },
                        { label: "Department", value: "department" },
                        { label: "Region", value: "region" },
                        { label: "Institution", value: "institution" },
                      ]
                    }
                  ]}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <LayoutGrid className="w-5 h-5" />
                      Budget Requests - Kanban View
                    </CardTitle>
                    <CardDescription>
                      Drag and drop interface to manage budget request workflow
                    </CardDescription>
                  </div>
                  
                  <ViewToggle />
                </div>
              </CardHeader>
              <CardContent className="overflow-hidden">
                <KanbanBoard
                  groups={kanbanGroups}
                  items={kanbanItems}
                  actions={kanbanActions}
                  onItemMove={handleKanbanItemMove}
                  isLoading={isLoading}
                  maxHeight="calc(100vh - 300px)"
                  enableDragDrop={true}
                  renderItem={(item, group, dragHandlers) => (
                    <Card 
                      key={item.id}
                      className={`relative w-full p-3 border border-border/50 hover:border-border transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md ${dragHandlers?.className || ''}`}
                      draggable={dragHandlers?.draggable}
                      onDragStart={dragHandlers?.onDragStart}
                      onDragEnd={dragHandlers?.onDragEnd}
                    >
                      <div 
                        className="absolute top-2 right-2 w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: group.color }}
                      />
                      
                      <div className="space-y-3 pr-4">
                        <div className="flex items-start gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <span className="font-medium text-sm line-clamp-2 flex-1">{item.title}</span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                            {item.metadata?.amount}
                          </Badge>
                          
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300 capitalize">
                            {item.metadata?.entity_type}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Create Request Modal */}
          <CreateAnnualBudgetModal 
            isCreateRequestModalOpen={isCreateRequestModalOpen}
            setIsCreateRequestModalOpen={setIsCreateRequestModalOpen}
          />

          {/* Review Request Modal */}
          {selectedRequest && (
            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{t('annual_budget.modals.review_request.title')}</DialogTitle>
                  <DialogDescription>
                    {selectedRequest.entity_name} - {t(`annual_budget.entity_types.${selectedRequest.entity_type}`)}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Request Amount */}
                  <div className="text-center">
                    <Label className="text-sm font-medium text-muted-foreground">{t('annual_budget.modals.review_request.labels.requested_amount')}</Label>
                    <div className="mt-2">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-lg px-4 py-2">
                        ${selectedRequest.requested_amount.toLocaleString()}
                      </Badge>
                      {selectedRequest.approved_amount && (
                        <div className="text-sm text-green-600 mt-2">
                          Approved: ${selectedRequest.approved_amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status and Submitted Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <Label className="text-sm font-medium text-muted-foreground">{t('annual_budget.modals.review_request.labels.status')}</Label>
                      <div className="mt-2">
                        <Badge className={`${getStatusColor(selectedRequest.status)} flex items-center gap-1 justify-center`}>
                          {selectedRequest.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center">
                      <Label className="text-sm font-medium text-muted-foreground">{t('annual_budget.modals.review_request.labels.submitted')}</Label>
                      <div className="mt-2">
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                          {new Date(selectedRequest.submitted_date).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  {selectedRequest.notes && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">{t('annual_budget.modals.review_request.labels.notes')}</Label>
                      <div className="mt-2 p-3 bg-muted rounded-lg border">
                        <p className="text-sm">{selectedRequest.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleRequestRevision(selectedRequest.id, 'Needs additional documentation')}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      {t('annual_budget.actions.request_revision')}
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleRejectRequest(selectedRequest.id, 'Does not meet budget criteria')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      {t('annual_budget.actions.reject')}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsReviewModalOpen(false)}>
                      {t('annual_budget.actions.close')}
                    </Button>
                    <Button onClick={() => handleApproveRequest(selectedRequest.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t('annual_budget.actions.approve')}
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}


        </div>
      </WithPermission>
    </AppLayout>
  )
}