"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { ProjectHeaderMinimal } from "@/components/projects/project-header-minimal"
import { ProjectActivitiesFilters } from "@/components/projects/project-activities-filters"
import { ProjectActivitiesTable, ProjectActivityData } from "@/components/projects/project-activities-table"
import { ProjectSubsidiesTable, SubsidyRequestData, ActivityData } from "@/components/projects/project-subsidies-table"
import { SubsidyRequestsContainer } from "@/components/projects/subsidy-requests-container"
import { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"
import { SubsidyActivityChart } from "@/components/projects/charts/subsidy-activity-chart"
import { CommunicationsContainer } from "@/components/projects/communications-container"
import { CommunicationCardData } from "@/components/projects/communication-card"
import { GridContainer } from "@/components/shared/grid-container"
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { EditProjectModal } from "@/components/modals/project/edit-project-modal"
import { CreateEventModal, EventFormData } from "@/components/modals/project/create-event-modal"
import { CreateCommunicationModal, CommunicationFormData } from "@/components/modals/project/create-communication-modal"
import { AddSubsidyModal, SubsidyFormData } from "@/components/modals/project/add-subsidy-modal"
import { EditSubsidyModal, EditSubsidyFormData } from "@/components/modals/project/edit-subsidy-modal"
import { DeleteSubsidyModal } from "@/components/modals/project/delete-subsidy-modal"
import { SubsidyRequestViewModal } from "@/components/modals/project/subsidy-request-view-modal"
import { DeleteSubsidyRequestModal } from "@/components/modals/project/delete-subsidy-request-modal"
import { AddActivityModal, ActivityFormData } from "@/components/modals/project/add-activity-modal"
import { EditActivityModal, EditActivityFormData } from "@/components/modals/project/edit-activity-modal"
import { DeleteActivityModal } from "@/components/modals/project/delete-activity-modal"
import { UploadReceiptModal, ReceiptFormData } from "@/components/modals/project/upload-receipt-modal"
import { ViewReceiptsModal } from "@/components/modals/project/view-receipts-modal"
import { CreateReportModal, ReportFormData } from "@/components/modals/project/create-report-modal"
import { RegisterActivityModal, RegisterActivityFormData } from "@/components/modals/project/register-activity-modal"
import { BatchEditActivitiesModal, BatchEditData } from "@/components/modals/project/batch-edit-activities-modal"
import { BatchEditField } from "@/components/shared/inline-batch-editor"
import { RequestSubsidyModal, SubsidyRequestData as SubsidyRequestFormData } from "@/components/modals/project/request-subsidy-modal"
import { SelectActivitiesModal } from "@/components/modals/project/select-activities-modal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { ProjectTableData } from "@/components/projects/projects-table"
import { projectTranslations } from "@/lib/translations/projects"
import { Button } from "@/components/ui/button"
import { 
  DollarSign, 
  CheckCircle, 
  Activity, 
  Calendar,
  Target,
  TrendingUp 
} from "lucide-react"
import toast from "react-hot-toast"
import "@/lib/i18n"
import { useQuery, useMutation } from "@apollo/client"
import { GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { GET_ALL_USERS_QUERY } from "@/graphql/queries/GET_USER_QUERY"
import { BATCH_UPDATE_PROJECT_ACTIVITIES, CREATE_PROJECT_ACTIVITY, UPDATE_PROJECT_ACTIVITY } from "@/graphql/mutations/PROJECT_ACTIVITY_MUTATIONS"
import { useAuth } from "@/contexts/auth-context"
import { useInstitution } from "@/contexts/institution-context"
import { ActivityTags, EntityType, ActivityPriority, ActivityStatus } from "@/types/graphql-global-types"

// Helper functions for ActivityTags
const getActivityTagLabel = (tag: ActivityTags): string => {
  const labels: Record<ActivityTags, string> = {
    [ActivityTags.Reform]: "Reforma",
    [ActivityTags.Equipment]: "Equipamento",
    [ActivityTags.Materials]: "Material",
    [ActivityTags.Training]: "Treinamento",
    [ActivityTags.Travel]: "Viagem",
    [ActivityTags.Event]: "Evento",
    [ActivityTags.Transport]: "Transporte",
    [ActivityTags.Marketing]: "Marketing",
    [ActivityTags.Services]: "Serviços",
    [ActivityTags.Feeding]: "Alimentação",
    [ActivityTags.Accommodation]: "Acomodação"
  }
  return labels[tag]
}

const getActivityTagOptions = () => {
  return Object.values(ActivityTags).map(tag => ({
    value: tag,
    label: getActivityTagLabel(tag)
  }))
}

const getActivityTagVariant = (tag: ActivityTags): string => {
  const variants: Record<ActivityTags, string> = {
    [ActivityTags.Reform]: 'purple',
    [ActivityTags.Equipment]: 'blue',
    [ActivityTags.Materials]: 'cyan',
    [ActivityTags.Training]: 'indigo',
    [ActivityTags.Travel]: 'green',
    [ActivityTags.Event]: 'pink',
    [ActivityTags.Transport]: 'orange',
    [ActivityTags.Marketing]: 'red',
    [ActivityTags.Services]: 'yellow',
    [ActivityTags.Feeding]: 'gray',
    [ActivityTags.Accommodation]: 'gray'
  }
  return variants[tag] || 'gray'
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n } = useTranslation()
  const { user } = useAuth()
  const { currentInstitutionData } = useInstitution()
  const projectId = params.id as string
  
  // State management
  const [project, setProject] = useState<ProjectTableData | null>(null)
  const [selectedActivities, setSelectedActivities] = useState<ProjectActivityData[]>([])
  const [subsidyRequests, setSubsidyRequests] = useState<SubsidyRequestCardData[]>([])
  const [communications, setCommunications] = useState<CommunicationCardData[]>([])
  const [activeTab, setActiveTab] = useState<"subsidies" | "communications">("subsidies")
  
  // Batch editing state
  const [batchEditData, setBatchEditData] = useState({
    status: "",
    priority: "",
    activity_tag: "",
    is_subsidized: false
  })
  
  // Filters state
  const [subsidyFilter, setSubsidyFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false)
  const [isAddSubsidyModalOpen, setIsAddSubsidyModalOpen] = useState(false)
  const [isEditSubsidyModalOpen, setIsEditSubsidyModalOpen] = useState(false)
  const [isDeleteSubsidyModalOpen, setIsDeleteSubsidyModalOpen] = useState(false)
  const [isViewSubsidyRequestModalOpen, setIsViewSubsidyRequestModalOpen] = useState(false)
  const [isDeleteSubsidyRequestModalOpen, setIsDeleteSubsidyRequestModalOpen] = useState(false)
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false)
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false)
  const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] = useState(false)
  const [isUploadReceiptModalOpen, setIsUploadReceiptModalOpen] = useState(false)
  const [isViewReceiptsModalOpen, setIsViewReceiptsModalOpen] = useState(false)
  const [isEditReceiptModalOpen, setIsEditReceiptModalOpen] = useState(false)
  const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false)
  const [isRegisterActivityModalOpen, setIsRegisterActivityModalOpen] = useState(false)
  const [isRequestSubsidyModalOpen, setIsRequestSubsidyModalOpen] = useState(false)
  const [isSelectActivitiesModalOpen, setIsSelectActivitiesModalOpen] = useState(false)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<any>(undefined)
  
  // Selected items for modals
  const [selectedSubsidy, setSelectedSubsidy] = useState<SubsidyRequestData | undefined>(undefined)
  const [selectedSubsidyCard, setSelectedSubsidyCard] = useState<SubsidyRequestCardData | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)
  
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  // Fetch project data from backend
  const { data: projectData, loading: projectLoading, error: projectError, refetch: refetchProject } = useQuery(GET_PROJECT_BY_ID_QUERY, {
    variables: { id: projectId },
    skip: !projectId,
    fetchPolicy: 'network-only', // Sempre buscar do servidor para garantir dados atualizados
    onCompleted: () => {
      toast.success("📋 Project details loaded successfully!", {
        duration: 3000
      })
    },
    onError: (error) => {
      toast.error("Erro ao carregar detalhes do projeto")
      console.error("Error loading project:", error)
    }
  })

  // Fetch users from the project's institution or active institution as fallback
  const institutionIdForUsers = projectData?.project?.institution_id || currentInstitutionData?.id || user?.institution_id

  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS_QUERY, {
    variables: { institution_id: institutionIdForUsers },
    skip: !institutionIdForUsers,
    onCompleted: (data) => {
      console.log('✅ Users loaded:', data.users)
      console.log('🏛️ Institution ID used:', institutionIdForUsers)
      console.log('📍 Source:', projectData?.project?.institution_id ? 'project' : currentInstitutionData?.id ? 'context' : 'user')
    },
    onError: (error) => {
      console.error('❌ Error loading users:', error)
    }
  })

  // Batch update mutation
  const [batchUpdateActivities, { loading: batchUpdateLoading }] = useMutation(BATCH_UPDATE_PROJECT_ACTIVITIES, {
    onCompleted: () => {
      toast.success("Atividades atualizadas com sucesso!", { duration: 3000 })
      refetchProject()
      setSelectedActivities([])
      setBatchEditData({
        status: "",
        priority: "",
        activity_tag: "",
        is_subsidized: false
      })
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar atividades: ${error.message}`)
      console.error("Error updating activities:", error)
    }
  })

  // Create activity mutation
  const [createProjectActivity, { loading: createActivityLoading }] = useMutation(CREATE_PROJECT_ACTIVITY, {
    onCompleted: () => {
      toast.success("✅ Atividade criada com sucesso!", { duration: 3000 })
      refetchProject()
      setIsRegisterActivityModalOpen(false)
    },
    onError: (error) => {
      toast.error(`Erro ao criar atividade: ${error.message}`)
      console.error("Error creating activity:", error)
    }
  })

  // Update activity mutation
  const [updateProjectActivity, { loading: updateActivityLoading }] = useMutation(UPDATE_PROJECT_ACTIVITY, {
    onCompleted: () => {
      toast.success("✅ Atividade atualizada com sucesso!", { duration: 3000 })
      refetchProject()
      setIsEditActivityModalOpen(false)
      setSelectedActivity(undefined)
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar atividade: ${error.message}`)
      console.error("Error updating activity:", error)
    }
  })

  // Transform backend project to ProjectTableData format
  const transformProjectData = (backendProject: any): ProjectTableData => {
    const now = new Date()
    const startDate = new Date(backendProject.start_at)
    const endDate = new Date(backendProject.end_at)

    let status: "active" | "upcoming" | "completed" = "upcoming"
    if (startDate <= now && endDate >= now) {
      status = "active"
    } else if (endDate < now) {
      status = "completed"
    }

    return {
      id: backendProject.id,
      department_id: backendProject.department_id,
      title: backendProject.title,
      description: backendProject.description,
      budget: Number(backendProject.budget),
      is_private: backendProject.is_private,
      required_volunteers: backendProject.required_volunteers,
      start_at: backendProject.start_at,
      end_at: backendProject.end_at,
      language_preference: backendProject.language_preference,
      institutionId: backendProject.institution_id || "",
      status: status,
      is_event: !!backendProject.event_id,
      type: backendProject.type,
      eventId: backendProject.event_id,
      subsidyRequests: 0, // Will be calculated from subsidies
      subsidyAmount: 0, // Will be calculated from subsidies
      activities: backendProject.activities?.length || 0
    }
  }

  // Set project and subsidies when data is loaded
  useEffect(() => {
    if (projectData?.project) {
      const transformedProject = transformProjectData(projectData.project)
      setProject(transformedProject)

      // Debug: Log project institution_id
      console.log('🏢 Project Data:', projectData.project)
      console.log('🏢 Project institution_id:', projectData.project.institution_id)

      // Transform subsidies data
      if (projectData.project.subsidies) {
        const transformedSubsidies: SubsidyRequestCardData[] = projectData.project.subsidies.map((subsidy: any) => ({
          id: subsidy.id,
          title: subsidy.description,
          requested_at: new Date(subsidy.created_at),
          status: subsidy.subsidy_status?.name?.toLowerCase() || "pending",
          requested_amount: Number(subsidy.total_budget),
          institution_name: subsidy.institution?.name || "Unknown"
        }))
        setSubsidyRequests(transformedSubsidies)
      }

      // Mock communications data (TODO: Replace with real data from backend)
      const mockCommunications: CommunicationCardData[] = [
        {
          id: "comm-1",
          title: "Atualização do Projeto",
          content: "O projeto está progredindo conforme planejado. Todas as atividades estão em dia.",
          type: "update",
          priority: "medium",
          status: "published",
          published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          author_name: user?.name || "Sistema",
          recipients_count: 5
        },
        {
          id: "comm-2",
          title: "Reunião Agendada",
          content: "Próxima reunião de acompanhamento agendada para discutir o progresso e próximos passos.",
          type: "announcement",
          priority: "high",
          status: "scheduled",
          schedule_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          author_name: user?.name || "Sistema",
          recipients_count: 8
        }
      ]
      setCommunications(mockCommunications)
    }
  }, [projectData, user])

  // Get all project activities - transform backend data to match ProjectActivityData interface
  const allProjectActivities = useMemo(() => {
    if (!projectData?.project?.activities) return []
    
    // Debug: Log raw activities data
    console.log('🔍 Raw activities from API:', projectData.project.activities)
    console.log('🔍 First activity assignees:', projectData.project.activities[0]?.assignees)
    
    return projectData.project.activities.map((activity: any) => {
      // Map backend enum values to frontend values
      const statusMap: Record<string, string> = {
        'TODO': 'todo',
        'IN_PROGRESS': 'in_progress',
        'COMPLETED': 'completed',
        'ON_HOLD': 'on_hold'
      }

      const priorityMap: Record<string, string> = {
        'URGENT': 'urgent',
        'HIGH': 'high',
        'MEDIUM': 'medium',
        'LOW': 'low'
      }

      return {
        id: activity.id,
        project_id: projectId,
        name: activity.name,
        description: activity.description,
        budget_amount: Number(activity.budget_amount),
        deadline: activity.deadline,
        status: statusMap[activity.status] || "todo",
        priority: priorityMap[activity.priority] || "medium",
        activity_tag: (activity.activity_tag as ActivityTags) || undefined,
        is_subsidized: activity.is_subsidized || false,
        completed_at: null,
        created_at: activity.created_at,
        updated_at: activity.updated_at,
        // Usar assignees diretamente
        assigned_users: activity.assignees && activity.assignees.length > 0
          ? activity.assignees.map((a: any) => ({
              id: a.user.id,
              name: a.user.name,
              email: a.user.email,
              initials: a.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            }))
          : [],
        // Incluir assignees diretamente para o modal
        assignees: activity.assignees || [],
        // Additional fields for edit modal
        tags: activity.tags || [],
        custom_tags: activity.custom_tags || [],
        activity_funding: activity.activity_funding || [],
      }
    }) as ProjectActivityData[]
  }, [projectData, projectId])

  // Transform users data for UsersAvatarGroup
  const projectUsers = useMemo(() => {
    if (!usersData?.users) return []
    
    // Get unique users from activities
    const activityOwners = allProjectActivities
      .filter(activity => activity.owner)
      .map(activity => ({
        id: activity.owner!.id,
        name: activity.owner!.name,
        email: activity.owner!.email,
      }))
    
    // Remove duplicates by id
    const uniqueUsers = Array.from(
      new Map(activityOwners.map(user => [user.id, user])).values()
    )
    
    return uniqueUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'Colaborador',
    }))
  }, [usersData, allProjectActivities])

  // Calculate project KPIs
  const projectKPIs = useMemo(() => {
    if (!projectData?.project) return null

    const activities = allProjectActivities
    const totalActivities = activities.length
    const completedActivities = activities.filter(a => a.status === 'completed').length
    const inProgressActivities = activities.filter(a => a.status === 'in_progress').length
    const subsidizedActivities = activities.filter(a => a.is_subsidized).length
    
    const totalBudgetActivities = activities.reduce((sum, a) => sum + a.budget_amount, 0)
    const completionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0
    const subsidyRate = totalActivities > 0 ? Math.round((subsidizedActivities / totalActivities) * 100) : 0
    
    // Calculate days until project end
    const now = new Date()
    const endDate = new Date(project?.end_at || '')
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate budget utilization
    const projectBudget = Number(project?.budget || 0)
    const budgetUtilization = projectBudget > 0 ? Math.round((totalBudgetActivities / projectBudget) * 100) : 0

    return [
      {
        id: "total-activities",
        title: "Total de Atividades",
        value: totalActivities.toString(),
        subtitle: `${completedActivities} concluídas | ${inProgressActivities} em andamento`,
        trend: {
          value: completionRate,
          isPositive: completionRate > 50,
          label: `${completionRate}% concluídas`
        },
        icon: Activity,
      },
      {
        id: "project-budget",
        title: "Orçamento do Projeto",
        value: `R$ ${(projectBudget / 1000).toFixed(1)}K`,
        subtitle: `R$ ${(totalBudgetActivities / 1000).toFixed(1)}K alocado em atividades`,
        trend: {
          value: budgetUtilization,
          isPositive: budgetUtilization <= 100,
          label: `${budgetUtilization}% utilizado`
        },
        icon: DollarSign,
      },
      {
        id: "completion-rate",
        title: "Taxa de Conclusão",
        value: `${completionRate}%`,
        subtitle: `${completedActivities} de ${totalActivities} finalizadas`,
        trend: {
          value: completedActivities,
          isPositive: completedActivities > 0,
          label: "atividades completas"
        },
        icon: CheckCircle,
      },
      {
        id: "subsidized-activities",
        title: "Atividades Subsidiadas",
        value: subsidizedActivities.toString(),
        subtitle: `${subsidyRate}% do total de atividades`,
        trend: {
          value: subsidyRequests.length,
          isPositive: subsidyRequests.length > 0,
          label: `${subsidyRequests.length} pedidos de subsídio`
        },
        icon: Target,
      },
      {
        id: "project-timeline",
        title: daysRemaining > 0 ? "Prazo Restante" : "Projeto Finalizado",
        value: daysRemaining > 0 ? `${daysRemaining} dias` : "Concluído",
        subtitle: `Termina em ${endDate.toLocaleDateString('pt-BR')}`,
        trend: {
          value: Math.abs(daysRemaining),
          isPositive: daysRemaining > 30,
          label: daysRemaining > 0 ? "dias restantes" : "dias atrás"
        },
        icon: Calendar,
      },
      {
        id: "subsidy-amount",
        title: "Valor em Subsídios",
        value: `R$ ${(subsidyRequests.reduce((sum, s) => sum + s.requested_amount, 0) / 1000).toFixed(1)}K`,
        subtitle: `${subsidyRequests.length} solicitações enviadas`,
        trend: {
          value: subsidyRequests.filter(s => s.status === 'approved').length,
          isPositive: true,
          label: "aprovadas"
        },
        icon: TrendingUp,
      },
    ]
  }, [projectData, allProjectActivities, project, subsidyRequests])


  usePageTitle({
    title: project?.title || "Detalhes do Projeto",
    showBreadcrumbsInHeader: true
  })



  // Event handlers
  const handleEditProject = () => {
    setIsEditModalOpen(true)
  }

  const handleDeleteProject = () => {
    // TODO: Implement delete confirmation dialog
    toast.success(`🗑️ Project deleted: ${project?.title}`, { duration: 3000 })
    router.push("/projects")
  }

  const handleCreateEvent = () => {
    setIsEventModalOpen(true)
  }

  const handleCreateCommunication = () => {
    setIsCommunicationModalOpen(true)
  }

  const handleDuplicateProject = () => {
    // TODO: Implement project duplication
    toast.success(`📋 Project duplicated: ${project?.title}`, { duration: 3000 })
  }

  const handleCreateReport = () => {
    setIsCreateReportModalOpen(true)
  }

  const handleProjectUpdateSuccess = () => {
    // Refetch project data after successful update
    refetchProject()
    setIsEditModalOpen(false)
  }

  const handleEventSubmit = (data: EventFormData) => {
    // TODO: Implement event creation API call
    setIsEventModalOpen(false)
    toast.success(t.toasts.eventCreated, { duration: 3000 })
  }

  const handleCommunicationSubmit = (data: CommunicationFormData) => {
    // TODO: Implement communication creation API call
    setIsCommunicationModalOpen(false)
    toast.success(t.toasts.communicationCreated, { duration: 3000 })
  }

  const handleEditActivity = (activity: ProjectActivityData) => {
    // TODO: Implement activity editing
    toast.success(`✏️ Editing activity: ${activity.name}`, { duration: 2000 })
  }

  const handleDeleteActivity = (activity: ProjectActivityData) => {
    // TODO: Implement activity deletion
    toast.success(`🗑️ Activity deleted: ${activity.name}`, { duration: 3000 })
  }

  const handleViewActivity = (activity: ProjectActivityData) => {
    // Only open modal if selection is not enabled or if explicitly clicking view button
    // This prevents conflict with row selection
    if (!selectedActivities.length) {
      toast.success(`👁️ Visualizando: ${activity.name}`, { duration: 2000 })
    }
  }

  const handleAddActivity = () => {
    setIsRegisterActivityModalOpen(true)
  }

  const handleSelectionChange = useCallback((activities: ProjectActivityData[]) => {
    setSelectedActivities(activities)
    if (activities.length > 0) {
      console.log(`${activities.length} atividade(s) selecionada(s):`, activities)
    }
  }, [])

  const handleBatchEdit = useCallback(async () => {
    // Verificar se algum campo foi alterado
    const hasChanges = Object.entries(batchEditData).some(([key, value]) => {
      if (typeof value === 'string') return value !== ''
      if (typeof value === 'boolean') return true
      return false
    })

    if (!hasChanges) {
      toast.error('Selecione pelo menos um campo para editar')
      return
    }

    if (selectedActivities.length === 0) {
      toast.error('Selecione pelo menos uma atividade')
      return
    }

    // Prepare variables - convert frontend values to API format
    const variables: any = {
      ids: selectedActivities.map(act => act.id)
    }

    // Map frontend values to backend enum values
    if (batchEditData.status && batchEditData.status !== '') {
      const statusMap: Record<string, string> = {
        'todo': 'TODO',
        'in_progress': 'IN_PROGRESS',
        'completed': 'COMPLETED',
        'on_hold': 'ON_HOLD'
      }
      variables.status = statusMap[batchEditData.status]
    }

    if (batchEditData.priority && batchEditData.priority !== '') {
      const priorityMap: Record<string, string> = {
        'urgent': 'URGENT',
        'high': 'HIGH',
        'medium': 'MEDIUM',
        'low': 'LOW'
      }
      variables.priority = priorityMap[batchEditData.priority]
    }

    if (batchEditData.activity_tag && batchEditData.activity_tag !== '') {
      // Values are already in the correct enum format (REFORM, MATERIALS, etc.)
      variables.activity_tag = batchEditData.activity_tag
    }

    if (batchEditData.is_subsidized !== undefined) {
      variables.is_subsidized = batchEditData.is_subsidized
    }

    console.log('🔄 Batch update variables:', variables)

    try {
      await batchUpdateActivities({ variables })
    } catch (error) {
      console.error('Error in batch edit:', error)
    }
  }, [selectedActivities, batchEditData, batchUpdateActivities])

  const handleBatchSubsidyRequest = useCallback(() => {
    console.log('🔵 Abrindo modal de subsídio com', selectedActivities.length, 'atividades:', selectedActivities)
    setIsRequestSubsidyModalOpen(true)
  }, [selectedActivities])

  const handleSubsidyRequestSubmit = (data: SubsidyRequestFormData) => {
    console.log('Subsidy request submitted:', data)
    toast.success(
      `📋 Solicitação de subsídio criada!\n${data.items.length} atividade(s) incluída(s)\nTotal: ${data.requested_amount}`,
      { duration: 4000 }
    )
    setIsRequestSubsidyModalOpen(false)
    setSelectedActivities([])
  }

  // Check if all selected activities are subsidized
  const canRequestSubsidy = useMemo(() => {
    if (selectedActivities.length === 0) return false
    return selectedActivities.every(act => act.is_subsidized === true)
  }, [selectedActivities])

  const handleBatchExport = useCallback(() => {
    console.log('Export activities:', selectedActivities)
    toast.success(`📊 Exportando ${selectedActivities.length} atividade(s)...`)
  }, [selectedActivities])

  const handleViewSubsidyCard = (id: string) => {
    const subsidy = subsidyRequests.find((s: SubsidyRequestCardData) => s.id === id)
    if (subsidy) {
      setSelectedSubsidyCard(subsidy)
      setIsViewSubsidyRequestModalOpen(true)
    }
  }

  const handleEditSubsidyCard = (id: string) => {
    const subsidy = subsidyRequests.find((s: SubsidyRequestCardData) => s.id === id)
    if (subsidy) {
      // TODO: Convert SubsidyRequestCardData to activities and open RequestSubsidyModal
      // For now, just show a message
      toast.success(`✏️ Abrindo edição para: ${subsidy.title}`, { duration: 2000 })
      // Future implementation: setIsRequestSubsidyModalOpen(true) with prepopulated data
    }
  }

  const handleDeleteSubsidyCard = (id: string) => {
    const subsidy = subsidyRequests.find((s: SubsidyRequestCardData) => s.id === id)
    if (subsidy) {
      setSelectedSubsidyCard(subsidy)
      setIsDeleteSubsidyRequestModalOpen(true)
    }
  }

  const handleDuplicateSubsidyCard = (id: string) => {
    const subsidy = subsidyRequests.find((s: SubsidyRequestCardData) => s.id === id)
    if (subsidy) {
      const duplicated: SubsidyRequestCardData = {
        ...subsidy,
        id: `subsidy-${Date.now()}`,
        title: `${subsidy.title} (Cópia)`,
        requested_at: new Date(),
        status: "pending"
      }
      setSubsidyRequests((prev: SubsidyRequestCardData[]) => [...prev, duplicated])
      toast.success(`📋 Solicitação duplicada: ${subsidy.title}`, { duration: 3000 })
    }
  }

  const handleAddSubsidyFromContainer = () => {
    // Abrir modal de seleção de atividades
    setIsSelectActivitiesModalOpen(true)
  }

  const handleActivitiesSelected = (activities: ProjectActivityData[]) => {
    // Fechar modal de seleção
    setIsSelectActivitiesModalOpen(false)
    
    // Definir atividades selecionadas
    setSelectedActivities(activities)
    
    // Abrir modal de solicitação de subsídio com as atividades selecionadas
    setIsRequestSubsidyModalOpen(true)
    
    toast.success(`✅ ${activities.length} atividade(s) selecionada(s)`, { duration: 2000 })
  }

  const handleRegisterActivitySubmit = async (data: RegisterActivityFormData) => {
    try {
      if (!user?.id) {
        toast.error("Usuário não autenticado")
        return
      }

      // Determine entity for funding - use institution if available, otherwise use department
      const useInstitution = project?.institutionId && project.institutionId !== ""
      const entityId = useInstitution ? project.institutionId : project?.department_id
      const entityType = useInstitution ? EntityType.Institution : EntityType.InstitutionDepartment

      if (!entityId) {
        toast.error("Projeto não possui instituição ou departamento associado")
        return
      }

      // Map frontend tags to API enum values
      const tagMap: Record<string, ActivityTags> = {
        // Portuguese
        "Reforma": ActivityTags.Reform,
        "Equipamentos": ActivityTags.Equipment,
        "Viagens": ActivityTags.Travel,
        "Eventos": ActivityTags.Event,
        "Materiais": ActivityTags.Materials,
        "Treinamento": ActivityTags.Training,
        "Alimentação": ActivityTags.Feeding,
        "Transporte": ActivityTags.Transport,
        "Hospedagem": ActivityTags.Accommodation,
        "Marketing": ActivityTags.Marketing,
        "Serviços": ActivityTags.Services,
        // English
        "Reform": ActivityTags.Reform,
        "Renovation": ActivityTags.Reform,
        "Equipment": ActivityTags.Equipment,
        "Trips": ActivityTags.Travel,
        "Travel": ActivityTags.Travel,
        "Events": ActivityTags.Event,
        "Materials": ActivityTags.Materials,
        "Training": ActivityTags.Training,
        "Food": ActivityTags.Feeding,
        "Feeding": ActivityTags.Feeding,
        "Transportation": ActivityTags.Transport,
        "Transport": ActivityTags.Transport,
        "Accommodation": ActivityTags.Accommodation,
        "Services": ActivityTags.Services,
        // Dutch
        "Renovatie": ActivityTags.Reform,
        "Apparatuur": ActivityTags.Equipment,
        "Reizen": ActivityTags.Travel,
        "Evenementen": ActivityTags.Event,
        "Voedsel": ActivityTags.Feeding,
        "Materialen": ActivityTags.Materials,
        "Vervoer": ActivityTags.Transport,
        "Accommodatie": ActivityTags.Accommodation,
        "Diensten": ActivityTags.Services,
      }

      // Separate tags into enum tags and custom tags
      const mappedTags: ActivityTags[] = []
      const customTags: string[] = []

      data.tags.forEach(tag => {
        const enumTag = tagMap[tag]
        if (enumTag) {
          // Avoid duplicates in mapped tags
          if (!mappedTags.includes(enumTag)) {
            mappedTags.push(enumTag)
          }
        } else {
          // Add to custom tags if not found in enum
          customTags.push(tag)
        }
      })

      // If no tags were mapped, add a default one
      if (mappedTags.length === 0 && customTags.length === 0) {
        mappedTags.push(ActivityTags.Materials)
      }

      // Calculate deadline (30 days from now if not specified)
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 30)

      // Calculate entity contribution
      const institutionAmount = data.institution_requested_amount || 0
      const entityContributionPercent = data.budget_amount > 0
        ? (institutionAmount / data.budget_amount) * 100
        : 0

      // Map priority from frontend to API enum
      const priorityMap: Record<string, ActivityPriority> = {
        "low": ActivityPriority.Low,
        "medium": ActivityPriority.Medium,
        "high": ActivityPriority.High,
      }

      const input = {
        project_id: projectId,
        name: data.name,
        description: data.description,
        budget_amount: data.budget_amount,
        deadline: deadline.toISOString(),
        assignee_ids: [user.id], // Novo: usar assignee_ids ao invés de owner_id
        tags: mappedTags,
        custom_tags: customTags,
        priority: priorityMap[data.priority] || ActivityPriority.Medium,
        status: ActivityStatus.Todo,
        is_subsidized: data.request_subsidy,
        activity_funding: {
          entity_contribution_amount: institutionAmount,
          entity_contribution_percent: entityContributionPercent,
          entity_type: entityType,
          entity_id: entityId,
        },
      }

      await createProjectActivity({
        variables: { input }
      })
    } catch (error) {
      console.error("Error creating activity:", error)
      toast.error("Erro ao criar atividade")
    }
  }

  const handleUploadReceiptForActivity = (activity: ProjectActivityData) => {
    // TODO: Implement upload receipt modal for project activities
    toast.success(`📄 Upload recibo para: ${activity.name}`, { duration: 2000 })
  }

  const clearFilters = () => {
    setSubsidyFilter("all")
    setStatusFilter("all")
    setPriorityFilter("all")
    setTagFilter("all")
    setSearchQuery("")
    toast.success("Filtros limpos", { duration: 1500 })
  }

  // Subsidy Management Handlers
  const handleAddSubsidy = () => {
    setIsAddSubsidyModalOpen(true)
  }

  const handleEditSubsidy = (subsidy: SubsidyRequestData) => {
    setSelectedSubsidy(subsidy)
    setIsEditSubsidyModalOpen(true)
  }

  const handleDeleteSubsidy = (subsidy: SubsidyRequestData) => {
    setSelectedSubsidy(subsidy)
    setIsDeleteSubsidyModalOpen(true)
  }

  const handleApproveSubsidy = (subsidy: SubsidyRequestData) => {
    // TODO: Implement subsidy approval API call
    toast.success(t.subsidy.subsidyApproved, { duration: 3000 })
  }

  const handleRejectSubsidy = (subsidy: SubsidyRequestData) => {
    // TODO: Implement subsidy rejection API call
    toast.success(t.subsidy.subsidyRejected, { duration: 3000 })
  }

  const handleAddActivityToSubsidy = (subsidy: SubsidyRequestData) => {
    setSelectedSubsidy(subsidy)
    setIsAddActivityModalOpen(true)
  }

  const handleEditActivityFromSubsidy = (activity: ActivityData) => {
    setSelectedActivity(activity)
    setIsEditActivityModalOpen(true)
  }

  const handleDeleteActivityFromSubsidy = (activity: ActivityData) => {
    setSelectedActivity(activity)
    setIsDeleteActivityModalOpen(true)
  }

  const handleUploadReceipt = (activity: ActivityData) => {
    setSelectedActivity(activity)
    setIsUploadReceiptModalOpen(true)
  }

  const handleViewReceipts = (activity: ActivityData) => {
    setSelectedActivity(activity)
    setIsViewReceiptsModalOpen(true)
  }

  const handleEditReceipt = (receipt: any) => {
    setSelectedReceipt(receipt)
    setIsEditReceiptModalOpen(true)
  }

  const handleDeleteReceipt = (receipt: any) => {
    // TODO: Implement receipt deletion
    toast.success(`🗑️ Receipt deleted: ${receipt.description}`, { duration: 3000 })
  }

  const handleReportSubmit = (data: ReportFormData) => {
    // TODO: Implement report creation API call
    setIsCreateReportModalOpen(false)
    // The modal handles the redirection internally
  }

  // Add user to project handler
  const handleAddUser = () => {
    setIsAddUserModalOpen(true)
  }

  const handleUserSelect = async (user: any) => {
    try {
      // TODO: Implement GraphQL mutation to add user to project
      // For now, we'll just show a success message
      toast.success(`✅ ${user.name} adicionado ao projeto com sucesso!`, {
        duration: 3000
      })
      setIsAddUserModalOpen(false)
      // Refetch project to update user list
      refetchProject()
    } catch (error) {
      toast.error(`Erro ao adicionar usuário: ${error}`)
      console.error('Error adding user to project:', error)
    }
  }

  // Communication handlers
  const handleAddCommunication = () => {
    toast.success("✏️ Abrindo formulário de nova comunicação...", { duration: 2000 })
    // TODO: Open communication creation modal
  }

  const handleViewCommunication = (id: string) => {
    const comm = communications.find(c => c.id === id)
    if (comm) {
      toast.success(`👁️ Visualizando: ${comm.title}`, { duration: 2000 })
      // TODO: Open communication view modal
    }
  }

  const handleEditCommunication = (id: string) => {
    const comm = communications.find(c => c.id === id)
    if (comm) {
      toast.success(`✏️ Editando: ${comm.title}`, { duration: 2000 })
      // TODO: Open communication edit modal
    }
  }

  const handleDeleteCommunication = (id: string) => {
    const comm = communications.find(c => c.id === id)
    if (comm) {
      setCommunications(prev => prev.filter(c => c.id !== id))
      toast.success(`🗑️ Comunicação excluída: ${comm.title}`, { duration: 3000 })
      // TODO: Implement delete mutation
    }
  }

  const handleDuplicateCommunication = (id: string) => {
    const comm = communications.find(c => c.id === id)
    if (comm) {
      const duplicated: CommunicationCardData = {
        ...comm,
        id: `comm-${Date.now()}`,
        title: `${comm.title} (Cópia)`,
        status: "draft",
        published_at: null,
        schedule_at: null
      }
      setCommunications(prev => [...prev, duplicated])
      toast.success(`📋 Comunicação duplicada: ${comm.title}`, { duration: 3000 })
    }
  }

  // Modal submit handlers
  const handleSubsidySubmit = (data: SubsidyFormData) => {
    // TODO: Implement subsidy creation API call
    setIsAddSubsidyModalOpen(false)
    toast.success(t.subsidy.subsidyCreated, { duration: 3000 })
  }

  const handleEditSubsidySubmit = (data: EditSubsidyFormData) => {
    // TODO: Implement subsidy update API call
    setIsEditSubsidyModalOpen(false)
    setSelectedSubsidy(undefined)
    toast.success(t.subsidy.subsidyUpdated, { duration: 3000 })
  }

  const handleDeleteSubsidyConfirm = () => {
    // TODO: Implement subsidy deletion API call
    setIsDeleteSubsidyModalOpen(false)
    setSelectedSubsidy(undefined)
    toast.success(t.subsidy.subsidyDeleted, { duration: 3000 })
  }

  const handleActivitySubmit = (data: ActivityFormData) => {
    // TODO: Implement activity creation API call
    setIsAddActivityModalOpen(false)
    setSelectedSubsidy(undefined)
    toast.success(t.activity.activityCreated, { duration: 3000 })
  }

  const handleReceiptSubmit = (data: ReceiptFormData) => {
    // TODO: Implement receipt upload API call
    setIsUploadReceiptModalOpen(false)
    setSelectedActivity(undefined)
    toast.success(t.activity.uploadSuccess, { duration: 3000 })
  }

  // Wrapper to convert ProjectActivityData to EditActivityFormData
  const handleSaveActivityFromDetailsModal = async (data: Partial<ProjectActivityData>) => {
    if (!data.id) return

    // Convert to EditActivityFormData format
    const formData: EditActivityFormData = {
      id: data.id,
      name: data.name || "",
      description: data.description || "",
      budget_amount: data.budget_amount || 0,
      tags: data.tags || [],
      custom_tags: data.custom_tags || [],
      priority: (data.priority?.toLowerCase() as EditActivityFormData["priority"]) || "medium",
      status: (data.status?.toLowerCase() as EditActivityFormData["status"]) || "todo",
      is_subsidized: data.is_subsidized || false,
      deadline: data.deadline || "",
      institution_requested_amount: data.institution_requested_amount,
    }

    // Pass through activity_tag and assignee_ids
    await handleEditActivitySubmit(formData, data.activity_tag, data.assignee_ids)
  }

  const handleEditActivitySubmit = async (data: EditActivityFormData, activity_tag?: string, assignee_ids?: string[]) => {
    try {
      // Same tag mapping logic as create
      const tagMap: Record<string, ActivityTags> = {
        // Portuguese
        "Reforma": ActivityTags.Reform,
        "Equipamentos": ActivityTags.Equipment,
        "Viagens": ActivityTags.Travel,
        "Eventos": ActivityTags.Event,
        "Materiais": ActivityTags.Materials,
        "Treinamento": ActivityTags.Training,
        "Alimentação": ActivityTags.Feeding,
        "Transporte": ActivityTags.Transport,
        "Hospedagem": ActivityTags.Accommodation,
        "Marketing": ActivityTags.Marketing,
        "Serviços": ActivityTags.Services,
        // English
        "Reform": ActivityTags.Reform,
        "Renovation": ActivityTags.Reform,
        "Equipment": ActivityTags.Equipment,
        "Trips": ActivityTags.Travel,
        "Travel": ActivityTags.Travel,
        "Events": ActivityTags.Event,
        "Materials": ActivityTags.Materials,
        "Training": ActivityTags.Training,
        "Food": ActivityTags.Feeding,
        "Feeding": ActivityTags.Feeding,
        "Transportation": ActivityTags.Transport,
        "Transport": ActivityTags.Transport,
        "Accommodation": ActivityTags.Accommodation,
        "Services": ActivityTags.Services,
        // Dutch
        "Renovatie": ActivityTags.Reform,
        "Apparatuur": ActivityTags.Equipment,
        "Reizen": ActivityTags.Travel,
        "Evenementen": ActivityTags.Event,
        "Voedsel": ActivityTags.Feeding,
        "Materialen": ActivityTags.Materials,
        "Vervoer": ActivityTags.Transport,
        "Accommodatie": ActivityTags.Accommodation,
        "Diensten": ActivityTags.Services,
      }

      // Separate tags into enum tags and custom tags
      const mappedTags: ActivityTags[] = []
      const customTags: string[] = []

      data.tags?.forEach(tag => {
        const enumTag = tagMap[tag]
        if (enumTag) {
          if (!mappedTags.includes(enumTag)) {
            mappedTags.push(enumTag)
          }
        } else {
          customTags.push(tag)
        }
      })

      // Add custom_tags from data
      if (data.custom_tags) {
        customTags.push(...data.custom_tags)
      }

      // Map priority
      const priorityMap: Record<string, ActivityPriority> = {
        "low": ActivityPriority.Low,
        "medium": ActivityPriority.Medium,
        "high": ActivityPriority.High,
        "urgent": ActivityPriority.Urgent,
      }

      // Map status
      const statusMap: Record<string, ActivityStatus> = {
        "todo": ActivityStatus.Todo,
        "in_progress": ActivityStatus.InProgress,
        "completed": ActivityStatus.Completed,
        "on_hold": ActivityStatus.OnHold,
      }

      const input: any = {
        id: data.id,
        name: data.name,
        description: data.description,
        budget_amount: data.budget_amount,
      }

      if (mappedTags.length > 0) {
        input.tags = mappedTags
      }

      if (customTags.length > 0) {
        input.custom_tags = customTags
      }

      if (data.priority) {
        input.priority = priorityMap[data.priority] || ActivityPriority.Medium
      }

      if (data.status) {
        input.status = statusMap[data.status] || ActivityStatus.Todo
      }

      if (data.deadline) {
        input.deadline = data.deadline
      }

      if (data.is_subsidized !== undefined) {
        input.is_subsidized = data.is_subsidized
      }

      // Add activity_tag if provided
      if (activity_tag) {
        // Map activity_tag string to ActivityTags enum
        const activityTagMap: Record<string, ActivityTags> = {
          // Enum values (current format)
          "REFORM": ActivityTags.Reform,
          "EQUIPMENT": ActivityTags.Equipment,
          "TRAVEL": ActivityTags.Travel,
          "EVENT": ActivityTags.Event,
          "MATERIALS": ActivityTags.Materials,
          "TRAINING": ActivityTags.Training,
          "FEEDING": ActivityTags.Feeding,
          "TRANSPORT": ActivityTags.Transport,
          "ACCOMMODATION": ActivityTags.Accommodation,
          "MARKETING": ActivityTags.Marketing,
          "SERVICES": ActivityTags.Services,
          // Legacy values (old format - lowercase, Portuguese)
          "reforma": ActivityTags.Reform,
          "material": ActivityTags.Materials,
          "training": ActivityTags.Training,
          "viagem": ActivityTags.Travel,
          "evento": ActivityTags.Event,
          "transporte": ActivityTags.Transport,
          "marketing": ActivityTags.Marketing,
          "servicos": ActivityTags.Services,
          "alimentacao": ActivityTags.Feeding,
          "acomodacao": ActivityTags.Accommodation,
          "equipamento": ActivityTags.Equipment,
        }
        input.activity_tag = activityTagMap[activity_tag] || activity_tag
      }

      // Add assignee_ids if provided (múltiplos responsáveis)
      // Sempre enviar assignee_ids se foi passado (mesmo se vazio, para remover todos)
      if (assignee_ids !== undefined) {
        input.assignee_ids = assignee_ids
      }

      console.log('🚀 Sending update input:', JSON.stringify(input, null, 2))

      await updateProjectActivity({
        variables: { input }
      })
    } catch (error) {
      console.error("Error updating activity:", error)
      toast.error("Erro ao atualizar atividade")
    }
  }

  const handleDeleteActivityConfirm = () => {
    // TODO: Implement activity deletion API call
    setIsDeleteActivityModalOpen(false)
    setSelectedActivity(undefined)
    toast.success(t.activity.activityDeleted, { duration: 3000 })
  }

  // Handlers for Subsidy Request Card modals
  const handleEditSubsidyRequestFromView = (subsidy: SubsidyRequestCardData) => {
    // TODO: Convert SubsidyRequestCardData to activities and open RequestSubsidyModal
    // For now, just show a message
    toast.success(`✏️ Abrindo edição para: ${subsidy.title}`, { duration: 2000 })
    // Future implementation: 
    // 1. Find or create activities related to this subsidy
    // 2. Set selectedActivities with those activities
    // 3. Open RequestSubsidyModal in edit mode
    // setSelectedActivities(relatedActivities)
    // setIsRequestSubsidyModalOpen(true)
  }

  const handleDeleteSubsidyRequestSuccess = (deletedSubsidy: SubsidyRequestCardData) => {
    setSubsidyRequests((prev: SubsidyRequestCardData[]) => prev.filter((s: SubsidyRequestCardData) => s.id !== deletedSubsidy.id))
    setSelectedSubsidyCard(null)
  }

  // Transform ActivityData to ProjectActivityData for the modal
  const transformActivityToProjectActivity = (activity: ActivityData | undefined) => {
    if (!activity) return null
    return {
      id: activity.id,
      project_id: projectId,
      name: activity.name,
      description: activity.description || "",
      activity_tag: ActivityTags.Materials,
      budget_amount: activity.budget_amount,
      status: activity.status,
      priority: "medium",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      deleted_at: null,
      is_subsidized: true,
      subsidy_amount: 0,
      spent_amount: 0
    }
  }

  // Batch edit fields configuration
  const batchEditFields: BatchEditField[] = useMemo(() => [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      value: batchEditData.status,
      options: [
        { value: 'todo', label: 'A Fazer' },
        { value: 'in_progress', label: 'Em Andamento' },
        { value: 'completed', label: 'Concluído' },
        { value: 'on_hold', label: 'Em Espera' }
      ],
      onChange: (value) => setBatchEditData(prev => ({ ...prev, status: value as string })),
      getBadgeVariant: (value) => {
        const map: Record<string, string> = {
          todo: 'gray',
          in_progress: 'blue',
          completed: 'green',
          on_hold: 'yellow'
        }
        return map[value] || 'gray'
      }
    },
    {
      id: 'priority',
      label: 'Prioridade',
      type: 'select',
      value: batchEditData.priority,
      options: [
        { value: 'urgent', label: 'Urgente' },
        { value: 'high', label: 'Alta' },
        { value: 'medium', label: 'Média' },
        { value: 'low', label: 'Baixa' }
      ],
      onChange: (value) => setBatchEditData(prev => ({ ...prev, priority: value as string })),
      getBadgeVariant: (value) => {
        const map: Record<string, string> = {
          urgent: 'red',
          high: 'orange',
          medium: 'yellow',
          low: 'green'
        }
        return map[value] || 'gray'
      }
    },
    {
      id: 'activity_tag',
      label: 'Categoria',
      type: 'select',
      value: batchEditData.activity_tag,
      options: getActivityTagOptions(),
      onChange: (value) => setBatchEditData(prev => ({ ...prev, activity_tag: value as string })),
      getBadgeVariant: (value) => getActivityTagVariant(value as ActivityTags)
    },
    {
      id: 'is_subsidized',
      label: 'Subsidiado',
      type: 'switch',
      value: batchEditData.is_subsidized,
      onChange: (value) => setBatchEditData(prev => ({ ...prev, is_subsidized: value as boolean })),
      showLabel: false,
      infoTooltip: 'Ative esta opção para marcar as atividades selecionadas como subsidiadas. Atividades subsidiadas podem receber apoio financeiro da instituição.'
    }
  ], [batchEditData])

  if (projectLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando detalhes do projeto...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (projectError || !project) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-muted-foreground">{t.projectNotFound}</h1>
            <p className="text-muted-foreground mt-2">{t.projectNotFoundDesc}</p>
          </div>
        </div>
      </AppLayout>
    )
  }


  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Project Header */}
        <ProjectHeaderMinimal
          project={project}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onCreateEvent={handleCreateEvent}
          onCreateCommunication={handleCreateCommunication}
          users={projectUsers}
          onAddUser={handleAddUser}
        />

        {/* KPI Cards */}
        {projectKPIs && (
          <KPICards 
            data={projectKPIs}
            isLoading={projectLoading}
            minCardsForCarousel={4}
            showCarousel={true}
          />
        )}

        {/* Grid Container - Chart + Subsidy Cards OR Communications */}
        <GridContainer
          items={
            activeTab === "subsidies"
              ? [
                  {
                    id: "subsidy-chart",
                    component: (
                      <SubsidyActivityChart
                        data={subsidyRequests}
                        selectedYear={new Date().getFullYear()}
                      />
                    ),
                    colSpan: "col-span-12 lg:col-span-8",
                  },
                  {
                    id: "subsidy-cards",
                    component: (
                      <>
                        {/* Tabs - Subsídios e Comunicações */}

                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "subsidies" | "communications")} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 max-w-md">
                            <TabsTrigger value="subsidies" className="gap-2">
                              <DollarSign className="w-4 h-4" />
                              Subsídios
                            </TabsTrigger>
                            <TabsTrigger value="communications" className="gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                              Comunicações
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>

                        <SubsidyRequestsContainer
                          subsidies={subsidyRequests}
                          onAddSubsidy={handleAddSubsidyFromContainer}
                          onViewSubsidy={handleViewSubsidyCard}
                          onEditSubsidy={handleEditSubsidyCard}
                          onDeleteSubsidy={handleDeleteSubsidyCard}
                          onDuplicateSubsidy={handleDuplicateSubsidyCard}
                          description="Gerencie as solicitações de subsídio"
                        />
                      </>
                 
                    ),
                    colSpan: "col-span-12 lg:col-span-4",
                  },
                ]
              : [ 
                  {
                    id: "subsidy-chart",
                    component: (
                      <SubsidyActivityChart
                        data={subsidyRequests}
                        selectedYear={new Date().getFullYear()}
                      />
                    ),
                    colSpan: "col-span-12 lg:col-span-8",
                  },
                  {
                    id: "communications",
                    component: (
                      <>
                           {/* Tabs - Subsídios e Comunicações */}
                        
                        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "subsidies" | "communications")} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 max-w-md">
                            <TabsTrigger value="subsidies" className="gap-2">
                              <DollarSign className="w-4 h-4" />
                              Subsídios
                            </TabsTrigger>
                            <TabsTrigger value="communications" className="gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
                              Comunicações
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>

                         <CommunicationsContainer
                          communications={communications}
                          onAddCommunication={handleAddCommunication}
                          onViewCommunication={handleViewCommunication}
                          onEditCommunication={handleEditCommunication}
                          onDeleteCommunication={handleDeleteCommunication}
                          onDuplicateCommunication={handleDuplicateCommunication}
                          description="Comunicações do projeto"
                        />
                      </>
                     
                    ),
                     colSpan: "col-span-12 lg:col-span-4",
                  },
                ]
          }
          gap="lg"
        />

        {/* Main Content Grid - Project Activities */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Activities (col-span-8) */}
          <div className="col-span-12 lg:col-span-12 space-y-6">
            {/* Filters Section */}
            <ProjectActivitiesFilters
              subsidyFilter={subsidyFilter}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              tagFilter={tagFilter}
              searchQuery={searchQuery}
              onSubsidyChange={setSubsidyFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              onTagChange={setTagFilter}
              onSearchChange={setSearchQuery}
              onClearFilters={clearFilters}
              onAddActivity={handleAddActivity}
            />

            {/* Activities Table */}
            <ProjectActivitiesTable
              project={project}
              activities={allProjectActivities}
              filterSubsidized={subsidyFilter === "all" ? undefined : subsidyFilter === "subsidized"}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              tagFilter={tagFilter}
              searchQuery={searchQuery}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onViewActivity={undefined}
              onUploadReceipt={handleUploadReceiptForActivity}
              onSaveActivity={handleSaveActivityFromDetailsModal}
              institutionUsers={usersData?.users || []}
              enableRowSelection={true}
              selectedActivities={selectedActivities}
              onSelectionChange={handleSelectionChange}
              batchEditFields={batchEditFields}
              batchActions={[
                {
                  id: 'apply',
                  label: 'Aplicar',
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
                  onClick: handleBatchEdit,
                  variant: 'outline'
                }
              ]}
              batchPrimaryAction={{
                id: 'request-subsidy',
                label: 'Solicitar Subsídio',
                icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                onClick: handleBatchSubsidyRequest,
                variant: 'default',
                disabled: !canRequestSubsidy
              }}
              batchSummary={
                <div className="flex items-center gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Total: </span>
                    <span className="font-medium text-gray-700 dark:text-gray-400">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                      }).format(selectedActivities.reduce((sum, act) => sum + act.budget_amount, 0))}
                    </span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <div>
                    <span className="text-gray-500 dark:text-gray-500">Subsidiadas: </span>
                    <span className="font-medium text-gray-700 dark:text-gray-400">
                      {selectedActivities.filter(act => act.is_subsidized).length}
                    </span>
                  </div>
                </div>
              }
            />
          </div>

          {/* Right Column - Empty placeholder or future content */}
          {/* <div className="col-span-12 lg:col-span-4">
       
          </div> */}
        </div>
        
        {/* Modals */}
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleProjectUpdateSuccess}
          project={project}
        />
        
        <CreateEventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onSubmit={handleEventSubmit}
          project={project}
        />
        
        <CreateCommunicationModal
          isOpen={isCommunicationModalOpen}
          onClose={() => setIsCommunicationModalOpen(false)}
          onSubmit={handleCommunicationSubmit}
          project={project}
        />
        
        {/* Subsidy Management Modals */}
        <AddSubsidyModal
          isOpen={isAddSubsidyModalOpen}
          onClose={() => setIsAddSubsidyModalOpen(false)}
          onSubmit={handleSubsidySubmit}
          project={project}
        />
        
        <EditSubsidyModal
          isOpen={isEditSubsidyModalOpen}
          onClose={() => {
            setIsEditSubsidyModalOpen(false)
            setSelectedSubsidy(undefined)
          }}
          onSubmit={handleEditSubsidySubmit}
          subsidy={selectedSubsidy}
        />
        
        <DeleteSubsidyModal
          isOpen={isDeleteSubsidyModalOpen}
          onClose={() => {
            setIsDeleteSubsidyModalOpen(false)
            setSelectedSubsidy(undefined)
          }}
          onConfirm={handleDeleteSubsidyConfirm}
          subsidy={selectedSubsidy}
        />
        
        {/* Activity Management Modals */}
        <AddActivityModal
          isOpen={isAddActivityModalOpen}
          onClose={() => {
            setIsAddActivityModalOpen(false)
            setSelectedSubsidy(undefined)
          }}
          onSubmit={handleActivitySubmit}
          subsidy={selectedSubsidy}
        />
        
        <UploadReceiptModal
          isOpen={isUploadReceiptModalOpen}
          onClose={() => {
            setIsUploadReceiptModalOpen(false)
            setSelectedActivity(undefined)
          }}
          onSubmit={handleReceiptSubmit}
          activity={selectedActivity}
        />
        
        <ViewReceiptsModal
          isOpen={isViewReceiptsModalOpen}
          onClose={() => {
            setIsViewReceiptsModalOpen(false)
            setSelectedActivity(undefined)
          }}
          activity={selectedActivity}
          onEditReceipt={handleEditReceipt}
          onDeleteReceipt={handleDeleteReceipt}
        />
        
        <EditActivityModal
          isOpen={isEditActivityModalOpen}
          onClose={() => {
            setIsEditActivityModalOpen(false)
            setSelectedActivity(undefined)
          }}
          onSubmit={handleEditActivitySubmit}
          activity={selectedActivity}
        />
        
        <DeleteActivityModal
          isOpen={isDeleteActivityModalOpen}
          onOpenChangeAction={(open) => {
            setIsDeleteActivityModalOpen(open)
            if (!open) setSelectedActivity(undefined)
          }}
          activity={transformActivityToProjectActivity(selectedActivity)}
        />
        
        <CreateReportModal
          isOpen={isCreateReportModalOpen}
          onClose={() => setIsCreateReportModalOpen(false)}
          onSubmit={handleReportSubmit}
          project={project}
        />
        
        <RegisterActivityModal
          isOpen={isRegisterActivityModalOpen}
          onClose={() => setIsRegisterActivityModalOpen(false)}
          onSubmit={handleRegisterActivitySubmit}
          projectId={projectId}
        />

        <RequestSubsidyModal
          isOpen={isRequestSubsidyModalOpen}
          onClose={() => {
            setIsRequestSubsidyModalOpen(false)
            setSelectedActivities([])
          }}
          selectedActivities={selectedActivities}
          projectId={projectId}
          institutionId={project?.institutionId}
          departmentId={project?.department_id}
          onSubmit={handleSubsidyRequestSubmit}
          allActivities={allProjectActivities}
        />

        {/* Subsidy Request Card Modals */}
        <SubsidyRequestViewModal
          isOpen={isViewSubsidyRequestModalOpen}
          onOpenChange={setIsViewSubsidyRequestModalOpen}
          subsidy={selectedSubsidyCard}
        />

        <DeleteSubsidyRequestModal
          isOpen={isDeleteSubsidyRequestModalOpen}
          onOpenChangeAction={setIsDeleteSubsidyRequestModalOpen}
          subsidy={selectedSubsidyCard}
          onSuccess={handleDeleteSubsidyRequestSuccess}
        />

        {/* Modal de Seleção de Atividades */}
        <SelectActivitiesModal
          isOpen={isSelectActivitiesModalOpen}
          onClose={() => setIsSelectActivitiesModalOpen(false)}
          activities={allProjectActivities}
          onConfirm={handleActivitiesSelected}
          title="Selecionar Atividades para Subsídio"
          description="Selecione as atividades subsidiadas que deseja incluir na solicitação de subsídio."
          filterSubsidized={true}
        />

        {/* Add User Modal */}
        <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Usuário ao Projeto</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Users List */}
              <div className="max-h-[400px] overflow-y-auto space-y-1">
                {usersData?.users && usersData.users.length > 0 ? (
                  usersData.users
                    .filter((user: any) => 
                      !projectUsers.some(pu => pu.id === user.id)
                    )
                    .map((user: any) => {
                      const userInitials = user.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)

                      return (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleUserSelect(user)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Avatar className="h-10 w-10 border-2 border-background">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="text-xs bg-gray-600 dark:bg-gray-700 text-white font-semibold">
                              {userInitials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user.name}
                            </p>
                            {user.email && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user.email}
                              </p>
                            )}
                          </div>
                        </button>
                      )
                    })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {usersLoading ? "Carregando usuários..." : "Nenhum usuário disponível"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </AppLayout>
  )
}
