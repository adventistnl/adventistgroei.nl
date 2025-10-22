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
import { DeleteBudgetModal } from "@/components/modals/annual-budget/delete-budget-modal"

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
  is_locked?: boolean
  has_budget_record?: boolean
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

  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  
  // Modal states
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<BudgetRequest | null>(null)
  const [isInstitutionBudgetModalOpen, setIsInstitutionBudgetModalOpen] = useState(false)
  const [institutionBudgetData, setInstitutionBudgetData] = useState<AnnualBudgetData | null>(null)

  usePageTitle({
    title: t('annual_budget.title')
  })

  // State to track if institution has budget for selected year
  const [institutionBudgets, setInstitutionBudgets] = useState<Record<number, AnnualBudgetData | null>>({
    2024: {
      id: 'inst-budget-2024',
      year: 2024,
      planned_budget: 1500000,
      total_expenses: 877500,
      balance: 622500,
      notes: 'Institution budget for 2024',
      approved_by: 'Finance Committee',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
    // 2025 and 2026 will not have budget initially
  })

  // State to track if institution budget is locked for selected year
  const [institutionBudgetLocks, setInstitutionBudgetLocks] = useState<Record<number, boolean>>({
    2024: false,
    2025: false,
    2026: false
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
      updated_at: '2024-02-10T14:15:00Z',
      is_locked: true,
      has_budget_record: true
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
      updated_at: '2024-03-01T11:30:00Z',
      is_locked: false,
      has_budget_record: true
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
      updated_at: '2024-03-10T16:20:00Z',
      is_locked: false,
      has_budget_record: true
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
      updated_at: '2024-03-15T10:00:00Z',
      is_locked: false,
      has_budget_record: true
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
      updated_at: '2024-02-20T15:30:00Z',
      is_locked: false,
      has_budget_record: true
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
      updated_at: '2023-02-01T14:15:00Z',
      is_locked: true,
      has_budget_record: true
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
      updated_at: '2023-03-10T11:30:00Z',
      is_locked: true,
      has_budget_record: true
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
      updated_at: '2024-12-01T16:20:00Z',
      is_locked: false,
      has_budget_record: true
    },
    // Missing budget record example
    {
      id: '9',
      entity_type: 'department',
      entity_id: 'dept-finance',
      entity_name: 'Finance Department',
      year: 2024,
      requested_amount: 0,
      status: 'pending',
      priority: 'medium',
      category: 'operational',
      description: 'Budget record missing',
      justification: 'No budget request submitted yet',
      requested_by: 'System',
      submitted_date: '2024-01-01',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      is_locked: false,
      has_budget_record: false
    },
    // Placeholder for 2025
    {
      id: '10',
      entity_type: 'institution',
      entity_id: 'institution-2025',
      entity_name: 'System Placeholder 2025',
      year: 2025,
      requested_amount: 0,
      status: 'pending',
      priority: 'low',
      category: 'operational',
      description: 'Placeholder for year 2025',
      justification: 'System generated placeholder',
      requested_by: 'System',
      submitted_date: '2024-01-01',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      is_locked: false,
      has_budget_record: false
    },
    // Placeholder for 2026
    {
      id: '11',
      entity_type: 'institution',
      entity_id: 'institution-2026',
      entity_name: 'System Placeholder 2026',
      year: 2026,
      requested_amount: 0,
      status: 'pending',
      priority: 'low',
      category: 'operational',
      description: 'Placeholder for year 2026',
      justification: 'System generated placeholder',
      requested_by: 'System',
      submitted_date: '2024-01-01',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      is_locked: false,
      has_budget_record: false
    }
  ])

  // Available years for filtering
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(budgetRequests.map(req => req.year))).sort((a, b) => b - a)
    return years.length > 0 ? years : [new Date().getFullYear()]
  }, [budgetRequests])

  // Filtered budget requests based on selected year
  const filteredBudgetRequests = useMemo(() => {
    return budgetRequests.filter(req => req.year === selectedYear)
  }, [budgetRequests, selectedYear])

  // Check if institution has budget for selected year
  const hasInstitutionBudget = useMemo(() => {
    return !!institutionBudgets[selectedYear]
  }, [institutionBudgets, selectedYear])

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
  const handleToggleInstitutionBudgetLock = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card onClick from firing
    
    const isCurrentlyLocked = institutionBudgetLocks[selectedYear] || false
    
    setInstitutionBudgetLocks(prev => ({
      ...prev,
      [selectedYear]: !isCurrentlyLocked
    }))
    
    toast.success(
      isCurrentlyLocked 
        ? `Institution budget for ${selectedYear} unlocked successfully!` 
        : `Institution budget for ${selectedYear} locked successfully!`,
      { duration: 2000 }
    )
  }

  // Handler for editing institution budget
  const handleEditInstitutionBudget = () => {
    const isLocked = institutionBudgetLocks[selectedYear] || false
    
    if (isLocked) {
      toast.error('Budget is locked. Unlock it first to edit.', { duration: 3000 })
      return
    }
    
    const currentBudget = institutionBudgets[selectedYear]
    if (currentBudget) {
      setInstitutionBudgetData(currentBudget)
      setIsInstitutionBudgetModalOpen(true)
    }
  }

  // KPI Data
  const kpiData = useMemo(() => {
    // If no institution budget is set, return zeros
    if (!hasInstitutionBudget) {
      return {
        totalInstitutionBudget: 0,
        totalAllocated: 0,
        totalSpent: 0,
        budgetRemaining: 0,
        budgetUtilization: 0,
        activeDepartments: 0
      }
    }

    // Total Institution Budget (from institution departments)
    const totalInstitutionBudget = institutionBudgets[selectedYear]?.planned_budget || 0
    
    // Calculate total allocated from institution departments
    const institutionDepts = [
      { approved: 220000 }, // Finance
      { approved: 165000 }, // Operations
      { approved: 140000 }, // HR
      { approved: 185000 }, // IT
      { approved: 110000 }, // Marketing
      { approved: 150000 }, // Education
    ]
    const totalAllocated = institutionDepts.reduce((sum, dept) => sum + dept.approved, 0)
    
    // Calculate total spent (75% average spending rate)
    const totalSpent = Math.round(totalAllocated * 0.75)
    
    // Budget remaining
    const budgetRemaining = totalInstitutionBudget - totalAllocated
    
    // Budget utilization percentage
    const budgetUtilization = totalInstitutionBudget > 0 ? Math.round((totalAllocated / totalInstitutionBudget) * 100) : 0
    
    // Number of active departments
    const activeDepartments = institutionDepts.length

    return {
      totalInstitutionBudget,
      totalAllocated,
      totalSpent,
      budgetRemaining,
      budgetUtilization,
      activeDepartments
    }
  }, [selectedYear, hasInstitutionBudget, institutionBudgets])

  const kpiCardsData: KPICardData[] = useMemo(() => {
    const isLocked = institutionBudgetLocks[selectedYear] || false
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
            className="relative group z-10"
            title={isLocked ? t('annual_budget.table.lock_tooltips.locked') : t('annual_budget.table.lock_tooltips.unlocked')}
          >
            <div className={`w-6 h-6 border-2 border-dashed rounded-full flex items-center justify-center transition-all ${
              isLocked 
                ? 'border-gray-900 bg-gray-900 hover:bg-gray-800' 
                : 'border-gray-400 bg-gray-50 opacity-60 hover:opacity-100 hover:border-gray-600'
            }`}>
              {isLocked ? (
                <Lock className="w-3 h-3 text-white" />
              ) : (
                <Unlock className="w-3 h-3 text-gray-600" />
              )}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {isLocked ? t('annual_budget.table.lock_actions.unlock') : t('annual_budget.table.lock_actions.lock')}
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
          : "hover:bg-gray-50 transition-all border-l-4 border-l-gray-400"
    }
  ]}, [kpiData, selectedYear, hasInstitutionBudget, institutionBudgetLocks, handleCreateInstitutionBudget, handleEditInstitutionBudget, handleToggleInstitutionBudgetLock])

  // Mock data for Institution Departments
  const institutionDepartments = useMemo(() => [
    {
      name: 'Finance Dept',
      planned: 250000,
      approved: 220000,
      reserved: 180000,
      institution: 'Main Institution'
    },
    {
      name: 'Operations Dept',
      planned: 180000,
      approved: 165000,
      reserved: 140000,
      institution: 'Main Institution'
    },
    {
      name: 'HR Dept',
      planned: 150000,
      approved: 140000,
      reserved: 120000,
      institution: 'Main Institution'
    },
    {
      name: 'IT Dept',
      planned: 200000,
      approved: 185000,
      reserved: 160000,
      institution: 'Main Institution'
    },
    {
      name: 'Marketing Dept',
      planned: 120000,
      approved: 110000,
      reserved: 95000,
      institution: 'Main Institution'
    },
    {
      name: 'Education Dept',
      planned: 160000,
      approved: 150000,
      reserved: 130000,
      institution: 'Regional Office'
    }
  ], [])

  // Chart data
  const chartData = useMemo(() => {
    // If no institution budget is set, return zeros
    if (!hasInstitutionBudget) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return {
        budgetDistribution: {
          total: 0,
          allocated: 0,
          remaining: 0,
          percentageUsed: 0
        },
        departmentSpending: institutionDepartments.map(dept => ({
          ...dept,
          planned: 0,
          approved: 0,
          reserved: 0
        })),
        spendingOverTime: months.map((month, index) => ({
          date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
          month: month,
          finance: 0,
          operations: 0,
          hr: 0,
          it: 0,
          marketing: 0,
        }))
      }
    }

    // Total institution budget
    const totalInstitutionBudget = institutionBudgets[selectedYear]?.planned_budget || 0
    
    // Calculate total allocated to departments
    const totalAllocated = institutionDepartments.reduce((sum, dept) => sum + dept.approved, 0)
    const remaining = totalInstitutionBudget - totalAllocated

    // Generate mock spending data over time for area chart
    const generateSpendingData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.map((month, index) => {
        // Generate individual monthly spending (not cumulative)
        // Each month has its own spending amount with some variation
        const baseFinance = 15000 + Math.random() * 5000 // 15K-20K per month
        const baseOperations = 12000 + Math.random() * 4000 // 12K-16K per month
        const baseHr = 10000 + Math.random() * 3000 // 10K-13K per month
        const baseIt = 13000 + Math.random() * 4000 // 13K-17K per month
        const baseMarketing = 8000 + Math.random() * 3000 // 8K-11K per month
        
        return {
          date: `${selectedYear}-${String(index + 1).padStart(2, '0')}-01`,
          month: month,
          finance: Math.round(baseFinance),
          operations: Math.round(baseOperations),
          hr: Math.round(baseHr),
          it: Math.round(baseIt),
          marketing: Math.round(baseMarketing),
        }
      })
    }

    return {
      budgetDistribution: {
        total: totalInstitutionBudget,
        allocated: totalAllocated,
        remaining: remaining > 0 ? remaining : 0,
        percentageUsed: totalInstitutionBudget > 0 ? Math.round((totalAllocated / totalInstitutionBudget) * 100) : 0
      },
      departmentSpending: institutionDepartments,
      spendingOverTime: generateSpendingData()
    }
  }, [selectedYear, institutionDepartments, hasInstitutionBudget, institutionBudgets])

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

  const handleToggleLock = (requestId: string) => {
    const updatedRequests = budgetRequests.map(req =>
      req.id === requestId
        ? {
            ...req,
            is_locked: !req.is_locked,
            updated_at: new Date().toISOString()
          }
        : req
    )
    setBudgetRequests(updatedRequests)
    const request = budgetRequests.find(req => req.id === requestId)
    const isNowLocked = !request?.is_locked
    toast.success(isNowLocked ? 'Budget locked successfully' : 'Budget unlocked successfully')
  }

  const handleDeleteBudget = (requestId: string) => {
    const updatedRequests = budgetRequests.filter(req => req.id !== requestId)
    setBudgetRequests(updatedRequests)
    toast.success('Budget deleted successfully')
  }

  const handleSaveInstitutionBudget = (budget: AnnualBudgetData) => {
    setInstitutionBudgets(prev => ({
      ...prev,
      [budget.year]: budget
    }))
    toast.success(`Institution budget for ${budget.year} saved successfully!`)
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
      header: () => (
        <div className="text-left font-medium text-gray-900">
          {t('annual_budget.table.headers.entity_name')}
        </div>
      ),
      cell: ({ row }) => {
        const isDisabled = !row.original.has_budget_record
        return (
          <div className={`flex items-center gap-3 ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
              <Building className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{row.original.entity_name}</div>
              <div className="text-xs text-gray-500 capitalize">{row.original.entity_type}</div>
            </div>
          </div>
        )
      },
    },
    {
      id: "entity_type",
      accessorKey: "entity_type",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t('annual_budget.table.headers.entity_type')}
        </div>
      ),
      cell: ({ row }) => {
        const isDisabled = !row.original.has_budget_record
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-medium text-gray-900 capitalize">
              {row.original.entity_type}
            </div>
          </div>
        )
      },
    },
    {
      id: "budget_total",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t('annual_budget.table.headers.budget_total')}
        </div>
      ),
      cell: ({ row }) => {
        const isDisabled = !row.original.has_budget_record
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-gray-900">
              ${row.original.requested_amount.toLocaleString()}
            </div>
            {/* {row.original.approved_amount && (
              <div className="text-xs text-gray-500 mt-1">
                Approved: ${row.original.approved_amount.toLocaleString()}
              </div>
            )} */}
          </div>
        )
      },
    },
    {
      id: "spent_amount",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t('annual_budget.table.headers.spent_amount')}
        </div>
      ),
      cell: ({ row }) => {
        const approvedAmount = row.original.approved_amount || 0
        const spentAmount = approvedAmount * 0.75 // Mock 75% spent
        const isDisabled = !row.original.has_budget_record
        
        return (
          <div className={`text-center ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-sm font-semibold text-gray-900 opacity-50">
              ${spentAmount.toLocaleString()}
            </div>
          </div>
        )
      },
    },
    {
      id: "usage_percentage",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t('annual_budget.table.headers.usage_percentage')}
        </div>
      ),
      cell: ({ row }) => {
        const approvedAmount = row.original.approved_amount || 0
        const spentAmount = approvedAmount * 0.75 // Mock 75% spent
        const usagePercentage = approvedAmount > 0 ? Math.round((spentAmount / approvedAmount) * 100) : 0
        const isDisabled = !row.original.has_budget_record
        
        return (
          <div className={`flex flex-col items-center space-y-2 ${isDisabled ? 'opacity-50' : ''}`}>
            <div className="text-xs font-medium text-gray-700">
              {usagePercentage}%
            </div>
            <div className="w-16 bg-gray-200 rounded-full h-2 border border-gray-300">
              <div 
                className="bg-gray-600 h-full rounded-full transition-all duration-300" 
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      id: "lock_status",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t('annual_budget.table.headers.lock_status')}
        </div>
      ),
      cell: ({ row }) => {
        const isLocked = row.original.is_locked
        const isDisabled = !row.original.has_budget_record
        
        return (
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (!isDisabled) {
                  handleToggleLock(row.original.id)
                }
              }}
              disabled={isDisabled}
              className={`w-8 h-8 border-2 border-dashed rounded-full flex items-center justify-center transition-all ${
                isDisabled 
                  ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                  : isLocked 
                    ? 'border-gray-900 bg-gray-900 hover:bg-gray-800 cursor-pointer' 
                    : 'border-gray-300 bg-gray-50 opacity-60 hover:opacity-100 hover:border-gray-600 cursor-pointer'
              }`}
              title={isDisabled ? t('annual_budget.table.lock_tooltips.disabled') : isLocked ? t('annual_budget.table.lock_tooltips.locked') : t('annual_budget.table.lock_tooltips.unlocked')}
            >
              {isLocked ? (
                <Lock className={`w-3 h-3 ${isDisabled ? 'text-gray-400' : 'text-white'}`} />
              ) : (
                <Unlock className={`w-3 h-3 ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`} />
              )}
            </button>
          </div>
        )
      },
    },
    {
      id: "budget_status",
      accessorKey: "has_budget_record",
      header: () => (
        <div className="text-center font-medium text-gray-900">
          {t('annual_budget.table.headers.budget_status')}
        </div>
      ),
      cell: ({ row }) => {
        const hasBudget = row.original.has_budget_record
        
        return (
          <div className="flex justify-center">
            {hasBudget ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {t('annual_budget.table.budget_status_labels.completed')}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300 text-xs flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
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
        // value será boolean após conversão no UseTable
        return row.original.has_budget_record === value
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-right font-medium text-gray-900">
          {t('annual_budget.table.headers.actions')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 border border-gray-200">
                <MoreHorizontal className="w-4 h-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => {
                setSelectedRequest(row.original)
                setIsViewEditModalOpen(true)
              }}>
                <Settings className="w-4 h-4 mr-2" />
                {t('annual_budget.table.actions_menu.manage')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleToggleLock(row.original.id)}>
                {row.original.is_locked ? (
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
              <DropdownMenuItem 
                onClick={() => {
                  setSelectedRequest(row.original)
                  setIsDeleteModalOpen(true)
                }}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('annual_budget.table.actions_menu.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ], [filteredBudgetRequests, t])



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
            <h3 className="text-xl font-semibold">{t('annual_budget.charts.budget_analytics.title')}</h3>
            <ResponsiveGridCarousel autoplayDelay={5000} enableAutoplay={false}>
              <SpendingOverTimeChart 
                data={chartData.spendingOverTime}
                year={selectedYear}
              />
              <DepartmentSpendingChart data={chartData.departmentSpending} />
              
              <BudgetDistributionChart 
                data={chartData.budgetDistribution} 
                year={selectedYear}
              />
              

            </ResponsiveGridCarousel>
          </div>

          <Separator />

          {/* Budget Requests - Table View */}
          <div className={`transition-opacity duration-300 ${!hasInstitutionBudget ? 'opacity-40 pointer-events-none' : ''}`}>
            <Card className="border-gray-200 bg-white">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <DollarSign className="w-5 h-5 text-gray-700" />
                      {t('annual_budget.table.title')}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {t('annual_budget.table.subtitle')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-hidden p-4">
                <div className="bg-white">
                  <UseTable
                    columns={columns}
                    data={filteredBudgetRequests}
                    filters={[
                      {
                        id: "entity_type",
                        title: "Entity Type",
                        options: [
                          { label: "Church", value: "church" },
                          { label: "Department", value: "department" },
                          { label: "Region", value: "region" },
                          { label: "Institution", value: "institution" },
                        ]
                      },
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
          {selectedRequest && (
            <AnnualBudgetViewEditModal
              isOpen={isViewEditModalOpen}
              onOpenChange={setIsViewEditModalOpen}
              budget={{
                id: selectedRequest.id,
                year: selectedRequest.year,
                planned_budget: selectedRequest.requested_amount,
                total_expenses: selectedRequest.approved_amount ? selectedRequest.approved_amount * 0.75 : 0,
                balance: selectedRequest.approved_amount ? selectedRequest.approved_amount * 0.25 : selectedRequest.requested_amount,
                notes: selectedRequest.notes || '',
                approved_by: selectedRequest.reviewed_by,
                created_at: selectedRequest.created_at,
                updated_at: selectedRequest.updated_at
              }}
              entityName={selectedRequest.entity_name}
              entityType={selectedRequest.entity_type}
              isLocked={selectedRequest.is_locked}
              onSave={(budget) => {
                const updatedRequests = budgetRequests.map(req =>
                  req.id === selectedRequest.id
                    ? {
                        ...req,
                        requested_amount: budget.planned_budget,
                        approved_amount: budget.total_expenses + budget.balance,
                        notes: budget.notes || undefined,
                        updated_at: new Date().toISOString()
                      }
                    : req
                )
                setBudgetRequests(updatedRequests)
                toast.success('Budget updated successfully')
              }}
            />
          )}

          {/* Delete Budget Modal */}
          {selectedRequest && (
            <DeleteBudgetModal
              isOpen={isDeleteModalOpen}
              onOpenChange={setIsDeleteModalOpen}
              budget={selectedRequest}
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
              isLocked={institutionBudgetLocks[selectedYear] || false}
              defaultYear={selectedYear}
            />
          )}


        </div>
      </WithPermission>
    </AppLayout>
  )
}