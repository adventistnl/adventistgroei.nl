"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Save, Lock, Settings } from "lucide-react"

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

/**
 * Generate key_code from role name
 * Converts name to uppercase and replaces spaces with underscores
 * Example: "Content Manager" -> "CONTENT_MANAGER"
 */
const generateKeyCode = (name: string): string => {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '')
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
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isAdminRole, setIsAdminRole] = useState(false)
  
  // Hook para mutation real
  // const { updateRole, updateRoleLoading } = useRoles({ id: role?.id })
  const [useUpdateRoleMutate, {loading}] = useMutation<UpdateRole, UpdateRoleVariables>(UPDATE_ROLE_MUTATION);
  const updateRole = async (variables: UpdateRoleVariables) => {
    await useUpdateRoleMutate({ variables });
    // await refetchCurrentRole();
  }

  const isLoading = loading

  // Update form when role changes or modal opens
  useEffect(() => {
    if (role && isOpen) {
      setRoleForm({
        id: role.id,
        name: role.name,
        key_code: role.key_code,
        description: role.description
      })
      setIsAdminRole(role.key_code === 'ADMIN')
      setErrors({})
    }
  }, [role, isOpen])

  const resetForm = () => {
    setRoleForm({
      id: '',
      name: '',
      key_code: '',
      description: ''
    })
    setErrors({})
    setIsAdminRole(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setRoleForm(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate key_code when name changes (only if not ADMIN role)
    if (field === 'name' && !isAdminRole) {
      const generatedKeyCode = generateKeyCode(value)
      setRoleForm(prev => ({
        ...prev,
        key_code: generatedKeyCode
      }))
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!roleForm.name?.trim()) {
      newErrors.name = "Role name is required"
    } else if (roleForm.name.trim().length < 2) {
      newErrors.name = "Role name must be at least 2 characters"
    }

    if (!roleForm.key_code) {
      newErrors.key_code = "Key code is required"
    }

    if (!roleForm.description?.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }

    const loadingToast = toast.loading(t('access.toasts.updating_role'))
    
    try {
      await updateRole({
        id: roleForm.id,
        name: roleForm.name.trim(),
        key_code: roleForm.key_code,
        description: roleForm.description.trim(),
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
      resetForm()
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-muted-foreground" />
            {t('access.modals.edit_role.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('access.modals.edit_role.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-role-name" className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-muted-foreground" />
              {t('access.modals.edit_role.name')} *
            </Label>
            <Input
              id="edit-role-name"
              placeholder={t('access.modals.create_role.name_placeholder')}
              value={roleForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Key Code (Auto-generated or locked for ADMIN) */}
          <div className="space-y-2">
            <Label htmlFor="edit-role-key-code" className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-muted-foreground" />
              {t('access.modals.edit_role.key_code')} *
            </Label>
            <Input
              id="edit-role-key-code"
              value={roleForm.key_code}
              disabled={true}
              readOnly
              className="h-10 bg-muted/50 cursor-not-allowed font-mono text-sm"
              placeholder="AUTO_GENERATED"
            />
            <p className="text-xs text-muted-foreground">
              {isAdminRole 
                ? t('access.modals.edit_role.admin_key_locked')
                : "Auto-generated from role name"
              }
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-role-description" className="text-sm">
              {t('access.modals.edit_role.description_label')} *
            </Label>
            <Textarea
              id="edit-role-description"
              placeholder={t('access.modals.create_role.description_placeholder')}
              value={roleForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              disabled={isLoading}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Info Box */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Assigned Users
              </span>
              <span className="font-semibold">
                {assignedUsersCount} {assignedUsersCount === 1 ? 'user' : 'users'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleEditPermissions}
              disabled={isLoading}
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t('access.modals.edit_role.edit_permissions')}
            </Button>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                disabled={isLoading}
                size="sm"
              >
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!roleForm.name || !roleForm.key_code || !roleForm.description || isLoading}
                size="sm"
                className="min-w-[100px]"
              >
                {isLoading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('common.save')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
