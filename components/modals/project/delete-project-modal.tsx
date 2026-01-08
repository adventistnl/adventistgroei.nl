"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import { 
  Trash2,
  AlertTriangle,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Users,
  FileText,
  Database,
  DollarSign
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
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
      toast.success(t.toasts.projectDeleted, {
        duration: 3000,
        icon: '🗑️'
      })
      
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

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === confirmationText.toLowerCase()

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
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
              {/* Ícone */}
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
                <FolderOpen className="w-6 h-6 text-muted-foreground" />
              </div>
              
              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">{t.budget.annualBudget}:</span>
                  <Badge variant="outline" className="text-xs">
                    {formatCurrency(project.budget)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Affected Components */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground text-center">
                {t.deleteProjectAffectedComponents || "Componentes Afetados"}
              </h4>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{t.deleteProjectActivities || "Atividades"}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>{t.deleteProjectSubsidies || "Subsídios"}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{t.deleteProjectVolunteers || "Voluntários"}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Database className="w-4 h-4" />
                  <span>{t.deleteProjectDocuments || "Documentos"}: <strong className="text-foreground">0</strong></span>
                </div>
              </div>
            </div>

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    {t.deleteProjectViewConsequences || "Ver Consequências"}
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Data Deletion Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Trash2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.deleteProjectConsequence1 || "Todas as atividades serão removidas"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConsequence1Desc || "Todas as atividades associadas ao projeto serão permanentemente deletadas."}
                    </p>
                  </div>
                </div>

                {/* Subsidy Impact Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.deleteProjectConsequence2 || "Subsídios serão removidos"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConsequence2Desc || "Todos os pedidos de subsídio associados ao projeto serão removidos."}
                    </p>
                  </div>
                </div>

                {/* Volunteer Unlinking Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.deleteProjectConsequence3 || "Voluntários serão desvinculados"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConsequence3Desc || "Todos os voluntários vinculados ao projeto perderão acesso."}
                    </p>
                  </div>
                </div>

                {/* Document Deletion Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.deleteProjectConsequence4 || "Documentos serão deletados"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.deleteProjectConsequence4Desc || "Todos os documentos associados ao projeto serão permanentemente removidos."}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Confirmation Checkbox */}
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
                    {t.deleteProjectUnderstand}
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
                  <label className="text-sm font-medium text-gray-700">
                    {t.deleteProjectTypeConfirm}
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t.deleteProjectConfirmHelp || `Digite "delete project" para confirmar`}
                  </p>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder={t.deleteProjectTypeConfirm}
                    className="h-10"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} size="sm" className="text-xs">
              {t.cancel}
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
                  {t.deleteProjectButton}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
