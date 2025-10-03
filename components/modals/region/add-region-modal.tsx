"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
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

export interface AddRegionFormData {
  name: string
  description?: string
  email: string
  phone?: string
  website?: string
}

export interface AddRegionModalProps {
  children: React.ReactNode
  institutionId: string
  onSuccess?: (data: AddRegionFormData) => void
}

export function AddRegionModal({
  children,
  institutionId,
  onSuccess
}: AddRegionModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<AddRegionFormData>({
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
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        email: "",
        phone: "",
        website: "",
      })
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen])

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
    const loadingToast = toast.loading("🗺️ Creating new region...")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast.dismiss(loadingToast)
      toast.success(
        `🎉 Region "${formData.name}" created successfully!`,
        { duration: 4000 }
      )

      // Call success callback
      onSuccess?.(formData)

      // Close modal
      setIsOpen(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("❌ Failed to create region")
      console.error("Error creating region:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      email: "",
      phone: "",
      website: "",
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
              <p className="text-sm text-muted-foreground">Enter the region name</p>
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
              <p className="text-sm text-muted-foreground">Add contact details for the region</p>
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
              <p className="text-sm text-muted-foreground">Add a description about the region</p>
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
    <Dialog open={isOpen} onOpenChange={!isLoading ? setIsOpen : undefined}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text--600" />
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
                  className="flex items-center gap-1 text-xs  hover:bg--700 text-white"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  size="sm"
                  className="min-w-[100px] text-xs  hover:bg--700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-1" />
                      Add Region
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
