"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  MapPin as LocationIcon,
  Edit,
  Save,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import toast from "react-hot-toast"

export interface RegionData {
  id: string
  institution_id: string
  name: string
  parent_region_id?: string | null
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

export interface ParentRegionData {
  id: string
  name: string
  institution_id: string
}

export interface EditRegionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  region: RegionData
  parentRegions: ParentRegionData[]
  onSave: (region: RegionData) => void
}

export function EditRegionModal({
  isOpen,
  onOpenChange,
  region,
  parentRegions,
  onSave
}: EditRegionModalProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Form data
  const [formData, setFormData] = useState({
    name: region.name || '',
    parent_region_id: region.parent_region_id || '',
    contact: {
      name: '',
      email: '',
      phone: '',
      mobile: '',
      country: '',
      city: '',
      address: '',
      full_address: '',
      postal_code: '',
      website: '',
      notes: ''
    }
  })

  useEffect(() => {
    if (region) {
      setFormData({
        name: region.name || '',
        parent_region_id: region.parent_region_id || '',
        contact: {
          name: '',
          email: '',
          phone: '',
          mobile: '',
          country: '',
          city: '',
          address: '',
          full_address: '',
          postal_code: '',
          website: '',
          notes: ''
        }
      })
    }
  }, [region])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = t('regions.validation.name_required')
      } else if (formData.name.trim().length < 2) {
        newErrors.name = t('regions.validation.name_min_length')
      }
    }

    if (step === 2) {
      if (formData.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
        newErrors.email = t('regions.validation.email_invalid')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
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

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(2)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(1)
  }

  const handleSave = async () => {
    if (!validateStep(2)) {
      toast.error(t('regions.validation.please_fix_errors'))
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t('regions.toasts.updating'))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const updatedRegion: RegionData = {
        ...region,
        name: formData.name.trim(),
        parent_region_id: formData.parent_region_id || null,
        updated_at: new Date().toISOString(),
        updated_by: 'current_user'
      }

      toast.dismiss(loadingToast)
      toast.success(t('regions.toasts.updated'), {
        duration: 3000,
        icon: '✅'
      })

      onSave(updatedRegion)
      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('regions.toasts.update_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setCurrentStep(1)
      setErrors({})
      onOpenChange(false)
    }
  }

  const progress = (currentStep / 2) * 100

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            {t('regions.modals.edit.title')}
          </DialogTitle>
          <DialogDescription>
            {t('regions.modals.edit.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t('regions.steps.step')} {currentStep} {t('regions.steps.of')} 2
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('regions.sections.basic_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('regions.fields.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('regions.placeholders.name')}
                    disabled={isLoading}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent_region">{t('regions.fields.parent_region')}</Label>
                  <Select
                    value={formData.parent_region_id}
                    onValueChange={(value) => handleInputChange('parent_region_id', value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('regions.placeholders.parent_region')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t('regions.placeholders.no_parent')}</SelectItem>
                      {parentRegions
                        .filter(parent => parent.id !== region.id) // Don't allow self as parent
                        .map((parent) => (
                          <SelectItem key={parent.id} value={parent.id}>
                            {parent.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Live Preview */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {t('regions.labels.region')} Preview
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{formData.name || t('regions.placeholders.name')}</span>
                    </div>
                    {formData.parent_region_id && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-xs">Parent:</span>
                        <span className="text-xs">
                          {parentRegions.find(p => p.id === formData.parent_region_id)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('regions.sections.contact_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">{t('regions.fields.contact_name')}</Label>
                    <Input
                      id="contact_name"
                      value={formData.contact.name}
                      onChange={(e) => handleInputChange('contact.name', e.target.value)}
                      placeholder={t('regions.placeholders.contact_name')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_email">{t('regions.fields.contact_email')}</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact.email}
                      onChange={(e) => handleInputChange('contact.email', e.target.value)}
                      placeholder={t('regions.placeholders.contact_email')}
                      disabled={isLoading}
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">{t('regions.fields.contact_phone')}</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact.phone}
                      onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                      placeholder={t('regions.placeholders.contact_phone')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_mobile">{t('regions.fields.contact_mobile')}</Label>
                    <Input
                      id="contact_mobile"
                      value={formData.contact.mobile}
                      onChange={(e) => handleInputChange('contact.mobile', e.target.value)}
                      placeholder={t('regions.placeholders.contact_mobile')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_country">{t('regions.fields.contact_country')}</Label>
                    <Input
                      id="contact_country"
                      value={formData.contact.country}
                      onChange={(e) => handleInputChange('contact.country', e.target.value)}
                      placeholder={t('regions.placeholders.contact_country')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_city">{t('regions.fields.contact_city')}</Label>
                    <Input
                      id="contact_city"
                      value={formData.contact.city}
                      onChange={(e) => handleInputChange('contact.city', e.target.value)}
                      placeholder={t('regions.placeholders.contact_city')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_address">{t('regions.fields.contact_address')}</Label>
                  <Input
                    id="contact_address"
                    value={formData.contact.address}
                    onChange={(e) => handleInputChange('contact.address', e.target.value)}
                    placeholder={t('regions.placeholders.contact_address')}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_postal_code">{t('regions.fields.contact_postal_code')}</Label>
                    <Input
                      id="contact_postal_code"
                      value={formData.contact.postal_code}
                      onChange={(e) => handleInputChange('contact.postal_code', e.target.value)}
                      placeholder={t('regions.placeholders.contact_postal_code')}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_website">{t('regions.fields.contact_website')}</Label>
                    <Input
                      id="contact_website"
                      type="url"
                      value={formData.contact.website}
                      onChange={(e) => handleInputChange('contact.website', e.target.value)}
                      placeholder={t('regions.placeholders.contact_website')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Contact Preview */}
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {t('regions.labels.contact')} Preview
                  </h4>
                  <div className="space-y-1 text-sm">
                    {formData.contact.name && (
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3 text-muted-foreground" />
                        <span>{formData.contact.name}</span>
                      </div>
                    )}
                    {formData.contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        <span>{formData.contact.email}</span>
                      </div>
                    )}
                    {formData.contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        <span>{formData.contact.phone}</span>
                      </div>
                    )}
                    {formData.contact.country && formData.contact.city && (
                      <div className="flex items-center gap-2">
                        <LocationIcon className="w-3 h-3 text-muted-foreground" />
                        <span>{formData.contact.city}, {formData.contact.country}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handlePrevious} disabled={isLoading} className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t('regions.buttons.previous')}
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} disabled={isLoading} className="w-full sm:w-auto">
                <X className="w-4 h-4 mr-2" />
                {t('common.cancel')}
              </Button>

              {currentStep < 2 ? (
                <Button onClick={handleNext} disabled={isLoading} className="w-full sm:w-auto">
                  {t('regions.buttons.next')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? t('regions.updating') : t('common.save')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
