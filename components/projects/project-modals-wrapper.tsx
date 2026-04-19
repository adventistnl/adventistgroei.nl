"use client"

import React, { lazy, Suspense } from "react"

// Lazy load all project modals
const EditProjectModal = lazy(() => import("@/components/modals/project/edit-project-modal").then(module => ({ default: module.EditProjectModal })))
const CreateEventModal = lazy(() => import("@/components/modals/project/create-event-modal").then(module => ({ default: module.CreateEventModal })))
const CreateCommunicationModal = lazy(() => import("@/components/modals/project/create-communication-modal").then(module => ({ default: module.CreateCommunicationModal })))
const AddSubsidyModal = lazy(() => import("@/components/modals/project/add-subsidy-modal").then(module => ({ default: module.AddSubsidyModal })))
const EditSubsidyModal = lazy(() => import("@/components/modals/project/edit-subsidy-modal").then(module => ({ default: module.EditSubsidyModal })))
const DeleteSubsidyModal = lazy(() => import("@/components/modals/project/delete-subsidy-modal").then(module => ({ default: module.DeleteSubsidyModal })))
const DeleteProjectModal = lazy(() => import("@/components/modals/project/delete-project-modal").then(module => ({ default: module.DeleteProjectModal })))
const ProjectExpiredModal = lazy(() => import("@/components/projects/project-expired-modal").then(module => ({ default: module.ProjectExpiredModal })))
const DeleteSubsidyRequestModal = lazy(() => import("@/components/modals/project/delete-subsidy-request-modal").then(module => ({ default: module.DeleteSubsidyRequestModal })))
const AddActivityModal = lazy(() => import("@/components/modals/project/add-activity-modal").then(module => ({ default: module.AddActivityModal })))
const EditActivityModal = lazy(() => import("@/components/modals/project/edit-activity-modal").then(module => ({ default: module.EditActivityModal })))
const DeleteActivityModal = lazy(() => import("@/components/modals/project/delete-activity-modal").then(module => ({ default: module.DeleteActivityModal })))
const UploadReceiptModal = lazy(() => import("@/components/modals/project/upload-receipt-modal").then(module => ({ default: module.UploadReceiptModal })))
const ViewReceiptsModal = lazy(() => import("@/components/modals/project/view-receipts-modal").then(module => ({ default: module.ViewReceiptsModal })))
const CreateReportModal = lazy(() => import("@/components/modals/project/create-report-modal").then(module => ({ default: module.CreateReportModal })))
const RegisterActivityModal = lazy(() => import("@/components/modals/project/register-activity-modal").then(module => ({ default: module.RegisterActivityModal })))
const RequestSubsidyModal = lazy(() => import("@/components/modals/project/request-subsidy-modal").then(module => ({ default: module.RequestSubsidyModal })))
const SelectActivitiesModal = lazy(() => import("@/components/modals/project/select-activities-modal").then(module => ({ default: module.SelectActivitiesModal })))

// Types
import type { ProjectTableData } from "@/components/projects/projects-table"
import type { ProjectActivityData } from "@/components/projects/project-activities-table"
import type { SubsidyRequestCardData } from "@/components/projects/subsidy-request-card"
import type { ActivityData } from "@/components/projects/project-subsidies-table"

interface ProjectModalsWrapperProps {
  // Modal states
  isEditModalOpen: boolean
  isDeleteProjectModalOpen: boolean
  isExpiredModalOpen: boolean
  isEventModalOpen: boolean
  isCommunicationModalOpen: boolean
  isAddSubsidyModalOpen: boolean
  isEditSubsidyModalOpen: boolean
  isDeleteSubsidyModalOpen: boolean
  isDeleteSubsidyRequestModalOpen: boolean
  isAddActivityModalOpen: boolean
  isEditActivityModalOpen: boolean
  isDeleteActivityModalOpen: boolean
  isUploadReceiptModalOpen: boolean
  isViewReceiptsModalOpen: boolean
  isCreateReportModalOpen: boolean
  isRegisterActivityModalOpen: boolean
  isRequestSubsidyModalOpen: boolean
  isSelectActivitiesModalOpen: boolean

