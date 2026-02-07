"use client"

import React, { useState, useEffect, useMemo, Suspense, useRef } from "react"
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
  Building2,
  DollarSign,
  Settings,
  CheckCircle,
  Calendar as CalendarIcon,
  Users,
  Activity as ActivityIcon,
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
import { useInstitution } from "@/contexts/institution-context"
import { useCurrency } from "@/contexts/currency-context"
import { projectRegisterTranslations } from "@/lib/translations/project-register"
import { projectTranslations } from "@/lib/translations/projects"
import { LanguageSelector } from "@/components/shared/language-selector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import ActivityGroup from '@/components/projects/activity-group'
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
import { UserMultiSelector, User } from "@/components/shared/user-multi-selector"
import { UsersAvatarGroup, UserAvatarData } from "@/components/shared/users-avatar-group"
import { ProjectDataStep } from "@/components/projects/steps/project-data-step"
import type { ProjectFormData, ProjectActivity } from "@/components/projects/types"
type FormData = ProjectFormData
type Activity = ProjectActivity
import toast from "react-hot-toast"
import { useMutation, useQuery } from "@apollo/client"
import { CREATE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { GET_DEPARTMENTS_QUERY } from "@/graphql/queries/DEPARTMENTS_QUERY"
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY"
import { GET_PROJECTS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { GET_CHURCHES_QUERY } from "@/graphql/queries/CHURCH_QUERY"
import { ProjectType, LanguagePreference, EventType } from "@/types/globalTypes"
import "@/lib/i18n"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

// Predefined activities with translation keys
// The 'key' field is used to fetch translations, tagKeys are database keys
const PREDEFINED_ACTIVITIES = [
  {
    key: 'templeRenovation',
    budget_amount: 15000,
    request_subsidy: true,
    is_subsidized: true,
    tagKeys: ["reform", "equipment"]
  },
  {
    key: 'soundEquipment',
    budget_amount: 8000,
    request_subsidy: true,
    is_subsidized: true,
    tagKeys: ["equipment"]
  },
  {
    key: 'missionaryTrip',
    budget_amount: 5000,
    request_subsidy: true,
    is_subsidized: true,
    tagKeys: ["travel", "events"]
  },
  {
    key: 'leadershipTraining',
    budget_amount: 3000,
    request_subsidy: false,
    is_subsidized: false,
    tagKeys: ["training"]
  },
  {
    key: 'evangelismEvent',
    budget_amount: 12000,
    request_subsidy: true,
    is_subsidized: true,
    tagKeys: ["events", "marketing", "food"]
  }
]

// Icons for activity tags - using English keys for consistency
const TAG_ICONS: { [key: string]: typeof Home } = {
  "reform": Home,
  "equipment": Settings,
  "travel": Target,
  "events": CalendarIcon,
  "training": Users,
  "marketing": ActivityIcon,
  "food": DollarSign,
  "technology": Calculator,
  "maintenance": AlertTriangle,
  "supplies": Plus,
  "materials": Plus,
  "transport": Target,
  "accommodation": Home
}

// Types imported from components/projects/types
export type { ProjectActivity, ProjectFormData } from '@/components/projects/types'

// Predefined activity tags - using English keys
const ACTIVITY_TAGS = [
  "reform", "equipment", "travel", "events", "materials",
  "training", "marketing", "food", "transport", "accommodation"
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
  const { formatCurrency, selectedCurrency } = useCurrency()

  // Helper to render tag with icon and translation
  const renderTagWithIcon = (tagKey: string, className?: string) => {
    const IconComponent = TAG_ICONS[tagKey] || Tag
    const translatedTag = t(`projectRegister.tags.${tagKey}`)
    return (
      <Badge key={tagKey} variant="outline" className={cn("text-xs px-2 py-1 bg-muted/50 flex items-center gap-1", className)}>
        <IconComponent className="w-3 h-3" />
        {translatedTag}
      </Badge>
    )
  }


  // Get institution context
  const { currentInstitutionData } = useInstitution()
  const institutionId = currentInstitutionData?.id

  // GraphQL mutation for creating project
  const [createProjectMutation, { loading: creatingProject }] = useMutation(CREATE_PROJECT_MUTATION, {
    refetchQueries: [
      {
        query: GET_PROJECTS_QUERY,
        variables: { institutionId }
      }
    ],
    onCompleted: (data) => {
      // Clear draft from sessionStorage on success
      try {
        sessionStorage.removeItem(DRAFT_KEY)
      } catch {
        // ignore storage errors
      }

      toast.success(translations.toast.projectCreated, {
        duration: 3000
      })
      // Navigate back to projects page
      router.push('/projects')
    },
    onError: (error) => {
      // Extract user-friendly error message
      const errorMessage = error.graphQLErrors?.[0]?.message || error.message || 'Erro desconhecido'
      // Only show the first line of the error (not the stack trace)
      const userFriendlyMessage = errorMessage.split('\n')[0]
      toast.error(`${translations.toast.failedToSave}: ${userFriendlyMessage}`)
    },
  })

  // Fetch departments from database filtered by institution
  const { data: departmentsData, loading: loadingDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  // Fetch users from database filtered by institution
  const { data: usersData, loading: loadingUsers } = useQuery(GET_ALL_USERS_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  // Fetch churches from database filtered by institution
  const { data: churchesData, loading: loadingChurches } = useQuery(GET_CHURCHES_QUERY, {
    variables: { institution_id: institutionId },
    skip: !institutionId
  })

  // Extract data with fallback to empty arrays and filter by current year budget
  const currentYear = new Date().getFullYear()
  const departments = (departmentsData?.departments || []).filter((dept: any) =>
    dept.annual_budgets?.some((budget: any) => budget.year === currentYear && budget.is_locked === true)
  )
  const users = usersData?.users || []
  const churches = churchesData?.churches || []

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
  // renderResponsibilityType moved to ProjectDataStep component

  // ActivityGroup extracted to components/projects/activity-group.tsx
  // Check if editing existing project
  const projectId = searchParams.get('edit')
  const isEditing = !!projectId

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
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
    church_department_id: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({
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
  const [deletedActivities, setDeletedActivities] = useState<Activity[]>([])

  // Ref for activity form to scroll into view
  const activityFormRef = useRef<HTMLDivElement>(null)

  // Ref for user selector dialog
  const userSelectorRef = useRef<HTMLButtonElement>(null)

  // Draft persistence (sessionStorage)
  const DRAFT_KEY = `project_register_draft:${projectId || 'new'}`
  const saveTimer = useRef<number | null>(null)

  // Load draft on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw)

      if (draft?.formData) setFormData(prev => ({ ...prev, ...draft.formData }))
      if (typeof draft?.manualAmount === 'number') setManualAmount(draft.manualAmount)
      if (typeof draft?.manualPercentage === 'number') setManualPercentage(draft.manualPercentage)
      if (typeof draft?.isManualEntry === 'boolean') setIsManualEntry(draft.isManualEntry)
      if (typeof draft?.isSpecialProject === 'boolean') setIsSpecialProject(draft.isSpecialProject)
      if (typeof draft?.isChurchPlanting === 'boolean') setIsChurchPlanting(draft.isChurchPlanting)
      if (typeof draft?.currentStep === 'number') setCurrentStep(draft.currentStep)
      if (draft?.currentActivity) setCurrentActivity(prev => ({ ...prev, ...draft.currentActivity }))
      if (draft?.editingActivityId) setEditingActivityId(draft.editingActivityId)
      toast.success(translations.toast.draftLoaded)
    } catch (err) {
      // ignore parse errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Autosave draft on changes (debounced)
  useEffect(() => {
    try {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        const draft = {
          formData,
          manualAmount,
          manualPercentage,
          isManualEntry,
          isSpecialProject,
          isChurchPlanting,
          currentStep,
          currentActivity,
          editingActivityId
        }
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
      }, 500)
    } catch (err) {
      // ignore storage errors
    }

    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, manualAmount, manualPercentage, isManualEntry, isSpecialProject, isChurchPlanting, currentStep, currentActivity, editingActivityId])

  const clearDraft = () => {
    try {
      sessionStorage.removeItem(DRAFT_KEY)
      toast.success(translations.toast.draftCleared)
    } catch {
      // ignore
    }
  }

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

  // Update currentActivity default assignee when project responsible changes
  useEffect(() => {
    if (formData.responsible_id && !editingActivityId) {
      // Only update if not currently editing an activity and the assignee_ids is empty or only has one item
      setCurrentActivity(prev => {
        // Check if current assignee_ids is empty or needs to be updated with project owner
        const shouldUpdate = !prev.assignee_ids ||
          prev.assignee_ids.length === 0 ||
          (prev.assignee_ids.length === 1 && prev.assignee_ids[0] !== formData.responsible_id)

        if (shouldUpdate) {
          return {
            ...prev,
            assignee_ids: [formData.responsible_id]
          }
        }
        return prev
      })
    }
  }, [formData.responsible_id, editingActivityId])

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
      toast.success(translations.toast.activityMovedToTrash.replace('{{name}}', activityToDelete.name))
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

  const handleMoveToTrash = (id: string) => moveActivityBetweenGroups(id, 'trash')

  const restoreActivityFromTrash = (activityId: string) => {
    const deletedActivity = deletedActivities.find(a => a.id === activityId)
    if (!deletedActivity) return

    setDeletedActivities(prev => prev.filter(a => a.id !== activityId))
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, deletedActivity]
    }))
    toast.success(translations.toast.activityRestored.replace('{{name}}', deletedActivity.name))
  }

  const clearAllDeletedActivities = () => {
    const count = deletedActivities.length
    setDeletedActivities([])
    toast.success(translations.toast.activitiesPermanentlyDeleted.replace('{{count}}', count.toString()))
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


  usePageTitle({
    title: isEditing ? "Edit Project" : "New Project",
    showBreadcrumbsInHeader: true
  })

  // Calculate totals from activities
  useEffect(() => {
    const totalBudget = formData.activities.reduce((sum, act) => sum + act.budget_amount, 0)
    const subsidyBudget = formData.activities
      .filter(act => act.is_subsidized)
      .reduce((sum, act) => sum + act.budget_amount, 0)

    const requestContribution = (subsidyBudget * formData.subsidy_percentage) / 100
    const selfContribution = totalBudget - requestContribution

    setFormData(prev => ({
      ...prev,
      total_budget: totalBudget,
      church_contribution: selfContribution,
      institution_contribution: requestContribution
    }))
  }, [formData.activities, formData.subsidy_percentage])

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        // Use _isStepValid property from ProjectDataStep component
        if (formData._isStepValid === false) {
          if (!formData.title?.trim()) newErrors.title = translations.validation.projectTitleRequired
          if (!formData.description?.trim()) newErrors.description = translations.validation.projectDescriptionRequired
          if (!formData.department_id) newErrors.department_id = translations.validation.departmentRequired
          if (!formData.responsible_id) newErrors.responsible_id = translations.validation.responsiblePersonRequired
          if (formData.project_responsible_type === 'church' && !formData.church_id) {
            newErrors.church_id = (translations as any).validation?.churchRequired || "Selecione a igreja"
          }
          // Special case for no departments available
          if (departments.length === 0) {
            newErrors.department_id = t('projectRegister.validation.noDepartmentsAvailable', 'Nenhum departamento está disponível para seleção')
          }
        }
        break

      case 2:
        if (formData.activities.length === 0) newErrors.activities = translations.validation.activityRequired
        break

      case 3:
        // Validate funding policies for regular projects
        if (!isSpecialProject && !isChurchPlanting) {
          if (formData.institution_contribution > FUNDING_POLICIES.max_institution_amount) {
            newErrors.funding = translations.validation.institutionExceedsAmount.replace('{{amount}}', formatCurrency(FUNDING_POLICIES.max_institution_amount))
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
            newErrors.church_planting_justification = t('projectRegister.fundingDistribution.churchPlantingDetailsRequired')
          }
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getStepConfig = () => {
    let stepConfig = [
      { id: 1, title: translations.steps.projectInfo.title, description: translations.steps.projectInfo.description },
      { id: 2, title: translations.steps.activities.title, description: translations.steps.activities.description },
      { id: 3, title: translations.steps.funding.title, description: translations.steps.funding.description },
    ]

    // Add optional event registration step
    if (formData.register_as_event && !formData.is_private) {
      stepConfig.push({
        id: stepConfig.length + 1,
        title: translations.steps.eventRegistration.title,
        description: translations.steps.eventRegistration.description
      })

      stepConfig.push({
        id: stepConfig.length + 1,
        title: translations.steps.communication.title,
        description: translations.steps.communication.description
      })
    }

    // Always add review step at the end
    stepConfig.push({
      id: stepConfig.length + 1,
      title: translations.steps.review.title,
      description: translations.steps.review.description
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

    if (!currentActivity.assignee_ids || currentActivity.assignee_ids.length === 0) {
      toast.error(t('activities.user_selector.minimum_required') || 'Pelo menos um responsável deve ser selecionado para a atividade')
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
              assignee_ids: currentActivity.assignee_ids || [], // Include assignees
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
        assignee_ids: currentActivity.assignee_ids || [], // Include assignees
        tags: currentActivity.tags!
      }

      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity]
      }))
      toast.success(translations.toast.activityAdded)
    }

    // Reset current activity and editing state with fresh references
    // Pre-populate assignee_ids with project responsible (owner) as default
    const defaultAssigneeIds = formData.responsible_id ? [formData.responsible_id] : []

    const resetActivity = {
      name: "",
      description: "",
      budget_amount: 0,
      request_subsidy: false,
      assignee_ids: defaultAssigneeIds, // Pre-fill with project owner
      tags: []
    }
    setCurrentActivity(resetActivity)
    setEditingActivityId(null)
  }

  const handleUsersChange = (selectedUsers: User[]) => {
    const assigneeIds = selectedUsers.map(user => user.id)
    setCurrentActivity({ ...currentActivity, assignee_ids: assigneeIds })
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
        assignee_ids: activity.assignee_ids || [], // Load existing assignees when editing
        tags: activity.tags
      })
      toast.success(translations.toast.editingActivity.replace('{{name}}', activity.name))
    }
  }

  const handleSelectPredefinedActivity = (predefinedActivity: typeof PREDEFINED_ACTIVITIES[0]) => {
    // Get translated name and description
    const translatedName = t(`projectRegister.quickActivities.${predefinedActivity.key}.name`)
    const translatedDescription = t(`projectRegister.quickActivities.${predefinedActivity.key}.description`)

    // Convert tagKeys to translated tags for display (store keys in database)
    const translatedTags = predefinedActivity.tagKeys.map(tagKey => t(`projectRegister.tags.${tagKey}`))

    // Pre-populate assignee_ids with project responsible (owner) if available
    const defaultAssigneeIds = formData.responsible_id ? [formData.responsible_id] : []

    setCurrentActivity({
      name: translatedName,
      description: translatedDescription,
      budget_amount: predefinedActivity.budget_amount,
      request_subsidy: predefinedActivity.request_subsidy,
      assignee_ids: defaultAssigneeIds, // Pre-fill with project owner
      tags: predefinedActivity.tagKeys // Store English keys for database compatibility
    })

    // Scroll to activity form to show filled data
    setTimeout(() => {
      activityFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      // Optional: Focus on the first input to highlight the form
      const firstInput = activityFormRef.current?.querySelector('input')
      if (firstInput) {
        setTimeout(() => {
          firstInput.focus()
          firstInput.select()
        }, 500)
      }
    }, 150)

    // Show enhanced toast with activity details
    toast.success(
      t('projectRegister.activityForm.quickActivitySelected', { name: translatedName }),
      {
        duration: 4000
      }
    )
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

    if (!formData.responsible_id) {
      toast.error(t('projectRegister.validation.responsiblePersonInvalid') || translations.validation.responsiblePersonRequired)
      return
    }

    // Validate that the responsible user exists in the users list
    const selectedUser = users.find(u => u.id === formData.responsible_id)
    if (!selectedUser) {
      toast.error(t('projectRegister.validation.responsiblePersonInvalid') || translations.validation.responsiblePersonRequired)
      return
    }





    setIsLoading(true)
    const loadingToast = toast.loading(isEditing ? translations.toast.updatingProject : translations.toast.creatingProject)

    try {
      // Map tag strings to ActivityTags enum
      const mapTagToEnum = (tag: string): string => {
        const tagMap: Record<string, string> = {
          'Equipamentos': 'EQUIPMENT',
          'Materiais': 'MATERIALS',
          'Serviços': 'SERVICES',
          'Viagens': 'TRAVEL',
          'Eventos': 'EVENT',
          'Transporte': 'TRANSPORT',
          'Marketing': 'MARKETING',
          'Reforma': 'REFORM',
          'Treinamento': 'TRAINING',
          'Alimentação': 'FEEDING',
          'Hospedagem': 'ACCOMMODATION',
        }
        return tagMap[tag] || 'MATERIALS'
      }


      // Calculate total subsidy limit: min(5000, 65% of total activities budget)
      const totalActivitiesBudget = formData.activities.reduce((sum, act) => sum + act.budget_amount, 0)
      const totalSubsidyLimit = Math.min(5000, totalActivitiesBudget * 0.65)

      // Calculate how much subsidy to allocate to each subsidized activity
      const subsidizedActivities = formData.activities.filter(act => act.is_subsidized)
      const subsidizedActivitiesCount = subsidizedActivities.length

      // Map activities to backend format
      const mappedActivities = formData.activities.map(activity => {
        const activityDeadline = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() // 60 days from now

        // Calculate subsidy for this activity proportionally if subsidized
        let activitySubsidy = 0
        if (activity.is_subsidized && subsidizedActivitiesCount > 0) {
          // Use custom amount if provided, otherwise distribute total limit proportionally
          if (activity.institution_requested_amount) {
            activitySubsidy = activity.institution_requested_amount
          } else {
            // Distribute total subsidy limit proportionally based on activity budget
            const subsidizedBudgetTotal = subsidizedActivities.reduce((sum, act) => sum + act.budget_amount, 0)
            activitySubsidy = (activity.budget_amount / subsidizedBudgetTotal) * totalSubsidyLimit
          }
        }

        // Determine assignees: use activity-specific assignees if provided, otherwise fallback to project responsible
        let finalAssigneeIds: string[] = []
        if (activity.assignee_ids && activity.assignee_ids.length > 0) {
          // Activity has specific assignees selected
          finalAssigneeIds = activity.assignee_ids
        } else if (formData.responsible_id) {
          // Fallback to project responsible
          finalAssigneeIds = [formData.responsible_id]
        }
        // If both are empty, finalAssigneeIds remains empty array (backend will add creator)

        return {
          name: activity.name,
          description: activity.description,
          budget_amount: activity.budget_amount,
          deadline: activityDeadline,
          assignee_ids: finalAssigneeIds,
          tags: activity.tags.map(mapTagToEnum), // Already sending as array - correct!
          is_subsidized: activity.is_subsidized ?? false, // Include is_subsidized flag
          activity_funding: {
            entity_contribution_amount: activitySubsidy,
            entity_contribution_percent: activity.is_subsidized ? 65 : 0,
            entity_type: 'INSTITUTION',
            entity_id: institutionId || '',
          }
        }
      })

      // Prepare variables for GraphQL mutation
      const variables: any = {
        title: formData.title,
        description: formData.description,
        department_id: formData.department_id,
        institution_id: institutionId, // Add institution_id from context
        budget: formData.total_budget,
        subsidized_budget: formData.institution_contribution,
        balance: formData.church_contribution,
        type: ProjectType.Local, // Default to Local, adjust based on your needs
        start_at: new Date().toISOString(), // Use current date or get from formData
        end_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        language_preference: (i18n.language === 'nl' ? LanguagePreference.nl : LanguagePreference.en),
        is_private: formData.is_private || false,
        required_volunteers: false, // Adjust based on your needs
        is_event: formData.register_as_event || false,
        owner_id: formData.responsible_id,
        activities: mappedActivities,
        is_special_case: isSpecialProject || isChurchPlanting || false,
        special_case_reason: isChurchPlanting ? churchPlantingJustification : specialProjectJustification,
        location_church_plant: formData.location_church_plant,
        special_budget: formData.special_budget,
        church_id: formData.church_id,
        church_department_id: formData.church_department_id,
      }


      // Add event data if registering as event
      if (formData.register_as_event && formData.event) {
        variables.event = {
          title: formData.event.title || formData.title,
          description: formData.event.description || formData.description,
          type: EventType.show, // Adjust based on form data
          max_participants: formData.event.max_participants || 0,
          ticket_amount: formData.event.ticket_amount || 0,
          location: formData.event.location || "",
          subscription_expires_at: formData.event.subscription_expires_at || new Date().toISOString(),
        }
      }

      // Execute mutation
      const result = await createProjectMutation({ variables })

      toast.dismiss(loadingToast)

    } catch (error: any) {
      toast.dismiss(loadingToast)
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
      case translations.steps.projectInfo.title:
        return (
          <ProjectDataStep
            formData={formData}
            errors={errors}
            departments={departments}
            users={users}
            churches={churches}
            onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
          />
        )
      case translations.steps.activities.title:
        return renderActivitiesStep()
      case translations.steps.funding.title:
        return renderFundingDistributionStep()
      case translations.steps.eventRegistration.title:
        return renderEventRegistrationStep()
      case translations.steps.communication.title:
        return renderCommunicationStep()
      case translations.steps.review.title:
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
                  <h3 className="font-medium text-foreground">{t('projectRegister.eventRegistration.header')}</h3>
                  <p className="text-xs text-muted-foreground">{t('projectRegister.eventRegistration.subtitle')}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>{t('projectRegister.eventRegistration.description')}</p>
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
            contacts={users}
            institutions={[{ id: "1", name: "Adventist Church Netherlands" }]}
            departments={departments}
            churches={[{ id: "1", name: "Amsterdam Adventist Church" }]}
            regions={[{ id: "1", name: "Netherlands Region" }]}
            users={users}
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
                  <h3 className="font-medium text-foreground">{t('projectRegister.communication.header')}</h3>
                  <p className="text-xs text-muted-foreground">{t('projectRegister.communication.subtitle')}</p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>{t('projectRegister.communication.description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Communication Form (3/4 da tela) */}
        <div className="w-full lg:w-3/4">
          <CommunicationForm
            data={formData.communication || {
              title: `${t('projectRegister.communication.titlePrefix')} ${formData.title}`,
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
                          text: t('projectRegister.communication.contentPlaceholder'),
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
            departments={departments}
            churches={[{ id: "1", name: "Amsterdam Adventist Church" }]}
            regions={[{ id: "1", name: "Netherlands Region" }]}
            users={users}
          />
        </div>
      </div>
    </div>
  )

  // renderProjectDataStep moved to component
  // See: components/projects/steps/project-data-step.tsx

  const renderActivitiesStep = () => (
    <div className="animate-in fade-in-0 duration-300">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full max-w-full overflow-hidden">
        {/* Left Column - Info (responsivo) */}
        <div className="w-full lg:w-1/4 lg:min-w-[280px] lg:max-w-[320px] space-y-4 shrink-0">
          <div className="p-4 lg:p-6 rounded-lg border border-muted">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                  <ActivityIcon className="w-4 h-4 text-muted-foreground" />
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
                            <h5 className="font-medium text-sm truncate">{t(`projectRegister.quickActivities.${activity.key}.name`)}</h5>
                            <Badge variant="default" className="text-xs shrink-0 bg-primary/10 text-primary border-primary/20">
                              {formatCurrency(activity.budget_amount)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {t(`projectRegister.quickActivities.${activity.key}.description`)}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {activity.tagKeys.map((tagKey: string) => renderTagWithIcon(tagKey))}
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
                <ActivityIcon className="w-4 h-4 text-muted-foreground" />
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
                onDelete={handleMoveToTrash}
                onEdit={editActivity}
                allowDrop={true}
                defaultCollapsed={false}
                translations={translations}
                renderTagWithIcon={renderTagWithIcon}
              />

              {/* Non-Subsidized Activities Group */}
              <ActivityGroup
                title={(translations as any).activityGroups?.nonSubsidized || "Atividades Não Subsidiadas"}
                activities={nonSubsidizedActivities}
                groupType="nonSubsidized"
                onMove={moveActivityBetweenGroups}
                onDelete={handleMoveToTrash}
                onEdit={editActivity}
                allowDrop={true}
                defaultCollapsed={false}
                translations={translations}
                renderTagWithIcon={renderTagWithIcon}
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
          <div ref={activityFormRef} className="p-4 lg:p-6 border-2 rounded-lg bg-card rounded-xl shadow-sm border-border scroll-mt-20">
            <div className="space-y-4 lg:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <h4 className="font-medium flex items-center gap-2">
                  {editingActivityId ? <Settings className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingActivityId ? t('projectRegister.activityForm.editTitle') : t('projectRegister.activityForm.addTitle')}
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
                    {t('projectRegister.activityForm.cancelEdit')}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-4">
                  <Label htmlFor="activity_name" className="text-base font-medium">{t('projectRegister.activityForm.activityName')} *</Label>
                  <Input
                    id="activity_name"
                    value={currentActivity.name || ""}
                    onChange={(e) => setCurrentActivity({ ...currentActivity, name: e.target.value })}
                    placeholder={t('projectRegister.activityForm.activityNamePlaceholder')}
                    className="h-12 border-2"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="activity_budget" className="text-base font-medium">{t('projectRegister.activityForm.budgetValue')} *</Label>
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
                <Label htmlFor="activity_description" className="text-base font-medium">{t('projectRegister.activityForm.activityDescription')} *</Label>
                <Textarea
                  id="activity_description"
                  value={currentActivity.description || ""}
                  onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                  placeholder={t('projectRegister.activityForm.activityDescriptionPlaceholder')}
                  className="min-h-[100px] border-2"
                />
              </div>

              {/* Request Subsidy Switch */}
              <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-primary/30 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      {t('projectRegister.activityForm.requestSubsidy')}
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
                    {t('projectRegister.activityForm.requestSubsidyDescription')}
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
                  {t('projectRegister.activityForm.activityTags')}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_TAGS.map((tagKey) => (
                    <Button
                      key={tagKey}
                      variant={currentActivity.tags?.includes(tagKey) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const tags = currentActivity.tags || []
                        const newTags = tags.includes(tagKey)
                          ? tags.filter(t => t !== tagKey)
                          : [...tags, tagKey]
                        setCurrentActivity({ ...currentActivity, tags: newTags })
                      }}
                      className={cn(
                        "h-8 text-xs transition-all duration-200",
                        currentActivity.tags?.includes(tagKey)
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted hover:border-primary/50"
                      )}
                    >
                      {t(`projectRegister.tags.${tagKey}`)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Activity Assignees Selector */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  {t('projectRegister.activityForm.activityResponsibles')} <span className="text-red-500">*</span>
                </Label>

                {/* Hidden UserMultiSelector for dialog functionality */}
                <div className="hidden">
                  <UserMultiSelector
                    ref={userSelectorRef}
                    availableUsers={users?.map((user: any) => ({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      avatar: user.avatar,
                      role: user.role
                    })) || []}
                    selectedUsers={users?.filter((user: any) =>
                      currentActivity.assignee_ids?.includes(user.id)
                    ).map((user: any) => ({
                      id: user.id,
                      name: user.name,
                      email: user.email,
                      avatar: user.avatar,
                      role: user.role
                    })) || []}
                    onUsersChange={handleUsersChange}
                    buttonLabel={t('projectRegister.activityForm.selectResponsibles')}
                    dialogTitle={t('projectRegister.activityForm.activityResponsibles')}
                    searchPlaceholder={t('projectRegister.activityForm.searchUsers')}
                    activityName={currentActivity.name}
                    activityType="Atividade do Projeto"
                    disabled={!users || users.length === 0}
                  />
                </div>

                {/* Avatar Group Display */}
                {users?.filter((user: any) =>
                  currentActivity.assignee_ids?.includes(user.id)
                ).length > 0 ? (
                  <div
                    className="p-3 rounded-lg border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors group"
                    onClick={() => {
                      // Click on the UserMultiSelector trigger button
                      userSelectorRef.current?.click();
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <UsersAvatarGroup
                        users={users?.filter((user: any) =>
                          currentActivity.assignee_ids?.includes(user.id)
                        ).map((user: any) => ({
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          avatar: user.avatar,
                          role: user.role,
                          initials: user.initials
                        })) || []}
                        maxDisplay={4}
                        size="md"
                        showLabel={false}
                        showAddButton={false}
                      />
                      <div className="flex items-center gap-1 ml-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {t('projectRegister.activityForm.clickToEdit') || 'Clique para editar'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => {
                      // Click on the UserMultiSelector trigger button
                      userSelectorRef.current?.click();
                    }}
                  >
                    <p className="text-sm text-muted-foreground text-center">
                      {t('projectRegister.activityForm.addResponsibles') || 'Adicionar responsáveis para a atividade'}
                    </p>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {t('projectRegister.activityForm.responsiblesDescription')}
                </p>
                {(!currentActivity.assignee_ids || currentActivity.assignee_ids.length === 0) && (
                  <p className="text-xs text-red-500">
                    {t('activities.user_selector.minimum_required') || 'Pelo menos um responsável deve ser selecionado'}
                  </p>
                )}
              </div>

              <Button
                onClick={handleAddActivity}
                className="w-full h-12 gap-2"
                variant={editingActivityId ? "default" : "outline"}
              >
                {editingActivityId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingActivityId ? t('projectRegister.activityForm.updateActivity') : t('projectRegister.activityForm.addActivity')}
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
    const requestContribution = (subsidyTotal * currentSubsidyPercentage) / 100
    const selfContribution = totalBudget - requestContribution

    // Handle manual entry calculations - baseado apenas no total das atividades subsidiadas
    const handleManualAmountChange = (value: number) => {
      // Limit value to subsidyTotal
      const limitedValue = Math.min(value, subsidyTotal)
      setManualAmount(limitedValue)

      if (subsidyTotal > 0) {
        const percentage = (limitedValue / subsidyTotal) * 100
        const isSpecialCase = isSpecialProject || isChurchPlanting
        const maxPercent = isSpecialCase ? 100 : FUNDING_POLICIES.max_institution_percent

        // Validate percentage limits
        if (percentage > maxPercent) {
          toast.error(t('projectRegister.fundingDistribution.maxAllowedError', { percent: maxPercent }))
          return
        }

        setManualPercentage(percentage)
        setFormData({ ...formData, subsidy_percentage: percentage })
      }
    }

    const handleManualPercentageChange = (value: number) => {
      const isSpecialCase = isSpecialProject || isChurchPlanting
      const maxPercent = isSpecialCase ? 100 : FUNDING_POLICIES.max_institution_percent

      // Limit percentage to max allowed
      const limitedPercentage = Math.min(value, maxPercent)

      // Validate percentage limits
      if (value > maxPercent) {
        toast.error(t('projectRegister.fundingDistribution.maxAllowedError', { percent: maxPercent }))
        return
      }

      setManualPercentage(limitedPercentage)
      const amount = (subsidyTotal * limitedPercentage) / 100
      setManualAmount(amount)
      setFormData({ ...formData, subsidy_percentage: limitedPercentage })
    }

    // Preparar dados para os KPI Cards
    const kpiCardsData: KPICardData[] = [
      {
        id: "available-amount",
        title: (translations as any).fundingCalculator?.availableAmount || "Valor Disponível",
        value: formatCurrency(mockDepartmentBudget.total_available),
        icon: TrendingUp,
        subtitle: mockDepartmentBudget.department_name
      },
      {
        id: "used-this-year",
        title: (translations as any).fundingCalculator?.usedThisYear || "Usado Este Ano",
        value: formatCurrency(mockDepartmentBudget.used_this_year),
        icon: TrendingDown,
        subtitle: `${Math.round((mockDepartmentBudget.used_this_year / mockDepartmentBudget.total_available) * 100)}% do orçamento`
      },
      {
        id: "remaining-amount",
        title: (translations as any).fundingCalculator?.remainingAmount || "Valor Restante",
        value: formatCurrency(mockDepartmentBudget.remaining),
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
                      {t('projectRegister.fundingDistribution.financialAnalysis')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Total do Projeto */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">
                        {t('projectRegister.fundingDistribution.totalProjectCost')}
                      </span>
                      <span className="text-lg font-bold text-foreground">{formatCurrency(totalBudget)}</span>
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-green-500"></div>
                        <span className="text-muted-foreground">{t('projectRegister.fundingDistribution.subsidizedActivities')}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(subsidyTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        <span className="text-muted-foreground">{t('projectRegister.fundingDistribution.nonSubsidizedActivities')}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(totalBudget - subsidyTotal)}</span>
                    </div>
                  </div>

                  {/* Distribuição de Responsabilidade */}
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-foreground">{t('projectRegister.fundingDistribution.responsibilityDistribution')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Home className="w-3 h-3 text-blue-600" />
                          <span className="text-muted-foreground">{t('projectRegister.fundingDistribution.self')}</span>
                        </div>
                        <span className="font-medium text-blue-600">{formatCurrency(selfContribution)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Building className="w-3 h-3 text-green-600" />
                          <span className="text-muted-foreground">{t('projectRegister.fundingDistribution.request')}</span>
                        </div>
                        <span className="font-medium text-green-600">{formatCurrency(requestContribution)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t text-xs text-muted-foreground leading-relaxed">
                  <p>{(translations as any).fundingCalculator?.recalculateAutomatically || "Valores recalculam automaticamente"}</p>
                  <p className="mt-1">{(translations as any).fundingCalculator?.dragToCalculate || "Arraste atividades para calcular financiamento"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Funding Calculator (3/4) */}
          <div className="w-full lg:w-3/4">
            <div className="space-y-6">
              {/* Budget Highlights KPI Cards - Temporarily Commented */}
              {/* <div className="space-y-4">
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
              </div> */}

              {/* Special Project Information or Validation Rules */}
              {(isSpecialProject || isChurchPlanting) ? (
                <Collapsible open={isSpecialRulesOpen} onOpenChange={setIsSpecialRulesOpen}>
                  <Card className={`border-2 ${isChurchPlanting ? 'border-green-500' : 'border-orange-500'
                    }`}>
                    <CardHeader>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                          <div className="flex items-center gap-2">
                            {isChurchPlanting && (
                              <>
                                <Sprout className="w-4 h-4 text-green-600" />
                                <CardTitle className="text-base text-green-900">{t('projectRegister.fundingDistribution.churchPlantingInfoTitle')}</CardTitle>
                              </>
                            )}
                            {isSpecialProject && (
                              <>
                                <Globe className="w-4 h-4 text-orange-600" />
                                <CardTitle className="text-base text-orange-900">{t('projectRegister.fundingDistribution.specialProjectInfoTitle')}</CardTitle>
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
                            {t('projectRegister.fundingDistribution.specialFundingRules')}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={`${isChurchPlanting ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                              {t('projectRegister.fundingDistribution.subsidyUpTo100')}
                            </Badge>
                            <Badge variant="secondary" className={`${isChurchPlanting ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                              {t('projectRegister.fundingDistribution.noValueLimit')}
                            </Badge>
                            <Badge variant="secondary" className={`${isChurchPlanting ? 'bg-green-100 text-green-800 border-green-300' : 'bg-orange-100 text-orange-800 border-orange-300'}`}>
                              {t('projectRegister.fundingDistribution.justificationAnalysis')}
                            </Badge>
                            {isChurchPlanting && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                                {t('projectRegister.fundingDistribution.missionaryPriority')}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Special Project Details Form */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="justification">
                              {isChurchPlanting ? t('projectRegister.fundingDistribution.churchPlantingDetails') : t('projectRegister.fundingDistribution.specialProjectJustification')}
                            </Label>
                            <Textarea
                              id="justification"
                              placeholder={
                                isChurchPlanting
                                  ? t('projectRegister.fundingDistribution.plantingDescriptionPlaceholder')
                                  : t('projectRegister.fundingDistribution.specialJustificationPlaceholder')
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
                              <Label htmlFor="location">{t('projectRegister.fundingDistribution.plantingLocation')}</Label>
                              <Input
                                id="location"
                                placeholder={t('projectRegister.fundingDistribution.locationPlaceholder')}
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
                        {(translations as any).fundingCalculator?.maxAmountRule?.replace('{{amount}}', formatCurrency(FUNDING_POLICIES.max_institution_amount)) || `Máximo ${formatCurrency(FUNDING_POLICIES.max_institution_amount)} por projeto`}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {(translations as any).fundingCalculator?.maxPercentageRule?.replace('{{percent}}', FUNDING_POLICIES.max_institution_percent.toString()) || `Máximo ${FUNDING_POLICIES.max_institution_percent}% de contribuição`}
                      </Badge>
                      {requestContribution > FUNDING_POLICIES.max_institution_amount && (
                        <Badge className="text-xs bg-black text-white hover:bg-black/90">
                          {t('projectRegister.fundingDistribution.limitExceeded')}: {(translations as any).fundingCalculator?.limitReached || t('projectRegister.fundingDistribution.limitReachedMessage')}
                        </Badge>
                      )}
                      {currentSubsidyPercentage > FUNDING_POLICIES.max_institution_percent && !formData.is_special_case && (
                        <Badge className="text-xs bg-black text-white hover:bg-black/90">
                          {t('projectRegister.fundingDistribution.percentExceeded', { percent: FUNDING_POLICIES.max_institution_percent })}
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
                                  {t('projectRegister.fundingDistribution.churchPlanting')}
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[440px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Sprout className="w-5 h-5 text-green-600" />
                                  {t('projectRegister.fundingCalculator.infoChurchPlantingTitle')}
                                </DialogTitle>
                                <DialogDescription>
                                  {t('projectRegister.fundingCalculator.infoChurchPlantingBody')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="text-xs text-muted-foreground">
                                {t('projectRegister.fundingCalculator.infoChurchPlantingDetails')}
                              </div>
                              <DialogFooter>
                                <Button onClick={() => setShowChurchPlantingModal(false)}>
                                  {t('projectRegister.fundingCalculator.gotIt')}
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
                                  {t('projectRegister.fundingDistribution.specialProject')}
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[440px]">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Globe className="w-5 h-5 text-blue-600" />
                                  {t('projectRegister.fundingCalculator.infoSpecialTitle')}
                                </DialogTitle>
                                <DialogDescription>
                                  {t('projectRegister.fundingCalculator.infoSpecialBody')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="text-xs text-muted-foreground">
                                {t('projectRegister.fundingCalculator.infoSpecialDetails')}
                              </div>
                              <DialogFooter>
                                <Button onClick={() => setShowSpecialProjectModal(false)}>
                                  {t('projectRegister.fundingCalculator.gotIt')}
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
                        onClick={() => {
                          const newIsManual = !isManualEntry
                          setIsManualEntry(newIsManual)
                          // When switching to manual, populate with current slider values
                          if (newIsManual) {
                            setManualAmount(requestContribution)
                            setManualPercentage(currentSubsidyPercentage)
                          }
                        }}
                      >
                        {isManualEntry ? "Manual" : "Auto"}
                      </Button>
                    </div>

                    {isManualEntry ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Manual Amount Input */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            {t('projectRegister.fundingDistribution.requestContributionValue')}
                          </Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">{selectedCurrency.symbol}</span>
                              <Input
                                type="number"
                                value={manualAmount || ''}
                                placeholder="0"
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 0 : Number(e.target.value)
                                  handleManualAmountChange(value)
                                }}
                                className="pl-8"
                                min={0}
                                max={subsidyTotal}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="default"
                              onClick={() => {
                                const isSpecialCase = isSpecialProject || isChurchPlanting
                                const maxPercent = isSpecialCase ? 100 : FUNDING_POLICIES.max_institution_percent
                                const calculatedMax = (subsidyTotal * maxPercent) / 100
                                const maxAmount = Math.min(FUNDING_POLICIES.max_institution_amount, calculatedMax)
                                setManualAmount(maxAmount)
                                handleManualAmountChange(maxAmount)
                              }}
                              className="shrink-0 font-mono"
                              title={`Máximo permitido: ${isSpecialProject || isChurchPlanting ? '100' : FUNDING_POLICIES.max_institution_percent}%`}
                            >
                              MAX
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Máximo: {formatCurrency(subsidyTotal)} ({(isSpecialProject || isChurchPlanting) ? '100' : FUNDING_POLICIES.max_institution_percent}% = {formatCurrency((subsidyTotal * ((isSpecialProject || isChurchPlanting) ? 100 : FUNDING_POLICIES.max_institution_percent)) / 100)})
                          </p>
                        </div>

                        {/* Manual Percentage Input */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            {t('projectRegister.fundingDistribution.contributionPercentage')}
                          </Label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                type="number"
                                value={manualPercentage || ''}
                                placeholder="0"
                                onChange={(e) => {
                                  const value = e.target.value === '' ? 0 : Number(e.target.value)
                                  handleManualPercentageChange(value)
                                }}
                                className="pr-8"
                                min={0}
                                max={(isSpecialProject || isChurchPlanting) ? 100 : FUNDING_POLICIES.max_institution_percent}
                              />
                              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">%</span>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="default"
                              onClick={() => {
                                const isSpecialCase = isSpecialProject || isChurchPlanting
                                const maxPercent = isSpecialCase ? 100 : FUNDING_POLICIES.max_institution_percent
                                const calculatedAmount = (subsidyTotal * maxPercent) / 100
                                const actualMaxAmount = Math.min(FUNDING_POLICIES.max_institution_amount, calculatedAmount)
                                const actualMaxPercent = subsidyTotal > 0 ? (actualMaxAmount / subsidyTotal) * 100 : maxPercent
                                setManualPercentage(actualMaxPercent)
                                handleManualPercentageChange(actualMaxPercent)
                              }}
                              className="shrink-0 font-mono"
                              title={`Máximo: ${isSpecialProject || isChurchPlanting ? '100' : FUNDING_POLICIES.max_institution_percent}%`}
                            >
                              MAX
                            </Button>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs text-muted-foreground">
                            <div>{t('projectRegister.fundingDistribution.appliedOver')} {formatCurrency(subsidyTotal)}</div>
                            <div className="text-left sm:text-right">
                              <span>{t('projectRegister.fundingDistribution.maximum')}: </span>
                              <span className="font-medium">{(isSpecialProject || isChurchPlanting) ? '100' : FUNDING_POLICIES.max_institution_percent}%</span>
                              {(isSpecialProject || isChurchPlanting) && (
                                <span className="text-green-600 font-medium"> • {t('projectRegister.fundingDistribution.specialProject')}</span>
                              )}
                            </div>
                          </div>
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
                              toast.error(t('projectRegister.fundingDistribution.maxAllowedError', { percent: FUNDING_POLICIES.max_institution_percent }))
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
                          <span>0% ({t('projectRegister.fundingDistribution.noSubsidy')})</span>
                          <span>
                            {(isSpecialProject || isChurchPlanting) ? '100%' : `${FUNDING_POLICIES.max_institution_percent}%`}
                            {isSpecialProject && ` (${t('projectRegister.fundingDistribution.specialProject')})`}
                            {isChurchPlanting && ' (Church Planting)'}
                            {!isSpecialProject && !isChurchPlanting && ` (${t('projectRegister.fundingDistribution.regularMaximum')})`}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Detailed Results Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                {/* Self Contribution Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4 text-blue-600" />
                      <CardTitle className="text-sm font-medium">{t('projectRegister.fundingDistribution.selfContribution')}</CardTitle>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('projectRegister.fundingDistribution.churchResponsibilityTooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">
                      {formatCurrency(selfContribution)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(totalBudget > 0 ? (selfContribution / totalBudget) * 100 : 0)}% {t('projectRegister.fundingDistribution.ofTotalBudget')}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {t('projectRegister.fundingDistribution.includesNonSubsidized')}
                    </div>
                  </CardContent>
                </Card>

                {/* Request Contribution Card */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-green-600" />
                      <CardTitle className="text-sm font-medium">{t('projectRegister.fundingDistribution.requestContribution')}</CardTitle>
                    </div>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('projectRegister.fundingDistribution.subsidyCalculatedOver')} € {subsidyTotal.toLocaleString()} das atividades subsidiadas</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      € {requestContribution.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(currentSubsidyPercentage)}% {t('projectRegister.fundingDistribution.overSubsidizedActivities')}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      {t('projectRegister.fundingDistribution.calculationBase')}: € {subsidyTotal.toLocaleString()} {t('projectRegister.fundingDistribution.inSubsidizedActivities')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Groups with Drag & Drop */}
              <div className="rounded-lg border border-muted space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <h5 className="font-medium text-foreground">{t('projectRegister.fundingDistribution.distributionByActivities')}</h5>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('projectRegister.fundingDistribution.dragToRecalculate')}</p>
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
                  translations={translations}
                  renderTagWithIcon={renderTagWithIcon}
                />

                {/* Non-Subsidized Activities Group */}
                <ActivityGroup
                  title={(translations as any).activityGroups?.nonSubsidized || "Atividades Não Subsidiadas"}
                  activities={nonSubsidyActivities}
                  onMove={moveActivityBetweenGroups}
                  onEdit={editActivity}
                  groupType="nonSubsidized"
                  defaultCollapsed={false}
                  translations={translations}
                  renderTagWithIcon={renderTagWithIcon}
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
                    translations={translations}
                    renderTagWithIcon={renderTagWithIcon}
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
    const selfContribution = formData.church_contribution
    const requestContribution = formData.institution_contribution

    const subsidizedActivities = formData.activities.filter(a => a.request_subsidy)
    const nonSubsidizedActivities = formData.activities.filter(a => !a.request_subsidy)

    const totalActivities = formData.activities.length
    const averageActivityCost = totalActivities > 0 ? totalBudget / totalActivities : 0

    // Detectar se é projeto especial
    const isProjectSpecial = isSpecialProject || isChurchPlanting

    return (
      <div className="animate-in fade-in-0 duration-300">
        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Left Column - Project Summary (1/4) */}
          <div className="w-full lg:w-1/4 space-y-4">
            <div className="p-4 rounded-lg border border-muted">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base">
                      {translations.steps.review.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {translations.steps.review.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Total do Projeto */}
                  <div className="p-3 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {t('projectRegister.review.totalBudget')}
                      </span>
                      <span className="text-lg font-bold text-foreground">€ {totalBudget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Breakdown Financeiro */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Home className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{t('projectRegister.review.self')}</span>
                      </div>
                      <span className="font-medium text-foreground">€ {selfContribution.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Building className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{t('projectRegister.review.request')}</span>
                      </div>
                      <span className="font-medium text-foreground">€ {requestContribution.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Estatísticas de Atividades */}
                  <div className="space-y-3 pt-3 border-t">
                    <h4 className="text-sm font-medium text-foreground">{t('projectRegister.review.activities')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('projectRegister.review.totalActivities')}</span>
                        <span className="font-medium text-foreground">{totalActivities}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('projectRegister.review.subsidized')}</span>
                        <span className="font-medium text-foreground">{subsidizedActivities.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('projectRegister.review.nonSubsidized')}</span>
                        <span className="font-medium text-foreground">{nonSubsidizedActivities.length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Project Badge */}
                  {isProjectSpecial && (
                    <div className="pt-3 border-t">
                      <Badge className={cn(
                        "w-full justify-center",
                        isChurchPlanting
                          ? 'bg-muted text-foreground border-border'
                          : 'bg-muted text-foreground border-border'
                      )}>
                        {isChurchPlanting ? (
                          <><Sprout className="w-3 h-3 mr-1" /> Church Planting</>
                        ) : (
                          <><Star className="w-3 h-3 mr-1" /> {t('projectRegister.review.specialProject')}</>
                        )}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t text-xs text-muted-foreground leading-relaxed">
                  <p>{translations.steps.review.content}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Review Details (3/4) */}
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Resumo Financeiro - Cards principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{translations.summary.totalBudget}</p>
                      <p className="text-2xl font-bold text-foreground">€ {totalBudget.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{totalActivities} {t('projectRegister.review.activitiesRegistered')}</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{translations.summary.selfContribution}</p>
                      <p className="text-2xl font-bold text-foreground">€ {selfContribution.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{Math.round((selfContribution / totalBudget) * 100)}% do total</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{translations.summary.requestContribution}</p>
                      <p className="text-2xl font-bold text-foreground">€ {requestContribution.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{Math.round((requestContribution / totalBudget) * 100)}% do total</p>
                </CardContent>
              </Card>
            </div>

            {/* Informações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-muted-foreground" />
                  {translations.summary.projectInfo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{translations.fields.projectTitle}</p>
                        <p className="text-base text-foreground">{formData.title}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{translations.fields.department}</p>
                        <p className="text-base text-foreground">
                          {departments.find((d: any) => d.id === formData.department_id)?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                        <p className="text-base text-foreground">
                          {users.find((u: any) => u.id === formData.responsible_id)?.name || "Não selecionado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tipo de Responsabilidade</p>
                        <p className="text-base text-foreground capitalize">{formData.project_responsible_type}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Settings className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Configurações</p>
                        <div className="flex gap-2 mt-1">
                          {formData.is_private && (
                            <Badge variant="secondary" className="text-xs">Privado</Badge>
                          )}
                          {formData.register_as_event && (
                            <Badge variant="secondary" className="text-xs">Evento Público</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{translations.fields.projectDescription}</p>
                        <p className="text-sm text-foreground">{formData.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Conformidade com Políticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-muted-foreground" />
                  {translations.summary.budgetDistribution}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t('projectRegister.fundingDistribution.maxPercentageLabel')}</span>
                      </div>
                      <Badge variant={isChurchPlanting || isSpecialProject || requestContribution <= totalBudget * (FUNDING_POLICIES.max_institution_percent / 100) ? "default" : "destructive"}>
                        {isChurchPlanting ? "✓ Church Planting" : isSpecialProject ? t('projectRegister.fundingDistribution.statusSpecial') : requestContribution <= totalBudget * (FUNDING_POLICIES.max_institution_percent / 100) ? t('projectRegister.fundingDistribution.statusCompliant') : t('projectRegister.fundingDistribution.statusExceeded')}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t('projectRegister.fundingDistribution.maxValueLabel')}</span>
                      </div>
                      <Badge variant={isChurchPlanting || isSpecialProject || requestContribution <= FUNDING_POLICIES.max_institution_amount ? "default" : "destructive"}>
                        {isChurchPlanting ? "✓ Church Planting" : isSpecialProject ? t('projectRegister.fundingDistribution.statusSpecial') : requestContribution <= FUNDING_POLICIES.max_institution_amount ? t('projectRegister.fundingDistribution.statusCompliant') : t('projectRegister.fundingDistribution.statusExceeded')}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{t('projectRegister.fundingDistribution.minimumChurch')}</span>
                      </div>
                      <Badge variant={isChurchPlanting || isSpecialProject || selfContribution >= totalBudget * (FUNDING_POLICIES.min_church_percent / 100) ? "default" : "destructive"}>
                        {isChurchPlanting ? "✓ Church Planting" : isSpecialProject ? t('projectRegister.fundingDistribution.statusSpecial') : selfContribution >= totalBudget * (FUNDING_POLICIES.min_church_percent / 100) ? t('projectRegister.fundingDistribution.statusCompliant') : t('projectRegister.fundingDistribution.statusInsufficient')}
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('projectRegister.fundingCalculator.maxInstitutionCapacity').replace('(100%)', `(${(isChurchPlanting || isSpecialProject) ? '100' : FUNDING_POLICIES.max_institution_percent}%)`)}</span>
                        <span className="font-medium">€ {((isChurchPlanting || isSpecialProject) ? totalBudget : (totalBudget * (FUNDING_POLICIES.max_institution_percent / 100))).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('projectRegister.fundingCalculator.limitPerProject')}</span>
                        <span className="font-medium">{(isChurchPlanting || isSpecialProject) ? t('projectRegister.fundingCalculator.unlimited') : `€ ${FUNDING_POLICIES.max_institution_amount.toLocaleString()}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('projectRegister.fundingCalculator.subsidyRequested')}</span>
                        <span className="font-medium text-foreground">€ {requestContribution.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('projectRegister.fundingCalculator.remainingCapacity')}</span>
                        <span className="font-medium">
                          € {Math.max(0,
                            ((isChurchPlanting || isSpecialProject) ? totalBudget : Math.min(FUNDING_POLICIES.max_institution_amount, totalBudget * (FUNDING_POLICIES.max_institution_percent / 100)))
                            - requestContribution
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Atividades Subsidiadas */}
            {subsidizedActivities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-muted-foreground" />
                      {t('projectRegister.fundingDistribution.subsidizedActivities')}
                    </div>
                    <Badge variant="secondary">{t('projectRegister.fundingCalculator.activitiesCount', { count: subsidizedActivities.length })}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subsidizedActivities.map((activity) => (
                      <div key={activity.id} className="p-4 rounded-lg bg-muted/30 border border-muted">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Star className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <h6 className="font-medium text-foreground">{activity.name}</h6>
                              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            € {activity.budget_amount.toLocaleString()}
                          </Badge>
                        </div>
                        {activity.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {activity.tags.map((tag) => renderTagWithIcon(tag))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border flex justify-between items-center">
                      <span className="font-medium text-foreground">{t('projectRegister.fundingCalculator.subsidizedSubtotal')}</span>
                      <span className="text-lg font-bold text-foreground">
                        € {subsidizedActivities.reduce((sum, a) => sum + a.budget_amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Atividades Não Subsidiadas */}
            {nonSubsidizedActivities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-muted-foreground" />
                      Atividades Não Subsidiadas
                    </div>
                    <Badge variant="secondary">{nonSubsidizedActivities.length} atividades</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {nonSubsidizedActivities.map((activity) => (
                      <div key={activity.id} className="p-4 rounded-lg bg-muted/30 border border-muted">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <Sprout className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <h6 className="font-medium text-foreground">{activity.name}</h6>
                              <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            € {activity.budget_amount.toLocaleString()}
                          </Badge>
                        </div>
                        {activity.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {activity.tags.map((tag) => renderTagWithIcon(tag))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border flex justify-between items-center">
                      <span className="font-medium text-foreground">Subtotal Igreja:</span>
                      <span className="text-lg font-bold text-foreground">
                        € {nonSubsidizedActivities.reduce((sum, a) => sum + a.budget_amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
                  const icons = [FileText, ActivityIcon, DollarSign, CalendarIcon, Settings, CheckCircle]
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
                    disabled={isLoading || (currentStep === 1 && formData._isStepValid === false)}
                  >
                    <span className="hidden sm:inline">{translations.buttons.next}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="gap-2"
                    disabled={isLoading || creatingProject}
                  >
                    {(isLoading || creatingProject) ? (
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
  const { i18n } = useTranslation()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  return (
    <WithPermission
      requiredPermissions={[PermissionResolverName.CreateProject]}
      fallback={
        <AppLayout>
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t.accessDenied.title}</h2>
              <p className="text-muted-foreground mb-4">
                {t.accessDenied.noPermission}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.accessDenied.contactAdmin}
              </p>
            </div>
          </div>
        </AppLayout>
      }
    >
      <Suspense fallback={<ProjectRegisterLoading />}>
        <ProjectRegisterContent />
      </Suspense>
    </WithPermission>
  )
}
