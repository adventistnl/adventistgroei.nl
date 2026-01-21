import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Building, Users, Target, Home, Settings, MapPin, CalendarIcon, Check, Info, AlertTriangle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { StepInfo } from '../step-info'
import { ProjectFormData } from '@/components/projects/types'
import { useInstitution } from '@/contexts/institution-context'

interface ProjectDataStepProps {
  formData: ProjectFormData
  errors: Record<string, string>
  departments: Array<{ id: string; name: string; annual_budget?: number }>
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
  const [openChurchDepartment, setOpenChurchDepartment] = useState(false)
  const [showDepartmentInfoModal, setShowDepartmentInfoModal] = useState(false)
  const [autoModalShown, setAutoModalShown] = useState(false)
  const [isWarningExpanded, setIsWarningExpanded] = useState(false)

  // Obter dados da instituição (mesma fonte que church-departments page)
  const { currentInstitutionData } = useInstitution()
  
  // Extrair church departments da mesma forma que church-departments page
  const allChurchDepartments = useMemo(() => {
    const institutionChurches = currentInstitutionData?.churches || []
    return institutionChurches.flatMap(church => 
      church.departments?.map(department => ({ 
        ...department, 
        church_name: church.name 
      })) || []
    )
  }, [currentInstitutionData?.churches])
  
  // Filtrar departments pela church_id selecionada
  const churchDepartments = useMemo(() => {
    if (!formData.church_id || formData.project_responsible_type !== 'church') {
      return []
    }
    return allChurchDepartments.filter(dept => dept.church_id === formData.church_id)
  }, [allChurchDepartments, formData.church_id, formData.project_responsible_type])
  
  const loadingChurchDepartments = !currentInstitutionData

  // Debug: Log church departments data
  useEffect(() => {
    if (formData.church_id && formData.project_responsible_type === 'church') {
      console.log('🏛️ [Church Departments] Selected Church ID:', formData.church_id)
      console.log('📊 [Church Departments] All Departments from Institution:', allChurchDepartments.length)
      console.log('📋 [Church Departments] Filtered Departments Count:', churchDepartments.length)
      console.log('📄 [Church Departments] Filtered Departments List:', churchDepartments.map((d: any) => ({
        id: d.id,
        name: d.name,
        church_id: d.church_id,
        church_name: d.church_name
      })))
      
      // Validar consistência dos dados
      const invalidDepartments = churchDepartments.filter((d: any) => d.church_id !== formData.church_id)
      if (invalidDepartments.length > 0) {
        console.error('❌ [Church Departments] Inconsistent data - departments not matching selected church:', invalidDepartments)
      }
    }
  }, [allChurchDepartments, churchDepartments, formData.church_id, formData.project_responsible_type])

  // Check if there are departments available
  const hasDepartments = departments && departments.length > 0

  // Resetar church_department_id quando church_id mudar
  useEffect(() => {
    if (formData.church_id) {
      console.log('🔄 [Church Change] Resetting church_department_id. Previous value:', formData.church_department_id)
      // Limpar church_department_id quando mudar de igreja
      onChange({ church_department_id: null })
    }
  }, [formData.church_id])

  // Calculate step validity using useMemo to prevent infinite loops
  const isStepValid = useMemo(() => {
    // Verificar se church_department_id é obrigatório
    const isChurchProject = formData.project_responsible_type === 'church'
    const hasChurchDepartments = isChurchProject && churchDepartments.length > 0
    const needsChurchDepartment = isChurchProject && hasChurchDepartments
    
    const valid = hasDepartments && 
           formData.title?.trim() && 
           formData.description?.trim() && 
           formData.department_id && 
           formData.responsible_id &&
           (formData.project_responsible_type !== 'church' || formData.church_id) &&
           (!needsChurchDepartment || formData.church_department_id)
    
    console.log('✅ [Step Validation]', {
      hasDepartments,
      hasTitle: !!formData.title?.trim(),
      hasDescription: !!formData.description?.trim(),
      hasDepartmentId: !!formData.department_id,
      hasResponsible: !!formData.responsible_id,
      isChurchProject,
      hasChurchId: !!formData.church_id,
      hasChurchDepartments,
      needsChurchDepartment,
      hasChurchDepartmentId: !!formData.church_department_id,
      isValid: valid
    })
    
    return valid
  }, [hasDepartments, formData.title, formData.description, formData.department_id, formData.responsible_id, formData.project_responsible_type, formData.church_id, formData.church_department_id, churchDepartments.length])

