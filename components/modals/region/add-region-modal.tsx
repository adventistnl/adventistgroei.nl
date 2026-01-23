"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { regionTranslations } from "@/lib/translations/regions"
import { cn } from "@/lib/utils"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ColorPicker } from "@/components/ui/color-picker"
import { 
  MapPin, 
  ChevronLeft,
  ChevronRight,
  Search,
  Check,
  X,
  ChevronsUpDown,
  Globe
} from "lucide-react"
import toast from "react-hot-toast"
import { useRegions } from "@/hooks/use-regions"
import { CreateRegionVariables } from "@/types/CreateRegion"
import { countries, states, cities } from "@/data/geographicData"
import { TerritoryBase, TerritoryMap } from "@/types/Terrytory"

// Types needed for this component
interface Province extends TerritoryBase {
  cities: TerritoryBase[]
}

// Transform geographicData to the format expected by this component
const transformToProvinces = (countryCode: string): Province[] => {
  const provincesForCountry = states[countryCode as keyof typeof states];
  if (!provincesForCountry) return [];
  
  return provincesForCountry.map(state => ({
    code: state.code,
    name: state.name,
    cities: cities[state.code as keyof typeof cities]?.map(city => ({
      code: city.code,
      name: city.name
    })) || []
  }));
};

export interface AddRegionModalProps {
  children: React.ReactNode
  onSuccess: (data: CreateRegionVariables) => void
}

