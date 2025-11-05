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

interface EditFundingRuleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (rule: FundingRule) => void
  rule: FundingRule | null
  groupName?: string
}

type ComparisonOperator = 'greater_than' | 'less_than' | 'equal_to' | 'between'
type ValueType = 'amount' | 'percentage' | 'requests'
type TimePeriod = 'month' | 'quarter' | 'semester' | 'year'

const OPERATOR_OPTIONS = [
  { value: 'greater_than', label: 'Maior que (>)', description: 'Valor deve ser maior que o especificado' },
  { value: 'less_than', label: 'Menor que (<)', description: 'Valor deve ser menor que o especificado' },
  { value: 'equal_to', label: 'Igual a (=)', description: 'Valor deve ser exatamente igual' },
  { value: 'between', label: 'Entre (intervalo)', description: 'Valor deve estar entre dois números' },
]

const PERIOD_OPTIONS = [
  { value: 'month', label: 'Por mês', description: 'Limite mensal' },
  { value: 'quarter', label: 'Por trimestre', description: 'Limite trimestral (3 meses)' },
  { value: 'semester', label: 'Por semestre', description: 'Limite semestral (6 meses)' },
  { value: 'year', label: 'Por ano', description: 'Limite anual' },
]

const SCOPE_OPTIONS = [
  { value: 'per_user', label: 'Por usuário', description: 'Limite individual por usuário' },
  { value: 'total', label: 'No total', description: 'Limite total para todos os usuários' },
]

export function EditFundingRuleModal({
  isOpen,
  onOpenChange,
  onSuccess,
  rule,
  groupName = "Group"
}: EditFundingRuleModalProps) {
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

  // Load rule data when modal opens or rule changes
  useEffect(() => {
    if (isOpen && rule) {
      setRuleName(rule.name)
      setRuleDescription(rule.description || "")

      // Parse existing rule to populate form
      if (rule.type === 'amount') {
        setValueType('amount')
      } else if (rule.type === 'percentage') {
        setValueType('percentage')
      } else if (rule.type === 'number') {
        setValueType('requests')
      }

      // Parse condition string
      if (rule.condition.includes('requests')) {
        setValueType('requests')
        setRequestsPerUser(rule.condition.includes('per_user'))
        
        if (rule.condition.includes('month')) setTimePeriod('month')
        else if (rule.condition.includes('quarter')) setTimePeriod('quarter')
        else if (rule.condition.includes('semester')) setTimePeriod('semester')
        else if (rule.condition.includes('year')) setTimePeriod('year')
      } else {
        if (rule.condition.includes('greater_than')) setComparisonOperator('greater_than')
        else if (rule.condition.includes('less_than')) setComparisonOperator('less_than')
        else if (rule.condition.includes('equal_to')) setComparisonOperator('equal_to')
        else if (rule.condition.includes('between')) setComparisonOperator('between')
      }

      // Parse value
      if (typeof rule.value === 'object' && rule.value.min !== undefined) {
        setPrimaryValue(rule.value.min.toString())
        setSecondaryValue(rule.value.max.toString())
        setComparisonOperator('between')
      } else {
        setPrimaryValue(rule.value.toString())
      }
    }
  }, [isOpen, rule])

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1)
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep === 1) {
      if (!ruleName.trim()) {
        toast.error("Please enter a rule name")
        return
      }
    }

    if (currentStep === 2) {
      if (!primaryValue.trim()) {
        toast.error("Please enter a value for the condition")
        return
      }
      if (comparisonOperator === 'between' && !secondaryValue.trim()) {
        toast.error("Please enter a second value for the 'between' condition")
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
    if (!rule || !ruleName.trim() || !primaryValue.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    let conditionString = ""
    if (valueType === 'requests') {
      conditionString = requestsPerUser 
        ? `requests_per_user_${timePeriod}`
        : `requests_total_${timePeriod}`
    } else {
      conditionString = `${valueType}_${comparisonOperator}`
    }

    let finalValue: any
    if (comparisonOperator === 'between') {
      finalValue = {
        min: Number(primaryValue),
        max: Number(secondaryValue)
      }
    } else {
      finalValue = Number(primaryValue)
    }

    let ruleType: FundingRule['type']
    if (valueType === 'amount') {
      ruleType = 'amount'
    } else if (valueType === 'percentage') {
      ruleType = 'percentage'
    } else {
      ruleType = 'number'
    }

    const updatedRule: FundingRule = {
      ...rule,
      name: ruleName,
      type: ruleType,
      condition: conditionString,
      value: finalValue,
      description: ruleDescription || buildAutoDescription(),
      ruleCategory: 'condition' // Sempre condição
    }

    onSuccess(updatedRule)
    onOpenChange(false)
    toast.success(t('funding_rules.edit_modal.toasts.updated'))
  }

  const buildAutoDescription = () => {
    const operatorText = {
      'greater_than': 'maior que',
      'less_than': 'menor que',
      'equal_to': 'igual a',
      'between': 'entre'
    }

    const valueTypeText = {
      'amount': 'valor',
      'percentage': 'porcentagem',
      'requests': 'solicitações'
    }

    const periodText = {
      'month': 'por mês',
      'quarter': 'por trimestre',
      'semester': 'por semestre',
      'year': 'por ano'
    }

    if (valueType === 'requests') {
      const userScope = requestsPerUser ? 'por usuário' : 'no total'
      return `Máximo de ${primaryValue} ${valueTypeText[valueType]} ${userScope} ${periodText[timePeriod]}`
    }

    if (comparisonOperator === 'between') {
      return `${valueTypeText[valueType]} ${operatorText[comparisonOperator]} ${primaryValue} e ${secondaryValue}`
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

  if (!rule) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('funding_rules.edit_modal.title', { ruleName: rule.name })}</DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={currentStep >= 1 ? "text-foreground font-medium" : ""}>
              Informações
            </span>
            <span className={currentStep >= 2 ? "text-foreground font-medium" : ""}>
              Condição
            </span>
            <span className={currentStep >= 3 ? "text-foreground font-medium" : ""}>
              Revisar
            </span>
          </div>
        </div>

        <div className="py-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rule-name">
                  Nome da Regra <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rule-name"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="ex: Orçamento máximo por solicitação"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule-description">Descrição (Opcional)</Label>
                <Textarea
                  id="rule-description"
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  placeholder="Breve descrição desta regra..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Qual tipo de condição?</Label>
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
                          {type === 'amount' ? 'Valor ($)' : 
                           type === 'percentage' ? 'Porcentagem (%)' : 
                           'Solicitações (#)'}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {valueType !== 'requests' && (
                <div className="space-y-2">
                  <Label>Operador de Comparação</Label>
                  <Popover open={openOperator} onOpenChange={setOpenOperator}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openOperator}
                        className="w-full justify-between"
                      >
                        {OPERATOR_OPTIONS.find(opt => opt.value === comparisonOperator)?.label || "Selecione um operador..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Buscar operador..." />
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

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Próximo
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Check className="w-4 h-4 mr-2" />
                  Atualizar Regra
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