  // Communicate step validity to parent component
  useEffect(() => {
    onChange({ _isStepValid: isStepValid })
  }, [isStepValid]) // Remove onChange from dependencies to prevent infinite loop

  // Auto-show modal when no departments are available and modal hasn't been shown yet
  useEffect(() => {
    if (!hasDepartments && !autoModalShown) {
      const timer = setTimeout(() => {
        setShowDepartmentInfoModal(true)
        setAutoModalShown(true)
      }, 1000) // Show after 1 second to let the page load
      
      return () => clearTimeout(timer)
    }
  }, [hasDepartments, autoModalShown])

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
            <div className="space-y-4 pt-2">
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
                  className="data-[state=checked]:bg-primary disabled:bg-gray-800 disabled:opacity-70"
                />
              </div>

              {/* Church Selector */}
              {formData.project_responsible_type === 'church' ? (
                <div className="animate-in fade-in-0 slide-in-from-top-2 duration-200 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Church Select */}
                    <div className="flex-1">
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
                      {errors.church_id && <p className="text-sm text-red-600 mt-1">{errors.church_id}</p>}
                    </div>

                    {/* Church Department Select - Only shows when church is selected */}
                
                      <div className="flex-1 animate-in fade-in-0 slide-in-from-right-2 duration-200">
                        <Label htmlFor="church_department" className="flex items-center gap-2 text-base font-medium mb-2">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          {t('projectRegister.fields.churchDepartment')} {churchDepartments.length > 0 && '*'}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="max-w-xs">
                              <p className="text-sm">{t('projectRegister.tooltips.churchDepartment') || 'Departamento específico da igreja responsável pelo projeto'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Popover open={openChurchDepartment} onOpenChange={setOpenChurchDepartment}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openChurchDepartment}
                              disabled={loadingChurchDepartments || churchDepartments.length === 0}
                              className={`h-12 w-full justify-between border-2 ${churchDepartments.length > 0 && !formData.church_department_id ? 'border-red-500' : 'border-border'} ${loadingChurchDepartments || churchDepartments.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'} transition-colors`}
                            >
                              {loadingChurchDepartments ? (
                                t('projectRegister.placeholders.loadingChurchDepartments')
                              ) : formData.church_department_id ? (
                                churchDepartments.find((dept: any) => dept.id === formData.church_department_id)?.name
                              ) : churchDepartments.length === 0 ? (
                                t('projectRegister.placeholders.noChurchDepartments')
                              ) : (
                                t('projectRegister.placeholders.selectChurchDepartment')
                              )}
                              <Building className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" align="start">
                            <Command>
                              <CommandInput placeholder={t('projectRegister.placeholders.searchChurchDepartment')} />
                              <CommandList>
                                <CommandEmpty>{t('projectRegister.noResults.churchDepartment')}</CommandEmpty>
                                <CommandGroup>
                                  
                                  {churchDepartments.map((dept: any) => {
                                    // Validação: garantir que o departamento pertence à igreja selecionada
                                    const belongsToSelectedChurch = dept.church_id === formData.church_id
                                    
                                    if (!belongsToSelectedChurch) {
                                      return null
                                    }
                                    
                                    return (
                                      <CommandItem
                                        key={dept.id}
                                        value={dept.name}
                                        onSelect={() => {
                                          console.log('✅ [Department Selected]', {
                                            departmentId: dept.id,
                                            departmentName: dept.name,
                                            churchId: dept.church_id,
                                            churchName: dept.church?.name
                                          })
                                          onChange({ church_department_id: dept.id })
                                          setOpenChurchDepartment(false)
                                        }}
                                      >
                                        <div className="flex items-center gap-3 w-full">
                                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <Building className="w-4 h-4 text-primary" />
                                          </div>
                                          <div className="flex-1">
                                            <span className="font-medium">{dept.name}</span>
                                          </div>
                                          {formData.church_department_id === dept.id && (
                                            <Check className="ml-auto h-4 w-4 text-primary" />
                                          )}
                                        </div>
                                      </CommandItem>
                                    )
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {churchDepartments.length === 0 && !loadingChurchDepartments && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('projectRegister.info.noChurchDepartmentsAvailable')}
                          </p>
                        )}
                        {churchDepartments.length > 0 && !formData.church_department_id && (
                          <p className="text-sm text-red-600 mt-1">
                            {t('projectRegister.errors.churchDepartmentRequired') || 'Selecione um departamento da igreja'}
                          </p>
                        )}
                      </div>

                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Department and Responsible */}
              {hasDepartments && (
                /* Department */
                <div className="flex-1 space-y-4">
                  <Label htmlFor="department" className="flex items-center gap-2 text-base font-medium">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    {t('projectRegister.fields.department')} *
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">{t('projectRegister.tooltips.department')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <Popover open={openDepartment && hasDepartments} onOpenChange={setOpenDepartment}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openDepartment && hasDepartments}
                        disabled={!hasDepartments}
                        className={`h-12 w-full justify-between border-2 ${errors.department_id ? 'border-red-500' : 'border-border'} ${!hasDepartments ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'} transition-colors`}
                      >
                        {formData.department_id
                          ? departments.find((dept) => dept.id === formData.department_id)?.name
                          : t('projectRegister.placeholders.selectDepartment')}
                        <Building className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder={t('projectRegister.placeholders.searchDepartment')} />
                        <CommandList>
                          <CommandEmpty>{t('projectRegister.noResults.department')}</CommandEmpty>
                          <CommandGroup>
                            {departments.map((dept) => (
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
                                    {dept.annual_budget !== undefined && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        € {dept.annual_budget.toLocaleString()}
                                      </Badge>
                                    )}
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
                </div>
              )}
                
                {/* Department Unavailable Warning */}
                {!hasDepartments && (
                  <div className="flex-1 space-y-4">
                  <Label htmlFor="department" className="flex items-center gap-2 text-base font-medium">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    {t('projectRegister.fields.department')} *
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">{t('projectRegister.tooltips.department')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="animate-in fade-in-0 slide-in-from-top-2 duration-300">
                    <div 
                      className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700/50 rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-gray-800/30"
                      onClick={() => setIsWarningExpanded(!isWarningExpanded)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('projectRegister.warnings.noDepartmentsTitle', 'Departamentos não disponíveis')}
                          </h4>
                        </div>
                        <div className="text-gray-400 dark:text-gray-500">
                          {isWarningExpanded ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      {isWarningExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/50">
                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                            {t('projectRegister.warnings.noDepartmentsDescription', 'Os departamentos não estão disponíveis no momento. Verifique se o orçamento já foi finalizado e fechado, contate diretamente o seu admin ou financeiro.')}
                          </p>
                          <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 dark:text-gray-500 ml-2">
                            <li>{t('projectRegister.warnings.reason1', 'O orçamento anual ainda não foi finalizado')}</li>
                            <li>{t('projectRegister.warnings.reason2', 'Os orçamentos departamentais estão em processo de aprovação')}</li>
                            <li>{t('projectRegister.warnings.reason3', 'Não há orçamento disponível para novos projetos')}</li>
                          </ul>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto-show Modal for No Departments */}
                <Dialog open={showDepartmentInfoModal} onOpenChange={setShowDepartmentInfoModal}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        {t('projectRegister.warnings.noDepartmentsTitle', 'Departamentos não disponíveis')}
                      </DialogTitle>
                      <DialogDescription className="space-y-3 text-left">
                        <p>
                          {t('projectRegister.warnings.noDepartmentsDetailedDescription', 'Os departamentos não estão disponíveis para seleção neste momento. Isso pode acontecer por alguns motivos:')}
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>{t('projectRegister.warnings.reason1', 'O orçamento anual ainda não foi finalizado')}</li>
                          <li>{t('projectRegister.warnings.reason2', 'Os orçamentos departamentais estão em processo de aprovação')}</li>
                          <li>{t('projectRegister.warnings.reason3', 'Não há orçamento disponível para novos projetos')}</li>
                        </ul>
                        <p className="text-sm font-medium">
                          {t('projectRegister.warnings.contactAdvice', 'Entre em contato com o administrador ou responsável financeiro para mais informações.')}
                        </p>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
             

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
  )
}
