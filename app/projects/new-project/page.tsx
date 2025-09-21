"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, useSearchParams } from "next/navigation"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { 
  Globe, 
  Building, 
  DollarSign, 
  Settings,
  CheckCircle,
  Calendar as CalendarIcon,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Plus,
  Minus,
  AlertTriangle,
  Calculator,
  Target,
  Clock,
  Tag,
  Home
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { mockDepartments, mockUsers } from "@/data/mockData"
import { useInstitution } from "@/contexts/institution-context"
import { projectRegisterTranslations } from "@/lib/translations/project-register"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Predefined activities with all values defined
const PREDEFINED_ACTIVITIES = [
  {
    name: "Reforma do Templo",
    description: "Reforma geral do templo incluindo pintura, piso e iluminação",
    budget_amount: 15000,
    funding_type: "shared" as const,
    church_percent: 40,
    institution_percent: 60,
    tags: ["Reforma", "Equipamentos"]
  },
  {
    name: "Compra de Equipamentos de Som",
    description: "Aquisição de sistema de som completo para o templo",
    budget_amount: 8000,
    funding_type: "shared" as const,
    church_percent: 50,
    institution_percent: 50,
    tags: ["Equipamentos"]
  },
  {
    name: "Viagem Missionária",
    description: "Viagem para evangelismo em comunidades carentes",
    budget_amount: 5000,
    funding_type: "shared" as const,
    church_percent: 35,
    institution_percent: 65,
    tags: ["Viagens", "Eventos"]
  },
  {
    name: "Treinamento de Liderança",
    description: "Curso de capacitação para líderes da igreja",
    budget_amount: 3000,
    funding_type: "institution_only" as const,
    church_percent: 0,
    institution_percent: 100,
    tags: ["Treinamento"]
  },
  {
    name: "Evento de Evangelismo",
    description: "Evento público para evangelização da comunidade",
    budget_amount: 12000,
    funding_type: "shared" as const,
    church_percent: 45,
    institution_percent: 55,
    tags: ["Eventos", "Marketing", "Alimentação"]
  }
]

// Types
export interface ProjectActivity {
  id: string
  name: string
  description: string
  responsible_id: string
  deadline: Date
  budget_amount: number
  funding_type: "church_only" | "institution_only" | "shared"
  church_percent?: number
  institution_percent?: number
  tags: string[]
}

export interface ProjectFormData {
  // Step 1: Project Data
  title: string
  description: string
  department_id: string
  responsible_ids: string[]
  deadline: Date
  
  // Step 2: Activities
  activities: ProjectActivity[]
  
  // Step 3: Funding Distribution (calculated from activities)
  total_budget: number
  church_contribution: number
  institution_contribution: number
  
  // Step 4: Additional settings
  language_preference: string
  is_private: boolean
  required_volunteers: boolean
  type: "Local" | "Global"
}

// Predefined activity tags
const ACTIVITY_TAGS = [
  "Reforma", "Equipamentos", "Viagens", "Eventos", "Materiais", 
  "Treinamento", "Marketing", "Alimentação", "Transporte", "Hospedagem"
]

// Funding policies (mock data)
const FUNDING_POLICIES = {
  max_institution_percent: 65,
  max_institution_amount: 5000,
  min_church_percent: 35,
  default_church_percent: 35,
  default_institution_percent: 65
}

