"use client"

import React, { useState, useEffect, useMemo, Suspense } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Plus,
  Minus,
  AlertTriangle,
  Calculator,
  Target,
  Clock,
  Tag,
  Home,
  FileText,
  Info,
  MapPin,
  Check,
  TrendingUp,
  TrendingDown,
  Edit3,
  BarChart3,
  Coins,
  Banknote,
  PieChart,
  Sprout,
  Star
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { mockDepartments, mockUsers } from "@/data/mockData"
import { useInstitution } from "@/contexts/institution-context"
import { projectRegisterTranslations } from "@/lib/translations/project-register"
import { LanguageSelector } from "@/components/language-selector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { EventRegistrationForm, EventFormData } from "@/components/shared/event-registration-form"
import { CommunicationForm, CommunicationFormData } from "@/components/shared/communication-form"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
import toast from "react-hot-toast"
import "@/lib/i18n"

// Predefined activities with all values defined
const PREDEFINED_ACTIVITIES = [
  {
    name: "Reforma do Templo",
    description: "Reforma geral do templo incluindo pintura, piso e iluminação",
    budget_amount: 15000,
    request_subsidy: true,
    is_subsidized: true,
    tags: ["Reforma", "Equipamentos"]
  },
  {
    name: "Compra de Equipamentos de Som",
    description: "Aquisição de sistema de som completo para o templo",
    budget_amount: 8000,
    request_subsidy: true,
    is_subsidized: true,
    tags: ["Equipamentos"]
  },
  {
    name: "Viagem Missionária",
    description: "Viagem para evangelismo em comunidades carentes",
    budget_amount: 5000,
    request_subsidy: true,
    is_subsidized: true,
    tags: ["Viagens", "Eventos"]
  },
  {
    name: "Treinamento de Liderança",
    description: "Curso de capacitação para líderes da igreja",
    budget_amount: 3000,
    request_subsidy: false,
    is_subsidized: false,
    tags: ["Treinamento"]
  },
  {
    name: "Evento de Evangelismo",
    description: "Evento público para evangelização da comunidade",
    budget_amount: 12000,
    request_subsidy: true,
    is_subsidized: true,
    tags: ["Eventos", "Marketing", "Alimentação"]
  }
]

// Ícones para tags de atividades
const TAG_ICONS: { [key: string]: typeof Home } = {
  "Reforma": Home,
  "Equipamentos": Settings,
  "Viagens": Target,
  "Eventos": CalendarIcon,
  "Treinamento": Users,
  "Marketing": Activity,
  "Alimentação": DollarSign,
  "Tecnologia": Calculator,
  "Manutenção": AlertTriangle,
  "Suprimentos": Plus
}

// Helper para renderizar tag com ícone
const renderTagWithIcon = (tag: string, className?: string) => {
  const IconComponent = TAG_ICONS[tag] || Tag
  return (
    <Badge key={tag} variant="outline" className={cn("text-xs px-2 py-1 bg-muted/50 flex items-center gap-1", className)}>
      <IconComponent className="w-3 h-3" />
      {tag}
    </Badge>
  )
}

// Types
export interface ProjectActivity {
  id: string
  name: string
  description: string
  budget_amount: number
  request_subsidy: boolean
  is_subsidized: boolean
  tags: string[]
}

export interface ProjectFormData {
  // Step 1: Project Data
  title: string
  description: string
  department_id: string
  responsible_id: string // Single responsible instead of array
  project_responsible_type: "personal" | "institutional" | "church" | "region" | "department"
  register_as_event: boolean
  is_private: boolean
  
  // Step 2: Activities
  activities: ProjectActivity[]
  
  // Step 3: Funding Distribution (calculated from activities)
  total_budget: number
  church_contribution: number
  institution_contribution: number
  subsidy_percentage: number
  is_special_case: boolean
  special_case_reason?: string
  
  // Special Projects fields
  location_church_plant?: string
  special_budget?: number
  
  // Step 4: Event Registration (optional)
  event?: {
    title: string
    description: string
    contact_id: string
    type: string // Changed to allow custom types
    language_preference: "en" | "nl" | "pt" | "es" | "fr" | "de"
    max_participants?: number
    is_paid_event: boolean
    ticket_amount?: number
    payment_description?: string
    required_volunteers: boolean
    start_at?: Date
    end_at?: Date
    subscription_expires_at?: Date
    target_type: "institution" | "region" | "department" | "church" | "user"
    target_id?: string
  }
  
