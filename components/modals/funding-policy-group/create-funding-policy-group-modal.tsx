"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Layers, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  X,
  Trash2,
  Settings,
  Type,
  Hash,
  Calendar,
  FileText,
  List,
  ToggleLeft,
  AlertCircle,
  Info,
  ChevronsUpDown
} from "lucide-react"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"
import { fundingPolicyGroupTranslations } from "@/lib/translations/funding-policy-groups"

// Types
export interface FundingPolicyGroup {
  id: string
  name: string
  entity_id?: string | null
  description?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  created_by: string
}

export interface FundingPolicyValidation {
  id: string
  group_id: string
  field_name: string
  field_label: string
  field_type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'DATE' | 'FILE' | 'SELECT' | 'BOOLEAN'
  is_required: boolean
  options?: string[] | null
  created_at: string
  updated_at: string
  created_by: string
}

interface ValidationFieldForm {
  tempId: string
  field_name: string
  field_label: string
  field_type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'DATE' | 'FILE' | 'SELECT' | 'BOOLEAN'
  is_required: boolean
  options: string[]
}

interface GroupFormData {
  name: string
  description: string
  is_active: boolean
  validations: ValidationFieldForm[]
}

export interface CreateFundingPolicyGroupModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  entityId?: string | null
  onSuccess?: (group: FundingPolicyGroup) => void
}

const FIELD_TYPE_OPTIONS = (t: any) => [
  { 
    value: 'TEXT', 
    label: t.fieldTypes.TEXT.label,
    icon: Type, 
    description: t.fieldTypes.TEXT.description,
    info: t.fieldTypes.TEXT.info
  },
  { 
    value: 'TEXTAREA', 
    label: t.fieldTypes.TEXTAREA.label,
    icon: FileText, 
    description: t.fieldTypes.TEXTAREA.description,
    info: t.fieldTypes.TEXTAREA.info
  },
  { 
    value: 'NUMBER', 
    label: t.fieldTypes.NUMBER.label,
    icon: Hash, 
    description: t.fieldTypes.NUMBER.description,
    info: t.fieldTypes.NUMBER.info
  },
  { 
    value: 'DATE', 
    label: t.fieldTypes.DATE.label,
    icon: Calendar, 
    description: t.fieldTypes.DATE.description,
    info: t.fieldTypes.DATE.info
  },
  { 
    value: 'SELECT', 
    label: t.fieldTypes.SELECT.label,
    icon: List, 
    description: t.fieldTypes.SELECT.description,
    info: t.fieldTypes.SELECT.info
  },
  { 
    value: 'BOOLEAN', 
    label: t.fieldTypes.BOOLEAN.label,
    icon: ToggleLeft, 
    description: t.fieldTypes.BOOLEAN.description,
    info: t.fieldTypes.BOOLEAN.info
  },
  { 
    value: 'FILE', 
    label: t.fieldTypes.FILE.label,
    icon: FileText, 
    description: t.fieldTypes.FILE.description,
    info: t.fieldTypes.FILE.info
  }
]

