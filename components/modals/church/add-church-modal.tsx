"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Home, 
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
  Check
} from "lucide-react"
import toast from "react-hot-toast"

export interface ChurchData {
  id: string
  institution_id: string
  name: string
  region_id: string
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

export interface RegionData {
  id: string
  name: string
  institution_id: string
}

export interface AddChurchModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  regions: RegionData[]
  onSave?: (church: ChurchData) => void
}

export function AddChurchModal({
  isOpen,
  onOpenChange,
  institutionId,
  regions = [],
  onSave
}: AddChurchModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<ChurchData & { contact: Partial<ContactData> }>>({
    institution_id: institutionId,
    name: '',
    region_id: '',
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

  const totalSteps = 2

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution_id: institutionId,
        name: '',
        region_id: '',
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
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen, institutionId])

  const handleInputChange = (field: string, value: string | boolean) => {
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
        newErrors.name = t('churches.validation.name_required')
      } else if (formData.name.trim().length < 2) {
        newErrors.name = t('churches.validation.name_min_length')
      }

      if (!formData.region_id) {
        newErrors.region_id = t('churches.validation.region_required')
      }
    }

    if (step === 2) {
      if (formData.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
        newErrors['contact.email'] = t('churches.validation.email_invalid')
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
    if (!validateStep(1) || !validateStep(2)) {
      toast.error(t('churches.validation.please_fix_errors'))
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t('churches.toasts.creating'))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newChurch: ChurchData = {
        id: `church_${Date.now()}`,
        institution_id: institutionId,
        name: formData.name!.trim(),
        region_id: formData.region_id!,
        contact_id: null, // Will be set after contact creation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user',
        updated_by: 'current_user',
        is_deleted: false
      }

      toast.dismiss(loadingToast)
      toast.success(t('churches.toasts.created'), {
        duration: 3000,
        icon: '⛪'
      })

      if (onSave) {
        onSave(newChurch)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('churches.toasts.create_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      institution_id: institutionId,
      name: '',
      region_id: '',
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
    setErrors({})
    setCurrentStep(1)
    onOpenChange(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Church Preview */}
            <Card className="border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder-logo.svg" />
                    <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                      <Home className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg truncate">
                      {formData.name || t('churches.placeholders.name')}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {formData.region_id 
                        ? regions.find(r => r.id === formData.region_id)?.name || t('churches.placeholders.region')
                        : t('churches.placeholders.region')
                      }
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Building className="w-3 h-3 mr-1" />
                        {t('churches.labels.church')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date().getFullYear()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('churches.sections.basic_info')}
              </h5>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('churches.fields.name')} *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('churches.placeholders.name')}
                  disabled={isLoading}
                  className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region_id">
                  {t('churches.fields.region')} *
                </Label>
                <Select
                  value={formData.region_id || ''}
                  onValueChange={(value) => handleInputChange('region_id', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={`w-full ${errors.region_id ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={t('churches.placeholders.region')} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region_id && (
                  <p className="text-sm text-red-600">{errors.region_id}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Contact Preview */}
            <Card className="border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-lg bg-teal-100 text-teal-600">
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg truncate">
                      {formData.contact?.name || t('churches.placeholders.contact_name')}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {formData.contact?.email || t('churches.placeholders.contact_email')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <User className="w-3 h-3 mr-1" />
                        {t('churches.labels.contact')}
                      </Badge>
                      {formData.contact?.country && (
                        <Badge variant="outline" className="text-xs">
                          <Globe className="w-3 h-3 mr-1" />
                          {formData.contact.country}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('churches.sections.contact_info')}
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">
                    {t('churches.fields.contact_name')}
                  </Label>
                  <Input
                    id="contact_name"
                    value={formData.contact?.name || ''}
                    onChange={(e) => handleInputChange('contact.name', e.target.value)}
                    placeholder={t('churches.placeholders.contact_name')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    {t('churches.fields.contact_email')}
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder={t('churches.placeholders.contact_email')}
                    disabled={isLoading}
                    className={`w-full ${errors['contact.email'] ? 'border-red-500' : ''}`}
                  />
                  {errors['contact.email'] && (
                    <p className="text-sm text-red-600">{errors['contact.email']}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">
                    {t('churches.fields.contact_phone')}
                  </Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder={t('churches.placeholders.contact_phone')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_mobile">
                    {t('churches.fields.contact_mobile')}
                  </Label>
                  <Input
                    id="contact_mobile"
                    value={formData.contact?.mobile || ''}
                    onChange={(e) => handleInputChange('contact.mobile', e.target.value)}
                    placeholder={t('churches.placeholders.contact_mobile')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_country">
                    {t('churches.fields.contact_country')}
                  </Label>
                  <Input
                    id="contact_country"
                    value={formData.contact?.country || ''}
                    onChange={(e) => handleInputChange('contact.country', e.target.value)}
                    placeholder={t('churches.placeholders.contact_country')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_city">
                    {t('churches.fields.contact_city')}
                  </Label>
                  <Input
                    id="contact_city"
                    value={formData.contact?.city || ''}
                    onChange={(e) => handleInputChange('contact.city', e.target.value)}
                    placeholder={t('churches.placeholders.contact_city')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address">
                  {t('churches.fields.contact_address')}
                </Label>
                <Input
                  id="contact_address"
                  value={formData.contact?.address || ''}
                  onChange={(e) => handleInputChange('contact.address', e.target.value)}
                  placeholder={t('churches.placeholders.contact_address')}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_postal_code">
                    {t('churches.fields.contact_postal_code')}
                  </Label>
                  <Input
                    id="contact_postal_code"
                    value={formData.contact?.postal_code || ''}
                    onChange={(e) => handleInputChange('contact.postal_code', e.target.value)}
                    placeholder={t('churches.placeholders.contact_postal_code')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_website">
                    {t('churches.fields.contact_website')}
                  </Label>
                  <Input
                    id="contact_website"
                    type="url"
                    value={formData.contact?.website || ''}
                    onChange={(e) => handleInputChange('contact.website', e.target.value)}
                    placeholder={t('churches.placeholders.contact_website')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-blue-600" />
            {t('churches.modals.create.title')}
          </DialogTitle>
          <DialogDescription>
            {t('churches.modals.create.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('churches.steps.step')} {currentStep} {t('churches.steps.of')} {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  {t('churches.buttons.previous')}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>
            </div>

            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {t('churches.buttons.next')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? t('churches.creating') : t('common.save')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
