"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  DollarSign, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  AlertTriangle,
  FileText,
  Lock,
  Unlock,
  Settings,
  Trash2,
  TrendingUp,
  Eye,
  MessageSquare,
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

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { UseTable } from "@/components/ui/use-table"
import { UsageIndicator } from "@/components/ui/usage-indicator"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"
import { useInstitution } from "@/contexts/institution-context"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { WithPermission } from "@/hocs/with-permission"

// Chart Components
import { DepartmentSpendingChart } from "@/components/charts/annual-budget/department-spending-chart"
import { BudgetDistributionChart } from "@/components/charts/annual-budget/budget-distribution-chart"
import { SpendingOverTimeChart } from "@/components/charts/annual-budget/spending-over-time-chart"

// Modal Components
import { AnnualBudgetViewEditModal, AnnualBudgetData } from "@/components/modals/annual-budget/annual-budget-view-edit-modal"
import { MockDataIndicator, useShowMockIndicators } from "@/components/shared/mock-data-indicator"
import { DeleteBudgetModal } from "@/components/modals/annual-budget/delete-budget-modal"

// GraphQL Hooks
import { 
  useCreateAnnualBudgetMutation,
  useUpdateAnnualBudgetMutation,
  useDeleteAnnualBudgetMutation,
  useApproveAnnualBudgetMutation,
  useRejectAnnualBudgetMutation,
  useRequestRevisionAnnualBudgetMutation,
  useToggleBudgetLockMutation
} from "@/hooks/graphql/use-annual-budget"
import {
  useAvailableYears,
  useAnnualBudgetKPIs,
  useBudgetDashboardData
} from "@/hooks/graphql/use-annual-budget-queries"
import { GetBudgetDashboardData_annualBudgets } from "@/types/GetBudgetDashboardData"
import { AnnualBudgetEntityType, AnnualBudgetPriority, AnnualBudgetCategory } from "@/types/globalTypes"

// Interfaces for Budget Management
interface BudgetRequestGroup {
  id: string
  name: string
  description: string
  color: string
  status: string
  requests: GetBudgetDashboardData_annualBudgets[]
}

/**
 * PÁGINA DE GESTÃO DE ORÇAMENTO ANUAL
 * Interface para gerenciar solicitações de orçamento de todas as entidades da organização
 */
