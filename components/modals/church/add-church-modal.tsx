"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Home, 
  Save, 
  User,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react"
import toast from "react-hot-toast"
import { useChurches } from "@/hooks/use-churches"
import { CreateChurch, CreateChurchVariables } from "@/types/CreateChurch"
import { cn } from "@/lib/utils"
import { netherlandsProvinces } from "@/lib/netherlands-provinces"
import { ChurchTypeSelector, getChurchTypeOptions } from "./church-type-selector"
import { ProvinceSelector } from "./province-selector"
import { ChurchType } from "@/types/graphql-global-types"
import { churchTranslations } from "@/lib/translations/churches"
export interface AddChurchModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  onSave?: (church: CreateChurch) => void
}

export function AddChurchModal({
  isOpen,
  onOpenChange,
  institutionId,
  onSave
}: AddChurchModalProps) {
  const { t, i18n } = useTranslation()
  const { createChurch } = useChurches()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateChurchVariables>({
    institution_id: institutionId,
    name: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    type: null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSpecialChurch, setIsSpecialChurch] = useState(false)

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en

  const totalSteps = 3 // Basic Info, Contact, Review

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution_id: institutionId,
        name: '',
        region_id: '',
        contactName: '',
        phone: '',
        email: '',
        city: '',
        type: null,
      })
      setErrors({})
      setCurrentStep(1)
      setIsSpecialChurch(false)
    }
  }, [isOpen, institutionId])

  const handleInputChange = (field: string, value: string | boolean | number | null) => {
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
        newErrors.name = tChurch.validation.name_required
      } else if (formData.name.trim().length < 2) {
        newErrors.name = tChurch.validation.name_min_length
      }

      if (!formData.region_id) {
        newErrors.region_id = tChurch.validation.province_required
      }

      // Type is only required if it's a special church
      if (isSpecialChurch && !formData.type) {
        newErrors.type = tChurch.validation.type_required
      }
    }

    // Step 2 (contact) is optional - no validation needed

    // Step 3 (review) - final validation before save
    if (step === 3) {
      // Re-validate step 1 fields only
      if (!formData.name?.trim()) {
        newErrors.name = tChurch.validation.name_required
      }
      if (!formData.region_id) {
        newErrors.region_id = tChurch.validation.province_required
      }
      if (isSpecialChurch && !formData.type) {
        newErrors.type = tChurch.validation.type_required
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
    if (!validateStep(1) || !validateStep(3)) {
      toast.error(tChurch.validation.please_fix_errors)

      // Log errors for debugging
      console.error("Validation errors:", errors);
      return;
    }

    setIsLoading(true)
    const loadingToast = toast.loading(tChurch.toasts.creating)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const variables: CreateChurchVariables = {
        institution_id: institutionId,
        name: formData.name!.trim(),
        region_id: formData.region_id!,
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        contactName: formData.contactName,
        type: formData.type,
      }
      const res = await createChurch({ variables })
      if (!res || !res.data) {
        throw new Error("Failed to create church")
      }

      toast.dismiss(loadingToast)
      toast.success(tChurch.toasts.created, {
        duration: 3000,
        icon: '⛪'
      })

      if (onSave) {
        onSave(res.data)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(tChurch.toasts.create_failed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      institution_id: institutionId,
      name: '',
      region_id: '',
      contactName: '',
      phone: '',
      email: '',
      city: '',
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
              <h3 className="text-lg font-medium text-foreground">{tChurch.steps.step_1_title}</h3>
              <p className="text-sm text-muted-foreground">{tChurch.steps.step_1_description}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  {tChurch.fields.name} *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={tChurch.placeholders.name}
                  disabled={isLoading}
                  className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <ProvinceSelector
                value={formData.region_id || ''}
                onChange={(value) => handleInputChange('region_id', value)}
                isLoading={isLoading}
                error={errors.region_id}
              />

              <ChurchTypeSelector
                isSpecialChurch={isSpecialChurch}
                selectedType={formData.type as any}
                onSpecialChurchChange={setIsSpecialChurch}
                onTypeChange={(type) => handleInputChange('type', type as any)}
                isLoading={isLoading}
                error={errors.type}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{tChurch.steps.step_2_title}</h3>
              <p className="text-sm text-muted-foreground">{tChurch.steps.step_2_description}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {tChurch.fields.contact_name}
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contactName || ''}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder={tChurch.placeholders.contact_name}
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
                  {tChurch.fields.contact_email}
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={tChurch.placeholders.contact_email}
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
                  {tChurch.fields.contact_phone}
                </Label>
                <Input
                  id="contact_phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={tChurch.placeholders.contact_phone}
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
                  {tChurch.fields.contact_city}
                </Label>
                <Input
                  id="contact_city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={tChurch.placeholders.contact_city}
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

      case 3:
        // Step 3: Review (Minimalist like department modal)
        const selectedProvince = netherlandsProvinces.find(p => p.code === formData.region_id)
        const churchTypeOptions = getChurchTypeOptions(currentLanguage)
        const selectedType = churchTypeOptions.find(t => t.value === (formData.type as any))
        
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{tChurch.steps.step_3_title}</h3>
              <p className="text-sm text-muted-foreground">{tChurch.steps.step_3_description} {tChurch.steps.step_3_description_create}</p>
            </div>
            
            <div className="space-y-6 max-w-lg mx-auto">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{tChurch.sections.basic_info}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tChurch.fields.name}</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tChurch.fields.province}</span>
                    <span className="text-sm font-medium">{selectedProvince?.name || '-'}</span>
                  </div>
                  {isSpecialChurch && selectedType && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{tChurch.fields.church_type}</span>
                      <div className="flex items-center gap-2">
                        {selectedType.value === ChurchType.Plant ? (
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                        )}
                        <span className="text-sm font-semibold">{selectedType.label}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(formData.contactName || formData.email || formData.phone || formData.city) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{tChurch.sections.contact_info}</h4>
                  <div className="space-y-2">
                    {formData.contactName && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_name}</span>
                        <span className="text-sm font-medium">{formData.contactName}</span>
                      </div>
                    )}
                    {formData.email && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_email}</span>
                        <span className="text-sm font-medium">{formData.email}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_phone}</span>
                        <span className="text-sm font-medium">{formData.phone}</span>
                      </div>
                    )}
                    {formData.city && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_city}</span>
                        <span className="text-sm font-medium">{formData.city}</span>
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
            <Home className="w-5 h-5 text-muted-foreground" />
            {tChurch.modals.create.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {tChurch.modals.create.description}
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{tChurch.steps.step} {currentStep} {tChurch.steps.of} {totalSteps}</span>
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
                  {tChurch.buttons.previous}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
                className="text-xs"
              >
                {t('common.cancel')}
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
                  {tChurch.buttons.skip_for_now}
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  {tChurch.buttons.next}
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
                      {tChurch.buttons.creating}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      {tChurch.buttons.create_church}
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
