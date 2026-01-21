"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import { 
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Database,
  Layers,
  Lock,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { StatusBadge } from "@/components/ui/status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { projectTranslations } from "@/lib/translations/projects"
import { useCurrency } from "@/contexts/currency-context"
import { DELETE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { GET_PROJECTS_QUERY, GET_PROJECT_KPIS_QUERY, GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import toast from "react-hot-toast"

// Project Data interface
interface ProjectData {
  id: string
  title: string
  description: string
  budget: number
  status?: string
  activities?: number
  subsidyRequests?: number
  volunteers?: number
  documents?: number
  // KPIs adicionais
  kpis?: {
    totalActivities: number
    completedActivities: number
    subsidizedActivities: number
    projectBudget: number
    subsidizedBudget: number
    subsidyRequestsCount: number
    completionRate: number
  }
}

export interface DeleteProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  project?: ProjectData | null
}

export function DeleteProjectModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  project 
}: DeleteProjectModalProps) {
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [understoodConsequences, setUnderstoodConsequences] = React.useState(false)
  const [finalConfirmation, setFinalConfirmation] = React.useState('')
  const [consequencesOpen, setConsequencesOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const confirmationText = 'delete project'

  // Validation rules for project deletion
  const canDelete = React.useMemo(() => {
    if (!project) return false
    
    const checks = {
      isDraft: project.status === 'DRAFT',
      noActiveSubsidies: (project.kpis?.subsidyRequestsCount || project.subsidyRequests || 0) === 0,
      allActivitiesCompleted: project.kpis 
        ? project.kpis.totalActivities === 0 || project.kpis.completedActivities === project.kpis.totalActivities
        : true
    }

    return checks.isDraft && checks.noActiveSubsidies && checks.allActivitiesCompleted
  }, [project])

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECTS_QUERY },
      { query: GET_PROJECT_KPIS_QUERY },
      ...(project?.id ? [{ query: GET_PROJECT_BY_ID_QUERY, variables: { id: project.id } }] : [])
    ],
    awaitRefetchQueries: true
  })

  const handleConfirm = async () => {
    if (!project) return

    setIsLoading(true)
    const loadingToast = toast.loading(t.toasts.projectDeleting)
    
    try {
      await deleteProject({
        variables: { id: project.id }
      })

      toast.dismiss(loadingToast)
      
      if (onConfirm) {
        onConfirm()
      }
      onClose()
      
      // Reset state
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
    } catch (error: any) {
      console.error("Error deleting project:", error)
      toast.dismiss(loadingToast)
      
      // Apollo can return errors in different ways
      // 1. graphQLErrors - when GraphQL returns errors in response
      // 2. networkError - when there's an HTTP error (like 400)
      
      let graphQLError = error?.graphQLErrors?.[0]
      
      // If no graphQLErrors, check networkError.result.errors
      if (!graphQLError && error?.networkError?.result?.errors) {
        graphQLError = error.networkError.result.errors[0]
      }
      
      const extensions = graphQLError?.extensions
      const errorCode = extensions?.context?.additional?.errorCode
      
      let errorMessage = t.errors?.genericDeleteError || 'Failed to delete project'
      
      if (errorCode === 'PROJECT_HAS_APPROVED_SUBSIDIES') {
        errorMessage = t.errors?.cannotDeleteProjectWithApprovedSubsidies || graphQLError?.message
      } else if (graphQLError?.message) {
        errorMessage = graphQLError.message
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, {
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
      onClose()
    }
  }

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
    }
  }, [isOpen, project?.id])

  const isDeleteEnabled = canDelete && understoodConsequences && finalConfirmation.toLowerCase() === confirmationText.toLowerCase() && !isLoading

  if (!project) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
            {t.deleteProjectConfirmTitle}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.deleteProjectConfirmDesc}
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">

            {/* Project Information */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatCurrency(project.budget)}
                  </p>
                </div>
                <StatusBadge 
                  label={project.status || 'N/A'} 
                  variant={project.status === 'DRAFT' ? 'neutral' : project.status === 'ACTIVE' ? 'success' : 'warning'}
                  size="sm"
                />
              </div>
            </div>

            {/* Validation Requirements */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                {t.deleteProjectValidationTitle || "Deletion Requirements"}
              </h4>
              
              <div className="grid grid-cols-1 gap-2">
                {/* Atividades */}
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  project.kpis && project.kpis.totalActivities > 0 && project.kpis.completedActivities === project.kpis.totalActivities
                    ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800'
                    : project.kpis && project.kpis.totalActivities > 0
                    ? 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800'
                    : 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800'
                }`}>
                  <div className="flex items-center gap-2 flex-1">
                    <Layers className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {t.deleteProjectActivities || "Atividades"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.kpis && project.kpis.totalActivities > 0 
                          ? `${project.kpis.completedActivities}/${project.kpis.totalActivities} ${t.deleteProjectActivitiesCompleted || "completed"}`
                          : t.deleteProjectNoActivities || "No activities"
                        }
                      </p>
                    </div>
                  </div>
                  {project.kpis && project.kpis.totalActivities > 0 && project.kpis.completedActivities === project.kpis.totalActivities ? (
                    <div className="text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : project.kpis && project.kpis.totalActivities > 0 ? (
                    <div className="text-red-600 dark:text-red-400">
                      <XCircle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Subsídios */}
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  (project.kpis?.subsidyRequestsCount || project.subsidyRequests || 0) === 0
                    ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800'
                    : 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2 flex-1">
                    <Database className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {t.deleteProjectSubsidies || "Subsídios"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(project.kpis?.subsidyRequestsCount || project.subsidyRequests || 0) === 0
                          ? t.deleteProjectNoSubsidies || "No subsidies"
                          : `${project.kpis?.subsidyRequestsCount || project.subsidyRequests} ${t.deleteProjectActiveSubsidies || "active"}`
                        }
                      </p>
                    </div>
                  </div>
                  {(project.kpis?.subsidyRequestsCount || project.subsidyRequests || 0) === 0 ? (
                    <div className="text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="text-red-600 dark:text-red-400">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className={`flex items-center justify-between p-3 rounded-lg border ${
                  project.status === 'DRAFT'
                    ? 'bg-green-50/50 dark:bg-green-950/10 border-green-200 dark:border-green-800'
                    : 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center gap-2 flex-1">
                    <Lock className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {t.deleteProjectStatusLabel || "Project Status"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.status || 'N/A'}
                        {project.status !== 'DRAFT' && ` ${t.deleteProjectMustBeDraft || "(must be DRAFT)"}`}
                      </p>
                    </div>
                  </div>
                  {project.status === 'DRAFT' ? (
                    <div className="text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="text-red-600 dark:text-red-400">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Validation Warning */}
            {!canDelete && (
              <div className="flex items-start gap-2 p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">{t.deleteProjectCannotDelete || "Cannot delete this project"}</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {t.deleteProjectFixIssues || "Fix the issues marked above before proceeding."}
                  </p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {canDelete && (project.documents || 0) > 0 && (
              <div className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{project.documents}</span> {t.deleteProjectDocumentsWillBeDeleted || "document(s) will be permanently deleted"}
                  </p>
                </div>
              </div>
            )}

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    {t.deleteProjectViewConsequences || "Ver consequências da deleção"}
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Activities Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Layers className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.deleteProjectConsequence1 || "Todas as atividades serão removidas"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConsequence1Desc || "Todas as atividades associadas ao projeto serão permanentemente deletadas."}
                    </p>
                    {project.kpis && project.kpis.totalActivities > 0 && (
                      <p className="text-xs font-medium text-foreground mt-1">
                        Total: {project.kpis.totalActivities} atividade(s) ({project.kpis.completionRate}% concluídas)
                      </p>
                    )}
                  </div>
                </div>

                {/* Subsidies Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.deleteProjectConsequence2 || "Subsídios serão removidos"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConsequence2Desc || "Todas as solicitações de subsídio associadas ao projeto serão removidas."}
                    </p>
                    {project.kpis && (project.kpis.subsidyRequestsCount || 0) > 0 && (
                      <p className="text-xs font-medium text-foreground mt-1">
                        Total: {project.kpis.subsidyRequestsCount} subsídio(s) - {formatCurrency(project.kpis.subsidizedBudget || 0)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Documents Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.deleteProjectConsequence4 || "Documentos serão deletados"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConsequence4Desc || "Todos os documentos associados ao projeto serão permanentemente removidos."}
                    </p>
                    {(project.documents || 0) > 0 && (
                      <p className="text-xs font-medium text-foreground mt-1">
                        Total: {project.documents} documento(s) anexado(s)
                      </p>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Confirmation Checkbox - Only show if validation passes */}
            {canDelete && (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-950">
                  <Checkbox
                    id="understand-consequences"
                    checked={understoodConsequences}
                    onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                    className="mt-0.5 border-2 border-gray-400 dark:border-gray-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                  />
                  <label htmlFor="understand-consequences" className="text-sm cursor-pointer">
                    <span className="font-medium text-foreground">
                      {t.deleteProjectUnderstand || "Compreendo que esta ação é permanente"}
                    </span>
                    <br />
                    <span className="text-muted-foreground">
                      {t.deleteProjectAcknowledge || "Eu entendo que esta ação não pode ser desfeita e todos os dados serão permanentemente removidos."}
                    </span>
                  </label>
                </div>

                {/* Final Confirmation Input */}
                {understoodConsequences && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t.deleteProjectTypeConfirm || "Digite 'delete project' para confirmar"}
                    </label>
                    <Input
                      type="text"
                      value={finalConfirmation}
                      onChange={(e) => setFinalConfirmation(e.target.value)}
                      placeholder="delete project"
                      className="h-10"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConfirmHelp || "Digite exatamente \"delete project\" para confirmar"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading} 
              size="sm" 
              className="text-xs"
            >
              {t.common?.cancel || "Cancel"}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || !isDeleteEnabled}
              size="sm"
              className={`min-w-[140px] text-xs ${
                isDeleteEnabled
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-600/40 text-white/60 cursor-not-allowed hover:bg-red-600/40'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  {t.deleteProjectDeleting || "Excluindo..."}
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  {t.deleteProjectButton || "Delete Permanently"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
