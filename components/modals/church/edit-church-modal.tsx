"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Home, 
  Edit, 
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
  MapPin as MapPinIcon,
  FileText
} from "lucide-react"
import toast from "react-hot-toast"
import { churchTranslations } from "@/lib/translations/churches"
import { cn } from "@/lib/utils"
import { netherlandsProvinces } from "@/lib/netherlands-provinces"
import { ChurchType } from "@/types/graphql-global-types"
import { ChurchTypeSelector, getChurchTypeOptions } from "./church-type-selector"
import { ProvinceSelector } from "./province-selector"

export interface ChurchData {
  id: string
  institution_id: string
  name: string
  region_id: string
  contact_id?: string | null
  type?: ChurchType | null
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

export interface RegionData {
  id: string
  name: string
  institution_id: string
}

export interface EditChurchModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  church: ChurchData | null
  onSave?: (church: ChurchData) => void
}

export function EditChurchModal({
  isOpen,
  onOpenChange,
  church,
  onSave
}: EditChurchModalProps) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ChurchData & { contact: Partial<ContactData> }>>({
    region_id: '',
    name: '',
    type: null,
    contact: {
      name: '',
      phone: '',
      mobile: '',
      email: '',
      country: '',
      city: '',
      address: '',
      full_address: '',
      postal_code: '',
      website: '',
      notes: '',
      is_primary: true
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSpecialChurch, setIsSpecialChurch] = useState(false)

  const totalSteps = 3

  useEffect(() => {
    if (isOpen && church) {
      const hasSpecialType = church.type === ChurchType.Plant || church.type === ChurchType.Company
      
      setFormData({
        id: church.id,
        institution_id: church.institution_id,
        region_id: church.region_id,
        name: church.name,
        type: church.type || null,
        contact: {
          name: '',
          phone: '',
          mobile: '',
          email: '',
          country: '',
          city: '',
          address: '',
          full_address: '',
          postal_code: '',
          website: '',
          notes: '',
          is_primary: true
        }
      })
      setIsSpecialChurch(hasSpecialType)
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen, church])

  const handleInputChange = (field: string, value: string | number | boolean | null) => {
    if (field.startsWith('contact.')) {
      const contactField = field.replace('contact.', '')
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
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

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSkipContacts = () => {
    // Skip to review step (step 3)
    setCurrentStep(3)
  }

  const handleSave = async () => {
    if (!church || !validateStep(1) || !validateStep(3)) {
      toast.error(tChurch.validation.please_fix_errors)
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(tChurch.toasts.updating)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedChurch: ChurchData = {
        ...church,
        region_id: formData.region_id!,
        name: formData.name!.trim(),
        type: formData.type || null,
        updated_at: new Date().toISOString(),
        updated_by: 'current_user'
      }

      toast.dismiss(loadingToast)
      toast.success(tChurch.toasts.updated, {
        duration: 3000,
        icon: '⛪'
      })

      if (onSave) {
        onSave(updatedChurch)
      }

      onOpenChange(false)

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
      
      setFormData({
        id: church.id,
        institution_id: church.institution_id,
        region_id: church.region_id,
        name: church.name,
        type: church.type || null,
        contact: {
          name: '',
          phone: '',
          mobile: '',
          email: '',
          country: '',
          city: '',
          address: '',
          full_address: '',
          postal_code: '',
          website: '',
          notes: '',
          is_primary: true
        }
      })
      setIsSpecialChurch(hasSpecialType)
    }
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
                selectedType={formData.type}
                onSpecialChurchChange={setIsSpecialChurch}
                onTypeChange={(type) => handleInputChange('type', type)}
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
                  value={formData.contact?.name || ''}
                  onChange={(e) => handleInputChange('contact.name', e.target.value)}
                  placeholder={tChurch.placeholders.contact_name}
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {tChurch.fields.contact_email}
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact?.email || ''}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  placeholder={tChurch.placeholders.contact_email}
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {tChurch.fields.contact_phone}
                </Label>
                <Input
                  id="contact_phone"
                  value={formData.contact?.phone || ''}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder={tChurch.placeholders.contact_phone}
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_city" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {tChurch.fields.contact_city}
                </Label>
                <Input
                  id="contact_city"
                  value={formData.contact?.city || ''}
                  onChange={(e) => handleInputChange('contact.city', e.target.value)}
                  placeholder={tChurch.placeholders.contact_city}
                  disabled={isLoading}
                  className="h-10"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        // Step 3: Review
        const selectedProvince = netherlandsProvinces.find(p => p.code === formData.region_id)
        const churchTypeOptions = getChurchTypeOptions(currentLanguage)
        const selectedType = churchTypeOptions.find(t => t.value === formData.type)
        
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{tChurch.steps.step_3_title}</h3>
              <p className="text-sm text-muted-foreground">{tChurch.steps.step_3_description} {tChurch.steps.step_3_description_update}</p>
            </div>
            
            <div className="space-y-6 max-w-lg mx-auto">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{tChurch.sections.basic_info}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tChurch.fields.name}</span>
                    <span className="text-sm font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tChurch.fields.province}</span>
                    <span className="text-sm font-medium">{selectedProvince?.name}</span>
                  </div>
                  {isSpecialChurch && selectedType && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{tChurch.fields.church_type}</span>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          selectedType.color === 'green' && "bg-green-100 text-green-700",
                          selectedType.color === 'orange' && "bg-orange-100 text-orange-700"
                        )}
                      >
                        {selectedType.label}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              {(formData.contact?.name || formData.contact?.email || formData.contact?.phone || formData.contact?.city) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{tChurch.sections.contact_info}</h4>
                  <div className="space-y-2">
                    {formData.contact?.name && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_name}</span>
                        <span className="text-sm font-medium">{formData.contact.name}</span>
                      </div>
                    )}
                    {formData.contact?.email && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_email}</span>
                        <span className="text-sm font-medium">{formData.contact.email}</span>
                      </div>
                    )}
                    {formData.contact?.phone && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_phone}</span>
                        <span className="text-sm font-medium">{formData.contact.phone}</span>
                      </div>
                    )}
                    {formData.contact?.city && (
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{tChurch.fields.contact_city}</span>
                        <span className="text-sm font-medium">{formData.contact.city}</span>
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

  if (!church) return null

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
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
