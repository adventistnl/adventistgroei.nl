"use client"

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Plus, Lock } from "lucide-react"

import { useRoles } from "@/hooks/use-roles"
import toast from "react-hot-toast"

export interface CreateRoleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (roleData: RoleFormData) => void
}

export interface RoleFormData {
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

export function CreateRoleModal({ isOpen, onOpenChange, onSuccess }: CreateRoleModalProps) {
  const { t } = useTranslation()
  const { createRole, createRoleLoading } = useRoles()
  const [roleForm, setRoleForm] = useState<RoleFormData>({
    name: '',
    key_code: '',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setRoleForm({
        name: '',
        key_code: '',
        description: ''
      })
      setErrors({})
    }
  }, [isOpen])

  const resetForm = () => {
    setRoleForm({
      name: '',
      key_code: '',
      description: ''
    })
    setErrors({})
  }

  const handleInputChange = (field: string, value: string) => {
    setRoleForm(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate key_code when name changes
    if (field === 'name') {
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

    const loadingToast = toast.loading(t('access.toasts.creating_role'))
    
    try {
      await createRole({
        name: roleForm.name.trim(),
        key_code: roleForm.key_code,
        description: roleForm.description.trim(),
      })
      
      toast.dismiss(loadingToast)
      toast.success(t('access.toasts.role_created'), {
        duration: 3000,
        icon: '🎉'
      })
      
      if (onSuccess) {
        onSuccess(roleForm)
      }
      
      onOpenChange(false)
      resetForm()
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('access.toasts.role_create_failed'))
    }
  }

  const handleClose = () => {
    if (!createRoleLoading) {
      onOpenChange(false)
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-muted-foreground" />
            {t('access.modals.create_role.title')}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t('access.modals.create_role.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Role Name */}
          <div className="space-y-2">
            <Label htmlFor="role-name" className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-muted-foreground" />
              {t('access.modals.create_role.name')} *
            </Label>
            <Input
              id="role-name"
              placeholder={t('access.modals.create_role.name_placeholder')}
              value={roleForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={createRoleLoading}
              className={`h-10 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Key Code (Auto-generated, Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="role-key-code" className="flex items-center gap-2 text-sm">
              <Lock className="w-4 h-4 text-muted-foreground" />
              {t('access.modals.create_role.key_code')} *
            </Label>
            <Input
              id="role-key-code"
              value={roleForm.key_code}
              disabled={true}
              readOnly
              className="h-10 bg-muted/50 cursor-not-allowed font-mono text-sm"
              placeholder="AUTO_GENERATED"
            />
            <p className="text-xs text-muted-foreground">
              Auto-generated from role name
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="role-description" className="text-sm">
              {t('access.modals.create_role.description_label')} *
            </Label>
            <Textarea
              id="role-description"
              placeholder={t('access.modals.create_role.description_placeholder')}
              value={roleForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              disabled={createRoleLoading}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Info Note */}
          <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground">
              {t('access.modals.create_role.permissions_note')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={createRoleLoading}
              size="sm"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!roleForm.name || !roleForm.key_code || !roleForm.description || createRoleLoading}
              size="sm"
              className="min-w-[100px]"
            >
              {createRoleLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('access.modals.create_role.create')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
