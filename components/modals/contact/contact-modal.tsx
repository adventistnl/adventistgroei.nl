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
import { Switch } from "@/components/ui/switch"
import { 
  ContactRound, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Edit, 
  Save, 
  X,
  User,
  Building,
  Calendar
} from "lucide-react"
import toast from "react-hot-toast"

export interface Contact {
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

export interface ContactModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  entityName?: string
  entityType?: 'institution' | 'user' | 'church' | 'department'
  onSave?: (contact: Contact) => void
  readonly?: boolean
}

export function ContactModal({
  isOpen,
  onOpenChange,
  contact,
  entityName,
  entityType = 'institution',
  onSave,
  readonly = false
}: ContactModalProps) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Contact>>({})

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        email: contact.email || '',
        country: contact.country || '',
        city: contact.city || '',
        address: contact.address || '',
        full_address: contact.full_address || '',
        postal_code: contact.postal_code || '',
        website: contact.website || '',
        notes: contact.notes || '',
        is_primary: contact.is_primary
      })
    }
  }, [contact])

  const handleInputChange = (field: keyof Contact, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    if (!contact) return

    setIsLoading(true)
    const loadingToast = toast.loading(t('contacts.toasts.updating'))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedContact: Contact = {
        ...contact,
        ...formData,
        updated_at: new Date().toISOString()
      }

      toast.dismiss(loadingToast)
      toast.success(t('contacts.toasts.updated'), {
        duration: 3000,
        icon: '✅'
      })

      if (onSave) {
        onSave(updatedContact)
      }

      setIsEditing(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('contacts.toasts.update_failed'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        phone: contact.phone || '',
        mobile: contact.mobile || '',
        email: contact.email || '',
        country: contact.country || '',
        city: contact.city || '',
        address: contact.address || '',
        full_address: contact.full_address || '',
        postal_code: contact.postal_code || '',
        website: contact.website || '',
        notes: contact.notes || '',
        is_primary: contact.is_primary
      })
    }
    setIsEditing(false)
  }

  const handleClose = () => {
    if (!isLoading) {
      setIsEditing(false)
      onOpenChange(false)
    }
  }

  if (!contact) return null

  const getEntityIcon = () => {
    switch (entityType) {
      case 'institution': return Building
      case 'user': return User
      case 'church': return Building
      case 'department': return Building
      default: return Building
    }
  }

  const EntityIcon = getEntityIcon()

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2">
            <ContactRound className="w-5 h-5 text-teal-600" />
            {t('contacts.modal.title')}
          </DialogTitle>
          <DialogDescription>
            {entityName && (
              <div className="flex items-center gap-2 text-sm">
                <EntityIcon className="w-4 h-4" />
                {t('contacts.modal.for_entity', { entity: entityName })}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Edit Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                <ContactRound className="w-3 h-3 mr-1" />
                {contact.is_primary ? t('contacts.primary') : t('contacts.secondary')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {t('contacts.created_at', { date: new Date(contact.created_at).toLocaleDateString() })}
              </Badge>
            </div>
            {!readonly && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                {t('common.edit')}
              </Button>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('contacts.sections.basic_info')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contacts.fields.name')}</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder={t('contacts.placeholders.name')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm">
                        {contact.name || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contacts.fields.email')}</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder={t('contacts.placeholders.email')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {contact.email || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('contacts.fields.phone')}</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder={t('contacts.placeholders.phone')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {contact.phone || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">{t('contacts.fields.mobile')}</Label>
                    {isEditing ? (
                      <Input
                        id="mobile"
                        value={formData.mobile || ''}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        placeholder={t('contacts.placeholders.mobile')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {contact.mobile || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">{t('contacts.fields.website')}</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder={t('contacts.placeholders.website')}
                      disabled={isLoading}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-2 bg-muted/30 rounded-md text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {contact.website ? (
                        <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {contact.website}
                        </a>
                      ) : (
                        t('contacts.empty_field')
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('contacts.sections.address')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">{t('contacts.fields.country')}</Label>
                    {isEditing ? (
                      <Input
                        id="country"
                        value={formData.country || ''}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        placeholder={t('contacts.placeholders.country')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm">
                        {contact.country || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">{t('contacts.fields.city')}</Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder={t('contacts.placeholders.city')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm">
                        {contact.city || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t('contacts.fields.address')}</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder={t('contacts.placeholders.address')}
                      disabled={isLoading}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-2 bg-muted/30 rounded-md text-sm">
                      {contact.address || t('contacts.empty_field')}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">{t('contacts.fields.postal_code')}</Label>
                    {isEditing ? (
                      <Input
                        id="postal_code"
                        value={formData.postal_code || ''}
                        onChange={(e) => handleInputChange('postal_code', e.target.value)}
                        placeholder={t('contacts.placeholders.postal_code')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm">
                        {contact.postal_code || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_address">{t('contacts.fields.full_address')}</Label>
                    {isEditing ? (
                      <Input
                        id="full_address"
                        value={formData.full_address || ''}
                        onChange={(e) => handleInputChange('full_address', e.target.value)}
                        placeholder={t('contacts.placeholders.full_address')}
                        disabled={isLoading}
                        className="w-full"
                      />
                    ) : (
                      <div className="p-2 bg-muted/30 rounded-md text-sm">
                        {contact.full_address || t('contacts.empty_field')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('contacts.sections.additional')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">{t('contacts.fields.notes')}</Label>
                  {isEditing ? (
                    <Textarea
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder={t('contacts.placeholders.notes')}
                      disabled={isLoading}
                      rows={3}
                      className="w-full"
                    />
                  ) : (
                    <div className="p-2 bg-muted/30 rounded-md text-sm min-h-[60px]">
                      {contact.notes || t('contacts.empty_field')}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_primary"
                      checked={formData.is_primary || false}
                      onCheckedChange={(checked) => handleInputChange('is_primary', checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="is_primary">{t('contacts.fields.is_primary')}</Label>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading} className="w-full sm:w-auto">
                  <X className="w-4 h-4 mr-2" />
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? t('contacts.saving') : t('common.save')}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
                {t('common.close')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
