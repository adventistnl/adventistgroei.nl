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
  ChevronDown
} from "lucide-react"
import toast from "react-hot-toast"
import { annualBudgetTranslations } from "@/lib/translations/annual-budget"

export interface AnnualBudgetData {
  id?: string
  year: number
  planned_budget: number
  total_expenses: number
  balance: number
  notes?: string | null
  approved_by?: string | null
  status: "planned" | "approved" | "in_progress" | "closed"
  created_at?: string
  updated_at?: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface AnnualBudgetFormData {
  year: string
  planned_budget: string
  total_expenses: string
  notes: string
  status: "planned" | "approved" | "in_progress" | "closed"
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
}

export function AnnualBudgetViewEditModal({
  isOpen,
  onOpenChange,
  budget,
  entityName,
  entityType = "Institution",
  onSave,
  readonly = false
}: AnnualBudgetViewEditModalProps) {
  const { i18n } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<AnnualBudgetFormData>({
    year: "",
    planned_budget: "",
    total_expenses: "",
    notes: "",
    status: "planned",
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

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t_budget = annualBudgetTranslations[currentLanguage as keyof typeof annualBudgetTranslations] || annualBudgetTranslations.en

  // Status options with icons and colors
  const statusOptions = [
    { 
      value: "planned", 
      label: t_budget.statusOptions.planned,
      icon: Calendar,
      color: "text-blue-600"
    },
    { 
      value: "approved", 
      label: t_budget.statusOptions.approved,
      icon: CheckCircle,
      color: "text-green-600"
    },
    { 
      value: "in_progress", 
      label: t_budget.statusOptions.in_progress,
      icon: TrendingUp,
      color: "text-orange-600"
    },
    { 
      value: "closed", 
      label: t_budget.statusOptions.closed,
      icon: AlertCircle,
      color: "text-gray-600"
    }
  ]

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
        status: budget.status,
        approved_by: budget.approved_by || undefined
      })
    }
  }, [budget])

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setIsEditing(false)
      setErrors({})
    }
  }, [isOpen])

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
        newErrors.year = t_budget.validation.yearRequired
      } else {
        const year = parseInt(formData.year)
        if (isNaN(year)) {
          newErrors.year = t_budget.validation.yearInvalid
        } else if (year < 2000) {
          newErrors.year = t_budget.validation.yearMin
        } else if (year > currentYear + 10) {
          newErrors.year = t_budget.validation.yearMax
        }
      }

      // Planned budget validation
      if (!formData.planned_budget?.trim()) {
        newErrors.planned_budget = t_budget.validation.plannedBudgetRequired
      } else {
        const budgetAmount = parseFloat(formData.planned_budget)
        if (isNaN(budgetAmount)) {
          newErrors.planned_budget = t_budget.validation.plannedBudgetInvalid
        } else if (budgetAmount <= 0) {
          newErrors.planned_budget = t_budget.validation.plannedBudgetMin
        }
      }

      // Status validation
      if (!formData.status) {
        newErrors.status = t_budget.validation.statusRequired
      }
    }

    if (step === 2) {
      // Total expenses validation
      if (formData.total_expenses?.trim()) {
        const expenses = parseFloat(formData.total_expenses)
        if (isNaN(expenses)) {
          newErrors.total_expenses = t_budget.validation.totalExpensesInvalid
        } else if (expenses < 0) {
          newErrors.total_expenses = t_budget.validation.totalExpensesNegative
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
    if (!budget) return

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(t_budget.validation?.fixErrors || "Please fix the errors before continuing")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t_budget.updating || "Updating budget...")

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
        status: formData.status,
        approved_by: formData.approved_by || null,
        updated_at: new Date().toISOString()
      }

      toast.dismiss(loadingToast)
      toast.success(t_budget.updated || "Annual budget updated successfully!", {
        duration: 3000,
        icon: '✅'
      })

      if (onSave) {
        onSave(updatedBudget)
      }

      setIsEditing(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t_budget.updateFailed || "Failed to update annual budget")
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
        status: budget.status,
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
    const locale = currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'nl' ? 'nl-NL' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale, {
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

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status)
    const Icon = statusOption?.icon || AlertCircle
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 text-xs">
        <Icon className={`w-3 h-3 ${statusOption?.color || 'text-gray-500'}`} />
        {statusOption?.label || status}
      </Badge>
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
          t_budget.basicInformation || "Budget Overview",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_budget.year || "Year"}
              </Label>
              {renderCopyableField(budget.year, 'year')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_budget.plannedBudget || "Planned Budget"}
              </Label>
              {renderCopyableField(budget.planned_budget, 'planned_budget', undefined, formatCurrency)}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_budget.status || "Status"}
              </Label>
              <div className="py-2">
                {getStatusBadge(budget.status)}
              </div>
            </div>
          </div>
        )}

        {/* Financial Details Section */}
        {renderCollapsibleSection(
          'financial',
          <Calculator className="w-4 h-4 text-gray-500" />,
          t_budget.financialDetails || "Financial Details",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_budget.totalExpenses || "Total Expenses"}
              </Label>
              {renderCopyableField(budget.total_expenses, 'total_expenses', undefined, formatCurrency)}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_budget.balance || "Balance"}
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
                    {budget.balance >= 0 ? "Positive" : "Deficit"}
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
              <h4 className="text-sm font-medium text-gray-900">Budget Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Planned:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(budget.planned_budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expenses:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(budget.total_expenses)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="text-gray-600">Balance:</span>
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
          t_budget.additionalInfo || "Additional Information",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_budget.notes || "Notes"}
              </Label>
              <div className="flex items-start justify-between group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words py-2">
                    {budget.notes || <span className="text-gray-500 italic">No notes provided</span>}
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
                  {t_budget.approvedBy || "Approved By"}
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
          "System Information",
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Created At
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {budget.created_at ? formatDate(budget.created_at) : '-'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Updated At
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
              <h3 className="text-lg font-medium text-gray-900">{t_budget.basicInformation || "Budget Overview"}</h3>
              <p className="text-sm text-gray-600">{t_budget.basicInformationDesc || "Year, planned budget, and status"}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {t_budget.year || "Year"} *
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder={t_budget.yearPlaceholder || "Enter budget year"}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.year ? 'border-red-500' : ''}`}
                />
                {errors.year && (
                  <p className="text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="planned_budget" className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  {t_budget.plannedBudget || "Planned Budget"} *
                </Label>
                <Input
                  id="planned_budget"
                  type="number"
                  step="0.01"
                  value={formData.planned_budget}
                  onChange={(e) => handleInputChange('planned_budget', e.target.value)}
                  placeholder={t_budget.plannedBudgetPlaceholder || "Enter planned budget"}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.planned_budget ? 'border-red-500' : ''}`}
                />
                {errors.planned_budget && (
                  <p className="text-sm text-red-600">{errors.planned_budget}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  {t_budget.status || "Status"} *
                </Label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => {
                    const Icon = status.icon
                    const isSelected = formData.status === status.value
                    return (
                      <Button
                        key={status.value}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('status', status.value as any)}
                        disabled={isLoading}
                        className={`flex items-center gap-1 ${isSelected ? 'bg-gray-900 text-white' : 'border-gray-300 text-gray-700'}`}
                      >
                        <Icon className={`w-3 h-3 ${isSelected ? 'text-white' : status.color}`} />
                        {status.label}
                      </Button>
                    )
                  })}
                </div>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status}</p>
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
              <h3 className="text-lg font-medium text-gray-900">{t_budget.financialDetails || "Financial Details"}</h3>
              <p className="text-sm text-gray-600">{t_budget.financialDetailsDesc || "Expenses and balance tracking"}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="total_expenses" className="flex items-center gap-2 text-sm text-gray-600">
                  <Calculator className="w-4 h-4 text-gray-500" />
                  {t_budget.totalExpenses || "Total Expenses"}
                </Label>
                <Input
                  id="total_expenses"
                  type="number"
                  step="0.01"
                  value={formData.total_expenses}
                  onChange={(e) => handleInputChange('total_expenses', e.target.value)}
                  placeholder={t_budget.totalExpensesPlaceholder || "Enter total expenses"}
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
                  {t_budget.balance || "Balance"}
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
                      {calculateBalance(formData.planned_budget, formData.total_expenses) >= 0 ? "Positive" : "Deficit"}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{t_budget.balanceHelp || "Balance is calculated automatically"}</p>
              </div>

              {/* Budget Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Budget Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planned Budget:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(formData.planned_budget || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Expenses:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(formData.total_expenses || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Balance:</span>
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
              <h3 className="text-lg font-medium text-gray-900">{t_budget.additionalInfo || "Additional Information"}</h3>
              <p className="text-sm text-gray-600">{t_budget.additionalInfoDesc || "Notes and approvals"}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4 text-gray-500" />
                  {t_budget.notes || "Notes"}
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={t_budget.notesPlaceholder || "Additional notes or comments..."}
                  disabled={isLoading}
                  rows={4}
                  className="text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              {/* Review Section */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  Review & Confirm
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year:</span>
                    <span className="font-medium text-gray-900">{formData.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    {getStatusBadge(formData.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planned Budget:</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(parseFloat(formData.planned_budget || "0"))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance:</span>
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

  if (!budget) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg text-gray-900">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            {t_budget.title || "Annual Budget"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {entityName ? (
              `${entityType}: ${entityName} - ${budget.year}`
            ) : (
              t_budget.description || "View and manage annual budget details"
            )}
          </DialogDescription>
          
          {/* Budget Status and Edit Button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {getStatusBadge(budget.status)}
              <Badge variant="outline" className="text-xs">
                Year {budget.year}
              </Badge>
              {budget.is_deleted && (
                <Badge variant="destructive" className="bg-gray-800 text-white">Deleted</Badge>
              )}
            </div>
            {!readonly && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                {t_budget.edit || "Edit"}
              </Button>
            )}
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
                  {t_budget.previous || "Previous"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={isEditing ? handleCancel : handleClose}
                disabled={isLoading}
                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-3 h-3 mr-1" />
                {isEditing ? (t_budget.cancel || "Cancel") : (t_budget.close || "Close")}
              </Button>
            </div>

            <div className="flex gap-2">
              {isEditing && currentStep < totalSteps && (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {t_budget.next || "Next"}
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
                  {isLoading ? (t_budget.saving || "Saving...") : (t_budget.save || "Save Changes")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}