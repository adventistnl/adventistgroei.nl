import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Building, Users, Target, Home, Settings, MapPin, CalendarIcon, Check, Info } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Collapse } from '@/components/ui/collapse'
import { cn } from '@/lib/utils'
import { StepInfo } from '../step-info'
import { ProjectFormData } from '@/components/projects/types'

interface ProjectDataStepProps {
  formData: ProjectFormData
  errors: Record<string, string>
  departments: Array<{ 
    id: string; 
    name: string; 
    description?: string;
    annual_budget?: number;
    hasBudgetRecord?: boolean;
    isLocked?: boolean;
    budgetYear?: number;
    allocatedAmount?: number;
    plannedBudget?: number;
    availableBudget?: number;
  }>
  users: Array<{ id: string; name: string; email: string }>
  churches: Array<{ id: string; name: string }>
  onChange: (data: Partial<ProjectFormData>) => void
}

const RESPONSIBILITY_TYPES = ['personal', 'institutional', 'church', 'region', 'department'] as const
const TYPE_ICONS = {
  personal: Users,
  institutional: Building,
  church: Home,
  region: MapPin,
  department: Settings
}

export function ProjectDataStep({ formData, errors, departments, users, churches, onChange }: ProjectDataStepProps) {
  const { t } = useTranslation()
  const [openDepartment, setOpenDepartment] = useState(false)
  const [openResponsible, setOpenResponsible] = useState(false)
  const [openChurch, setOpenChurch] = useState(false)

  // Check if there are departments with available budget (locked budget with remaining budget)
  const availableDepartments = useMemo(() => 
    departments.filter(dept => {
      // Must have budget record and be locked
      if (!dept.hasBudgetRecord || !dept.isLocked) return false
      
      // Must have a planned budget
      const plannedBudget = dept.plannedBudget || dept.annual_budget || 0
      if (plannedBudget <= 0) return false
      
      // Must have available budget (use availableBudget if provided, otherwise calculate)
      const availableBudget = dept.availableBudget !== undefined 
        ? dept.availableBudget 
        : plannedBudget - (dept.allocatedAmount || 0)
      
      const hasAvailableBudget = availableBudget > 0
      
      return hasAvailableBudget
    }), [departments]
  )

  // Debug logs para validar os dados
  console.log('=== DEPARTMENT DEBUG START ===')
  console.log('Raw Departments received:', departments)
  console.log('Departments count:', departments.length)
  
  // Debug cada departamento individualmente
  departments.forEach((dept, index) => {
    const plannedBudget = dept.plannedBudget || dept.annual_budget || 0
    const allocatedAmount = dept.allocatedAmount || 0
    const availableBudget = dept.availableBudget !== undefined 
      ? dept.availableBudget 
      : plannedBudget - allocatedAmount
    const hasAvailableBudget = availableBudget > 0
    
    console.log(`Department ${index + 1}:`, {
      id: dept.id,
      name: dept.name,
      description: dept.description,
      planned_budget: plannedBudget,
      allocated_amount: allocatedAmount,
      available_budget: availableBudget,
      hasBudgetRecord: dept.hasBudgetRecord,
      isLocked: dept.isLocked,
      budgetYear: dept.budgetYear,
      // Show both for comparison
      annual_budget_field: dept.annual_budget,
      plannedBudget_field: dept.plannedBudget,
      availableBudget_field: dept.availableBudget
    })
    console.log(`  - Passes hasBudgetRecord check: ${!!dept.hasBudgetRecord}`)
    console.log(`  - Passes isLocked check: ${!!dept.isLocked}`)
    console.log(`  - Has planned budget > 0: ${plannedBudget > 0} (€${plannedBudget})`)
    console.log(`  - Has available budget: ${hasAvailableBudget} (€${availableBudget} remaining)`)
    console.log(`  - Overall eligible: ${dept.hasBudgetRecord && dept.isLocked && hasAvailableBudget}`)
  })

  console.log('Available Departments after filtering:', availableDepartments)
  console.log('Available Departments count:', availableDepartments.length)
  console.log('Has Available Departments:', availableDepartments.length > 0)
  console.log('=== DEPARTMENT DEBUG END ===')

  const hasAvailableDepartments = availableDepartments.length > 0

  // Form validation logic
  const isFormValid = useMemo(() => {
    console.log('=== VALIDATION DEBUG START ===')
    console.log('Form data:', {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      department_id: formData.department_id,
      responsible_id: formData.responsible_id,
      church_id: formData.church_id,
      project_responsible_type: formData.project_responsible_type
    })

    // Basic required fields
    const titleValid = !!formData.title?.trim()
    const descriptionValid = !!formData.description?.trim()
    const responsibleValid = !!formData.responsible_id
    
    console.log('Basic validation:', {
      titleValid,
      descriptionValid,
      responsibleValid
    })
    
    if (!titleValid || !descriptionValid || !responsibleValid) {
      console.log('❌ Basic validation failed')
      console.log('=== VALIDATION DEBUG END ===')
      return false
    }
    
    // Department validation
    const hasDepartments = hasAvailableDepartments
    const departmentSelected = !!formData.department_id
    const selectedDept = departmentSelected ? availableDepartments.find(dept => dept.id === formData.department_id) : null
    
    // Check if selected department has available budget
    const departmentHasAvailableBudget = selectedDept ? (() => {
      const plannedBudget = selectedDept.plannedBudget || selectedDept.annual_budget || 0
      const availableBudget = selectedDept.availableBudget !== undefined
        ? selectedDept.availableBudget
        : plannedBudget - (selectedDept.allocatedAmount || 0)
      return availableBudget > 0
    })() : false
    
    console.log('Department validation:', {
      hasDepartments,
      departmentSelected,
      departmentExists: !!selectedDept,
      selectedDepartmentId: formData.department_id,
      departmentHasAvailableBudget,
      selectedDeptBudget: selectedDept ? {
        planned: selectedDept.plannedBudget || selectedDept.annual_budget || 0,
        allocated: selectedDept.allocatedAmount || 0,
        available: selectedDept.availableBudget !== undefined 
          ? selectedDept.availableBudget 
          : (selectedDept.plannedBudget || selectedDept.annual_budget || 0) - (selectedDept.allocatedAmount || 0)
      } : null
    })
    
    if (!hasDepartments || !departmentSelected || !selectedDept || !departmentHasAvailableBudget) {
      console.log('❌ Department validation failed')
      console.log('=== VALIDATION DEBUG END ===')
      return false
    }
    
    // Church project validation
    if (formData.project_responsible_type === 'church') {
      const churchSelected = !!formData.church_id
      const churchExists = churchSelected ? churches.find(church => church.id === formData.church_id) : null
      
      console.log('Church validation:', {
        churchSelected,
        churchExists: !!churchExists,
        selectedChurchId: formData.church_id
      })
      
      if (!churchSelected || !churchExists) {
        console.log('❌ Church validation failed')
        console.log('=== VALIDATION DEBUG END ===')
        return false
      }
    }
    
    // Users validation
    const userExists = users.find(user => user.id === formData.responsible_id)
    console.log('User validation:', {
      userExists: !!userExists,
      selectedUserId: formData.responsible_id,
      totalUsers: users.length
    })
    
    if (!userExists) {
      console.log('❌ User validation failed')
      console.log('=== VALIDATION DEBUG END ===')
      return false
    }
    
    console.log('✅ All validations passed')
    console.log('=== VALIDATION DEBUG END ===')
    return true
  }, [
    formData.title,
    formData.description,
    formData.department_id,
    formData.responsible_id,
    formData.church_id,
    formData.project_responsible_type,
    hasAvailableDepartments,
    availableDepartments,
    churches,
    users
  ])

  // Communicate form validity to parent component only when it changes
  React.useEffect(() => {
    console.log('=== FORM VALIDITY UPDATE ===')
    console.log('Sending _isStepValid to parent:', isFormValid)
    console.log('================================')
    onChange({ _isStepValid: isFormValid })
  }, [isFormValid])

  const ResponsibilityTypeButton = ({ 
    type, 
    isSelected 
  }: { 
    type: typeof RESPONSIBILITY_TYPES[number]; 
    isSelected: boolean 
  }) => {
    const Icon = TYPE_ICONS[type]
    return (
      <button
        type="button"
        onClick={() => onChange({ project_responsible_type: type })}
        className={cn(
          'w-full flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium',
          'hover:border-primary/50 hover:shadow-sm',
          isSelected 
            ? 'border-primary bg-primary/5 text-primary shadow-sm' 
            : 'border-border bg-background text-muted-foreground hover:text-foreground'
        )}
      >
        <Icon className="w-5 h-5" />
        <span className="text-xs text-center leading-tight">
          {t(`projectRegister.responsibilityTypes.${type}`)}
        </span>
      </button>
    )
  }

  return (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        <StepInfo
          icon={Globe}
          title={t('projectRegister.steps.projectInfo.title')}
          description={t('projectRegister.steps.projectInfo.description')}
          content={t('projectRegister.steps.projectInfo.content')}
        />

        <div className="w-full lg:w-3/4">
          <div className="space-y-6">
            {/* Project Title */}
            <div className="space-y-4">
              <Label htmlFor="title" className="flex items-center gap-2 text-base font-medium">
                <Target className="w-4 h-4 text-muted-foreground" />
                {t('projectRegister.fields.projectTitle')} *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder={t('projectRegister.placeholders.enterProjectTitle')}
                className={`h-12 text-base border-2 ${errors.title ? 'border-red-500' : 'border-border'}`}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Project Description */}
            <div className="space-y-4">
              <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {t('projectRegister.fields.projectDescription')} *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => onChange({ description: e.target.value })}
                placeholder={t('projectRegister.placeholders.describeProject')}
                className={`min-h-[120px] text-base border-2 ${errors.description ? 'border-red-500' : 'border-border'}`}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Church Project Switch and Selector */}
            <div className="space-y-4 pt-2 border-t border-border">
              <div 
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors cursor-pointer"
                onClick={(e) => {
                   // Prevent toggle if clicking on tooltip trigger or switch directly
                   if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="switch"]')) return;
                   
                   const isChecked = formData.project_responsible_type === 'church';
                   onChange(!isChecked 
                     ? { project_responsible_type: 'church' }
                     : { church_id: undefined, project_responsible_type: 'personal' }
                   )
                }}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer pointer-events-none">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      {t('projectRegister.fields.isChurchProject')}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="flex items-center justify-center">
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{t('projectRegister.tooltips.churchProject')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('projectRegister.info.churchProjectDescription')}
                  </p>
                </div>
                <Switch
                  checked={formData.project_responsible_type === 'church'}
                  onCheckedChange={(checked) => {
                    onChange(checked 
                      ? { project_responsible_type: 'church' }
                      : { church_id: undefined, project_responsible_type: 'personal' }
                    )
                  }}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Church Selector */}
              {formData.project_responsible_type === 'church' ? (
                <div className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  <Label htmlFor="church" className="flex items-center gap-2 text-base font-medium mb-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    {t('projectRegister.fields.selectChurch')} *
                  </Label>
                  <Popover open={openChurch} onOpenChange={setOpenChurch}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openChurch}
                        className={`h-12 w-full justify-between border-2 ${errors.church_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
                      >
                        {formData.church_id
                          ? churches.find((church) => church.id === formData.church_id)?.name
                          : t('projectRegister.placeholders.selectChurch')}
                        <Building className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder={t('projectRegister.placeholders.searchChurch')} />
                        <CommandList>
                          <CommandEmpty>{t('projectRegister.noResults.church')}</CommandEmpty>
                          <CommandGroup>
                            {churches.map((church) => (
                              <CommandItem
                                key={church.id}
                                value={church.name}
                                onSelect={() => {
                                  onChange({ church_id: church.id, project_responsible_type: 'church' })
                                  setOpenChurch(false)
                                }}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Home className="w-4 h-4 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-medium">{church.name}</span>
                                  </div>
                                  {formData.church_id === church.id && (
                                    <Check className="ml-auto h-4 w-4" />
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.church_id && <p className="text-sm text-red-600">{errors.church_id}</p>}
                </div>
              ) : null}
            </div>

            {/* Department and Responsible */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Department */}
              <div className="flex-1 space-y-4">
                <Label htmlFor="department" className="flex items-center gap-2 text-base font-medium">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  {t('projectRegister.fields.department')} *
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">
                        {hasAvailableDepartments 
                          ? t('projectRegister.tooltips.department')
                          : t('projectRegister.tooltips.noDepartmentsAvailable')
                        }
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Popover open={openDepartment && hasAvailableDepartments} onOpenChange={setOpenDepartment}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDepartment && hasAvailableDepartments}
                      disabled={!hasAvailableDepartments}
                      className={`h-12 w-full justify-between border-2 ${errors.department_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {formData.department_id && hasAvailableDepartments
                        ? availableDepartments.find((dept) => dept.id === formData.department_id)?.name
                        : hasAvailableDepartments 
                          ? t('projectRegister.placeholders.selectDepartment')
                          : t('projectRegister.placeholders.noDepartmentsAvailable')
                      }
                      <Building className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t('projectRegister.placeholders.searchDepartment')} />
                      <CommandList>
                        <CommandEmpty>{t('projectRegister.noResults.department')}</CommandEmpty>
                        <CommandGroup>
                          {availableDepartments.map((dept) => (
                            <CommandItem
                              key={dept.id}
                              value={dept.name}
                              onSelect={() => {
                                onChange({ department_id: dept.id })
                                setOpenDepartment(false)
                              }}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Building className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{dept.name}</span>
                                  {(() => {
                                    const plannedBudget = dept.plannedBudget || dept.annual_budget || 0
                                    const availableBudget = dept.availableBudget !== undefined
                                      ? dept.availableBudget
                                      : plannedBudget - (dept.allocatedAmount || 0)
                                    
                                    return plannedBudget > 0 && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        € {availableBudget.toLocaleString()} disponível
                                      </Badge>
                                    )
                                  })()}
                                </div>
                                {formData.department_id === dept.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
                
                {/* Department Status Information */}
                {!hasAvailableDepartments && (
                  <div className="animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <Collapse
                      trigger={
                        <div className="flex items-center gap-3">
                          <Info className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('projectRegister.info.noDepartmentsTitle')}
                          </span>
                        </div>
                      }
                      defaultOpen={false}
                      className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700/50 rounded-lg"
                      triggerClassName="hover:bg-gray-100 dark:hover:bg-gray-800/60"
                    >
                      <div className="space-y-3 px-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {t('projectRegister.info.noDepartmentsDescription')}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {t('projectRegister.info.contactAdmin')}
                          </span>
                        </p>
                      </div>
                    </Collapse>
                  </div>
                )}
              </div>

              {/* Responsible Person */}
              <div className="flex-1 space-y-4">
                <Label htmlFor="responsible" className="flex items-center gap-2 text-base font-medium">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {t('projectRegister.fields.responsiblePeople')} *
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">{t('projectRegister.tooltips.responsible')}</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Popover open={openResponsible} onOpenChange={setOpenResponsible}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openResponsible}
                      className={`h-12 w-full justify-between border-2 ${errors.responsible_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
                    >
                      {formData.responsible_id
                        ? users.find((user) => user.id === formData.responsible_id)?.name
                        : t('projectRegister.placeholders.selectResponsible')}
                      <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t('projectRegister.placeholders.searchUser')} />
                      <CommandList>
                        <CommandEmpty>{t('projectRegister.noResults.user')}</CommandEmpty>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => {
                                onChange({ responsible_id: user.id })
                                setOpenResponsible(false)
                              }}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{user.name}</span>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                                {formData.responsible_id === user.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.responsible_id && <p className="text-sm text-red-600">{errors.responsible_id}</p>}
              </div>
            </div>

            {/* Responsibility Type */}
            {/* <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-medium">
                <Home className="w-4 h-4 text-muted-foreground" />
                {t('projectRegister.fields.projectResponsibleType')}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p className="text-sm">{t('projectRegister.tooltips.responsibilityType')}</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {RESPONSIBILITY_TYPES.map((type) => (
                  <div key={type} className="flex-1 min-w-[140px]">
                    <ResponsibilityTypeButton
                      type={type}
                      isSelected={formData.project_responsible_type === type}
                    />
                  </div>
                ))}
              </div>
            </div> */}

            {/* Register as Event Switch */}
            {/* <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    {t('projectRegister.fields.registerAsEvent')}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{t('projectRegister.tooltips.registerAsEvent')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.is_private 
                    ? t('projectRegister.info.privateCannotBeEvent')
                    : t('projectRegister.info.registerAsEvent')}
                </p>
              </div>
              <Switch
                checked={formData.register_as_event}
                disabled={formData.is_private}
                onCheckedChange={(checked) => {
                  if (!formData.is_private) {
                    onChange({ register_as_event: checked })
                  }
                }}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 disabled:bg-gray-500 disabled:opacity-70"
              />
            </div> */}

            {/* Private Project Switch */}
            {/* <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    {t('projectRegister.fields.privateProject')}
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{t('projectRegister.tooltips.privateProject')}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('projectRegister.info.privateProject')}
                </p>
              </div>
              <Switch
                checked={formData.is_private}
                onCheckedChange={(checked) => {
                  onChange(checked 
                    ? { is_private: checked, register_as_event: false }
                    : { is_private: checked }
                  )
                }}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 disabled:bg-gray-500 disabled:opacity-70"
              />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}
