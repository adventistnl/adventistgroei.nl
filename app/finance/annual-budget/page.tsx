"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { GET_ALL_SUBSIDY_REQUESTS } from "@/graphql/queries/SUBSIDY_REQUESTS_QUERY"
import { GET_SUBSIDY_STATUS_HISTORY } from "@/graphql/queries/SUBSIDY_STATUS_HISTORY_QUERIES"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
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
  XCircle,
  Clock,
  Building,
  AlertTriangle,
  Lock,
  Unlock,
  Settings,
  TrendingUp,
  Eye,
  Coins,
} from "lucide-react"
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
import { GlobalPrivacyToggle } from "@/components/shared/global-privacy-toggle"
import { YearFilter } from "@/components/shared/year-filter"
import { useInstitution } from "@/contexts/institution-context"
import { useCurrency } from "@/contexts/currency-context"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { AccessDenied } from "@/components/access/access-denied"
import { WithPermission } from "@/hocs/with-permission"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { createPrivacyConfig } from "@/config/privacy-roles.config"

// Chart Components
import { DepartmentSpendingChart } from "@/components/charts/annual-budget/department-spending-chart"
import { BudgetDistributionChart } from "@/components/charts/annual-budget/budget-distribution-chart"
import { SpendingOverTimeChart } from "@/components/charts/annual-budget/spending-over-time-chart"

// Modal Components
import { AnnualBudgetViewEditModal, AnnualBudgetData } from "@/components/modals/annual-budget/annual-budget-view-edit-modal"
import { DeleteBudgetModal } from "@/components/modals/annual-budget/delete-budget-modal"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"

