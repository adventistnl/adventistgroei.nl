"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
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
  ChevronsUpDown,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
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

export interface AnnualBudgetModalProps {
  children: React.ReactNode
  budget?: AnnualBudgetData | null
  mode?: "add" | "edit"
  onSuccess?: (data: AnnualBudgetData) => void
  onSave?: (data: AnnualBudgetFormData) => Promise<void>
  onUpdate?: (id: string, data: AnnualBudgetFormData) => Promise<void>
  institutionId?: string
}

export function AnnualBudgetModal({
  children,
  budget = null,
  mode = "add",
  onSuccess,
  onSave,
  onUpdate,
  institutionId
}: AnnualBudgetModalProps) {
  const [isOpen, setIsOpen] = useState(false)
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
  const [openStatus, setOpenStatus] = useState(false)

  const totalSteps = 3
  const { i18n } = useTranslation()
  
  // Get translations for current language
  const t_budget = annualBudgetTranslations[i18n.language as keyof typeof annualBudgetTranslations] || annualBudgetTranslations.en

  // Calculate balance automatically
  const calculateBalance = (plannedBudget: string, totalExpenses: string) => {
    const planned = parseFloat(plannedBudget) || 0
    const expenses = parseFloat(totalExpenses) || 0
    return planned - expenses
  }

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

  useEffect(() => {
    if (isOpen) {
      if (budget && mode === "edit") {
        // Populate form with existing budget data
        setFormData({
          year: budget.year.toString(),
          planned_budget: budget.planned_budget.toString(),
          total_expenses: budget.total_expenses.toString(),
          notes: budget.notes || "",
          status: budget.status,
          approved_by: budget.approved_by || undefined
        })
      } else {
        // Reset form for new budget
        const currentYear = new Date().getFullYear()
        setFormData({
          year: currentYear.toString(),
          planned_budget: "",
          total_expenses: "0",
          notes: "",
          status: "planned",
          approved_by: undefined
        })
      }
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen, budget, mode])

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
        const budget = parseFloat(formData.planned_budget)
        if (isNaN(budget)) {
          newErrors.planned_budget = t_budget.validation.plannedBudgetInvalid
        } else if (budget <= 0) {
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
    // Validate all steps
    let isValid = true
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        isValid = false
        break
      }
    }

    if (!isValid) {
      toast.error(t_budget.validation.fixErrors)
      return
    }

    setIsLoading(true)
    const loadingMessage = mode === "edit" ? t_budget.updating : t_budget.saving
    const loadingToast = toast.loading(loadingMessage)

    try {
      if (mode === "edit" && budget?.id && onUpdate) {
        await onUpdate(budget.id, formData)
        toast.dismiss(loadingToast)
        toast.success(t_budget.updated, { duration: 4000 })
      } else if (mode === "add" && onSave) {
        await onSave(formData)
        toast.dismiss(loadingToast)
        toast.success(t_budget.saved, { duration: 4000 })
      }

      // Call success callback
      if (onSuccess) {
        const budgetData: AnnualBudgetData = {
          id: budget?.id,
          year: parseInt(formData.year),
          planned_budget: parseFloat(formData.planned_budget),
          total_expenses: parseFloat(formData.total_expenses) || 0,
          balance: calculateBalance(formData.planned_budget, formData.total_expenses),
          notes: formData.notes || null,
          status: formData.status,
          approved_by: formData.approved_by || null,
        }
        onSuccess(budgetData)
      }

      // Close modal
      setIsOpen(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      const errorMessage = mode === "edit" ? t_budget.updateFailed : t_budget.saveFailed
      toast.error(errorMessage)
      console.error(`Error ${mode === "edit" ? "updating" : "creating"} annual budget:`, error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      year: "",
      planned_budget: "",
      total_expenses: "",
      notes: "",
      status: "planned",
      approved_by: undefined
    })
    setErrors({})
    setCurrentStep(1)
    setIsOpen(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">{t_budget.basicInformation}</h3>
              <p className="text-sm text-gray-600">{t_budget.basicInformationDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {t_budget.year} *
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  placeholder={t_budget.yearPlaceholder}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.year ? 'border-red-500' : ''}`}
                />
                {errors.year && (
                  <p className="text-sm text-red-600">{errors.year}</p>
                )}
                <p className="text-xs text-gray-500">{t_budget.yearHelp}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planned_budget" className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  {t_budget.plannedBudget} *
                </Label>
                <Input
                  id="planned_budget"
                  type="number"
                  step="0.01"
                  value={formData.planned_budget}
                  onChange={(e) => handleInputChange('planned_budget', e.target.value)}
                  placeholder={t_budget.plannedBudgetPlaceholder}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.planned_budget ? 'border-red-500' : ''}`}
                />
                {errors.planned_budget && (
                  <p className="text-sm text-red-600">{errors.planned_budget}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  {t_budget.status} *
                </Label>
                <Popover open={openStatus} onOpenChange={setOpenStatus}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openStatus}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal border-gray-300 focus:border-gray-500 focus:ring-gray-500",
                        !formData.status && "text-gray-500",
                        errors.status && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      {formData.status ? (
                        <div className="flex items-center gap-2">
                          {(() => {
                            const selectedStatus = statusOptions.find(s => s.value === formData.status)
                            const Icon = selectedStatus?.icon || CheckCircle
                            return (
                              <>
                                <Icon className={`w-4 h-4 ${selectedStatus?.color || 'text-gray-500'}`} />
                                {selectedStatus?.label}
                              </>
                            )
                          })()}
                        </div>
                      ) : (
                        t_budget.statusPlaceholder
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {statusOptions.map((status) => {
                            const Icon = status.icon
                            return (
                              <CommandItem
                                key={status.value}
                                value={status.value}
                                onSelect={(currentValue) => {
                                  handleInputChange('status', currentValue as any)
                                  setOpenStatus(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.status === status.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <Icon className={`mr-2 h-4 w-4 ${status.color}`} />
                                {status.label}
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status}</p>
                )}
                <p className="text-xs text-gray-500">{t_budget.statusHelp}</p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">{t_budget.financialDetails}</h3>
              <p className="text-sm text-gray-600">{t_budget.financialDetailsDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="total_expenses" className="flex items-center gap-2 text-sm">
                  <Calculator className="w-4 h-4 text-gray-500" />
                  {t_budget.totalExpenses}
                </Label>
                <Input
                  id="total_expenses"
                  type="number"
                  step="0.01"
                  value={formData.total_expenses}
                  onChange={(e) => handleInputChange('total_expenses', e.target.value)}
                  placeholder={t_budget.totalExpensesPlaceholder}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.total_expenses ? 'border-red-500' : ''}`}
                />
                {errors.total_expenses && (
                  <p className="text-sm text-red-600">{errors.total_expenses}</p>
                )}
              </div>

              {/* Balance Display */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  {t_budget.balance}
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    value={calculateBalance(formData.planned_budget, formData.total_expenses).toFixed(2)}
                    disabled={true}
                    className="h-12 text-base border-gray-300 bg-gray-50 text-gray-700"
                    placeholder={t_budget.balancePlaceholder}
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
                <p className="text-xs text-gray-500">{t_budget.balanceHelp}</p>
              </div>

              {/* Budget Summary Card */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900">Budget Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planned Budget:</span>
                    <span className="font-medium text-gray-900">
                      ${parseFloat(formData.planned_budget || "0").toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Expenses:</span>
                    <span className="font-medium text-gray-900">
                      ${parseFloat(formData.total_expenses || "0").toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span className="text-gray-600">Balance:</span>
                    <span className={`font-semibold ${calculateBalance(formData.planned_budget, formData.total_expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${calculateBalance(formData.planned_budget, formData.total_expenses).toLocaleString()}
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
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-gray-900">{t_budget.additionalInfo}</h3>
              <p className="text-sm text-gray-600">{t_budget.additionalInfoDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-500" />
                  {t_budget.notes}
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={t_budget.notesPlaceholder}
                  disabled={isLoading}
                  className="min-h-[120px] text-base resize-none border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  rows={5}
                />
              </div>

              {/* Final Review */}
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
                    <Badge variant="outline" className="text-xs">
                      {statusOptions.find(s => s.value === formData.status)?.label}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planned Budget:</span>
                    <span className="font-medium text-gray-900">
                      ${parseFloat(formData.planned_budget || "0").toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Balance:</span>
                    <span className={`font-semibold ${calculateBalance(formData.planned_budget, formData.total_expenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${calculateBalance(formData.planned_budget, formData.total_expenses).toLocaleString()}
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

  const modalTitle = mode === "edit" ? t_budget.editTitle : t_budget.addTitle
  const modalDescription = mode === "edit" ? t_budget.editDescription : t_budget.addDescription
  const saveButtonText = mode === "edit" ? t_budget.update : t_budget.save

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? setIsOpen : undefined}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            {modalTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {modalDescription}
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
          </div>
        </DialogHeader>

        {/* Step Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation Buttons - Fixed Footer */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {t_budget.previous}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
                className="text-xs"
              >
                {t_budget.cancel}
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {t_budget.next}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[120px] text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      {mode === "edit" ? t_budget.updating : t_budget.saving}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      {saveButtonText}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}