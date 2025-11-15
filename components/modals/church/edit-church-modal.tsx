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
import { UpdateChurch, UpdateChurchVariables } from "@/types/UpdateChurch"
import { ChurchTypeSelector } from "./church-type-selector"
import { RegionSelector } from "./region-selector"
import { ProvinceAndCitySelector } from "./province-and-city-selector"
import { Church, ChurchType } from "@/types/graphql-global-types"
import { churchTranslations } from "@/lib/translations/churches"

export interface EditChurchModalProps {
  isOpen: boolean
  onOpenChangeAction: (open: boolean) => void
  church: Church | null
  onSave?: (church: UpdateChurch) => void
}

export function EditChurchModal({
  isOpen,
  onOpenChangeAction,
  church,
  onSave
}: EditChurchModalProps) {
  const { t, i18n } = useTranslation()
  const { updateChurch } = useChurches()
  const { regions, regionsLoading } = useRegions()
  const { currentInstitutionData } = useInstitution()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<UpdateChurchVariables>({
    id: '',
    name: '',
    region_id: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    country: '',
    state: '',
    type: undefined,
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
    if (isOpen && church) {
      const hasSpecialType = church.type === ChurchType.Plant || church.type === ChurchType.Company
      const contactData = (church as any).contact || {}
      
      setFormData({
        id: church.id,
        name: church.name,
        region_id: church.region_id || '',
        contactName: contactData?.name || '',
        phone: contactData?.phone || '',
        email: contactData?.email || '',
        city: contactData?.city || '',
        country: contactData?.country || institutionCountry,
        state: contactData?.state || '',
        type: (church.type || undefined) as any,
      })
      setIsSpecialChurch(hasSpecialType)
      // Extract province from state or use empty if not available
      setProvince(contactData?.state || '')
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen, church])

  const handleInputChange = (field: string, value: string | boolean | number | null | undefined) => {
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
      // Step 2: Geographic data - all optional now
      // No validations needed - province/city are optional
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
      // Province is now optional
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
    setCurrentStep(3)
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSave = async () => {
    if (!validateStep(99)) {
      toast.error(tChurch.validation.please_fix_errors)
      return;
    }

    setIsLoading(true)
    const loadingToast = toast.loading(tChurch.toasts.updating)

    try {
      const variables: UpdateChurchVariables = {
        id: formData.id!,
        name: formData.name!.trim(),
        region_id: formData.region_id,
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        contactName: formData.contactName,
        country: formData.country,
        state: formData.state,
        type: formData.type,
      }
      const res = await updateChurch({ variables })
      if (!res || !res.data) {
        throw new Error("Failed to update church")
      }

      toast.dismiss(loadingToast)
      toast.success(tChurch.toasts.updated, {
        duration: 3000,
        icon: '⛪'
      })

      if (onSave) {
        onSave(res.data)
      }

      onOpenChangeAction(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(tChurch.toasts.update_failed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (church) {
      const hasSpecialType = church.type === ChurchType.Plant || church.type === ChurchType.Company
      const contactData = (church as any).contact || {}
      
      setFormData({
        id: church.id,
        name: church.name,
        region_id: church.region_id || '',
        contactName: contactData?.name || '',
        phone: contactData?.phone || '',
        email: contactData?.email || '',
        city: contactData?.city || '',
        country: contactData?.country || institutionCountry,
        state: contactData?.state || '',
        type: (church.type || undefined) as any,
      })
      setIsSpecialChurch(hasSpecialType)
      setProvince(contactData?.state || '')
    }
    setErrors({})
    setCurrentStep(1)
    onOpenChangeAction(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        // Step 1: Basic Data
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
                selectedType={formData.type as ChurchType | null | undefined}
                onSpecialChurchChange={setIsSpecialChurch}
                onTypeChange={(type) => handleInputChange('type', type)}
                isLoading={isLoading}
                error={errors.type}
              />
            </div>
          </div>
        )

      case 2:
        // Step 2: Geographic Data
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
                provinceError={errors.province}
                cityError={errors.city}
              />

              <RegionSelector
                value={formData.region_id || ''}
                onChangeAction={(value: string) => handleInputChange('region_id', value)}
                regions={regions}
                isLoading={regionsLoading}
                error={errors.region_id}
                isOptional={true}
              />
            </div>
          </div>
        )

      case 3:
        // Step 3: Contact Data
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

  if (!church) return null

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChangeAction : undefined}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Home className="w-5 h-5 text-muted-foreground" />
            {tChurch.modals.edit.title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {tChurch.modals.edit.description}
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
                  className="text-muted-foreground text-xs"
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
                      {tChurch.buttons.updating}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      {tChurch.buttons.update_church}
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
