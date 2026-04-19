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
  Check,
  ChevronsUpDown
} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { contactTranslations } from "@/lib/translations/contact"
import { countries, states, cities } from "@/data/geographicData"

import type { MutationFunction, OperationVariables } from "@apollo/client"
import { Contact } from "@/types/graphql-global-types"

interface GeographicOption {
  value: string
  label: string
}

interface UserContactLike {
  id?: string | null
  name?: string | null
  phone?: string | null
  mobile?: string | null
  email?: string | null
  country?: string | null
  city?: string | null
  state?: string | null
  address?: string | null
  full_address?: string | null
  postal_code?: string | null
  website?: string | null
  notes?: string | null
  is_primary?: boolean | null
  created_at?: string | null
  updated_at?: string | null
  created_by?: string | null
  updated_by?: string | null
  is_deleted?: boolean | null
}

interface UserDataLike {
  id: string
  name?: string | null
  email?: string | null
  phone?: string | null
  mobile?: string | null
  country?: string | null
  city?: string | null
  state?: string | null
  address?: string | null
  full_address?: string | null
  postal_code?: string | null
  website?: string | null
  notes?: string | null
  created_at?: string | null
  updated_at?: string | null
  created_by?: string | null
  updated_by?: string | null
  is_deleted?: boolean | null
  contact?: UserContactLike | null
}


export interface ContactViewEditModalProps<TMutationData, TMutationVariables extends OperationVariables> {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  contact: Contact | null
  userData?: UserDataLike | null
  entityName?: string
  entityType?: string
  onSave?: (contact: TMutationData | undefined) => void
  readonly?: boolean
  updateMutation: MutationFunction<TMutationData, TMutationVariables>
  entityId: string
}

