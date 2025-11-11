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
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Building2, 
  Save, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  FileText,
  Check,
  ChevronsUpDown,
  Home,
  Flag,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { institutionTranslations } from "@/lib/translations/institutions"
import { UpdateInstitutionVariables } from "@/types/UpdateInstitution"
import { Institution } from "@/types/graphql-global-types"
import { countries, states, cities } from "@/data/geographicData"

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
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
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
  
  // Additional form data for state and city
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  
  // Get translations for current language
  const t_institution = institutionTranslations[i18n.language as keyof typeof institutionTranslations] || institutionTranslations.en

  // Get states/provinces for selected country
  const statesOptions = formData.country && states[formData.country as keyof typeof states] 
    ? states[formData.country as keyof typeof states].map(state => ({
        value: state.code,
        label: state.name
      }))
    : []

  // Get cities for selected state
  const citiesOptions = formData.state && cities[formData.state as keyof typeof cities]
    ? cities[formData.state as keyof typeof cities].map(city => ({
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
      const institutionCountry = institution.contact?.country || ""
      const institutionState = institution.contact?.state || ""
      const institutionCity = institution.contact?.city || ""
      
      setFormData({
        id: institution.id,
        name: institution.name,
        language_preference: institution.language_preference,
        denomination: institution.denomination,
        country: institutionCountry,
        state: institutionState,
        city: institutionCity,
        email: institution.contact?.email || "",
        phone: institution.contact?.phone || "",
        website: institution.contact?.website || "",
        description: institution.description || "",
        contactId: institution.contact?.id || "",
      })
      
      // Set additional geographic fields from existing data
      // Find state name from code
      const stateFromCode = institutionState && institutionCountry && states[institutionCountry as keyof typeof states]
        ? states[institutionCountry as keyof typeof states].find(s => s.code === institutionState)?.name || ""
        : ""
      
      // Find city name from code
      const cityFromCode = institutionCity && institutionState && cities[institutionState as keyof typeof cities]
        ? cities[institutionState as keyof typeof cities].find(c => c.code === institutionCity)?.name || ""
        : ""
        
      setSelectedState(stateFromCode)
      setSelectedCity(cityFromCode)
      setErrors({})
      setCurrentStep(1)
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

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = t_institution.validation.nameRequired
      } else if (formData.name.trim().length < 2) {
        newErrors.name = t_institution.validation.nameMinLength
      }

      if (!formData.denomination?.trim()) {
        newErrors.denomination = t_institution.validation.denominationRequired
      } else if (formData.denomination.trim().length < 2) {
        newErrors.denomination = t_institution.validation.denominationMinLength
      }

      if (!formData.language_preference) {
        newErrors.language_preference = t_institution.validation.languageRequired
      }
    }

    if (step === 2) {
      if (!formData.country?.trim()) {
        newErrors.country = t_institution.validation.countryRequired
      }

      if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t_institution.validation.emailInvalid
      }

      if (formData.website && formData.website.trim() && !formData.website.match(/^https?:\/\//)) {
        newErrors.website = t_institution.validation.websiteInvalid
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

  const validateForm = () => {
    return validateStep(1) && validateStep(2)
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
      const institutionCountry = institution.contact?.country || ""
      const institutionState = institution.contact?.state || ""
      const institutionCity = institution.contact?.city || ""
      
      setFormData({
        id: institution.id,
        name: institution.name,
        denomination: institution.denomination,
        language_preference: institution.language_preference,
        country: institutionCountry,
        state: institutionState,
        city: institutionCity,
        email: institution.contact?.email || "",
        phone: institution.contact?.phone || "",
        website: institution.contact?.website || "",
        description: institution.description || "",
        contactId: institution.contact?.id || "",
      })
      
      // Reset additional geographic fields to original values
      // Find state name from code
      const stateFromCode = institutionState && institutionCountry && states[institutionCountry as keyof typeof states]
        ? states[institutionCountry as keyof typeof states].find(s => s.code === institutionState)?.name || ""
        : ""
      
      // Find city name from code
      const cityFromCode = institutionCity && institutionState && cities[institutionState as keyof typeof cities]
        ? cities[institutionState as keyof typeof cities].find(c => c.code === institutionCity)?.name || ""
        : ""
        
      setSelectedState(stateFromCode)
      setSelectedCity(cityFromCode)
    }
    
    setCurrentStep(1)
    setErrors({})
    onOpenChange(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t_institution.basicInformation}</h3>
              <p className="text-sm text-muted-foreground">{t_institution.basicInformationDesc}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-muted-foreground" />
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
              <Label htmlFor="language" className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {t_institution.languagePreference}
              </Label>
              <Select
                value={formData.language_preference || ''}
                onValueChange={(value: string) => handleInputChange('language_preference', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={`h-12 text-base ${errors.language_preference ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder={t_institution.languagePreferencePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.language_preference && (
                <p className="text-sm text-red-600">{errors.language_preference}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t_institution.contactInformation}</h3>
              <p className="text-sm text-muted-foreground">{t_institution.contactInformationDesc}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="flex items-center gap-2 text-sm">
                <Flag className="w-4 h-4 text-muted-foreground" />
                {t_institution.country}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={`h-12 w-full justify-between text-base ${errors.country ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  >
                    {formData.country ? countries.find(c => c.code === formData.country)?.name : t_institution.countryPlaceholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder={t_institution.searchCountry} />
                    <CommandList>
                      <CommandEmpty>{t_institution.noCountryFound}</CommandEmpty>
                      <CommandGroup>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.name}
                            onSelect={() => {
                              handleInputChange('country', country.code)
                              handleInputChange('state', '')
                              handleInputChange('city', '')
                              setSelectedState('')
                              setSelectedCity('')
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.country === country.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country.name}
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

            <div className="space-y-2">
              <Label htmlFor="state" className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Estado/Província
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="h-12 w-full justify-between text-base"
                    disabled={!formData.country || isLoading}
                  >
                    {selectedState || "Selecionar estado"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar estados..." />
                    <CommandList>
                      <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
                      <CommandGroup>
                        {statesOptions.map((state) => (
                          <CommandItem
                            key={state.value}
                            value={state.label}
                            onSelect={() => {
                              setSelectedState(state.label)
                              handleInputChange('state', state.value)
                              handleInputChange('city', '')
                              setSelectedCity('')
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedState === state.label ? "opacity-100" : "opacity-0"
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

            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Cidade
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="h-12 w-full justify-between text-base"
                    disabled={!formData.state || isLoading}
                  >
                    {selectedCity || "Selecionar cidade"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar cidades..." />
                    <CommandList>
                      <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                      <CommandGroup>
                        {citiesOptions.map((city) => (
                          <CommandItem
                            key={city.value}
                            value={city.label}
                            onSelect={() => {
                              setSelectedCity(city.label)
                              handleInputChange('city', city.value)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCity === city.label ? "opacity-100" : "opacity-0"
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
            </div>

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
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t_institution.additionalDetails}</h3>
              <p className="text-sm text-muted-foreground">{t_institution.additionalDetailsDesc}</p>
            </div>

            <div className="space-y-2">
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
                rows={4}
                className="text-base resize-none"
              />
            </div>
          </div>
        )

      default:
        return null
    }
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
          
          {/* Progress Bar */}
          <div className="space-y-2 pt-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="w-full h-2" />
          </div>
        </DialogHeader>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {renderStepContent()}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            {/* Left side - Previous button */}
            <div>
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={isLoading}
                  size="sm"
                  className="text-xs"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {t_institution.previous}
                </Button>
              )}
            </div>

            {/* Right side - Cancel, Next/Save buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
                className="text-xs"
              >
                {t_institution.cancel}
              </Button>
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext}
                  disabled={isLoading}
                  size="sm"
                  className="text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {t_institution.next}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}