"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, Trash2 } from "lucide-react"
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

type DeleteStep = 'confirm' | 'reassign'

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

  // Determine initial step based on users with this role
  useEffect(() => {
    if (role && isOpen) {
      const usersWithRole = users.filter(user => 
        user.user_roles.some(userRole => userRole.id === role.id)
      )
      
      setDeleteStep(usersWithRole.length > 0 ? 'reassign' : 'confirm')
      setReassignmentRole('')
    }
  }, [role, users, isOpen])

  const handleSubmit = async () => {
    if (!role) return
    if (deleteStep === 'reassign' && !reassignmentRole) {
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
      onOpenChange(false)
      setDeleteStep('confirm')
      setReassignmentRole('')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('access.toasts.role_delete_failed'))
    }
  }

  const handleClose = () => {
    if (!deleteRoleLoading) {
      onOpenChange(false)
      setDeleteStep('confirm')
      setReassignmentRole('')
    }
  }

  if (!role) return null

  const usersWithRole = users.filter(u => 
    u.user_roles.some(r => r.id === role.id)
  )

  const filteredAvailableRoles = availableRoles.filter(r => r.id !== role.id)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {t('access.modals.delete_role.title')}
          </DialogTitle>
          <DialogDescription>
            {deleteStep === 'confirm' 
              ? t('access.modals.delete_role.description')
              : t('access.modals.delete_role.reassign_description')
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Role Information */}
          <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">{role.name}</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {usersWithRole.length} users will be affected
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {deleteStep === 'reassign' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('access.modals.delete_role.reassign_to')}</Label>
                <Select value={reassignmentRole} onValueChange={setReassignmentRole} disabled={deleteRoleLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('access.modals.delete_role.select_role')} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAvailableRoles.map((availableRole) => (
                      <SelectItem key={availableRole.id} value={availableRole.id}>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          {availableRole.name}
                          <Badge variant="outline" className="text-xs">{availableRole.key_code}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                      {t('access.modals.delete_role.reassign_warning')}
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                      {t('access.modals.delete_role.reassign_note')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Show affected users */}
              {usersWithRole.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Affected Users ({usersWithRole.length})</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1 p-2 border rounded-md bg-muted/20">
                    {usersWithRole.slice(0, 5).map((user) => (
                      <div key={user.id} className="text-xs flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="font-medium">{user.name}</span>
                        <span className="text-muted-foreground">({user.email})</span>
                      </div>
                    ))}
                    {usersWithRole.length > 5 && (
                      <div className="text-xs text-muted-foreground">
                        ... and {usersWithRole.length - 5} more users
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {deleteStep === 'confirm' && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    {t('access.modals.delete_role.confirm_warning')}
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {t('access.modals.delete_role.confirm_note')}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={deleteRoleLoading}>
              {t('common.cancel')}
            </Button>
            
            <div className="flex gap-2">
              {deleteStep === 'reassign' && (
                <Button
                  variant="outline"
                  onClick={() => setDeleteStep('confirm')}
                  disabled={deleteRoleLoading}
                >
                  {t('access.modals.delete_role.skip_reassign')}
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={handleSubmit}
                disabled={deleteRoleLoading || (deleteStep === 'reassign' && !reassignmentRole)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleteStep === 'reassign' 
                  ? t('access.modals.delete_role.reassign_and_delete')
                  : t('access.modals.delete_role.delete')
                }
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
