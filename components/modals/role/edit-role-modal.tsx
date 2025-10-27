"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Edit, Save, Settings } from "lucide-react"

import toast from "react-hot-toast"
import { useRoles } from "@/hooks/use-roles"
import { User } from "@/data/accessData"
import { Roles_roles } from "@/types/Roles"
import { useMutation } from "@apollo/client/react"
import { UpdateRole, UpdateRoleVariables } from "@/types/UpdateRole"
import { UPDATE_ROLE_MUTATION } from "@/graphql/mutations/ROLE_MUTATIONS"

export interface EditRoleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  role: Roles_roles | null
  users?: User[]
  onSuccess?: (roleData: EditRoleFormData) => void
  onEditPermissions?: (role: Roles_roles) => void
}

export interface EditRoleFormData {
  id: string
  name: string
  key_code: string
  description: string
}

export function EditRoleModal({ 
  isOpen, 
  onOpenChange, 
  role, 
  users = [],
  onSuccess,
  onEditPermissions
}: EditRoleModalProps) {
  const { t } = useTranslation()
  const [roleForm, setRoleForm] = useState<EditRoleFormData>({
    id: '',
    name: '',
    key_code: '',
    description: ''
  })
  // Hook para mutation real
  // const { updateRole, updateRoleLoading } = useRoles({ id: role?.id })
  const [useUpdateRoleMutate, {loading}] = useMutation<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE_MUTATION);
  const updateRole = async (variables: UpdateRoleVariables) => {
    await useUpdateRoleMutate({ variables });
    // await refetchCurrentRole();
  }

  const isLoading = loading

  // Update form when role changes
  useEffect(() => {
    if (role) {
      setRoleForm({
        id: role.id,
        name: role.name,
        key_code: role.key_code,
        description: role.description
      })
    }
  }, [role])

  const resetForm = () => {
    setRoleForm({
      id: '',
      name: '',
      key_code: '',
      description: ''
    })
  }

  const handleSubmit = async () => {
    if (!roleForm.name || !roleForm.key_code) {
      toast.error("Please fill in all required fields")
      return
    }
    const loadingToast = toast.loading(t('access.toasts.updating_role'))
    try {
      await updateRole({
        id: roleForm.id,
        name: roleForm.name,
        key_code: roleForm.key_code,
        description: roleForm.description,
      })
      toast.dismiss(loadingToast)
      toast.success(t('access.toasts.role_updated'), {
        duration: 3000,
        icon: '✅'
      })
      if (onSuccess) {
        onSuccess(roleForm)
      }
      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('access.toasts.role_update_failed'))
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      resetForm()
    }
  }

  const handleEditPermissions = () => {
    if (role && onEditPermissions) {
      onEditPermissions(role)
    }
  }

  if (!role) return null

  const assignedUsersCount = users.filter(u => 
    u.user_roles.some(r => r.id === role.id)
  ).length

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            {t('access.modals.edit_role.title')}
          </DialogTitle>
          <DialogDescription>
            {t('access.modals.edit_role.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Role Information Card */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{role.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {assignedUsersCount} users assigned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role-name">{t('access.modals.edit_role.name')}</Label>
              <Input
                id="edit-role-name"
                value={roleForm.name}
                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role-key-code">{t('access.modals.edit_role.key_code')}</Label>
              <Input
                id="edit-role-key-code"
                value={roleForm.key_code}
                onChange={(e) => setRoleForm(prev => ({ ...prev, key_code: e.target.value.toUpperCase() }))}
                disabled={isLoading || role.key_code === 'ADMIN'}
              />
              {role.key_code === 'ADMIN' && (
                <p className="text-xs text-muted-foreground">
                  {t('access.modals.edit_role.admin_key_locked')}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-role-description">{t('access.modals.edit_role.description_label')}</Label>
            <Textarea
              id="edit-role-description"
              value={roleForm.description}
              onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleEditPermissions}
              disabled={isLoading}
            >
              <Settings className="w-4 h-4 mr-2" />
              {t('access.modals.edit_role.edit_permissions')}
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} disabled={isLoading}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!roleForm.name || !roleForm.key_code || isLoading}
              >
                <Save className="w-4 h-4 mr-2" />
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
