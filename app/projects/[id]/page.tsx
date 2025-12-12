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
import { GridContainer } from "@/components/shared/grid-container"
import { EditProjectModal, EditProjectFormData } from "@/components/modals/project/edit-project-modal"
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

import { ProjectTableData } from "@/components/projects/projects-table"
import { projectTranslations } from "@/lib/translations/projects"
import { mockProjects, getActivitiesByProjectId } from "@/data/mockData"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import "@/lib/i18n"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n } = useTranslation()
  const projectId = params.id as string
  
  // State management
  const [project, setProject] = useState<ProjectTableData | null>(null)
  const [selectedActivities, setSelectedActivities] = useState<ProjectActivityData[]>([])
  
  // Mock subsidy requests data
  const [mockSubsidyRequests, setMockSubsidyRequests] = useState<SubsidyRequestCardData[]>([
    {
      id: "subsidy-1",
      title: "Subsídio para Reforma do Templo",
      requested_at: new Date("2024-12-01"),
      status: "pending",
      requested_amount: 15000,
      institution_name: "União Adventista"
    },
    {
      id: "subsidy-2",
      title: "Equipamentos de Som",
      requested_at: new Date("2024-11-15"),
      status: "approved",
      requested_amount: 8000,
      institution_name: "União Adventista"
    },
    {
      id: "subsidy-3",
      title: "Viagem Missionária",
      requested_at: new Date("2024-12-10"),
      status: "in_review",
      requested_amount: 5000,
      institution_name: "União Adventista"
    }
  ])
  
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
  const [selectedReceipt, setSelectedReceipt] = useState<any>(undefined)
  
  // Selected items for modals
  const [selectedSubsidy, setSelectedSubsidy] = useState<SubsidyRequestData | undefined>(undefined)
  const [selectedSubsidyCard, setSelectedSubsidyCard] = useState<SubsidyRequestCardData | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)
  
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

  // Get all project activities for the subsidy modal
  const allProjectActivities = useMemo(() => {
    if (!project) return []
    return getActivitiesByProjectId(project.id) as ProjectActivityData[]
  }, [project])

  // Transform mock project to ProjectTableData format
  const transformProjectData = (mockProject: any): ProjectTableData => {
    return {
      id: mockProject.id,
      department_id: mockProject.department_id,
      title: mockProject.title,
      description: mockProject.description,
      budget: mockProject.budget,
      is_private: mockProject.is_private,
      required_volunteers: mockProject.required_volunteers,
      start_at: mockProject.start_at,
      end_at: mockProject.end_at,
      language_preference: mockProject.language_preference,
      institutionId: mockProject.institutionId,
      status: mockProject.status,
      is_event: mockProject.is_event,
      type: mockProject.type,
      eventId: mockProject.eventId,
      subsidyRequests: 0, // Will be calculated
      subsidyAmount: 0, // Will be calculated
      activities: 0 // Will be calculated
    }
  }

  // Load project data
  useEffect(() => {
    const loadProjectData = async () => {
      const loadingToast = toast.loading("Carregando detalhes do projeto...")
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Find the project by ID
        const foundProject = mockProjects.find(p => p.id === projectId)
        
        if (foundProject) {
          const transformedProject = transformProjectData(foundProject)
          setProject(transformedProject)
          
          toast.dismiss(loadingToast)
          toast.success("📋 Project details loaded successfully!", {
            duration: 3000
          })
        } else {
          toast.dismiss(loadingToast)
          toast.error("Projeto não encontrado")
        }
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error("Erro ao carregar detalhes do projeto")
      }
    }

    loadProjectData()
  }, [projectId])


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

  const handleEditSubmit = (data: EditProjectFormData) => {
    if (project) {
      const updatedProject = {
        ...project,
        ...data,
        start_at: data.start_at.toISOString(),
        end_at: data.end_at.toISOString(),
      }
      setProject(updatedProject)
      setIsEditModalOpen(false)
      toast.success(t.toasts.projectUpdated, { duration: 3000 })
    }
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

  const handleBatchEdit = useCallback(() => {
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

    console.log('Batch edit data:', batchEditData)
    console.log('Activities to update:', selectedActivities)
    
    // TODO: Implement API call to batch update activities
    const fieldsUpdated = Object.entries(batchEditData)
      .filter(([_, value]) => typeof value === 'string' ? value !== '' : true)
      .map(([key]) => key)
      .join(', ')
    
    toast.success(
      `✅ ${selectedActivities.length} atividade(s) atualizada(s)!\nCampos: ${fieldsUpdated}`,
      { duration: 4000 }
    )
    
    // Clear selection and reset form
    setSelectedActivities([])
    setBatchEditData({
      status: "",
      priority: "",
      activity_tag: "",
      is_subsidized: false
    })
  }, [selectedActivities, batchEditData])

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
    const subsidy = mockSubsidyRequests.find(s => s.id === id)
    if (subsidy) {
      setSelectedSubsidyCard(subsidy)
      setIsViewSubsidyRequestModalOpen(true)
    }
  }

  const handleEditSubsidyCard = (id: string) => {
    const subsidy = mockSubsidyRequests.find(s => s.id === id)
    if (subsidy) {
      // TODO: Convert SubsidyRequestCardData to activities and open RequestSubsidyModal
      // For now, just show a message
      toast.success(`✏️ Abrindo edição para: ${subsidy.title}`, { duration: 2000 })
      // Future implementation: setIsRequestSubsidyModalOpen(true) with prepopulated data
    }
  }

  const handleDeleteSubsidyCard = (id: string) => {
    const subsidy = mockSubsidyRequests.find(s => s.id === id)
    if (subsidy) {
      setSelectedSubsidyCard(subsidy)
      setIsDeleteSubsidyRequestModalOpen(true)
    }
  }

  const handleDuplicateSubsidyCard = (id: string) => {
    const subsidy = mockSubsidyRequests.find(s => s.id === id)
    if (subsidy) {
      const duplicated: SubsidyRequestCardData = {
        ...subsidy,
        id: `subsidy-${Date.now()}`,
        title: `${subsidy.title} (Cópia)`,
        requested_at: new Date(),
        status: "pending"
      }
      setMockSubsidyRequests(prev => [...prev, duplicated])
      toast.success(`📋 Solicitação duplicada: ${subsidy.title}`, { duration: 3000 })
    }
  }

  const handleAddSubsidyFromContainer = () => {
    toast.success("➕ Abrindo formulário de nova solicitação...", { duration: 2000 })
    // You can open the RequestSubsidyModal here if needed
    // setIsRequestSubsidyModalOpen(true)
  }

  const handleRegisterActivitySubmit = (data: RegisterActivityFormData) => {
    // TODO: Implement API call to register activity
    console.log("New activity data:", data)
    toast.success(`✅ Atividade "${data.name}" adicionada com sucesso!`, { duration: 3000 })
    // Aqui você pode adicionar a lógica para atualizar a lista de atividades
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

  const handleEditActivitySubmit = (data: EditActivityFormData) => {
    // TODO: Implement activity update API call
    setIsEditActivityModalOpen(false)
    setSelectedActivity(undefined)
    toast.success(t.activity.activityUpdated, { duration: 3000 })
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
    setMockSubsidyRequests(prev => prev.filter(s => s.id !== deletedSubsidy.id))
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
      activity_tag: "material" as "reforma" | "material" | "training",
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
      options: [
        { value: 'reforma', label: 'Reforma' },
        { value: 'material', label: 'Material' },
        { value: 'training', label: 'Treinamento' }
      ],
      onChange: (value) => setBatchEditData(prev => ({ ...prev, activity_tag: value as string })),
      getBadgeVariant: (value) => {
        const map: Record<string, string> = {
          reforma: 'purple',
          material: 'cyan',
          training: 'indigo'
        }
        return map[value] || 'gray'
      }
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

  if (!project) {
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
        />

        {/* Grid Container - Chart + Subsidy Cards */}
        <GridContainer
          items={[
            {
              id: "subsidy-chart",
              component: (
                <SubsidyActivityChart
                  data={mockSubsidyRequests}
                  selectedYear={new Date().getFullYear()}
                />
              ),
              colSpan: "col-span-12 lg:col-span-8",
            },
            {
              id: "subsidy-cards",
              component: (
                <SubsidyRequestsContainer
                  subsidies={mockSubsidyRequests}
                  onAddSubsidy={handleAddSubsidyFromContainer}
                  onViewSubsidy={handleViewSubsidyCard}
                  onEditSubsidy={handleEditSubsidyCard}
                  onDeleteSubsidy={handleDeleteSubsidyCard}
                  onDuplicateSubsidy={handleDuplicateSubsidyCard}
                  description="Gerencie as solicitações de subsídio"
                />
              ),
              colSpan: "col-span-12 lg:col-span-4",
            },
          ]}
          gap="lg"
        />

        {/* Main Content Grid */}
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
              filterSubsidized={subsidyFilter === "all" ? undefined : subsidyFilter === "subsidized"}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              tagFilter={tagFilter}
              searchQuery={searchQuery}
              onEditActivity={handleEditActivity}
              onDeleteActivity={handleDeleteActivity}
              onViewActivity={undefined}
              onUploadReceipt={handleUploadReceiptForActivity}
              enableRowSelection={true}
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
          onSubmit={handleEditSubmit}
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

      </div>
    </AppLayout>
  )
}
