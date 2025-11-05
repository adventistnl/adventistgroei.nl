"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Progress } from "@/components/ui/progress"
import { Check, ChevronLeft, ChevronRight, DollarSign, Percent, Hash, Users, Shield, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface FundingRule {
  id: string
  name: string
  type: 'percentage' | 'amount' | 'number' | 'category' | 'boolean'
  condition: string
  value: any
  description: string
  ruleCategory: 'justification' | 'condition'
}

interface CreateFundingRuleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (rule: Omit<FundingRule, 'id'>) => void
  groupName?: string
}

type ComparisonOperator = 'greater_than' | 'less_than' | 'equal_to' | 'between'
type ValueType = 'amount' | 'percentage' | 'requests'
type TimePeriod = 'month' | 'quarter' | 'semester' | 'year'

export function CreateFundingRuleModal({
  isOpen,
  onOpenChange,
  onSuccess,
  groupName = "Group"
}: CreateFundingRuleModalProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalSteps = 3

  // Dynamic translation-based constants
  const OPERATOR_OPTIONS = [
    { value: 'greater_than', label: t('funding_rules.create_modal.step2.operators.greater_than.label'), description: t('funding_rules.create_modal.step2.operators.greater_than.description') },
    { value: 'less_than', label: t('funding_rules.create_modal.step2.operators.less_than.label'), description: t('funding_rules.create_modal.step2.operators.less_than.description') },
    { value: 'equal_to', label: t('funding_rules.create_modal.step2.operators.equal_to.label'), description: t('funding_rules.create_modal.step2.operators.equal_to.description') },
    { value: 'between', label: t('funding_rules.create_modal.step2.operators.between.label'), description: t('funding_rules.create_modal.step2.operators.between.description') },
  ]

  const PERIOD_OPTIONS = [
    { value: 'month', label: t('funding_rules.create_modal.step2.periods.month.label'), description: t('funding_rules.create_modal.step2.periods.month.description') },
    { value: 'quarter', label: t('funding_rules.create_modal.step2.periods.quarter.label'), description: t('funding_rules.create_modal.step2.periods.quarter.description') },
    { value: 'semester', label: t('funding_rules.create_modal.step2.periods.semester.label'), description: t('funding_rules.create_modal.step2.periods.semester.description') },
    { value: 'year', label: t('funding_rules.create_modal.step2.periods.year.label'), description: t('funding_rules.create_modal.step2.periods.year.description') },
  ]

  const SCOPE_OPTIONS = [
    { value: 'per_user', label: t('funding_rules.create_modal.step2.scopes.per_user.label'), description: t('funding_rules.create_modal.step2.scopes.per_user.description') },
    { value: 'total', label: t('funding_rules.create_modal.step2.scopes.total.label'), description: t('funding_rules.create_modal.step2.scopes.total.description') },
  ]

  // Step 1: Basic Info
  const [ruleName, setRuleName] = useState("")
  const [ruleDescription, setRuleDescription] = useState("")

  // Step 2: Condition Builder
  const [valueType, setValueType] = useState<ValueType>('amount')
  const [comparisonOperator, setComparisonOperator] = useState<ComparisonOperator>('greater_than')
  const [primaryValue, setPrimaryValue] = useState("")
  const [secondaryValue, setSecondaryValue] = useState("")
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [requestsPerUser, setRequestsPerUser] = useState(false)
  
  // Popover states
  const [openOperator, setOpenOperator] = useState(false)
  const [openPeriod, setOpenPeriod] = useState(false)
  const [openScope, setOpenScope] = useState(false)

  const progress = (currentStep / totalSteps) * 100

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setCurrentStep(1)
      resetForm()
    }
  }, [isOpen])

  const resetForm = () => {
    setRuleName("")
    setRuleDescription("")
    setValueType('amount')
    setComparisonOperator('greater_than')
    setPrimaryValue("")
    setSecondaryValue("")
    setTimePeriod('month')
    setRequestsPerUser(false)
  }

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!ruleName.trim()) {
        toast.error(t('funding_rules.create_modal.validation.enter_name'))
        return
      }
    }

    if (currentStep === 2) {
      if (!primaryValue.trim()) {
        toast.error(t('funding_rules.create_modal.validation.enter_value'))
        return
      }
      if (comparisonOperator === 'between' && !secondaryValue.trim()) {
        toast.error(t('funding_rules.create_modal.validation.enter_second_value'))
        return
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (!ruleName.trim() || !primaryValue.trim()) {
      toast.error(t('funding_rules.create_modal.validation.fill_required'))
      return
    }

    // Build condition string
    let conditionString = ""
    if (valueType === 'requests') {
      conditionString = requestsPerUser 
        ? `requests_per_user_${timePeriod}`
        : `requests_total_${timePeriod}`
    } else {
      conditionString = `${valueType}_${comparisonOperator}`
    }

    // Build value based on operator
    let finalValue: any
    if (comparisonOperator === 'between') {
      finalValue = {
        min: Number(primaryValue),
        max: Number(secondaryValue)
      }
    } else {
      finalValue = Number(primaryValue)
    }

    // Determine rule type based on valueType
    let ruleType: FundingRule['type']
    if (valueType === 'amount') {
      ruleType = 'amount'
    } else if (valueType === 'percentage') {
      ruleType = 'percentage'
    } else {
      ruleType = 'number'
    }

    const newRule: Omit<FundingRule, 'id'> = {
      name: ruleName,
      type: ruleType,
      condition: conditionString,
      value: finalValue,
      description: ruleDescription || buildAutoDescription(),
      ruleCategory: 'condition' // Sempre condição
    }

    onSuccess(newRule)
    onOpenChange(false)
    toast.success(t('funding_rules.create_modal.toasts.created'))
  }

  const buildAutoDescription = () => {
    const operatorText = {
      'greater_than': t('funding_rules.create_modal.auto_description.operators.greater_than'),
      'less_than': t('funding_rules.create_modal.auto_description.operators.less_than'),
      'equal_to': t('funding_rules.create_modal.auto_description.operators.equal_to'),
      'between': t('funding_rules.create_modal.auto_description.operators.between')
    }

    const valueTypeText = {
      'amount': t('funding_rules.create_modal.auto_description.value_types.amount'),
      'percentage': t('funding_rules.create_modal.auto_description.value_types.percentage'),
      'requests': t('funding_rules.create_modal.auto_description.value_types.requests')
    }

    const periodText = {
      'month': t('funding_rules.create_modal.auto_description.periods.month'),
      'quarter': t('funding_rules.create_modal.auto_description.periods.quarter'),
      'semester': t('funding_rules.create_modal.auto_description.periods.semester'),
      'year': t('funding_rules.create_modal.auto_description.periods.year')
    }

    if (valueType === 'requests') {
      const userScope = requestsPerUser 
        ? t('funding_rules.create_modal.auto_description.per_user')
        : t('funding_rules.create_modal.auto_description.in_total')
      return `${t('funding_rules.create_modal.auto_description.maximum')} ${primaryValue} ${valueTypeText[valueType]} ${userScope} ${periodText[timePeriod]}`
    }

    if (comparisonOperator === 'between') {
      return `${valueTypeText[valueType]} ${operatorText[comparisonOperator]} ${primaryValue} ${t('funding_rules.create_modal.auto_description.and')} ${secondaryValue}`
    }

    return `${valueTypeText[valueType]} ${operatorText[comparisonOperator]} ${primaryValue}`
  }

  const getValueTypeIcon = (type: ValueType) => {
    switch (type) {
      case 'amount': return DollarSign
      case 'percentage': return Percent
      case 'requests': return Users
      default: return Hash
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('funding_rules.create_modal.title', { groupName })}</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={currentStep >= 1 ? "text-foreground font-medium" : ""}>
              {t('funding_rules.create_modal.progress_labels.information')}
            </span>
            <span className={currentStep >= 2 ? "text-foreground font-medium" : ""}>
              {t('funding_rules.create_modal.progress_labels.condition')}
            </span>
            <span className={currentStep >= 3 ? "text-foreground font-medium" : ""}>
              {t('funding_rules.create_modal.progress_labels.review')}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="py-4">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">
                  {t('funding_rules.create_modal.step1.rule_name_label')} <span className="text-destructive">{t('funding_rules.create_modal.step1.required')}</span>
                </Label>
                <Input
                  id="rule-name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder={t('funding_rules.create_modal.step1.rule_name_placeholder')}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule-description">{t('funding_rules.create_modal.step1.description_label')}</Label>
                <Textarea
                  id="rule-description"
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  placeholder={t('funding_rules.create_modal.step1.description_placeholder')}
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 2: Condition Builder */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('funding_rules.create_modal.step2.condition_type_label')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['amount', 'percentage', 'requests'] as ValueType[]).map((type) => {
                    const Icon = getValueTypeIcon(type)
                    const isSelected = valueType === type
                    return (
                      <button
                        key={type}
                        onClick={() => setValueType(type)}
                        className={`p-4 border rounded-lg transition-all duration-200 hover:border-foreground/40 ${
                          isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-2 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                          {type === 'amount' ? t('funding_rules.create_modal.step2.value_types.amount') : 
                           type === 'percentage' ? t('funding_rules.create_modal.step2.value_types.percentage') : 
                           t('funding_rules.create_modal.step2.value_types.requests')}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {valueType !== 'requests' && (
                <div className="space-y-2">
                  <Label>{t('funding_rules.create_modal.step2.operator_label')}</Label>
                  <Popover open={openOperator} onOpenChange={setOpenOperator}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openOperator}
                        className="w-full justify-between"
                      >
                        {OPERATOR_OPTIONS.find(opt => opt.value === comparisonOperator)?.label || t('funding_rules.create_modal.step2.operator_placeholder')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder={t('common.search')} />
                        <CommandList>
                          <CommandEmpty>Nenhum operador encontrado.</CommandEmpty>
                          <CommandGroup>
                            {OPERATOR_OPTIONS.map((opt) => (
                              <CommandItem
                                key={opt.value}
                                value={opt.value}
                                onSelect={() => {
                                  setComparisonOperator(opt.value as ComparisonOperator)
                                  setOpenOperator(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    comparisonOperator === opt.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div>
                                  <p className="font-medium">{opt.label}</p>
                                  <p className="text-xs text-muted-foreground">{opt.description}</p>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="primary-value">
                  {valueType === 'requests' ? 'Quantidade máxima' : 
                   comparisonOperator === 'between' ? 'Valor mínimo' : 'Valor'}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="primary-value"
                    type="number"
                    value={primaryValue}
                    onChange={(e) => setPrimaryValue(e.target.value)}
                    placeholder={
                      valueType === 'amount' ? '5000' :
                      valueType === 'percentage' ? '75' :
                      '10'
                    }
                    className={valueType === 'amount' ? 'pl-8' : valueType === 'percentage' ? 'pr-8' : ''}
                  />
                  {valueType === 'amount' && (
                    <DollarSign className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                  )}
                  {valueType === 'percentage' && (
                    <Percent className="absolute right-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {comparisonOperator === 'between' && valueType !== 'requests' && (
                <div className="space-y-2">
                  <Label htmlFor="secondary-value">
                    Valor máximo <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="secondary-value"
                      type="number"
                      value={secondaryValue}
                      onChange={(e) => setSecondaryValue(e.target.value)}
                      placeholder={
                        valueType === 'amount' ? '10000' :
                        valueType === 'percentage' ? '90' :
                        '20'
                      }
                      className={valueType === 'amount' ? 'pl-8' : valueType === 'percentage' ? 'pr-8' : ''}
                    />
                    {valueType === 'amount' && (
                      <DollarSign className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                    )}
                    {valueType === 'percentage' && (
                      <Percent className="absolute right-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              )}

              {valueType === 'requests' && (
                <>
                  <div className="space-y-2">
                    <Label>Período de tempo</Label>
                    <Popover open={openPeriod} onOpenChange={setOpenPeriod}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPeriod}
                          className="w-full justify-between"
                        >
                          {PERIOD_OPTIONS.find(opt => opt.value === timePeriod)?.label || "Selecione um período..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar período..." />
                          <CommandList>
                            <CommandEmpty>Nenhum período encontrado.</CommandEmpty>
                            <CommandGroup>
                              {PERIOD_OPTIONS.map((opt) => (
                                <CommandItem
                                  key={opt.value}
                                  value={opt.value}
                                  onSelect={() => {
                                    setTimePeriod(opt.value as TimePeriod)
                                    setOpenPeriod(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      timePeriod === opt.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p className="font-medium">{opt.label}</p>
                                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Escopo</Label>
                    <Popover open={openScope} onOpenChange={setOpenScope}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openScope}
                          className="w-full justify-between"
                        >
                          {SCOPE_OPTIONS.find(opt => opt.value === (requestsPerUser ? 'per_user' : 'total'))?.label || "Selecione um escopo..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-[400px] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar escopo..." />
                          <CommandList>
                            <CommandEmpty>Nenhum escopo encontrado.</CommandEmpty>
                            <CommandGroup>
                              {SCOPE_OPTIONS.map((opt) => (
                                <CommandItem
                                  key={opt.value}
                                  value={opt.value}
                                  onSelect={() => {
                                    setRequestsPerUser(opt.value === 'per_user')
                                    setOpenScope(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      (requestsPerUser ? 'per_user' : 'total') === opt.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div>
                                    <p className="font-medium">{opt.label}</p>
                                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome da Regra</p>
                  <p className="font-medium">{ruleName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Condição</p>
                  <p className="font-medium">{buildAutoDescription()}</p>
                </div>

                {ruleDescription && (
                  <div>
                    <p className="text-sm text-muted-foreground">Descrição</p>
                    <p className="text-sm">{ruleDescription}</p>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground mb-2">Preview da regra:</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {valueType === 'amount' ? 'valor' : 
                     valueType === 'percentage' ? 'porcentagem' : 
                     'solicitações'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Condição
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation */}
        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t('funding_rules.create_modal.buttons.back')}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {t('funding_rules.create_modal.buttons.cancel')}
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  {t('funding_rules.create_modal.buttons.next')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Check className="w-4 h-4 mr-2" />
                  {t('funding_rules.create_modal.buttons.create')}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
