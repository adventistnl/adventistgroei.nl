"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Layers, 
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
  Home,
  DollarSign
} from "lucide-react"
import toast from "react-hot-toast"
import { departmentTranslations } from "@/lib/translations/departments"

export interface DepartmentData {
  id: string
  institution_id: string
  church_id: string
  name: string
  description: string
  annual_budget: number
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

export interface ChurchData {
  id: string
  name: string
  institution_id: string
}

export interface AddDepartmentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  institutionId: string
  churches: ChurchData[]
  onSave?: (department: DepartmentData) => void
}

export function AddDepartmentModal({
  isOpen,
  onOpenChange,
  institutionId,
  churches = [],
  onSave
}: AddDepartmentModalProps) {
  const { t: tCommon } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<DepartmentData & { contact: Partial<ContactData> }>>({
    institution_id: institutionId,
    church_id: '',
    name: '',
    description: '',
    annual_budget: 0,
    contact: {
      name: '',
      phone: '',
      mobile: '',
      email: '',
      country: '',
      city: '',
      address: '',
      full_address: '',
      postal_code: '',
      website: '',
      notes: '',
      is_primary: true
    }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 2

  useEffect(() => {
    if (isOpen) {
      setFormData({
        institution_id: institutionId,
        church_id: '',
        name: '',
        description: '',
        annual_budget: 0,
        contact: {
          name: '',
          phone: '',
          mobile: '',
          email: '',
          country: '',
          city: '',
          address: '',
          full_address: '',
          postal_code: '',
          website: '',
          notes: '',
          is_primary: true
        }
      })
      setErrors({})
      setCurrentStep(1)
    }
  }, [isOpen, institutionId])

  const handleInputChange = (field: string, value: string | number | boolean) => {
    if (field.startsWith('contact.')) {
      const contactField = field.replace('contact.', '')
      setFormData(prev => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
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
        newErrors.name = "Department name is required"
      } else if (formData.name.trim().length < 2) {
        newErrors.name = "Department name must be at least 2 characters"
      }

      if (!formData.church_id) {
        newErrors.church_id = "Church is required"
      }

      if (!formData.description?.trim()) {
        newErrors.description = "Description is required"
      } else if (formData.description.trim().length < 10) {
        newErrors.description = "Description must be at least 10 characters"
      }

      if (!formData.annual_budget || formData.annual_budget <= 0) {
        newErrors.annual_budget = "Annual budget is required and must be greater than 0"
      }
    }

    if (step === 2) {
      if (formData.contact?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
        newErrors['contact.email'] = "Please enter a valid email address"
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
    const loadingToast = toast.loading("Creating department...")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newDepartment: DepartmentData = {
        id: `department_${Date.now()}`,
        institution_id: institutionId,
        church_id: formData.church_id!,
        name: formData.name!.trim(),
        description: formData.description!.trim(),
        annual_budget: formData.annual_budget!,
        contact_id: null, // Will be set after contact creation
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'current_user',
        updated_by: 'current_user',
        is_deleted: false
      }

      toast.dismiss(loadingToast)
      toast.success("Department created successfully", {
        duration: 3000,
        icon: '🏢'
      })

      if (onSave) {
        onSave(newDepartment)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Failed to create department")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      institution_id: institutionId,
      church_id: '',
      name: '',
      description: '',
      annual_budget: 0,
      contact: {
        name: '',
        phone: '',
        mobile: '',
        email: '',
        country: '',
        city: '',
        address: '',
        full_address: '',
        postal_code: '',
        website: '',
        notes: '',
        is_primary: true
      }
    })
    setErrors({})
    setCurrentStep(1)
    onOpenChange(false)
  }

  const selectedChurch = churches.find(church => church.id === formData.church_id)

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in-0 duration-300">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-foreground">Basic Information</h3>
              <p className="text-sm text-muted-foreground">Enter department details and select the church</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-muted-foreground" />
                  Department Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter department name"
                  disabled={isLoading}
                  className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="church_id" className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  Church *
                </Label>
                <Select
                  value={formData.church_id || ''}
                  onValueChange={(value) => handleInputChange('church_id', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className={`h-10 ${errors.church_id ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Select church" />
                  </SelectTrigger>
                  <SelectContent>
                    {churches.map((church) => (
                      <SelectItem key={church.id} value={church.id}>
                        {church.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.church_id && (
                  <p className="text-sm text-red-600">{errors.church_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter department description"
                  disabled={isLoading}
                  className={`min-h-[80px] resize-none ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="annual_budget" className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Annual Budget *
                </Label>
                <Input
                  id="annual_budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.annual_budget || ''}
                  onChange={(e) => handleInputChange('annual_budget', parseFloat(e.target.value) || 0)}
                  placeholder="Enter annual budget"
                  disabled={isLoading}
                  className={`h-10 ${errors.annual_budget ? 'border-red-500' : ''}`}
                />
                {errors.annual_budget && (
                  <p className="text-sm text-red-600">{errors.annual_budget}</p>
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
              <p className="text-sm text-muted-foreground">Add contact information for the department</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div className="space-y-2">
                <Label htmlFor="contact_name" className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Contact Name
                </Label>
                <Input
                  id="contact_name"
                  value={formData.contact?.name || ''}
                  onChange={(e) => handleInputChange('contact.name', e.target.value)}
                  placeholder="Enter contact name"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Contact Email
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact?.email || ''}
                  onChange={(e) => handleInputChange('contact.email', e.target.value)}
                  placeholder="Enter email address"
                  disabled={isLoading}
                  className={`h-10 ${errors['contact.email'] ? 'border-red-500' : ''}`}
                />
                {errors['contact.email'] && (
                  <p className="text-sm text-red-600">{errors['contact.email']}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  Phone
                </Label>
                <Input
                  id="contact_phone"
                  value={formData.contact?.phone || ''}
                  onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                  placeholder="Enter phone number"
                  disabled={isLoading}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_city" className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  City
                </Label>
                <Input
                  id="contact_city"
                  value={formData.contact?.city || ''}
                  onChange={(e) => handleInputChange('contact.city', e.target.value)}
                  placeholder="Enter city"
                  disabled={isLoading}
                  className="h-10"
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
            <Layers className="w-5 h-5 text-muted-foreground" />
            Create Department
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new department to your organization
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
