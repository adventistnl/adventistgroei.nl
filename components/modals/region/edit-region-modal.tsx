"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  MapPin, 
  Save, 
  Globe, 
  Mail,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2
} from "lucide-react"
import toast from "react-hot-toast"
import { useRegions } from "@/hooks/use-regions"
import { UpdateRegion, UpdateRegionVariables } from "@/types/UpdateRegion"

export interface EditRegionFormData {
  name: string
  description?: string
  email: string
  phone?: string
  website?: string
}

export interface RegionData {
  id: string
  institution_id: string
  name: string
  description?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  parent_region_id?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface ParentRegionData {
  id: string
  name: string
  institution_id: string
}

export interface EditRegionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  region: RegionData
  parentRegions?: ParentRegionData[]
  onSave: (region: RegionData) => void
}

export function EditRegionModal({
  isOpen,
  onOpenChange,
  region,
  parentRegions = [],
  onSave
}: EditRegionModalProps) {
  const { updateRegion } = useRegions()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<EditRegionFormData>({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 3
  const { i18n } = useTranslation()
  
  // Get translations for current language
  const t_structure = structureTranslations[i18n.language as keyof typeof structureTranslations] || structureTranslations.en

  useEffect(() => {
    if (region && isOpen) {
      setFormData({
        name: region.name || "",
        description: region.description || "",
        email: region.email || "",
        phone: region.phone || "",
        website: region.website || "",
      })
      setErrors({})
      setCurrentStep(1)
    }
  }, [region, isOpen])

  const handleInputChange = (field: keyof EditRegionFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === "" ? undefined : value
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
        newErrors.name = "Region name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Region name must be at least 2 characters"
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
    const loadingToast = toast.loading("🗺️ Updating region...")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const variables: UpdateRegionVariables = {
        id: region.id,
        name: formData.name || "",
        institution_id: region.institution_id,
        parent_region_id: null,
        description: formData.description || null,
        email: formData.email || null,
        phone: formData.phone || null,
        website: formData.website || null,
      }

      const res = await updateRegion({ variables })
      if (!res.data) throw new Error("Failed to update region")

      toast.success(
        `🎉 Region "${formData.name}" updated successfully!`,
        { duration: 4000 }
      )

      // Create updated region object for callback
      const updatedRegion: RegionData = {
        ...region,
        name: formData.name || "",
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        parent_region_id: null,
        updated_at: new Date().toISOString(),
        updated_by: "current_user"
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
      toast.dismiss(loadingToast)
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (region) {
      setFormData({
        name: region.name || "",
        description: region.description || "",
        email: region.email || "",
        phone: region.phone || "",
        website: region.website || "",
      })
    }
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
              <p className="text-sm text-muted-foreground">Update the region details</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Region Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter region name"
                  disabled={isLoading}
                  className={`h-12 text-base ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>


            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
              <p className="text-sm text-muted-foreground">Update contact details for the region</p>
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
                  placeholder="contact@region.org"
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
                  placeholder="https://www.region.org"
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
              <p className="text-sm text-muted-foreground">Update description about the region</p>
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
                  placeholder="Brief description about the region, its mission, and activities..."
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
