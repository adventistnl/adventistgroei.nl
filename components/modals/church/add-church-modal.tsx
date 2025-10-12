"use client"

import React, { useState, useEffect } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Home, 
  Plus, 
  Save, 
  X, 
  Globe, 
  Calendar,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  ChevronsUpDown
} from "lucide-react"
import toast from "react-hot-toast"
import { churchTranslations } from "@/lib/translations/churches"
import { useChurches } from "@/hooks/use-churches"
import { CreateChurch, CreateChurchVariables } from "@/types/CreateChurch"
import { cn } from "@/lib/utils"
import { ChurchType } from "@/types/graphql-global-types"

export interface ChurchData {
  id: string
  institution_id: string
  name: string
  region_id: string
  contact_id?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface ContactData {
  id: string
  name?: string | null
  phone?: string | null
  mobile?: string | null
  email?: string | null
  country?: string | null
  city?: string | null
  address?: string | null
  full_address?: string | null
  postal_code?: string | null
  website?: string | null
  notes?: string | null
  is_primary: boolean
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface RegionData {
  id: string
  name: string
  institution_id: string
}

export interface AddChurchModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  regions: RegionData[]
  onSave?: (church: CreateChurch) => void
}

export function AddChurchModal({
  isOpen,
  onOpenChange,
  institutionId,
  regions = [],
  onSave
}: AddChurchModalProps) {
  const { t: tCommon } = useTranslation()
  const { createChurch } = useChurches()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateChurchVariables>({
    institution_id: institutionId,
    name: '',
    region_id: '',
    contactName: '',
    phone: '',
    email: '',
    city: '',
    type: ChurchType.Standard, // Tipo padrão
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [openRegion, setOpenRegion] = useState(false)
  const [openType, setOpenType] = useState(false)

  const typeList = [
    { value: ChurchType.Standard, label: 'Standard' },
    { value: ChurchType.Company, label: 'Company' },
    { value: ChurchType.Plant, label: 'Plant' },
  ]

  const totalSteps = 2

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution_id: institutionId,
        name: '',
        region_id: '',
        contactName: '',
        phone: '',
        email: '',
        city: '',
        type: ChurchType.Standard, // Tipo padrão
      })
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen, institutionId])

  const handleInputChange = (field: string, value: string | boolean | number) => {
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
        newErrors.name = "Church name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Church name must be at least 2 characters"
      }

      if (!formData.region_id) {
        newErrors.region_id = "Region is required"
      }
    }

    if (step === 2) {
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }

      if (!formData.phone?.trim()) {
        newErrors.phone = "Phone number is required"
      }

      if (!formData.contactName?.trim()) {
        newErrors.contactName = "Contact name is required"
      }

      if (!formData.city?.trim()) {
        newErrors.city = "City is required"
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

      // Log errors for debugging
      console.error("Validation errors:", errors);
      return;
    }

    setIsLoading(true)
    const loadingToast = toast.loading("Creating church...")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const variables: CreateChurchVariables = {
        institution_id: institutionId,
        name: formData.name!.trim(),
        region_id: formData.region_id!,
        city: formData.city,
        email: formData.email,
        phone: formData.phone,
        contactName: formData.contactName,
        type: formData.type,
      }
      const res = await createChurch({ variables })
      if (!res || !res.data) {
        throw new Error("Failed to create church")
      }

      toast.dismiss(loadingToast)
      toast.success("Church created successfully", {
        duration: 3000,
        icon: '⛪'
      })

      if (onSave) {
        onSave(res.data)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to create church")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      institution_id: institutionId,
      name: '',
      region_id: '',
      contactName: '',
      phone: '',
      email: '',
      city: '',
    })
    setErrors({})
    setCurrentStep(1)
    onOpenChange(false)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Enter the church name, select the region, and type</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  Church Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter church name"
                  disabled={isLoading}
                  className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region_id" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Region *
                </Label>
                <Popover open={openRegion} onOpenChange={setOpenRegion}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openRegion}
                      className={cn(
                        "w-full h-10 justify-between font-normal",
                        !formData.region_id && "text-muted-foreground",
                        errors.region_id && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      {formData.region_id
                        ? regions.find(region => region.id === formData.region_id)?.name
                        : "Select region"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search region..." />
                      <CommandList>
                        <CommandEmpty>No region found.</CommandEmpty>
                        <CommandGroup>
                          {regions.map((region) => (
                            <CommandItem
                              key={region.id}
                              value={region.name}
                              onSelect={() => {
                                handleInputChange('region_id', region.id)
                                setOpenRegion(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.region_id === region.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                              {region.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.region_id && (
                  <p className="text-sm text-red-600">{errors.region_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  Church Type *
                </Label>
                <Popover open={openType} onOpenChange={setOpenType}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openType}
                      className={cn(
                        "w-full h-10 justify-between font-normal",
                        !formData.type && "text-muted-foreground",
                        errors.type && "border-red-500"
                      )}
                      disabled={isLoading}
                    >
                      {formData.type || "Select type"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search type..." />
                      <CommandList>
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          {typeList.map((type) => (
                            <CommandItem
                              key={type.label}
                              aria-placeholder={type.label}
                              value={type.value}
                              onSelect={() => {
                                handleInputChange('type', type.value)
                                setOpenType(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  (formData.type ?? ChurchType.Standard) === type.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {type.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Contact Details</h3>
              <p className="text-sm text-muted-foreground">Add contact information for the church</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Contact Name
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contactName || ''}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder="Enter contact name"
                  disabled={isLoading}
                  className={`h-10 ${errors.contactName ? 'border-red-500' : ''}`}
                />
                {errors.contactName && (
                  <p className="text-sm text-red-600">{errors.contactName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Contact Email
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  disabled={isLoading}
                  className={`h-10 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone
                </Label>
                <Input
                  id="contact_phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  disabled={isLoading}
                  className={`h-10 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_city" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  City
                </Label>
                <Input
                  id="contact_city"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  disabled={isLoading}
                  className={`h-10 ${errors.city ? 'border-red-500' : ''}`}

                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city}</p>
                )}
              </div>
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
            <Home className="w-5 h-5 text-muted-foreground" />
            Create Church
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new church to your organization
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
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Save
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
