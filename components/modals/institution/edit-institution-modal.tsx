"use client"

import React, { useState, useEffect } from "react"
import { useInstitution } from '@/contexts/institution-context'
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Building2, 
  Save, 
  Globe, 
  Mail,
  Phone,
  FileText,
  Check,
  ChevronsUpDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { institutionTranslations } from "@/lib/translations/institutions"
import { UpdateInstitutionVariables } from "@/types/UpdateInstitution"
import { Institution } from "@/types/graphql-global-types"
import { countries, states, cities } from "@/data/geographicData"

// export interface Institution {
//   id: string
//   name: string
//   denomination: string
//   language_preference: "en" | "nl"
//   country?: string
//   email?: string
//   phone?: string
//   website?: string
//   description?: string
//   contact_id?: string | null
//   created_at: string
//   updated_at: string
//   created_by: string
//   updated_by: string
//   is_deleted: boolean
//   deleted_at?: string | null
//   deleted_by?: string | null
// }

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
  const { i18n } = useTranslation()
  const { updateInstitution, updateLoading, updateError, refetchInstitutions } = useInstitution()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<UpdateInstitutionVariables>({
    id: institution?.id || "",
    name: institution?.name || "",
    denomination: institution?.denomination || "",
    language_preference: institution?.language_preference || "en",
    country: institution?.contact?.country || "",
    state: institution?.contact?.state || "",
    city: institution?.contact?.city || "",
    email: institution?.contact?.email || "",
    phone: institution?.contact?.phone || "",
    website: institution?.contact?.website || "",
    description: institution?.description || "",
    contactId: institution?.contact?.id || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // States for command popovers
  const [openCountry, setOpenCountry] = useState(false)
  const [openLanguage, setOpenLanguage] = useState(false)
  const [openState, setOpenState] = useState(false)
  const [openCity, setOpenCity] = useState(false)
  
  // Additional form data for state and city
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  
  // Get translations for current language
  const t_institution = institutionTranslations[i18n.language as keyof typeof institutionTranslations] || institutionTranslations.en

  // Define options for comboboxes
  const countriesOptions = countries.map(country => ({
    value: country.code,
    label: country.name
  }))

  // Get states/provinces for selected country
  const statesOptions = formData.country && states[formData.country as keyof typeof states] 
    ? states[formData.country as keyof typeof states].map(state => ({
        value: state.code,
        label: state.name
      }))
    : []

  // Get cities for selected state
  const citiesOptions = selectedState && cities[selectedState as keyof typeof cities]
    ? cities[selectedState as keyof typeof cities].map(city => ({
        value: city.code,
        label: city.name
      }))
    : []

  const languages = [
    { value: "en", label: t_institution.languages.en },
    { value: "nl", label: t_institution.languages.nl },
  ]

  useEffect(() => {
    if (institution) {
      const institutionState = institution.contact?.state || ""
      const institutionCity = institution.contact?.city || ""
      
      setFormData({
        id: institution.id,
        name: institution.name,
        language_preference: institution.language_preference,
        denomination: institution.denomination,
        country: institution.contact?.country || "",
        state: institutionState,
        city: institutionCity,
        email: institution.contact?.email || "",
        phone: institution.contact?.phone || "",
        website: institution.contact?.website || "",
        description: institution.description || "",
        contactId: institution.contact?.id || "",
      })
      
      // Set additional geographic fields from existing data
      setSelectedState(institutionState)
      setSelectedCity(institutionCity)
      setErrors({})
    }
  }, [institution])

  const handleInputChange = (field: keyof UpdateInstitutionVariables, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Reset state and city when country changes
    if (field === 'country') {
      setSelectedState("")
      setSelectedCity("")
      setFormData(prev => ({ ...prev, state: "", city: "" }))
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

    // Apenas validações de formato, sem campos obrigatórios
    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t_institution.validation.emailInvalid
    }

    if (formData.website && formData.website.trim() && !formData.website.match(/^https?:\/\//)) {
      newErrors.website = t_institution.validation.websiteInvalid
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!institution || !validateForm()) {
      toast.error(t_institution.validation.fixErrors)
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("🏢 Updating institution...")

    try {
      const variables = {
        id: institution.id,
        name: formData.name?.trim(),
        denomination: formData.denomination?.trim(),
        country: formData.country?.trim(),
        state: formData.state?.trim() || null,
        city: formData.city?.trim() || null,
        language_preference: formData.language_preference,
        email: formData.email?.trim() || null,
        phone: formData.phone?.trim() || null,
        website: formData.website?.trim() || null,
        description: formData.description?.trim() || null,
        contactId: institution.contact?.id || "",
      }
      const { data } = await updateInstitution({ variables })
      toast.dismiss(loadingToast)
      toast.success(`✅ Institution "${formData.name}" updated successfully!`, {
        duration: 3000
      })
      refetchInstitutions()
      if (onSave && data?.updateInstitution) {
        // Merge existing institution, form values and server response.
        // Ensure non-nullable fields expected by the Institution type are defined.
        const merged = { ...institution, ...formData, ...data.updateInstitution }

        // Ensure required string fields are not null (adjust defaults as appropriate)
        if (merged.denomination == null) merged.denomination = ""
        if (merged.name == null) merged.name = ""
        if (merged.language_preference == null) merged.language_preference = "en"

        onSave(merged as Institution)
      }
      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("❌ Failed to update institution")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (institution) {
      const institutionState = institution.contact?.state || ""
      const institutionCity = institution.contact?.city || ""
      
      setFormData({
        id: institution.id,
        name: institution.name,
        denomination: institution.denomination,
        language_preference: institution.language_preference,
        country: institution.contact?.country || "",
        state: institutionState,
        city: institutionCity,
        email: institution.contact?.email || "",
        phone: institution.contact?.phone || "",
        website: institution.contact?.website || "",
        description: institution.description || "",
        contactId: institution.contact?.id || "",
      })
      
      // Reset additional geographic fields to original values
      setSelectedState(institutionState)
      setSelectedCity(institutionCity)
    }
    
    setErrors({})
    onOpenChange(false)
  }

  const renderFormContent = () => {
    return (
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-foreground">{t_institution.basicInformation}</h3>
            <p className="text-sm text-muted-foreground">{t_institution.basicInformationDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {t_institution.institutionName}
              </Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={t_institution.institutionNamePlaceholder}
                disabled={isLoading}
                className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="denomination" className="flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                {t_institution.denomination}
              </Label>
              <Input
                id="denomination"
                value={formData.denomination || ''}
                onChange={(e) => handleInputChange('denomination', e.target.value)}
                placeholder={t_institution.denominationPlaceholder}
                disabled={isLoading}
                className={`h-12 text-base ${errors.denomination ? 'border-red-500' : ''}`}
              />
              {errors.denomination && (
                <p className="text-sm text-red-600">{errors.denomination}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {t_institution.country}
              </Label>
              <Popover open={openCountry} onOpenChange={setOpenCountry}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCountry}
                    className={cn(
                      "w-full h-12 text-base justify-between font-normal",
                      !formData.country && "text-muted-foreground",
                      errors.country && "border-red-500"
                    )}
                    disabled={isLoading}
                  >
                    {formData.country
                      ? countriesOptions.find(country => country.value === formData.country)?.label
                      : t_institution.countryPlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t_institution.searchCountry} />
                    <CommandList>
                      <CommandEmpty>{t_institution.noCountryFound}</CommandEmpty>
                      <CommandGroup>
                        {countriesOptions.map((country) => (
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
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            {country.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.country && (
                <p className="text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* State/Province field - only show if country is selected and has states */}
            {formData.country && statesOptions.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="state" className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Province/State
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
                        ? statesOptions.find(state => state.value === selectedState)?.label
                        : "Select province..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search province..." />
                      <CommandList>
                        <CommandEmpty>No province found.</CommandEmpty>
                        <CommandGroup>
                          {statesOptions.map((state) => (
                            <CommandItem
                              key={state.value}
                              value={state.value}
                              onSelect={(currentValue) => {
                                const newState = currentValue === selectedState ? "" : currentValue
                                setSelectedState(newState)
                                setSelectedCity("") // Reset city when state changes
                                setFormData(prev => ({ ...prev, state: newState, city: "" }))
                                setOpenState(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedState === state.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
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

            {/* City field - only show if state is selected and has cities */}
            {selectedState && citiesOptions.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  City
                </Label>
                <Popover open={openCity} onOpenChange={setOpenCity}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCity}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal",
                        !selectedCity && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {selectedCity
                        ? citiesOptions.find(city => city.value === selectedCity)?.label
                        : "Select city..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search city..." />
                      <CommandList>
                        <CommandEmpty>No city found.</CommandEmpty>
                        <CommandGroup>
                          {citiesOptions.map((city) => (
                            <CommandItem
                              key={city.value}
                              value={city.value}
                              onSelect={(currentValue) => {
                                const newCity = currentValue === selectedCity ? "" : currentValue
                                setSelectedCity(newCity)
                                setFormData(prev => ({ ...prev, city: newCity }))
                                setOpenCity(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCity === city.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                              {city.label}
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
              <Label htmlFor="language_preference" className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {t_institution.languagePreference}
              </Label>
              <Popover open={openLanguage} onOpenChange={setOpenLanguage}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openLanguage}
                    className={cn(
                      "w-full h-12 text-base justify-between font-normal",
                      !formData.language_preference && "text-muted-foreground",
                      errors.language_preference && "border-red-500"
                    )}
                    disabled={isLoading}
                  >
                    {formData.language_preference
                      ? languages.find(lang => lang.value === formData.language_preference)?.label
                      : t_institution.languagePreferencePlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t_institution.searchLanguage} />
                    <CommandList>
                      <CommandEmpty>{t_institution.noLanguageFound}</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            key={language.value}
                            value={language.value}
                            onSelect={(currentValue) => {
                              setFormData(prev => ({ ...prev, language_preference: currentValue as any }))
                              setOpenLanguage(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.language_preference === language.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.language_preference && (
                <p className="text-sm text-red-600">{errors.language_preference}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-foreground">{t_institution.contactInformation}</h3>
            <p className="text-sm text-muted-foreground">{t_institution.contactInformationDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {t_institution.contactEmail}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={t_institution.contactEmailPlaceholder}
                disabled={isLoading}
                className={`h-12 text-base ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {t_institution.phone}
              </Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={t_institution.phonePlaceholder}
                disabled={isLoading}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website" className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {t_institution.website}
              </Label>
              <Input
                id="website"
                value={formData.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder={t_institution.websitePlaceholder}
                disabled={isLoading}
                className={`h-12 text-base ${errors.website ? 'border-red-500' : ''}`}
              />
              {errors.website && (
                <p className="text-sm text-red-600">{errors.website}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-foreground">{t_institution.additionalDetails}</h3>
            <p className="text-sm text-muted-foreground">{t_institution.additionalDetailsDesc}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground" />
              {t_institution.description}
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder={t_institution.descriptionPlaceholder}
              disabled={isLoading}
              className="min-h-[120px] text-base resize-none"
              rows={5}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!institution) return null

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            Edit Institution
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update institution information and settings
          </DialogDescription>
        </DialogHeader>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {renderFormContent()}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              disabled={isLoading}
              size="sm"
              className="text-xs"
            >
              {t_institution.cancel}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading || updateLoading}
              size="sm"
              className="min-w-[120px] text-xs bg-gray-900 hover:bg-gray-800 text-white"
            >
              {(isLoading || updateLoading) ? (
                <>
                  <Save className="w-3 h-3 animate-spin mr-1" />
                  {t_institution.creating}
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 mr-1" />
                  Update Institution
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
