"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Shield, 
  AlertTriangle, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Lock,
  Users,
  Crown
} from "lucide-react"
import { useRoles } from "@/hooks/use-roles"
import toast from "react-hot-toast"
import { User } from "@/data/accessData"
import { Role_role } from "@/types/Role"

export interface DeleteRoleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  role: Role_role | null
  users?: User[]
  availableRoles?: Role_role[]
  onSuccess?: (deletedRole: Role_role, reassignmentRoleId?: string) => void
}

export function DeleteRoleModal({ 
  isOpen, 
  onOpenChange, 
  role, 
  users = [],
  availableRoles = [],
  onSuccess
}: DeleteRoleModalProps) {
  const { t } = useTranslation()
  const { deleteRole, deleteRoleLoading } = useRoles()
  const [deleteStep, setDeleteStep] = useState<DeleteStep>('confirm')
  const [reassignmentRole, setReassignmentRole] = useState<string>('')
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && role) {
      setReassignmentRole('')
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
    }
  }, [role, isOpen])

  const handleSubmit = async () => {
    if (!role) return
    
    // Check if there are users with this role and reassignment role is needed
    if (usersWithRole.length > 0 && !reassignmentRole) {
      toast.error("Please select a role to reassign users to")
      return
    }
    
    const loadingToast = toast.loading(t('access.toasts.deleting_role'))
    try {
      await deleteRole({ id: role.id })
      toast.dismiss(loadingToast)
      toast.success(t('access.toasts.role_deleted'), {
        duration: 3000,
        icon: '🗑️'
      })
      if (onSuccess) {
        onSuccess(role, reassignmentRole || undefined)
      }
      handleClose()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('access.toasts.role_delete_failed'))
    }
  }

  const handleClose = () => {
    if (!deleteRoleLoading) {
      setReassignmentRole('')
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setFinalConfirmation('')
      onOpenChange(false)
    }
  }

  if (!role) return null

  const usersWithRole = users.filter(u => 
    u.user_roles.some(r => r.id === role.id)
  )

  const filteredAvailableRoles = availableRoles.filter(r => r.id !== role.id)
  
  const hasUsersAssigned = usersWithRole.length > 0
  const isDeleteEnabled = understoodConsequences && 
    finalConfirmation.toLowerCase() === 'delete role' && 
    (!hasUsersAssigned || reassignmentRole) &&
    !deleteRoleLoading

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
            {t('access.modals.delete_role.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('access.modals.delete_role.description')}
          </DialogDescription>
        </DialogHeader>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            
            {/* Role Information */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
                <Shield className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {role.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {role.key_code}
                </p>
              </div>
            </div>

            {/* Affected Components */}
            {hasUsersAssigned && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground text-center">
                  Affected Users
                </h4>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Users: <strong className="text-foreground">{usersWithRole.length}</strong>
                  </span>
                </div>

                {/* Reassignment Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t('access.modals.delete_role.reassign_to')}
                  </Label>
                  <Select 
                    value={reassignmentRole} 
                    onValueChange={setReassignmentRole} 
                    disabled={deleteRoleLoading}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={t('access.modals.delete_role.select_role')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredAvailableRoles.map((availableRole) => (
                        <SelectItem key={availableRole.id} value={availableRole.id}>
                          <div className="flex items-center gap-2">
                            {availableRole.key_code === 'ADMIN' ? (
                              <Crown className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                            <span>{availableRole.name}</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              ({availableRole.key_code})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                {/* User Access Consequence */}
                {hasUsersAssigned && (
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground">User Reassignment</p>
                      <p className="text-xs text-muted-foreground">
                        All users with this role will be reassigned to the selected role
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Permissions Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">Permission Changes</p>
                    <p className="text-xs text-muted-foreground">
                      Users will receive the permissions of their new role
                    </p>
                  </div>
                </div>
                
                {/* Permanent Deletion Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">Permanent Deletion</p>
                    <p className="text-xs text-muted-foreground">
                      This role will be permanently deleted and cannot be recovered
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
                    This action will permanently delete this role
                    {hasUsersAssigned && ' and reassign all users'}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Type "delete role" to confirm
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder="delete role"
                    className="h-10"
                    disabled={deleteRoleLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Type exactly "delete role" (case insensitive)
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
              disabled={deleteRoleLoading} 
              size="sm" 
              className="text-xs"
            >
              {t('common.cancel')}
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
              {deleteRoleLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete Role
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
