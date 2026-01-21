"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { 
  Trash2,
  Layers, 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle,
  Database,
  Lock,
  FileText
} from "lucide-react"
import toast from "react-hot-toast"
import { FundingPolicyGroup, FundingPolicyValidation } from "./create-funding-policy-group-modal"

export interface DeleteFundingPolicyGroupModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  group: FundingPolicyGroup | null
  validations?: FundingPolicyValidation[]
  usageCount?: number // Number of items using this group
  onSuccess?: (deletedGroup: FundingPolicyGroup) => void
}

export function DeleteFundingPolicyGroupModal({
  isOpen,
  onOpenChange,
  group,
  validations = [],
  usageCount = 0,
  onSuccess
}: DeleteFundingPolicyGroupModalProps) {
  const { t } = useTranslation()
  
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  useEffect(() => {
    if (isOpen) {
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    setIsLoading(true)
    const loadingToast = toast.loading('Deleting funding policy group...')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast.dismiss(loadingToast)
      toast.success('Funding policy group deleted successfully!', {
        duration: 3000,
        icon: '🗑️'
      })

      if (onSuccess && group) {
        onSuccess(group)
      }

      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Failed to delete funding policy group')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
      onOpenChange(false)
    }
  }

  const isDeleteEnabled = understoodConsequences && 
    finalConfirmation.toLowerCase() === 'delete group' && 
    !isLoading

  if (!group) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
            Delete Funding Policy Group
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This action will permanently delete this funding policy group and all its validation fields
          </DialogDescription>
        </DialogHeader>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            
            {/* Group Information */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
                <Layers className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {group.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {group.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={group.is_active ? "default" : "secondary"} className="text-xs">
                    {group.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {validations.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {validations.length} validation fields
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Usage Warning */}
            {usageCount > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      This group is currently in use
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {usageCount} {usageCount === 1 ? 'item is' : 'items are'} using this funding policy group. 
                      Deleting it will remove the policy from these items.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Affected Components */}
            {validations.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground text-center">
                  Affected Components
                </h4>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Validation Fields: <strong className="text-foreground">{validations.length}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    View Consequences
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Validation Fields Consequence */}
                {validations.length > 0 && (
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground">Validation Fields</p>
                      <p className="text-xs text-muted-foreground">
                        All {validations.length} validation field{validations.length !== 1 ? 's' : ''} will be permanently deleted
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Data Loss Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">Data Loss</p>
                    <p className="text-xs text-muted-foreground">
                      All historical data and configurations related to this group will be lost
                    </p>
                  </div>
                </div>
                
                {/* Usage Impact */}
                {usageCount > 0 && (
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground">Active Usage Impact</p>
                      <p className="text-xs text-muted-foreground">
                        {usageCount} item{usageCount !== 1 ? 's' : ''} will lose their funding policy validation
                      </p>
                    </div>
                  </div>
                )}

                {/* Permanent Deletion */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">Permanent Deletion</p>
                    <p className="text-xs text-muted-foreground">
                      This action cannot be undone. The group and all related data will be permanently removed
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
                    I understand the consequences
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    This action will permanently delete this funding policy group
                    {validations.length > 0 && ` and ${validations.length} validation field${validations.length !== 1 ? 's' : ''}`}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Type "delete group" to confirm
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder="delete group"
                    className="h-10"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Type exactly "delete group" (case insensitive)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Footer Actions */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading} 
              size="sm" 
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isDeleteEnabled}
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
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete Group
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