export default function ProjectRegisterPage() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activeInstitution } = useInstitution()
  
  // Get translations for current language
  const translations = projectRegisterTranslations[i18n.language as keyof typeof projectRegisterTranslations] || projectRegisterTranslations.en
  
  // Check if editing existing project
  const projectId = searchParams.get('edit')
  const isEditing = !!projectId
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    department_id: "",
    responsible_ids: [],
    deadline: new Date(),
    activities: [],
    total_budget: 0,
    church_contribution: 0,
    institution_contribution: 0,
    language_preference: "pt",
    is_private: false,
    required_volunteers: false,
    type: "Local",
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [currentActivity, setCurrentActivity] = useState<Partial<ProjectActivity>>({
    name: "",
    description: "",
    responsible_id: "",
    deadline: new Date(),
    budget_amount: 0,
    funding_type: "shared",
    church_percent: FUNDING_POLICIES.default_church_percent,
    institution_percent: FUNDING_POLICIES.default_institution_percent,
    tags: []
  })

  const steps = [
    {
      id: 1,
      title: translations.steps.projectInfo.title,
      description: translations.steps.projectInfo.description,
      content: translations.steps.projectInfo.content,
      icon: Globe
    },
    {
      id: 2,
      title: translations.steps.activities.title,
      description: translations.steps.activities.description,
      content: translations.steps.activities.content,
      icon: Activity
    },
    {
      id: 3,
      title: translations.steps.funding.title,
      description: translations.steps.funding.description,
      content: translations.steps.funding.content,
      icon: Calculator
    },
    {
      id: 4,
      title: translations.steps.review.title,
      description: translations.steps.review.description,
      content: translations.steps.review.content,
      icon: CheckCircle
    }
  ]

  const breadcrumbs = useMemo(() => [
    { name: "Projects", href: "/projects" },
    { name: isEditing ? "Edit Project" : "New Project" }
  ], [isEditing])

  usePageTitle({
    title: isEditing ? "Edit Project" : "New Project",
    breadcrumbs
  })

  // Calculate totals from activities
  useEffect(() => {
    const totalBudget = formData.activities.reduce((sum, act) => sum + act.budget_amount, 0)
    const churchContribution = formData.activities.reduce((sum, act) => {
      if (act.funding_type === "church_only") return sum + act.budget_amount
      if (act.funding_type === "shared") return sum + (act.budget_amount * (act.church_percent || 35) / 100)
      return sum
    }, 0)
    const institutionContribution = totalBudget - churchContribution

    setFormData(prev => ({
      ...prev,
      total_budget: totalBudget,
      church_contribution: churchContribution,
      institution_contribution: institutionContribution
    }))
  }, [formData.activities])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = translations.validation.projectTitleRequired
        if (!formData.description.trim()) newErrors.description = translations.validation.projectDescriptionRequired
        if (!formData.department_id) newErrors.department_id = translations.validation.departmentRequired
        if (formData.responsible_ids.length === 0) newErrors.responsible_ids = translations.validation.responsiblePersonRequired
        break
      
      case 2:
        if (formData.activities.length === 0) newErrors.activities = translations.validation.activityRequired
        break
        
      case 3:
        // Validate funding policies
        if (formData.institution_contribution > FUNDING_POLICIES.max_institution_amount) {
          newErrors.funding = translations.validation.institutionExceedsAmount.replace('{{amount}}', FUNDING_POLICIES.max_institution_amount.toLocaleString())
        }
        const institutionPercent = (formData.institution_contribution / formData.total_budget) * 100
        if (institutionPercent > FUNDING_POLICIES.max_institution_percent) {
          newErrors.funding = translations.validation.institutionExceedsPercent.replace('{{percent}}', FUNDING_POLICIES.max_institution_percent.toString())
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAddActivity = () => {
    if (!currentActivity.name || !currentActivity.description || !currentActivity.budget_amount) {
      toast.error(translations.validation.activityFieldsRequired)
      return
    }

    if (editingActivityId) {
      // Update existing activity
      setFormData(prev => ({
        ...prev,
        activities: prev.activities.map(act => 
          act.id === editingActivityId
            ? {
                ...act,
                name: currentActivity.name!,
                description: currentActivity.description!,
                responsible_id: currentActivity.responsible_id!,
                deadline: currentActivity.deadline!,
                budget_amount: currentActivity.budget_amount!,
                funding_type: currentActivity.funding_type!,
                church_percent: currentActivity.church_percent,
                institution_percent: currentActivity.institution_percent,
                tags: currentActivity.tags!
              }
            : act
        )
      }))
      toast.success(translations.toast.activityUpdated)
      setEditingActivityId(null)
    } else {
      // Add new activity
      const newActivity: ProjectActivity = {
        id: `activity-${Date.now()}`,
        name: currentActivity.name!,
        description: currentActivity.description!,
        responsible_id: currentActivity.responsible_id!,
        deadline: currentActivity.deadline!,
        budget_amount: currentActivity.budget_amount!,
        funding_type: currentActivity.funding_type!,
        church_percent: currentActivity.church_percent,
        institution_percent: currentActivity.institution_percent,
        tags: currentActivity.tags!
      }

      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity]
      }))
      toast.success(translations.toast.activityAdded)
    }

    // Reset current activity
    setCurrentActivity({
      name: "",
      description: "",
      responsible_id: "",
      deadline: new Date(),
      budget_amount: 0,
      funding_type: "shared",
      church_percent: FUNDING_POLICIES.default_church_percent,
      institution_percent: FUNDING_POLICIES.default_institution_percent,
      tags: []
    })
  }

  const handleEditActivity = (activityId: string) => {
    const activity = formData.activities.find(act => act.id === activityId)
    if (activity) {
      setEditingActivityId(activityId)
      setCurrentActivity({
        name: activity.name,
        description: activity.description,
        responsible_id: activity.responsible_id,
        deadline: activity.deadline,
        budget_amount: activity.budget_amount,
        funding_type: activity.funding_type,
        church_percent: activity.church_percent,
        institution_percent: activity.institution_percent,
        tags: activity.tags
      })
      toast.success(translations.toast.editingActivity.replace('{{name}}', activity.name))
    }
  }

  const handleSelectPredefinedActivity = (predefinedActivity: typeof PREDEFINED_ACTIVITIES[0]) => {
    setCurrentActivity({
      name: predefinedActivity.name,
      description: predefinedActivity.description,
      responsible_id: "",
      deadline: new Date(),
      budget_amount: predefinedActivity.budget_amount,
      funding_type: predefinedActivity.funding_type,
      church_percent: predefinedActivity.church_percent,
      institution_percent: predefinedActivity.institution_percent,
      tags: predefinedActivity.tags
    })
    toast.success(translations.toast.activitySelected.replace('{{name}}', predefinedActivity.name))
  }

  const handleRemoveActivity = (activityId: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(act => act.id !== activityId)
    }))
    toast.success(translations.toast.activityRemoved)
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    setIsLoading(true)
    const loadingToast = toast.loading(isEditing ? translations.toast.updatingProject : translations.toast.creatingProject)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.dismiss(loadingToast)
      toast.success(isEditing ? translations.toast.projectUpdated : translations.toast.projectCreated, {
        duration: 3000,
        icon: '🎉'
      })

      // Navigate back to projects page
      router.push('/projects')

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(translations.toast.failedToSave)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderProjectDataStep()
      case 2:
        return renderActivitiesStep()
      case 3:
        return renderFundingDistributionStep()
      case 4:
        return renderReviewStep()
      default:
        return null
    }
  }

  const renderProjectDataStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Column - Info (1/4 da tela) */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="p-6 rounded-lg border border-muted">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{translations.steps.projectInfo.title}</h3>
                  <p className="text-xs text-muted-foreground">{translations.steps.projectInfo.description}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>{translations.steps.projectInfo.content}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Form (3/4 da tela) */}
        <div className="w-full lg:w-3/4">
          <div className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="title" className="flex items-center gap-2 text-base font-medium">
                <Target className="w-4 h-4 text-muted-foreground" />
                {translations.fields.projectTitle} *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={translations.placeholders.enterProjectTitle}
                className={`h-12 text-base border-2 ${errors.title ? 'border-red-500' : 'border-border'}`}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-4">
              <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {translations.fields.projectDescription} *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={translations.placeholders.describeProject}
                className={`min-h-[120px] text-base border-2 ${errors.description ? 'border-red-500' : 'border-border'}`}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label htmlFor="department" className="flex items-center gap-2 text-base font-medium">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  {translations.fields.department} *
                </Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                >
                  <SelectTrigger className={`h-12 border-2 ${errors.department_id ? 'border-red-500' : 'border-border'}`}>
                    <SelectValue placeholder={translations.placeholders.selectDepartment} />
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
                {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
              </div>

              <div className="space-y-4">
                <Label htmlFor="deadline" className="flex items-center gap-2 text-base font-medium">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  {translations.fields.deadline} *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal border-2",
                        !formData.deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deadline ? (
                        format(formData.deadline, "PPP", { locale: ptBR })
                      ) : (
                        <span>{translations.placeholders.selectDeadline}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deadline}
                      onSelect={(date) => date && setFormData({ ...formData, deadline: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-medium">
                <Users className="w-4 h-4 text-muted-foreground" />
                {translations.fields.responsiblePeople} *
              </Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (!formData.responsible_ids.includes(value)) {
                    setFormData({
                      ...formData,
                      responsible_ids: [...formData.responsible_ids, value]
                    })
                  }
                }}
              >
                <SelectTrigger className={`h-12 border-2 ${errors.responsible_ids ? 'border-red-500' : 'border-border'}`}>
                  <SelectValue placeholder={translations.placeholders.addResponsiblePerson} />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.filter(user => !formData.responsible_ids.includes(user.id)).map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{user.name}</span>
                        <span className="text-xs text-muted-foreground">({user.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Selected responsible people */}
              {formData.responsible_ids.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.responsible_ids.map((userId) => {
                    const user = mockUsers.find(u => u.id === userId)
                    return (
                      <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                        {user?.name}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => setFormData({
                            ...formData,
                            responsible_ids: formData.responsible_ids.filter(id => id !== userId)
                          })}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )
                  })}
                </div>
              )}
              {errors.responsible_ids && <p className="text-sm text-red-600">{errors.responsible_ids}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActivitiesStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Column - Info (1/4 da tela) */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="p-6 rounded-lg border border-muted">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{translations.steps.activities.title}</h3>
                  <p className="text-xs text-muted-foreground">{translations.steps.activities.description}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>{translations.steps.activities.content}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activities Management (3/4 da tela) */}
        <div className="w-full lg:w-3/4 space-y-6">
          {/* Quick Activities Carousel */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Plus className="w-4 h-4 text-muted-foreground" />
              {translations.quickActivities.title}
            </h4>
            
            <Carousel
              opts={{
                align: "start",
                loop: false,
                skipSnaps: false,
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {PREDEFINED_ACTIVITIES.map((activity, index) => (
                  <CarouselItem key={index} className="pl-2 basis-full sm:basis-1/2 lg:basis-1/3">
                    <Card 
                      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 border-2"
                      onClick={() => handleSelectPredefinedActivity(activity)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="font-medium text-sm truncate">{activity.name}</h5>
                            <Badge variant="default" className="text-xs shrink-0 bg-primary/10 text-primary border-primary/20">
                              R$ {activity.budget_amount.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {activity.description}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {activity.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-2 py-1 bg-muted/50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
              <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
            </Carousel>
          </div>

          {/* Existing Activities */}
          {formData.activities.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                {translations.summary.activities} ({formData.activities.length})
              </h4>
              <div className="space-y-3">
                {formData.activities.map((activity) => (
                  <div key={activity.id} className="p-4 border-2 rounded-lg border-l-4 border-l-primary">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h5 className="font-medium">{activity.name}</h5>
                          <Badge variant="outline">
                            R$ {activity.budget_amount.toLocaleString()}
                          </Badge>
                          <Badge variant={activity.funding_type === "shared" ? "default" : "secondary"}>
                            {activity.funding_type === "shared" ? translations.fundingTypes.shared : 
                             activity.funding_type === "church_only" ? translations.fundingTypes.churchOnly : translations.fundingTypes.institutionOnly}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        {activity.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {activity.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs px-2 py-1 bg-muted/50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditActivity(activity.id)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveActivity(activity.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add/Edit Activity Form */}
          <div className="p-6 border-2 rounded-lg">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  {editingActivityId ? <Settings className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingActivityId ? translations.buttons.editActivity : translations.buttons.addActivity}
                </h4>
                {editingActivityId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingActivityId(null)
                      setCurrentActivity({
                        name: "",
                        description: "",
                        responsible_id: "",
                        deadline: new Date(),
                        budget_amount: 0,
                        funding_type: "shared",
                        church_percent: FUNDING_POLICIES.default_church_percent,
                        institution_percent: FUNDING_POLICIES.default_institution_percent,
                        tags: []
                      })
                    }}
                    className="text-muted-foreground"
                  >
                    {translations.buttons.cancelEdit}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label htmlFor="activity_name" className="text-base font-medium">{translations.fields.activityName} *</Label>
                  <Input
                    id="activity_name"
                    value={currentActivity.name || ""}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, name: e.target.value })}
                    placeholder={translations.placeholders.enterActivityName}
                    className="h-12 border-2"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="activity_budget" className="text-base font-medium">{translations.fields.budgetAmount} *</Label>
                  <Input
                    id="activity_budget"
                    type="number"
                    min="0"
                    step="0.01"
                    value={currentActivity.budget_amount || ""}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, budget_amount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                    className="h-12 border-2"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="activity_description" className="text-base font-medium">{translations.fields.activityDescription} *</Label>
                <Textarea
                  id="activity_description"
                  value={currentActivity.description || ""}
                  onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                  placeholder={translations.placeholders.describeActivity}
                  className="min-h-[100px] border-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium">{translations.fields.responsiblePerson}</Label>
                  <Select
                    value={currentActivity.responsible_id || ""}
                    onValueChange={(value) => setCurrentActivity({ ...currentActivity, responsible_id: value })}
                  >
                    <SelectTrigger className="h-12 border-2">
                      <SelectValue placeholder={translations.placeholders.selectResponsible} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">{translations.fields.activityDeadline}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-12 justify-start text-left font-normal border-2"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {currentActivity.deadline ? (
                          format(currentActivity.deadline, "dd/MM/yyyy")
                        ) : (
                          <span>{translations.placeholders.selectDate}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={currentActivity.deadline}
                        onSelect={(date) => date && setCurrentActivity({ ...currentActivity, deadline: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Funding Type */}
              <div className="space-y-4">
                <Label className="text-base font-medium">{translations.fields.fundingType}</Label>
                <RadioGroup
                  value={currentActivity.funding_type}
                  onValueChange={(value: "church_only" | "institution_only" | "shared") => {
                    // Auto-adjust percentages based on selection
                    if (value === "church_only") {
                      setCurrentActivity({ 
                        ...currentActivity, 
                        funding_type: value,
                        church_percent: 100,
                        institution_percent: 0
                      })
                    } else if (value === "institution_only") {
                      setCurrentActivity({ 
                        ...currentActivity, 
                        funding_type: value,
                        church_percent: 0,
                        institution_percent: 100
                      })
                    } else {
                      setCurrentActivity({ 
                        ...currentActivity, 
                        funding_type: value,
                        church_percent: FUNDING_POLICIES.default_church_percent,
                        institution_percent: FUNDING_POLICIES.default_institution_percent
                      })
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="church_only" id="church_only" />
                    <Label htmlFor="church_only" className="cursor-pointer">{translations.fundingTypes.churchOnly}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="institution_only" id="institution_only" />
                    <Label htmlFor="institution_only" className="cursor-pointer">{translations.fundingTypes.institutionOnly}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shared" id="shared" />
                    <Label htmlFor="shared" className="cursor-pointer">{translations.fundingTypes.shared}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Shared Funding with Enhanced Slider */}
              {currentActivity.funding_type === "shared" && (
                <div className="space-y-6 p-6 rounded-lg border-2 border-dashed border-muted">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">{translations.fields.fundingDistribution}</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{translations.fields.churchContribution}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{currentActivity.church_percent || 35}%</span>
                            {(currentActivity.church_percent || 35) === 100 && (
                              <Badge variant="default" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                {translations.fundingTypes.fullChurch}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Slider
                          value={[currentActivity.church_percent || 35]}
                          onValueChange={(value) => {
                            const churchPercent = value[0]
                            const institutionPercent = 100 - churchPercent
                            
                            // Auto-detect funding type based on percentages
                            let newFundingType = currentActivity.funding_type
                            if (churchPercent === 100) {
                              newFundingType = "church_only"
                              toast.success(translations.fundingTypes.fullChurch)
                            } else if (churchPercent === 0) {
                              newFundingType = "institution_only"
                            } else {
                              newFundingType = "shared"
                            }
                            
                            // Validate institution percentage doesn't exceed 65% for shared funding
                            if (newFundingType === "shared" && institutionPercent > FUNDING_POLICIES.max_institution_percent) {
                              toast.error(translations.toast.institutionPercentExceeded.replace('{{percent}}', FUNDING_POLICIES.max_institution_percent.toString()))
                              return
                            }
                            
                            setCurrentActivity({
                              ...currentActivity,
                              funding_type: newFundingType,
                              church_percent: churchPercent,
                              institution_percent: institutionPercent
                            })
                          }}
                          min={0}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0% (Instituição)</span>
                          <span>100% (Igreja)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calculated amounts */}
                  {currentActivity.budget_amount && currentActivity.budget_amount > 0 && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-4 border-2 rounded-lg">
                        <p className="text-muted-foreground font-medium">{translations.summary.church}</p>
                        <p className="text-lg font-bold text-blue-600">
                          R$ {((currentActivity.budget_amount * (currentActivity.church_percent || 35)) / 100).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 border-2 rounded-lg">
                        <p className="text-muted-foreground font-medium">{translations.summary.institution}</p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {((currentActivity.budget_amount * (currentActivity.institution_percent || 65)) / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Validation warnings */}
                  {currentActivity.budget_amount && currentActivity.budget_amount > 0 && (
                    <div className="space-y-2">
                      {((currentActivity.budget_amount * (currentActivity.institution_percent || 65)) / 100) > FUNDING_POLICIES.max_institution_amount && (
                        <div className="p-3 border-2 border-red-500 rounded-lg">
                          <p className="text-sm text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            {translations.toast.institutionAmountExceeded.replace('{{amount}}', FUNDING_POLICIES.max_institution_amount.toLocaleString())}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Activity Tags */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {translations.fields.activityTags}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_TAGS.map((tag) => (
                    <Button
                      key={tag}
                      variant={currentActivity.tags?.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const tags = currentActivity.tags || []
                        const newTags = tags.includes(tag)
                          ? tags.filter(t => t !== tag)
                          : [...tags, tag]
                        setCurrentActivity({ ...currentActivity, tags: newTags })
                      }}
                      className={cn(
                        "h-8 text-xs transition-all duration-200",
                        currentActivity.tags?.includes(tag) 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "hover:bg-muted hover:border-primary/50"
                      )}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleAddActivity}
                className="w-full h-12 gap-2"
                variant={editingActivityId ? "default" : "outline"}
              >
                {editingActivityId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingActivityId ? translations.buttons.updateActivity : translations.buttons.addActivity}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {errors.activities && (
        <div className="mt-6 text-center">
          <p className="text-sm text-red-600">{errors.activities}</p>
        </div>
      )}
    </div>
  )

  const renderFundingDistributionStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Column - Info (1/4 da tela) */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="p-6 rounded-lg border border-muted">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Calculator className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{translations.steps.funding.title}</h3>
                  <p className="text-xs text-muted-foreground">{translations.steps.funding.description}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>{translations.steps.funding.content}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Funding Summary (3/4 da tela) */}
        <div className="w-full lg:w-3/4">
          <div className="space-y-6">
            {/* Total Budget Display */}
            <div className="text-center space-y-4">
              <div>
                <h4 className="text-3xl font-bold text-foreground">
                  R$ {formData.total_budget.toLocaleString()}
                </h4>
                <p className="text-sm text-muted-foreground">{translations.summary.totalBudget}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">
                    R$ {formData.church_contribution.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {translations.summary.church} ({Math.round((formData.church_contribution / formData.total_budget) * 100)}%)
                  </div>
                </div>
                
                <div className="p-4 border-2 rounded-lg">
                  <div className="text-xl font-bold text-green-600">
                    R$ {formData.institution_contribution.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {translations.summary.institution} ({Math.round((formData.institution_contribution / formData.total_budget) * 100)}%)
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Status */}
            <div className="space-y-4">
              <h5 className="font-medium text-foreground">{translations.summary.policyValidation}</h5>
              
              <div className="space-y-3">
                {/* Institution Amount Check */}
                <div className="flex items-center justify-between p-3 border-2 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{translations.validation.institutionAmountLimit}</p>
                    <p className="text-xs text-muted-foreground">
                      {translations.validation.maximum}: R$ {FUNDING_POLICIES.max_institution_amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.institution_contribution <= FUNDING_POLICIES.max_institution_amount ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <Badge variant={formData.institution_contribution <= FUNDING_POLICIES.max_institution_amount ? "default" : "destructive"}>
                      {formData.institution_contribution <= FUNDING_POLICIES.max_institution_amount ? translations.validation.valid : translations.validation.exceeded}
                    </Badge>
                  </div>
                </div>

                {/* Institution Percentage Check */}
                <div className="flex items-center justify-between p-3 border-2 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{translations.validation.institutionPercentLimit}</p>
                    <p className="text-xs text-muted-foreground">
                      {translations.validation.maximum}: {FUNDING_POLICIES.max_institution_percent}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(formData.institution_contribution / formData.total_budget) * 100 <= FUNDING_POLICIES.max_institution_percent ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <Badge variant={(formData.institution_contribution / formData.total_budget) * 100 <= FUNDING_POLICIES.max_institution_percent ? "default" : "destructive"}>
                      {Math.round((formData.institution_contribution / formData.total_budget) * 100)}%
                    </Badge>
                  </div>
                </div>
              </div>

              {errors.funding && (
                <div className="p-3 border-2 border-red-500 rounded-lg">
                  <p className="text-sm text-red-600">{errors.funding}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderReviewStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Column - Info (1/4 da tela) */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="p-6 rounded-lg border border-muted">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{translations.steps.review.title}</h3>
                  <p className="text-xs text-muted-foreground">{translations.steps.review.description}</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>{translations.steps.review.content}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Review Summary (3/4 da tela) */}
        <div className="w-full lg:w-3/4">
          <div className="space-y-8">
            {/* Project Basic Info */}
            <div className="space-y-4">
              <h5 className="font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {translations.summary.projectInfo}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">{translations.fields.projectTitle}:</span>
                  <p className="font-medium">{formData.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">{translations.fields.department}:</span>
                  <p className="font-medium">
                    {mockDepartments.find(d => d.id === formData.department_id)?.name}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">{translations.fields.deadline}:</span>
                  <p className="font-medium">{format(formData.deadline, "dd/MM/yyyy")}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-medium">{formData.type}</p>
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">{translations.fields.projectDescription}:</span>
                <p className="font-medium mt-1 text-sm">{formData.description}</p>
              </div>

              <div>
                <span className="text-muted-foreground">{translations.fields.responsiblePeople}:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.responsible_ids.map((userId) => {
                    const user = mockUsers.find(u => u.id === userId)
                    return (
                      <Badge key={userId} variant="secondary" className="text-xs">
                        {user?.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Activities Summary */}
            <div className="space-y-4">
              <h5 className="font-semibold text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {translations.summary.activities} ({formData.activities.length})
              </h5>
              <div className="space-y-3">
                {formData.activities.map((activity) => (
                  <div key={activity.id} className="p-3 border-2 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h6 className="font-medium text-sm">{activity.name}</h6>
                      <Badge variant="outline" className="text-xs">
                        R$ {activity.budget_amount.toLocaleString()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                    {activity.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {activity.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs px-2 py-1 bg-muted/50">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="space-y-4">
              <h5 className="font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {translations.summary.budgetDistribution}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 border-2 rounded-lg">
                  <div className="text-lg font-bold text-foreground">
                    R$ {formData.total_budget.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{translations.summary.totalBudget}</div>
                </div>
                <div className="p-4 border-2 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    R$ {formData.church_contribution.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{translations.summary.church} ({Math.round((formData.church_contribution / formData.total_budget) * 100)}%)</div>
                </div>
                <div className="p-4 border-2 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    R$ {formData.institution_contribution.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{translations.summary.institution} ({Math.round((formData.institution_contribution / formData.total_budget) * 100)}%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AppLayout>
      <div className="w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isEditing ? translations.title.edit : translations.title.create}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isEditing ? translations.subtitle.edit : translations.subtitle.create}
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => router.push('/projects')}
            className="gap-2 w-full sm:w-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{translations.buttons.backToProjects}</span>
            <span className="sm:hidden">{translations.buttons.cancel}</span>
          </Button>
        </div>

        {/* Wizard Step Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index + 1 === currentStep
              const isCompleted = index + 1 < currentStep
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                    isActive ? "border-primary bg-primary text-primary-foreground" :
                    isCompleted ? "border-green-500 bg-green-500 text-white" :
                    "border-muted-foreground text-muted-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-12 sm:w-16 h-0.5 mx-2 transition-colors",
                      isCompleted ? "bg-green-500" : "bg-muted"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Simple Navigation Footer */}
        <div className="mt-8 sticky bottom-4 bg-background/95 backdrop-blur-xl rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">{translations.buttons.previous}</span>
                </Button>
              )}
              <Button 
                variant="ghost" 
                onClick={() => router.push('/projects')}
                disabled={isLoading}
              >
                {translations.buttons.cancel}
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep < steps.length ? (
                <Button 
                  onClick={handleNext}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <span className="hidden sm:inline">{translations.buttons.next}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="gap-2"
                  disabled={isLoading || !validateStep(4)}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="hidden sm:inline">{isEditing ? translations.toast.updatingProject : translations.toast.creatingProject}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline">{isEditing ? translations.buttons.updateProject : translations.buttons.createProject}</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
