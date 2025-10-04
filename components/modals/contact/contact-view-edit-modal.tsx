"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Copy,
  Check
} from "lucide-react"
import toast from "react-hot-toast"
import { contactTranslations } from "@/lib/translations/contact"
import { useMutation } from "@apollo/client/react"

import type { OperationVariables } from "@apollo/client"
import { Contact } from "@/types/graphql-global-types"


export interface ContactViewEditModalProps<TMutationData, TMutationVariables extends OperationVariables> {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  entityName?: string
  entityType?: string
  onSave?: (contact: TMutationData | undefined) => void
  readonly?: boolean
  updateMutation: useMutation.MutationFunction<TMutationData, TMutationVariables>
  entityId: string
}

export function ContactViewEditModal<TMutationData, TMutationVariables extends OperationVariables>({
  isOpen,
  onOpenChange,
  contact,
  entityName,
  entityType = "Entity",
  onSave,
  readonly = false,
  updateMutation,
  entityId
}: ContactViewEditModalProps<TMutationData, TMutationVariables>) {
  console.log("contact", contact)
  console.log("entityId", entityId)
  
  const { i18n } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<Contact>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    basic: false,
    address: false,
    additional: false,
    system: false
  })

  const totalSteps = 3

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t_contact = contactTranslations[currentLanguage as keyof typeof contactTranslations] || contactTranslations.en

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
        is_primary: contact.is_primary || false
      })
    }
  }, [contact])

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setIsEditing(false)
      setErrors({})
    }
  }, [isOpen])

  const handleInputChange = (field: keyof Contact, value: string | boolean) => {
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
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t_contact.validation?.emailInvalid || "Please enter a valid email address"
      }
    }

    if (step === 3) {
      if (formData.website && formData.website.trim() && !formData.website.match(/^https?:\/\//)) {
        newErrors.website = t_contact.validation?.websiteInvalid || "Website must start with http:// or https://"
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
    if (!contact) return

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(t_contact.validation?.fixErrors || "Please fix the errors before continuing")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t_contact.updating || "Updating contact...")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updateData: TMutationVariables = {
        contactId: contact.id,
        id: entityId,
        ...formData,
      }
      const res = await updateMutation({ variables: updateData })
      if (!res) throw new Error("Failed to update contact")
      toast.success(t_contact.updated || "Contact updated successfully!", {
        duration: 3000,
        icon: '✅'
      })

      if (onSave) {
        onSave(res.data)
      }

      setIsEditing(false)
    } catch (error) {
      toast.error(t_contact.updateFailed || "Failed to update contact")
    } finally {
      toast.dismiss(loadingToast)
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
        is_primary: contact.is_primary || false,
        id: contact.id
      })
    }
    setErrors({})
    setIsEditing(false)
    setCurrentStep(1)
  }

  const handleClose = () => {
    if (!isLoading) {
      handleCancel()
      onOpenChange(false)
    }
  }

  const formatDate = (dateString: string) => {
    const locale = currentLanguage === 'pt' ? 'pt-BR' : currentLanguage === 'nl' ? 'nl-NL' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(t_contact.copied || "Copied to clipboard!", {
        duration: 2000,
        icon: '📋'
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      toast.error(t_contact.copyFailed || "Failed to copy")
    }
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const renderCopyableField = (value: string | null | undefined, fieldKey: string, placeholder?: string) => {
    if (isEditing) return null
    
    return (
      <div className="group relative py-2 text-sm flex items-center justify-between min-h-[32px]">
        <span className={value ? "text-gray-900" : "text-gray-400 italic"}>
          {value || placeholder || t_contact.notProvided || 'Not provided'}
        </span>
        {value && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(value, fieldKey)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 hover:bg-gray-100"
            title={t_contact.copyToClipboard || 'Copy to clipboard'}
          >
            {copiedField === fieldKey ? (
              <Check className="w-3 h-3 text-gray-600" />
            ) : (
              <Copy className="w-3 h-3 text-gray-500" />
            )}
          </Button>
        )}
      </div>
    )
  }

  const renderCollapsibleSection = (
    sectionKey: string,
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode
  ) => {
    const isCollapsed = collapsedSections[sectionKey]
    
    return (
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full group hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base font-medium text-gray-900">{title}</h3>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isCollapsed ? '-rotate-90' : ''
            }`}
          />
        </button>
        
        {!isCollapsed && (
          <div className="animate-in fade-in-0 duration-200 slide-in-from-top-1">
            {content}
          </div>
        )}
      </div>
    )
  }

  const renderViewMode = () => {
    return (
      <div className="space-y-8">
        {/* Basic Information Section */}
        {renderCollapsibleSection(
          'basic',
          <User className="w-4 h-4 text-gray-500" />,
          t_contact.basicInformation || "Basic Information",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.contactName || "Contact Name"}
              </Label>
              {renderCopyableField(contact?.name, 'name')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.email || "Email"}
              </Label>
              {renderCopyableField(contact?.email, 'email')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.phone || "Phone"}
              </Label>
              {renderCopyableField(contact?.phone, 'phone')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.mobile || "Mobile"}
              </Label>
              {renderCopyableField(contact?.mobile, 'mobile')}
            </div>
          </div>
        )}

        {/* Address Information Section */}
        {renderCollapsibleSection(
          'address',
          <MapPin className="w-4 h-4 text-gray-500" />,
          t_contact.addressInformation || "Address Information",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.address || "Address"}
              </Label>
              {renderCopyableField(contact?.address, 'address')}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.city || "City"}
                </Label>
                {renderCopyableField(contact?.city, 'city')}
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.postalCode || "Postal Code"}
                </Label>
                {renderCopyableField(contact?.postal_code, 'postal_code')}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.fullAddress || "Full Address"}
                </Label>
                {renderCopyableField(contact?.full_address, 'full_address')}
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.country || "Country"}
                </Label>
                {renderCopyableField(contact?.country, 'country')}
              </div>
            </div>
          </div>
        )}

        {/* Additional Information Section */}
        {renderCollapsibleSection(
          'additional',
          <Globe className="w-4 h-4 text-gray-500" />,
          t_contact.additionalInformation || "Additional Information",
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.website || "Website"}
              </Label>
              <div className="flex items-center justify-between group">
                <div className="flex-1 min-w-0">
                  {contact?.website ? (
                    <a
                      href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {contact.website}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500 italic">-</span>
                  )}
                </div>
                {contact?.website && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto ml-2"
                    onClick={() => copyToClipboard(contact.website!, 'website')}
                  >
                    {copiedField === 'website' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.notes || "Notes"}
              </Label>
              <div className="flex items-start justify-between group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">
                    {contact?.notes || <span className="text-gray-500 italic">-</span>}
                  </p>
                </div>
                {contact?.notes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto ml-2"
                    onClick={() => copyToClipboard(contact.notes!, 'notes')}
                  >
                    {copiedField === 'notes' ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* System Information Section */}
        {renderCollapsibleSection(
          'system',
          <Calendar className="w-4 h-4 text-gray-500" />,
          t_contact.systemInformation || "System Information",
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.createdAt || "Created At"}
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {contact ? formatDate(contact.created_at) : '-'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.updatedAt || "Updated At"}
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {contact ? formatDate(contact.updated_at) : '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t_contact.basicInformation || "Basic Information"}</h3>
              <p className="text-sm text-gray-600">{t_contact.basicInformationDesc || "Contact name, email, and phone details"}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4 text-gray-500" />
                  {t_contact.contactName || "Contact Name"}
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t_contact.contactNamePlaceholder || "Enter contact name"}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {t_contact.email || "Email"}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t_contact.emailPlaceholder || "contact@example.com"}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {t_contact.phone || "Phone"}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t_contact.phonePlaceholder || "+1 (555) 123-4567"}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-500" />
                  {t_contact.mobile || "Mobile"}
                </Label>
                <Input
                  id="mobile"
                  value={formData.mobile || ''}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder={t_contact.mobilePlaceholder || "+1 (555) 987-6543"}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t_contact.addressInformation || "Address Information"}</h3>
              <p className="text-sm text-gray-600">{t_contact.addressInformationDesc || "Location and postal details"}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-gray-500" />
                  {t_contact.country || "Country"}
                </Label>
                <Input
                  id="country"
                  value={formData.country || ''}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder={t_contact.countryPlaceholder || "Enter country"}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4 text-gray-500" />
                  {t_contact.city || "City"}
                </Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder={t_contact.cityPlaceholder || "Enter city"}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {t_contact.address || "Address"}
                </Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t_contact.addressPlaceholder || "Street address"}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code" className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {t_contact.postalCode || "Postal Code"}
                </Label>
                <Input
                  id="postal_code"
                  value={formData.postal_code || ''}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  placeholder={t_contact.postalCodePlaceholder || "12345"}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="full_address" className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {t_contact.fullAddress || "Full Address"}
                </Label>
                <Input
                  id="full_address"
                  value={formData.full_address || ''}
                  onChange={(e) => handleInputChange('full_address', e.target.value)}
                  placeholder={t_contact.fullAddressPlaceholder || "Complete address"}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{t_contact.additionalInformation || "Additional Information"}</h3>
              <p className="text-sm text-gray-600">{t_contact.additionalInformationDesc || "Website, notes, and preferences"}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4 text-gray-500" />
                  {t_contact.website || "Website"}
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder={t_contact.websitePlaceholder || "https://example.com"}
                  disabled={isLoading}
                  className={`h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 ${errors.website ? 'border-red-500' : ''}`}
                />
                {errors.website && (
                  <p className="text-sm text-red-600">{errors.website}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4 text-gray-500" />
                  {t_contact.notes || "Notes"}
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder={t_contact.notesPlaceholder || "Additional notes or comments..."}
                  disabled={isLoading}
                  rows={4}
                  className="text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_primary"
                  checked={formData.is_primary || false}
                  onCheckedChange={(checked) => handleInputChange('is_primary', checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="is_primary" className="text-sm text-gray-600">
                  {t_contact.isPrimary || "Primary Contact"}
                </Label>
              </div>

              {/* System Information (always visible) */}
              <div className="mt-8 pt-6 border-t space-y-4">
                <div className="text-center">
                  <h4 className="text-base font-medium text-foreground mb-4">
                    {t_contact.systemInformation || "System Information"}
                  </h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t_contact.created || "Created"}</p>
                    <p className="font-medium">{contact ? formatDate(contact.created_at) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t_contact.updatedAt || "Updated"}</p>
                    <p className="font-medium">{contact ? formatDate(contact.updated_at) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t_contact.createdBy || "Created By"}</p>
                    <p className="font-medium">{contact?.created_by || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t_contact.updatedBy || "Updated By"}</p>
                    <p className="font-medium">{contact?.updated_by || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!contact) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg text-gray-900">
            <ContactRound className="w-5 h-5 text-gray-600" />
            {t_contact.title || "Contact Information"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {entityName ? (
              `${entityType}: ${entityName}`
            ) : (
              t_contact.description || "View and manage contact details"
            )}
          </DialogDescription>
          
          {/* Contact Status and Edit Button */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Badge variant={contact.is_primary ? "default" : "secondary"} className="bg-gray-100 text-gray-800 border-gray-300">
                <ContactRound className="w-3 h-3 mr-1" />
                {contact.is_primary ? (t_contact.primaryContact || "Primary") : (t_contact.secondaryContact || "Secondary")}
              </Badge>
              {contact.is_deleted && (
                <Badge variant="destructive" className="bg-gray-800 text-white">{t_contact.deleted || "Deleted"}</Badge>
              )}
            </div>
            {!readonly && !isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                {t_contact.edit || "Edit"}
              </Button>
            )}
          </div>

          {/* Progress Bar - Only show when editing */}
          {isEditing && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
            </div>
          )}
        </DialogHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {isEditing ? renderStepContent() : renderViewMode()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {isEditing && currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {t_contact.previous || "Previous"}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={isEditing ? handleCancel : handleClose}
                disabled={isLoading}
                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <X className="w-3 h-3 mr-1" />
                {isEditing ? (t_contact.cancel || "Cancel") : (t_contact.close || "Close")}
              </Button>
            </div>

            <div className="flex gap-2">
              {isEditing && currentStep < totalSteps && (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {t_contact.next || "Next"}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              )}
              {isEditing && currentStep === totalSteps && (
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="min-w-[100px] text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Save className="w-3 h-3 mr-1" />
                  {isLoading ? (t_contact.saving || "Saving...") : (t_contact.save || "Save Changes")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}