  // Step 5: Communication (optional)
  communication?: {
    title: string
    content: import('lexical').SerializedEditorState
    communication_type: "announcement" | "invitation" | "newsletter" | "update" | "reminder"
    priority: "low" | "medium" | "high" | "urgent"
    language_preference: "en" | "nl" | "pt" | "es" | "fr" | "de"
    post_now: boolean
    publish_date?: string
    target_type?: "institution" | "region" | "department" | "church" | "user"
    target_id?: string
  }
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

// Mock data for department budget highlights
const mockDepartmentBudget = {
  total_available: 50000,
  used_this_year: 18000,
  remaining: 32000,
  department_name: "Departamento de Jovens"
}

// Component that uses useSearchParams - needs to be wrapped in Suspense
function ProjectRegisterContent() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activeInstitution } = useInstitution()
  
  // Get translations for current language - usar o sistema i18n global
  const getCurrentTranslation = (key: string) => {
    try {
      return t(key) || key
    } catch {
      // Fallback para projectRegisterTranslations se a chave não existir no i18n global
      const translations = projectRegisterTranslations[i18n.language as keyof typeof projectRegisterTranslations] || projectRegisterTranslations.en
      const keys = key.split('.')
      let value = translations as any
      for (const k of keys) {
        value = value?.[k]
      }
      return value || key
    }
  }
  
  // Manter translations por compatibilidade 
  const translations = projectRegisterTranslations[i18n.language as keyof typeof projectRegisterTranslations] || projectRegisterTranslations.en
  
  // Helper para renderizar tipo de responsabilidade como badge selecionável
  const renderResponsibilityType = (type: string, isSelected: boolean, onClick: () => void) => {
    const typeIcons = {
      personal: Users,
      institutional: Building,
      church: Home,
      region: MapPin,
      department: Settings
    }
    
    const IconComponent = typeIcons[type as keyof typeof typeIcons] || Users
    const typeLabel = (translations as any).responsibilityTypes?.[type] || type
    
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium",
          "hover:border-primary/50 hover:shadow-sm",
          isSelected 
            ? "border-primary bg-primary/5 text-primary shadow-sm" 
            : "border-border bg-background text-muted-foreground hover:text-foreground"
        )}
      >
        <IconComponent className="w-4 h-4" />
        {typeLabel}
      </button>
    )
  }

  // Component for activity groups with drag & drop
  const ActivityGroup = ({ 
    title, 
    activities, 
    groupType = 'subsidized', // Add explicit groupType prop
    onMove, 
    onRestore, 
    onDelete, 
    onEdit, 
    onClearAll, // Add clear all function
    isTrash = false,
    allowDrop = true,
    defaultCollapsed = false // Add collapsible functionality
  }: {
    title: string
    activities: ProjectActivity[]
    groupType?: 'subsidized' | 'nonSubsidized' | 'trash'
    onMove?: (activityId: string, toGroup: 'subsidized' | 'nonSubsidized' | 'trash') => void
    onRestore?: (activityId: string) => void
    onDelete?: (activityId: string) => void
    onEdit?: (activityId: string) => void
    onClearAll?: () => void
    isTrash?: boolean
    allowDrop?: boolean
    defaultCollapsed?: boolean
  }) => {
    const [draggedOver, setDraggedOver] = useState(false)
    const [draggingActivityId, setDraggingActivityId] = useState<string | null>(null)
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
    const totalBudget = activities.reduce((sum, act) => sum + act.budget_amount, 0)

    const handleDragStart = (e: React.DragEvent, activityId: string) => {
      e.dataTransfer.setData('text/plain', activityId)
      setDraggingActivityId(activityId)
    }

    const handleDragEnd = () => {
      setDraggingActivityId(null)
    }

    const handleDragOver = (e: React.DragEvent) => {
      if (allowDrop) {
        e.preventDefault()
        setDraggedOver(true)
      }
    }

    const handleDragLeave = (e: React.DragEvent) => {
      // Only set draggedOver to false if we're leaving the drop zone entirely
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setDraggedOver(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      setDraggedOver(false)
      
      if (!allowDrop || !onMove) return
      
      const activityId = e.dataTransfer.getData('text/plain')
      // Use explicit groupType prop instead of title matching
      const targetGroup = isTrash ? 'trash' : groupType
      onMove(activityId, targetGroup)
    }

    return (
      <div 
        className={cn(
          "border-2 rounded-lg bg-card rounded-xl  shadow-sm transition-all duration-200",
          draggedOver && allowDrop 
            ? "border-primary border-dashed bg-primary/10 shadow-lg transform scale-[1.02]" 
            : "border-border",
          isTrash && "border-red-200 bg-red-50",
          allowDrop && "hover:border-primary/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="font-medium flex items-center gap-2 hover:text-primary transition-colors"
            >
              {isTrash ? (
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-3 h-3 text-red-600" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-3 h-3 text-primary" />
                </div>
              )}
              {title}
              <ChevronRight 
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  !isCollapsed && "rotate-90"
                )}
              />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{(translations as any).activityGroups?.totalItems?.replace('{{count}}', activities.length) || `${activities.length} atividades`}</span>
                <Badge variant="outline" className="font-mono">
                  {(translations as any).activityGroups?.budgetSummary?.replace('{{amount}}', totalBudget.toLocaleString()) || `R$ ${totalBudget.toLocaleString()}`}
                </Badge>
              </div>
              {isTrash && activities.length > 0 && onClearAll && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onClearAll}
                  className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <X className="w-3 h-3 mr-1" />
                  {(translations as any).activityGroups?.clearAll || "Limpar Tudo"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                  {isTrash ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <p className="text-sm">
                  {isTrash 
                    ? ((translations as any).activityGroups?.emptyTrash || "Lixeira vazia")
                    : ((translations as any).activityGroups?.emptyGroup || "Nenhuma atividade neste grupo")}
                </p>
                {!isTrash && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {(translations as any).activityGroups?.dragAndDrop || "Arraste atividades entre grupos"}
                  </p>
                )}
              </div>
            ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  draggable={!isTrash}
                  onDragStart={(e) => handleDragStart(e, activity.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    "p-3 border-2 rounded-lg transition-all duration-200",
                    "hover:shadow-sm cursor-move",
                    isTrash ? "border-red-200 bg-red-50/50" : "border-border",
                    draggingActivityId === activity.id && "opacity-50 transform scale-95"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm truncate">{activity.name}</h5>
                        <Badge variant="outline" className="text-xs font-mono shrink-0">
                          R$ {activity.budget_amount.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {activity.description}
                      </p>
                      {activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {activity.tags.map((tag) => renderTagWithIcon(tag, "h-5"))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      {isTrash ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRestore?.(activity.id)}
                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit?.(activity.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete?.(activity.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }  // Check if editing existing project
  const projectId = searchParams.get('edit')
  const isEditing = !!projectId
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    department_id: "",
    responsible_id: "",
    project_responsible_type: "personal",
    register_as_event: false,
    is_private: false,
    activities: [],
    total_budget: 0,
    church_contribution: 0,
    institution_contribution: 0,
    subsidy_percentage: 35,
    is_special_case: false,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [currentActivity, setCurrentActivity] = useState<Partial<ProjectActivity>>({
    name: "",
    description: "",
    budget_amount: 0,
    request_subsidy: false,
    tags: []
  })

  // States for command popovers
  const [openDepartment, setOpenDepartment] = useState(false)
  const [openResponsible, setOpenResponsible] = useState(false)
  
  // States for funding calculator
  const [isManualEntry, setIsManualEntry] = useState(false)
  const [manualAmount, setManualAmount] = useState<number>(0)
  const [manualPercentage, setManualPercentage] = useState<number>(0)
  
  // States for special project options
  const [isSpecialProject, setIsSpecialProject] = useState(false)
  const [isChurchPlanting, setIsChurchPlanting] = useState(false)
  const [specialProjectJustification, setSpecialProjectJustification] = useState('')
  const [churchPlantingJustification, setChurchPlantingJustification] = useState('')
  const [showSpecialProjectModal, setShowSpecialProjectModal] = useState(false)
  const [showChurchPlantingModal, setShowChurchPlantingModal] = useState(false)
  
  // State for collapsible special project rules
  const [isSpecialRulesOpen, setIsSpecialRulesOpen] = useState(true)
  
  // State for trash (deleted activities)
  const [deletedActivities, setDeletedActivities] = useState<ProjectActivity[]>([])
  
  // Auto-add special project tags based on selection
  useEffect(() => {
    if (isSpecialProject || isChurchPlanting) {
      // Add special project tags to all activities
      setFormData(prev => ({
        ...prev,
        activities: prev.activities.map(activity => {
          const newTags = [...activity.tags]
          
          // Remove previous special tags
          const filteredTags = newTags.filter(tag => 
            tag !== "Projeto Especial" && tag !== "Church Planting"
          )
          
          // Add current special tag
          if (isSpecialProject && !filteredTags.includes("Projeto Especial")) {
            filteredTags.push("Projeto Especial")
          }
          if (isChurchPlanting && !filteredTags.includes("Church Planting")) {
            filteredTags.push("Church Planting")
          }
          
          return {
            ...activity,
            tags: filteredTags
          }
        })
      }))
    }
  }, [isSpecialProject, isChurchPlanting])
  
  // Functions for activity group management
  const moveActivityBetweenGroups = (activityId: string, toGroup: 'subsidized' | 'nonSubsidized' | 'trash') => {
    // Handle trash movement separately to avoid state conflicts
    if (toGroup === 'trash') {
      // Find activity in current activities
      const activityToDelete = formData.activities.find(a => a.id === activityId)
      if (!activityToDelete) return
      
      // Check if already in trash to prevent duplicates
      if (deletedActivities.some(a => a.id === activityId)) return
      
      // Remove from current activities
      setFormData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a.id !== activityId)
      }))
      
      // Add to deleted activities
      setDeletedActivities(prev => [...prev, activityToDelete])
      toast.success(`${activityToDelete.name} movida para lixeira`)
      return
    }
    
    // Handle normal group movements
    setFormData(prev => {
      const currentActivities = [...prev.activities]
      const currentDeleted = [...deletedActivities]
      
      // Find activity in current activities or deleted activities
      let activityIndex = currentActivities.findIndex(a => a.id === activityId)
      let activity: ProjectActivity | undefined
      
      if (activityIndex !== -1) {
        // Activity is in current activities
        activity = currentActivities[activityIndex]
        currentActivities.splice(activityIndex, 1)
      } else {
        // Activity might be in deleted activities
        const deletedIndex = currentDeleted.findIndex(a => a.id === activityId)
        if (deletedIndex !== -1) {
          activity = currentDeleted[deletedIndex]
          // Update deleted activities state
          setDeletedActivities(prev => prev.filter(a => a.id !== activityId))
        }
      }
      
      if (!activity) return prev
      
      // Move to subsidized or non-subsidized group
      const newIsSubsidized = toGroup === 'subsidized'
      
      // Create a new activity object with updated is_subsidized property
      const updatedActivity: ProjectActivity = {
        ...activity,
        is_subsidized: newIsSubsidized
      }
      
      currentActivities.push(updatedActivity)
      
      const groupName = toGroup === 'subsidized' ? 'Subsidiadas' : 'Não Subsidiadas'
      toast.success(`${activity.name} movida para ${groupName}`)
      
      return {
        ...prev,
        activities: currentActivities
      }
    })
  }

  const restoreActivityFromTrash = (activityId: string) => {
    const deletedActivity = deletedActivities.find(a => a.id === activityId)
    if (!deletedActivity) return
    
    setDeletedActivities(prev => prev.filter(a => a.id !== activityId))
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, deletedActivity]
    }))
    toast.success(`${deletedActivity.name} restaurada`)
  }

  const clearAllDeletedActivities = () => {
    const count = deletedActivities.length
    setDeletedActivities([])
    toast.success(`${count} atividades removidas permanentemente`)
  }

  const deleteActivityPermanently = (activityId: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== activityId)
    }))
  }

  const editActivity = (activityId: string) => {
    const activity = formData.activities.find(a => a.id === activityId)
    if (!activity) return
    
    // Set request_subsidy based on the current group (is_subsidized)
    // If activity is in non-subsidized group, request_subsidy should be false
    setCurrentActivity({
      ...activity,
      request_subsidy: activity.is_subsidized
    })
  }

  // Get activities by group
  const subsidizedActivities = formData.activities.filter(a => a.is_subsidized)
  const nonSubsidizedActivities = formData.activities.filter(a => !a.is_subsidized)

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
    const subsidyBudget = formData.activities
      .filter(act => act.is_subsidized)
      .reduce((sum, act) => sum + act.budget_amount, 0)
    
    const institutionContribution = (subsidyBudget * formData.subsidy_percentage) / 100
    const churchContribution = totalBudget - institutionContribution

    setFormData(prev => ({
      ...prev,
      total_budget: totalBudget,
      church_contribution: churchContribution,
      institution_contribution: institutionContribution
    }))
  }, [formData.activities, formData.subsidy_percentage])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = translations.validation.projectTitleRequired
        if (!formData.description.trim()) newErrors.description = translations.validation.projectDescriptionRequired
        if (!formData.department_id) newErrors.department_id = translations.validation.departmentRequired
        if (!formData.responsible_id) newErrors.responsible_id = translations.validation.responsiblePersonRequired
        break
      
      case 2:
        if (formData.activities.length === 0) newErrors.activities = translations.validation.activityRequired
        break
        
      case 3:
        // Validate funding policies for regular projects
        if (!isSpecialProject && !isChurchPlanting) {
          if (formData.institution_contribution > FUNDING_POLICIES.max_institution_amount) {
            newErrors.funding = translations.validation.institutionExceedsAmount.replace('{{amount}}', FUNDING_POLICIES.max_institution_amount.toLocaleString())
          }
          const institutionPercent = (formData.institution_contribution / formData.total_budget) * 100
          if (institutionPercent > FUNDING_POLICIES.max_institution_percent) {
            newErrors.funding = translations.validation.institutionExceedsPercent.replace('{{percent}}', FUNDING_POLICIES.max_institution_percent.toString())
          }
        }
        
        // Validate special project requirements
        if (isSpecialProject) {
          if (!specialProjectJustification.trim()) {
            newErrors.special_justification = "Justificativa é obrigatória para projetos especiais"
          }
        }
        
        if (isChurchPlanting) {
          if (!churchPlantingJustification.trim()) {
            newErrors.church_planting_justification = "Detalhes são obrigatórios para Church Planting"
          }
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getStepConfig = () => {
    let stepConfig = [
      { id: 1, title: "Dados do Projeto", description: "Informações básicas" },
      { id: 2, title: "Atividades", description: "Configure as atividades" },
      { id: 3, title: "Distribuição de Fundos", description: "Configure os fundos" },
    ]

    // Add optional event registration step
    if (formData.register_as_event && !formData.is_private) {
      stepConfig.push({
        id: stepConfig.length + 1,
        title: "Registro de Evento",
        description: "Configure o evento"
      })
      
      stepConfig.push({
        id: stepConfig.length + 1,
        title: "Comunicação",
        description: "Configure a comunicação"
      })
    }

    // Always add review step at the end
    stepConfig.push({
      id: stepConfig.length + 1,
      title: "Revisão",
      description: "Confirme os dados"
    })

    return stepConfig
  }

  const getCurrentStepIndex = () => {
    const stepConfig = getStepConfig()
    return stepConfig.findIndex(step => step.id === currentStep)
  }

  const getTotalSteps = () => {
    return getStepConfig().length
  }

  const handleNext = () => {
    const stepConfig = getStepConfig()
    if (validateStep(currentStep) && currentStep < stepConfig.length) {
      // Clear errors when moving to next step
      setErrors({})
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
                budget_amount: currentActivity.budget_amount!,
                request_subsidy: currentActivity.request_subsidy!,
                is_subsidized: currentActivity.request_subsidy!, // Update is_subsidized based on request_subsidy
                tags: currentActivity.tags!
              }
            : act
        )
      }))
      toast.success(translations.toast.activityUpdated)
    } else {
      // Add new activity
      const newActivity: ProjectActivity = {
        id: `activity-${Date.now()}`,
        name: currentActivity.name!,
        description: currentActivity.description!,
        budget_amount: currentActivity.budget_amount!,
        request_subsidy: currentActivity.request_subsidy!,
        is_subsidized: currentActivity.request_subsidy!, // Default to same as request_subsidy
        tags: currentActivity.tags!
      }

      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity]
      }))
      toast.success(translations.toast.activityAdded)
    }

    // Reset current activity and editing state
    setCurrentActivity({
      name: "",
      description: "",
      budget_amount: 0,
      request_subsidy: false,
      tags: []
    })
    setEditingActivityId(null)
  }

  const handleEditActivity = (activityId: string) => {
    const activity = formData.activities.find(act => act.id === activityId)
    if (activity) {
      setEditingActivityId(activityId)
      setCurrentActivity({
        name: activity.name,
        description: activity.description,
        budget_amount: activity.budget_amount,
        request_subsidy: activity.is_subsidized, // Use is_subsidized to reflect current group
        tags: activity.tags
      })
      toast.success(translations.toast.editingActivity.replace('{{name}}', activity.name))
    }
  }

  const handleSelectPredefinedActivity = (predefinedActivity: typeof PREDEFINED_ACTIVITIES[0]) => {
    setCurrentActivity({
      name: predefinedActivity.name,
      description: predefinedActivity.description,
      budget_amount: predefinedActivity.budget_amount,
      request_subsidy: predefinedActivity.request_subsidy,
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
    const stepConfig = getStepConfig()
    const currentStepConfig = stepConfig[currentStep - 1]
    
    if (!currentStepConfig) return null
    
    // Check by step title since IDs are dynamic
    switch (currentStepConfig.title) {
      case "Dados do Projeto":
        return renderProjectDataStep()
      case "Atividades":
        return renderActivitiesStep()
      case "Distribuição de Fundos":
        return renderFundingDistributionStep()
      case "Registro de Evento":
        return renderEventRegistrationStep()
      case "Comunicação":
        return renderCommunicationStep()
      case "Revisão":
        return renderReviewStep()
      default:
        return null
    }
  }

  const renderEventRegistrationStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Column - Info (1/4 da tela) */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="p-6 rounded-lg border border-muted">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Registro de Evento</h3>
                  <p className="text-xs text-muted-foreground">Configure o evento associado ao projeto</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>Defina os detalhes do evento que será criado para divulgar e organizar as atividades do projeto.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Event Form (3/4 da tela) */}
        <div className="w-full lg:w-3/4">
          <EventRegistrationForm
            data={formData.event || {
              title: formData.title,
              description: formData.description,
              contact_id: "",
              type: "Show/Apresentação",
              language_preference: "nl",
              is_paid_event: false,
              required_volunteers: false,
              target_type: "institution",
            }}
            onChange={(eventData) => setFormData({ ...formData, event: eventData })}
            errors={errors}
            contacts={mockUsers}
            institutions={[{ id: "1", name: "Adventist Church Netherlands" }]}
            departments={mockDepartments}
            churches={[{ id: "1", name: "Amsterdam Adventist Church" }]}
            regions={[{ id: "1", name: "Netherlands Region" }]}
            users={mockUsers}
          />
        </div>
      </div>
    </div>
  )

  const renderCommunicationStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* Left Column - Info (1/4 da tela) */}
        <div className="w-full lg:w-1/4 space-y-4">
          <div className="p-6 rounded-lg border border-muted">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Comunicação</h3>
                  <p className="text-xs text-muted-foreground">Configure a comunicação do projeto</p>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>Crie comunicações para divulgar o projeto, recrutar voluntários ou informar sobre progresso.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Communication Form (3/4 da tela) */}
        <div className="w-full lg:w-3/4">
          <CommunicationForm
            data={formData.communication || {
              title: `Comunicação: ${formData.title}`,
              content: {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: "normal",
                          style: "",
                          text: "Escreva o conteúdo da sua comunicação aqui...",
                          type: "text",
                          version: 1,
                        },
                      ],
                      direction: "ltr",
                      format: "",
                      indent: 0,
                      type: "paragraph",
                      version: 1,
                    },
                  ],
                  direction: "ltr",
                  format: "",
                  indent: 0,
                  type: "root",
                  version: 1,
                },
              } as unknown as import('lexical').SerializedEditorState,
              communication_type: "announcement",
              priority: "medium",
              language_preference: "nl",
              post_now: false,
              target_type: "institution",
            }}
            onChange={(commData) => setFormData({ ...formData, communication: commData })}
            errors={errors}
            institutions={[{ id: "1", name: "Adventist Church Netherlands" }]}
            departments={mockDepartments}
            churches={[{ id: "1", name: "Amsterdam Adventist Church" }]}
            regions={[{ id: "1", name: "Netherlands Region" }]}
            users={mockUsers}
          />
        </div>
      </div>
    </div>
  )

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
                Título do Projeto *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título do projeto"
                className={`h-12 text-base border-2 ${errors.title ? 'border-red-500' : 'border-border'}`}
              />
              {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>

            <div className="space-y-4">
              <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Descrição do Projeto *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva o projeto detalhadamente"
                className={`min-h-[120px] text-base border-2 ${errors.description ? 'border-red-500' : 'border-border'}`}
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Department and Responsible in Row */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <Label htmlFor="department" className="flex items-center gap-2 text-base font-medium">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  {translations.fields.department} *
                </Label>
                <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openDepartment}
                      className={`h-12 w-full justify-between border-2 ${errors.department_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
                    >
                      {formData.department_id
                        ? mockDepartments.find((dept) => dept.id === formData.department_id)?.name
                        : translations.placeholders.selectDepartment}
                      <Building className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Pesquisar departamento..." />
                      <CommandList>
                        <CommandEmpty>Nenhum departamento encontrado.</CommandEmpty>
                        <CommandGroup>
                          {mockDepartments.map((dept) => (
                            <CommandItem
                              key={dept.id}
                              value={dept.name}
                              onSelect={() => {
                                setFormData({ ...formData, department_id: dept.id })
                                setOpenDepartment(false)
                              }}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Building className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{dept.name}</span>
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    R$ {dept.annual_budget.toLocaleString()}
                                  </Badge>
                                </div>
                                {formData.department_id === dept.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.department_id && <p className="text-sm text-red-600">{errors.department_id}</p>}
              </div>

              <div className="flex-1 space-y-4">
                <Label htmlFor="responsible" className="flex items-center gap-2 text-base font-medium">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {translations.fields.responsiblePeople} *
                </Label>
                <Popover open={openResponsible} onOpenChange={setOpenResponsible}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openResponsible}
                      className={`h-12 w-full justify-between border-2 ${errors.responsible_id ? 'border-red-500' : 'border-border'} hover:border-primary/50 transition-colors`}
                    >
                      {formData.responsible_id
                        ? mockUsers.find((user) => user.id === formData.responsible_id)?.name
                        : translations.placeholders.selectResponsible}
                      <Users className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Pesquisar usuário..." />
                      <CommandList>
                        <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                        <CommandGroup>
                          {mockUsers.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={() => {
                                setFormData({ ...formData, responsible_id: user.id })
                                setOpenResponsible(false)
                              }}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{user.name}</span>
                                  <div className="text-xs text-muted-foreground">{user.email}</div>
                                </div>
                                {formData.responsible_id === user.id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.responsible_id && <p className="text-sm text-red-600">{errors.responsible_id}</p>}
              </div>
            </div>

            {/* Project Responsible Type */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-base font-medium">
                <Home className="w-4 h-4 text-muted-foreground" />
                {(translations as any).fields?.projectResponsibleType || "Tipo de Responsabilidade do Projeto"}
              </Label>
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
                  {["personal", "institutional", "church", "region", "department"].map((type) => (
                    <CarouselItem key={type} className="pl-2 basis-1/2 sm:basis-1/3 lg:basis-1/5">
                      {renderResponsibilityType(
                        type,
                        formData.project_responsible_type === type,
                        () => setFormData({ 
                          ...formData, 
                          project_responsible_type: type as "personal" | "institutional" | "church" | "region" | "department" 
                        })
                      )}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
                <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
              </Carousel>
            </div>

            {/* Register as Event Switch */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    Registrar como Evento
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Cria um evento público associado a este projeto</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.is_private 
                    ? "Projetos privados não podem ser registrados como eventos públicos" 
                    : "Cria um evento público associado a este projeto"}
                </p>
              </div>
              <Switch
                checked={formData.register_as_event}
                disabled={formData.is_private}
                onCheckedChange={(checked) => {
                  if (!formData.is_private) {
                    setFormData({ ...formData, register_as_event: checked })
                  }
                }}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 disabled:bg-gray-500 disabled:opacity-70"
              />
            </div>

            {/* Private Project Switch */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    Projeto Privado
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Projeto será visível apenas para membros autorizados</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-xs text-muted-foreground">
                  Projeto será visível apenas para membros autorizados
                </p>
              </div>
              <Switch
                checked={formData.is_private}
                onCheckedChange={(checked) => {
                  if (checked) {
                    // Se marcar como privado, desmarcar evento automaticamente
                    setFormData({ 
                      ...formData, 
                      is_private: checked, 
                      register_as_event: false 
                    })
                  } else {
                    setFormData({ ...formData, is_private: checked })
                  }
                }}
                className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 disabled:bg-gray-500 disabled:opacity-70"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderActivitiesStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full max-w-full overflow-hidden">
        {/* Left Column - Info (responsivo) */}
        <div className="w-full lg:w-1/4 lg:min-w-[280px] lg:max-w-[320px] space-y-4 shrink-0">
          <div className="p-4 lg:p-6 rounded-lg border border-muted">
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

        {/* Right Column - Activities Management (responsivo) */}
        <div className="w-full lg:w-3/4 space-y-4 lg:space-y-6 min-w-0 flex-1">
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
                            {activity.tags.map((tag) => renderTagWithIcon(tag))}
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

          {/* Activity Groups */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                {(translations as any).activityGroups?.title || "Grupos de Atividades"}
              </h4>
              <div className="text-sm text-muted-foreground">
                {formData.activities.length + deletedActivities.length} {(translations as any).activityGroups?.totalActivities || "atividades"}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              {/* Subsidized Activities Group */}
              <ActivityGroup
                title={(translations as any).activityGroups?.subsidized || "Atividades Subsidiadas"}
                activities={subsidizedActivities}
                groupType="subsidized"
                onMove={moveActivityBetweenGroups}
                onDelete={(id) => moveActivityBetweenGroups(id, 'trash')}
                onEdit={editActivity}
                allowDrop={true}
                defaultCollapsed={false}
              />

              {/* Non-Subsidized Activities Group */}
              <ActivityGroup
                title={(translations as any).activityGroups?.nonSubsidized || "Atividades Não Subsidiadas"}
                activities={nonSubsidizedActivities}
                groupType="nonSubsidized"
                onMove={moveActivityBetweenGroups}
                onDelete={(id) => moveActivityBetweenGroups(id, 'trash')}
                onEdit={editActivity}
                allowDrop={true}
                defaultCollapsed={false}
              />
            </div>

            {/* Trash Group */}
            {deletedActivities.length > 0 && (
              <div className="mt-6">
                <ActivityGroup
                  title={(translations as any).activityGroups?.trash || "Atividades Excluídas"}
                  activities={deletedActivities}
                  groupType="trash"
                  onRestore={restoreActivityFromTrash}
                  onClearAll={clearAllDeletedActivities}
                  isTrash={true}
                  allowDrop={false}
                  defaultCollapsed={true}
                />
              </div>
            )}
          </div>

          {/* Add/Edit Activity Form */}
          <div className="p-4 lg:p-6 border-2 rounded-lg bg-card rounded-xl shadow-sm border-border">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h4 className="font-medium flex items-center gap-2">
                  {editingActivityId ? <Settings className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingActivityId ? "Editar Atividade" : "Adicionar Atividade"}
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
                        budget_amount: 0,
                        request_subsidy: false,
                        tags: []
                      })
                    }}
                    className="text-muted-foreground"
                  >
                    Cancelar Edição
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-4">
                  <Label htmlFor="activity_name" className="text-base font-medium">Nome da Atividade *</Label>
                  <Input
                    id="activity_name"
                    value={currentActivity.name || ""}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, name: e.target.value })}
                    placeholder="Digite o nome da atividade"
                    className="h-12 border-2"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label htmlFor="activity_budget" className="text-base font-medium">Valor do Orçamento *</Label>
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
                <Label htmlFor="activity_description" className="text-base font-medium">Descrição da Atividade *</Label>
                <Textarea
                  id="activity_description"
                  value={currentActivity.description || ""}
                  onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                  placeholder="Descreva a atividade detalhadamente"
                  className="min-h-[100px] border-2"
                />
              </div>

              {/* Request Subsidy Switch */}
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      Solicitar Subsídio?
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Esta atividade precisa de subsídio da instituição?</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Esta atividade precisa de subsídio da instituição?
                  </p>
                </div>
                <Switch
                  checked={currentActivity.request_subsidy || false}
                  onCheckedChange={(checked) => setCurrentActivity({ ...currentActivity, request_subsidy: checked })}
                  className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300 disabled:bg-gray-500 disabled:opacity-70"
                />
              </div>

              {/* Activity Tags */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  Tags da Atividade
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
                {editingActivityId ? "Atualizar Atividade" : "Adicionar Atividade"}
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

  const renderFundingDistributionStep = () => {
    const subsidyActivities = formData.activities.filter(act => act.is_subsidized)
    const nonSubsidyActivities = formData.activities.filter(act => !act.is_subsidized)
    const subsidyTotal = subsidyActivities.reduce((sum, act) => sum + act.budget_amount, 0)
    const totalBudget = formData.activities.reduce((sum, act) => sum + act.budget_amount, 0)
    const currentSubsidyPercentage = formData.subsidy_percentage
    
    // Calcular contribuições baseado APENAS nas atividades subsidiadas
    const institutionContribution = (subsidyTotal * currentSubsidyPercentage) / 100
    const churchContribution = totalBudget - institutionContribution
    
    // Handle manual entry calculations - baseado apenas no total das atividades subsidiadas
    const handleManualAmountChange = (value: number) => {
      setManualAmount(value)
      if (subsidyTotal > 0) {
        const percentage = Math.min(100, (value / subsidyTotal) * 100)
        const isSpecialCase = isSpecialProject || isChurchPlanting
        
        // Validate percentage limits
        if (percentage > FUNDING_POLICIES.max_institution_percent && !isSpecialCase) {
          toast.error(`Máximo permitido: ${FUNDING_POLICIES.max_institution_percent}%. Use Projeto Especial ou Church Planting para valores maiores.`)
          return
        }
        
        setManualPercentage(percentage)
        setFormData({ ...formData, subsidy_percentage: percentage })
      }
    }
    
    const handleManualPercentageChange = (value: number) => {
      const isSpecialCase = isSpecialProject || isChurchPlanting
      
      // Validate percentage limits
      if (value > FUNDING_POLICIES.max_institution_percent && !isSpecialCase) {
        toast.error(`Máximo permitido: ${FUNDING_POLICIES.max_institution_percent}%. Use Projeto Especial ou Church Planting para valores maiores.`)
        return
      }
      
      setManualPercentage(value)
      const amount = (subsidyTotal * value) / 100
      setManualAmount(amount)
      setFormData({ ...formData, subsidy_percentage: value })
    }

    // Preparar dados para os KPI Cards
    const kpiCardsData: KPICardData[] = [
      {
        id: "available-amount",
        title: (translations as any).fundingCalculator?.availableAmount || "Valor Disponível",
        value: `R$ ${mockDepartmentBudget.total_available.toLocaleString()}`,
        icon: TrendingUp,
        subtitle: mockDepartmentBudget.department_name
      },
      {
        id: "used-this-year",
        title: (translations as any).fundingCalculator?.usedThisYear || "Usado Este Ano",
        value: `R$ ${mockDepartmentBudget.used_this_year.toLocaleString()}`,
        icon: TrendingDown,
        subtitle: `${Math.round((mockDepartmentBudget.used_this_year / mockDepartmentBudget.total_available) * 100)}% do orçamento`
      },
      {
        id: "remaining-amount",
        title: (translations as any).fundingCalculator?.remainingAmount || "Valor Restante",
        value: `R$ ${mockDepartmentBudget.remaining.toLocaleString()}`,
        icon: Banknote,
        subtitle: "Disponível para novos projetos"
      }
    ]
    
    return (
      <div className="animate-in fade-in-0 duration-300">
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Left Column - Project Overview (1/4) */}
          <div className="w-full lg:w-1/4 space-y-4">
            <div className="p-4 rounded-lg border border-muted">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <PieChart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      {(translations as any).fundingCalculator?.projectOverview || "Visão Geral dos Custos"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Análise financeira do projeto
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Total do Projeto */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">
                        Custo Total do Projeto
                      </span>
                      <span className="text-lg font-bold text-foreground">R$ {totalBudget.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500"></div>
                        <span className="text-muted-foreground">Atividades Subsidiadas</span>
                      </div>
                      <span className="font-medium">R$ {subsidyTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span className="text-muted-foreground">Atividades Não Subsidiadas</span>
                      </div>
                      <span className="font-medium">R$ {(totalBudget - subsidyTotal).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Distribuição de Responsabilidade */}
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-foreground">Distribuição de Responsabilidade</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Home className="w-3 h-3 text-blue-600" />
                          <span className="text-muted-foreground">Igreja</span>
                        </div>
                        <span className="font-medium text-blue-600">R$ {churchContribution.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Building className="w-3 h-3 text-green-600" />
                          <span className="text-muted-foreground">Instituição</span>
                        </div>
                        <span className="font-medium text-green-600">R$ {institutionContribution.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t text-xs text-muted-foreground leading-relaxed">
                  <p>💡 {(translations as any).fundingCalculator?.recalculateAutomatically || "Valores recalculam automaticamente"}</p>
                  <p className="mt-1">📋 {(translations as any).fundingCalculator?.dragToCalculate || "Arraste atividades para calcular financiamento"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Funding Calculator (3/4) */}
          <div className="w-full lg:w-3/4">
            <div className="space-y-6">
              {/* Budget Highlights KPI Cards */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  {(translations as any).fundingCalculator?.budgetHighlights || "Destaques do Orçamento"}
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
                    {kpiCardsData.map((kpi, index) => (
                      <CarouselItem key={kpi.id} className="pl-2 basis-full sm:basis-1/2 lg:basis-1/3">
                        <Card className="h-full">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <kpi.icon className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-sm">{kpi.title}</h5>
                                    <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-foreground">{kpi.value}</span>
                                {kpi.trend && (
                                  <Badge variant={kpi.trend.isPositive ? "default" : "secondary"} className="text-xs">
                                    {kpi.trend.isPositive ? "+" : ""}{kpi.trend.value}% {kpi.trend.label}
                                  </Badge>
                                )}
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

              {/* Special Project Information or Validation Rules */}
              {(isSpecialProject || isChurchPlanting) ? (
                <Collapsible open={isSpecialRulesOpen} onOpenChange={setIsSpecialRulesOpen}>
                  <Card className={`border-2 ${
                    isChurchPlanting ? 'border-green-500' : 'border-orange-500'
                  }`}>
                    <CardHeader>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                          <div className="flex items-center gap-2">
                            {isChurchPlanting && (
                              <>
                                <Sprout className="w-4 h-4 text-green-600" />
                                <CardTitle className="text-base text-green-900">Church Planting - Informações Especiais</CardTitle>
                              </>
                            )}
                            {isSpecialProject && (
                              <>
                                <Globe className="w-4 h-4 text-orange-600" />
                                <CardTitle className="text-base text-orange-900">Projeto Especial - Informações Adicionais</CardTitle>
                              </>
                            )}
                          </div>
                          {isSpecialRulesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </CardHeader>
                    <CollapsibleContent>
                      <CardContent className="space-y-4 pt-0">
                        {/* Funding Rules for Special Projects */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <CheckCircle className={`w-4 h-4 ${isChurchPlanting ? 'text-green-600' : 'text-orange-600'}`} />
                            Regras de Funding Especial
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={`${isChurchPlanting ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                              Subsídio até 100%
                            </Badge>
                            <Badge variant="secondary" className={`${isChurchPlanting ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                              Sem limite de valor
                            </Badge>
                            <Badge variant="secondary" className={`${isChurchPlanting ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                              Análise de justificativa
                            </Badge>
                            {isChurchPlanting && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                                Prioridade missionária
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Special Project Details Form */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="justification">
                              {isChurchPlanting ? "Detalhes da Plantação de Igreja" : "Justificativa do Projeto Especial"}
                            </Label>
                            <Textarea
                              id="justification"
                              placeholder={
                                isChurchPlanting 
                                  ? "Descreva a localização, comunidade alvo, estratégia de plantação, recursos necessários..."
                                  : "Explique a importância estratégica, impacto social ou missionário que justifica o funding especial..."
                              }
                              value={isChurchPlanting ? churchPlantingJustification : specialProjectJustification}
                              onChange={(e) => {
                                if (isChurchPlanting) {
                                  setChurchPlantingJustification(e.target.value)
                                } else {
                                  setSpecialProjectJustification(e.target.value)
                                }
                              }}
                              rows={4}
                              className="min-h-[100px]"
                            />
                            {isChurchPlanting && errors.church_planting_justification && (
                              <p className="text-sm text-red-600">{errors.church_planting_justification}</p>
                            )}
                            {isSpecialProject && errors.special_justification && (
                              <p className="text-sm text-red-600">{errors.special_justification}</p>
                            )}
                          </div>

                          {isChurchPlanting && (
                            <div className="space-y-2">
                              <Label htmlFor="location">Localização da Plantação</Label>
                              <Input
                                id="location"
                                placeholder="Cidade, região ou endereço específico..."
                                value={formData.location_church_plant || ''}
                                onChange={(e) => setFormData({ ...formData, location_church_plant: e.target.value })}
                              />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ) : (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">
                        {(translations as any).fundingCalculator?.fundingRules || "Regras de Financiamento"}
                      </CardTitle>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{(translations as any).fundingCalculator?.validationRules || "Regras de validação para subsídios"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">
                        {(translations as any).fundingCalculator?.maxAmountRule?.replace('{{amount}}', `R$ ${FUNDING_POLICIES.max_institution_amount.toLocaleString()}`) || `Máximo R$ ${FUNDING_POLICIES.max_institution_amount.toLocaleString()} por projeto`}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(translations as any).fundingCalculator?.maxPercentageRule?.replace('{{percent}}', FUNDING_POLICIES.max_institution_percent.toString()) || `Máximo ${FUNDING_POLICIES.max_institution_percent}% de contribuição`}
                      </Badge>
                      {institutionContribution > FUNDING_POLICIES.max_institution_amount && (
                        <Badge className="text-xs bg-black text-white hover:bg-black/90">
                          ⚠️ LIMITE EXCEDIDO: {(translations as any).fundingCalculator?.limitReached || "Este é o máximo que a instituição pode conceder"}
                        </Badge>
                      )}
                      {currentSubsidyPercentage > FUNDING_POLICIES.max_institution_percent && !formData.is_special_case && (
                        <Badge className="text-xs bg-black text-white hover:bg-black/90">
                          ⚠️ PORCENTAGEM EXCEDIDA: Máximo {FUNDING_POLICIES.max_institution_percent}% permitido
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Funding Control with Toggle */}
              {subsidyTotal > 0 && (
                <Card className={cn(
                  isChurchPlanting ? "border-green-500 border-2" : "",
                  isSpecialProject ? "border-orange-500 border-2" : ""
                )}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {(translations as any).fundingCalculator?.subsidyPercentage || "Porcentagem de Subsídio"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {(translations as any).fundingCalculator?.description || "Calcule a distribuição de subsídios sobre as atividades subsidiadas"}
                        </p>
                      </div>
                      
                      {/* Special Options - Icon Toggles */}
                      <div className="flex items-center gap-2">
                        {/* Show only active icon when selected; otherwise show both */}
                        {(!isChurchPlanting && !isSpecialProject) || isChurchPlanting ? (
                          <Dialog open={showChurchPlantingModal} onOpenChange={setShowChurchPlantingModal}>
                              <DialogTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="Church Planting"
                                  className="group relative"
                                  onClick={() => {
                                    const next = !isChurchPlanting
                                    setIsChurchPlanting(next)
                                    if (next) {
                                      setIsSpecialProject(false)
                                      setFormData({ ...formData, is_special_case: true })
                                      setShowChurchPlantingModal(true)
                                    } else {
                                      setFormData({ ...formData, is_special_case: isSpecialProject })
                                    }
                                  }}
                                >
                                  <div className={cn(
                                    "h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                    isChurchPlanting
                                      ? "border-dashed border-green-500 text-green-600 bg-green-50"
                                      : "border-muted text-muted-foreground hover:border-green-400 hover:text-green-500 hover:bg-green-50/50"
                                  )}>
                                    <Sprout className={cn(
                                      "w-4 h-4 transition-colors", 
                                      isChurchPlanting ? "text-green-600" : "group-hover:text-green-500"
                                    )} />
                                  </div>
                                  {/* Label on hover */}
                                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                    Church Planting
                                  </div>
                                </button>
                              </DialogTrigger>
                            <DialogContent className="sm:max-w-[440px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Sprout className="w-5 h-5 text-green-600" />
                                  {(translations as any).fundingCalculator?.infoChurchPlantingTitle || "Church Planting"}
                                </DialogTitle>
                                <DialogDescription>
                                  {(translations as any).fundingCalculator?.infoChurchPlantingBody || "Projetos de plantação de igrejas podem solicitar até 100% de funding da instituição por seu impacto missionário."}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="text-xs text-muted-foreground">
                                {(translations as any).fundingCalculator?.infoChurchPlantingDetails || "Use esta opção quando o projeto envolve iniciar uma nova congregação. O limite de subsídio passa a 100%."}
                              </div>
                              <DialogFooter>
                                <Button onClick={() => setShowChurchPlantingModal(false)}>
                                  {(translations as any).fundingCalculator?.gotIt || "Entendi"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        ) : null}

                        {(!isChurchPlanting && !isSpecialProject) || isSpecialProject ? (
                          <Dialog open={showSpecialProjectModal} onOpenChange={setShowSpecialProjectModal}>
                            <DialogTrigger asChild>
                              <button
                                type="button"
                                aria-label="Projeto Especial"
                                className="group relative"
                                onClick={() => {
                                  const next = !isSpecialProject
                                  setIsSpecialProject(next)
                                  if (next) {
                                    setIsChurchPlanting(false)
                                    setFormData({ ...formData, is_special_case: true })
                                    setShowSpecialProjectModal(true)
                                  } else {
                                    setFormData({ ...formData, is_special_case: isChurchPlanting })
                                  }
                                }}
                              >
                                <div className={cn(
                                  "h-9 w-9 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                                  isSpecialProject
                                    ? "border-orange-500 text-orange-600 bg-orange-50"
                                    : "border-muted text-muted-foreground hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50/50"
                                )}>
                                  <Plus className={cn(
                                    "w-4 h-4 transition-colors", 
                                    isSpecialProject ? "text-orange-600" : "group-hover:text-orange-500"
                                  )} />
                                </div>
                                {/* Label on hover */}
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                  Projeto Especial
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[440px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Globe className="w-5 h-5 text-blue-600" />
                                  {(translations as any).fundingCalculator?.infoSpecialTitle || "Projeto Especial"}
                                </DialogTitle>
                                <DialogDescription>
                                  {(translations as any).fundingCalculator?.infoSpecialBody || "Projetos especiais podem solicitar até 100% de funding. Use quando houver justificativa estratégica ou social relevante."}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="text-xs text-muted-foreground">
                                {(translations as any).fundingCalculator?.infoSpecialDetails || "Ao habilitar, a calculadora permite ajustar o subsídio até 100%."}
                              </div>
                              <DialogFooter>
                                <Button onClick={() => setShowSpecialProjectModal(false)}>
                                  {(translations as any).fundingCalculator?.gotIt || "Entendi"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Manual Entry Toggle */}
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Edit3 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {(translations as any).fundingCalculator?.manualEntry || "Entrada Manual"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isManualEntry 
                              ? (translations as any).fundingCalculator?.enterManualAmount || "Insira o valor que gostaria que a instituição contribuísse"
                              : (translations as any).fundingCalculator?.automaticSlider || "Use o slider para ajustar automaticamente"
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={isManualEntry ? "default" : "outline"}
                        size="sm"
                        onClick={() => setIsManualEntry(!isManualEntry)}
                      >
                        {isManualEntry ? "Manual" : "Auto"}
                      </Button>
                    </div>

                    {isManualEntry ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Manual Amount Input */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Valor de Contribuição da Instituição
                          </Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                            <Input
                              type="number"
                              value={manualAmount}
                              onChange={(e) => handleManualAmountChange(Number(e.target.value))}
                              className="pl-8"
                              min={0}
                              max={subsidyTotal}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Máximo: R$ {subsidyTotal.toLocaleString()} (valor das atividades subsidiadas)
                          </p>
                        </div>
                        
                        {/* Manual Percentage Input */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Porcentagem de Contribuição
                          </Label>
                          <div className="relative">
                            <Input
                              type="number"
                              value={Math.round(manualPercentage)}
                              onChange={(e) => handleManualPercentageChange(Number(e.target.value))}
                              className="pr-8"
                              min={0}
                              max={(isSpecialProject || isChurchPlanting) ? 100 : FUNDING_POLICIES.max_institution_percent}
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Aplicado sobre R$ {subsidyTotal.toLocaleString()}
                            {(isSpecialProject || isChurchPlanting) && (
                              <span className="text-green-600 font-medium"> • Modo especial: até 100%</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {(translations as any).fundingCalculator?.percentageSlider || "Slider de Porcentagem"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">{Math.round(currentSubsidyPercentage)}%</span>
                          </div>
                        </div>
                        
                        <Slider
                          value={[currentSubsidyPercentage]}
                          onValueChange={(value) => {
                            const newPercentage = value[0]
                            const isSpecialCase = isSpecialProject || isChurchPlanting
                            if (newPercentage > FUNDING_POLICIES.max_institution_percent && !isSpecialCase) {
                              toast.error(`Máximo permitido: ${FUNDING_POLICIES.max_institution_percent}%. Use Projeto Especial ou Church Planting para valores maiores.`)
                              return
                            }
                            setFormData({ ...formData, subsidy_percentage: newPercentage })
                          }}
                          min={0}
                          max={(isSpecialProject || isChurchPlanting) ? 100 : FUNDING_POLICIES.max_institution_percent}
                          step={1}
                          className="w-full"
                        />
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0% (Sem Subsídio)</span>
                          <span>
                            {(isSpecialProject || isChurchPlanting) ? '100%' : `${FUNDING_POLICIES.max_institution_percent}%`} 
                            {isSpecialProject && ' (Projeto Especial)'}
                            {isChurchPlanting && ' (Church Planting)'}
                            {!isSpecialProject && !isChurchPlanting && ' (Máximo Regular)'}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Detailed Results Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Church Contribution Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-blue-600" />
                      <CardTitle className="text-sm font-medium">Contribuição da Igreja</CardTitle>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Valor total que a igreja será responsável por financiar</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      R$ {churchContribution.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(totalBudget > 0 ? (churchContribution / totalBudget) * 100 : 0)}% do orçamento total
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Inclui todas as atividades não-subsidiadas + parte da igreja nas subsidiadas
                    </div>
                  </CardContent>
                </Card>
                
                {/* Institution Contribution Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-green-600" />
                      <CardTitle className="text-sm font-medium">Contribuição da Instituição</CardTitle>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Subsídio calculado sobre R$ {subsidyTotal.toLocaleString()} das atividades subsidiadas</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      R$ {institutionContribution.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(currentSubsidyPercentage)}% sobre atividades subsidiadas
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      Base de cálculo: R$ {subsidyTotal.toLocaleString()} em atividades subsidiadas
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Groups with Drag & Drop */}
              <div className="rounded-lg border border-muted space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-medium text-foreground">Distribuição por Atividades</h5>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Arraste atividades entre grupos para recalcular automaticamente</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {/* Subsidized Activities Group */}
                <ActivityGroup
                  title={(translations as any).activityGroups?.subsidized || "Atividades Subsidiadas"}
                  activities={subsidyActivities}
                  onMove={moveActivityBetweenGroups}
                  onEdit={editActivity}
                  groupType="subsidized"
                  defaultCollapsed={false}
                />

                {/* Non-Subsidized Activities Group */}
                <ActivityGroup
                  title={(translations as any).activityGroups?.nonSubsidized || "Atividades Não Subsidiadas"}
                  activities={nonSubsidyActivities}
                  onMove={moveActivityBetweenGroups}
                  onEdit={editActivity}
                  groupType="nonSubsidized"
                  defaultCollapsed={false}
                />

                {/* Deleted Activities Group */}
                {deletedActivities.length > 0 && (
                  <ActivityGroup
                    title={(translations as any).activityGroups?.trash || "Atividades Excluídas"}
                    activities={deletedActivities}
                    onMove={moveActivityBetweenGroups}
                    onRestore={restoreActivityFromTrash}
                    onClearAll={clearAllDeletedActivities}
                    groupType="trash"
                    isTrash={true}
                    defaultCollapsed={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderReviewStep = () => {
    // Cálculos para os highlights
    const totalBudget = formData.total_budget
    const churchContribution = formData.church_contribution
    const institutionContribution = formData.institution_contribution
    
    const subsidizedActivities = formData.activities.filter(a => a.request_subsidy)
    const nonSubsidizedActivities = formData.activities.filter(a => !a.request_subsidy)
    
    const totalActivities = formData.activities.length
    const averageActivityCost = totalActivities > 0 ? totalBudget / totalActivities : 0

    // Dados para o carousel de KPIs com i18n
    const highlightKPIs = [
      {
        id: "total-budget",
        title: getCurrentTranslation('projects.summary.totalBudget') || translations.summary.totalBudget,
        value: `R$ ${totalBudget.toLocaleString()}`,
        icon: DollarSign,
        subtitle: `${totalActivities} ${getCurrentTranslation('projects.summary.activities') || translations.summary.activities.toLowerCase()}`,
        color: "text-blue-600"
      },
      {
        id: "church-contribution", 
        title: `${getCurrentTranslation('projects.summary.church') || translations.summary.church} - ${getCurrentTranslation('projects.fields.churchContribution') || translations.fields.churchContribution}`,
        value: `R$ ${churchContribution.toLocaleString()}`,
        icon: Home,
        subtitle: `${Math.round((churchContribution / totalBudget) * 100)}% ${getCurrentTranslation('projects.summary.total') || 'do total'}`,
        color: "text-green-600"
      },
      {
        id: "institution-contribution",
        title: `${getCurrentTranslation('projects.summary.institution') || translations.summary.institution} - ${getCurrentTranslation('projects.common.contribution') || 'Contribuição'}`,
        value: `R$ ${institutionContribution.toLocaleString()}`,
        icon: Building,
        subtitle: `${Math.round((institutionContribution / totalBudget) * 100)}% ${getCurrentTranslation('projects.summary.total') || 'do total'}`,
        color: "text-purple-600"
      },
      {
        id: "subsidized-activities",
        title: getCurrentTranslation('projects.highlights.subsidizedActivities') || "Atividades Subsidiadas",
        value: subsidizedActivities.length.toString(),
        icon: Star,
        subtitle: `R$ ${subsidizedActivities.reduce((sum, a) => sum + a.budget_amount, 0).toLocaleString()}`,
        color: "text-amber-600"
      },
      {
        id: "non-subsidized-activities",
        title: getCurrentTranslation('projects.highlights.nonSubsidizedActivities') || "Atividades Não Subsidiadas", 
        value: nonSubsidizedActivities.length.toString(),
        icon: Sprout,
        subtitle: `R$ ${nonSubsidizedActivities.reduce((sum, a) => sum + a.budget_amount, 0).toLocaleString()}`,
        color: "text-indigo-600"
      },
      {
        id: "average-cost",
        title: getCurrentTranslation('projects.highlights.averageActivityCost') || "Custo Médio por Atividade",
        value: `R$ ${averageActivityCost.toLocaleString()}`,
        icon: Calculator,
        subtitle: getCurrentTranslation('projects.common.perActivity') || "por atividade",
        color: "text-teal-600"
      }
    ]

    // Detectar se é projeto especial
    const isProjectSpecial = isSpecialProject || isChurchPlanting

    return (
      <div className="animate-in fade-in-0 duration-300">

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Left Column - Info (1/4 da tela) */}
          <div className="w-full lg:w-1/4 space-y-4">
            <Card className="bg-card">
              <CardContent className="p-6">
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

                  {/* Special Project Badge */}
                  {isProjectSpecial && (
                    <div className="pt-4 border-t border-border">
                      <div className={`p-3 rounded-lg border-2 ${
                        isChurchPlanting 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-orange-50 border-orange-200 text-orange-700'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {isChurchPlanting ? (
                            <Sprout className="w-4 h-4" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                          <span className="font-medium text-sm">
                            {isChurchPlanting ? 'Church Planting' : 'Projeto Especial'}
                          </span>
                        </div>
                        <p className="text-xs">
                          {isChurchPlanting 
                            ? 'Projeto de plantação de igreja com financiamento especial até 100%'
                            : 'Projeto especial com políticas de financiamento diferenciadas'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Review Summary (3/4 da tela) */}
          <div className="w-full lg:w-3/4">
            <div className="space-y-6">
              {/* Project Basic Info - Collapsible */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border border-muted rounded-lg hover:bg-muted/50 transition-colors bg-card">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <h5 className="font-semibold text-foreground">{translations.summary.projectInfo}</h5>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Card className="bg-card">
                    <CardContent className="p-4 space-y-4">
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
                        <span className="text-muted-foreground">Responsável:</span>
                        <p className="font-medium">
                          {mockUsers.find(u => u.id === formData.responsible_id)?.name || "Não selecionado"}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tipo de Responsabilidade:</span>
                        <p className="font-medium">{formData.project_responsible_type}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Projeto Privado:</span>
                        <p className="font-medium">{formData.is_private ? "Sim" : "Não"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Registrar como Evento:</span>
                        <p className="font-medium">{formData.register_as_event ? "Sim" : "Não"}</p>
                      </div>
                    </div>
                    
                      <div className="col-span-2">
                        <span className="text-muted-foreground">{translations.fields.projectDescription}:</span>
                        <p className="font-medium mt-1 text-sm">{formData.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Financial Calculations - Collapsible */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border border-muted rounded-lg hover:bg-muted/50 transition-colors bg-card">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-muted-foreground" />
                    <h5 className="font-semibold text-foreground">{translations.summary.budgetDistribution}</h5>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Card className="bg-card">
                    <CardContent className="p-4 space-y-6">
                      {/* Distribution Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        <Card className="">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <DollarSign className="w-5 h-5 text-muted-foreground" />
                              <div className="text-lg font-bold text-foreground">
                                R$ {totalBudget.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">{translations.summary.totalBudget}</div>
                          </CardContent>
                        </Card>
                        <Card className="">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Home className="w-5 h-5 text-muted-foreground" />
                              <div className="text-lg font-bold text-foreground">
                                R$ {churchContribution.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {translations.summary.church} ({Math.round((churchContribution / totalBudget) * 100)}%)
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Building className="w-5 h-5 text-muted-foreground" />
                              <div className="text-lg font-bold text-foreground">
                                R$ {institutionContribution.toLocaleString()}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {translations.summary.institution} ({Math.round((institutionContribution / totalBudget) * 100)}%)
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Detailed Calculations */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                          <CardContent className="p-4">
                            <h6 className="font-medium text-foreground mb-3 flex items-center gap-2">
                              <PieChart className="w-4 h-4 text-muted-foreground" />
                              Detalhamento dos Cálculos
                            </h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Valor máximo instituição (65%):</span>
                                <span className="font-medium">R$ {(totalBudget * 0.65).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Valor máximo por projeto:</span>
                                <span className="font-medium">R$ 5.000</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Valor solicitado instituição:</span>
                                <span className="font-medium text-foreground">R$ {institutionContribution.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Capacidade restante:</span>
                                <span className="font-medium">R$ {Math.max(0, Math.min(5000, totalBudget * 0.65) - institutionContribution).toLocaleString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        

               
                          <CardContent className="p-4">
                            <h6 className="font-medium text-foreground mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-muted-foreground" />
                              Conformidade com Políticas
                            </h6>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Percentual máximo (65%):</span>
                                <Badge variant={institutionContribution <= totalBudget * 0.65 ? "default" : "destructive"}>
                                  {institutionContribution <= totalBudget * 0.65 ? "✓ Conforme" : "✗ Excedido"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Valor máximo (R$ 5.000):</span>
                                <Badge variant={institutionContribution <= 5000 ? "default" : "destructive"}>
                                  {institutionContribution <= 5000 ? "✓ Conforme" : "✗ Excedido"}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Igreja mínima (35%):</span>
                                <Badge variant={churchContribution >= totalBudget * 0.35 ? "default" : "destructive"}>
                                  {churchContribution >= totalBudget * 0.35 ? "✓ Conforme" : "✗ Insuficiente"}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
           
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Subsidized Activities - Collapsible */}
              {subsidizedActivities.length > 0 && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border border-muted rounded-lg hover:bg-muted/50 transition-colors bg-card">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-muted-foreground" />
                      <h5 className="font-semibold text-foreground">
                        Atividades Subsidiadas ({subsidizedActivities.length})
                      </h5>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <Card className="bg-card">
                      <CardContent className="p-4 space-y-3">
                        {subsidizedActivities.map((activity) => (
                          <Card key={activity.id} className="bg-muted/50">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h6 className="font-medium text-sm text-foreground">{activity.name}</h6>
                                <Badge variant="outline" className="text-xs">
                                  R$ {activity.budget_amount.toLocaleString()}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                              {activity.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {activity.tags.map((tag) => renderTagWithIcon(tag))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        <div className="pt-2 border-t border-border">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-foreground">Subtotal Atividades Subsidiadas:</span>
                            <span className="text-foreground font-bold">
                              R$ {subsidizedActivities.reduce((sum, a) => sum + a.budget_amount, 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              )}

              {/* Non-Subsidized Activities - Collapsible */}
              {nonSubsidizedActivities.length > 0 && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border border-muted rounded-lg hover:bg-muted/50 transition-colors bg-card">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-4 h-4 text-muted-foreground" />
                      <h5 className="font-semibold text-foreground">
                        Atividades Não Subsidiadas ({nonSubsidizedActivities.length})
                      </h5>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4">
                    <Card className="bg-card">
                      <CardContent className="p-4 space-y-3">
                        {nonSubsidizedActivities.map((activity) => (
                          <Card key={activity.id} className="bg-muted/50">
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h6 className="font-medium text-sm text-foreground">{activity.name}</h6>
                                <Badge variant="outline" className="text-xs">
                                  R$ {activity.budget_amount.toLocaleString()}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{activity.description}</p>
                              {activity.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {activity.tags.map((tag) => renderTagWithIcon(tag))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                        <div className="pt-2 border-t border-border">
                          <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-foreground">Subtotal Atividades Igreja:</span>
                            <span className="text-foreground font-bold">
                              R$ {nonSubsidizedActivities.reduce((sum, a) => sum + a.budget_amount, 0).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <AppLayout>
        <div className="w-full max-w-full overflow-hidden">{/* Header */}
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
          <div className="flex items-center justify-center mb-4 w-full">
            <div className="flex items-center w-full max-w-2xl">
              {getStepConfig().map((step, index) => {
                const icons = [FileText, Activity, DollarSign, CalendarIcon, Settings, CheckCircle]
                const Icon = icons[index] || FileText
                const isActive = index + 1 === currentStep
                const isCompleted = index + 1 < currentStep
                
                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 relative z-10",
                        isActive ? "border-primary bg-primary text-primary-foreground" :
                        isCompleted ? "border-green-500 bg-green-500 text-white" :
                        "border-muted-foreground bg-background text-muted-foreground"
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    {index < getStepConfig().length - 1 && (
                      <div className={cn(
                        "flex-1 h-0.5 transition-all duration-300 relative -mx-2",
                        isCompleted ? "bg-green-500" : "bg-muted"
                      )} />
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {getStepConfig()[currentStep - 1]?.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {getStepConfig()[currentStep - 1]?.description}
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
              {currentStep < getStepConfig().length ? (
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
                  disabled={isLoading}
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
    </TooltipProvider>
  )
}

// Loading component for Suspense fallback
function ProjectRegisterLoading() {
  return (
    <AppLayout>
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-2 animate-pulse" />
            <div className="h-4 bg-muted rounded w-64 animate-pulse" />
          </div>
          <div className="h-9 bg-muted rounded w-32 animate-pulse" />
        </div>
        
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                {step < 4 && <div className="w-12 sm:w-16 h-0.5 mx-2 bg-muted animate-pulse" />}
              </div>
            ))}
          </div>
          <div className="text-center space-y-2">
            <div className="h-6 bg-muted rounded w-32 mx-auto animate-pulse" />
            <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse" />
          </div>
        </div>
        
        <div className="min-h-[60vh] bg-muted rounded animate-pulse" />
      </div>
    </AppLayout>
  )
}

// Main component with Suspense wrapper
export default function ProjectRegisterPage() {
  return (
    <Suspense fallback={<ProjectRegisterLoading />}>
      <ProjectRegisterContent />
    </Suspense>
  )
}