export function ContactViewEditModal<TMutationData, TMutationVariables extends OperationVariables>({
  isOpen,
  onOpenChange,
  contact,
  userData,
  entityName,
  entityType = "Entity",
  onSave,
  readonly = false,
  updateMutation,
  entityId
}: ContactViewEditModalProps<TMutationData, TMutationVariables>) {
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

  // States for geographic selectors
  const [openCountry, setOpenCountry] = useState(false)
  const [openState, setOpenState] = useState(false)
  const [openCity, setOpenCity] = useState(false)
  const [selectedState, setSelectedState] = useState("")

  const totalSteps = 3

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t_contact = contactTranslations[currentLanguage as keyof typeof contactTranslations] || contactTranslations.en

  const resolvedContactData = {
    id: userData?.contact?.id ?? contact?.id ?? userData?.id ?? "",
    name: userData?.name ?? userData?.contact?.name ?? contact?.name ?? "",
    phone: userData?.phone ?? userData?.contact?.phone ?? contact?.phone ?? "",
    mobile: userData?.mobile ?? userData?.contact?.mobile ?? contact?.mobile ?? "",
    email: userData?.email ?? userData?.contact?.email ?? contact?.email ?? "",
    country: userData?.country ?? userData?.contact?.country ?? contact?.country ?? "",
    city: userData?.city ?? userData?.contact?.city ?? contact?.city ?? "",
    state: userData?.state ?? userData?.contact?.state ?? "",
    address: userData?.address ?? userData?.contact?.address ?? contact?.address ?? "",
    full_address: userData?.full_address ?? userData?.contact?.full_address ?? contact?.full_address ?? "",
    postal_code: userData?.postal_code ?? userData?.contact?.postal_code ?? contact?.postal_code ?? "",
    website: userData?.website ?? userData?.contact?.website ?? contact?.website ?? "",
    notes: userData?.notes ?? userData?.contact?.notes ?? contact?.notes ?? "",
    is_primary: userData?.contact?.is_primary ?? contact?.is_primary ?? false,
    created_at: userData?.created_at ?? userData?.contact?.created_at ?? contact?.created_at ?? null,
    updated_at: userData?.updated_at ?? userData?.contact?.updated_at ?? contact?.updated_at ?? null,
    created_by: userData?.created_by ?? userData?.contact?.created_by ?? contact?.created_by ?? null,
    updated_by: userData?.updated_by ?? userData?.contact?.updated_by ?? contact?.updated_by ?? null,
    is_deleted: userData?.is_deleted ?? userData?.contact?.is_deleted ?? contact?.is_deleted ?? false,
  }
  const hasResolvedData = Boolean(contact || userData)

  // Geographic data options
  const countryOptions = countries.map(country => ({
    value: country.code,
    label: country.name
  }))

  // Get states for selected country
  const statesOptions = formData.country && states[formData.country as keyof typeof states] 
    ? states[formData.country as keyof typeof states].map((state: { code: string; name: string }): GeographicOption => ({
        value: state.code,
        label: state.name
      }))
    : []

  // Get cities for selected state
  const citiesOptions = selectedState && cities[selectedState as keyof typeof cities]
    ? cities[selectedState as keyof typeof cities].map((city: { code: string; name: string }): GeographicOption => ({
        value: city.code,
        label: city.name
      }))
    : []

  useEffect(() => {
    if (hasResolvedData) {
      setFormData({
        name: resolvedContactData.name || '',
        phone: resolvedContactData.phone || '',
        mobile: resolvedContactData.mobile || '',
        email: resolvedContactData.email || '',
        country: resolvedContactData.country || '',
        city: resolvedContactData.city || '',
        address: resolvedContactData.address || '',
        full_address: resolvedContactData.full_address || '',
        postal_code: resolvedContactData.postal_code || '',
        website: resolvedContactData.website || '',
        notes: resolvedContactData.notes || '',
        is_primary: resolvedContactData.is_primary || false
      })

      // Initialize selectedState based on existing data if available
      // Find state code from country and city combination
      if (resolvedContactData.country && resolvedContactData.city) {
        const countryStates = states[resolvedContactData.country as keyof typeof states]
        if (countryStates) {
          for (const state of countryStates) {
            const stateCities = cities[state.code as keyof typeof cities]
            if (stateCities && stateCities.some((city: { code: string; name: string }) => city.name === resolvedContactData.city)) {
              setSelectedState(state.code)
              break
            }
          }
        }
      }
    } else {
      // Inicializar com dados vazios para criar novo contato
      setFormData({
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
      })
      setSelectedState("")
    }
  }, [hasResolvedData, resolvedContactData.address, resolvedContactData.city, resolvedContactData.country, resolvedContactData.email, resolvedContactData.full_address, resolvedContactData.is_primary, resolvedContactData.mobile, resolvedContactData.name, resolvedContactData.notes, resolvedContactData.phone, resolvedContactData.postal_code, resolvedContactData.website])

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      // Se não há contato existente, iniciar no modo de edição
      setIsEditing(!hasResolvedData)
      setErrors({})
    }
  }, [hasResolvedData, isOpen])

  const handleInputChange = (field: keyof Contact, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Reset dependent fields when country changes
    if (field === 'country') {
      setSelectedState("")
      setFormData(prev => ({ ...prev, city: "" }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }

    // Re-validate current step
    validateStep(currentStep)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t_contact.validation?.emailInvalid || "Please enter a valid email address"
      }
    }

    if (step === 3) {
      // Website validation removed - no longer required
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(t_contact.validation?.fixErrors || "Please fix the errors before continuing")
      return
    }

    setIsLoading(true)
    const isCreating = !hasResolvedData
    const loadingMessage = isCreating ? (t_contact.creating || "Creating contact...") : (t_contact.updating || "Updating contact...")
    const loadingToast = toast.loading(loadingMessage)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updateData: TMutationVariables = {
        id: entityId,
        contactId: resolvedContactData.id || '',
        contact_id: resolvedContactData.id || '',
        ...formData,
      } as unknown as TMutationVariables
      const res = await updateMutation({ variables: updateData })
      if (!res) throw new Error(`Failed to ${isCreating ? 'create' : 'update'} contact`)
      
      const successMessage = isCreating ? (t_contact.created || "Contact created successfully!") : (t_contact.updated || "Contact updated successfully!")
      toast.success(successMessage, {
        duration: 3000
      })

      if (onSave) {
        onSave(res.data ?? undefined)
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
    if (hasResolvedData) {
      setFormData({
        name: resolvedContactData.name || '',
        phone: resolvedContactData.phone || '',
        mobile: resolvedContactData.mobile || '',
        email: resolvedContactData.email || '',
        country: resolvedContactData.country || '',
        city: resolvedContactData.city || '',
        address: resolvedContactData.address || '',
        full_address: resolvedContactData.full_address || '',
        postal_code: resolvedContactData.postal_code || '',
        website: resolvedContactData.website || '',
        notes: resolvedContactData.notes || '',
        is_primary: resolvedContactData.is_primary || false,
        id: resolvedContactData.id || undefined
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
              {renderCopyableField(resolvedContactData.name, 'name')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.email || "Email"}
              </Label>
              {renderCopyableField(resolvedContactData.email, 'email')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.phone || "Phone"}
              </Label>
              {renderCopyableField(resolvedContactData.phone, 'phone')}
            </div>
            
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                {t_contact.mobile || "Mobile"}
              </Label>
              {renderCopyableField(resolvedContactData.mobile, 'mobile')}
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
              {renderCopyableField(resolvedContactData.address, 'address')}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.city || "City"}
                </Label>
                {renderCopyableField(resolvedContactData.city, 'city')}
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.postalCode || "Postal Code"}
                </Label>
                {renderCopyableField(resolvedContactData.postal_code, 'postal_code')}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.fullAddress || "Full Address"}
                </Label>
                {renderCopyableField(resolvedContactData.full_address, 'full_address')}
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.country || "Country"}
                </Label>
                {renderCopyableField(resolvedContactData.country, 'country')}
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
                  {resolvedContactData.website ? (
                    <a
                      href={resolvedContactData.website.startsWith('http') ? resolvedContactData.website : `https://${resolvedContactData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {resolvedContactData.website}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500 italic">-</span>
                  )}
                </div>
                {resolvedContactData.website && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto ml-2"
                    onClick={() => copyToClipboard(resolvedContactData.website!, 'website')}
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
                    {resolvedContactData.notes || <span className="text-gray-500 italic">-</span>}
                  </p>
                </div>
                {resolvedContactData.notes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto ml-2"
                    onClick={() => copyToClipboard(resolvedContactData.notes!, 'notes')}
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
                  {resolvedContactData.created_at ? formatDate(resolvedContactData.created_at) : '-'}
                </p>
              </div>
              
              <div>
                <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  {t_contact.updatedAt || "Updated At"}
                </Label>
                <p className="text-sm text-gray-900 mt-1">
                  {resolvedContactData.updated_at ? formatDate(resolvedContactData.updated_at) : '-'}
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
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCountry}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal",
                        !formData.country && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {formData.country
                        ? countryOptions.find(country => country.value === formData.country)?.label
                        : (t_contact.countryPlaceholder || "Select country")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder={t_contact.searchCountries || "Search countries..."} />
                      <CommandList>
                        <CommandEmpty>{t_contact.noCountryFound || "No country found."}</CommandEmpty>
                        <CommandGroup>
                          {countryOptions.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.value}
                              onSelect={(currentValue) => {
                                handleInputChange('country', currentValue === formData.country ? "" : currentValue)
                                setOpenCountry(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.country === country.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {country.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* State/Province Selector */}
              {formData.country && statesOptions.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="state" className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    {t_contact.state || "State/Province"}
                  </Label>
                  <Popover open={openState} onOpenChange={setOpenState}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openState}
                        className={cn(
                          "w-full h-12 text-base justify-between font-normal",
                          !selectedState && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        {selectedState
                          ? statesOptions.find((state: GeographicOption) => state.value === selectedState)?.label
                          : (t_contact.selectState || "Select state/province")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder={t_contact.searchStates || "Search states..."} />
                        <CommandList>
                          <CommandEmpty>{t_contact.noStateFound || "No state found."}</CommandEmpty>
                          <CommandGroup>
                            {statesOptions.map((state: GeographicOption) => (
                              <CommandItem
                                key={state.value}
                                value={state.value}
                                onSelect={(currentValue) => {
                                  setSelectedState(currentValue === selectedState ? "" : currentValue)
                                  handleInputChange('city', "") // Reset city when state changes
                                  setOpenState(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedState === state.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {state.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="w-4 h-4 text-gray-500" />
                  {t_contact.city || "City"}
                </Label>
                {citiesOptions.length > 0 ? (
                  <Popover open={openCity} onOpenChange={setOpenCity}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCity}
                        className={cn(
                          "w-full h-12 text-base justify-between font-normal",
                          !formData.city && "text-muted-foreground"
                        )}
                        disabled={isLoading || !selectedState}
                      >
                        {formData.city
                          ? citiesOptions.find((city: GeographicOption) => city.value === formData.city)?.label ||
                            citiesOptions.find((city: GeographicOption) => city.label === formData.city)?.label ||
                            formData.city
                          : (t_contact.cityPlaceholder || "Select city")}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder={t_contact.searchCities || "Search cities..."} />
                        <CommandList>
                          <CommandEmpty>{t_contact.noCityFound || "No city found."}</CommandEmpty>
                          <CommandGroup>
                            {citiesOptions.map((city: GeographicOption) => (
                              <CommandItem
                                key={city.value}
                                value={city.value}
                                onSelect={(currentValue) => {
                                  const selectedCity = citiesOptions.find((c: GeographicOption) => c.value === currentValue)
                                  handleInputChange('city', selectedCity?.label || currentValue)
                                  setOpenCity(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    (formData.city === city.value || formData.city === city.label) ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {city.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder={t_contact.cityPlaceholder || "Enter city"}
                    disabled={isLoading}
                    className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                )}
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
                  type="text"
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
                    <p className="text-muted-foreground">{t_contact.createdAt || "Created At"}</p>
                    <p className="font-medium">{resolvedContactData.created_at ? formatDate(resolvedContactData.created_at) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t_contact.updatedAt || "Updated At"}</p>
                    <p className="font-medium">{resolvedContactData.updated_at ? formatDate(resolvedContactData.updated_at) : '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t_contact.createdBy || "Created By"}</p>
                    <p className="font-medium">{resolvedContactData.created_by || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t_contact.updatedBy || "Updated By"}</p>
                    <p className="font-medium">{resolvedContactData.updated_by || '-'}</p>
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg text-gray-900">
            <ContactRound className="w-5 h-5 text-gray-600" />
            {!hasResolvedData ? (t_contact.newContact || "Create New Contact") : (t_contact.title || "Contact Information")}
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
              <Badge variant={(resolvedContactData.is_primary || formData.is_primary) ? "default" : "secondary"} className="bg-gray-100 text-gray-800 border-gray-300">
                <ContactRound className="w-3 h-3 mr-1" />
                {(resolvedContactData.is_primary || formData.is_primary) ? (t_contact.primaryContact || "Primary") : (t_contact.secondaryContact || "Secondary")}
              </Badge>
              {resolvedContactData.is_deleted && (
                <Badge variant="destructive" className="bg-gray-800 text-white">{t_contact.deleted || "Deleted"}</Badge>
              )}
              {!hasResolvedData && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                  {t_contact.newContact || "New Contact"}
                </Badge>
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
                <span>{t_contact.stepOf?.replace('{{current}}', String(currentStep)).replace('{{total}}', String(totalSteps)) || `Step ${currentStep} of ${totalSteps}`}</span>
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