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

  const languages = [
    { value: "en", label: t_institution.languages.en },
    { value: "nl", label: t_institution.languages.nl },
    { value: "es", label: t_institution.languages.es },
    { value: "fr", label: t_institution.languages.fr },
    { value: "de", label: t_institution.languages.de },
    { value: "pt", label: t_institution.languages.pt }
  ]

  useEffect(() => {
    if (institution) {
      setFormData({
        id: institution.id,
        name: institution.name,
        language_preference: institution.language_preference,
        denomination: institution.denomination,
        country: institution.contact?.country || "",
        email: institution.contact?.email || "",
        phone: institution.contact?.phone || "",
        website: institution.contact?.website || "",
        description: institution.description || "",
        contactId: institution.contact?.id || "",
      })
      setErrors({})
    }
  }, [institution])

  const handleInputChange = (field: keyof UpdateInstitutionVariables, value: string) => {
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
      setFormData({
        id: institution.id,
        name: institution.name,
        denomination: institution.denomination,
        language_preference: institution.language_preference,
        country: institution.contact?.country || "",
        email: institution.contact?.email || "",
        phone: institution.contact?.phone || "",
        website: institution.contact?.website || "",
        description: institution.description || "",
        contactId: institution.contact?.id || "",
      })
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
