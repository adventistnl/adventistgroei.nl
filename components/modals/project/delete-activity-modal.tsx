"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@apollo/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle, Activity } from "lucide-react"
import { DELETE_PROJECT_ACTIVITY } from "@/graphql/mutations/PROJECT_ACTIVITY_MUTATIONS"
import { GET_PROJECT_BY_ID_QUERY } from "@/graphql/queries/PROJECTS_QUERY"
import { ActivityTags } from "@/types/graphql-global-types"
import { projectTranslations } from "@/lib/translations/projects"
import { useCurrency } from "@/contexts/currency-context"
import toast from "react-hot-toast"
import { WithPermission } from "@/hocs/with-permission"
import { PermissionResolverName } from "@/types/graphql-global-types"

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
  deadline: string
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
  const { i18n } = useTranslation()
  const { formatCurrency } = useCurrency()
  const [isLoading, setIsLoading] = useState(false)
  const [understood, setUnderstood] = useState(false)

  const t = projectTranslations[i18n.language as keyof typeof projectTranslations] || projectTranslations.en

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
    const loadingToast = toast.loading(t.deleteActivity.deleting)
    try {
      await deleteActivity({
        variables: { id: activity.id }
      })

      toast.dismiss(loadingToast)
      toast.success(t.toasts?.activityDeleted || "Activity deleted successfully!", {
        duration: 3000,
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
      
      let errorMessage = t.errors?.genericDeleteError || 'Failed to delete activity'
      
      if (errorCode === 'ACTIVITY_HAS_APPROVED_SUBSIDIES') {
        errorMessage = t.errors?.cannotDeleteActivityWithApprovedSubsidies || graphQLError?.message
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
      setUnderstood(false)
      onOpenChangeAction(false)
    }
  }

  // Reset state when modal opens with new activity
  React.useEffect(() => {
    if (isOpen) {
      setUnderstood(false)
    }
  }, [isOpen, activity?.id])

  if (!activity) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.deleteActivity.title}</DialogTitle>
          <DialogDescription>
            {t.deleteActivity.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Activity Info */}
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{activity.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t.activitiesTable.budget}: {formatCurrency(activity.budget_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-semibold text-red-800 dark:text-red-300">{t.deleteActivity.warning}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {t.deleteActivity.warningDescription}
              </p>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex mt-4 rounded-lg items-start gap-3 p-4 border-2 border-gray-400 dark:border-gray-500 ">
            <Checkbox
              id="understand"
              checked={understood}
              onCheckedChange={(checked) => setUnderstood(checked === true)}
              className="mt-0.5 border-2 border-gray-400 dark:border-gray-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
            />
            <label htmlFor="understand" className="text-sm cursor-pointer flex-1">
              <span className="font-medium">{t.deleteActivity.understand}</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {t.common?.cancel || "Cancel"}
            </Button>
            <WithPermission requiredPermissions={[PermissionResolverName.DeleteProjectActivity]}>
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={isLoading || !understood}
                className="w-full bg-red-600 hover:bg-red-700 text-white sm:w-auto"
              >
                {isLoading ? t.deleteActivity.deleting : t.deleteActivity.deleteButton}
              </Button>
            </WithPermission>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
