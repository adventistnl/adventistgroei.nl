"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Plus } from "lucide-react"

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

export function CreateRoleModal({ isOpen, onOpenChange, onSuccess }: CreateRoleModalProps) {
  const { t } = useTranslation()
  const { createRole, createRoleLoading } = useRoles({})
  const [roleForm, setRoleForm] = useState<RoleFormData>({
    name: '',
    key_code: '',
    description: ''
  })

  const resetForm = () => {
    setRoleForm({
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
    const loadingToast = toast.loading(t('access.toasts.creating_role'))
    try {
      await createRole({
        name: roleForm.name,
        key_code: roleForm.key_code,
        description: roleForm.description,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {t('access.modals.create_role.title')}
          </DialogTitle>
          <DialogDescription>
            {t('access.modals.create_role.description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role-name">{t('access.modals.create_role.name')}</Label>
              <Input
                id="role-name"
                placeholder={t('access.modals.create_role.name_placeholder')}
                value={roleForm.name}
                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                disabled={createRoleLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role-key-code">{t('access.modals.create_role.key_code')}</Label>
              <Input
                id="role-key-code"
                placeholder={t('access.modals.create_role.key_code_placeholder')}
                value={roleForm.key_code}
                onChange={(e) => setRoleForm(prev => ({ ...prev, key_code: e.target.value.toUpperCase() }))}
                disabled={createRoleLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role-description">{t('access.modals.create_role.description_label')}</Label>
            <Textarea
              id="role-description"
              placeholder={t('access.modals.create_role.description_placeholder')}
              value={roleForm.description}
              onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
                disabled={createRoleLoading}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {t('access.modals.create_role.permissions_note')}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} disabled={createRoleLoading}>
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!roleForm.name || !roleForm.key_code || createRoleLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('access.modals.create_role.create')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
