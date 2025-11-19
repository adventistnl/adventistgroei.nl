"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
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
  defaultYear
}: AnnualBudgetViewEditModalProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isEditingYear, setIsEditingYear] = useState(false)
  const [formData, setFormData] = useState<AnnualBudgetFormData>({
    year: "",
    planned_budget: "",
    total_expenses: "",
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

  // Calculate balance automatically
  const calculateBalance = (plannedBudget: string | number, totalExpenses: string | number) => {
    const planned = typeof plannedBudget === 'string' ? parseFloat(plannedBudget) || 0 : plannedBudget
    const expenses = typeof totalExpenses === 'string' ? parseFloat(totalExpenses) || 0 : totalExpenses
    return planned - expenses
  }

  useEffect(() => {
    if (budget) {
      setFormData({
        year: budget.year.toString(),
        planned_budget: budget.planned_budget.toString(),
        total_expenses: budget.total_expenses.toString(),
        notes: budget.notes || "",
        approved_by: budget.approved_by || undefined
      })
    } else if (defaultYear) {
      // If no budget but defaultYear is provided, use it
      setFormData({
        year: defaultYear.toString(),
        planned_budget: "",
        total_expenses: "0",
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
        }
      }


    }

    if (step === 2) {
      // Total expenses validation
      if (formData.total_expenses?.trim()) {
        const expenses = parseFloat(formData.total_expenses)
        if (isNaN(expenses)) {
          newErrors.total_expenses = t("annual_budget.modals.validation.total_expenses_invalid")
        } else if (expenses < 0) {
          newErrors.total_expenses = t("annual_budget.modals.validation.total_expenses_negative")
        }
      }
    }

    setErrors(newErrors)
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

      const updatedBudget: AnnualBudgetData = {
        ...budget,
        year: parseInt(formData.year),
        planned_budget: parseFloat(formData.planned_budget),
        total_expenses: parseFloat(formData.total_expenses) || 0,
        balance: calculateBalance(formData.planned_budget, formData.total_expenses),
        notes: formData.notes || null,
        approved_by: formData.approved_by || null,
        updated_at: new Date().toISOString()
      }

      toast.dismiss(loadingToast)
      toast.success(t("annual_budget.modals.messages.updated"), {
        duration: 3000,
        icon: '✅'
      })

      if (onSave) {
        onSave(updatedBudget)
      }

      setIsEditing(false)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
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
        <span className={value !== null && value !== undefined ? "text-gray-900" : "text-gray-400 italic"}>
          {displayValue}
        </span>
        {value !== null && value !== undefined && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(displayValue, fieldKey)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-gray-100"
            title="Copy to clipboard"
          >
            {copiedField === fieldKey ? (
              <Check className="w-3 h-3 text-gray-600" />
            ) : (
              <Copy className="w-3 h-3 text-gray-500" />
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
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full group hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
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
          <DollarSign className="w-4 h-4 text-gray-500" />,
          t("annual_budget.modals.steps.basic_information"),
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t("annual_budget.modals.fields.year")}
              </Label>
              {renderCopyableField(budget.year, 'year')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t("annual_budget.modals.fields.planned_budget")}
              </Label>
              {renderCopyableField(budget.planned_budget, 'planned_budget', undefined, formatCurrency)}
            </div>
            

          </div>
        )}

        {/* Financial Details Section */}
        {renderCollapsibleSection(
          'financial',
          <Calculator className="w-4 h-4 text-gray-500" />,
          t("annual_budget.modals.steps.financial_details"),
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t("annual_budget.modals.fields.total_expenses")}
              </Label>
              {renderCopyableField(budget.total_expenses, 'total_expenses', undefined, formatCurrency)}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
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
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-gray-100"
                >
                  {copiedField === 'balance' ? (
                    <Check className="w-3 h-3 text-gray-600" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900">{t("annual_budget.modals.summary.title") || "Budget Summary"}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("annual_budget.modals.summary.planned") || "Planned"}:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(budget.planned_budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("annual_budget.modals.summary.expenses") || "Expenses"}:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(budget.total_expenses)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-600">{t("annual_budget.modals.summary.balance") || "Balance"}:</span>
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
          <FileText className="w-4 h-4 text-gray-500" />,
          t("annual_budget.modals.steps.additional_info"),
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t("annual_budget.modals.fields.notes")}
              </Label>
              <div className="flex items-start justify-between group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words py-2">
                    {budget.notes || <span className="text-gray-500 italic">{t("annual_budget.modals.fields.no_notes") || "No notes provided"}</span>}
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
                      <Copy className="w-3 h-3 text-gray-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {budget.approved_by && (
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
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
          <Calendar className="w-4 h-4 text-gray-500" />,
          t("annual_budget.modals.system_info.title") || "System Information",
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t("annual_budget.modals.system_info.created_at") || "Created At"}
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {budget.created_at ? formatDate(budget.created_at) : '-'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t("annual_budget.modals.system_info.updated_at") || "Updated At"}
                </Label>
                <p className="text-sm text-gray-900 mt-1">
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
            <div className="text-center space-y-2 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t("annual_budget.modals.steps.basic_information")}</h3>
              <p className="text-sm text-gray-600">{t("annual_budget.modals.steps.basic_information_desc")}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {t("annual_budget.modals.fields.year")} *
                </Label>
                
                {!isEditingYear ? (
                  // Year as Tag with Edit Button
                  <div className="flex items-center justify-between h-12 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-base font-medium px-3 py-1 bg-white">
                        {formData.year || t("annual_budget.modals.fields.year_placeholder") || "Select Year"}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingYear(true)}
                      disabled={isLoading}
                      className="h-8 px-3 text-xs hover:bg-gray-200"
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
                      className={`w-full h-12 px-3 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-colors bg-white appearance-none ${errors.year ? 'border-red-500' : ''}`}
                    >
                      <option value="">{t("annual_budget.modals.fields.year_placeholder") || "Select Year"}</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                )}
                
                {errors.year && (
                  <p className="text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="planned_budget" className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  {t("annual_budget.modals.fields.planned_budget")} *
                </Label>
                
                {/* Quick Amount Selection Tags - Horizontal Scroll */}
                <div className="overflow-x-auto scrollbar-thin pb-2 mb-3">
                  <div className="flex gap-2 min-w-max">
                    {[100000, 250000, 500000, 750000, 1000000, 1500000, 2000000, 2500000].map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('planned_budget', amount.toString())}
                        disabled={isLoading}
                        className={cn(
                          "h-8 text-xs font-medium transition-all hover:bg-primary hover:text-primary-foreground border-2 flex-shrink-0",
                          formData.planned_budget === amount.toString() 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "border-gray-300 text-gray-700"
                        )}
                      >
                        ${(amount / 1000)}K
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Input
                  id="planned_budget"
                  type="number"
                  step="0.01"
                  value={formData.planned_budget}
                  onChange={(e) => handleInputChange('planned_budget', e.target.value)}
                  placeholder={t("annual_budget.modals.fields.planned_budget_placeholder")}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.planned_budget ? 'border-red-500' : ''}`}
                />
                {errors.planned_budget && (
                  <p className="text-sm text-red-600">{errors.planned_budget}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t("annual_budget.modals.steps.financial_details")}</h3>
              <p className="text-sm text-gray-600">{t("annual_budget.modals.steps.financial_details_desc")}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="total_expenses" className="flex items-center gap-2 text-sm text-gray-600">
                  <Calculator className="w-4 h-4 text-gray-500" />
                  {t("annual_budget.modals.fields.total_expenses")}
                </Label>
                <Input
                  id="total_expenses"
                  type="number"
                  step="0.01"
                  value={formData.total_expenses}
                  onChange={(e) => handleInputChange('total_expenses', e.target.value)}
                  placeholder={t("annual_budget.modals.fields.total_expenses_placeholder")}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.total_expenses ? 'border-red-500' : ''}`}
                />
                {errors.total_expenses && (
                  <p className="text-sm text-red-600">{errors.total_expenses}</p>
                )}
              </div>

              {/* Balance Display */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  {t("annual_budget.modals.fields.balance")}
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={formatCurrency(calculateBalance(formData.planned_budget, formData.total_expenses))}
                    disabled={true}
                    className="h-12 text-base border-gray-300 bg-gray-50 text-gray-700"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Badge 
                      variant={calculateBalance(formData.planned_budget, formData.total_expenses) >= 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {calculateBalance(formData.planned_budget, formData.total_expenses) >= 0 ? (t("annual_budget.modals.status.positive") || "Positive") : (t("annual_budget.modals.status.deficit") || "Deficit")}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{t("annual_budget.modals.fields.balance_help")}</p>
              </div>

              {/* Budget Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">{t("annual_budget.modals.summary.title") || "Budget Summary"}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("annual_budget.modals.fields.planned_budget") || "Planned Budget"}:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(formData.planned_budget || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("annual_budget.modals.fields.total_expenses") || "Total Expenses"}:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(formData.total_expenses || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">{t("annual_budget.modals.fields.balance") || "Balance"}:</span>
                    <span className={`font-semibold ${calculateBalance(formData.planned_budget, formData.total_expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calculateBalance(formData.planned_budget, formData.total_expenses))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t("annual_budget.modals.steps.additional_info")}</h3>
              <p className="text-sm text-gray-600">{t("annual_budget.modals.steps.additional_info_desc")}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4 text-gray-500" />
                  {t("annual_budget.modals.fields.notes")}
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={t("annual_budget.modals.fields.notes_placeholder")}
                  disabled={isLoading}
                  rows={4}
                  className="text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              {/* Review Section */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  {t("annual_budget.modals.review.title") || "Review & Confirm"}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("annual_budget.modals.fields.year") || "Year"}:</span>
                    <span className="font-medium text-gray-900">{formData.year}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("annual_budget.modals.fields.planned_budget") || "Planned Budget"}:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(formData.planned_budget || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t("annual_budget.modals.fields.balance") || "Balance"}:</span>
                    <span className={`font-semibold ${calculateBalance(formData.planned_budget, formData.total_expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calculateBalance(formData.planned_budget, formData.total_expenses))}
                    </span>
                  </div>
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
          <DialogTitle className="flex items-center gap-2 text-lg text-gray-900">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            {t("annual_budget.modals.edit.title")}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
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
                <Badge variant="destructive" className="bg-gray-800 text-white">{t("annual_budget.modals.status.deleted") || "Deleted"}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Lock/Unlock Icon */}
              {!readonly && !isEditing && (
                <div className="relative group">
                  <div className={`w-8 h-8 border-2 border-dashed rounded-full flex items-center justify-center ${
                    isLocked 
                      ? 'border-gray-900 bg-gray-900' 
                      : 'border-gray-400 bg-gray-50 opacity-60'
                  }`}>
                    {isLocked ? (
                      <Lock className="w-3 h-3 text-white" />
                    ) : (
                      <Unlock className="w-3 h-3 text-gray-600" />
                    )}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
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
                  className={`border-gray-300 ${isLocked ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
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
              <div className="flex justify-between items-center text-xs text-gray-600">
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
        <div className="flex-shrink-0 border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {isEditing && currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {t("annual_budget.modals.buttons.previous")}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={isEditing ? handleCancel : handleClose}
                disabled={isLoading}
                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
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
                  className="flex items-center gap-1 text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {t("annual_budget.modals.buttons.next")}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
              {isEditing && currentStep === totalSteps && (
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="min-w-[100px] text-xs bg-gray-900 hover:bg-gray-800 text-white"
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