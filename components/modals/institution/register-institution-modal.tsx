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

export interface RegisterInstitutionFormData {
  name: string
  denomination: string
  country: string
  email: string
  phone?: string
  website?: string
  language_preference: "en" | "nl"
  description?: string
}

export interface RegisterInstitutionModalProps {
  children: React.ReactNode
  onSuccess?: (data: RegisterInstitutionFormData) => void
}

export function RegisterInstitutionModal({
  children,
  onSuccess
}: RegisterInstitutionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RegisterInstitutionFormData>({
    name: "",
    denomination: "SDA",
    country: "",
    email: "",
    phone: "",
    website: "",
    language_preference: "en",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // States for command popovers
  const [openCountry, setOpenCountry] = useState(false)

  const totalSteps = 3
  const { createInstitution, refetchInstitutions } = useInstitutions()
  const { i18n } = useTranslation()
  
  // Get translations for current language
  const t_institution = institutionTranslations[i18n.language as keyof typeof institutionTranslations] || institutionTranslations.en

  // Define options for comboboxes
  const countries = [
    { value: "AD", label: "Andorra" },
    { value: "AE", label: "United Arab Emirates" },
    { value: "AF", label: "Afghanistan" },
    { value: "AG", label: "Antigua and Barbuda" },
    { value: "AI", label: "Anguilla" },
    { value: "AL", label: "Albania" },
    { value: "AM", label: "Armenia" },
    { value: "AO", label: "Angola" },
    { value: "AQ", label: "Antarctica" },
    { value: "AR", label: "Argentina" },
    { value: "AS", label: "American Samoa" },
    { value: "AT", label: "Austria" },
    { value: "AU", label: "Australia" },
    { value: "AW", label: "Aruba" },
    { value: "AX", label: "Åland Islands" },
    { value: "AZ", label: "Azerbaijan" },
    { value: "BA", label: "Bosnia and Herzegovina" },
    { value: "BB", label: "Barbados" },
    { value: "BD", label: "Bangladesh" },
    { value: "BE", label: "Belgium" },
    { value: "BF", label: "Burkina Faso" },
    { value: "BG", label: "Bulgaria" },
    { value: "BH", label: "Bahrain" },
    { value: "BI", label: "Burundi" },
    { value: "BJ", label: "Benin" },
    { value: "BL", label: "Saint Barthélemy" },
    { value: "BM", label: "Bermuda" },
    { value: "BN", label: "Brunei Darussalam" },
    { value: "BO", label: "Bolivia" },
    { value: "BQ", label: "Bonaire, Sint Eustatius and Saba" },
    { value: "BR", label: "Brazil" },
    { value: "BS", label: "Bahamas" },
    { value: "BT", label: "Bhutan" },
    { value: "BV", label: "Bouvet Island" },
    { value: "BW", label: "Botswana" },
    { value: "BY", label: "Belarus" },
    { value: "BZ", label: "Belize" },
    { value: "CA", label: "Canada" },
    { value: "CC", label: "Cocos (Keeling) Islands" },
    { value: "CD", label: "Congo, Democratic Republic of the" },
    { value: "CF", label: "Central African Republic" },
    { value: "CG", label: "Congo" },
    { value: "CH", label: "Switzerland" },
    { value: "CI", label: "Côte d'Ivoire" },
    { value: "CK", label: "Cook Islands" },
    { value: "CL", label: "Chile" },
    { value: "CM", label: "Cameroon" },
    { value: "CN", label: "China" },
    { value: "CO", label: "Colombia" },
    { value: "CR", label: "Costa Rica" },
    { value: "CU", label: "Cuba" },
    { value: "CV", label: "Cabo Verde" },
    { value: "CW", label: "Curaçao" },
    { value: "CX", label: "Christmas Island" },
    { value: "CY", label: "Cyprus" },
    { value: "CZ", label: "Czechia" },
    { value: "DE", label: "Germany" },
    { value: "DJ", label: "Djibouti" },
    { value: "DK", label: "Denmark" },
    { value: "DM", label: "Dominica" },
    { value: "DO", label: "Dominican Republic" },
    { value: "DZ", label: "Algeria" },
    { value: "EC", label: "Ecuador" },
    { value: "EE", label: "Estonia" },
    { value: "EG", label: "Egypt" },
    { value: "EH", label: "Western Sahara" },
    { value: "ER", label: "Eritrea" },
    { value: "ES", label: "Spain" },
    { value: "ET", label: "Ethiopia" },
    { value: "FI", label: "Finland" },
    { value: "FJ", label: "Fiji" },
    { value: "FK", label: "Falkland Islands (Malvinas)" },
    { value: "FM", label: "Micronesia" },
    { value: "FO", label: "Faroe Islands" },
    { value: "FR", label: "France" },
    { value: "GA", label: "Gabon" },
    { value: "GB", label: "United Kingdom" },
    { value: "GD", label: "Grenada" },
    { value: "GE", label: "Georgia" },
    { value: "GF", label: "French Guiana" },
    { value: "GG", label: "Guernsey" },
    { value: "GH", label: "Ghana" },
    { value: "GI", label: "Gibraltar" },
    { value: "GL", label: "Greenland" },
    { value: "GM", label: "Gambia" },
    { value: "GN", label: "Guinea" },
    { value: "GP", label: "Guadeloupe" },
    { value: "GQ", label: "Equatorial Guinea" },
    { value: "GR", label: "Greece" },
    { value: "GS", label: "South Georgia and the South Sandwich Islands" },
    { value: "GT", label: "Guatemala" },
    { value: "GU", label: "Guam" },
    { value: "GW", label: "Guinea-Bissau" },
    { value: "GY", label: "Guyana" },
    { value: "HK", label: "Hong Kong" },
    { value: "HM", label: "Heard Island and McDonald Islands" },
    { value: "HN", label: "Honduras" },
    { value: "HR", label: "Croatia" },
    { value: "HT", label: "Haiti" },
    { value: "HU", label: "Hungary" },
    { value: "ID", label: "Indonesia" },
    { value: "IE", label: "Ireland" },
    { value: "IL", label: "Israel" },
    { value: "IM", label: "Isle of Man" },
    { value: "IN", label: "India" },
    { value: "IO", label: "British Indian Ocean Territory" },
    { value: "IQ", label: "Iraq" },
    { value: "IR", label: "Iran" },
    { value: "IS", label: "Iceland" },
    { value: "IT", label: "Italy" },
    { value: "JE", label: "Jersey" },
    { value: "JM", label: "Jamaica" },
    { value: "JO", label: "Jordan" },
    { value: "JP", label: "Japan" },
    { value: "KE", label: "Kenya" },
    { value: "KG", label: "Kyrgyzstan" },
    { value: "KH", label: "Cambodia" },
    { value: "KI", label: "Kiribati" },
    { value: "KM", label: "Comoros" },
    { value: "KN", label: "Saint Kitts and Nevis" },
    { value: "KP", label: "Korea, Democratic People's Republic of" },
    { value: "KR", label: "Korea, Republic of" },
    { value: "KW", label: "Kuwait" },
    { value: "KY", label: "Cayman Islands" },
    { value: "KZ", label: "Kazakhstan" },
    { value: "LA", label: "Lao People's Democratic Republic" },
    { value: "LB", label: "Lebanon" },
    { value: "LC", label: "Saint Lucia" },
    { value: "LI", label: "Liechtenstein" },
    { value: "LK", label: "Sri Lanka" },
    { value: "LR", label: "Liberia" },
    { value: "LS", label: "Lesotho" },
    { value: "LT", label: "Lithuania" },
    { value: "LU", label: "Luxembourg" },
    { value: "LV", label: "Latvia" },
    { value: "LY", label: "Libya" },
    { value: "MA", label: "Morocco" },
    { value: "MC", label: "Monaco" },
    { value: "MD", label: "Moldova" },
    { value: "ME", label: "Montenegro" },
    { value: "MF", label: "Saint Martin (French part)" },
    { value: "MG", label: "Madagascar" },
    { value: "MH", label: "Marshall Islands" },
    { value: "MK", label: "North Macedonia" },
    { value: "ML", label: "Mali" },
    { value: "MM", label: "Myanmar" },
    { value: "MN", label: "Mongolia" },
    { value: "MO", label: "Macao" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "MQ", label: "Martinique" },
    { value: "MR", label: "Mauritania" },
    { value: "MS", label: "Montserrat" },
    { value: "MT", label: "Malta" },
    { value: "MU", label: "Mauritius" },
    { value: "MV", label: "Maldives" },
    { value: "MW", label: "Malawi" },
    { value: "MX", label: "Mexico" },
    { value: "MY", label: "Malaysia" },
    { value: "MZ", label: "Mozambique" },
    { value: "NA", label: "Namibia" },
    { value: "NC", label: "New Caledonia" },
    { value: "NE", label: "Niger" },
    { value: "NF", label: "Norfolk Island" },
    { value: "NG", label: "Nigeria" },
    { value: "NI", label: "Nicaragua" },
    { value: "NL", label: "Netherlands" },
    { value: "NO", label: "Norway" },
    { value: "NP", label: "Nepal" },
    { value: "NR", label: "Nauru" },
    { value: "NU", label: "Niue" },
    { value: "NZ", label: "New Zealand" },
    { value: "OM", label: "Oman" },
    { value: "PA", label: "Panama" },
    { value: "PE", label: "Peru" },
    { value: "PF", label: "French Polynesia" },
    { value: "PG", label: "Papua New Guinea" },
    { value: "PH", label: "Philippines" },
    { value: "PK", label: "Pakistan" },
    { value: "PL", label: "Poland" },
    { value: "PM", label: "Saint Pierre and Miquelon" },
    { value: "PN", label: "Pitcairn" },
    { value: "PR", label: "Puerto Rico" },
    { value: "PS", label: "Palestine, State of" },
    { value: "PT", label: "Portugal" },
    { value: "PW", label: "Palau" },
    { value: "PY", label: "Paraguay" },
    { value: "QA", label: "Qatar" },
    { value: "RE", label: "Réunion" },
    { value: "RO", label: "Romania" },
    { value: "RS", label: "Serbia" },
    { value: "RU", label: "Russian Federation" },
    { value: "RW", label: "Rwanda" },
    { value: "SA", label: "Saudi Arabia" },
    { value: "SB", label: "Solomon Islands" },
    { value: "SC", label: "Seychelles" },
    { value: "SD", label: "Sudan" },
    { value: "SE", label: "Sweden" },
    { value: "SG", label: "Singapore" },
    { value: "SH", label: "Saint Helena, Ascension and Tristan da Cunha" },
    { value: "SI", label: "Slovenia" },
    { value: "SJ", label: "Svalbard and Jan Mayen" },
    { value: "SK", label: "Slovakia" },
    { value: "SL", label: "Sierra Leone" },
    { value: "SM", label: "San Marino" },
    { value: "SN", label: "Senegal" },
    { value: "SO", label: "Somalia" },
    { value: "SR", label: "Suriname" },
    { value: "SS", label: "South Sudan" },
    { value: "ST", label: "Sao Tome and Principe" },
    { value: "SV", label: "El Salvador" },
    { value: "SX", label: "Sint Maarten (Dutch part)" },
    { value: "SY", label: "Syrian Arab Republic" },
    { value: "SZ", label: "Eswatini" },
    { value: "TC", label: "Turks and Caicos Islands" },
    { value: "TD", label: "Chad" },
    { value: "TF", label: "French Southern Territories" },
    { value: "TG", label: "Togo" },
    { value: "TH", label: "Thailand" },
    { value: "TJ", label: "Tajikistan" },
    { value: "TK", label: "Tokelau" },
    { value: "TL", label: "Timor-Leste" },
    { value: "TM", label: "Turkmenistan" },
    { value: "TN", label: "Tunisia" },
    { value: "TO", label: "Tonga" },
    { value: "TR", label: "Turkey" },
    { value: "TT", label: "Trinidad and Tobago" },
    { value: "TV", label: "Tuvalu" },
    { value: "TW", label: "Taiwan" },
    { value: "TZ", label: "Tanzania" },
    { value: "UA", label: "Ukraine" },
    { value: "UG", label: "Uganda" },
    { value: "UM", label: "United States Minor Outlying Islands" },
    { value: "US", label: "United States of America" },
    { value: "UY", label: "Uruguay" },
    { value: "UZ", label: "Uzbekistan" },
    { value: "VA", label: "Holy See" },
    { value: "VC", label: "Saint Vincent and the Grenadines" },
    { value: "VE", label: "Venezuela" },
    { value: "VG", label: "Virgin Islands (British)" },
    { value: "VI", label: "Virgin Islands (U.S.)" },
    { value: "VN", label: "Viet Nam" },
    { value: "VU", label: "Vanuatu" },
    { value: "WF", label: "Wallis and Futuna" },
    { value: "WS", label: "Samoa" },
    { value: "YE", label: "Yemen" },
    { value: "YT", label: "Mayotte" },
    { value: "ZA", label: "South Africa" },
    { value: "ZM", label: "Zambia" },
    { value: "ZW", label: "Zimbabwe" }
  ]

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        denomination: "SDA",
        country: "",
        email: "",
        phone: "",
        website: "",
        language_preference: "en",
        description: "",
      })
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen])

  const handleInputChange = (field: keyof RegisterInstitutionFormData, value: string) => {
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
      if (!formData.name?.trim()) {
        newErrors.name = "Institution name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Institution name must be at least 2 characters"
      }

      if (!formData.denomination?.trim()) {
        newErrors.denomination = "Denomination is required"
      } else if (formData.denomination.trim().length < 2) {
        newErrors.denomination = "Denomination must be at least 2 characters"
      }

      if (!formData.country?.trim()) {
        newErrors.country = "Country is required"
      } else if (formData.country.trim().length < 2) {
        newErrors.country = "Country must be at least 2 characters"
      }

      if (!formData.language_preference) {
        newErrors.language_preference = "Language preference is required"
      }
    }

    if (step === 2) {
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }

      if (formData.website && formData.website.trim() && !formData.website.match(/^https?:\/\//)) {
        newErrors.website = "Website must start with http:// or https://"
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
      toast.error("Please fix the errors before continuing")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("🏢 Creating new institution...")

    try {
      // Chamada da mutation para criar a instituição
      const variables = {
        name: formData.name.trim(),
        denomination: formData.denomination.trim(),
        description: formData.description?.trim() || null,
        contactEmail: formData.email.trim(),
        contactPhone: formData.phone?.trim() || null,
        contactCountry: formData.country.trim(),
        contactWebsite: formData.website?.trim() || null,
        languagePreference: formData.language_preference,
      }

      const result = await createInstitution({ variables })

      // Refetch institutions para atualizar lista global
      refetchInstitutions()

      toast.dismiss(loadingToast)
      toast.success(
        `🎉 Institution "${formData.name}" created successfully!`,
        { duration: 4000 }
      )

      // Call success callback
      onSuccess?.(formData)

      // Close modal
      setIsOpen(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("❌ Failed to create institution")
      console.error("Error creating institution:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      denomination: "SDA",
      country: "",
      email: "",
      phone: "",
      website: "",
      language_preference: "en",
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
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Enter the institution name, denomination and location</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  Institution Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter institution name"
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
                  Denomination *
                </Label>
                <Input
                  id="denomination"
                  value={formData.denomination}
                  onChange={(e) => handleInputChange('denomination', e.target.value)}
                  placeholder="e.g., SDA, Baptist, Methodist"
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
                        !formData.country && "text-muted-foreground",
                        errors.country && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      {formData.country
                        ? countries.find(country => country.value === formData.country)?.label
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
                          {countries.map((country) => (
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

              <LanguageSelectorInput
                value={formData.language_preference || ''}
                onValueChange={(value: string) => handleInputChange('language_preference', value as "en" | "nl")}
                label={t_institution.languagePreference}
                placeholder={t_institution.languagePreferencePlaceholder}
                variant="combobox"
                disabled={isLoading}
                error={errors.language_preference}
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
              <p className="text-sm text-muted-foreground">Add contact details for the institution</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Contact Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@institution.org"
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
                  Phone (Optional)
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  disabled={isLoading}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Website (Optional)
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.institution.org"
                  disabled={isLoading}
                  className={`h-12 text-base ${errors.website ? 'border-red-500' : ''}`}
                />
                {errors.website && (
                  <p className="text-sm text-red-600">{errors.website}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Additional Details</h3>
              <p className="text-sm text-muted-foreground">Add a description about the institution</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description about the institution, its mission, and activities..."
                  disabled={isLoading}
                  className="min-h-[120px] text-base resize-none"
                  rows={5}
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
            Register New Institution
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new religious institution in your organization
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
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
                  Previous
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
                className="text-xs"
              >
                Cancel
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
                  Next
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Register Institution
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