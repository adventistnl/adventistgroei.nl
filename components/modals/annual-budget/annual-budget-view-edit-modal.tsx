"use client"

/* 
 * USAGE EXAMPLE:
 * 
 * // For Institution Budget
 * <AnnualBudgetViewEditModal
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   budget={budget}
 *   entityName="Central Institution"
 *   entityType="Institution"
 *   allocatedExpenses={50000} // Total already allocated to departments
 *   allocatedReserved={10000} // Reserved amounts already committed
 * />
 * 
 * // For Department Budget  
 * <AnnualBudgetViewEditModal
 *   isOpen={isOpen}
 *   onOpenChange={setIsOpen}
 *   budget={departmentBudget}
 *   entityName="Youth Department"
 *   entityType="Department"
 *   availableBudget={100000} // Available from institution
 *   allocatedExpenses={25000} // Already allocated to sub-programs
 *   allocatedReserved={5000} // Reserved for specific activities
 * />
 */

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Loader2, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight, 
  Save,
  Calendar,
  Calculator,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Edit,
  X,
  User,
  Copy,
  Check,
  ChevronDown,
  Lock,
  Unlock
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

export interface AnnualBudgetData {
  id?: string
  year: number
  planned_budget: number
  total_expenses: number
  balance: number
  allocated_amount?: number // Mapped from reserved field
  notes?: string | null
  approved_by?: string | null
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
  is_locked?: boolean
}

export interface AnnualBudgetFormData {
  year: string
  planned_budget: string
  total_expenses: string
  reserved: string // Maps to allocated_amount
  notes: string
  approved_by?: string
}

export interface AnnualBudgetViewEditModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  budget: AnnualBudgetData | null
  entityName?: string
  entityType?: string
  onSave?: (budget: AnnualBudgetData) => void
  readonly?: boolean
  isLocked?: boolean
  defaultYear?: number // Year to pre-populate when creating new budget
  availableBudget?: number // Available budget from institution (real API data)
  allocatedExpenses?: number // Minimum total expenses already allocated to departments
  allocatedReserved?: number // Minimum reserved amount already allocated
}

