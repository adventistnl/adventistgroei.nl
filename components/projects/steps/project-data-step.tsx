import React, { useState } from 'react'
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
import { cn } from '@/lib/utils'
import { StepInfo } from '../step-info'
import { ProjectFormData } from '@/components/projects/types'

interface ProjectDataStepProps {
  formData: ProjectFormData
  errors: Record<string, string>
  departments: Array<{ id: string; name: string; annual_budget?: number }>
  users: Array<{ id: string; name: string; email: string }>
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

export function ProjectDataStep({ formData, errors, departments, users, onChange }: ProjectDataStepProps) {
  const { t } = useTranslation()
  const [openDepartment, setOpenDepartment] = useState(false)
  const [openResponsible, setOpenResponsible] = useState(false)

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
                      <p className="text-sm">{t('projectRegister.tooltips.department')}</p>
                    </TooltipContent>
                  </Tooltip>
                </Label>
                <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDepartment}
                      className={`h-12 w-full justify-between border-2 ${errors.department_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
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
            <div className="space-y-4">
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
            </div>

            {/* Register as Event Switch */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
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
            </div>

            {/* Private Project Switch */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
