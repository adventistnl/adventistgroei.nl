"use client"

import React, { useState, useMemo } from "react"
import { useMutation, useQuery } from "@apollo/client"
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
import { APPROVE_SUBSIDY_REQUEST, REJECT_SUBSIDY_REQUEST, UPDATE_SUBSIDY_REQUEST } from "@/graphql/mutations/SUBSIDY_REQUEST_MUTATIONS"
import { GET_ALL_SUBSIDY_STATUSES } from "@/graphql/queries/SUBSIDY_STATUS_QUERIES"

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
  items?: Array<{
    id: string
    activity_id: string
    activity_name: string
    requested_amount: number
    approved_amount: number
    budget_amount: number
    notes?: string
  }>
  department_name?: string
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
  subsidyData?: any
  analyticsData?: any
  refetchSubsidies?: () => Promise<any>
}

export function SubsidyApprovalsManager({
  context = "general",
  entityId,
  isLoading = false,
  onRefresh,
  showCharts = true,
  showKPICards = true,
  subsidyData,
  analyticsData,
  refetchSubsidies
}: SubsidyApprovalsManagerProps) {
  const { t } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedSubsidy, setSelectedSubsidy] = useState<SubsidyRequest | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')

  // Fetch all subsidy statuses for ID resolution
  const { data: statusesData } = useQuery(GET_ALL_SUBSIDY_STATUSES)

  // Mutations for approve/reject
  const [approveSubsidyMutation] = useMutation(APPROVE_SUBSIDY_REQUEST, {
    onCompleted: async () => {
      toast.success("Subsídio aprovado com sucesso")
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
    },
    onError: (err) => toast.error(`Erro ao aprovar: ${err.message}`)
  })

  const [rejectSubsidyMutation] = useMutation(REJECT_SUBSIDY_REQUEST, {
    onCompleted: async () => {
      toast.success("Subsídio rejeitado")
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
    },
    onError: (err) => toast.error(`Erro ao rejeitar: ${err.message}`)
  })

  const [updateSubsidyMutation] = useMutation(UPDATE_SUBSIDY_REQUEST, {
    onCompleted: async () => {
      toast.success("Status atualizado com sucesso")
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
    },
    onError: (err) => toast.error(`Erro ao atualizar status: ${err.message}`)
  })

  // Helper function to get status ID by name from the statuses query
  const getStatusIdByName = (statusName: string): string | null => {
    if (!statusesData?.subsidyStatuses) return null
    
    const status = statusesData.subsidyStatuses.find((s: any) => 
      s.name?.toUpperCase() === statusName.toUpperCase()
    )
    return status?.id || null
  }

  // Transform backend data to component format
  const mapBackendStatus = (statusName: string): SubsidyRequest['status'] => {
    const statusMap: Record<string, SubsidyRequest['status']> = {
      'PENDING': 'pending',
      'IN_REVIEW': 'in_review',
      'APPROVED': 'approved',
      'REJECTED': 'rejected',
      'CLOSED': 'closed'
    }
    return statusMap[statusName?.toUpperCase()] || 'pending'
  }

  const subsidyRequests: SubsidyRequest[] = useMemo(() => {
    if (!subsidyData?.subsidyRequests) return []
    
    return subsidyData.subsidyRequests.map((request: any) => ({
      id: request.id,
      title: request.description || request.project?.title || 'Solicitação sem título',
      institution_name: request.institution?.name || '',
      church_name: request.church?.name,
      requested_amount: parseFloat(request.total_budget) || 0,
      approved_amount: request.approved_amount ? parseFloat(request.approved_amount) : undefined,
      status: mapBackendStatus(request.subsidy_status?.name),
      requested_at: request.created_at,
      reviewed_at: request.approved_at,
      reviewed_by: request.approved_by,
      activities_count: request.items?.length || 0,
      total_budget: parseFloat(request.total_budget) || 0,
      priority: 'medium' as const, // Default priority
      notes: request.rejection_reason,
      items: request.items?.map((item: any) => ({
        id: item.id,
        activity_id: item.project_activity_id,
        activity_name: item.project_activity?.name || 'Unknown',
        requested_amount: parseFloat(item.requested_amount) || 0,
        approved_amount: parseFloat(item.approved_amount) || 0,
        budget_amount: parseFloat(item.project_activity?.budget_amount) || 0,
        notes: item.notes
      })) || [],
      department_name: request.department?.name || 'Other'
    }))
  }, [subsidyData])

  // KPI Data
  // KPI Data from Backend
  const kpiData = useMemo(() => {
    const kpis = analyticsData?.subsidyKPIs || {}
    
    return {
      totalRequests: kpis.totalRequests || 0,
      pendingRequests: kpis.pendingRequests || 0,
      inReviewRequests: kpis.inReviewRequests || 0,
      approvedRequests: kpis.approvedRequests || 0,
      rejectedRequests: kpis.rejectedRequests || 0,
      totalRequested: kpis.totalRequested || 0,
      totalApproved: kpis.totalApproved || 0,
      approvalRate: kpis.approvalRate || 0
    }
  }, [analyticsData])

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
  // Chart data from Backend returns
  const chartData = useMemo(() => {
    // If no analytics data, return empty structures
    if (!analyticsData) {
      return {
        byStatus: [],
        byMonth: [],
        byDepartment: []
      }
    }

    // Map backend data to frontend chart formats
    
    // 1. By Department (RequestsByDepartmentChart)
    // Backend returns [{ month, department, amount }]
    // Frontend needs [{ month: 'Jan', 'Dept A': 100, 'Dept B': 200 }]
    const byDepartmentData: any[] = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
    if (analyticsData.subsidyByDepartment) {
      // Group by month
      const groupedByMonth: Record<string, any> = {}
      
      analyticsData.subsidyByDepartment.forEach((item: any) => {
        if (!groupedByMonth[item.month]) {
          groupedByMonth[item.month] = { month: item.month }
        }
        groupedByMonth[item.month][item.department] = item.amount
      })
      
      // Convert to array and sort by month index
      // Note: Backend returns month abbreviations like 'Jan', 'Feb'
      byDepartmentData.push(...Object.values(groupedByMonth).sort((a: any, b: any) => {
        return months.indexOf(a.month) - months.indexOf(b.month)
      }))
    }

    // 2. By Month (RequestsOverTimeChart)
    // Backend returns [{ month: 'January', approved, pending, rejected, quarter }]
    // Frontend expects same structure
    const byMonthData = analyticsData.subsidyByMonth || []

    // 3. By Status (StatusOverviewChart)
    // Backend returns [{ status, count, fill }]
    // Frontend expects same structure, mapped to local colors if needed, but backend sends fill
    const byStatusData = analyticsData.subsidyByStatus || []

    return {
      byStatus: byStatusData,
      byMonth: byMonthData,
      byDepartment: byDepartmentData
    }
  }, [analyticsData])

  // Handlers
  const handleRefresh = async () => {
    setRefreshing(true)
    const refreshToast = toast.loading("Refreshing subsidy requests...")
    
    try {
      if (refetchSubsidies) {
        await refetchSubsidies()
      }
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

  const handleApprove = async (subsidyId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === subsidyId)
    if (!subsidy) return

    try {
      await approveSubsidyMutation({
        variables: {
          id: subsidyId,
          approved_amount: subsidy.requested_amount
        }
      })
    } catch (error) {
      // Error handled by mutation onError
    }
  }

  const handleReject = async (subsidyId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === subsidyId)
    if (!subsidy) return

    try {
      await rejectSubsidyMutation({
        variables: {
          id: subsidyId,
          rejection_reason: 'Rejeitado pelo administrador'
        }
      })
    } catch (error) {
      // Error handled by mutation onError
    }
  }

  const handleMarkInReview = async (subsidyId: string) => {
    const statusId = getStatusIdByName('IN_REVIEW')
    if (!statusId) {
      toast.error('Status "Em Análise" não encontrado')
      return
    }
    
    try {
      await updateSubsidyMutation({
        variables: {
          id: subsidyId,
          data: {
            subsidy_status_id: statusId
          }
        }
      })
    } catch (error) {
      // Error handled by mutation onError
    }
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
        const dotColors: Record<SubsidyRequest['status'], string> = {
          pending: 'bg-amber-500',
          in_review: 'bg-blue-500',
          approved: 'bg-green-500',
          rejected: 'bg-red-500',
          closed: 'bg-gray-500'
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

  const handleKanbanItemMove = async (itemId: string, fromGroupId: string, toGroupId: string) => {
    const subsidy = subsidyRequests.find(r => r.id === itemId)
    if (!subsidy) return

    try {
      // Handle approve/reject via specific mutations
      if (toGroupId === 'approved') {
        await handleApprove(itemId)
      } else if (toGroupId === 'rejected') {
        await handleReject(itemId)
      } else if (toGroupId === 'pending' || toGroupId === 'in_review' || toGroupId === 'closed') {
        // Get status ID by name
        const statusName = toGroupId.toUpperCase()
        const statusId = getStatusIdByName(statusName)
        
        if (!statusId) {
          toast.error(`Status "${toGroupId}" não encontrado`)
          return
        }
        
        // Use UPDATE_SUBSIDY_REQUEST for other status changes
        await updateSubsidyMutation({
          variables: {
            id: itemId,
            data: {
              subsidy_status_id: statusId
            }
          }
        })
      } else {
        toast.error('Status inválido')
      }
    } catch (error) {
      console.error('Error updating subsidy status:', error)
    }
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
            />
          ) : (
            <KanbanBoard
              groups={kanbanGroups}
              items={kanbanItems}
              actions={kanbanActions}
              onItemMove={handleKanbanItemMove}
              renderItem={renderKanbanItem}
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
          subsidy={selectedSubsidy}
          onSubsidyUpdated={async () => {
            if (refetchSubsidies) {
              await refetchSubsidies()
            }
          }}
        />
      )}
    </div>
  )
}
