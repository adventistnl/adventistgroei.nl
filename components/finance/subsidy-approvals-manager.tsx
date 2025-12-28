"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Plus, 
  MoreHorizontal,
  Edit,
  Trash2,
  DollarSign,
  RefreshCw,
  Eye,
  FileText,
  LayoutGrid,
  List,
  Building,
  User,
  Calendar,
  TrendingUp,
  Settings
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast"
import { UseTable } from "@/components/ui/use-table"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { AnalyticsGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { KanbanBoard, KanbanGroup, KanbanItem, KanbanAction } from "@/components/ui/kanban-board"
import { StatusBadge } from "@/components/ui/status-badge"
import { ViewSubsidyModal } from "@/components/modals/project/view-subsidy-modal"
import { useCurrency } from "@/contexts/currency-context"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Import Charts
import { 
  RequestsOverTimeChart, 
  StatusOverviewChart, 
  RequestsByDepartmentChart 
} from "@/components/finance/charts"

// Charts
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
  Legend,
  ResponsiveContainer
} from "recharts"

interface SubsidyRequest {
  id: string
  title: string
  institution_name: string
  church_name?: string
  requested_amount: number
  approved_amount?: number
  status: "pending" | "in_review" | "approved" | "closed" | "rejected"
  requested_at: string
  reviewed_at?: string
  reviewed_by?: string
  activities_count: number
  total_budget: number
  priority: "low" | "medium" | "high"
  notes?: string
}

interface SubsidyApprovalsManagerProps {
  context?: string
  entityId?: string
  isLoading?: boolean
  onRefresh?: () => void
  title?: string
  description?: string
  showCharts?: boolean
  showKPICards?: boolean
}

