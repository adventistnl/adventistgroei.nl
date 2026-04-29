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
  Users,
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
import { useGetAllUsersQuery } from "@/hooks/graphql/use-get-all-users-query"
import { cn } from "@/lib/utils"

// Extended interface to include new field locally
interface ExtendedDepartmentVariables extends CreateDepartmentVariables {
  responsibleUsers?: string[]
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
  departmentType?: 'church' | 'institutional'
}

export function AddDepartmentModal({
  isOpen,
  onOpenChange,
  institutionId,
  churches = [],
  onSave,
  departmentType = 'church'
}: AddDepartmentModalProps) {
  const { t: tCommon, i18n } = useTranslation();
  const { createDepartment } = useDepartments()

  // Fetch users for leader selection
  const { data: usersData, loading: usersLoading } = useGetAllUsersQuery({
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  const users = usersData?.users || []

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
    leader_id: undefined,
    contactName: '',
    phone: '',
    email: '',
    responsibleUsers: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openChurch, setOpenChurch] = useState(false);
  const [openLeader, setOpenLeader] = useState(false);
  const [openUserSelect, setOpenUserSelect] = useState(false);

  // Steps: 1. Basic Info, 2. Contact (optional), 3. Review (both types have same steps)
  const totalSteps = 3;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution: institutionId,
        church: '',
        name: '',
        description: '',
        leader_id: undefined,
        contactName: '',
        phone: '',
        email: '',
        responsibleUsers: []
      });
      setErrors({});
      setCurrentStep(1);
    }
  }, [isOpen, institutionId, departmentType]);

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
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

      // Validate church for church departments
      if (departmentType === 'church' && !formData.church) {
        newErrors.church = t.validation.church_required
      }
    }

    // Step 2 (contact) is optional - no validation

    // Step 3 (review) - final validation before save
    if (step === 3) {
      // Re-validate step 1 fields
      if (!formData.name?.trim()) {
        newErrors.name = t.validation.name_required
      }
      if (!formData.description?.trim()) {
        newErrors.description = t.validation.description_required
      }
      if (departmentType === 'church' && !formData.church) {
        newErrors.church = t.validation.church_required
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

  const handleSkipContacts = () => {
    // Skip to review step (step 3)
    setCurrentStep(3)
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
      // Prepare payload - explicitly include only the required fields
      const finalPayload: CreateDepartmentVariables = {
        name: formData.name,
        description: formData.description,
        institution: formData.institution,
        leader_id: formData.leader_id || undefined,
        church: departmentType === 'institutional' ? '' : formData.church,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone
      }

      console.log('🚀 [Create Department] Payload:', finalPayload)

      const res = await createDepartment({ variables: finalPayload })
      toast.dismiss(loadingToast)
      toast.success(t.toasts.created, {
        duration: 3000
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
      leader_id: undefined,
      contactName: '',
      phone: '',
      email: '',
      responsibleUsers: []
    })
    setErrors({})
    setCurrentStep(1)
    onOpenChange(false)
  }

  const handleAddResponsible = (userId: string) => {
    const currentUsers = formData.responsibleUsers || []
    if (!currentUsers.includes(userId)) {
      handleInputChange('responsibleUsers', [...currentUsers, userId])
    }
  }

  const handleRemoveResponsible = (userId: string) => {
    const currentUsers = formData.responsibleUsers || []
    handleInputChange('responsibleUsers', currentUsers.filter(id => id !== userId))
  }


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic Information (Name, Description, Church if needed)
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t.steps.step_1_title}</h3>
              <p className="text-sm text-muted-foreground">{t.steps.step_1_description}</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {t.fields.name} *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t.placeholders.name}
                  disabled={isLoading}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t.fields.description} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t.placeholders.description}
                  disabled={isLoading}
                  className={`min-h-[100px] resize-none ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-xs text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Church selection for church departments */}
              {departmentType === 'church' && (
                <div className="space-y-2">
                  <Label htmlFor="church" className="text-sm font-medium">
                    {t.fields.church} *
                  </Label>
                  <Popover open={openChurch} onOpenChange={setOpenChurch}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openChurch}
                        className={cn(
                          "w-full justify-between font-normal",
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
                                {church.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {errors.church && (
                    <p className="text-xs text-red-600">{errors.church}</p>
                  )}
                </div>
              )}

              {/* Leader selection - optional for institutional, required for church */}
              <div className="space-y-2">
                <Label htmlFor="leader" className="text-sm font-medium">
                  {t.fields.leader}
                </Label>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {t.fields.leader_optional_hint}
                </p>
                <Popover open={openLeader} onOpenChange={setOpenLeader}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openLeader}
                      className={cn(
                        "w-full justify-between font-normal",
                        !formData.leader_id && "text-muted-foreground",
                        errors.leader_id && "border-red-500"
                      )}
                      disabled={isLoading || usersLoading}
                    >
                      {formData.leader_id
                        ? users.find((user: any) => user.id === formData.leader_id)?.name
                        : t.placeholders.leader}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t.fields.search_leader} />
                      <CommandList>
                        <CommandEmpty>{t.fields.no_leader_found}</CommandEmpty>
                        <CommandGroup>
                          {users.map((user: any) => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => {
                                handleInputChange('leader_id', user.id)
                                setOpenLeader(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.leader_id === user.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{user.name}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.leader_id && (
                  <p className="text-xs text-red-600">{errors.leader_id}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        // Step 2: Contact Information (Optional)
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t.steps.step_2_title}</h3>
              <p className="text-sm text-muted-foreground">{t.steps.step_2_description}</p>
            </div>

            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="text-sm font-medium">
                  {t.fields.contact_name}
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contactName || ''}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder={t.placeholders.contact_name}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-sm font-medium">
                  {t.fields.contact_email}
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t.placeholders.contact_email}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="text-sm font-medium">
                  {t.fields.contact_phone}
                </Label>
                <Input
                  id="contact_phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t.placeholders.contact_phone}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        // Step 3: Review (Minimalist)
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{t.steps.step_3_title}</h3>
              <p className="text-sm text-muted-foreground">{t.steps.step_3_description}</p>
            </div>

            <div className="space-y-6 max-w-lg mx-auto">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.sections.basic_info}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.labels.name}</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.labels.description}</span>
                    <span className="text-sm font-medium text-right max-w-[60%] line-clamp-3">{formData.description}</span>
                  </div>
                  {departmentType === 'church' && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{t.labels.church}</span>
                      <span className="text-sm font-medium">{churches.find(c => c.id === formData.church)?.name || '-'}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.labels.leader}</span>
                    <span className="text-sm font-medium">{users.find((u: any) => u.id === formData.leader_id)?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{t.labels.type}</span>
                    <Badge variant="outline" className="text-xs">
                      {departmentType === 'institutional' ? t.labels.institutional : t.labels.church_dept}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {(formData.contactName || formData.email || formData.phone) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t.sections.contact_info}</h4>
                  <div className="space-y-2">
                    {formData.contactName && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t.labels.name}</span>
                        <span className="text-sm font-medium">{formData.contactName}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t.labels.email}</span>
                        <span className="text-sm font-medium">{formData.email}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t.labels.phone}</span>
                        <span className="text-sm font-medium">{formData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
            {departmentType === 'institutional' ? t.modals.create.title_institutional : t.modals.create.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {departmentType === 'institutional'
              ? t.modals.create.description_institutional
              : t.modals.create.description
            }
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
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t.buttons.previous}
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isLoading}
                size="sm"
              >
                {t.buttons.cancel}
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep === 2 && (
                <Button
                  variant="ghost"
                  onClick={handleSkipContacts}
                  disabled={isLoading}
                  size="sm"
                  className="text-muted-foreground"
                >
                  {t.buttons.skip}
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {t.buttons.next}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      {t.buttons.creating}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {t.buttons.create}
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