export function CreateFundingPolicyGroupModal({
  isOpen,
  onOpenChange,
  entityId,
  onSuccess
}: CreateFundingPolicyGroupModalProps) {
  const { i18n } = useTranslation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    is_active: true,
    validations: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // New validation field being added
  const [newValidation, setNewValidation] = useState<ValidationFieldForm>({
    tempId: '',
    field_name: '',
    field_label: '',
    field_type: 'TEXT',
    is_required: true,
    options: []
  })
  const [optionInput, setOptionInput] = useState('')
  const [openFieldType, setOpenFieldType] = useState(false)

  const totalSteps = 3
  
  // Get translations
  const t = fundingPolicyGroupTranslations[i18n.language as keyof typeof fundingPolicyGroupTranslations] || fundingPolicyGroupTranslations.en
  
  // Get field type options with translations
  const fieldTypeOptions = FIELD_TYPE_OPTIONS(t)

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        is_active: true,
        validations: []
      })
      setNewValidation({
        tempId: '',
        field_name: '',
        field_label: '',
        field_type: 'TEXT',
        is_required: true,
        options: []
      })
      setOptionInput('')
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleValidationChange = (field: string, value: string | boolean | string[]) => {
    setNewValidation(prev => {
      const updated = {
        ...prev,
        [field]: value
      }
      
      // Auto-generate label when field_name or field_type changes
      if (field === 'field_name' || field === 'field_type') {
        const fieldName = field === 'field_name' ? value as string : prev.field_name
        const fieldType = field === 'field_type' ? value as string : prev.field_type
        
        if (fieldName.trim()) {
          const fieldTypeOption = fieldTypeOptions.find(opt => opt.value === fieldType)
          const cleanName = fieldName.trim().replace(/_/g, ' ')
          const autoLabel = `${cleanName} (${fieldTypeOption?.label || fieldType})`
          updated.field_label = autoLabel
        }
      }
      
      return updated
    })
  }

  const handleAddOption = () => {
    if (!optionInput.trim()) return
    
    setNewValidation(prev => ({
      ...prev,
      options: [...prev.options, optionInput.trim()]
    }))
    setOptionInput('')
  }

  const handleRemoveOption = (index: number) => {
    setNewValidation(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const handleAddValidation = () => {
    if (!newValidation.field_name.trim()) {
      toast.error(t.validation.fieldNameRequired)
      return
    }
    if (!newValidation.field_label.trim()) {
      toast.error(t.validation.fieldLabelRequired)
      return
    }
    if (newValidation.field_type === 'SELECT' && newValidation.options.length === 0) {
      toast.error(t.validation.selectOptionsRequired)
      return
    }

    const validation: ValidationFieldForm = {
      ...newValidation,
      tempId: `temp_${Date.now()}_${Math.random()}`,
      field_name: newValidation.field_name.toLowerCase().replace(/\s+/g, '_')
    }

    setFormData(prev => ({
      ...prev,
      validations: [...prev.validations, validation]
    }))

    // Reset new validation form
    setNewValidation({
      tempId: '',
      field_name: '',
      field_label: '',
      field_type: 'TEXT',
      is_required: true,
      options: []
    })
    setOptionInput('')

    toast.success(t.fieldAdded)
  }

  const handleRemoveValidation = (tempId: string) => {
    setFormData(prev => ({
      ...prev,
      validations: prev.validations.filter(v => v.tempId !== tempId)
    }))
    toast.success(t.fieldRemoved)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = t.validation.nameRequired
      } else if (formData.name.trim().length < 2) {
        newErrors.name = t.validation.nameMinLength
      }

      if (!formData.description?.trim()) {
        newErrors.description = t.validation.descriptionRequired
      } else if (formData.description.trim().length < 10) {
        newErrors.description = t.validation.descriptionMinLength
      }
    }

    // Step 2 (validations) is optional
    // Step 3 (review) - final validation
    if (step === 3) {
      if (!formData.name?.trim()) {
        newErrors.name = t.validation.nameRequired
      }
      if (!formData.description?.trim()) {
        newErrors.description = t.validation.descriptionRequired
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

  const handleSkipValidations = () => {
    setCurrentStep(3)
  }

  const handleSave = async () => {
    if (!validateStep(3)) {
      toast.error(t.validation.fixErrors)
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t.creating)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const newGroup: FundingPolicyGroup = {
        id: `group_${Date.now()}`,
        name: formData.name,
        entity_id: entityId || null,
        description: formData.description || null,
        is_active: formData.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user'
      }

      // Here you would also create validations
      // formData.validations.forEach(validation => {
      //   createValidation({ ...validation, group_id: newGroup.id })
      // })

      toast.dismiss(loadingToast)
      toast.success(t.groupCreated, {
        duration: 3000,
        icon: '✅'
      })

      if (onSuccess) {
        onSuccess(newGroup)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to create funding policy group')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (!isLoading) {
      onOpenChange(false)
    }
  }

  const getFieldTypeIcon = (type: string) => {
    const option = fieldTypeOptions.find(opt => opt.value === type)
    return option?.icon || Type
  }
  
  const getFieldTypeInfo = (type: string) => {
    const option = fieldTypeOptions.find(opt => opt.value === type)
    return option?.info || ''
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic Information
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t.groupInformation}</h3>
              <p className="text-sm text-muted-foreground">{t.groupInformationDesc}</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t.groupName} *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t.groupNamePlaceholder}
                  disabled={isLoading}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t.description} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  disabled={isLoading}
                  className={`min-h-[100px] resize-none ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active" className="text-sm font-medium">
                    {t.activeStatus}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t.activeStatusDesc}
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        // Step 2: Validation Fields
        return (
          <TooltipProvider>
            <div className="space-y-8 animate-in fade-in-0 duration-300">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{t.validationFields}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.validationFieldsDesc}
                </p>
              </div>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Existing Validations */}
                {formData.validations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {t.configuredFields.replace('{{count}}', String(formData.validations.length))}
                    </h4>
                    <div className="space-y-2">
                      {formData.validations.map((validation) => {
                        const IconComponent = getFieldTypeIcon(validation.field_type)
                        return (
                          <div 
                            key={validation.tempId} 
                            className="flex items-center justify-between gap-3 p-2 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{validation.field_label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {validation.field_type}
                                  {validation.is_required && ' • Required'}
                                  {validation.field_type === 'SELECT' && validation.options.length > 0 && ` • ${validation.options.length} options`}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveValidation(validation.tempId)}
                              className="text-muted-foreground hover:text-red-600 h-7 w-7 p-0 flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Add New Validation */}
                <div className="space-y-4 p-4 border-2 border-dashed rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <h4 className="text-sm font-semibold">{t.addValidationField}</h4>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.fieldName} *</Label>
                    <Input
                      value={newValidation.field_name}
                      onChange={(e) => handleValidationChange('field_name', e.target.value)}
                      placeholder={t.fieldNamePlaceholder}
                    />
                    {newValidation.field_label && (
                      <div className="flex items-start gap-2 p-2 bg-muted/50 rounded-md border border-dashed">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                            {t.fieldLabel} ({t.fieldLabelAuto})
                          </p>
                          <p className="text-xs font-medium text-foreground truncate">
                            {newValidation.field_label}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t.fieldType} *</Label>
                    <Popover open={openFieldType} onOpenChange={setOpenFieldType}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFieldType}
                          className={cn(
                            "w-full justify-between font-normal",
                            !newValidation.field_type && "text-muted-foreground"
                          )}
                        >
                          {newValidation.field_type ? (
                            <div className="flex items-center gap-2">
                              {React.createElement(getFieldTypeIcon(newValidation.field_type), { className: "w-4 h-4" })}
                              <span>{fieldTypeOptions.find(opt => opt.value === newValidation.field_type)?.label}</span>
                            </div>
                          ) : (
                            t.fieldTypePlaceholder
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder={t.searchFieldType} />
                          <CommandList>
                            <CommandEmpty>{t.noFieldTypeFound}</CommandEmpty>
                            <CommandGroup>
                              {fieldTypeOptions.map((option) => (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(currentValue) => {
                                    handleValidationChange('field_type', currentValue.toUpperCase() as any)
                                    setOpenFieldType(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newValidation.field_type === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex items-start gap-3 flex-1">
                                    <option.icon className="w-4 h-4 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="font-medium">{option.label}</p>
                                      <p className="text-xs text-muted-foreground">{option.description}</p>
                                    </div>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent side="left" className="max-w-xs">
                                        <p className="text-xs">{option.info}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Options for SELECT type */}
                  {newValidation.field_type === 'SELECT' && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">{t.options}</Label>
                      <div className="flex gap-2">
                        <Input
                          value={optionInput}
                          onChange={(e) => setOptionInput(e.target.value)}
                          placeholder={t.optionPlaceholder}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              handleAddOption()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddOption}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {newValidation.options.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {newValidation.options.map((option, idx) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              {option}
                              <button
                                onClick={() => handleRemoveOption(idx)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">{t.requiredField}</Label>
                    <Switch
                      checked={newValidation.is_required}
                      onCheckedChange={(checked) => handleValidationChange('is_required', checked)}
                    />
                  </div>

                  <Button
                    onClick={handleAddValidation}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.addField}
                  </Button>
                </div>

                {formData.validations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{t.noFieldsConfigured}</p>
                    <p className="text-xs mt-1">{t.noFieldsConfiguredDesc}</p>
                  </div>
                )}
              </div>
            </div>
          </TooltipProvider>
        )

      case 3:
        // Step 3: Review
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t.reviewConfirm}</h3>
              <p className="text-sm text-muted-foreground">
                {t.reviewConfirmDesc}
              </p>
            </div>
            
            <div className="space-y-6 max-w-lg mx-auto">
              {/* Group Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.groupInfo}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.name}</span>
                    <span className="text-sm font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.description}</span>
                    <span className="text-sm font-medium text-right max-w-[60%] line-clamp-2">
                      {formData.description}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.status}</span>
                    <Badge variant={formData.is_active ? "default" : "secondary"} className="text-xs">
                      {formData.is_active ? t.active : t.inactive}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Validation Fields */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.validationFieldsCount.replace('{{count}}', String(formData.validations.length))}
                </h4>
                {formData.validations.length > 0 ? (
                  <div className="space-y-2">
                    {formData.validations.map((validation) => {
                      const IconComponent = getFieldTypeIcon(validation.field_type)
                      return (
                        <div key={validation.tempId} className="flex items-start gap-3 py-2 border-b border-border/50">
                          <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{validation.field_label}</span>
                              {validation.is_required && (
                                <Badge variant="destructive" className="text-xs">{t.required}</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {validation.field_type}
                              {validation.field_type === 'SELECT' && validation.options.length > 0 && 
                                ` • ${validation.options.length} ${t.options.toLowerCase()}`
                              }
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t.noFieldsConfigured}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5 text-orange-500" />
            {t.createGroup}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.createDescription}
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t.stepProgress.replace('{{current}}', String(currentStep)).replace('{{total}}', String(totalSteps))}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {renderStepContent()}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t.back}
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
              >
                {t.cancel}
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep === 2 && (
                <Button 
                  variant="ghost"
                  onClick={handleSkipValidations} 
                  disabled={isLoading}
                  size="sm"
                  className="text-muted-foreground"
                >
                  {t.skipForNow}
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {t.continue}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      {t.creating}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t.createGroupButton}
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
