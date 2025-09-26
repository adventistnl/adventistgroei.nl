"use client"

import React, { useState, useEffect } from "react"
import { useInstitution } from '@/contexts/institution-context'
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Building, Edit, Save, X, Globe, Calendar } from "lucide-react"
import toast from "react-hot-toast"

export interface Institution {
  id: string
  name: string
  denomination: string
  language_preference: "en" | "nl"
  contact_id?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface EditInstitutionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institution: Institution | null
  onSave?: (institution: Institution) => void
}

export function EditInstitutionModal({
  isOpen,
  onOpenChange,
  institution,
  onSave
}: EditInstitutionModalProps) {
  const { t } = useTranslation()
  const { updateInstitution, updateLoading, updateError, refetchInstitutions } = useInstitution()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Institution>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name,
        denomination: institution.denomination,
        language_preference: institution.language_preference
      })
      setErrors({})
    }
  }, [institution])

  const handleInputChange = (field: keyof Institution, value: string) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = t('institutions.validation.name_required')
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('institutions.validation.name_min_length')
    }

    if (!formData.denomination?.trim()) {
      newErrors.denomination = t('institutions.validation.denomination_required')
    }

    if (!formData.language_preference) {
      newErrors.language_preference = t('institutions.validation.language_required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!institution || !validateForm()) return

    setIsLoading(true)
    const loadingToast = toast.loading(t('institutions.toasts.updating'))

    try {
      const variables = {
        id: institution.id,
        name: formData.name?.trim(),
        denomination: formData.denomination?.trim(),
        language_preference: formData.language_preference,
      }
      const { data } = await updateInstitution({ variables })
      toast.dismiss(loadingToast)
      toast.success(t('institutions.toasts.updated'), {
        duration: 3000,
        icon: '✅'
      })
      refetchInstitutions()
      if (onSave && data?.updateInstitution) {
        onSave({ ...institution, ...formData, ...data.updateInstitution })
      }
      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('institutions.toasts.update_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (institution) {
      setFormData({
        name: institution.name,
        denomination: institution.denomination,
        language_preference: institution.language_preference
      })
    }
    setErrors({})
    onOpenChange(false)
  }

  if (!institution) return null

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            {t('institutions.modals.edit.title')}
          </DialogTitle>
          <DialogDescription>
            {t('institutions.modals.edit.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Institution Preview */}
          <Card className="border-muted">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder-logo.svg" />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {(formData.name || institution.name).split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg truncate">
                    {formData.name || institution.name}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {formData.denomination || institution.denomination}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {formData.language_preference === 'en' ? 'English' : formData.language_preference === 'nl' ? 'Nederlands' : 'Not set'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(institution.created_at).getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t('institutions.fields.name')}
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t('institutions.placeholders.name')}
                disabled={isLoading}
                className={`w-full ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="denomination">
                {t('institutions.fields.denomination')}
              </Label>
              <Input
                id="denomination"
                value={formData.denomination || ''}
                onChange={(e) => handleInputChange('denomination', e.target.value)}
                placeholder={t('institutions.placeholders.denomination')}
                disabled={isLoading}
                className={`w-full ${errors.denomination ? 'border-red-500' : ''}`}
              />
              {errors.denomination && (
                <p className="text-sm text-red-600">{errors.denomination}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language_preference">
                {t('institutions.fields.language_preference')}
              </Label>
              <Select
                value={formData.language_preference || ''}
                onValueChange={(value) => handleInputChange('language_preference', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={`w-full ${errors.language_preference ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={t('institutions.placeholders.language_preference')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="nl">Nederlands</SelectItem>
                </SelectContent>
              </Select>
              {errors.language_preference && (
                <p className="text-sm text-red-600">{errors.language_preference}</p>
              )}
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
              disabled={isLoading || updateLoading}
              className="w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {(isLoading || updateLoading) ? t('institutions.saving') : t('common.save')}
            </Button>
            {updateError && (
              <p className="text-sm text-red-600 mt-2">{t('institutions.toasts.update_failed')}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
