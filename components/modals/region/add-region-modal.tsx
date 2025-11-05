"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Save, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Check,
  X,
  Map,
  Building2,
  Eye,
  Palette
} from "lucide-react"
import toast from "react-hot-toast"
import { useRegions } from "@/hooks/use-regions"
import { CreateRegion } from "@/types/CreateRegion"
import { RegionCreateDto } from "@/types/graphql-global-types"
import { 
  netherlandsProvinces, 
  Province, 
  City,
  regionColors,
  Territory
} from "@/lib/netherlands-provinces"
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from '@/components/ui/shadcn-io/color-picker'

export interface AddRegionFormData {
  name: string
  description?: string
  color: string
  territory: Territory
}

// Cores pré-definidas para seleção rápida - Dark Tones
const PRESET_COLORS = [
  { name: 'Slate', value: '#475569' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Zinc', value: '#52525B' },
  { name: 'Stone', value: '#57534E' },
  { name: 'Red', value: '#991B1B' },
  { name: 'Orange', value: '#9A3412' },
  { name: 'Amber', value: '#92400E' },
  { name: 'Yellow', value: '#854D0E' },
  { name: 'Lime', value: '#3F6212' },
  { name: 'Green', value: '#14532D' },
  { name: 'Emerald', value: '#064E3B' },
  { name: 'Teal', value: '#134E4A' },
  { name: 'Cyan', value: '#164E63' },
  { name: 'Sky', value: '#0C4A6E' },
  { name: 'Blue', value: '#1E3A8A' },
  { name: 'Indigo', value: '#312E81' },
  { name: 'Violet', value: '#4C1D95' },
  { name: 'Purple', value: '#581C87' },
  { name: 'Fuchsia', value: '#701A75' },
  { name: 'Pink', value: '#831843' },
]

export interface AddRegionModalProps {
  children: React.ReactNode
  onSuccess: (data: CreateRegion) => void
}

export function AddRegionModal({
  children,
  onSuccess
}: AddRegionModalProps) {
  const { createRegion } = useRegions();

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)
  
  // Form Data
  const [formData, setFormData] = useState<AddRegionFormData>({
    name: "",
    description: "",
    color: "#475569", // Slate dark
    territory: { NL: {} }
  })
  
  // Province and City Selection State
  const [selectedProvinces, setSelectedProvinces] = useState<Set<string>>(new Set())
  const [selectedCities, setSelectedCities] = useState<Record<string, Set<string>>>({})
  const [searchQuery, setSearchQuery] = useState("")
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 3 // Nome/Descrição/Cor, Províncias, Review
  const { i18n } = useTranslation()
  
  // Get translations for current language
  const t_structure = structureTranslations[i18n.language as keyof typeof structureTranslations] || structureTranslations.en

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        color: "#475569",
        territory: { NL: {} }
      })
      setSelectedProvinces(new Set())
      setSelectedCities({})
      setSearchQuery("")
      setErrors({})
      setCurrentStep(1)
      setIsColorPickerOpen(false)
    }
  }, [isOpen])

  // Input handlers
  const handleInputChange = (field: keyof AddRegionFormData, value: string) => {
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
  const toggleProvince = (provinceCode: string) => {
    setSelectedProvinces(prev => {
      const newSet = new Set(prev)
      if (newSet.has(provinceCode)) {
        newSet.delete(provinceCode)
        // Remove all cities from this province
        setSelectedCities(prevCities => {
          const newCities = { ...prevCities }
          delete newCities[provinceCode]
          return newCities
        })
      } else {
        newSet.add(provinceCode)
      }
      return newSet
    })
  }

  // Quando seleciona província, automaticamente seleciona todas as cidades
  const toggleProvinceSimple = (provinceCode: string) => {
    setSelectedProvinces(prev => {
      const newSet = new Set(prev)
      const province = netherlandsProvinces.find(p => p.code === provinceCode)
      
      if (newSet.has(provinceCode)) {
        // Desselecionar província e remover suas cidades
        newSet.delete(provinceCode)
        setSelectedCities(prevCities => {
          const newCities = { ...prevCities }
          delete newCities[provinceCode]
          return newCities
        })
      } else {
        // Selecionar província e TODAS suas cidades automaticamente
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

  // Filtered provinces for search
  const filteredProvinces = useMemo(() => {
    if (!searchQuery.trim()) return netherlandsProvinces
    
    const query = searchQuery.toLowerCase()
    return netherlandsProvinces.filter(province => 
      province.name.toLowerCase().includes(query) ||
      province.cities.some(city => city.name.toLowerCase().includes(query))
    )
  }, [searchQuery])

  // Build territory object
  const buildTerritoryObject = (): Territory => {
    const territory: Territory = { NL: {} }
    
    selectedProvinces.forEach(provinceCode => {
      const cityCodes = selectedCities[provinceCode]
      if (cityCodes && cityCodes.size > 0) {
        territory.NL[provinceCode] = Array.from(cityCodes)
      }
    })
    
    return territory
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name?.trim()) {
        newErrors.name = "Region name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Region name must be at least 2 characters"
      }
    }

    if (step === 2) {
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
    // Validate all steps
    if (!validateStep(1) || !validateStep(2)) {
      toast.error("Por favor, corrija os erros antes de continuar")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("🗺️ Criando nova região...")

    try {
      // Build territory object
      const territory = buildTerritoryObject()
      
      // Update formData with territory
      const finalData = {
        ...formData,
        territory
      }

      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const res = await createRegion({
        variables: {
          name: finalData.name,
          description: finalData.description || "",
        }
      })
      
      if (!res.data) throw new Error("Failed to create region")

      toast.success(
        `🎉 Região "${finalData.name}" criada com ${selectedProvinces.size} províncias!`,
        { duration: 4000 }
      )
      
      // Call success callback
      onSuccess(res.data)

      // Close modal
      setIsOpen(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("❌ Falha ao criar região")
      console.error("Error creating region:", error)
    } finally {
      toast.dismiss(loadingToast)
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
    setSelectedProvinces(new Set())
    setSelectedCities({})
    setSearchQuery("")
    setErrors({})
    setCurrentStep(1)
    setIsColorPickerOpen(false)
    setIsOpen(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      // STEP 1: Nome, Descrição e Cor
      case 1:
        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Enter the region name, description and color</p>
            </div>
            
            <div className="space-y-6 max-w-md mx-auto">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Region Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter region name"
                  disabled={isLoading}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the region purpose and activities"
                  disabled={isLoading}
                  className="min-h-[100px] resize-none"
                />
              </div>

              {/* Color Selector - Minimalista */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Region Color</Label>
                <div className="flex items-center gap-3">
                  {/* Preview Circle */}
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: formData.color }}
                  />
                  
                  {/* Color Code */}
                  <span className="text-xs font-mono text-muted-foreground flex-1">
                    {formData.color}
                  </span>

                  {/* Button to open color picker */}
                  <Dialog open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        type="button"
                        disabled={isLoading}
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Choose Color
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-base">Choose Region Color</DialogTitle>
                        <DialogDescription className="text-sm">
                          Select a color or use the custom picker
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        {/* Preset Colors Grid - Compact */}
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                            Preset Colors
                          </Label>
                          <div className="grid grid-cols-10 gap-2">
                            {PRESET_COLORS.map((presetColor) => (
                              <button
                                key={presetColor.value}
                                type="button"
                                onClick={() => {
                                  handleInputChange('color', presetColor.value)
                                  setIsColorPickerOpen(false)
                                }}
                                className={cn(
                                  "w-8 h-8 rounded-md border-2 hover:scale-110 transition-transform relative",
                                  formData.color === presetColor.value 
                                    ? "border-slate-900 ring-2 ring-slate-900 ring-offset-1" 
                                    : "border-gray-200"
                                )}
                                style={{ backgroundColor: presetColor.value }}
                                title={presetColor.name}
                              >
                                {formData.color === presetColor.value && (
                                  <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow" strokeWidth={3} />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        {/* Custom Color Picker - Minimal */}
                        <div>
                          <Label className="text-xs font-medium text-muted-foreground mb-3 block">
                            Custom Color
                          </Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={formData.color}
                              onChange={(e) => handleInputChange('color', e.target.value)}
                              className="h-10 w-20 rounded border border-gray-200 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={formData.color}
                              onChange={(e) => handleInputChange('color', e.target.value)}
                              placeholder="#000000"
                              className="flex-1 font-mono text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        )

      // STEP 2: Seleção Minimalista de Províncias
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Selecionar Províncias</h3>
              <p className="text-sm text-muted-foreground">
                Escolha as províncias que fazem parte desta região
              </p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              {/* Search Bar - Minimalista */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar província..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* Selected Provinces - Carrossel Horizontal Minimalista */}
              {selectedProvinces.size > 0 && (
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-600">
                      {selectedProvinces.size} selecionada{selectedProvinces.size !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* Carrossel Horizontal */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    {Array.from(selectedProvinces).map(provinceCode => {
                      const province = netherlandsProvinces.find(p => p.code === provinceCode)
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
                            onClick={(e) => {
                              e.preventDefault()
                              toggleProvinceSimple(provinceCode)
                            }}
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

              {/* Province Selection List - Ultra Minimalista Monocromático com Grupos */}
              <div className="border border-slate-200 rounded-lg max-h-[400px] overflow-y-auto">
                {filteredProvinces.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      Nenhuma província encontrada
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Group by Region */}
                    {(['north', 'east', 'west', 'south'] as const).map((region) => {
                      const provincesInRegion = filteredProvinces.filter(p => p.region === region)
                      if (provincesInRegion.length === 0) return null

                      const regionLabel = {
                        north: 'Norte',
                        east: 'Leste',
                        west: 'Oeste',
                        south: 'Sul'
                      }[region]

                      return (
                        <div key={region} className="border-b border-slate-100 last:border-b-0">
                          {/* Section Header - Ultra Minimalista */}
                          <div className="sticky top-0 bg-white px-4 py-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                {regionLabel}
                              </span>
                              <span className="text-xs text-slate-400">
                                ({provincesInRegion.length})
                              </span>
                            </div>
                          </div>

                          {/* Provinces in this region */}
                          <div className="divide-y divide-slate-100">
                            {provincesInRegion.map((province) => {
                              const isSelected = selectedProvinces.has(province.code)

                              return (
                                <button
                                  key={province.code}
                                  onClick={() => toggleProvinceSimple(province.code)}
                                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors ${
                                    isSelected ? 'bg-slate-50' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Círculo monocromático simples */}
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                                      isSelected ? 'bg-slate-900' : 'bg-slate-300'
                                    }`} />
                                    
                                    <div className="text-left">
                                      <p className={`text-sm transition-colors ${
                                        isSelected ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                                      }`}>
                                        {province.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {province.cities.length} cidades
                                      </p>
                                    </div>
                                  </div>

                                  {/* Checkbox minimalista */}
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
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </>
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

      // STEP 3: Review - Minimalista e Monocromático
      case 3:
        const territory = buildTerritoryObject()
        const totalCities = Object.values(selectedCities).reduce((sum, set) => sum + set.size, 0)

        return (
          <div className="space-y-8 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Review & Confirm</h3>
              <p className="text-sm text-muted-foreground">
                Please review the information before creating the region
              </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              {/* Basic Information - Minimalista */}
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
                        style={{ backgroundColor: formData.color }}
                      />
                      <span className="text-xs font-mono text-muted-foreground">{formData.color}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Territory Information - Minimalista */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Territory
                </h4>
                <div className="space-y-2">
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

              {/* Province List - Minimalista */}
              {selectedProvinces.size > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Selected Provinces
                  </h4>
                  <div className="space-y-2">
                    {Array.from(selectedProvinces).map(provinceCode => {
                      const province = netherlandsProvinces.find(p => p.code === provinceCode)
                      if (!province) return null

                      const cities = selectedCities[provinceCode]
                      const cityCount = cities?.size || 0

                      return (
                        <div 
                          key={provinceCode}
                          className="flex justify-between py-2 border-b border-border/50"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: formData.color }}
                            />
                            <span className="text-sm font-medium">{province.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {cityCount} {cityCount === 1 ? 'city' : 'cities'}
                          </span>
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
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
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
                  Continue
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Create Region
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