// GraphQL Hooks
import {
  useCreateInstitutionBudgetMutation,
  useUpdateInstitutionBudgetMutation,
  useCreateDepartmentBudgetMutation,
  useUpdateDepartmentBudgetMutation,
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
import { StatusBadge } from "@/components/ui/status-badge"

/**
 * PÁGINA DE GESTÃO DE ORÇAMENTO ANUAL
 * Interface para gerenciar solicitações de orçamento de todas as entidades da organização
 */
export default function AnnualBudgetPage() {
  const { t } = useTranslation()
  const { currentInstitutionData, refetchInstitutionById } = useInstitution()
  const { formatCurrency: formatCurrencyGlobal, selectedCurrency, setCurrency, availableCurrencies } = useCurrency()
  
  // Privacy configurations for KPIs (memoized to ensure stable IDs)
  const PRIVACY_CONFIGS = useMemo(() => ({
    totalBudget: createPrivacyConfig('kpi-total-budget', 'FINANCIAL_DATA'),
    totalAllocated: createPrivacyConfig('kpi-total-allocated', 'FINANCIAL_DATA'),
    totalSpent: createPrivacyConfig('kpi-total-spent', 'FINANCIAL_DATA'),
    budgetRemaining: createPrivacyConfig('kpi-budget-remaining', 'FINANCIAL_DATA'),
    budgetUtilization: createPrivacyConfig('kpi-budget-utilization', 'FINANCIAL_DATA'),
  }), [])
  
  // GraphQL mutations
  const [createInstitutionBudgetMutation] = useCreateInstitutionBudgetMutation()
  const [updateInstitutionBudgetMutation] = useUpdateInstitutionBudgetMutation()
  const [createDepartmentBudgetMutation] = useCreateDepartmentBudgetMutation()
  const [updateDepartmentBudgetMutation] = useUpdateDepartmentBudgetMutation()
  const [deleteAnnualBudgetMutation] = useDeleteAnnualBudgetMutation()
  const [approveAnnualBudgetMutation] = useApproveAnnualBudgetMutation()
  const [rejectAnnualBudgetMutation] = useRejectAnnualBudgetMutation()
  const [requestRevisionAnnualBudgetMutation] = useRequestRevisionAnnualBudgetMutation()
  const [toggleBudgetLockMutation, { loading: togglingLock }] = useToggleBudgetLockMutation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [operationInProgress, setOperationInProgress] = useState(false)

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  
  // Currency formatting wrapper to adapt old signature to new context
  const formatCurrencyCompat = (amount: number, _currencyConfig?: any, options?: any) => {
    return formatCurrencyGlobal(amount, options)
  }
  
  // Modal states
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<GetBudgetDashboardData_annualBudgets | null>(null)
  const [selectedDepartmentData, setSelectedDepartmentData] = useState<any>(null)
  const [isInstitutionBudgetModalOpen, setIsInstitutionBudgetModalOpen] = useState(false)
  const [institutionBudgetData, setInstitutionBudgetData] = useState<AnnualBudgetData | null>(null)
  const [isInstitutionLockConfirmModalOpen, setIsInstitutionLockConfirmModalOpen] = useState(false)
  const [pendingLockAction, setPendingLockAction] = useState<{ event: React.MouseEvent, forceLock: boolean } | null>(null)

  // GraphQL Queries
  const { data: dashboardData, loading: loadingDashboard, refetch: refetchDashboard } = useBudgetDashboardData(selectedYear)
  const { data: availableYearsData, loading: loadingYears, refetch: refetchYears } = useAvailableYears()
  const { data: kpisData, loading: loadingKPIs, refetch: refetchKPIs } = useAnnualBudgetKPIs({
    skip: !currentInstitutionData?.id,
    variables:{
      institutionId: currentInstitutionData?.id!,
      year: selectedYear
    }
  })

  // Query para buscar dados de subsidies para cruzar com as datas de aprovação
  const { data: subsidyData } = useQuery(GET_ALL_SUBSIDY_REQUESTS)
  
  // Query para buscar histórico de status dos subsídios para obter datas precisas de aprovação
  const { data: subsidyStatusHistoryData } = useQuery(GET_SUBSIDY_STATUS_HISTORY, {
    variables: { subsidyRequestId: "ALL" }, // Assumindo que podemos buscar todos
    skip: !subsidyData?.subsidyRequests?.length, // Só buscar se tiver subsídios
  })

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
    // Filter only INSTITUTION-type budgets, not department budgets
    institution.annual_budgets
      .filter((budget: any) => budget.entity_type === 'INSTITUTION')
      .forEach((budget: any) => {
        budgets[budget.year] = {
          id: budget.id,
          year: budget.year,
          planned_budget: parseFloat(budget.planned_budget) || 0,
          total_expenses: parseFloat(budget.total_expenses) || 0,
          allocated_amount: parseFloat(budget.allocated_amount) || 0,
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
    const institution = currentInstitutionData
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
        annualBudget: (annualBudget && annualBudget.has_budget_record) ? {
          id: annualBudget.id,
          year: annualBudget.year,
          planned_budget: parseFloat(annualBudget.planned_budget) || 0,
          total_expenses: parseFloat(annualBudget.total_expenses) || 0,
          balance: parseFloat(annualBudget.balance) || 0,
          status: annualBudget.status,
          priority: annualBudget.priority,
          category: annualBudget.category,
          allocated_amount: parseFloat(annualBudget.allocated_amount) || 0,
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
      allocated_amount: 0,
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
      toast.error(t('annual_budget.messages.institution_budget_not_found'))
      return
    }

    // Prevent multiple calls during loading
    if (togglingLock) {
      return
    }

    // Check if trying to lock and there are departments without budget
    const isCurrentlyLocked = institutionBudget.is_locked
    const tryingToLock = !isCurrentlyLocked

    // Show confirmation modal when trying to lock
    if (tryingToLock && !forceLock) {
      setPendingLockAction({ event: e, forceLock: false })
      setIsInstitutionLockConfirmModalOpen(true)
      return
    }

    // Get all department budgets with locks for unlock operation
    const departmentBudgetsWithLocks = isCurrentlyLocked 
      ? departmentBudgetData.filter((dept: any) => dept.hasBudgetRecord && dept.isLocked && dept.annualBudget?.id)
      : []

    // Show loading toast
    const loadingToast = toast.loading(
      isCurrentlyLocked 
        ? t('annual_budget.messages.unlocking_budget', `Unlocking institution budget and ${departmentBudgetsWithLocks.length} department budgets...`)
        : t('annual_budget.messages.locking_budget', 'Locking institution budget and all department budgets...')
    )

    try {
      // First, toggle the institution budget lock
      const result = await toggleBudgetLockMutation({
        variables: {
          id: institutionBudget.id
        }
      })

      if (result.data?.toggleBudgetLock) {
        const isNowLocked = result.data.toggleBudgetLock.is_locked
        
        // If unlocking, also unlock all locked department budgets
        if (!isNowLocked && departmentBudgetsWithLocks.length > 0) {
          // Unlock all department budgets in parallel
          const unlockPromises = departmentBudgetsWithLocks.map((dept: any) => 
            toggleBudgetLockMutation({
              variables: {
                id: dept.annualBudget!.id
              }
            })
          )
          
          await Promise.all(unlockPromises)
        }
        
        // Refetch all data to ensure consistency
        await Promise.all([
          refetchKPIs(),
          refetchDashboard(),
          refetchInstitutionById()
        ])
        
        // Dismiss loading and show success
        toast.dismiss(loadingToast)
        toast.success(
          isNowLocked 
            ? t('annual_budget.messages.lock_success') 
            : t('annual_budget.messages.unlock_success', `Institution and ${departmentBudgetsWithLocks.length} departments unlocked successfully`), 
          {
            id: `institution-lock-${institutionBudget.id}`,
            duration: 3000
          }
        )
      }
    } catch (error: any) {
      console.error('Error toggling institution budget lock:', error)
      toast.dismiss(loadingToast)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.lock_error')

      toast.error(errorMessage, {
        id: `institution-lock-error-${institutionBudget.id}`,
        duration: 3000
      })
    }
  }

  // Handler to confirm lock action from modal
  const handleConfirmLock = async () => {
    setIsInstitutionLockConfirmModalOpen(false)
    
    if (pendingLockAction) {
      // Execute the lock action with forceLock = true
      await handleToggleInstitutionBudgetLock(pendingLockAction.event, true)
      setPendingLockAction(null)
    }
  }

  // Handler for editing institution budget
  const handleEditInstitutionBudget = () => {
    const currentBudget = institutionAnnualBudgets[selectedYear]
    const isLocked = currentBudget?.is_locked || false
    
    if (isLocked) {
      toast.error(t('annual_budget.messages.budget_locked_edit'), { duration: 3000 })
      return
    }
    if (currentBudget) {
      setInstitutionBudgetData(currentBudget)
      setIsInstitutionBudgetModalOpen(true)
    }
  }

  // KPI Data from GraphQL - use backend data from institution budget
  const kpiData = useMemo(() => {
    // Use data from backend (kpisData.budgetKPIs) which comes from institution budget
    if (kpisData?.budgetKPIs) {
      return kpisData.budgetKPIs
    }

    // Fallback to zeros if no data from backend
    return {
      totalInstitutionBudget: 0,
      totalAllocated: 0,
      totalSpent: 0,
      budgetRemaining: 0,
      budgetUtilization: 0,
      activeDepartments: 0
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
        value: hasInstitutionBudget ? formatCurrencyCompat(kpiData.totalInstitutionBudget, null, { compact: true }) : t('annual_budget.kpi_cards.total_institution_budget.not_set'),
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
          : "hover:bg-blue-50 transition-all border-l-4 border-l-blue-500 cursor-pointer",
        privacyConfig: PRIVACY_CONFIGS.totalBudget,
        headerAction: hasInstitutionBudget ? (
          <div className="flex items-center gap-1">
            <InlinePrivacyToggle 
              config={PRIVACY_CONFIGS.totalBudget}
              className="w-6 h-6 flex-shrink-0"
            />
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
          </div>
        ) : undefined
      },
    {
      id: "total_allocated",
      title: t('annual_budget.kpi_cards.total_allocated.title'),
      value: formatCurrencyCompat(kpiData.totalAllocated, null, { compact: true }),
      icon: CheckCircle,
      subtitle: t('annual_budget.kpi_cards.total_allocated.subtitle'),
      trend: {
        value: 8,
        isPositive: true,
        label: t('annual_budget.kpi_cards.total_allocated.trend')
      },
      className: !hasInstitutionBudget 
        ? "opacity-40 pointer-events-none" 
        : "hover:bg-green-50 transition-all border-l-4 border-l-green-500",
      privacyConfig: PRIVACY_CONFIGS.totalAllocated,
      headerAction: hasInstitutionBudget ? (
        <InlinePrivacyToggle 
          config={PRIVACY_CONFIGS.totalAllocated}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    },
    {
      id: "total_spent",
      title: t('annual_budget.kpi_cards.total_spent.title'),
      value: formatCurrencyCompat(kpiData.totalSpent, null, { compact: true }),
      icon: TrendingUp,
      subtitle: t('annual_budget.kpi_cards.total_spent.subtitle'),
      trend: {
        value: 12,
        isPositive: true,
        label: t('annual_budget.kpi_cards.total_spent.trend')
      },
      className: !hasInstitutionBudget 
        ? "opacity-40 pointer-events-none" 
        : "hover:bg-purple-50 transition-all border-l-4 border-l-purple-500",
      privacyConfig: PRIVACY_CONFIGS.totalSpent,
      headerAction: hasInstitutionBudget ? (
        <InlinePrivacyToggle 
          config={PRIVACY_CONFIGS.totalSpent}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    },
    {
      id: "budget_remaining",
      title: t('annual_budget.kpi_cards.budget_remaining.title'),
      value: (
        <span className={isDeficit ? 'text-red-600' : 'text-green-600'}>
          {isDeficit && '-'}{formatCurrencyCompat(Math.abs(budgetRemainingValue), null, { compact: true })}
        </span>
      ),
      icon: isDeficit ? AlertTriangle : CheckCircle,
      subtitle: isDeficit ? t('annual_budget.kpi_cards.budget_remaining.subtitle_deficit') : t('annual_budget.kpi_cards.budget_remaining.subtitle_available'),
      trend: {
        value: Math.round((Math.abs(budgetRemainingValue) / kpiData.totalInstitutionBudget) * 100) || 0,
        isPositive: !isDeficit,
        label: isDeficit ? t('annual_budget.kpi_cards.budget_remaining.trend_over') : t('annual_budget.kpi_cards.budget_remaining.trend')
      },
      className: !hasInstitutionBudget 
        ? "opacity-40 pointer-events-none" 
        : isDeficit
          ? "hover:bg-red-50/50 transition-all border-l-4 border-l-red-500"
          : "hover:bg-green-50/50 transition-all border-l-4 border-l-green-500",
      privacyConfig: PRIVACY_CONFIGS.budgetRemaining,
      headerAction: hasInstitutionBudget ? (
        <InlinePrivacyToggle 
          config={PRIVACY_CONFIGS.budgetRemaining}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
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
          : "hover:bg-muted/50 transition-all border-l-4 border-l-muted-foreground",
      privacyConfig: PRIVACY_CONFIGS.budgetUtilization,
      headerAction: hasInstitutionBudget ? (
        <InlinePrivacyToggle 
          config={PRIVACY_CONFIGS.budgetUtilization}
          className="w-6 h-6 flex-shrink-0"
        />
      ) : undefined
    }
  ]
  }, [kpiData, selectedYear, hasInstitutionBudget, institutionAnnualBudgets, handleCreateInstitutionBudget, handleEditInstitutionBudget, handleToggleInstitutionBudgetLock, t, PRIVACY_CONFIGS])

  // Chart data from GraphQL
  const chartData = useMemo(() => {
    // Build entity distribution from real department data
    const entityDistribution = departmentBudgetData
      .filter((dept: any) => dept.hasBudgetRecord && dept.annualBudget)
      .map((dept: any) => ({
        name: dept.departmentName,
        amount: dept.annualBudget?.allocated_amount || 0,
        percentage: kpiData.totalInstitutionBudget > 0 
          ? Math.round(((dept.annualBudget?.allocated_amount || 0) / kpiData.totalInstitutionBudget) * 100)
          : 0,
        count: 1
      }))
      .filter((entity: any) => entity.amount > 0)

    // Função auxiliar para encontrar a data real de aprovação usando o histórico
    const findRealApprovalDate = (subsidyId: string, subsidyApprovedAt: string | null, subsidyUpdatedAt: string) => {
      // Primeiro, tentar usar a data approved_at se existir
      if (subsidyApprovedAt) {
        
        return subsidyApprovedAt
      }

      // Se tiver histórico de status, procurar pela data de aprovação
      if (subsidyStatusHistoryData?.getSubsidyStatusHistory) {
        const approvalHistory = subsidyStatusHistoryData.getSubsidyStatusHistory.find((history: any) => 
          history.subsidy_request_id === subsidyId && 
          ['APPROVED', 'CLOSED'].includes(history.status?.name?.toUpperCase())
        )
        
        if (approvalHistory) {
          
          return approvalHistory.changed_at
        }
      }

      // Fallback para updated_at
      
      return subsidyUpdatedAt
    }

    // Função para contabilizar subsidios aprovados por mês e departamento
    const processSubsidySpendingByMonth = () => {

      
      if (!subsidyData?.subsidyRequests) {
        return []
      }

      const allMonths = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ]

      // Inicializar estrutura para todos os meses
      const monthlySpending = new Map()
      allMonths.forEach((month, index) => {
        const date = new Date(selectedYear, index, 1)
        monthlySpending.set(month, {
          month: month,
          date: format(date, 'yyyy-MM-dd'),
          departments: []
        })
      })
      // Filtrar subsidios aprovados e fechados
      const approvedSubsidies = subsidyData.subsidyRequests
        .filter((subsidy: any) => {
          const statusMatch = ['APPROVED', 'CLOSED'].includes(subsidy.subsidy_status?.name)
          const hasDepartment = subsidy.department_id
        
          
          return statusMatch && hasDepartment
        })


      const departmentConnections = new Map()
      
      approvedSubsidies.forEach((subsidy: any) => {
        const deptId = subsidy.department_id
        const deptName = subsidy.department?.name
        
        if (!departmentConnections.has(deptId)) {
          departmentConnections.set(deptId, {
            id: deptId,
            name: deptName,
            subsidyIds: [],
            totalAmount: 0
          })
        }
        
        const deptData = departmentConnections.get(deptId)
        deptData.subsidyIds.push(subsidy.id)
        deptData.totalAmount += parseFloat(subsidy.approved_amount) || parseFloat(subsidy.total_budget) || 0
      })


      // Processar subsidios aprovados e fechados
      let processedCount = 0
      approvedSubsidies.forEach((subsidy: any) => {
        const deptId = subsidy.department_id
        const deptName = subsidy.department?.name || `Departamento ${deptId}`
        
        // Usar função auxiliar para encontrar a data real de aprovação
        const approvalDate = findRealApprovalDate(subsidy.id, subsidy.approved_at, subsidy.updated_at)
        const approvedAmount = parseFloat(subsidy.approved_amount) || parseFloat(subsidy.total_budget) || 0

        
        if (approvalDate && new Date(approvalDate).getFullYear() === selectedYear) {
          const monthKey = format(new Date(approvalDate), 'MMM', { locale: ptBR })
          // Garantir que a primeira letra seja maiúscula para corresponder à estrutura
          const normalizedMonthKey = monthKey.charAt(0).toUpperCase() + monthKey.slice(1)

          if (monthlySpending.has(normalizedMonthKey)) {
            const monthData = monthlySpending.get(normalizedMonthKey)
            
            // Buscar se departamento já existe neste mês
            let deptIndex = monthData.departments.findIndex(
              (d: any) => d.departmentId === deptId
            )
            
            if (deptIndex === -1) {
              // Adicionar novo departamento
              monthData.departments.push({
                departmentId: deptId,
                departmentName: deptName,
                amount: approvedAmount
              })

            } else {
              // Somar ao departamento existente
              const oldAmount = monthData.departments[deptIndex].amount
              monthData.departments[deptIndex].amount += approvedAmount

            }
            processedCount++
          }
        } 
      })


      // Converter para array e manter ordem dos meses
      const result = Array.from(monthlySpending.values())

      return result
    }

    const processedSpendingOverTime = processSubsidySpendingByMonth()
    
    // Fallback para dados originais se não houver dados de subsidy
    const finalSpendingOverTime = processedSpendingOverTime.length > 0 
      ? processedSpendingOverTime 
      : (kpisData?.spendingOverTime || [])


    if (!kpisData) {
   
      return {
        budgetDistribution: {
          total: kpiData.totalInstitutionBudget,
          spent: kpiData.totalSpent,
          allocated: kpiData.totalAllocated,
          available: kpiData.budgetRemaining,
          percentageUsed: kpiData.budgetUtilization
        },
        departmentSpending: [],
        spendingOverTime: finalSpendingOverTime,
        entityDistribution
      }
    }

    return {
      budgetDistribution: kpisData.budgetDistribution,
      departmentSpending: kpisData.departmentSpending || [],
      spendingOverTime: finalSpendingOverTime,
      entityDistribution
    }
  }, [kpisData, kpiData, departmentBudgetData, subsidyData, subsidyStatusHistoryData, selectedYear])

  // Handlers
  // Centraliza o recarregamento de todos os dados
  const handleRefresh = async (showNotification: boolean = false) => {
    setRefreshing(true)
    let refreshToast: string | undefined = undefined
    
    if (showNotification) {
      refreshToast = toast.loading(t('annual_budget.messages.refreshing'))
    }
    
    try {
      await Promise.all([
        refetchKPIs(),
        refetchDashboard(),
        refetchInstitutionById(),
        refetchYears()
      ])
      
      if (showNotification) {
        toast.success(t('annual_budget.messages.refresh_success'), { duration: 2000 })
      }
    } catch (error) {
      if (showNotification) {
        toast.error(t('annual_budget.messages.refresh_error'))
      }
      console.error('Erro ao recarregar dados:', error)
    } finally {
      if (refreshToast) {
        toast.dismiss(refreshToast)
      }
      setRefreshing(false)
    }
  }

  // Refetch data when page is opened
  useEffect(() => {
    handleRefresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddYear = () => {
    const currentYear = new Date().getFullYear()
    const maxAllowedYear = currentYear + 2
    const nextYear = Math.max(...availableYears) + 1

    if (nextYear > maxAllowedYear) {
      toast.error(t('annual_budget.messages.cannot_add_year_beyond', { maxYear: maxAllowedYear }))
      return
    }

    if (availableYears.includes(nextYear)) {
      toast.error(t('annual_budget.messages.year_already_exists'))
      return
    }

    // Add year locally to frontend state
    setAvailableYears(prev => [...prev, nextYear].sort((a, b) => b - a))
    toast.success(t('annual_budget.messages.year_added_success', { year: nextYear }))
  }

  const handleApproveRequest = async (requestId: string, approvedAmount?: number) => {
    if (operationInProgress) return
    setOperationInProgress(true)
    
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
        await handleRefresh()
        toast.success(t('annual_budget.messages.approve_success'))
      }
    } catch (error: any) {
      console.error('Error approving budget:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.approve_error')

      toast.error(errorMessage)
    } finally {
      setOperationInProgress(false)
    }
  }

  const handleRejectRequest = async (requestId: string, reason: string) => {
    if (operationInProgress) return
    setOperationInProgress(true)
    
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
        await handleRefresh()
        toast.success(t('annual_budget.messages.reject_success'))
      }
    } catch (error: any) {
      console.error('Error rejecting budget:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.reject_error')

      toast.error(errorMessage)
    } finally {
      setOperationInProgress(false)
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
        await handleRefresh()
        toast.success(t('annual_budget.messages.revision_success'))
      }
    } catch (error: any) {
      console.error('Error requesting revision:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.revision_error')

      toast.error(errorMessage)
    }
  }

  const handleToggleLock = async (requestId: string) => {
    if (operationInProgress || togglingLock) return
    setOperationInProgress(true)
    
    try {
      const result = await toggleBudgetLockMutation({
        variables: {
          id: requestId
        }
      })
      if (result.data?.toggleBudgetLock) {
        // Otimização: em vez de recarregar tudo, refetch apenas as queries necessárias
        await Promise.all([
          refetchKPIs(),
          refetchDashboard(),
          refetchInstitutionById()
        ])
        
        const isNowLocked = result.data.toggleBudgetLock.is_locked
        // Usar toast com id para evitar duplicatas
        toast.success(isNowLocked ? t('annual_budget.messages.lock_success') : t('annual_budget.messages.unlock_success'), {
          id: `budget-lock-${requestId}`,
          duration: 2000
        })
      }
    } catch (error: any) {
      console.error('Error toggling budget lock:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.lock_error')

      toast.error(errorMessage, {
        id: `budget-lock-error-${requestId}`,
        duration: 3000
      })
    } finally {
      setOperationInProgress(false)
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
        await handleRefresh()
        toast.success(t('annual_budget.messages.delete_success'))
      }
    } catch (error: any) {
      console.error('Error deleting budget:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.delete_error')

      toast.error(errorMessage)
    }
  }

  const handleDepartmentBudgetSave = async (budget: AnnualBudgetData, departmentData: any) => {
    try {
      if (budget.id) {
        // Update existing department budget
        const result = await updateDepartmentBudgetMutation({
          variables: {
            id: budget.id,
            data: {
              planned_budget: budget.planned_budget,
              total_expenses: budget.total_expenses,
              allocated_amount: budget.allocated_amount,
              description: `Updated budget for ${departmentData.departmentName}`,
              justification: budget.notes || `Updated budget allocation`,
              notes: budget.notes,
            }
          }
        })
        if (result.data?.updateDepartmentBudget) {
          await handleRefresh()
          toast.success(t('annual_budget.messages.department_budget_updated'))
          setIsViewEditModalOpen(false)
          setSelectedDepartmentData(null)
        }
      } else {
        // Create new department budget
        const result = await createDepartmentBudgetMutation({
          variables: {
            data: {
              department_id: departmentData.departmentId,
              year: budget.year,
              planned_budget: budget.planned_budget,
              total_expenses: budget.total_expenses || 0,
              allocated_amount: budget.allocated_amount || 0,
              description: `Budget for ${departmentData.departmentName}`,
              justification: budget.notes || `Annual budget allocation for ${departmentData.departmentName}`,
              notes: budget.notes,
            }
          }
        })
        if (result.data?.createDepartmentBudget) {
          await handleRefresh()
          toast.success(t('annual_budget.messages.department_budget_created', { departmentName: departmentData.departmentName }))
          setIsViewEditModalOpen(false)
          setSelectedDepartmentData(null)
        }
      }
    } catch (error: any) {
      console.error('Error saving department budget:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.department_budget_save_failed')

      toast.error(errorMessage)
    }
  }

  const handleSaveInstitutionBudget = async (budget: AnnualBudgetData) => {
    try {
      const result = await createInstitutionBudgetMutation({
        variables: {
          data: {
            institution_id: currentInstitutionData?.id || '',
            year: budget.year,
            planned_budget: budget.planned_budget,
            total_expenses: budget.total_expenses || 0,
            allocated_amount: budget.allocated_amount || 0,
            description: `Institution budget for ${budget.year}`,
            justification: budget.notes || `Annual budget allocation for institution operations in ${budget.year}`,
            notes: budget.notes,
          }
        }
      })
      if (result.data?.createInstitutionBudget) {
        await handleRefresh()
        toast.success(t('annual_budget.messages.institution_budget_created', { year: budget.year }))
        setIsInstitutionBudgetModalOpen(false)
        setInstitutionBudgetData(null)
      }
    } catch (error: any) {
      console.error('Error creating institution budget:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.institution_budget_create_failed')

      toast.error(errorMessage)
    }
  }

  const handleUpdateBudget = async (budget: AnnualBudgetData) => {
    if (!budget.id) {
      toast.error(t('annual_budget.messages.budget_id_required'))
      return
    }

    try {
      const result = await updateInstitutionBudgetMutation({
        variables: {
          id: budget.id,
          data: {
            planned_budget: budget.planned_budget,
            total_expenses: budget.total_expenses,
            allocated_amount: budget.allocated_amount,
            description: `Updated budget for ${budget.year}`,
            justification: budget.notes || `Updated budget allocation`,
            notes: budget.notes,
          }
        }
      })
      if (result.data?.updateInstitutionBudget) {
        await handleRefresh()
        toast.success(t('annual_budget.messages.budget_updated'))
        setIsInstitutionBudgetModalOpen(false)
        setInstitutionBudgetData(null)
        setSelectedRequest(null)
      }
    } catch (error: any) {
      console.error('Error updating budget:', error)
      // Extract actual error message from multiple possible error sources
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.networkError?.message ||
        error?.message ||
        t('annual_budget.messages.budget_update_failed')

      toast.error(errorMessage)
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
      id: "balance_status",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.balance_status') || 'Balance Status'}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isDisabled = !departmentData.hasBudgetRecord
        
        if (!departmentData.hasBudgetRecord || !departmentData.annualBudget) {
          return (
            <div className="flex justify-center">
              <StatusBadge
                label="No Budget"
                variant="neutral"
                size="sm"
              />
            </div>
          )
        }
        
        const plannedBudget = departmentData.annualBudget?.planned_budget || 0
        const allocatedAmount = departmentData.annualBudget?.allocated_amount || 0
        const spentAmount = departmentData.spentAmount || 0
        
        // Calculate remaining balance: planned - (allocated + spent)
        const balance = plannedBudget - (allocatedAmount + spentAmount)
        const utilizationRate = plannedBudget > 0 ? ((allocatedAmount + spentAmount) / plannedBudget) * 100 : 0
        
        // Determine status based on balance and utilization
        let status: { label: string; variant: "success" | "warning" | "error" | "neutral" | "info" } = {
          label: "Healthy",
          variant: "success"
        }
        
        if (balance < 0) {
          // Over budget - spent more than planned
          status = {
            label: `Over Budget`,
            variant: "error"
          }
        } else if (utilizationRate >= 90) {
          // At risk - 90% or more utilized
          status = {
            label: `At Risk`,
            variant: "warning"
          }
        } else if (utilizationRate >= 75) {
          // Warning - 75-89% utilized
          status = {
            label: `Good`,
            variant: "info"
          }
        } else {
          // Healthy - less than 75% utilized
          status = {
            label: `Healthy`,
            variant: "success"
          }
        }
        
        return (
          <div className="flex justify-center">
            <StatusBadge
              label={status.label}
              variant={status.variant}
              showDot
              size="sm"
            />
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
        const budgetAmount = departmentData.annualBudget?.planned_budget || 0
        
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-foreground">
              {isDisabled ? '-' : formatCurrencyCompat(budgetAmount, null)}
            </div>
          </div>
        )
      },
    },
    {
      id: "allocated_amount",
      header: () => (
        <div className="text-center font-medium text-foreground">
          {t('annual_budget.table.headers.allocated_amount')}
        </div>
      ),
      cell: ({ row }) => {
        const departmentData = row.original
        const isDisabled = !departmentData.hasBudgetRecord
        const allocatedAmount = departmentData.annualBudget?.allocated_amount || 0
        
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-foreground">
              {isDisabled ? '-' : formatCurrencyCompat(allocatedAmount, null)}
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
              {isDisabled ? '-' : formatCurrencyCompat(departmentData.spentAmount, null)}
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
                <WithPermission requiredPermissions={[PermissionResolverName.UpdateDepartmentBudget]}>
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
                </WithPermission>
                
                {/* Lock/Unlock Action - Disabled if no budget */}
                <WithPermission requiredPermissions={[PermissionResolverName.ToggleBudgetLock]}>
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
                </WithPermission>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ], [departmentBudgetData, t, currentInstitutionData])

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
      <WithPermission requiredPermissions={[PermissionResolverName.AnnualBudgets]} fallback={<AccessDenied/>}>
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
                {currentInstitutionData && (
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      <Building className="w-3 h-3 mr-1" />
                      {currentInstitutionData.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentInstitutionData.denomination}
                    </Badge>
                  </div>
                )}
            </div>
            
            <div className="flex items-center gap-3">
              <GlobalPrivacyToggle 
                labels={{
                  showAll: t('annual_budget.buttons.show_all_kpis', 'Show All KPIs'),
                  hideAll: t('annual_budget.buttons.hide_all_kpis', 'Hide All KPIs'),
                  someHidden: t('annual_budget.buttons.some_kpis_hidden', 'Some KPIs hidden'),
                }}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => handleRefresh(true)}
                disabled={refreshing}
                title={t('annual_budget.buttons.refresh')}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Year Filter */}
          <YearFilter 
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onAddYear={handleAddYear}
            showAddButton={true}
            className="mb-6"
          />

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
            <div className="flex items-center">
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
              <DepartmentSpendingChart 
                data={chartData.departmentSpending}
              />
              
              <BudgetDistributionChart
                data={chartData.budgetDistribution}
                year={selectedYear}
              />
              

            </ResponsiveGridCarousel>
          </div>

          <Separator />

          {/* Budget Requests - Table View */}
          <div className={`transition-opacity duration-300 ${!hasInstitutionBudget ? 'opacity-40 pointer-events-none' : ''}`}>
            <Card className="border-border bg-card">
              <CardHeader>
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
                planned_budget: parseFloat(selectedRequest.allocated_amount as string) || 0,
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
              availableBudget={kpiData.budgetRemaining > 0 ? kpiData.budgetRemaining : undefined}
            />
          )}

          {/* Institution Budget Modal */}
          {isInstitutionBudgetModalOpen && (
            <AnnualBudgetViewEditModal
              isOpen={isInstitutionBudgetModalOpen}
              onOpenChange={(open) => {
                setIsInstitutionBudgetModalOpen(open)
                if (!open) {
                  setInstitutionBudgetData(null)
                }
              }}
              budget={institutionBudgetData}
              entityName={currentInstitutionData?.name || 'Institution'}
              entityType="Institution"
              isLocked={institutionAnnualBudgets[selectedYear]?.is_locked || false}
              onSave={(budget) => {
                // If budget has a real ID (not the temporary one), update it, otherwise create new
                if (institutionAnnualBudgets[selectedYear]?.id) {
                  handleUpdateBudget(budget)
                } else {
                  handleSaveInstitutionBudget(budget)
                }
              }}
              defaultYear={selectedYear}
              availableBudget={undefined}
            />
          )}

          {/* Institution Lock Confirmation Modal */}
          <ConfirmationModal
            isOpen={isInstitutionLockConfirmModalOpen}
            onOpenChange={setIsInstitutionLockConfirmModalOpen}
            onConfirm={handleConfirmLock}
            variant="default"
            icon={Lock}
            title={t('annual_budget.modals.lock_institution_budget.title', 'Lock Institution Budget')}
            description={t('annual_budget.modals.lock_institution_budget.warning',
              'This action will lock the institution budget and prevent any further modifications.')}
            impacts={[
              t('annual_budget.modals.lock_institution_budget.impact_1',
                'All existing department budgets will be locked automatically'),
              t('annual_budget.modals.lock_institution_budget.impact_2',
                'No new department budgets can be created'),
              t('annual_budget.modals.lock_institution_budget.impact_3',
                'Departments without budgets will remain without budgets')
            ]}
            confirmText={t('annual_budget.modals.buttons.confirm_lock', 'Yes, Lock Budget')}
            cancelText={t('annual_budget.modals.buttons.cancel', 'Cancel')}
            isLoading={togglingLock}
            closeOnConfirm={false}
          >
            <p className="text-sm text-muted-foreground">
              {t('annual_budget.modals.lock_institution_budget.question',
                'Are you sure you want to proceed with locking the institution budget?')}
            </p>
          </ConfirmationModal>

        </div>
      </WithPermission>
    </AppLayout>
  )
}