export function AddRegionModal({
  children,
  onSuccess
}: AddRegionModalProps) {
  const { createRegion, regions } = useRegions();

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = useState(false)
  
  // Form Data
  const [formData, setFormData] = useState<CreateRegionVariables>({
    name: "",
    description: "",
    color: "#475569", // Slate dark
    territory: { NL: {} }
  })
  
  // Country, Province and City Selection State
  const [selectedCountry, setSelectedCountry] = useState<string>("NL")
  const [selectedProvinces, setSelectedProvinces] = useState<Set<string>>(new Set())
  const [selectedCities, setSelectedCities] = useState<Record<string, Set<string>>>({})
  const [expandedProvinces, setExpandedProvinces] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 4 // País, Nome/Descrição/Cor, Províncias, Review
  const { i18n } = useTranslation()
  
  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tRegion = regionTranslations[currentLanguage as keyof typeof regionTranslations] || regionTranslations.en
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        color: "#475569",
        territory: { NL: {} }
      })
      setSelectedCountry("NL")
      setSelectedProvinces(new Set())
      setSelectedCities({})
      setSearchQuery("")
      setErrors({})
      setCurrentStep(1)
      setIsCountryPopoverOpen(false)
    }
  }, [isOpen])

  // Collapse expanded provinces when country changes
  useEffect(() => {
    setExpandedProvinces(new Set())
  }, [selectedCountry])

  // Get provinces for selected country
  const provincesForSelectedCountry = useMemo(() => {
    return transformToProvinces(selectedCountry);
  }, [selectedCountry]);

  // Build a map of cityCode -> regionName for cities already registered in other regions (by country)
  const cityOwnersByCountry = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}
    if (!regions || regions.length === 0) return map

    regions.forEach(r => {
      if (!r.territory) return
      Object.entries(r.territory).forEach(([countryCode, provinces]) => {
        if (!provinces) return
        Object.entries(provinces as Record<string, any> || {}).forEach(([provCode, cityCodes]) => {
          if (!cityCodes || !Array.isArray(cityCodes)) return
          cityCodes.forEach((cityCode: string) => {
            map[countryCode] = map[countryCode] || {}
            if (!map[countryCode][cityCode]) {
              map[countryCode][cityCode] = r.name || 'Unknown'
            }
          })
        })
      })
    })

    return map
  }, [regions])

  // Input handlers
  const handleInputChange = (field: keyof CreateRegionVariables, value: string) => {
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

  // Province selection handlers
  const toggleProvinceSimple = (provinceCode: string) => {
    const province = provincesForSelectedCountry.find(p => p.code === provinceCode)
    if (!province) return

    // If any city in the province is already owned by another region, block selecting the whole province
    const occupiedCities = province.cities.filter(c => !!cityOwnersByCountry[selectedCountry]?.[c.code])
    if (occupiedCities.length > 0) {
      const owner = cityOwnersByCountry[selectedCountry][occupiedCities[0].code]
      const names = occupiedCities.map(c => c.name).slice(0, 5).join(', ')
      toast.error(tRegion.messages?.cities_conflict?.replace?.('{{list}}', names) || `Some cities are already registered: ${names}`)
      setErrors(prev => ({ ...prev, territory: tRegion.validation?.cities_conflict || 'Some selected cities are already registered in other regions' }))
      return
    }

    setSelectedProvinces(prev => {
      const newSet = new Set(prev)

      if (newSet.has(provinceCode)) {
        // Deselect province and remove its cities
        newSet.delete(provinceCode)
        setSelectedCities(prevCities => {
          const newCities = { ...prevCities }
          delete newCities[provinceCode]
          return newCities
        })
      } else {
        // Select province and ALL its cities automatically
        newSet.add(provinceCode)
        setSelectedCities(prevCities => ({
          ...prevCities,
          [provinceCode]: new Set(province.cities.map(c => c.code))
        }))
      }
      return newSet
    })
  }

  // Toggle city selection
  const toggleCity = (provinceCode: string, cityCode: string) => {
    // Prevent toggling a city that is already owned by another region
    const owner = cityOwnersByCountry[selectedCountry]?.[cityCode]
    if (owner) {
      toast.error(tRegion.messages?.city_in_use?.replace?.('{{region}}', owner) || `City already registered in ${owner}`)
      return
    }

    setSelectedCities(prev => {
      const citiesInProvince = prev[provinceCode] || new Set();
      const newCities = new Set(citiesInProvince);

      let added = false
      if (newCities.has(cityCode)) {
        newCities.delete(cityCode);
      } else {
        newCities.add(cityCode);
        added = true
      }

      // Keep provinces set in sync: if we added a city, ensure province is selected; if removed last city, remove province
      setSelectedProvinces(prevProvinces => {
        const next = new Set(prevProvinces)
        if (added) next.add(provinceCode)
        else if (!added && newCities.size === 0) next.delete(provinceCode)
        return next
      })

      return {
        ...prev,
        [provinceCode]: newCities
      };
    });
  }

  // Filtered provinces for search
  const filteredProvinces = useMemo(() => {
    if (!searchQuery.trim()) return provincesForSelectedCountry
    
    const query = searchQuery.toLowerCase()
    return provincesForSelectedCountry.filter(province => 
      province.name.toLowerCase().includes(query) ||
      province.cities.some(city => city.name.toLowerCase().includes(query))
    )
  }, [searchQuery, provincesForSelectedCountry])

  // Build territory object
  const buildTerritoryObject = (): TerritoryMap => {
    const territory: TerritoryMap = { [selectedCountry]: {} };
    
    selectedProvinces.forEach(provinceCode => {
      const cityCodes = selectedCities[provinceCode]
      if (cityCodes && cityCodes.size > 0) {
        territory[selectedCountry][provinceCode] = Array.from(cityCodes)
      }
    })
    
    return territory
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!selectedCountry) {
        newErrors.country = tRegion.validation.country_required
      }
    }

    if (step === 2) {
      if (!formData.name?.trim()) {
        newErrors.name = tRegion.validation.name_required
      } else if (formData.name.trim().length < 2) {
        newErrors.name = tRegion.validation.name_min_length
      }
    }

    if (step === 3) {
      if (selectedProvinces.size === 0) {
        newErrors.territory = tRegion.validation.province_required
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
    // Validate all steps
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error(tRegion.validation.please_fix_errors)
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(tRegion.toasts.creating)

    try {
      // Build territory object
      const territory = buildTerritoryObject()
      // Validate conflicts: ensure no selected city is already registered in other regions
      const conflicts: string[] = []
      Object.entries(selectedCities).forEach(([provCode, citySet]) => {
        Array.from(citySet || []).forEach(cityCode => {
          const owner = cityOwnersByCountry[selectedCountry]?.[cityCode]
          if (owner) {
            const province = provincesForSelectedCountry.find(p => p.code === provCode)
            const cityName = province?.cities.find(c => c.code === cityCode)?.name || cityCode
            conflicts.push(`${cityName} (${owner})`)
          }
        })
      })

      if (conflicts.length > 0) {
        toast.dismiss(loadingToast)
        const list = conflicts.slice(0, 5).join(', ')
        toast.error(tRegion.messages?.cities_conflict?.replace?.('{{list}}', list) || `Some selected cities are already registered: ${list}`)
        setErrors(prev => ({ ...prev, territory: tRegion.validation?.cities_conflict || 'Some selected cities are already registered in other regions' }))
        setIsLoading(false)
        return
      }
      
      // Update formData with territory
      const finalData: CreateRegionVariables = {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color || undefined,
        territory
      }

      const res = await createRegion({
        variables: finalData
      })
      if (!res.data) throw new Error(tRegion.toasts.create_failed)

      toast.dismiss(loadingToast)
      toast.success(tRegion.toasts.created, { duration: 4000 })
      
      // Call success callback
      onSuccess(finalData)

      // Close modal
      setIsOpen(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(tRegion.toasts.create_failed)
      console.error("Error creating region:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      color: "#475569",
      territory: { NL: {} }
    })
    setSelectedCountry("NL")
    setSelectedProvinces(new Set())
    setSelectedCities({})
    setSearchQuery("")
    setErrors({})
    setCurrentStep(1)
    setIsCountryPopoverOpen(false)
    setIsOpen(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      // STEP 1: Seleção de País
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{tRegion.steps.step_1_title}</h3>
              <p className="text-sm text-muted-foreground">{tRegion.steps.step_1_description}</p>
            </div>
            <div className="space-y-6 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="country" className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {tRegion.fields.country} *
                </Label>
                <Popover open={isCountryPopoverOpen} onOpenChange={setIsCountryPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isCountryPopoverOpen}
                      className={cn(
                        "w-full h-12 text-base justify-between font-normal",
                        !selectedCountry && "text-muted-foreground",
                        errors.country && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      {selectedCountry
                        ? countries.find(c => c.code === selectedCountry)?.name
                        : tRegion.placeholders.country_placeholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder={tRegion.messages.search_country} />
                      <CommandList>
                        <CommandEmpty>{tRegion.messages.no_country_found}</CommandEmpty>
                        <CommandGroup>
                          {countries.map((country) => (
                            <CommandItem
                              key={country.code}
                              value={country.name}
                              onSelect={() => setSelectedCountry(country.code)}
                            >
                              {country.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.country && (
                  <p className="text-xs text-red-600">{errors.country}</p>
                )}
              </div>
            </div>
          </div>
        )

      // STEP 2: Nome, Descrição e Cor
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{tRegion.steps.step_2_title}</h3>
              <p className="text-sm text-muted-foreground">{tRegion.steps.step_2_description}</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {tRegion.fields.name} *
                </Label>
                <Input
                  key={`name-${isOpen ? 'open' : 'closed'}`}
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={tRegion.placeholders.name}
                  disabled={isLoading}
                  className={errors.name ? 'border-red-500' : ''}
                  autoComplete="off"
                  spellCheck={false}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {tRegion.fields.description}
                </Label>
                <Textarea
                  key={`description-${isOpen ? 'open' : 'closed'}`}
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  placeholder={tRegion.placeholders.description}
                  disabled={isLoading}
                  className="min-h-[100px] resize-none"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              {/* Color Picker Component */}
              <ColorPicker
                value={formData.color || "#475569"}
                onChange={(color) => handleInputChange('color', color)}
                disabled={isLoading}
                label={tRegion.fields.color}
                showPreview={true}
              />
            </div>
          </div>
        )

      // STEP 3: Seleção de Províncias e Cidades
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">{tRegion.steps.step_3_title}</h3>
              <p className="text-sm text-muted-foreground">
                {tRegion.steps.step_3_description}
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {/* Search Bar - Minimalista */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={tRegion.messages.search_province_city}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>

              {/* Selected Provinces - Summary */}
              {selectedProvinces.size > 0 && (
                <div className="border rounded-lg p-3 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {selectedProvinces.size} {tRegion.messages.selected}{selectedProvinces.size !== 1 ? 's' : ''} ({Array.from(selectedProvinces).reduce((sum, pc) => sum + (selectedCities[pc]?.size || 0), 0)} {tRegion.messages.cities})
                    </span>
                  </div>
                  
                  {/* Provinces Horizontal Scroll */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent">
                    {Array.from(selectedProvinces).map(provinceCode => {
                      const province = provincesForSelectedCountry.find(p => p.code === provinceCode)
                      if (!province) return null
                      
                      const cityCount = selectedCities[provinceCode]?.size || 0

                      return (
                        <div
                          key={provinceCode}
                          className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md hover:border-primary transition-colors group"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                          <span className="text-sm font-medium text-foreground whitespace-nowrap">
                            {province.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({cityCount})
                          </span>
                          <button
                            onClick={() => toggleProvinceSimple(provinceCode)}
                            className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-full p-0.5 transition-all"
                          >
                            <X className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Province Selection List */}
              <div className="border rounded-lg max-h-[400px] overflow-y-auto">
                {filteredProvinces.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No province found
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredProvinces.map((province) => {
                      const isSelected = selectedProvinces.has(province.code)
                      const citiesInProvince = selectedCities[province.code] || new Set()

                      // Determine if the entire province should be disabled (all cities occupied)
                      const provinceOccupied = province.cities.every(c => !!cityOwnersByCountry[selectedCountry]?.[c.code])

                      return (
                        <div key={province.code} className="border-b last:border-b-0">
                          {/* Province Row */}
                          <button
                            onClick={() => toggleProvinceSimple(province.code)}
                            disabled={isLoading || provinceOccupied}
                            title={provinceOccupied ? (tRegion.messages?.province_all_cities_occupied?.replace?.('{{province}}', province.name) || 'All cities in this province are already registered') : undefined}
                            className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${
                              isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
                            } ${provinceOccupied ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <span
                                role="button"
                                onClick={(e) => { e.stopPropagation(); if (!provinceOccupied && !isLoading) {
                                  setExpandedProvinces(prev => {
                                    const next = new Set(prev)
                                    if (next.has(province.code)) next.delete(province.code)
                                    else next.add(province.code)
                                    return next
                                  })
                                } }}
                                className={`mr-2 p-1 rounded transition-colors ${provinceOccupied ? 'opacity-50' : 'hover:bg-muted'}`}
                                title={provinceOccupied ? undefined : (expandedProvinces.has(province.code) ? 'Collapse' : 'Expand')}
                              >
                                <ChevronRight className={`w-4 h-4 transition-transform ${expandedProvinces.has(province.code) ? 'rotate-90' : ''}`} />
                              </span>

                              <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                                isSelected ? 'bg-primary' : 'bg-muted-foreground/30'
                              }`} />
                              
                              <div className="text-left">
                                <p className="font-medium text-sm text-foreground">{province.name}</p>
                                <p className="text-xs text-muted-foreground">{province.cities.length} cities</p>
                              </div>
                            </div>

                            <div className={`w-4 h-4 rounded border transition-all ${
                              isSelected 
                                ? 'bg-primary border-primary' 
                                : 'border-input'
                            } flex items-center justify-center`}>
                              {isSelected && (
                                <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                              )}
                            </div>
                          </button>

                          {/* Cities List - Expandable when province is selected or expanded */}
                          {(isSelected || expandedProvinces.has(province.code)) && (
                            <div className="bg-muted/30 px-4 py-3 border-t">
                              <p className="text-xs font-medium text-muted-foreground mb-2">Cities:</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {province.cities.map((city) => {
                                  const isCitySelected = citiesInProvince.has(city.code)
                                  const owner = cityOwnersByCountry[selectedCountry]?.[city.code]
                                  const isCityOccupied = !!owner

                                  return (
                                    <button
                                      key={city.code}
                                      onClick={() => toggleCity(province.code, city.code)}
                                      disabled={isLoading || isCityOccupied}
                                      title={isCityOccupied ? (tRegion.messages?.city_in_use?.replace?.('{{region}}', owner) || `Already registered in ${owner}`) : undefined}
                                      className={cn(
                                        "text-left px-2 py-1.5 rounded text-xs font-medium transition-colors",
                                        isCitySelected
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-background border text-foreground hover:border-primary/50",
                                        isCityOccupied ? 'opacity-50 cursor-not-allowed' : ''
                                      )}
                                    >
                                      {city.name}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errors.territory && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{errors.territory}</p>
                </div>
              )}
            </div>
          </div>
        )

      // STEP 4: Review - Minimalista
      case 4:
        const territory = buildTerritoryObject()
        const totalCities = Object.values(selectedCities).reduce((sum, set) => sum + set.size, 0)
        const countryName = countries.find(c => c.code === selectedCountry)?.name || selectedCountry

        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{tRegion.steps.step_4_title}</h3>
              <p className="text-sm text-muted-foreground">
                {tRegion.steps.step_4_description}
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {tRegion.sections.basic_info}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tRegion.fields.name}</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">{formData.name}</span>
                  </div>
                  {formData.description && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">{tRegion.fields.description}</span>
                      <span className="text-sm font-medium text-right max-w-[60%] line-clamp-3">
                        {formData.description}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tRegion.fields.color}</span>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: formData.color || "#475569" }}
                      />
                      <span className="text-xs font-mono text-muted-foreground">{formData.color || "#475569"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Territory Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {tRegion.labels.coverage}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tRegion.fields.country}</span>
                    <span className="text-sm font-medium">{countryName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tRegion.fields.provinces}</span>
                    <span className="text-sm font-medium">{selectedProvinces.size}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">{tRegion.table.cities}</span>
                    <span className="text-sm font-medium">{totalCities}</span>
                  </div>
                </div>
              </div>

              {/* Province List */}
              {selectedProvinces.size > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Selected Provinces
                  </h4>
                  <div className="space-y-2">
                    {Array.from(selectedProvinces).map(provinceCode => {
                      const province = provincesForSelectedCountry.find(p => p.code === provinceCode)
                      if (!province) return null

                      const citiesSet = selectedCities[provinceCode]
                      const cityCount = citiesSet?.size || 0
                      const cityNames = Array.from(citiesSet || [])
                        .map(cc => province.cities.find(c => c.code === cc)?.name)
                        .filter(Boolean)
                        .join(", ")

                      return (
                        <div 
                          key={provinceCode}
                          className="p-3 border border-slate-200 rounded-lg bg-slate-50/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: formData.color || "#475569" }}
                              />
                              <span className="font-medium text-sm">{province.name}</span>
                            </div>
                            <span className="text-xs font-medium text-slate-600 bg-white px-2 py-1 rounded">
                              {cityCount} cities
                            </span>
                          </div>
                          {cityNames && (
                            <p className="text-xs text-slate-600 ml-4 line-clamp-2">
                              {cityNames}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
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
            <MapPin className="w-5 h-5 text-muted-foreground" />
            Add New Region
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new region in your institution
          </DialogDescription>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{tRegion.steps.step} {currentStep} {tRegion.steps.of} {totalSteps}</span>
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
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                {tRegion.buttons.previous}
              </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={handleCancel} 
                disabled={isLoading}
                size="sm"
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
                  className="flex items-center gap-1"
                >
                  {tRegion.buttons.next}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      {tRegion.buttons.creating}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      {tRegion.buttons.create_region}
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