  // Modal handlers
  setIsEditModalOpen: (open: boolean) => void
  setIsDeleteProjectModalOpen: (open: boolean) => void
  setIsExpiredModalOpen: (open: boolean) => void
  setIsEventModalOpen: (open: boolean) => void
  setIsCommunicationModalOpen: (open: boolean) => void
  setIsAddSubsidyModalOpen: (open: boolean) => void
  setIsEditSubsidyModalOpen: (open: boolean) => void
  setIsDeleteSubsidyModalOpen: (open: boolean) => void
  setIsDeleteSubsidyRequestModalOpen: (open: boolean) => void
  setIsAddActivityModalOpen: (open: boolean) => void
  setIsEditActivityModalOpen: (open: boolean) => void
  setIsDeleteActivityModalOpen: (open: boolean) => void
  setIsUploadReceiptModalOpen: (open: boolean) => void
  setIsViewReceiptsModalOpen: (open: boolean) => void
  setIsCreateReportModalOpen: (open: boolean) => void
  setIsRegisterActivityModalOpen: (open: boolean) => void
  setIsRequestSubsidyModalOpen: (open: boolean) => void
  setIsSelectActivitiesModalOpen: (open: boolean) => void

  // Data
  project: ProjectTableData | null
  selectedActivities: ProjectActivityData[]
  selectedSubsidyCard: SubsidyRequestCardData | null
  selectedActivity: ActivityData | undefined
  selectedReceipt: any
  allProjectActivities: ProjectActivityData[]
  subsidizedActivityIds: string[]
  institutionUsers: any[]
  projectId: string
  projectData: any
  currentInstitutionData: any
  subsidyRequests: any[]
  projectUsers: any[]

  // Event handlers
  handleProjectUpdateSuccess: () => void
  handleDeleteProjectSuccess: () => void
  handleEventSubmit: (data: any) => void
  handleCommunicationSubmit: (data: any) => void
  handleSubsidySubmit: (data: any) => void
  handleEditSubsidySubmit: (data: any) => void
  handleDeleteSubsidyConfirm: () => void
  handleActivitySubmit: (data: any) => void
  handleEditActivitySubmit: (data: any, assigneeIds?: string[]) => void
  handleReceiptSubmit: (data: any) => void
  handleReportSubmit: (data: any) => void
  handleRegisterActivitySubmit: (data: any) => void
  handleSubsidyRequestSubmit: (data: any) => Promise<string | void>
  handleActivitiesSelected: (activities: ProjectActivityData[]) => void
  handleDeleteSubsidyRequestSuccess: (subsidy: SubsidyRequestCardData) => void
  handleEditReceipt: (receipt: any) => void
  handleDeleteReceipt: (receipt: any) => void

  // State setters
  setSelectedActivities: (activities: ProjectActivityData[]) => void
  setSelectedActivity: (activity: ActivityData | undefined) => void

  // Edit Subsidy Props
  editSubsidyInitialData: any
  requestSubsidyMode: "create" | "edit"

  // Transform functions
  transformActivityToProjectActivity: (activity: ActivityData | undefined) => any
}

const ModalFallback = () => <div className="fixed inset-0 bg-black/20 z-50" />

// ─── Helper ────────────────────────────────────────────────────────────────────