export default function AnnualBudgetPage() {
  const { t } = useTranslation()
  const { currentInstitutionData, refetchInstitutionById } = useInstitution()
  
  // GraphQL mutations
  const [createAnnualBudgetMutation, { loading: creatingBudget }] = useCreateAnnualBudgetMutation()
  const [updateAnnualBudgetMutation, { loading: updatingBudget }] = useUpdateAnnualBudgetMutation()
  const [deleteAnnualBudgetMutation, { loading: deletingBudget }] = useDeleteAnnualBudgetMutation()
  const [approveAnnualBudgetMutation, { loading: approvingBudget }] = useApproveAnnualBudgetMutation()
  const [rejectAnnualBudgetMutation, { loading: rejectingBudget }] = useRejectAnnualBudgetMutation()
  const [requestRevisionAnnualBudgetMutation, { loading: requestingRevision }] = useRequestRevisionAnnualBudgetMutation()
  const [toggleBudgetLockMutation, { loading: togglingLock }] = useToggleBudgetLockMutation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  
  // Modal states
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<GetBudgetDashboardData_annualBudgets | null>(null)
  const [selectedDepartmentData, setSelectedDepartmentData] = useState<any>(null)
  const [isInstitutionBudgetModalOpen, setIsInstitutionBudgetModalOpen] = useState(false)
  const [institutionBudgetData, setInstitutionBudgetData] = useState<AnnualBudgetData | null>(null)
  const [isInstitutionLockConfirmModalOpen, setIsInstitutionLockConfirmModalOpen] = useState(false)

  // GraphQL Queries
  const { data: dashboardData, loading: loadingDashboard, refetch: refetchDashboard } = useBudgetDashboardData(selectedYear)
  const { data: availableYearsData, loading: loadingYears } = useAvailableYears()
  const { data: kpisData, loading: loadingKPIs } = useAnnualBudgetKPIs({
    skip: !currentInstitutionData?.id,
    variables:{
      institutionId: currentInstitutionData?.id!,
      year: selectedYear
    }
  })
  console.log(kpisData)
  // Mock data indicators
  const showMockIndicators = useShowMockIndicators()

  // State for managing available years (frontend-managed)
  const [availableYears, setAvailableYears] = useState<number[]>(() => {
    const currentYear = new Date().getFullYear()
    return [currentYear]
  })

  // Update available years when GraphQL data changes
  useMemo(() => {
    if (availableYearsData?.annualBudgets) {
      const backendYears = availableYearsData.annualBudgets
        .map(budget => budget.year)
        .filter((year, index, arr) => arr.indexOf(year) === index) // Remove duplicates
        .sort((a, b) => b - a) // Sort descending
      
      // Merge backend years with frontend years, keeping frontend additions
      const mergedYears = [...new Set([...backendYears, ...availableYears])].sort((a, b) => b - a).reverse()
      setAvailableYears(mergedYears)
    }
  }, [availableYearsData])

  usePageTitle({
    title: t('annual_budget.title')
  })

  // Transform institution annual budgets to component format
  const institutionAnnualBudgets = useMemo(() => {
    const institution = currentInstitutionData as any
    if (!institution?.annual_budgets) return {}
    
    const budgets: Record<number, AnnualBudgetData> = {}
    institution.annual_budgets.forEach((budget: any) => {
      budgets[budget.year] = {
        id: budget.id,
        year: budget.year,
        planned_budget: parseFloat(budget.planned_budget) || 0,
        total_expenses: parseFloat(budget.total_expenses) || 0,
        balance: parseFloat(budget.balance) || 0,
        notes: budget.notes || undefined,
        approved_by: budget.reviewed_by || undefined,
        created_at: budget.created_at,
        updated_at: budget.updated_at,
        created_by: budget.created_by,
        updated_by: budget.updated_by,
        is_deleted: budget.is_deleted,
        deleted_at: budget.deleted_at,
        deleted_by: budget.deleted_by,
        is_locked: budget.is_locked || false,
      }
    })
    return budgets
  }, [currentInstitutionData])



  // Helper function to get entity name from GraphQL data
  const getEntityName = (budget: GetBudgetDashboardData_annualBudgets): string => {
    switch (budget.entity_type) {
      case 'INSTITUTION':
        return budget.institution?.name || 'Unknown Institution'
      case 'CHURCH':
        return budget.church?.name || 'Unknown Church'
      case 'INSTITUTION_DEPARTMENT':
        return budget.department?.name || 'Unknown Department'
      case 'CHURCH_DEPARTMENT':
        return budget.department?.name || 'Unknown Department'
      default:
        return 'Unknown Entity'
    }
  }

  // Helper function to get entity ID from GraphQL data
  const getEntityId = (budget: GetBudgetDashboardData_annualBudgets): string => {
    switch (budget.entity_type) {
      case 'INSTITUTION':
        return budget.institution_id || ''
      case 'CHURCH':
        return budget.church_id || ''
      case 'INSTITUTION_DEPARTMENT':
        return budget.department_id || ''
      case 'CHURCH_DEPARTMENT':
        return budget.department_id || ''
      default:
        return ''
    }
  }

  // Use GraphQL data directly without manual transformations
  const budgetRequests = dashboardData?.annualBudgets ?? []

  // Filtered budget requests based on selected year
  const filteredBudgetRequests = useMemo(() => {
    return budgetRequests.filter((req: GetBudgetDashboardData_annualBudgets) => req.year === selectedYear)
  }, [budgetRequests, selectedYear])

  // Transform departments data for table display
  const departmentBudgetData = useMemo(() => {
    const institution = currentInstitutionData as any
    if (!institution?.departments) return []
    
    return institution.departments.map((department: any) => {
      // Find annual budget for selected year
      const annualBudget = department.annual_budgets?.find(
        (budget: any) => budget.year === selectedYear
      )
      
      return {
        id: department.id,
        departmentId: department.id,
        departmentName: department.name,
        departmentDescription: department.description,
        annualBudget: annualBudget ? {
          id: annualBudget.id,
          year: annualBudget.year,
          planned_budget: parseFloat(annualBudget.planned_budget) || 0,
          total_expenses: parseFloat(annualBudget.total_expenses) || 0,
          balance: parseFloat(annualBudget.balance) || 0,
          status: annualBudget.status,
          priority: annualBudget.priority,
          category: annualBudget.category,
          requested_amount: parseFloat(annualBudget.requested_amount) || 0,
          approved_amount: annualBudget.approved_amount ? parseFloat(annualBudget.approved_amount) : null,
          notes: annualBudget.notes,
          description: annualBudget.description,
          justification: annualBudget.justification,
          is_locked: annualBudget.is_locked,
          has_budget_record: annualBudget.has_budget_record,
          entity_type: annualBudget.entity_type,
          created_at: annualBudget.created_at,
          updated_at: annualBudget.updated_at,
          created_by: annualBudget.created_by,
          updated_by: annualBudget.updated_by,
          reviewed_by: annualBudget.reviewed_by,
          review_date: annualBudget.review_date,
          approval_date: annualBudget.approval_date,
        } : null,
        hasBudgetRecord: annualBudget?.has_budget_record || false,
        isLocked: annualBudget?.is_locked || false,
        spentAmount: annualBudget ? parseFloat(annualBudget.total_expenses) || 0 : 0,
        remainingAmount: annualBudget ? parseFloat(annualBudget.balance) || 0 : 0,
        usagePercentage: annualBudget ? 
          (parseFloat(annualBudget.planned_budget) > 0 ? 
            Math.round(((parseFloat(annualBudget.total_expenses) || 0) / parseFloat(annualBudget.planned_budget)) * 100) 
            : 0) 
          : 0
      }
    })
  }, [currentInstitutionData, selectedYear])

  // Check if institution has budget for selected year (use real data)
  const hasInstitutionBudget = useMemo(() => {
    // Check real data from API
    return !!institutionAnnualBudgets[selectedYear]
  }, [institutionAnnualBudgets, selectedYear])

  // Handler for creating institution budget (declared before useMemo)
  const handleCreateInstitutionBudget = () => {
    // Create a new budget for the institution with default values
    const newBudget: AnnualBudgetData = {
      id: `inst-budget-${selectedYear}`,
      year: selectedYear,
      planned_budget: 0,
      total_expenses: 0,
      balance: 0,
      notes: `Institution budget for ${selectedYear}`,
      approved_by: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    setInstitutionBudgetData(newBudget)
    setIsInstitutionBudgetModalOpen(true)
  }

  // Handler for toggling institution budget lock
  const handleToggleInstitutionBudgetLock = async (e: React.MouseEvent, forceLock: boolean = false) => {
    e.stopPropagation() // Prevent card onClick from firing

    const institutionBudget = institutionAnnualBudgets[selectedYear]
    if (!institutionBudget?.id) {
      toast.error('Institution budget not found for the selected year')
      return
    }

    // Check if trying to lock and there are departments without budget
    const isCurrentlyLocked = institutionBudget.is_locked
    const tryingToLock = !isCurrentlyLocked

    if (tryingToLock && !forceLock) {
      const departmentsWithoutBudget = departmentBudgetData.filter(dept => !dept.hasBudgetRecord)
      if (departmentsWithoutBudget.length > 0) {
        setIsInstitutionLockConfirmModalOpen(true)
        return
      }
    }

    try {
      const result = await toggleBudgetLockMutation({
        variables: {
          id: institutionBudget.id
        }
      })

      if (result.data?.toggleBudgetLock) {
        // Refresh the data
        refetchDashboard()
        refetchInstitutionById()

        const isNowLocked = result.data.toggleBudgetLock.is_locked
        toast.success(isNowLocked ? t('annual_budget.messages.lock_success') : t('annual_budget.messages.unlock_success'))
      }
    } catch (error) {
      console.error('Error toggling institution budget lock:', error)
      toast.error(t('annual_budget.messages.lock_error'))
    }
  }

  // Handler for editing institution budget
  const handleEditInstitutionBudget = () => {
    const currentBudget = institutionAnnualBudgets[selectedYear]
    const isLocked = currentBudget?.is_locked || false
    
    if (isLocked) {
      toast.error('Budget is locked. Unlock it first to edit.', { duration: 3000 })
      return
    }
    if (currentBudget) {
      setInstitutionBudgetData(currentBudget)
      setIsInstitutionBudgetModalOpen(true)
    }
  }

  // KPI Data from GraphQL
  const kpiData = useMemo(() => {
    if (!kpisData?.budgetKPIs) {
      return {
        totalInstitutionBudget: 0,
        totalAllocated: 0,
        totalSpent: 0,
        budgetRemaining: 0,
        budgetUtilization: 0,
        activeDepartments: 0
      }
    }

    return {
      totalInstitutionBudget: kpisData.budgetKPIs.totalInstitutionBudget || 0,
      totalAllocated: kpisData.budgetKPIs.totalAllocated || 0,
      totalSpent: kpisData.budgetKPIs.totalSpent || 0,
      budgetRemaining: kpisData.budgetKPIs.budgetRemaining || 0,
      budgetUtilization: kpisData.budgetKPIs.budgetUtilization || 0,
      activeDepartments: kpisData.budgetKPIs.activeDepartments || 0
    }
  }, [kpisData])

  const kpiCardsData: KPICardData[] = useMemo(() => {
    const institutionBudget = institutionAnnualBudgets[selectedYear]
    const isLocked = institutionBudget?.is_locked || false
    const budgetRemainingValue = kpiData.budgetRemaining
    const isDeficit = budgetRemainingValue < 0
    const utilizationRate = kpiData.budgetUtilization
    
    return [
      {
        id: "total_budget",
        title: t('annual_budget.kpi_cards.total_institution_budget.title'),
        value: hasInstitutionBudget ? `$${(kpiData.totalInstitutionBudget / 1000).toFixed(0)}K` : t('annual_budget.kpi_cards.total_institution_budget.not_set'),
        icon: DollarSign,
        subtitle: hasInstitutionBudget 
          ? t('annual_budget.kpi_cards.total_institution_budget.subtitle', { year: selectedYear })
          : t('annual_budget.kpi_cards.total_institution_budget.subtitle_not_set', { year: selectedYear }),
        trend: hasInstitutionBudget ? {
          value: 5,
          isPositive: true,
          label: t('annual_budget.kpi_cards.total_institution_budget.trend')
        } : undefined,
        onClick: !hasInstitutionBudget ? handleCreateInstitutionBudget : handleEditInstitutionBudget,
        className: !hasInstitutionBudget 
          ? "border-2 border-dashed border-primary animate-pulse cursor-pointer hover:bg-primary/5 transition-all" 
          : "cursor-pointer hover:bg-blue-50 transition-all border-l-4 border-l-blue-500",
        headerAction: hasInstitutionBudget ? (
          <button
            onClick={handleToggleInstitutionBudgetLock}
            className="relative group z-10 cursor-pointer"
            title={isLocked ? t('annual_budget.table.lock_actions.unlock') : t('annual_budget.table.lock_actions.lock')}
          >
            <div className={`w-6 h-6 border-2 border-dashed rounded-full flex items-center justify-center transition-all ${
              isLocked 
                ? 'border-foreground bg-foreground hover:bg-foreground/90' 
                : 'border-border bg-muted opacity-60 hover:opacity-100 hover:border-foreground/60'
            }`}>
              {isLocked ? (
                <Lock className="w-3 h-3 text-background" />
              ) : (
                <Unlock className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
          </button>
        ) : undefined
      },
    {
      id: "total_allocated",
      title: t('annual_budget.kpi_cards.total_allocated.title'),
      value: `$${(kpiData.totalAllocated / 1000).toFixed(0)}K`,
      icon: CheckCircle,
      subtitle: t('annual_budget.kpi_cards.total_allocated.subtitle'),
      trend: {
        value: 8,
        isPositive: true,
        label: t('annual_budget.kpi_cards.total_allocated.trend')
      },
      className: !hasInstitutionBudget 
        ? "opacity-40 pointer-events-none" 
        : "hover:bg-green-50 transition-all border-l-4 border-l-green-500"
    },
    {
      id: "total_spent",
      title: t('annual_budget.kpi_cards.total_spent.title'),
      value: `$${(kpiData.totalSpent / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      subtitle: t('annual_budget.kpi_cards.total_spent.subtitle'),
      trend: {
        value: 12,
        isPositive: true,
        label: t('annual_budget.kpi_cards.total_spent.trend')
      },
      className: !hasInstitutionBudget 
        ? "opacity-40 pointer-events-none" 
        : "hover:bg-purple-50 transition-all border-l-4 border-l-purple-500"
    },
    {
      id: "budget_remaining",
      title: t('annual_budget.kpi_cards.budget_remaining.title'),
      value: `$${Math.abs(budgetRemainingValue / 1000).toFixed(0)}K`,
      icon: FileText,
      subtitle: isDeficit ? t('annual_budget.kpi_cards.budget_remaining.subtitle_deficit') : t('annual_budget.kpi_cards.budget_remaining.subtitle_available'),
      trend: {
        value: 10,
        isPositive: !isDeficit,
        label: t('annual_budget.kpi_cards.budget_remaining.trend')
      },
      className: !hasInstitutionBudget 
        ? "opacity-40 pointer-events-none" 
        : isDeficit
          ? "hover:bg-red-50 transition-all border-l-4 border-l-red-500"
          : "hover:bg-orange-50 transition-all border-l-4 border-l-orange-500"
    },
    {
      id: "budget_utilization",
      title: t('annual_budget.kpi_cards.budget_utilization.title'),
      value: `${kpiData.budgetUtilization}%`,
      icon: Building,
      subtitle: t('annual_budget.kpi_cards.budget_utilization.subtitle', { count: kpiData.activeDepartments }),
      trend: {
        value: 3,
        isPositive: utilizationRate < 90,
        label: t('annual_budget.kpi_cards.budget_utilization.trend')
      },
      className: !hasInstitutionBudget 
        ? "opacity-40 pointer-events-none" 
        : utilizationRate > 90
          ? "hover:bg-yellow-50 transition-all border-l-4 border-l-yellow-500"
          : "hover:bg-muted/50 transition-all border-l-4 border-l-muted-foreground"
    }
  ]}, [kpiData, selectedYear, hasInstitutionBudget, institutionAnnualBudgets, handleCreateInstitutionBudget, handleEditInstitutionBudget, handleToggleInstitutionBudgetLock])

  // Chart data from GraphQL
  const chartData = useMemo(() => {
    if (!kpisData) {
      return {
        budgetDistribution: {
          total: 0,
          allocated: 0,
          remaining: 0,
          percentageUsed: 0
        },
        departmentSpending: [],
        spendingOverTime: []
      }
    }

    return {
      budgetDistribution: kpisData.budgetDistribution || {
        total: 0,
        allocated: 0,
        remaining: 0,
        percentageUsed: 0
      },
      departmentSpending: kpisData.departmentSpending || [],
      spendingOverTime: kpisData.spendingOverTime || []
    }
  }, [kpisData])

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

    // Add year locally to frontend state
    setAvailableYears(prev => [...prev, nextYear].sort((a, b) => b - a))
    toast.success(`Year ${nextYear} added successfully! You can now select it and create budgets.`)
  }

  const handleApproveRequest = async (requestId: string, approvedAmount?: number) => {
    try {
      const result = await approveAnnualBudgetMutation({
        variables: {
          id: requestId,
          data: {
            approved_amount: approvedAmount
          }
        }
      })

      if (result.data?.approveAnnualBudget) {
        // Refresh the data
        refetchDashboard()
        refetchInstitutionById()
        toast.success(t('annual_budget.messages.approve_success'))
      }
    } catch (error) {
      console.error('Error approving budget:', error)
      toast.error(t('annual_budget.messages.approve_error'))
    }
  }

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      const result = await rejectAnnualBudgetMutation({
        variables: {
          id: requestId,
          data: {
            reason: reason
          }
        }
      })

      if (result.data?.rejectAnnualBudget) {
        // Refresh the data
        refetchDashboard()
        refetchInstitutionById()
        toast.success(t('annual_budget.messages.reject_success'))
      }
    } catch (error) {
      console.error('Error rejecting budget:', error)
      toast.error(t('annual_budget.messages.reject_error'))
    }
  }

  const handleRequestRevision = async (requestId: string, revisionNotes: string) => {
    try {
      const result = await requestRevisionAnnualBudgetMutation({
        variables: {
          id: requestId,
          data: {
            revision_notes: revisionNotes
          }
        }
      })

      if (result.data?.requestRevisionAnnualBudget) {
        // Refresh the data
        refetchDashboard()
        refetchInstitutionById()
        toast.success(t('annual_budget.messages.revision_success'))
      }
    } catch (error) {
      console.error('Error requesting revision:', error)
      toast.error(t('annual_budget.messages.revision_error'))
    }
  }

  const handleToggleLock = async (requestId: string) => {
    try {
      const result = await toggleBudgetLockMutation({
        variables: {
          id: requestId
        }
      })

      if (result.data?.toggleBudgetLock) {
        // Refresh the data
        refetchDashboard()
        refetchInstitutionById()
        const request = budgetRequests.find((req: GetBudgetDashboardData_annualBudgets) => req.id === requestId)
        const isNowLocked = result.data.toggleBudgetLock.is_locked
        toast.success(isNowLocked ? t('annual_budget.messages.lock_success') : t('annual_budget.messages.unlock_success'))
      }
    } catch (error) {
      console.error('Error toggling budget lock:', error)
      toast.error(t('annual_budget.messages.lock_error'))
    }
  }

  const handleDeleteBudget = async (requestId: string) => {
    try {
      const result = await deleteAnnualBudgetMutation({
        variables: {
          id: requestId
        }
      })

      if (result.data?.deleteAnnualBudget) {
        // Refresh the data
        refetchDashboard()
        toast.success(t('annual_budget.messages.delete_success'))
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
      toast.error(t('annual_budget.messages.delete_error'))
    }
  }

  const handleDepartmentBudgetSave = async (budget: AnnualBudgetData, departmentData: any) => {
    try {
      if (budget.id) {
        // Update existing budget
        const result = await updateAnnualBudgetMutation({
          variables: {
            id: budget.id,
            data: {
              planned_budget: budget.planned_budget,
              total_expenses: budget.total_expenses,
              description: `Updated budget for ${departmentData.departmentName}`,
              justification: budget.notes || `Updated budget allocation`,
              notes: budget.notes,
            }
          }
        })

        if (result.data?.updateAnnualBudget) {
          // Refresh the data
          refetchDashboard()
          refetchInstitutionById()
          toast.success('Department budget updated successfully!')
          
          // Close modal and reset state
          setIsViewEditModalOpen(false)
          setSelectedDepartmentData(null)
        }
      } else {
        // Create new budget
        const result = await createAnnualBudgetMutation({
          variables: {
            year: budget.year,
            planned_budget: budget.planned_budget,
            total_expenses: budget.total_expenses || 0,
            description: `Budget for ${departmentData.departmentName}`,
            justification: budget.notes || `Annual budget allocation for ${departmentData.departmentName}`,
            requested_amount: budget.planned_budget,
            entity_type: AnnualBudgetEntityType.INSTITUTION_DEPARTMENT,
            entity_id: departmentData.departmentId,
            notes: budget.notes,
          }
        })

        if (result.data?.createAnnualBudget) {
          // Refresh the data
          refetchDashboard()
          refetchInstitutionById()
          toast.success(`Budget for ${departmentData.departmentName} created successfully!`)
          
          // Close modal and reset state
          setIsViewEditModalOpen(false)
          setSelectedDepartmentData(null)
        }
      }
    } catch (error) {
      console.error('Error saving department budget:', error)
      toast.error('Failed to save department budget. Please try again.')
    }
  }

  const handleSaveInstitutionBudget = async (budget: AnnualBudgetData) => {
    try {
      const result = await createAnnualBudgetMutation({
        variables: {
          year: budget.year,
          planned_budget: budget.planned_budget,
          total_expenses: budget.total_expenses || 0, // Novo campo - permite enviar gastos iniciais
          description: `Institution budget for ${budget.year}`,
          justification: budget.notes || `Annual budget allocation for institution operations in ${budget.year}`,
          requested_amount: budget.planned_budget,
          entity_type: AnnualBudgetEntityType.INSTITUTION,
          entity_id: currentInstitutionData?.id || '',
          notes: budget.notes,
        }
      })

      if (result.data?.createAnnualBudget) {
        // Refresh the data
        refetchDashboard()
        refetchInstitutionById()
        toast.success(`Institution budget for ${budget.year} created successfully!`)
        
        // Close modal and reset state
        setIsInstitutionBudgetModalOpen(false)
        setInstitutionBudgetData(null)
      }
    } catch (error) {
      console.error('Error creating institution budget:', error)
      toast.error('Failed to create institution budget. Please try again.')
    }
  }

  const handleUpdateBudget = async (budget: AnnualBudgetData) => {
    if (!budget.id) {
      toast.error('Budget ID is required for updates')
      return
    }

    if (!selectedRequest) {
      toast.error('No budget selected for update')
      return
    }

    try {
      const result = await updateAnnualBudgetMutation({
        variables: {
          id: budget.id,
          data: {
            planned_budget: budget.planned_budget,
            total_expenses: budget.total_expenses,
            description: `Updated budget for ${budget.year}`,
            justification: budget.notes || `Updated budget allocation`,
            priority: selectedRequest.priority as any, // Mantém prioridade existente
            category: selectedRequest.category as any, // Mantém categoria existente
            notes: budget.notes,
          }
        }
      })

      if (result.data?.updateAnnualBudget) {
        // Refresh the data
        refetchDashboard()
        refetchInstitutionById()
        toast.success('Budget updated successfully!')
        
        // Close modal and reset state
        setIsInstitutionBudgetModalOpen(false)
        setInstitutionBudgetData(null)
        setSelectedRequest(null)
      }
    } catch (error) {
      console.error('Error updating budget:', error)
      toast.error('Failed to update budget. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
      case 'under_review': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'requires_revision': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'pending': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-muted text-muted-foreground'
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
  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      id: "department",
      accessorKey: "departmentId",
      header: () => (
        <div className="text-left font-medium text-foreground">
          {t('annual_budget.table.headers.department_name')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isDisabled = !departmentData.hasBudgetRecord
        return (
          <div className={`flex items-center gap-3 ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="w-8 h-8 bg-muted border border-border rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <div className="font-medium text-foreground">{departmentData.departmentName}</div>
              <div className="text-xs text-muted-foreground">{departmentData.departmentDescription}</div>
            </div>
          </div>
        )
      },
    },
    {
      id: "entity_type",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.entity_type')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isDisabled = !departmentData.hasBudgetRecord
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-medium text-foreground">
              Department
            </div>
          </div>
        )
      },
    },
    {
      id: "budget_total",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.budget_total')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isDisabled = !departmentData.hasBudgetRecord
        const budgetAmount = departmentData.annualBudget?.requested_amount || 0
        
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-foreground">
              {isDisabled ? '-' : `$${budgetAmount.toLocaleString()}`}
            </div>
          </div>
        )
      },
    },
    {
      id: "spent_amount",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.spent_amount')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isDisabled = !departmentData.hasBudgetRecord
        
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-foreground">
              {isDisabled ? '-' : `$${departmentData.spentAmount.toLocaleString()}`}
            </div>
          </div>
        )
      },
    },
    {
      id: "usage_percentage",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.usage_percentage')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isDisabled = !departmentData.hasBudgetRecord
        
        return (
          <div className="flex justify-center">
            <UsageIndicator 
              percentage={departmentData.usagePercentage}
              disabled={isDisabled}
              size="md"
            />
          </div>
        )
      },
    },
    {
      id: "lock_status",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.lock_status')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isLocked = departmentData.isLocked
        const isDisabled = !departmentData.hasBudgetRecord
        
        return (
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (!isDisabled && departmentData.annualBudget) {
                  handleToggleLock(departmentData.annualBudget.id)
                }
              }}
              disabled={isDisabled}
              className={`w-8 h-8 border-2 border-dashed rounded-full flex items-center justify-center transition-all ${
                isDisabled 
                  ? 'border-border bg-muted opacity-50 cursor-not-allowed'
                  : isLocked 
                    ? 'border-foreground bg-foreground hover:bg-foreground/90 cursor-pointer' 
                    : 'border-border bg-muted opacity-60 hover:opacity-100 hover:border-foreground/60 cursor-pointer'
              }`}
              title={isDisabled ? t('annual_budget.table.lock_tooltips.disabled') : isLocked ? t('annual_budget.table.lock_tooltips.locked') : t('annual_budget.table.lock_tooltips.unlocked')}
            >
              {isLocked ? (
                <Lock className={`w-3 h-3 ${isDisabled ? 'text-muted-foreground' : 'text-background'}`} />
              ) : (
                <Unlock className={`w-3 h-3 ${isDisabled ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
              )}
            </button>
          </div>
        )
      },
    },
    {
      id: "budget_status",
      accessorKey: "hasBudgetRecord",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.budget_status')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const hasBudget = departmentData.hasBudgetRecord
        
        return (
          <div className="flex justify-center">
            {hasBudget ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {t('annual_budget.table.budget_status_labels.completed')}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-muted text-muted-foreground border-border text-xs flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                {t('annual_budget.table.budget_status_labels.missing')}
              </Badge>
            )}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        // Se não houver filtro ativo (value é undefined/null/empty), mostrar todas as linhas
        if (value === undefined || value === null || value === "") {
          return true
        }
        // Converter string para boolean
        const filterValue = value === "true" || value === true
        const departmentData = row.original
        return departmentData.hasBudgetRecord === filterValue
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right font-medium text-foreground">
          {t('annual_budget.table.headers.actions')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const hasBudget = departmentData.hasBudgetRecord
        const isLocked = departmentData.isLocked
        
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 border border-border">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Manage/Register Budget Action - Dynamic label based on budget status */}
                <DropdownMenuItem onClick={() => {
                  setSelectedDepartmentData(departmentData)
                  setIsViewEditModalOpen(true)
                }}>
                  <Settings className="w-4 h-4 mr-2" />
                  {hasBudget 
                    ? t('annual_budget.table.actions_menu.manage')
                    : t('annual_budget.table.actions_menu.register', 'Register Budget')
                  }
                </DropdownMenuItem>
                
                {/* Lock/Unlock Action - Disabled if no budget */}
                <DropdownMenuItem 
                  onClick={() => {
                    if (hasBudget && departmentData.annualBudget) {
                      handleToggleLock(departmentData.annualBudget.id)
                    }
                  }}
                  disabled={!hasBudget}
                  className={!hasBudget ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isLocked ? (
                    <>
                      <Unlock className="w-4 h-4 mr-2" />
                      {t('annual_budget.table.actions_menu.unlock')}
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      {t('annual_budget.table.actions_menu.lock')}
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ], [departmentBudgetData, t, currentInstitutionData])



  // Year Filter Component
  const YearFilter = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const canAddMore = Math.max(...availableYears) < maxAllowedYear

    return (
      <div className="mb-6">
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
              <h2 className="text-2rem sm:text-2.5rem lg:text-3rem font-bold text-foreground">
                {t('annual_budget.title')}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t('annual_budget.subtitle')}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
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
            variant="minimal"
          />

          <Separator />

          {/* Charts Section */}
          <div className={`space-y-6 transition-opacity duration-300 ${!hasInstitutionBudget ? 'opacity-40 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-2">
              {/* <h3 className="text-xl font-semibold">{t('annual_budget.charts.budget_analytics.title')}</h3>
              {showMockIndicators && (
                <div className="flex gap-2">
                  <MockDataIndicator
                    queryName="departmentSpending"
                    description="Departments fixos + cálculos simulados"
                  />
                  <MockDataIndicator
                    queryName="spendingOverTime"
                    description="Valores fixos + variação aleatória"
                  />
                </div>
              )} */}
            </div>
            <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
              <SpendingOverTimeChart 
                data={chartData.spendingOverTime}
                year={selectedYear}
              />
              <DepartmentSpendingChart data={chartData.departmentSpending} />
              
              <BudgetDistributionChart 
                data={chartData.budgetDistribution} 
                year={selectedYear}
                entityDistribution={dashboardData?.entityDistribution || []}
              />
              

            </ResponsiveGridCarousel>
          </div>

          <Separator />

          {/* Budget Requests - Table View */}
          <div className={`transition-opacity duration-300 ${!hasInstitutionBudget ? 'opacity-40 pointer-events-none' : ''}`}>
            <Card className="border-border bg-card">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                      {t('annual_budget.table.title_departments')}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {t('annual_budget.table.subtitle_departments')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-hidden p-4">
                <div>
                  <UseTable
                    columns={columns}
                    data={departmentBudgetData}
                    filters={[
                      {
                        id: "budget_status",
                        title: "Budget Status",
                        options: [
                          { label: "Completed", value: "true" },
                          { label: "Missing", value: "false" },
                        ]
                      }
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* View/Edit Budget Modal */}
          {isViewEditModalOpen && (
            <AnnualBudgetViewEditModal
              isOpen={isViewEditModalOpen}
              onOpenChange={(open) => {
                setIsViewEditModalOpen(open)
                if (!open) {
                  setSelectedDepartmentData(null)
                  setSelectedRequest(null)
                }
              }}
              budget={selectedRequest ? {
                id: selectedRequest.id,
                year: selectedRequest.year,
                planned_budget: parseFloat(selectedRequest.requested_amount as string) || 0,
                total_expenses: selectedRequest.spentAmount || 0,
                balance: selectedRequest.remainingAmount || 0,
                notes: selectedRequest.notes || undefined,
                approved_by: selectedRequest.approved_by || undefined,
                created_at: selectedRequest.created_at as string,
                updated_at: selectedRequest.updated_at as string
              } : selectedDepartmentData?.annualBudget || null}
              entityName={selectedRequest ? getEntityName(selectedRequest) : selectedDepartmentData?.departmentName || 'Department'}
              entityType={selectedRequest ? selectedRequest.entity_type.toLowerCase() as 'institution' | 'region' | 'church' | 'department' : 'department'}
              isLocked={selectedRequest ? selectedRequest.is_locked : selectedDepartmentData?.isLocked || false}
              onSave={(budget) => {
                if (selectedDepartmentData) {
                  handleDepartmentBudgetSave(budget, selectedDepartmentData)
                }
              }}
              defaultYear={selectedYear}
            />
          )}

          {/* Delete Budget Modal */}
          {selectedRequest && (
            <DeleteBudgetModal
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              budget={{
                id: selectedRequest.id,
                entity_type: selectedRequest.entity_type.toLowerCase() as 'institution' | 'region' | 'church' | 'department',
                entity_id: getEntityId(selectedRequest),
                entity_name: getEntityName(selectedRequest),
                year: selectedRequest.year,
                requested_amount: parseFloat(selectedRequest.requested_amount as string),
                approved_amount: selectedRequest.approvedAmount,
                status: selectedRequest.status.toLowerCase() as 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_revision',
                priority: selectedRequest.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'urgent',
                category: selectedRequest.category.toLowerCase() as 'operational' | 'project' | 'maintenance' | 'emergency' | 'expansion',
                description: selectedRequest.description || '',
                justification: selectedRequest.justification || '',
                requested_by: selectedRequest.requested_by,
                reviewed_by: selectedRequest.reviewed_by || undefined,
                submitted_date: selectedRequest.submitted_date as string,
                review_date: selectedRequest.review_date as string,
                approval_date: selectedRequest.approval_date as string,
                notes: selectedRequest.notes || undefined,
                created_at: selectedRequest.created_at as string,
                updated_at: selectedRequest.updated_at as string,
                is_locked: selectedRequest.is_locked
              }}
              onSuccess={(deletedBudget) => {
                handleDeleteBudget(deletedBudget.id)
              }}
            />
          )}

          {/* Institution Budget Modal */}
          {institutionBudgetData && (
            <AnnualBudgetViewEditModal
              isOpen={isInstitutionBudgetModalOpen}
              onOpenChange={setIsInstitutionBudgetModalOpen}
              budget={institutionBudgetData}
              entityName={currentInstitutionData?.name || "Main Institution"}
              entityType="Institution"
              onSave={handleSaveInstitutionBudget}
              readonly={false}
              isLocked={institutionBudgetData?.is_locked || false}
              defaultYear={selectedYear}
            />
          )}

          {/* Institution Lock Confirmation Modal */}
          <Dialog open={isInstitutionLockConfirmModalOpen} onOpenChange={setIsInstitutionLockConfirmModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  {t('annual_budget.modals.lock_institution.title', 'Confirm Institution Lock')}
                </DialogTitle>
                <DialogDescription>
                  {t('annual_budget.modals.lock_institution.description', 
                    'Some departments do not have budgets yet. Locking the institution budget will also lock all existing department budgets. Are you sure you want to continue?')}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsInstitutionLockConfirmModalOpen(false)}
                >
                  {t('annual_budget.modals.buttons.cancel', 'Cancel')}
                </Button>
                <Button
                  onClick={(e) => {
                    setIsInstitutionLockConfirmModalOpen(false)
                    handleToggleInstitutionBudgetLock(e, true)
                  }}
                >
                  {t('annual_budget.modals.buttons.continue', 'Continue')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>


        </div>
      </WithPermission>
    </AppLayout>
  )
}