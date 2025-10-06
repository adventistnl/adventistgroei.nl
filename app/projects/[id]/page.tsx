"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { AppLayout } from "@/components/layouts/app-layout"
import { usePageTitle } from "@/hooks/use-page-title"
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectOverview } from "@/components/projects/project-overview"
import { ProjectActivitiesTable, ProjectActivityData } from "@/components/projects/project-activities-table"
import { ProjectSubsidiesTable, SubsidyRequestData, ActivityData } from "@/components/projects/project-subsidies-table"
import { EditProjectModal, EditProjectFormData } from "@/components/modals/project/edit-project-modal"
import { CreateEventModal, EventFormData } from "@/components/modals/project/create-event-modal"
import { CreateCommunicationModal, CommunicationFormData } from "@/components/modals/project/create-communication-modal"
import { AddSubsidyModal, SubsidyFormData } from "@/components/modals/project/add-subsidy-modal"
import { EditSubsidyModal, EditSubsidyFormData } from "@/components/modals/project/edit-subsidy-modal"
import { DeleteSubsidyModal } from "@/components/modals/project/delete-subsidy-modal"
import { AddActivityModal, ActivityFormData } from "@/components/modals/project/add-activity-modal"
import { EditActivityModal, EditActivityFormData } from "@/components/modals/project/edit-activity-modal"
import { DeleteActivityModal } from "@/components/modals/project/delete-activity-modal"
import { UploadReceiptModal, ReceiptFormData } from "@/components/modals/project/upload-receipt-modal"
import { ViewReceiptsModal } from "@/components/modals/project/view-receipts-modal"
import { CreateReportModal, ReportFormData } from "@/components/modals/project/create-report-modal"

import { ProjectTableData } from "@/components/projects/projects-table"
import { projectTranslations } from "@/lib/translations/projects"
import { mockProjects } from "@/data/mockData"
import toast from "react-hot-toast"
import "@/lib/i18n"

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { i18n } = useTranslation()
  const projectId = params.id as string
  
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<ProjectTableData | null>(null)
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false)
  const [isAddSubsidyModalOpen, setIsAddSubsidyModalOpen] = useState(false)
  const [isEditSubsidyModalOpen, setIsEditSubsidyModalOpen] = useState(false)
  const [isDeleteSubsidyModalOpen, setIsDeleteSubsidyModalOpen] = useState(false)
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false)
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false)
  const [isDeleteActivityModalOpen, setIsDeleteActivityModalOpen] = useState(false)
  const [isUploadReceiptModalOpen, setIsUploadReceiptModalOpen] = useState(false)
  const [isViewReceiptsModalOpen, setIsViewReceiptsModalOpen] = useState(false)
  const [isEditReceiptModalOpen, setIsEditReceiptModalOpen] = useState(false)
  const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState<any>(undefined)
  
  // Selected items for modals
  const [selectedSubsidy, setSelectedSubsidy] = useState<SubsidyRequestData | undefined>(undefined)
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | undefined>(undefined)
  
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

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
        
        setIsLoading(false)
        
      } catch (error) {
        toast.dismiss(loadingToast)
        toast.error("Erro ao carregar detalhes do projeto")
        setIsLoading(false)
      }
    }

    loadProjectData()
  }, [projectId])

  const breadcrumbs = useMemo(() => [
    { name: "Projetos", href: "/projects" },
    { name: project?.title || "Carregando..." }
  ], [project])

  usePageTitle({
    title: project?.title || "Detalhes do Projeto",
    breadcrumbs
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
    console.log('Creating event:', data)
    setIsEventModalOpen(false)
    toast.success(t.toasts.eventCreated, { duration: 3000 })
  }

  const handleCommunicationSubmit = (data: CommunicationFormData) => {
    // TODO: Implement communication creation API call
    console.log('Creating communication:', data)
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
    // TODO: Implement view activity functionality
    toast.success(`👁️ Visualizando: ${activity.name}`, { duration: 2000 })
  }

  const handleAddActivity = () => {
    // TODO: Implement add activity modal
    toast.success("➕ Add activity functionality coming soon!", { duration: 2000 })
  }

  const handleUploadReceiptForActivity = (activity: ProjectActivityData) => {
    // TODO: Implement upload receipt modal for project activities
    toast.success(`📄 Upload recibo para: ${activity.name}`, { duration: 2000 })
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
    console.log('Creating report:', data)
    setIsCreateReportModalOpen(false)
    // The modal handles the redirection internally
  }

  // Modal submit handlers
  const handleSubsidySubmit = (data: SubsidyFormData) => {
    // TODO: Implement subsidy creation API call
    console.log('Creating subsidy:', data)
    setIsAddSubsidyModalOpen(false)
    toast.success(t.subsidy.subsidyCreated, { duration: 3000 })
  }

  const handleEditSubsidySubmit = (data: EditSubsidyFormData) => {
    // TODO: Implement subsidy update API call
    console.log('Updating subsidy:', data)
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
    console.log('Creating activity:', data)
    setIsAddActivityModalOpen(false)
    setSelectedSubsidy(undefined)
    toast.success(t.activity.activityCreated, { duration: 3000 })
  }

  const handleReceiptSubmit = (data: ReceiptFormData) => {
    // TODO: Implement receipt upload API call
    console.log('Uploading receipt:', data)
    setIsUploadReceiptModalOpen(false)
    setSelectedActivity(undefined)
    toast.success(t.activity.uploadSuccess, { duration: 3000 })
  }

  const handleEditActivitySubmit = (data: EditActivityFormData) => {
    // TODO: Implement activity update API call
    console.log('Updating activity:', data)
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

  if (isLoading) {
    return <div>Loading...</div> // This will show the loading.tsx component
  }

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
        <ProjectHeader
          project={project}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          onCreateEvent={handleCreateEvent}
          onCreateCommunication={handleCreateCommunication}
          onDuplicate={handleDuplicateProject}
          onCreateReport={handleCreateReport}
        />
        
        {/* Project Overview with KPIs and Charts */}
        <ProjectOverview project={project} />
        
        {/* Project Subsidies Table */}
        {/* <ProjectSubsidiesTable
          project={project}
          onAddSubsidy={handleAddSubsidy}
          onEditSubsidy={handleEditSubsidy}
          onDeleteSubsidy={handleDeleteSubsidy}
          onApproveSubsidy={handleApproveSubsidy}
          onRejectSubsidy={handleRejectSubsidy}
          onAddActivity={handleAddActivityToSubsidy}
          onEditActivity={handleEditActivityFromSubsidy}
          onDeleteActivity={handleDeleteActivityFromSubsidy}
          onUploadReceipt={handleUploadReceipt}
          onViewReceipts={handleViewReceipts}
        /> */}
        
        {/* Project Activities  Table */}
        <ProjectActivitiesTable
          project={project}
          onAddActivity={handleAddActivity}
          onEditActivity={handleEditActivity}
          onDeleteActivity={handleDeleteActivity}
          onViewActivity={handleViewActivity}
          onUploadReceipt={handleUploadReceiptForActivity}
        />
        
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
          onClose={() => {
            setIsDeleteActivityModalOpen(false)
            setSelectedActivity(undefined)
          }}
          onConfirm={handleDeleteActivityConfirm}
          activity={selectedActivity}
        />
        
        <CreateReportModal
          isOpen={isCreateReportModalOpen}
          onClose={() => setIsCreateReportModalOpen(false)}
          onSubmit={handleReportSubmit}
          project={project}
        />

      </div>
    </AppLayout>
  )
}