function findAnnualBudget(
  annualBudgets: Array<{ year: number; allocated_amount: string; total_expenses: string }> | undefined,
  year: number,
) {
  return annualBudgets?.find(b => b.year === year) ?? null
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ProjectModalsWrapper(props: ProjectModalsWrapperProps) {
  // ── Derived values for RequestSubsidyModal ─────────────────────────────────
  const _proj        = props.projectData?.project
  const _currentYear = new Date().getFullYear()

  // IDs
  const rsm_institutionId = _proj?.institution_id || props.currentInstitutionData?.id || ""
  const rsm_departmentId  = _proj?.department_id  || _proj?.department?.id
                          || _proj?.church_department_id || _proj?.church_department?.id || ""
  const rsm_churchId      = _proj?.church_id || _proj?.Church?.id || _proj?.department?.church?.id || ""
  const rsm_churchDeptId  = _proj?.church_department?.id || _proj?.church_department_id || ""

  // Display names
  const rsm_institutionName = _proj?.Institution?.name || props.currentInstitutionData?.name || ""
  const rsm_departmentName  = _proj?.department?.name  || _proj?.church_department?.name  || ""
  const rsm_churchName      = _proj?.church?.name  || _proj?.Church?.name  || _proj?.department?.church?.name || ""
  const rsm_churchDeptName  = _proj?.church_department?.name || ""

  // Department annual budget (institutional projects; parsed — GraphQL returns strings)
  const rsm_annualBudget   = findAnnualBudget(_proj?.department?.annual_budgets, _currentYear)
  const rsm_deptAllocated  = parseFloat(rsm_annualBudget?.allocated_amount ?? "0")
  const rsm_deptUsed       = parseFloat(rsm_annualBudget?.total_expenses   ?? "0")
  const rsm_deptBudgetYear = rsm_annualBudget ? _currentYear : undefined

  // Available subsidy balance (excludes rejected requests & the item being edited)
  const rsm_subsidizedBudget = _proj?.kpis?.subsidizedBudget || Number(_proj?.subsidized_budget || 0)
  const rsm_totalRequested   = props.subsidyRequests?.reduce((sum, req) => {
    if (req.status === "rejected") return sum
    if (props.requestSubsidyMode === "edit" && req.id === props.selectedSubsidyCard?.id) return sum
    return sum + req.requested_amount
  }, 0) ?? 0
  const rsm_availableBudget  = Math.max(0, rsm_subsidizedBudget - rsm_totalRequested)

  return (
    <>
      {/* Edit Project Modal */}
      {props.isEditModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <EditProjectModal
            isOpen={props.isEditModalOpen}
            onClose={() => props.setIsEditModalOpen(false)}
            onSuccess={props.handleProjectUpdateSuccess}
            project={props.project || undefined}
          />
        </Suspense>
      )}

      {/* Delete Project Modal */}
      {props.isDeleteProjectModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <DeleteProjectModal
            isOpen={props.isDeleteProjectModalOpen}
            onClose={() => props.setIsDeleteProjectModalOpen(false)}
            onConfirm={props.handleDeleteProjectSuccess}
            project={props.project ? {
              ...props.project,
              activities: props.allProjectActivities.length,
              subsidyRequests: props.subsidyRequests?.length || 0,
              volunteers: props.projectUsers?.length || 0,
              documents: 0, // TODO: Adicionar contagem de documentos quando disponível
              // KPIs adicionais
              kpis: props.projectData?.project?.kpis ? {
                totalActivities: props.projectData.project.kpis.totalActivities,
                completedActivities: props.projectData.project.kpis.completedActivities,
                subsidizedActivities: props.projectData.project.kpis.subsidizedActivities,
                projectBudget: props.projectData.project.kpis.projectBudget,
                subsidizedBudget: props.projectData.project.kpis.subsidizedBudget,
                subsidyRequestsCount: props.projectData.project.kpis.subsidyRequestsCount,
                completionRate: props.projectData.project.kpis.completionRate
              } : undefined
            } : null}
          />
        </Suspense>
      )}

      {/* Project Expired Modal */}
      {props.isExpiredModalOpen && props.project && (
        <Suspense fallback={<ModalFallback />}>
          <ProjectExpiredModal
            isOpen={props.isExpiredModalOpen}
            onClose={() => props.setIsExpiredModalOpen(false)}
            projectTitle={props.project?.title || ""}
            endDate={props.project?.end_at || ""}
            onExtendDate={() => {
              props.setIsExpiredModalOpen(false)
              props.setIsEditModalOpen(true)
            }}
          />
        </Suspense>
      )}

      {/* Create Event Modal */}
      {props.isEventModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <CreateEventModal
            isOpen={props.isEventModalOpen}
            onClose={() => props.setIsEventModalOpen(false)}
            onSubmit={props.handleEventSubmit}
            project={props.project || undefined}
          />
        </Suspense>
      )}

      {/* Create Communication Modal */}
      {props.isCommunicationModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <CreateCommunicationModal
            isOpen={props.isCommunicationModalOpen}
            onClose={() => props.setIsCommunicationModalOpen(false)}
            onSubmit={props.handleCommunicationSubmit}
            project={props.project || undefined}
          />
        </Suspense>
      )}

      {/* Register Activity Modal */}
      {props.isRegisterActivityModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <RegisterActivityModal
            isOpen={props.isRegisterActivityModalOpen}
            onClose={() => props.setIsRegisterActivityModalOpen(false)}
            onSubmit={props.handleRegisterActivitySubmit}
            projectId={props.projectId}
            availableUsers={props.institutionUsers}
          />
        </Suspense>
      )}

      {/* Request Subsidy Modal */}
      {props.isRequestSubsidyModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <RequestSubsidyModal
            isOpen={props.isRequestSubsidyModalOpen}
            onClose={() => {
              props.setIsRequestSubsidyModalOpen(false)
              props.setSelectedActivities([])
            }}
            // ── Identity
            projectId={props.projectId}
            institutionId={rsm_institutionId}
            departmentId={rsm_departmentId}
            churchId={rsm_churchId}
            churchDepartmentId={rsm_churchDeptId}
            // ── Display names
            institutionName={rsm_institutionName}
            departmentName={rsm_departmentName}
            churchName={rsm_churchName}
            churchDepartmentName={rsm_churchDeptName}
            // ── Department annual budget
            departmentAllocatedBudget={rsm_deptAllocated}
            departmentBudgetUsed={rsm_deptUsed}
            departmentBudgetYear={rsm_deptBudgetYear}
            // ── Activities & subsidies
            selectedActivities={props.selectedActivities}
            allActivities={props.allProjectActivities}
            subsidizedActivityIds={props.subsidizedActivityIds}
            subsidizedBudget={rsm_subsidizedBudget}
            availableBudget={rsm_availableBudget}
            totalAlreadyRequested={rsm_totalRequested}
            // ── Modal mode
            mode={props.requestSubsidyMode}
            initialData={props.editSubsidyInitialData}
            subsidyRequestId={props.requestSubsidyMode === "edit" ? props.selectedSubsidyCard?.id : undefined}
            // ── Callbacks
            onSubmit={props.handleSubsidyRequestSubmit}
          />
        </Suspense>
      )}

      {/* Edit Subsidy Modal */}
      {props.isEditSubsidyModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <EditSubsidyModal
            isOpen={props.isEditSubsidyModalOpen}
            onClose={() => props.setIsEditSubsidyModalOpen(false)}
            onSubmit={props.handleEditSubsidySubmit}
            subsidy={props.selectedSubsidyCard as any}
          />
        </Suspense>
      )}

      {/* Delete Subsidy Request Modal */}
      {props.isDeleteSubsidyRequestModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <DeleteSubsidyRequestModal
            isOpen={props.isDeleteSubsidyRequestModalOpen}
            onOpenChangeAction={props.setIsDeleteSubsidyRequestModalOpen}
            subsidy={props.selectedSubsidyCard}
            onSuccess={props.handleDeleteSubsidyRequestSuccess}
          />
        </Suspense>
      )}

      {/* Select Activities Modal */}
      {props.isSelectActivitiesModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <SelectActivitiesModal
            isOpen={props.isSelectActivitiesModalOpen}
            onClose={() => props.setIsSelectActivitiesModalOpen(false)}
            activities={props.allProjectActivities}
            onConfirm={props.handleActivitiesSelected}
            title="Selecionar Atividades para Subsídio"
            description="Selecione as atividades subsidiadas que deseja incluir na solicitação de subsídio."
            filterSubsidized={true}
            subsidizedActivityIds={props.subsidizedActivityIds}
          />
        </Suspense>
      )}

      {/* Edit Activity Modal */}
      {props.isEditActivityModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <EditActivityModal
            isOpen={props.isEditActivityModalOpen}
            onClose={() => {
              props.setIsEditActivityModalOpen(false)
              props.setSelectedActivity(undefined)
            }}
            onSubmit={props.handleEditActivitySubmit}
            activity={props.selectedActivity}
          />
        </Suspense>
      )}

      {/* Delete Activity Modal */}
      {props.isDeleteActivityModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <DeleteActivityModal
            isOpen={props.isDeleteActivityModalOpen}
            onOpenChangeAction={(open) => {
              props.setIsDeleteActivityModalOpen(open)
              if (!open) props.setSelectedActivity(undefined)
            }}
            activity={props.transformActivityToProjectActivity(props.selectedActivity)}
          />
        </Suspense>
      )}

      {/* Create Report Modal */}
      {props.isCreateReportModalOpen && (
        <Suspense fallback={<ModalFallback />}>
          <CreateReportModal
            isOpen={props.isCreateReportModalOpen}
            onClose={() => props.setIsCreateReportModalOpen(false)}
            onSubmit={props.handleReportSubmit}
            project={props.project || undefined}
          />
        </Suspense>
      )}
    </>
  )
}