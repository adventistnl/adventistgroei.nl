"use client"

import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { 
  CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  Building, 
  DollarSign, 
  Settings,
  CheckCircle,
  Calendar,
  Megaphone,
  Users,
  MapPin
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { projectTranslations } from "@/lib/translations/projects"
import { mockDepartments } from "@/data/mockData"
import { ProjectTableData } from "@/components/projects/projects-table"

export interface ProjectFormData {
  title: string
  description: string
  department_id: string
  budget: number
  start_at: Date
  end_at: Date
  language_preference: string
  is_private: boolean
  required_volunteers: boolean
  is_event: boolean
  type: "Local" | "Global"
  // Event data (optional)
  event?: {
    title: string
    description: string
    type: "evangelism" | "show"
    max_participants: number
    ticket_amount: number
    location: string
    subscription_expires_at: Date
  }
  // Communication data (optional)
  communication?: {
    title: string
    content: string
    type: "announcement" | "notification" | "newsletter"
    priority: "high" | "medium" | "low"
    schedule_at: Date
    recipients: Array<{
      target_type: "institution" | "region" | "department" | "church" | "user"
      target_id: string
    }>
  }
}

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
}

export function AddProjectModal({ isOpen, onClose, onSubmit }: AddProjectModalProps) {
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    department_id: "",
    budget: 0,
    start_at: new Date(),
    end_at: new Date(),
    language_preference: "pt",
    is_private: false,
    required_volunteers: false,
    is_event: false,
    type: "Local",
  })
  
  const [createEvent, setCreateEvent] = useState(false)
  const [createCommunication, setCreateCommunication] = useState(false)

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({})

  const steps = [
    {
      id: 0,
      title: t.steps.projectInfo,
      description: "Informações básicas do projeto",
      icon: Globe
    },
    {
      id: 1,
      title: t.steps.budgetDetails,
      description: "Orçamento e cronograma",
      icon: DollarSign
    },
    {
      id: 2,
      title: t.steps.additionalOptions,
      description: "Configurações adicionais",
      icon: Settings
    },
    {
      id: 3,
      title: t.steps.review,
      description: "Revisar e finalizar",
      icon: CheckCircle
    }
  ]

  const getDepartmentName = (id: string) => {
    const dept = mockDepartments.find(d => d.id === id)
    return dept?.name || "Departamento não encontrado"
  }

  const getDepartmentBudget = (id: string) => {
    const dept = mockDepartments.find(d => d.id === id)
    return dept?.annual_budget || 0
  }

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {}

    switch (currentStep) {
      case 0: // Project Info
        if (!formData.title.trim()) {
          newErrors.title = "Title is required"
        }
        if (!formData.description.trim()) {
          newErrors.description = "Description is required"
        }
        if (!formData.department_id) {
          newErrors.department_id = "Department is required"
        }
        break
      
      case 1: // Budget Details
        if (formData.budget <= 0) {
          newErrors.budget = "Budget must be greater than 0"
        }
        if (formData.start_at >= formData.end_at) {
          newErrors.end_at = "End date must be after start date"
        }
        break
      
      case 2: // Additional Options - no required validation
        break
        
      case 3: // Review - final validation
        return validateForm()
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }
    if (!formData.department_id) {
      newErrors.department_id = "Department is required"
    }
    if (formData.budget <= 0) {
      newErrors.budget = "Budget must be greater than 0"
    }
    if (formData.start_at >= formData.end_at) {
      newErrors.end_at = "End date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep === steps.length - 1 && validateForm()) {
      onSubmit(formData)
      // Reset form
      setFormData({
        title: "",
        description: "",
        department_id: "",
        budget: 0,
        start_at: new Date(),
        end_at: new Date(),
        language_preference: "pt",
        is_private: false,
        required_volunteers: false,
        is_event: false,
        type: "Local",
      })
      setCurrentStep(0)
      setCreateEvent(false)
      setCreateCommunication(false)
      setErrors({})
    } else {
      handleNext()
    }
  }

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      department_id: "",
      budget: 0,
      start_at: new Date(),
      end_at: new Date(),
      language_preference: "pt",
      is_private: false,
      required_volunteers: false,
      is_event: false,
      type: "Local",
    })
    setCurrentStep(0)
    setCreateEvent(false)
    setCreateCommunication(false)
    setErrors({})
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderProjectInfoStep()
      case 1:
        return renderBudgetDetailsStep()
      case 2:
        return renderAdditionalOptionsStep()
      case 3:
        return renderReviewStep()
      default:
        return null
    }
  }

  const renderProjectInfoStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          {t.projectTitle} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          placeholder={t.enterProjectTitle}
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          {t.projectDescription} <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder={t.describeProject}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className={cn("min-h-[100px]", errors.description ? "border-red-500" : "")}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">
          {t.department} <span className="text-red-500">*</span>
        </Label>
        <Select
          value={formData.department_id}
          onValueChange={(value) => setFormData({ ...formData, department_id: value })}
        >
          <SelectTrigger className={errors.department_id ? "border-red-500" : ""}>
            <SelectValue placeholder={t.selectDepartment} />
          </SelectTrigger>
          <SelectContent>
            {mockDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  <span>{dept.name}</span>
                  <Badge variant="outline" className="ml-2">
                    R$ {dept.annual_budget.toLocaleString()}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.department_id && (
          <p className="text-sm text-red-500">{errors.department_id}</p>
        )}
        {formData.department_id && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Orçamento anual do departamento: <strong>R$ {getDepartmentBudget(formData.department_id).toLocaleString()}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderBudgetDetailsStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="budget">
          {t.budget} (R$) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="budget"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={formData.budget || ""}
          onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
          className={errors.budget ? "border-red-500" : ""}
        />
        {errors.budget && (
          <p className="text-sm text-red-500">{errors.budget}</p>
        )}
        {formData.department_id && formData.budget > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Percentual do orçamento departamental: <strong>{((formData.budget / getDepartmentBudget(formData.department_id)) * 100).toFixed(1)}%</strong>
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.startDate} <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.start_at && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_at ? (
                  format(formData.start_at, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formData.start_at}
                onSelect={(date) => date && setFormData({ ...formData, start_at: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>{t.endDate} <span className="text-red-500">*</span></Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.end_at && "text-muted-foreground",
                  errors.end_at && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.end_at ? (
                  format(formData.end_at, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={formData.end_at}
                onSelect={(date) => date && setFormData({ ...formData, end_at: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.end_at && (
            <p className="text-sm text-red-500">{errors.end_at}</p>
          )}
        </div>
      </div>
    </div>
  )

  const renderAdditionalOptionsStep = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t.languagePreference}</Label>
        <Select
          value={formData.language_preference}
          onValueChange={(value) => setFormData({ ...formData, language_preference: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt">Português</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="nl">Nederlands</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">{t.privateProject}</Label>
            <p className="text-sm text-muted-foreground">
              {t.privateProjectDesc}
            </p>
          </div>
          <Switch
            checked={formData.is_private}
            onCheckedChange={(checked) => setFormData({ ...formData, is_private: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">{t.requestVolunteers}</Label>
            <p className="text-sm text-muted-foreground">
              {t.requestVolunteersDesc}
            </p>
          </div>
          <Switch
            checked={formData.required_volunteers}
            onCheckedChange={(checked) => setFormData({ ...formData, required_volunteers: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Projeto é um Evento</Label>
            <p className="text-sm text-muted-foreground">
              Marque se este projeto incluirá eventos públicos
            </p>
          </div>
          <Switch
            checked={formData.is_event}
            onCheckedChange={(checked) => setFormData({ ...formData, is_event: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Projeto</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "Local" | "Global") => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Local">Local</SelectItem>
              <SelectItem value="Global">Global</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          Opções de Comunicação
        </h4>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Criar Comunicação</Label>
            <p className="text-sm text-muted-foreground">
              Criar um comunicado sobre este projeto
            </p>
          </div>
          <Switch
            checked={createCommunication}
            onCheckedChange={setCreateCommunication}
          />
        </div>

        {formData.is_event && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Criar Evento</Label>
              <p className="text-sm text-muted-foreground">
                Registrar evento associado a este projeto
              </p>
            </div>
            <Switch
              checked={createEvent}
              onCheckedChange={setCreateEvent}
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Resumo do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Título:</span>
              <p className="font-medium">{formData.title}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Departamento:</span>
              <p className="font-medium">{getDepartmentName(formData.department_id)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Orçamento:</span>
              <p className="font-medium">R$ {formData.budget.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Tipo:</span>
              <p className="font-medium">{formData.type}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Período:</span>
              <p className="font-medium">
                {format(formData.start_at, "dd/MM/yyyy")} - {format(formData.end_at, "dd/MM/yyyy")}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Idioma:</span>
              <p className="font-medium">{formData.language_preference.toUpperCase()}</p>
            </div>
          </div>
          
          <div>
            <span className="text-muted-foreground">Descrição:</span>
            <p className="font-medium mt-1">{formData.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.is_private && (
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                Privado
              </Badge>
            )}
            {formData.required_volunteers && (
              <Badge variant="outline" className="text-purple-600 border-purple-200">
                <Users className="w-3 h-3 mr-1" />
                Voluntários
              </Badge>
            )}
            {formData.is_event && (
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Calendar className="w-3 h-3 mr-1" />
                Evento
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {(createEvent || createCommunication) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              Ações Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {createEvent && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Evento será criado automaticamente</span>
                </div>
              )}
              {createCommunication && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Comunicação será criada automaticamente</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t.modal.createProject}
          </DialogTitle>
          <DialogDescription>
            {steps[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  isActive ? "border-primary bg-primary text-primary-foreground" :
                  isCompleted ? "border-green-500 bg-green-500 text-white" :
                  "border-muted-foreground text-muted-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-2 transition-colors",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </div>
            )
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={currentStep === 0 ? handleClose : handlePrevious}
              className="gap-2"
            >
              {currentStep === 0 ? (
                "Cancelar"
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </>
              )}
            </Button>
            
            <Button type="submit" className="gap-2">
              {currentStep === steps.length - 1 ? (
                "Criar Projeto"
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}