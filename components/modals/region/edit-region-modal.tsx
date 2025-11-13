"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ColorPicker } from "@/components/ui/color-picker"
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
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

import { 
  MapPin, 
  Save, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  X,
  Globe,
  ChevronsUpDown
} from "lucide-react"
import toast from "react-hot-toast"
import { useRegions } from "@/hooks/use-regions"
import { UpdateRegionVariables } from "@/types/UpdateRegion"
import { Region, RegionUpdateDto } from "@/types/graphql-global-types"
import { countries, states, cities } from "@/data/geographicData"
import { TerritoryMap } from "@/types/Terrytory"
import { Regions_regions } from "@/types/Regions"

interface Province {
  code: string
  name: string
  cities: { code: string; name: string }[]
}

// Transform geographicData to the format expected by this component
const transformToProvinces = (countryCode: string): Province[] => {
  const provincesForCountry = states[countryCode as keyof typeof states]
  if (!provincesForCountry) return []
  
  return provincesForCountry.map(state => ({
    code: state.code,
    name: state.name,
    cities: cities[state.code as keyof typeof cities]?.map(city => ({
      code: city.code,
      name: city.name
    })) || []
  }))
}

export interface EditRegionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  region: Regions_regions
  onSave: (region: Regions_regions) => void
}

export function EditRegionModal({
  isOpen,
  onOpenChange,
  region,
  onSave
}: EditRegionModalProps) {
  const { updateRegion } = useRegions()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isCountryPopoverOpen, setIsCountryPopoverOpen] = useState(false)
  
  // Form Data
  const [formData, setFormData] = useState<RegionUpdateDto & { territory?: TerritoryMap }>({
    name: "",
    description: "",
    color: "#475569",
    territory: {}
  })
  
  // Country, Province and City Selection State
  const [selectedCountry, setSelectedCountry] = useState<string>("NL")
  const [selectedProvinces, setSelectedProvinces] = useState<Set<string>>(new Set())
  const [selectedCities, setSelectedCities] = useState<Record<string, Set<string>>>({})
  const [searchQuery, setSearchQuery] = useState("")
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 4
  const { i18n } = useTranslation()
  
  // Get translations for current language
  const t_structure = structureTranslations[i18n.language as keyof typeof structureTranslations] || structureTranslations.en

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && region) {
      setFormData({
        name: region.name || "",
        description: region.description || "",
        color: region.color || "#475569",
        territory: region.territory || { NL: {} }
      })
      
      // Parse existing territory
      if (region.territory) {
        const firstCountry = Object.keys(region.territory)[0] || "NL"
        setSelectedCountry(firstCountry)
        
        const provinces = new Set<string>()
        const citiesMap: Record<string, Set<string>> = {}
        
        Object.entries(region.territory[firstCountry] || {}).forEach(([provinceCode, cityCodes]) => {
          provinces.add(provinceCode)
          const cities = Array.isArray(cityCodes) ? cityCodes : (cityCodes as any) || []
          citiesMap[provinceCode] = new Set(cities)
        })
        
        setSelectedProvinces(provinces)
        setSelectedCities(citiesMap)
      } else {
        setSelectedCountry("NL")
        setSelectedProvinces(new Set())
        setSelectedCities({})
      }
      
      setSearchQuery("")
      setErrors({})
      setCurrentStep(1)
      setIsCountryPopoverOpen(false)
    }
  }, [isOpen, region])

  // Get provinces for selected country
  const provincesForSelectedCountry = useMemo(() => {
    return transformToProvinces(selectedCountry)
  }, [selectedCountry])

  const handleInputChange = (field: keyof typeof formData, value: string) => {
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
    setSelectedProvinces(prev => {
      const newSet = new Set(prev)
      const province = provincesForSelectedCountry.find(p => p.code === provinceCode)
      
      if (newSet.has(provinceCode)) {
        newSet.delete(provinceCode)
        setSelectedCities(prevCities => {
          const newCities = { ...prevCities }
          delete newCities[provinceCode]
          return newCities
        })
      } else {
        newSet.add(provinceCode)
        if (province) {
          setSelectedCities(prevCities => ({
            ...prevCities,
            [provinceCode]: new Set(province.cities.map(c => c.code))
          }))
        }
      }
      return newSet
    })
  }

  // Toggle city selection
  const toggleCity = (provinceCode: string, cityCode: string) => {
    setSelectedCities(prev => {
      const citiesInProvince = prev[provinceCode] || new Set()
      const newCities = new Set(citiesInProvince)
      
      if (newCities.has(cityCode)) {
        newCities.delete(cityCode)
      } else {
        newCities.add(cityCode)
      }
      
      return {
        ...prev,
        [provinceCode]: newCities
      }
    })
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
    const territory: TerritoryMap = { [selectedCountry]: {} }
    
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
        newErrors.country = "Please select a country"
      }
    }

    if (step === 2) {
      if (!formData.name?.trim()) {
        newErrors.name = "Region name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Region name must be at least 2 characters"
      }
    }

    if (step === 3) {
      if (selectedProvinces.size === 0) {
        newErrors.territory = "Please select at least one province"
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      toast.error("Please fix the errors before continuing")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("🗺️ Updating region...")

    try {
      // Build territory object
      const territory = buildTerritoryObject()
      
      const variables: UpdateRegionVariables = {
        id: region.id,
        name: formData.name || "",
        description: formData.description || null,
        color: formData.color || undefined,
        territory: territory
      }

      const res = await updateRegion({ variables })
      if (!res.data) throw new Error("Failed to update region")

      toast.dismiss(loadingToast)
      toast.success(
        `🎉 Region "${formData.name}" updated successfully!`,
        { duration: 4000 }
      )

      // Create updated region object for callback
      const updatedRegion: Regions_regions = {
        ...region,
        name: formData.name || "",
        description: formData.description || null,
        color: formData.color || "#475569",
        territory: territory
      }

      // Call success callback
      onSave(updatedRegion)

      // Close modal
      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("❌ Failed to update region")
      console.error("Error updating region:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (region) {
      setFormData({
        name: region.name || "",
        description: region.description || "",
        color: region.color || "#475569",
        territory: region.territory || { NL: {} }
      })
    }
    setErrors({})
    setCurrentStep(1)
    setSearchQuery("")
    setIsCountryPopoverOpen(false)
    onOpenChange(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      // STEP 1: Seleção de País
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Select Country</h3>
              <p className="text-sm text-muted-foreground">Choose the country for this region</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto">
              <Popover open={isCountryPopoverOpen} onOpenChange={setIsCountryPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isCountryPopoverOpen}
                    className="w-full justify-between"
                    disabled={isLoading}
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {countries.find(c => c.code === selectedCountry)?.name || "Select country..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." disabled={isLoading} />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {countries.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={country.code}
                            onSelect={(currentValue) => {
                              setSelectedCountry(currentValue === selectedCountry ? "" : currentValue)
                              setIsCountryPopoverOpen(false)
                              // Reset provinces and cities when country changes
                              setSelectedProvinces(new Set())
                              setSelectedCities({})
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCountry === country.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {country.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {errors.country && (
                <p className="text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>
        )

      // STEP 2: Nome, Descrição e Cor
      case 2:
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Update region name, description and color</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Region Name *
                </Label>
                <Input
                  id="name"
                  key={`name-${isOpen ? 'open' : 'closed'}`}
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Enter region name"
                  disabled={isLoading}
                  className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  key={`description-${isOpen ? 'open' : 'closed'}`}
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Brief description about the region..."
                  disabled={isLoading}
                  className="min-h-[100px] text-base resize-none"
                  rows={4}
                />
              </div>

              {/* Color Picker Component */}
              <ColorPicker
                value={formData.color || "#475569"}
                onChange={(color) => handleInputChange('color', color)}
                disabled={isLoading}
                label="Region Color (Optional)"
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
              <h3 className="text-lg font-medium text-foreground">Select Provinces & Cities</h3>
              <p className="text-sm text-muted-foreground">
                Choose the provinces and cities that are part of this region
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {/* Search Bar - Minimalista */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search province or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="pl-10 h-10 border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* Selected Provinces - Summary */}
              {selectedProvinces.size > 0 && (
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-600">
                      {selectedProvinces.size} selecionada{selectedProvinces.size !== 1 ? 's' : ''} ({Array.from(selectedProvinces).reduce((sum, pc) => sum + (selectedCities[pc]?.size || 0), 0)} cities)
                    </span>
                  </div>
                  
                  {/* Provinces Horizontal Scroll */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    {Array.from(selectedProvinces).map(provinceCode => {
                      const province = provincesForSelectedCountry.find(p => p.code === provinceCode)
                      if (!province) return null
                      
                      const cityCount = selectedCities[provinceCode]?.size || 0

                      return (
                        <div
                          key={provinceCode}
                          className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md hover:border-slate-400 transition-colors group"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          <span className="text-sm font-medium text-slate-900 whitespace-nowrap">
                            {province.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({cityCount})
                          </span>
                          <button
                            onClick={() => toggleProvinceSimple(provinceCode)}
                            className="ml-1 opacity-0 group-hover:opacity-100 hover:bg-slate-100 rounded-full p-0.5 transition-all"
                          >
                            <X className="w-3 h-3 text-slate-600" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Province Selection List */}
              <div className="border border-slate-200 rounded-lg max-h-[400px] overflow-y-auto">
                {filteredProvinces.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      No province found
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredProvinces.map((province) => {
                      const isSelected = selectedProvinces.has(province.code)
                      const citiesInProvince = selectedCities[province.code] || new Set()

                      return (
                        <div key={province.code} className="border-b last:border-b-0">
                          {/* Province Row */}
                          <button
                            onClick={() => toggleProvinceSimple(province.code)}
                            className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${
                              isSelected ? 'bg-slate-50' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                                isSelected ? 'bg-slate-900' : 'bg-slate-300'
                              }`} />
                              
                              <div className="text-left">
                                <p className="font-medium text-sm text-slate-900">{province.name}</p>
                                <p className="text-xs text-slate-500">{province.cities.length} cities</p>
                              </div>
                            </div>

                            <div className={`w-4 h-4 rounded border transition-all ${
                              isSelected 
                                ? 'bg-slate-900 border-slate-900' 
                                : 'border-slate-300'
                            } flex items-center justify-center`}>
                              {isSelected && (
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              )}
                            </div>
                          </button>

                          {/* Cities List - Expandable when province is selected */}
                          {isSelected && (
                            <div className="bg-slate-50/50 px-4 py-3 border-t border-slate-100">
                              <p className="text-xs font-medium text-slate-600 mb-2">Cities:</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {province.cities.map((city) => {
                                  const isCitySelected = citiesInProvince.has(city.code)
                                  return (
                                    <button
                                      key={city.code}
                                      onClick={() => toggleCity(province.code, city.code)}
                                      className={cn(
                                        "text-left px-2 py-1.5 rounded text-xs font-medium transition-colors",
                                        isCitySelected
                                          ? "bg-slate-900 text-white"
                                          : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
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

      // STEP 4: Review & Confirmação
      case 4:
        const territory = buildTerritoryObject()
        const totalCities = Object.values(selectedCities).reduce((sum, set) => sum + set.size, 0)
        const countryName = countries.find(c => c.code === selectedCountry)?.name || selectedCountry

        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Review & Confirm Changes</h3>
              <p className="text-sm text-muted-foreground">
                Please review the updated information before saving
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Basic Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Name</span>
                    <span className="text-sm font-medium text-right max-w-[60%]">{formData.name}</span>
                  </div>
                  {formData.description && (
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Description</span>
                      <span className="text-sm font-medium text-right max-w-[60%] line-clamp-3">
                        {formData.description}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Color</span>
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
                  Territory
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Country</span>
                    <span className="text-sm font-medium">{countryName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Provinces</span>
                    <span className="text-sm font-medium">{selectedProvinces.size}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Cities</span>
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
    <Dialog open={isOpen} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            Edit Region
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Update region information in your institution
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
                  className="flex items-center gap-1 text-xs"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[100px] text-xs"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Update Region
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
