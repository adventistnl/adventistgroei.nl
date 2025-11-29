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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import toast from "react-hot-toast"
import { useChurches } from "@/hooks/use-churches"
import { useRegions } from "@/hooks/use-regions"
import { useInstitution } from "@/contexts/institution-context"
import { CreateChurch, CreateChurchVariables } from "@/types/CreateChurch"
import { ChurchTypeSelector } from "./church-type-selector"
import { RegionSelector } from "./region-selector"
import { ProvinceAndCitySelector } from "./province-and-city-selector"
import { churchTranslations } from "@/lib/translations/churches"
export interface AddChurchModalProps {
  isOpen: boolean
  onOpenChangeAction: (open: boolean) => void
  institutionId: string
  onSave?: (church: CreateChurch) => void
}

export function AddChurchModal({
  isOpen,
  onOpenChangeAction,
  institutionId,
  onSave
}: AddChurchModalProps) {
  const { t, i18n } = useTranslation()
  const { createChurch } = useChurches()
  const { regions, regionsLoading } = useRegions()
  const { currentInstitutionData } = useInstitution()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateChurchVariables>({
    institution_id: institutionId,
    name: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    country: '',
    state: '',
    type: null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSpecialChurch, setIsSpecialChurch] = useState(false)
  const [province, setProvince] = useState("")

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en

  // Get institution country for province/city selector
  const institutionCountry = currentInstitutionData?.contact?.country || 'NL'

  const totalSteps = 3 // Basic Data, Geographic Data, Contact Data

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution_id: institutionId,
        name: '',
        region_id: null,
        contactName: '',
        phone: '',
        email: '',
        city: '',
        country: institutionCountry,
        state: '',
        type: null,
      })
      setErrors({})
      setCurrentStep(1)
      setIsSpecialChurch(false)
      setProvince("")
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
      // Step 1: Basic data
      if (!formData.name?.trim()) {
        newErrors.name = tChurch.validation.name_required
      } else if (formData.name.trim().length < 2) {
        newErrors.name = tChurch.validation.name_min_length
      }

      // Type is only required if it's a special church
      if (isSpecialChurch && !formData.type) {
        newErrors.type = tChurch.validation.type_required
      }
    }

    if (step === 2) {
      // Step 2: Geographic data - country and state are required for creation
      if (!formData.country?.trim()) {
        newErrors.country = tChurch.validation.country_required
      }
      if (!formData.state?.trim()) {
        newErrors.state = tChurch.validation.province_required
      }
    }

    if (step === 3) {
      // Step 3: Contact data - all optional
      // No validations needed
    }

    // Final validation before save
    if (step === 99) { // Special value for final validation
      if (!formData.name?.trim()) {
        newErrors.name = tChurch.validation.name_required
      }
      // Type is required if it's a special church
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
    if (!validateStep(99)) {
      toast.error(tChurch.validation.please_fix_errors)
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
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        contactName: formData.contactName,
        country: formData.country,
        state: formData.state,
        type: formData.type,
      }
      const res = await createChurch({ variables })
      if (!res || !res.data) {
        throw new Error("Failed to create church")
      }

      toast.dismiss(loadingToast)
      toast.success(tChurch.toasts.created, {
        duration: 3000
      })

      if (onSave) {
        onSave(res.data)
      }

      onOpenChangeAction(false)

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
      contactName: '',
      phone: '',
      email: '',
      city: '',
      country: institutionCountry,
      state: '',
    })
    setErrors({})
    setCurrentStep(1)
    onOpenChangeAction(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic Data (Name, Church Type)
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
        // Step 2: Geographic Data (Province, City, Region)
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{tChurch.steps.step_2_title}</h3>
              <p className="text-sm text-muted-foreground">{tChurch.steps.step_2_description}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <ProvinceAndCitySelector
                provinceValue={province}
                onProvinceChangeAction={(value: string) => {
                  setProvince(value)
                  handleInputChange('state', value)
                }}
                cityValue={formData.city || ''}
                onCityChangeAction={(value: string) => handleInputChange('city', value)}
                countryCode={institutionCountry}
                isLoading={isLoading || regionsLoading}
                provinceError={errors.state}
                cityError={errors.city}
              />
            </div>
          </div>
        )

      case 3:
        // Step 3: Contact Data (Name, Email, Phone, City)
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{tChurch.steps.step_3_title}</h3>
              <p className="text-sm text-muted-foreground">{tChurch.steps.step_3_description}</p>
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
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChangeAction : undefined}>
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
              {currentStep === 3 && (
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
