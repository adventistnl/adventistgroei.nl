"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Plus, 
  Save, 
  X, 
  Globe, 
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  Home
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

export interface AddRegionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  parentRegions?: RegionData[]
  onSave?: (region: RegionData) => void
}

export function AddRegionModal({
  isOpen,
  onOpenChange,
  institutionId,
  parentRegions = [],
  onSave
}: AddRegionModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<RegionData & { contact: Partial<ContactData> }>>({
    institution_id: institutionId,
    name: '',
    parent_region_id: null,
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

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution_id: institutionId,
        name: '',
        parent_region_id: null,
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = t('regions.validation.name_required')
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('regions.validation.name_min_length')
    }

    if (formData.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors['contact.email'] = t('regions.validation.email_invalid')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    const loadingToast = toast.loading(t('regions.toasts.creating'))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newRegion: RegionData = {
        id: `region_${Date.now()}`,
        institution_id: institutionId,
        name: formData.name!.trim(),
        parent_region_id: formData.parent_region_id || null,
        contact_id: null, // Will be set after contact creation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user',
        updated_by: 'current_user',
        is_deleted: false
      }

      toast.dismiss(loadingToast)
      toast.success(t('regions.toasts.created'), {
        duration: 3000,
        icon: '🗺️'
      })

      if (onSave) {
        onSave(newRegion)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('regions.toasts.create_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      institution_id: institutionId,
      name: '',
      parent_region_id: null,
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
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            {t('regions.modals.create.title')}
          </DialogTitle>
          <DialogDescription>
            {t('regions.modals.create.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Region Preview */}
          <Card className="border-muted">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder-logo.svg" />
                  <AvatarFallback className="text-lg bg-green-100 text-green-600">
                    <MapPin className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg truncate">
                    {formData.name || t('regions.placeholders.name')}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {formData.parent_region_id 
                      ? parentRegions.find(r => r.id === formData.parent_region_id)?.name || t('regions.placeholders.parent_region')
                      : t('regions.placeholders.parent_region')
                    }
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {formData.contact?.country || t('regions.placeholders.country')}
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

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('regions.sections.basic_info')}
              </h5>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('regions.fields.name')} *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('regions.placeholders.name')}
                  disabled={isLoading}
                  className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent_region_id">
                  {t('regions.fields.parent_region')}
                </Label>
                <Select
                  value={formData.parent_region_id || ''}
                  onValueChange={(value) => handleInputChange('parent_region_id', value === 'none' ? null : value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('regions.placeholders.parent_region')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t('regions.placeholders.no_parent')}</SelectItem>
                    {parentRegions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('regions.sections.contact_info')}
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">
                    {t('regions.fields.contact_name')}
                  </Label>
                  <Input
                    id="contact_name"
                    value={formData.contact?.name || ''}
                    onChange={(e) => handleInputChange('contact.name', e.target.value)}
                    placeholder={t('regions.placeholders.contact_name')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    {t('regions.fields.contact_email')}
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder={t('regions.placeholders.contact_email')}
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
                    {t('regions.fields.contact_phone')}
                  </Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder={t('regions.placeholders.contact_phone')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_mobile">
                    {t('regions.fields.contact_mobile')}
                  </Label>
                  <Input
                    id="contact_mobile"
                    value={formData.contact?.mobile || ''}
                    onChange={(e) => handleInputChange('contact.mobile', e.target.value)}
                    placeholder={t('regions.placeholders.contact_mobile')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_country">
                    {t('regions.fields.contact_country')}
                  </Label>
                  <Input
                    id="contact_country"
                    value={formData.contact?.country || ''}
                    onChange={(e) => handleInputChange('contact.country', e.target.value)}
                    placeholder={t('regions.placeholders.contact_country')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_city">
                    {t('regions.fields.contact_city')}
                  </Label>
                  <Input
                    id="contact_city"
                    value={formData.contact?.city || ''}
                    onChange={(e) => handleInputChange('contact.city', e.target.value)}
                    placeholder={t('regions.placeholders.contact_city')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address">
                  {t('regions.fields.contact_address')}
                </Label>
                <Input
                  id="contact_address"
                  value={formData.contact?.address || ''}
                  onChange={(e) => handleInputChange('contact.address', e.target.value)}
                  placeholder={t('regions.placeholders.contact_address')}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_postal_code">
                    {t('regions.fields.contact_postal_code')}
                  </Label>
                  <Input
                    id="contact_postal_code"
                    value={formData.contact?.postal_code || ''}
                    onChange={(e) => handleInputChange('contact.postal_code', e.target.value)}
                    placeholder={t('regions.placeholders.contact_postal_code')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_website">
                    {t('regions.fields.contact_website')}
                  </Label>
                  <Input
                    id="contact_website"
                    type="url"
                    value={formData.contact?.website || ''}
                    onChange={(e) => handleInputChange('contact.website', e.target.value)}
                    placeholder={t('regions.placeholders.contact_website')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? t('regions.creating') : t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
