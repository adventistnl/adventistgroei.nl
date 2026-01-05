"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import { 
  Trash2,
  AlertTriangle,
  FolderOpen
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { projectTranslations } from "@/lib/translations/projects"
import { DELETE_PROJECT_MUTATION } from "@/graphql/mutations/PROJECT_MUTATIONS"
import { GET_PROJECTS_QUERY, GET_PROJECT_KPIS_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
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
  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
  const [understoodConsequences, setUnderstoodConsequences] = React.useState(false)
  const [finalConfirmation, setFinalConfirmation] = React.useState('')

  const [deleteProject] = useMutation(DELETE_PROJECT_MUTATION, {
    refetchQueries: [
      { query: GET_PROJECTS_QUERY },
      { query: GET_PROJECT_KPIS_QUERY }
    ],
    awaitRefetchQueries: true
  })

  const handleConfirm = async () => {
    if (!project) return

    const loadingToast = toast.loading(`${t.toasts.projectDeleted.replace('successfully!', '...')}`)
    
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
    }
  }

  const handleClose = () => {
    setUnderstoodConsequences(false)
    setFinalConfirmation('')
    onClose()
  }

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
    }
  }, [isOpen, project?.id])

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === 'delete'

  if (!project) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            {t.deleteProjectConfirmTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>{t.deleteProjectConfirmDesc}</p>
            
            {/* Project Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FolderOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">{t.budget.annualBudget}</span>
                  <Badge variant="outline">
                    {formatCurrency(project.budget)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  {t.deleteProjectWarning}
                </span>
              </div>
            </div>

            {/* Two-step verification */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="understand-consequences"
                  checked={understoodConsequences}
                  onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                  className="mt-0.5 border-gray-400 data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600 flex-shrink-0"
                />
                <label htmlFor="understand-consequences" className="text-sm cursor-pointer flex-1">
                  <span className="font-medium text-gray-900">
                    {t.deleteProjectUnderstand}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Type <span className="font-mono bg-gray-100 px-1 rounded">delete</span> to confirm
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder={t.deleteProjectTypeConfirm}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>
            {t.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isDeleteEnabled}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t.deleteProjectButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