export function AnnualBudgetViewEditModal({
  isOpen,
  onOpenChange,
  budget,
  entityName,
  entityType = "Institution",
  onSave,
  readonly = false,
  isLocked = false,
  defaultYear,
  availableBudget,
  allocatedExpenses = 0,
  allocatedReserved = 0
}: AnnualBudgetViewEditModalProps) {
  const { t } = useTranslation()
  const { formatCurrency, selectedCurrency } = useCurrency()
  
  // Calculate actual minimum values - use budget data when props are zero
  const actualAllocatedExpenses = allocatedExpenses > 0 ? allocatedExpenses : (budget?.total_expenses || 0)
  const actualAllocatedReserved = allocatedReserved > 0 ? allocatedReserved : (budget?.allocated_amount || 0)
  

  
  // Ensure selectedCurrency is available as fallback
  const currentCurrency = selectedCurrency || { symbol: '€', code: 'EUR', name: 'Euro' }
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isEditingYear, setIsEditingYear] = useState(false)
  const [formData, setFormData] = useState<AnnualBudgetFormData>({
    year: "",
    planned_budget: "",
    total_expenses: "",
    reserved: "",
    notes: "",
    approved_by: undefined
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    overview: false,
    financial: false,
    additional: false,
    system: false
  })

  const totalSteps = 3

  // Generate available years (current year + 10 years forward)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let i = 0; i <= 10; i++) {
      years.push(currentYear + i)
    }
    return years
  }

  const yearOptions = generateYearOptions()

  // Generate dynamic budget options based on available budget
  const generateBudgetOptions = () => {
    const maxBudget = availableBudget || 2500000 // Default max if no available budget
    const options: number[] = []
    
    // Generate up to 6 graduated options
    if (maxBudget <= 50000) {
      // Small budgets: 10K, 25K, 50K
      const increments = [10000, 25000, maxBudget]
      options.push(...increments.filter(val => val <= maxBudget))
    } else if (maxBudget <= 250000) {
      // Medium budgets: 25K, 50K, 100K, 150K, 200K, maxBudget
      const increments = [25000, 50000, 100000, 150000, 200000, maxBudget]
      options.push(...increments.filter(val => val <= maxBudget))
    } else if (maxBudget <= 1000000) {
      // Large budgets: 100K, 250K, 500K, 750K, maxBudget
      const increments = [100000, 250000, 500000, 750000, maxBudget]
      options.push(...increments.filter(val => val <= maxBudget))
    } else {
      // Very large budgets: 250K, 500K, 1M, 1.5M, 2M, maxBudget
      const increments = [250000, 500000, 1000000, 1500000, 2000000, maxBudget]
      options.push(...increments.filter(val => val <= maxBudget))
    }
    
    // Remove duplicates and sort
    const uniqueOptions = [...new Set(options)].sort((a, b) => a - b)
    
    // Limit to 6 options maximum
    return uniqueOptions.slice(0, 6)
  }

  const budgetOptions = generateBudgetOptions()

  // Calculate balance automatically: planned_budget - (total_expenses + allocated_amount)
  const calculateBalance = (plannedBudget: string | number, totalExpenses: string | number, allocatedAmount: string | number = 0) => {
    const planned = typeof plannedBudget === 'string' ? parseFloat(plannedBudget) || 0 : plannedBudget
    const expenses = typeof totalExpenses === 'string' ? parseFloat(totalExpenses) || 0 : totalExpenses
    const allocated = typeof allocatedAmount === 'string' ? parseFloat(allocatedAmount) || 0 : allocatedAmount
    return planned - (expenses + allocated)
  }

  useEffect(() => {
    if (budget) {
      setFormData({
        year: budget.year.toString(),
        planned_budget: budget.planned_budget.toString(),
        total_expenses: budget.total_expenses.toString(),
        reserved: (budget.allocated_amount || 0).toString(),
        notes: budget.notes || "",
        approved_by: budget.approved_by || undefined
      })
    } else if (defaultYear) {
      // If no budget but defaultYear is provided, use it
      setFormData({
        year: defaultYear.toString(),
        planned_budget: "",
        total_expenses: "0",
        reserved: "0",
        notes: "",
        approved_by: undefined
      })
    }
  }, [budget, defaultYear])

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setIsEditingYear(false)
      // If it's a new budget (no budget at all or no planned_budget set), open in edit mode
      const isNewBudget = !budget || !budget.planned_budget || budget.planned_budget === 0
      setIsEditing(isNewBudget)
      setErrors({})
    }
  }, [isOpen, budget])

  const handleInputChange = (field: keyof AnnualBudgetFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    const currentYear = new Date().getFullYear()

    // DEBUG: Log validation step with corrected minimum values
    console.log('🔍 Validating Step', step, {
      formData: {
        total_expenses: formData.total_expenses,
        reserved: formData.reserved
      },
      originalProps: { allocatedExpenses, allocatedReserved },
      correctedLimits: {
        actualAllocatedExpenses,
        actualAllocatedReserved
      },
      parsedValues: {
        totalExpensesParsed: parseFloat(formData.total_expenses) || 0,
        reservedParsed: parseFloat(formData.reserved) || 0
      }
    })

    if (step === 1) {
      // Year validation
      if (!formData.year?.trim()) {
        newErrors.year = t("annual_budget.modals.validation.year_required")
      } else {
        const year = parseInt(formData.year)
        if (isNaN(year)) {
          newErrors.year = t("annual_budget.modals.validation.year_invalid")
        } else if (year < 2000) {
          newErrors.year = t("annual_budget.modals.validation.year_min")
        } else if (year > currentYear + 10) {
          newErrors.year = t("annual_budget.modals.validation.year_max")
        }
      }

      // Planned budget validation
      if (!formData.planned_budget?.trim()) {
        newErrors.planned_budget = t("annual_budget.modals.validation.planned_budget_required")
      } else {
        const budgetAmount = parseFloat(formData.planned_budget)
        if (isNaN(budgetAmount)) {
          newErrors.planned_budget = t("annual_budget.modals.validation.planned_budget_invalid")
        } else if (budgetAmount <= 0) {
          newErrors.planned_budget = t("annual_budget.modals.validation.planned_budget_min")
        } else if (entityType?.toLowerCase() !== 'institution' && availableBudget !== undefined && budgetAmount > availableBudget) {
          newErrors.planned_budget = t("annual_budget.modals.validation.exceeds_available_budget", 
            { available: formatCurrency(availableBudget) }) || `Exceeds available budget: ${formatCurrency(availableBudget)}`
        }
      }


    }

    if (step === 2) {
      // Total expenses validation with corrected minimum values
      if (formData.total_expenses?.trim()) {
        const expenses = parseFloat(formData.total_expenses)
        console.log('🔍 Total Expenses Validation:', {
          inputValue: formData.total_expenses,
          parsedExpenses: expenses,
          originalAllocatedExpenses: allocatedExpenses,
          actualAllocatedExpenses,
          isValid: expenses >= actualAllocatedExpenses,
          difference: expenses - actualAllocatedExpenses
        })
        if (isNaN(expenses)) {
          newErrors.total_expenses = t("annual_budget.modals.validation.total_expenses_invalid")
        } else if (expenses < 0) {
          newErrors.total_expenses = t("annual_budget.modals.validation.total_expenses_negative")
        } else if (expenses < actualAllocatedExpenses) {
          newErrors.total_expenses = t("budget.validation.total_expenses_below_allocated", 
            { allocated: formatCurrency(actualAllocatedExpenses) }) || `Cannot be less than allocated amount: ${formatCurrency(actualAllocatedExpenses)}`
        }
      } else {
        // If total_expenses is empty but there are allocated expenses, require minimum value
        if (actualAllocatedExpenses > 0) {
          console.log('🔍 Total Expenses Required (Empty Field):', {
            actualAllocatedExpenses,
            formDataEmpty: !formData.total_expenses?.trim()
          })
          newErrors.total_expenses = t("budget.validation.total_expenses_required_allocated", 
            { allocated: formatCurrency(actualAllocatedExpenses) }) || `Minimum required: ${formatCurrency(actualAllocatedExpenses)}`
        }
      }

      // Reserved amount validation with corrected minimum values
      if (formData.reserved?.trim()) {
        const reserved = parseFloat(formData.reserved)
        console.log('🔍 Reserved Amount Validation:', {
          inputValue: formData.reserved,
          parsedReserved: reserved,
          originalAllocatedReserved: allocatedReserved,
          actualAllocatedReserved,
          isValid: reserved >= actualAllocatedReserved,
          difference: reserved - actualAllocatedReserved
        })
        if (isNaN(reserved)) {
          newErrors.reserved = t("annual_budget.modals.validation.reserved_invalid")
        } else if (reserved < 0) {
          newErrors.reserved = t("annual_budget.modals.validation.reserved_negative")
        } else if (reserved < actualAllocatedReserved) {
          newErrors.reserved = t("budget.validation.reserved_below_allocated", 
            { allocated: formatCurrency(actualAllocatedReserved) }) || `Cannot be less than allocated amount: ${formatCurrency(actualAllocatedReserved)}`
        }
      } else {
        // If reserved is empty but there are allocated reserved amounts, require minimum value
        if (actualAllocatedReserved > 0) {
          console.log('🔍 Reserved Amount Required (Empty Field):', {
            actualAllocatedReserved,
            formDataEmpty: !formData.reserved?.trim()
          })
          newErrors.reserved = t("budget.validation.reserved_required_allocated", 
            { allocated: formatCurrency(actualAllocatedReserved) }) || `Minimum required: ${formatCurrency(actualAllocatedReserved)}`
        }
      }
    }

    setErrors(newErrors)
    
    // DEBUG: Log validation results
    console.log('🔍 Validation Results for Step', step, {
      errorsFound: Object.keys(newErrors),
      errorMessages: newErrors,
      isValid: Object.keys(newErrors).length === 0
    })
    
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSave = async () => {
    // Allow saving even when budget is null (for creation)
    // if (!budget) return

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(t("annual_budget.modals.validation.fix_errors"))
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t("annual_budget.modals.messages.updating"))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const budgetData: AnnualBudgetData = budget ? {
        // Update existing budget
        ...budget,
        year: parseInt(formData.year),
        planned_budget: parseFloat(formData.planned_budget),
        total_expenses: parseFloat(formData.total_expenses) || 0,
        allocated_amount: parseFloat(formData.reserved) || 0, // Map reserved to allocated_amount
        balance: calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved),
        notes: formData.notes || null,
        approved_by: formData.approved_by || null,
        updated_at: new Date().toISOString()
      } : {
        // Create new budget - DO NOT include id, let backend generate it
        year: parseInt(formData.year),
        planned_budget: parseFloat(formData.planned_budget),
        total_expenses: parseFloat(formData.total_expenses) || 0,
        allocated_amount: parseFloat(formData.reserved) || 0, // Map reserved to allocated_amount
        balance: calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved),
        notes: formData.notes || null,
        approved_by: formData.approved_by || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_locked: false
      }

      toast.dismiss(loadingToast)
      toast.success(t("annual_budget.modals.messages.updated"), {
        duration: 3000

      })

      if (onSave) {
        onSave(budgetData)
      }

      setIsEditing(false)
      
      // Close modal after successful save
      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t("annual_budget.modals.messages.update_failed"))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (budget) {
      setFormData({
        year: budget.year.toString(),
        planned_budget: budget.planned_budget.toString(),
        total_expenses: budget.total_expenses.toString(),
        reserved: (budget.allocated_amount || 0).toString(),
        notes: budget.notes || "",
        approved_by: budget.approved_by || undefined
      })
    }
    setErrors({})
    setIsEditing(false)
    setCurrentStep(1)
  }

  const handleClose = () => {
    if (!isLoading) {
      handleCancel()
      setCurrentStep(1)
      setIsEditingYear(false)
      setErrors({})
      onOpenChange(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success("Copied to clipboard!", {
        duration: 2000,
        icon: '📋'
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const renderCopyableField = (value: string | number | null | undefined, fieldKey: string, placeholder?: string, formatter?: (val: any) => string) => {
    if (isEditing) return null
    
    const displayValue = formatter && value !== null && value !== undefined 
      ? formatter(value) 
      : (value?.toString() || placeholder || 'Not provided')
    
    return (
      <div className="group relative py-2 text-sm flex items-center justify-between min-h-[32px]">
        <span className={value !== null && value !== undefined ? "text-foreground" : "text-muted-foreground italic"}>
          {displayValue}
        </span>
        {value !== null && value !== undefined && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(displayValue, fieldKey)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-muted"
            title="Copy to clipboard"
          >
            {copiedField === fieldKey ? (
              <Check className="w-3 h-3 text-foreground" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    )
  }

  const renderCollapsibleSection = (
    sectionKey: string,
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode
  ) => {
    const isCollapsed = collapsedSections[sectionKey]
    
    return (
      <div className="space-y-4 pb-6 border-b border-border">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full group hover:bg-muted rounded-md p-2 -m-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-medium text-foreground">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : ''
            }`}
          />
        </button>
        
        {!isCollapsed && (
          <div className="animate-in fade-in-0 duration-200 slide-in-from-top-1">
            {content}
          </div>
        )}
      </div>
    )
  }



  const renderViewMode = () => {
    if (!budget) return null

    return (
      <div className="space-y-8">
        {/* Overview Section */}
        {renderCollapsibleSection(
          'overview',
          <DollarSign className="w-4 h-4 text-muted-foreground" />,
          t("annual_budget.modals.steps.basic_information"),
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("annual_budget.modals.fields.year")}
              </Label>
              {renderCopyableField(budget.year, 'year')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("annual_budget.modals.fields.planned_budget")}
              </Label>
              {renderCopyableField(budget.planned_budget, 'planned_budget', undefined, formatCurrency)}
            </div>
            

          </div>
        )}

        {/* Financial Details Section */}
        {renderCollapsibleSection(
          'financial',
          <Calculator className="w-4 h-4 text-muted-foreground" />,
          t("annual_budget.modals.steps.financial_details"),
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("annual_budget.modals.fields.total_expenses")}
              </Label>
              {renderCopyableField(budget.total_expenses, 'total_expenses', undefined, formatCurrency)}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("annual_budget.modals.fields.balance")}
              </Label>
              <div className="flex items-center justify-between group py-2">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${budget.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(budget.balance)}
                  </span>
                  <Badge 
                    variant={budget.balance >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {budget.balance >= 0 ? (t("annual_budget.modals.status.positive") || "Positive") : (t("annual_budget.modals.status.deficit") || "Deficit")}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(formatCurrency(budget.balance), 'balance')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-muted"
                >
                  {copiedField === 'balance' ? (
                    <Check className="w-3 h-3 text-foreground" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-muted rounded-lg p-4 space-y-3 border border-border">
              <h4 className="text-sm font-medium text-foreground">{t("annual_budget.modals.summary.title") || "Budget Summary"}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("annual_budget.modals.summary.spent") || "Spent"}:</span>
                  <span className="font-medium text-foreground">{formatCurrency(budget.total_expenses)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("annual_budget.modals.summary.reserved") || "Reserved"}:</span>
                  <div className="text-right">
                    <span className="font-medium text-foreground">{formatCurrency(budget.allocated_amount || 0)}</span>
                    {budget.total_expenses > 0 && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        + {formatCurrency(budget.total_expenses)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">{t("annual_budget.modals.summary.available") || "Available"}:</span>
                  <span className={`font-semibold ${budget.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(budget.balance)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Information Section */}
        {renderCollapsibleSection(
          'additional',
          <FileText className="w-4 h-4 text-muted-foreground" />,
          t("annual_budget.modals.steps.additional_info"),
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("annual_budget.modals.fields.notes")}
              </Label>
              <div className="flex items-start justify-between group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground whitespace-pre-wrap break-words py-2">
                    {budget.notes || <span className="text-muted-foreground italic">{t("annual_budget.modals.fields.no_notes") || "No notes provided"}</span>}
                  </p>
                </div>
                {budget.notes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto ml-2"
                    onClick={() => copyToClipboard(budget.notes!, 'notes')}
                  >
                    {copiedField === 'notes' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-muted-foreground" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {budget.approved_by && (
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("annual_budget.modals.fields.approved_by")}
                </Label>
                {renderCopyableField(budget.approved_by, 'approved_by')}
              </div>
            )}
          </div>
        )}

        {/* System Information Section */}
        {renderCollapsibleSection(
          'system',
          <Calendar className="w-4 h-4 text-muted-foreground" />,
          t("annual_budget.modals.system_info.title") || "System Information",
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("annual_budget.modals.system_info.created_at") || "Created At"}
                </Label>
                <p className="text-sm text-foreground mt-1">
                  {budget.created_at ? formatDate(budget.created_at) : '-'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t("annual_budget.modals.system_info.updated_at") || "Updated At"}
                </Label>
                <p className="text-sm text-foreground mt-1">
                  {budget.updated_at ? formatDate(budget.updated_at) : '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-border">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">{t("annual_budget.modals.steps.basic_information")}</h3>
              <p className="text-sm text-muted-foreground">{t("annual_budget.modals.steps.basic_information_desc")}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  {t("annual_budget.modals.fields.year")} *
                </Label>
                
                {!isEditingYear ? (
                  // Year as Tag with Edit Button
                  <div className="flex items-center justify-between h-12 px-4 py-2 border border-border rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-base font-medium px-3 py-1 bg-background">
                        {formData.year || t("annual_budget.modals.fields.year_placeholder") || "Select Year"}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingYear(true)}
                      disabled={isLoading}
                      className="h-8 px-3 text-xs hover:bg-muted"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      {t("annual_budget.modals.buttons.edit") || "Edit"}
                    </Button>
                  </div>
                ) : (
                  // Year Dropdown (Edit Mode)
                  <div className="relative">
                    <select
                      value={formData.year}
                      onChange={(e) => {
                        handleInputChange('year', e.target.value)
                        setIsEditingYear(false)
                      }}
                      disabled={isLoading}
                      autoFocus
                      onBlur={() => setIsEditingYear(false)}
                      className={`w-full h-12 px-3 py-3 text-base border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-input transition-colors bg-background appearance-none ${errors.year ? 'border-red-500' : ''}`}
                    >
                      <option value="">{t("annual_budget.modals.fields.year_placeholder") || "Select Year"}</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                )}
                
                {errors.year && (
                  <p className="text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="planned_budget" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  {t("annual_budget.modals.fields.planned_budget")} *
                </Label>
                
                {/* Dynamic Quick Amount Selection - Currency Aware */}
                <div className="overflow-x-auto scrollbar-thin pb-2 mb-3">
                  <div className="flex gap-2 min-w-max">
                    {budgetOptions.map((amount) => {
                      const isDisabled = isLoading
                      const isSelected = parseInt(formData.planned_budget) === amount
                      
                      // Format display value with proper currency context
                      const getDisplayValue = (value: number) => {
                        if (value >= 1000000) {
                          return (value / 1000000).toFixed(1) + 'M'
                        } else if (value >= 1000) {
                          return (value / 1000).toFixed(0) + 'K'
                        }
                        return value.toString()
                      }
                      
                      return (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleInputChange('planned_budget', amount.toString())}
                          disabled={isDisabled}
                          className={cn(
                            "h-8 text-xs font-medium transition-all hover:bg-primary hover:text-primary-foreground border-2 flex-shrink-0 min-w-[60px]",
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-md" 
                              : "border-border text-foreground hover:border-primary/50"
                          )}
                          title={formatCurrency(amount)} // Show full formatted amount on hover
                        >
                          <span className="flex items-center gap-1">
                            <span className="text-[10px] opacity-70">{currentCurrency.symbol}</span>
                            <span>{getDisplayValue(amount)}</span>
                          </span>
                        </Button>
                      )
                    })}
                  </div>
                </div>
                
                <div className="relative">
                  <Input
                    id="planned_budget"
                    type="number"
                    step="1" // Use step=1 for integers as requested
                    min="0"
                    value={formData.planned_budget}
                    onChange={(e) => handleInputChange('planned_budget', e.target.value)}
                    placeholder={`${t("annual_budget.modals.fields.planned_budget_placeholder")} (${currentCurrency.symbol})`}
                    disabled={isLoading}
                    className={`h-12 text-base pl-8 border-border focus:border-input focus:ring-ring ${errors.planned_budget ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                    {currentCurrency.symbol}
                  </div>
                </div>
                {errors.planned_budget && (
                  <p className="text-sm text-red-600">{errors.planned_budget}</p>
                )}
                {entityType?.toLowerCase() !== 'institution' && availableBudget !== undefined && (
                   <p className="text-xs text-muted-foreground mt-1">
                    {t('annual_budget.modals.fields.available_budget_hint', 'Available budget')}: {formatCurrency(availableBudget)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-border">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Calculator className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">{t("annual_budget.modals.steps.financial_details")}</h3>
              <p className="text-sm text-muted-foreground">{t("annual_budget.modals.steps.financial_details_desc")}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="total_expenses" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calculator className="w-4 h-4 text-muted-foreground" />
                  {t("annual_budget.modals.fields.total_expenses")}
                </Label>
                <div className="relative">
                  <Input
                    id="total_expenses"
                    type="number"
                    step="1"
                    min={actualAllocatedExpenses.toString()}
                    value={formData.total_expenses}
                    onChange={(e) => handleInputChange('total_expenses', e.target.value)}
                    placeholder={`${t("annual_budget.modals.fields.total_expenses_placeholder")} (${currentCurrency.symbol})`}
                    disabled={isLoading}
                    className={`h-12 text-base pl-8 border-border focus:border-input focus:ring-ring ${errors.total_expenses ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                    {currentCurrency.symbol}
                  </div>
                </div>
                {actualAllocatedExpenses > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-muted-foreground">
                        {t("budget.fields.already_spent", "Already spent amount")}: 
                        <span className="font-medium text-foreground ml-1">{formatCurrency(actualAllocatedExpenses)}</span>
                      </span>
                    </div>
                  </div>
                )}
                {errors.total_expenses && (
                  <p className="text-sm text-red-600">{errors.total_expenses}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserved" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  {t("annual_budget.modals.fields.reserved") || "Reserved"}
                </Label>
                <div className="relative">
                  <Input
                    id="reserved"
                    type="number"
                    step="1"
                    min={actualAllocatedReserved.toString()}
                    value={formData.reserved}
                    onChange={(e) => handleInputChange('reserved', e.target.value)}
                    placeholder={`${t("annual_budget.modals.fields.reserved_placeholder") || "0"} (${currentCurrency.symbol})`}
                    disabled={isLoading}
                    className={`h-12 text-base pl-8 border-border focus:border-input focus:ring-ring ${errors.reserved ? 'border-red-500' : ''}`}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
                    {currentCurrency.symbol}
                  </div>
                </div>
                {actualAllocatedReserved > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-muted-foreground">
                        {t("budget.fields.already_allocated", "Already allocated to departments")}: 
                        <span className="font-medium text-foreground ml-1">{formatCurrency(actualAllocatedReserved)}</span>
                      </span>
                    </div>
                  </div>
                )}
                {errors.reserved && (
                  <p className="text-sm text-red-600">{errors.reserved}</p>
                )}
              </div>

              {/* Balance Display */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  {t("annual_budget.modals.fields.balance")}
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatCurrency(calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved))}
                    disabled={true}
                    className="h-12 text-base border-border bg-muted text-foreground"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Badge
                      variant={calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved) >= 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved) >= 0 ? (t("annual_budget.modals.status.positive") || "Positive") : (t("annual_budget.modals.status.deficit") || "Deficit")}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{t("annual_budget.modals.fields.balance_help")}</p>
              </div>

              {/* Budget Calculation Preview - Currency Context Enhanced */}
              <div className="bg-muted rounded-lg p-4 space-y-3 border border-border">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-foreground">Budget Preview</h4>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {currentCurrency.code}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Planned:
                    </span>
                    <span className="font-medium text-foreground">
                      {formData.planned_budget ? formatCurrency(parseFloat(formData.planned_budget)) : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calculator className="w-3 h-3" />
                      Expenses + Reserved:
                    </span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(
                        (parseFloat(formData.total_expenses) || 0) + 
                        (parseFloat(formData.reserved) || 0)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-2">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <Calculator className="w-3 h-3" />
                      Balance:
                    </span>
                    <span className={`font-semibold text-base ${
                      calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(
                        calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved)
                      )}
                    </span>
                  </div>
                  {availableBudget !== undefined && entityType?.toLowerCase() !== 'institution' && (
                    <div className="flex justify-between items-center pt-1 border-t border-border">
                      <span className="text-xs text-muted-foreground">Available Budget:</span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {formatCurrency(availableBudget)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-border">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">{t("annual_budget.modals.steps.additional_info")}</h3>
              <p className="text-sm text-muted-foreground">{t("annual_budget.modals.steps.additional_info_desc")}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {t("annual_budget.modals.fields.notes")}
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={t("annual_budget.modals.fields.notes_placeholder")}
                  disabled={isLoading}
                  rows={4}
                  className="text-base border-border focus:border-input focus:ring-ring"
                />
              </div>

              {/* Final Summary Preview - Enhanced with Currency Context */}
              <div className="bg-gradient-to-r from-muted to-muted/50 rounded-lg p-4 space-y-3 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-foreground">Final Budget Summary</h4>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {currentCurrency.name} ({currentCurrency.code})
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Year:
                    </span>
                    <span className="font-medium text-foreground">{formData.year || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Planned Budget:
                    </span>
                    <span className="font-medium text-foreground">
                      {formData.planned_budget ? formatCurrency(parseFloat(formData.planned_budget)) : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calculator className="w-3 h-3" />
                      Total Expenses:
                    </span>
                    <div className="text-right">
                      <span className="font-medium text-foreground block">
                        {formData.total_expenses ? formatCurrency(parseFloat(formData.total_expenses)) : formatCurrency(0)}
                      </span>
                      {/* {actualAllocatedExpenses > 0 && (
                        <span className="text-xs text-amber-600">
                          Min: {formatCurrency(actualAllocatedExpenses)}
                        </span>
                      )} */}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calculator className="w-3 h-3" />
                      Reserved Amount:
                    </span>
                    <div className="text-right">
                      <span className="font-medium text-foreground block">
                        {formData.reserved ? formatCurrency(parseFloat(formData.reserved)) : formatCurrency(0)}
                      </span>
                      {/* {actualAllocatedReserved > 0 && (
                        <span className="text-xs text-amber-600">
                          Min: {formatCurrency(actualAllocatedReserved)}
                        </span>
                      )} */}
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-border pt-2">
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <Calculator className="w-3 h-3" />
                      Final Balance:
                    </span>
                    <span className={`font-semibold text-base ${
                      calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved) >= 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {formatCurrency(
                        calculateBalance(formData.planned_budget, formData.total_expenses, formData.reserved)
                      )}
                    </span>
                  </div>
                  {/* {(actualAllocatedExpenses > 0 || actualAllocatedReserved > 0) && (
                    <div className="flex justify-between items-center pt-1 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        Protected Allocations:
                      </span>
                      <span className="text-xs font-medium text-amber-600">
                        {formatCurrency(actualAllocatedExpenses + actualAllocatedReserved)}
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // Allow modal to render even when budget is null (for creation)
  // if (!budget) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg text-foreground">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            {t("annual_budget.modals.edit.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {entityName ? (
              budget ? `${entityType}: ${entityName} - ${budget.year}` : `${entityType}: ${entityName} - New Budget`
            ) : (
              t("annual_budget.modals.edit.description")
            )}
          </DialogDescription>
          
          {/* Budget Status and Edit Button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {t("annual_budget.modals.fields.year") || "Year"} {budget ? budget.year : formData.year || 'New'}
              </Badge>
              {budget?.is_deleted && (
                <Badge variant="destructive">{t("annual_budget.modals.status.deleted") || "Deleted"}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Lock/Unlock Icon */}
              {!readonly && !isEditing && (
                <div className="relative group">
                  <div className={`w-8 h-8 border-2 border-dashed rounded-full flex items-center justify-center ${
                    isLocked 
                      ? 'border-foreground bg-foreground' 
                      : 'border-muted-foreground bg-muted opacity-60'
                  }`}>
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-background" />
                    ) : (
                      <Unlock className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-border">
                    {isLocked ? (t("annual_budget.modals.lock_tooltip.locked") || 'Unlock first to be able to edit') : (t("annual_budget.modals.lock_tooltip.unlocked") || 'Unlocked - Can be edited')}
                  </div>
                </div>
              )}
              
              {/* Edit Button */}
              {!readonly && !isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)} 
                  disabled={isLocked}
                  className={isLocked ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t("annual_budget.modals.buttons.edit")}
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar - Only show when editing */}
          {isEditing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
            </div>
          )}
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {isEditing ? renderStepContent() : renderViewMode()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 border-t border-border pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {isEditing && currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {t("annual_budget.modals.buttons.previous")}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={isEditing ? handleCancel : handleClose}
                disabled={isLoading}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                {isEditing ? (t("annual_budget.modals.buttons.cancel")) : (t("annual_budget.modals.buttons.close"))}
              </Button>
            </div>

            <div className="flex gap-2">
              {isEditing && currentStep < totalSteps && (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  variant="default"
                  className="flex items-center gap-1 text-xs"
                >
                  {t("annual_budget.modals.buttons.next")}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
              {isEditing && currentStep === totalSteps && (
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  variant="default"
                  className="min-w-[100px] text-xs"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {isLoading ? (t("annual_budget.modals.messages.saving")) : (t("annual_budget.modals.buttons.save"))}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}