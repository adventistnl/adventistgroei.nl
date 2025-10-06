"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Layers, 
  Plus, 
  Save, 
  X, 
  Globe, 
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  Home,
  DollarSign,
  Variable,
  ChevronsUpDown,
  Info,
  Settings
} from "lucide-react"
import toast from "react-hot-toast"
import { departmentTranslations } from "@/lib/translations/departments"
import { CreateDepartment, CreateDepartmentVariables } from "@/types/CreateDepartment"
import { useDepartments } from "@/hooks/use-departments"
import { cn } from "@/lib/utils"

// Extended interface to include new field locally
interface ExtendedDepartmentVariables extends CreateDepartmentVariables {
  is_institution_department: boolean
}

export interface DepartmentData {
  id: string
  institution: string
  church: string
  name: string
  description: string
  annual_budget: number
  is_institution_department: boolean
  contact_id?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface ContactData {
  id: string
  name?: string | null
  phone?: string | null
  mobile?: string | null
  email?: string | null
  country?: string | null
  city?: string | null
  address?: string | null
  full_address?: string | null
  postal_code?: string | null
  website?: string | null
  notes?: string | null
  is_primary: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface ChurchData {
  id: string
  name: string
  institution: string
}

export interface AddDepartmentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  churches: ChurchData[]
  onSave?: (department: CreateDepartment) => void
}

export function AddDepartmentModal({
  isOpen,
  onOpenChange,
  institutionId,
  churches = [],
  onSave
}: AddDepartmentModalProps) {
  const { t: tCommon, i18n } = useTranslation();
  const { createDepartment} = useDepartments()

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ExtendedDepartmentVariables>({
    institution: institutionId,
    church: '',
    name: '',
    description: '',
    is_institution_department: false,
    contactName: '',
    phone: '',
    email: '',
    city: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openChurch, setOpenChurch] = useState(false);

  const totalSteps = 3;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution: institutionId,
        church: '',
        name: '',
        description: '',
        is_institution_department: false,
        contactName: '',
        phone: '',
        email: '',
        city: ''
      });
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen, institutionId]);

  const handleInputChange = (field: string, value: string | number | boolean) => {
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

    if (step === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = t.validation.name_required
      } else if (formData.name.trim().length < 2) {
        newErrors.name = t.validation.name_min_length
      }

      if (!formData.description?.trim()) {
        newErrors.description = t.validation.description_required
      } else if (formData.description.trim().length < 10) {
        newErrors.description = t.validation.description_min_length
      }
    }

    if (step === 2) {
      if (!formData.is_institution_department && !formData.church) {
        newErrors.church = t.validation.church_required
      }
    }

    if (step === 3) {
      if (!formData.contactName?.trim()) {
        newErrors.contactName = t.validation.contact_name_required
      }

      if (!formData.email?.trim()) {
        newErrors.email = t.validation.email_required
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t.validation.email_invalid
      }

      if (!formData.phone?.trim()) {
        newErrors.phone = t.validation.phone_required
      }

      if (!formData.city?.trim()) {
        newErrors.city = t.validation.city_required
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(t.validation.please_fix_errors)
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t.toasts.creating)

    try {
      // Prepare payload excluding local fields
      const { is_institution_department, ...departmentData } = formData
      
      // If it's an institutional department, use institution ID as church
      const finalPayload: CreateDepartmentVariables = {
        ...departmentData,
      }

      const res = await createDepartment({ variables: finalPayload })
      toast.dismiss(loadingToast)
      toast.success(t.toasts.created, {
        duration: 3000,
        icon: '🏢'
      })

      if (!res || !res.data) throw new Error("Failed to create department")
        
      if (onSave) {
        onSave(res.data)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t.toasts.create_failed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      institution: institutionId,
      church: '',
      name: '',
      description: '',
      is_institution_department: false,
      contactName: '',
      phone: '',
      email: '',
      city: ''
    })
    setErrors({})
    setCurrentStep(1)
    onOpenChange(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t.steps.step_1_title}</h3>
              <p className="text-sm text-muted-foreground">{t.steps.step_1_description}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  {t.fields.name} *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t.placeholders.name}
                  disabled={isLoading}
                  className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  {t.fields.description} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t.placeholders.description}
                  disabled={isLoading}
                  className={`min-h-[80px] resize-none ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t.steps.step_2_title}</h3>
              <p className="text-sm text-muted-foreground">{t.steps.step_2_description}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              {/* Institution Department Switch */}
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      {t.fields.is_institution_department}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{t.department_type.institutional_tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formData.is_institution_department 
                      ? t.department_type.institutional_explanation_on
                      : t.department_type.institutional_explanation_off}
                  </p>
                </div>
                <Switch
                  checked={formData.is_institution_department}
                  onCheckedChange={(checked) => {
                    handleInputChange('is_institution_department', checked)
                    if (checked) {
                      // Clear church selection when switching to institutional
                      handleInputChange('church', '')
                    }
                  }}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300"
                  disabled={isLoading}
                />
              </div>

              {/* Church Selection - Only show if not institutional department */}
              {!formData.is_institution_department && (
                <div className="space-y-2">
                  <Label htmlFor="church" className="flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    {t.fields.church} *
                  </Label>
                  <Popover open={openChurch} onOpenChange={setOpenChurch}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openChurch}
                        className={cn(
                          "w-full h-10 justify-between font-normal",
                          !formData.church && "text-muted-foreground",
                          errors.church && "border-red-500"
                        )}
                        disabled={isLoading}
                      >
                        {formData.church
                          ? churches.find(church => church.id === formData.church)?.name
                          : t.placeholders.church}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder={t.fields.search_church} />
                        <CommandList>
                          <CommandEmpty>{t.fields.no_church_found}</CommandEmpty>
                          <CommandGroup>
                            {churches.map((church) => (
                              <CommandItem
                                key={church.id}
                                value={church.name}
                                onSelect={() => {
                                  handleInputChange('church', church.id)
                                  setOpenChurch(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.church === church.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                                {church.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.church && (
                    <p className="text-sm text-red-600">{errors.church}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t.steps.step_3_title}</h3>
              <p className="text-sm text-muted-foreground">{t.steps.step_3_description}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {t.fields.contact_name} *
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contactName || ''}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder={t.placeholders.contact_name}
                  disabled={isLoading}
                  className={`h-10 ${errors.contactName ? 'border-red-500' : ''}`}
                />
                {errors.contactName && (
                  <p className="text-sm text-red-600">{errors.contactName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {t.fields.contact_email} *
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t.placeholders.contact_email}
                  disabled={isLoading}
                  className={`h-10 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {t.fields.contact_phone} *
                </Label>
                <Input
                  id="contact_phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t.placeholders.contact_phone}
                  disabled={isLoading}
                  className={`h-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_city" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {t.fields.contact_city} *
                </Label>
                <Input
                  id="contact_city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={t.placeholders.contact_city}
                  disabled={isLoading}
                  className={`h-10 ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city}</p>
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
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5 text-muted-foreground" />
            {t.modals.create.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.modals.create.description}
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t.steps.step} {currentStep} {t.steps.of} {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
          </div>
        </DialogHeader>

        {/* Conteúdo dos Steps - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {/* Step Content */}
            {renderStepContent()}
          </div>
        </div>

        {/* Botões de Navegação - Fixos no rodapé */}
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
                  {t.buttons.previous}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
                className="text-xs"
              >
                {t.buttons.cancel}
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  {t.buttons.next}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[100px] text-xs"
                >
                  {isLoading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                      {t.buttons.creating}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      {t.buttons.save}
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
