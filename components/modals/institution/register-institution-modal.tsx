"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useInstitutions } from "@/hooks/use-institutions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, 
  Building2, 
  ChevronLeft, 
  ChevronRight, 
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  FileText,
  User,
  Building,
  Check,
  ChevronsUpDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { institutionTranslations } from "@/lib/translations/institutions"
import { LanguageSelectorInput } from "@/components/shared/language-selector-input"
import { countries } from "@/data/geographicData"
import { CreateInstitutionVariables } from "@/types/CreateInstitution"
import { LanguagePreference } from "@/types/globalTypes"

export interface RegisterInstitutionModalProps {
  children: React.ReactNode
  onSuccess?: (data: CreateInstitutionVariables) => void
}

export function RegisterInstitutionModal({
  children,
  onSuccess
}: RegisterInstitutionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateInstitutionVariables>({
    name: "",
    denomination: "",
    contactCountry: "",
    contactEmail: "",
    contactPhone: "",
    contactWebsite: "",
    contactFullAddress: "",
    languagePreference: LanguagePreference.en,
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // States for command popovers
  const [openCountry, setOpenCountry] = useState(false)
  
  // Ref para forçar re-render dos inputs quando necessário
  const keyRef = React.useRef(0)

  const totalSteps = 3
  const { createInstitution, refetchInstitutions } = useInstitutions()
  const { i18n } = useTranslation()
  
  // Get translations for current language
  const t_institution = institutionTranslations[i18n.language as keyof typeof institutionTranslations] || institutionTranslations.en

  // Transform countries data for combobox (only Netherlands for now)
  const countryOptions = countries.map(country => ({
    value: country.code,
    label: country.name
  }))

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        denomination: "",
        contactCountry: "",
        contactEmail: "",
        contactPhone: "",
        contactWebsite: "",
        contactFullAddress: "",
        languagePreference: LanguagePreference.en,
        description: "",
      })
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen])

  const handleInputChange = React.useCallback((field: keyof CreateInstitutionVariables, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      }
      return prev
    })
  }, [])

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

      if (!formData.contactCountry?.trim()) {
        newErrors.contactCountry = t_institution.validation.countryRequired
      } else if (formData.contactCountry.trim().length < 2) {
        newErrors.contactCountry = t_institution.validation.countryRequired
      }

      if (!formData.languagePreference) {
        newErrors.languagePreference = t_institution.validation.languageRequired
      }
    }

    if (step === 2) {
      if (!formData.contactEmail?.trim()) {
        newErrors.contactEmail = t_institution.validation.emailRequired
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
        newErrors.contactEmail = t_institution.validation.emailInvalid
      }

      if (formData.contactWebsite && formData.contactWebsite.trim()) {
        const website = formData.contactWebsite.trim()
        // Simplified validation: must contain at least one dot
        if (!website.includes('.')) {
          newErrors.contactWebsite = t_institution.validation.websiteInvalid
        }
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
      toast.error(t_institution.validation.fixErrors)
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(`🏢 ${t_institution.creating}`)

    try {
      const result = await createInstitution({ variables: formData })

      // Refetch institutions para atualizar lista global
      refetchInstitutions()

      toast.dismiss(loadingToast)
      toast.success(
        `🎉 ${t_institution.institutionName} "${formData.name}" ${t_institution.toasts.created}`,
        { duration: 4000 }
      )

      // Call success callback
      onSuccess?.(formData)

      // Close modal
      setIsOpen(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(`${t_institution.toasts.createError}`)
      console.error("Error creating institution:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      denomination: "",
      contactCountry: "",
      contactEmail: "",
      contactPhone: "",
      contactWebsite: "",
      contactFullAddress: "",
      languagePreference: LanguagePreference.en,
      description: "",
    })
    setErrors({})
    setCurrentStep(1)
    setIsOpen(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t_institution.basicInformation}</h3>
              <p className="text-sm text-muted-foreground">{t_institution.basicInformationDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  {t_institution.institutionName} *
                </Label>
                <Input
                  key={`name-${isOpen ? 'open' : 'closed'}`}
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t_institution.institutionNamePlaceholder}
                  disabled={isLoading}
                  className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="denomination" className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  {t_institution.denomination} *
                </Label>
                <Input
                  key={`denomination-${isOpen ? 'open' : 'closed'}`}
                  id="denomination"
                  value={formData.denomination || ""}
                  onChange={(e) => handleInputChange('denomination', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t_institution.denominationPlaceholder}
                  disabled={isLoading}
                  className={`h-12 text-base ${errors.denomination ? 'border-red-500' : ''}`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.denomination && (
                  <p className="text-sm text-red-600">{errors.denomination}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {t_institution.country} *
                </Label>
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCountry}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal",
                        !formData.contactCountry && "text-muted-foreground",
                        errors.contactCountry && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      {formData.contactCountry
                        ? countryOptions.find(country => country.value === formData.contactCountry)?.label
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
                          {countryOptions.map((country) => (
                            <CommandItem
                              key={country.value}
                              value={country.value}
                              onSelect={(currentValue) => {
                                handleInputChange('contactCountry', currentValue === formData.contactCountry ? "" : currentValue)
                                setOpenCountry(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.contactCountry === country.value ? "opacity-100" : "opacity-0"
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

              <LanguageSelectorInput
                value={formData.languagePreference || ''}
                onValueChange={(value: string) => handleInputChange('languagePreference', value as "en" | "nl")}
                label={t_institution.languagePreference}
                placeholder={t_institution.languagePreferencePlaceholder}
                variant="combobox"
                disabled={isLoading}
                error={errors.languagePreference}
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t_institution.contactInformation}</h3>
              <p className="text-sm text-muted-foreground">{t_institution.contactInformationDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  {t_institution.contactEmail} *
                </Label>
                <Input
                  key={`email-${isOpen ? 'open' : 'closed'}`}
                  id="email"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t_institution.contactEmailPlaceholder}
                  disabled={isLoading}
                  className={`h-12 text-base ${errors.contactEmail ? 'border-red-500' : ''}`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.contactEmail && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  {t_institution.phone}
                </Label>
                <Input
                  key={`phone-${isOpen ? 'open' : 'closed'}`}
                  id="phone"
                  value={formData.contactPhone || ""}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t_institution.phonePlaceholder}
                  disabled={isLoading}
                  className="h-12 text-base"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {t_institution.website}
                </Label>
                <Input
                  key={`website-${isOpen ? 'open' : 'closed'}`}
                  id="website"
                  value={formData.contactWebsite || ""}
                  onChange={(e) => handleInputChange('contactWebsite', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t_institution.websitePlaceholder}
                  disabled={isLoading}
                  className={`h-12 text-base ${errors.contactWebsite ? 'border-red-500' : ''}`}
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.contactWebsite && (
                  <p className="text-sm text-red-600">{errors.contactWebsite}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{t_institution.additionalDetails}</h3>
              <p className="text-sm text-muted-foreground">{t_institution.additionalDetailsDesc}</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {t_institution.description}
                </Label>
                <Textarea
                  key={`description-${isOpen ? 'open' : 'closed'}`}
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={t_institution.descriptionPlaceholder}
                  disabled={isLoading}
                  className="min-h-[120px] text-base resize-none"
                  rows={5}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? setIsOpen : undefined}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            {t_institution.registerInstitution}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t_institution.modalDescription}
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t_institution.step} {currentStep} {t_institution.of} {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-1" />
          </div>
        </DialogHeader>

        {/* Conteúdo dos Steps - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {/* Step Content */}
            {renderStepContent()}
          </div>
        </div>

        {/* Botões de Navegação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                  {t_institution.previous}
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
                className="text-xs"
              >
                {t_institution.cancel}
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext} 
                  disabled={isLoading}
                  size="sm"
                  className="flex items-center gap-1 text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {t_institution.next}
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[100px] text-xs bg-gray-900 hover:bg-gray-800 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      {t_institution.creating}
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      {t_institution.registerInstitutionBtn}
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