export function SubsidyApprovalsManager({
  context = "general",
  entityId,
  isLoading = false,
  onRefresh,
  showCharts = true,
  showKPICards = true
}: SubsidyApprovalsManagerProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = useState<SubsidyRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')

  // Mock data para solicitações de subsídio
  const [subsidyRequests, setSubsidyRequests] = useState<SubsidyRequest[]>([
    {
      id: '1',
      title: 'Reforma do Templo Principal',
      institution_name: 'União Central Brasileira',
      church_name: 'Igreja Central de São Paulo',
      requested_amount: 15000,
      approved_amount: 12000,
      status: 'approved',
      requested_at: '2024-11-15',
      reviewed_at: '2024-11-20',
      reviewed_by: 'Carlos Ferreira',
      activities_count: 5,
      total_budget: 20000,
      priority: 'high',
      notes: 'Aprovado com redução de 20% conforme política institucional'
    },
    {
      id: '2',
      title: 'Equipamentos para Escola Sabatina',
      institution_name: 'União Central Brasileira',
      church_name: 'Igreja do Jardim Europa',
      requested_amount: 8000,
      status: 'in_review',
      requested_at: '2024-12-01',
      activities_count: 3,
      total_budget: 10000,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Materiais para Programa de Jovens',
      institution_name: 'Associação Paulista',
      church_name: 'Igreja do Brooklin',
      requested_amount: 5000,
      status: 'rejected',
      requested_at: '2024-10-10',
      reviewed_at: '2024-10-25',
      reviewed_by: 'Ana Costa',
      activities_count: 2,
      total_budget: 6000,
      priority: 'low',
      notes: 'Documentação incompleta'
    },
    {
      id: '4',
      title: 'Programa Missionário Trimestral',
      institution_name: 'União Central Brasileira',
      church_name: 'Igreja Vila Mariana',
      requested_amount: 12000,
      status: 'pending',
      requested_at: '2024-12-20',
      activities_count: 8,
      total_budget: 18000,
      priority: 'high'
    },
    {
      id: '5',
      title: 'Reforma da Cozinha Comunitária',
      institution_name: 'Associação Paulista',
      church_name: 'Igreja do Ipiranga',
      requested_amount: 7500,
      status: 'pending',
      requested_at: '2024-12-18',
      activities_count: 4,
      total_budget: 9500,
      priority: 'medium'
    },
    {
      id: '6',
      title: 'Material para Classe Bíblica',
      institution_name: 'União Sul Brasileira',
      church_name: 'Igreja de Curitiba Central',
      requested_amount: 3000,
      status: 'in_review',
      requested_at: '2024-12-10',
      activities_count: 2,
      total_budget: 4000,
      priority: 'low'
    }
  ])

  // KPI Data
  const kpiData = useMemo(() => {
    const totalRequests = subsidyRequests.length
    const pendingRequests = subsidyRequests.filter(r => r.status === 'pending').length
    const inReviewRequests = subsidyRequests.filter(r => r.status === 'in_review').length
    const approvedRequests = subsidyRequests.filter(r => r.status === 'approved').length
    const rejectedRequests = subsidyRequests.filter(r => r.status === 'rejected').length
    
    const totalRequested = subsidyRequests.reduce((sum, r) => sum + r.requested_amount, 0)
    const totalApproved = subsidyRequests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + (r.approved_amount || 0), 0)
    
    const approvalRate = totalRequests > 0 
      ? Math.round((approvedRequests / totalRequests) * 100) 
      : 0

    return {
      totalRequests,
      pendingRequests,
      inReviewRequests,
      approvedRequests,
      rejectedRequests,
      totalRequested,
      totalApproved,
      approvalRate
    }
  }, [subsidyRequests])

  const kpiCardsData: KPICardData[] = useMemo(() => [
    {
      id: "total_requests",
      title: "Total Requests",
      value: kpiData.totalRequests,
      icon: FileText,
      subtitle: "All subsidy requests",
      trend: {
        value: 15,
        isPositive: true,
        label: "vs. last month"
      }
    },
    {
      id: "pending_review",
      title: "Pending Review",
      value: kpiData.pendingRequests + kpiData.inReviewRequests,
      icon: Clock,
      subtitle: "Awaiting approval",
      trend: {
        value: 8,
        isPositive: false,
        label: "vs. last month"
      }
    },
    {
      id: "total_requested",
      title: "Total Requested",
      value: formatCurrency(kpiData.totalRequested),
      icon: DollarSign,
      subtitle: "Sum of all requests",
      trend: {
        value: 12,
        isPositive: true,
        label: "vs. last month"
      }
    },
    {
      id: "total_approved",
      title: "Total Approved",
      value: formatCurrency(kpiData.totalApproved),
      icon: CheckCircle,
      subtitle: "Approved amount",
      trend: {
        value: 10,
        isPositive: true,
        label: "vs. last month"
      }
    },
    {
      id: "approval_rate",
      title: "Approval Rate",
      value: `${kpiData.approvalRate}%`,
      icon: TrendingUp,
      subtitle: "Requests approved",
      trend: {
        value: 5,
        isPositive: true,
        label: "vs. last month"
      }
    }
  ], [kpiData, formatCurrency])

  // Chart data
  const chartData = useMemo(() => {
    return {
      byStatus: [
        { status: 'Pending', count: kpiData.pendingRequests, fill: '#f59e0b' },
        { status: 'In Review', count: kpiData.inReviewRequests, fill: '#3b82f6' },
        { status: 'Approved', count: kpiData.approvedRequests, fill: '#10b981' },
        { status: 'Rejected', count: kpiData.rejectedRequests, fill: '#ef4444' }
      ],
      byMonth: [
        { month: 'Aug', requests: 12, approved: 8 },
        { month: 'Sep', requests: 15, approved: 11 },
        { month: 'Oct', requests: 18, approved: 14 },
        { month: 'Nov', requests: 22, approved: 17 },
        { month: 'Dec', requests: 28, approved: 21 }
      ],
      byDepartment: [
        { department: "Education", q1: 15000, q2: 18000, q3: 20000, q4: 15000 },
        { department: "Youth Ministry", q1: 12000, q2: 11000, q3: 14000, q4: 10000 },
        { department: "Evangelism", q1: 9000, q2: 10000, q3: 11000, q4: 8000 },
        { department: "Health Ministry", q1: 5000, q2: 6000, q3: 6500, q4: 4000 },
        { department: "Communications", q1: 4000, q2: 4500, q3: 5000, q4: 3500 },
      ]
    }
  }, [kpiData, subsidyRequests])

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("Refreshing subsidy requests...")
    
    try {
      if (onRefresh) {
        await onRefresh()
      }
      toast.success("Data refreshed successfully", { duration: 2000 })
    } catch (error) {
      toast.error("Error refreshing data")
    } finally {
      toast.dismiss(refreshToast)
      setRefreshing(false)
    }
  }

  const handleViewSubsidy = (subsidyId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === subsidyId)
    if (subsidy) {
      setSelectedSubsidy(subsidy)
      setIsViewModalOpen(true)
    }
  }

  const handleApprove = (subsidyId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === subsidyId)
    if (!subsidy) return

    const updatedRequests = subsidyRequests.map(request =>
      request.id === subsidyId
        ? {
            ...request,
            status: 'approved' as const,
            approved_amount: request.requested_amount,
            reviewed_at: new Date().toISOString(),
            reviewed_by: 'Admin User'
          }
        : request
    )

    setSubsidyRequests(updatedRequests)
    toast.success(`Subsidy "${subsidy.title}" approved successfully`)
  }

  const handleReject = (subsidyId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === subsidyId)
    if (!subsidy) return

    const updatedRequests = subsidyRequests.map(request =>
      request.id === subsidyId
        ? {
            ...request,
            status: 'rejected' as const,
            reviewed_at: new Date().toISOString(),
            reviewed_by: 'Admin User',
            notes: 'Rejected by administrator'
          }
        : request
    )

    setSubsidyRequests(updatedRequests)
    toast.success(`Subsidy "${subsidy.title}" rejected`)
  }

  const handleMarkInReview = (subsidyId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === subsidyId)
    if (!subsidy) return

    const updatedRequests = subsidyRequests.map(request =>
      request.id === subsidyId
        ? { ...request, status: 'in_review' as const }
        : request
    )

    setSubsidyRequests(updatedRequests)
    toast.success(`Subsidy "${subsidy.title}" marked as in review`)
  }

  // Status configuration
  const statusConfig: Record<SubsidyRequest["status"], { 
    label: string
    variant: "success" | "warning" | "error" | "info" | "neutral"
    icon: any
  }> = {
    pending: { 
      label: "Pending", 
      variant: "warning",
      icon: Clock
    },
    in_review: { 
      label: "In Review", 
      variant: "info",
      icon: AlertCircle
    },
    approved: { 
      label: "Approved", 
      variant: "success",
      icon: CheckCircle
    },
    closed: { 
      label: "Closed", 
      variant: "neutral",
      icon: FileText
    },
    rejected: { 
      label: "Rejected", 
      variant: "error",
      icon: XCircle
    }
  }

  const priorityConfig: Record<SubsidyRequest["priority"], { 
    label: string
    variant: "success" | "warning" | "error" | "info" | "neutral"
  }> = {
    low: { label: "Low", variant: "neutral" },
    medium: { label: "Medium", variant: "info" },
    high: { label: "High", variant: "error" }
  }

  // Table columns
  const subsidyColumns: ColumnDef<SubsidyRequest>[] = [
    {
      id: "title",
      accessorKey: "title",
      header: "Request Title",
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          <div className="font-medium text-sm text-foreground">
            {row.original.title}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {row.original.church_name || row.original.institution_name}
          </div>
        </div>
      ),
    },
    {
      id: "requested_amount",
      accessorKey: "requested_amount",
      header: "Requested",
      cell: ({ row }) => (
        <div className="text-sm font-semibold">
          {formatCurrency(row.original.requested_amount)}
        </div>
      ),
    },
    {
      id: "activities",
      accessorKey: "activities_count",
      header: "Activities",
      cell: ({ row }) => (
        <div className="px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-fit">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {row.original.activities_count}
          </span>
        </div>
      ),
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const config = priorityConfig[row.original.priority]
        const dotColors = {
          high: 'bg-red-500',
          medium: 'bg-yellow-500',
          low: 'bg-green-500'
        }
        return (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-fit">
            <div className={`w-2 h-2 rounded-full ${dotColors[row.original.priority]}`} />
            <span className={`text-xs font-medium ${
              row.original.priority === 'high' ? 'text-red-700 dark:text-red-400' :
              row.original.priority === 'medium' ? 'text-yellow-700 dark:text-yellow-400' :
              'text-green-700 dark:text-green-400'
            }`}>
              {config.label}
            </span>
          </div>
        )
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const config = statusConfig[row.original.status]
        const dotColors = {
          pending: 'bg-amber-500',
          in_review: 'bg-blue-500',
          approved: 'bg-green-500',
          rejected: 'bg-red-500'
        }
        return (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-fit">
            <div className={`w-2 h-2 rounded-full ${dotColors[row.original.status]}`} />
            <span className={`text-xs font-medium ${
              row.original.status === 'pending' ? 'text-amber-700 dark:text-amber-400' :
              row.original.status === 'in_review' ? 'text-blue-700 dark:text-blue-400' :
              row.original.status === 'approved' ? 'text-green-700 dark:text-green-400' :
              'text-red-700 dark:text-red-400'
            }`}>
              {config.label}
            </span>
          </div>
        )
      },
    },
    {
      id: "requested_at",
      accessorKey: "requested_at",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {format(new Date(row.original.requested_at), "dd MMM yyyy", { locale: ptBR })}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end" data-action-button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewSubsidy(row.original.id)}>
                <Settings className="mr-2 h-4 w-4" />
                Manage Subsidy
              </DropdownMenuItem>
              
              {/* Approve/Reject buttons for pending and in_review */}
              {(row.original.status === 'pending' || row.original.status === 'in_review') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleApprove(row.original.id)}
                    className="text-green-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleReject(row.original.id)}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  // Convert to Kanban format
  const kanbanGroups: KanbanGroup[] = [
    { id: 'pending', name: 'Pending', color: '#f59e0b' },
    { id: 'in_review', name: 'In Review', color: '#3b82f6' },
    { id: 'approved', name: 'Approved', color: '#10b981' },
    { id: 'closed', name: 'Closed', color: '#6b7280' },
    { id: 'rejected', name: 'Rejected', color: '#ef4444' }
  ]

  const kanbanItems: KanbanItem[] = subsidyRequests.map(request => ({
    id: request.id,
    groupId: request.status,
    title: request.title,
    description: request.church_name || request.institution_name,
    icon: statusConfig[request.status].icon,
    metadata: {
      requested_amount: formatCurrency(request.requested_amount),
      activities_count: request.activities_count,
      priority: request.priority,
      requested_at: format(new Date(request.requested_at), "dd/MM/yyyy", { locale: ptBR })
    }
  }))

  const kanbanActions: KanbanAction[] = [
    {
      id: 'view',
      label: 'Manage Subsidy',
      icon: Settings,
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) handleViewSubsidy(item.id)
      }
    },
    {
      id: 'approve',
      label: 'Approve',
      icon: CheckCircle,
      variant: 'default',
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) handleApprove(item.id)
      }
    },
    {
      id: 'reject',
      label: 'Reject',
      icon: XCircle,
      variant: 'destructive',
      showInItem: true,
      onClick: (group, item) => {
        if (item?.id) handleReject(item.id)
      }
    }
  ]

  const handleKanbanItemMove = (itemId: string, fromGroupId: string, toGroupId: string) => {
    const statusMap: Record<string, SubsidyRequest["status"]> = {
      'pending': 'pending',
      'in_review': 'in_review',
      'approved': 'approved',
      'closed': 'closed',
      'rejected': 'rejected'
    }

    const newStatus = statusMap[toGroupId]
    if (!newStatus) return

    const updatedRequests = subsidyRequests.map(request =>
      request.id === itemId
        ? { 
            ...request, 
            status: newStatus,
            ...(newStatus === 'approved' && { 
              approved_amount: request.requested_amount,
              reviewed_at: new Date().toISOString(),
              reviewed_by: 'Admin User'
            }),
            ...(newStatus === 'rejected' && { 
              reviewed_at: new Date().toISOString(),
              reviewed_by: 'Admin User'
            })
          }
        : request
    )

    setSubsidyRequests(updatedRequests)
    toast.success('Subsidy status updated')
  }

  // Custom Kanban Item Renderer
  const renderKanbanItem = (item: KanbanItem, group: KanbanGroup, dragHandlers?: any) => {
    const itemActions = kanbanActions.filter(action => action.showInItem)
    const priority = item.metadata?.priority as SubsidyRequest["priority"] || 'low'
    
    // Priority flag colors
    const priorityFlagColors: Record<SubsidyRequest["priority"], string> = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    }
    
    return (
      <div
        className="bg-card border-l-4 border-border rounded-md p-3 shadow-sm hover:shadow-md transition-all cursor-pointer mb-3 last:mb-0 relative"
        style={{ borderLeftColor: group.color }}
        {...dragHandlers}
      >
        {/* Priority Flag */}
        <div className="absolute top-2 right-2">
          <div className={`w-2 h-2 rounded-full ${priorityFlagColors[priority]}`} title={priority} />
        </div>

        <div className="flex items-start justify-between gap-2 mb-2 pr-4">
          <h4 className="text-sm font-medium leading-tight">{item.title}</h4>
        </div>

        {item.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            {item.metadata?.requested_amount}
          </span>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {itemActions.map(action => {
                const ActionIcon = action.icon
                return (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => action.onClick(group, item)}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                  >
                    <ActionIcon className="mr-2 h-4 w-4" />
                    {action.label}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
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
        className={viewMode === 'table' ? 'rounded-r-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'rounded-r-none'}
      >
        <List className="h-4 w-4 mr-2" />
        {/* Table */}
      </Button>
      <Button
        variant={viewMode === 'kanban' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setViewMode('kanban')}
        className={viewMode === 'kanban' ? 'rounded-l-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'rounded-l-none'}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        {/* Kanban */}
      </Button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      {showKPICards && (
        <KPICards data={kpiCardsData} />
      )}

      {/* Charts Section */}
      {showCharts && (
        <AnalyticsGridCarousel
          className="w-full"
          enableAutoplay={false}
          autoplayDelay={5000}
        >
          {/* Requests by Department Chart */}
           <RequestsByDepartmentChart
            data={chartData.byDepartment}
            loading={isLoading}
            selectedYear={new Date().getFullYear()}
          />

          {/* Requests Over Time Chart */}
          <RequestsOverTimeChart
            data={chartData.byMonth}
            loading={isLoading}
            selectedYear={new Date().getFullYear()}
          />

          {/* Status Overview Chart */}
          <StatusOverviewChart
            data={chartData.byStatus}
            loading={isLoading}
          />

        </AnalyticsGridCarousel>
      )}

      {/* Subsidy Requests Table/Kanban */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subsidy Requests</CardTitle>
              <CardDescription>
                Manage and review all subsidy requests
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ViewToggle />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <UseTable
              data={subsidyRequests}
              columns={subsidyColumns}
              searchPlaceholder="Search requests..."
              enableFiltering
              enableSorting
            />
          ) : (
            <KanbanBoard
              groups={kanbanGroups}
              items={kanbanItems}
              actions={kanbanActions}
              onItemMove={handleKanbanItemMove}
              renderItem={renderKanbanItem}
              emptyStateMessage="No subsidy requests in this status"
            />
          )}
        </CardContent>
      </Card>

      {/* View Subsidy Modal */}
      {selectedSubsidy && (
        <ViewSubsidyModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false)
            setSelectedSubsidy(null)
          }}
          subsidy={{
            id: selectedSubsidy.id,
            title: selectedSubsidy.title,
            requested_at: selectedSubsidy.requested_at,
            status: selectedSubsidy.status,
            requested_amount: selectedSubsidy.requested_amount,
            institution_name: selectedSubsidy.institution_name
          }}
        />
      )}
    </div>
  )
}
