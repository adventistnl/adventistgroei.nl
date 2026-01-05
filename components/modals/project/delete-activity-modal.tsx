"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  Activity
} from "lucide-react"
import { DELETE_PROJECT_ACTIVITY } from "@/graphql/mutations/PROJECT_ACTIVITY_MUTATIONS"
import { GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { ActivityTags } from "@/types/graphql-global-types"
import { projectTranslations } from "@/lib/translations/projects"

import toast from "react-hot-toast"

// Project Activity Data interface
interface ProjectActivityData {
  id: string
  project_id: string
  name: string
  description: string
  tags?: ActivityTags[]
  budget_amount: number
  status: string
  priority: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string | null
  deleted_by?: string | null
  is_subsidized: boolean
  subsidy_amount?: number
  spent_amount?: number
}

export interface DeleteActivityModalProps {
  isOpen: boolean
  onOpenChangeAction: (open: boolean) => void
  activity: ProjectActivityData | null
  onSuccess?: (deletedActivity: ProjectActivityData) => void
}

export function DeleteActivityModal({
  isOpen,
  onOpenChangeAction,
  activity,
  onSuccess
}: DeleteActivityModalProps) {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const [deleteActivity] = useMutation(DELETE_PROJECT_ACTIVITY, {
    refetchQueries: [
      {
        query: GET_PROJECT_BY_ID_QUERY,
        variables: { id: activity?.project_id }
      }
    ],
    awaitRefetchQueries: true
  })

  const handleSubmit = async () => {
    if (!activity) return
    setIsLoading(true)
    const loadingToast = toast.loading(t('activities.toasts.deleting'))
    try {
      await deleteActivity({
        variables: { id: activity.id }
      })

      toast.dismiss(loadingToast)
      toast.success(t('activities.toasts.deleted'), {
        duration: 3000,
        icon: '🗑️'
      })
      if (onSuccess) {
        onSuccess(activity)
      }
      onOpenChangeAction(false)
    } catch (error: any) {
      console.error("Error deleting activity:", error)
      toast.dismiss(loadingToast)
      
      // Apollo can return errors in different ways
      let graphQLError = error?.graphQLErrors?.[0]
      if (!graphQLError && error?.networkError?.result?.errors) {
        graphQLError = error.networkError.result.errors[0]
      }
      
      const extensions = graphQLError?.extensions
      const errorCode = extensions?.context?.additional?.errorCode
      
      const t_project = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en
      let errorMessage = t_project.errors?.genericDeleteError || 'Failed to delete activity'
      
      if (errorCode === 'ACTIVITY_HAS_APPROVED_SUBSIDIES') {
        errorMessage = t_project.errors?.cannotDeleteActivityWithApprovedSubsidies || graphQLError?.message
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
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
      onOpenChangeAction(false)
    }
  }

  // Reset state when modal opens with new activity
  React.useEffect(() => {
    if (isOpen) {
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
    }
  }, [isOpen, activity?.id])

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === t('activities.modal.delete.confirmation_text').toLowerCase()

  const getActivityTagIcon = () => {
    return <Activity className="w-4 h-4 text-gray-600" />
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (!activity) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[70vh] max-h-[90vh] overflow-y-auto overflow-x-hidden p-6">
        <div className="w-full max-w-full">
          <DialogHeader className="space-y-3 pb-4 px-0">
            <DialogTitle className="text-gray-900 break-words pr-8">
              {t('activities.modal.delete.title')}
            </DialogTitle>
            <DialogDescription className="text-gray-600 break-words pr-8">
              {t('activities.modal.delete.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 w-full max-w-full">
            {/* Activity Information - Simple */}
            <div className="p-4 border rounded-lg bg-gray-50 w-full max-w-full">
              <div className="flex items-center gap-3 min-w-0 max-w-full">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getActivityTagIcon()}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden max-w-full">
                  <h4 className="font-medium text-base truncate max-w-full">{activity.name}</h4>
                  <p className="text-sm text-gray-600 truncate max-w-full">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1 break-words max-w-full">
                    {t('activities.budget')}: {formatCurrency(activity.budget_amount)}
                  </p>
                </div>
              </div>
            </div>

            {/* Simple Warning */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg w-full max-w-full">
              <div className="flex items-start gap-3 min-w-0 max-w-full">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1 overflow-hidden max-w-full">
                  <p className="text-sm font-medium text-red-600 break-words max-w-full">
                    {t('activities.modal.delete.permanent_warning.title')}
                  </p>
                  <p className="text-sm text-red-700 mt-1 break-words max-w-full">
                    {t('activities.modal.delete.permanent_warning.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Confirmation */}
            <div className="space-y-4 w-full max-w-full">
              <div className="flex items-start gap-3 min-w-0 max-w-full">
                <Checkbox
                  id="understand-consequences"
                  checked={understoodConsequences}
                  onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                  className="mt-0.5 border-gray-400 data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600 flex-shrink-0"
                />
                <label htmlFor="understand-consequences" className="text-sm cursor-pointer min-w-0 flex-1 max-w-full">
                  <span className="font-medium text-gray-900 break-words max-w-full inline-block">
                    {t('activities.modal.delete.understand_consequences')}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2 w-full max-w-full">
                  <label className="text-sm font-medium text-gray-700 break-words max-w-full inline-block">
                    {t('activities.modal.delete.type_confirmation')}
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder={t('activities.modal.delete.confirmation_placeholder')}
                    className="w-full min-w-0 max-w-full"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 break-words max-w-full">
                    {t('activities.modal.delete.confirmation_help')}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 mt-6 border-t border-gray-200 w-full max-w-full">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                disabled={isLoading}
                className="w-full sm:w-auto sm:min-w-[100px] whitespace-nowrap text-sm"
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={isLoading || !isDeleteEnabled}
                className="w-full sm:w-auto sm:min-w-[140px] whitespace-nowrap text-sm"
              >
                {isLoading ? t('activities.modal.delete.deleting') : t('activities.modal.delete.delete_activity')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
