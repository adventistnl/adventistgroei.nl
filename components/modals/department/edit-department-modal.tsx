"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Layers, 
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
  Home,
  DollarSign
} from "lucide-react"
import toast from "react-hot-toast"

export interface DepartmentData {
  id: string
  institution_id: string
  church_id: string
  name: string
  description: string
  annual_budget: number
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
  institution_id: string
}

export interface EditDepartmentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  department: DepartmentData | null
  churches: ChurchData[]
  onSave?: (department: DepartmentData) => void
}

export function EditDepartmentModal({
  isOpen,
  onOpenChange,
  department,
  churches = [],
  onSave
}: EditDepartmentModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<DepartmentData & { contact: Partial<ContactData> }>>({
    church_id: '',
    name: '',
    description: '',
    annual_budget: 0,
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
    if (isOpen && department) {
      setFormData({
        id: department.id,
        institution_id: department.institution_id,
        church_id: department.church_id,
        name: department.name,
        description: department.description,
        annual_budget: department.annual_budget,
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
  }, [isOpen, department])

  const handleInputChange = (field: string, value: string | number | boolean) => {
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
        newErrors.name = t('departments.validation.name_required')
      } else if (formData.name.trim().length < 2) {
        newErrors.name = t('departments.validation.name_min_length')
      }

      if (!formData.church_id) {
        newErrors.church_id = t('departments.validation.church_required')
      }

      if (!formData.description?.trim()) {
        newErrors.description = t('departments.validation.description_required')
      } else if (formData.description.trim().length < 10) {
        newErrors.description = t('departments.validation.description_min_length')
      }

      if (!formData.annual_budget || formData.annual_budget <= 0) {
        newErrors.annual_budget = t('departments.validation.budget_required')
      }
    }

    if (step === 2) {
      if (formData.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
        newErrors['contact.email'] = t('departments.validation.email_invalid')
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
    if (!department || !validateStep(1) || !validateStep(2)) {
      toast.error(t('departments.validation.please_fix_errors'))
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t('departments.toasts.updating'))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedDepartment: DepartmentData = {
        ...department,
        church_id: formData.church_id!,
        name: formData.name!.trim(),
        description: formData.description!.trim(),
        annual_budget: formData.annual_budget!,
        updated_at: new Date().toISOString(),
        updated_by: 'current_user'
      }

      toast.dismiss(loadingToast)
      toast.success(t('departments.toasts.updated'), {
        duration: 3000,
        icon: '🏢'
      })

      if (onSave) {
        onSave(updatedDepartment)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('departments.toasts.update_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (department) {
      setFormData({
        id: department.id,
        institution_id: department.institution_id,
        church_id: department.church_id,
        name: department.name,
        description: department.description,
        annual_budget: department.annual_budget,
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
    }
    setErrors({})
    setCurrentStep(1)
    onOpenChange(false)
  }

  const selectedChurch = churches.find(church => church.id === formData.church_id)

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Department Preview */}
            <Card className="border-muted">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder-logo.svg" />
                    <AvatarFallback className="text-lg bg-emerald-100 text-emerald-600">
                      <Layers className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg truncate">
                      {formData.name || t('departments.placeholders.name')}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {selectedChurch?.name || t('departments.placeholders.church')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Layers className="w-3 h-3 mr-1" />
                        {t('departments.labels.department')}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${formData.annual_budget ? formData.annual_budget.toLocaleString() : '0'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                {t('departments.sections.basic_info')}
              </h5>
              
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('departments.fields.name')} *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('departments.placeholders.name')}
                  disabled={isLoading}
                  className={`w-full ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="church_id">
                  {t('departments.fields.church')} *
                </Label>
                <Select
                  value={formData.church_id || ''}
                  onValueChange={(value) => handleInputChange('church_id', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={`w-full ${errors.church_id ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={t('departments.placeholders.church')} />
                  </SelectTrigger>
                  <SelectContent>
                    {churches.map((church) => (
                      <SelectItem key={church.id} value={church.id}>
                        {church.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.church_id && (
                  <p className="text-sm text-red-600">{errors.church_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  {t('departments.fields.description')} *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('departments.placeholders.description')}
                  disabled={isLoading}
                  className={`w-full min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_budget">
                  {t('departments.fields.annual_budget')} *
                </Label>
                <Input
                  id="annual_budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.annual_budget || ''}
                  onChange={(e) => handleInputChange('annual_budget', parseFloat(e.target.value) || 0)}
                  placeholder={t('departments.placeholders.annual_budget')}
                  disabled={isLoading}
                  className={`w-full ${errors.annual_budget ? 'border-red-500' : ''}`}
                />
                {errors.annual_budget && (
                  <p className="text-sm text-red-600">{errors.annual_budget}</p>
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
                      {formData.contact?.name || t('departments.placeholders.contact_name')}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {formData.contact?.email || t('departments.placeholders.contact_email')}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <User className="w-3 h-3 mr-1" />
                        {t('departments.labels.contact')}
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
                {t('departments.sections.contact_info')}
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">
                    {t('departments.fields.contact_name')}
                  </Label>
                  <Input
                    id="contact_name"
                    value={formData.contact?.name || ''}
                    onChange={(e) => handleInputChange('contact.name', e.target.value)}
                    placeholder={t('departments.placeholders.contact_name')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">
                    {t('departments.fields.contact_email')}
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact?.email || ''}
                    onChange={(e) => handleInputChange('contact.email', e.target.value)}
                    placeholder={t('departments.placeholders.contact_email')}
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
                    {t('departments.fields.contact_phone')}
                  </Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact?.phone || ''}
                    onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                    placeholder={t('departments.placeholders.contact_phone')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_mobile">
                    {t('departments.fields.contact_mobile')}
                  </Label>
                  <Input
                    id="contact_mobile"
                    value={formData.contact?.mobile || ''}
                    onChange={(e) => handleInputChange('contact.mobile', e.target.value)}
                    placeholder={t('departments.placeholders.contact_mobile')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_country">
                    {t('departments.fields.contact_country')}
                  </Label>
                  <Input
                    id="contact_country"
                    value={formData.contact?.country || ''}
                    onChange={(e) => handleInputChange('contact.country', e.target.value)}
                    placeholder={t('departments.placeholders.contact_country')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_city">
                    {t('departments.fields.contact_city')}
                  </Label>
                  <Input
                    id="contact_city"
                    value={formData.contact?.city || ''}
                    onChange={(e) => handleInputChange('contact.city', e.target.value)}
                    placeholder={t('departments.placeholders.contact_city')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_address">
                  {t('departments.fields.contact_address')}
                </Label>
                <Input
                  id="contact_address"
                  value={formData.contact?.address || ''}
                  onChange={(e) => handleInputChange('contact.address', e.target.value)}
                  placeholder={t('departments.placeholders.contact_address')}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_postal_code">
                    {t('departments.fields.contact_postal_code')}
                  </Label>
                  <Input
                    id="contact_postal_code"
                    value={formData.contact?.postal_code || ''}
                    onChange={(e) => handleInputChange('contact.postal_code', e.target.value)}
                    placeholder={t('departments.placeholders.contact_postal_code')}
                    disabled={isLoading}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_website">
                    {t('departments.fields.contact_website')}
                  </Label>
                  <Input
                    id="contact_website"
                    type="url"
                    value={formData.contact?.website || ''}
                    onChange={(e) => handleInputChange('contact.website', e.target.value)}
                    placeholder={t('departments.placeholders.contact_website')}
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

  if (!department) return null

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            {t('departments.modals.edit.title')}
          </DialogTitle>
          <DialogDescription>
            {t('departments.modals.edit.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t('departments.steps.step')} {currentStep} {t('departments.steps.of')} {totalSteps}</span>
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
                  {t('departments.buttons.previous')}
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
                  {t('departments.buttons.next')}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? t('departments.updating') : t('common.save')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
