"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AlertTriangle, Trash2, Shield, ChevronDown, ChevronRight, Lock, Database, UserX } from "lucide-react"
import toast from "react-hot-toast"
import { InstitutionById_institution_users as User } from "@/types/InstitutionById"
import { useUser } from '@/hooks/use-user';
import { useInstitution } from "@/contexts/institution-context"

export interface DeleteUserModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSuccess?: (deletedUser: User) => void
}

export function DeleteUserModal({
  isOpen,
  onOpenChange,
  user,
  onSuccess
}: DeleteUserModalProps) {
  const { t } = useTranslation()
  const { deleteUserById } = useUser({}); // Corrigido para usar o hook useUser
  const { refetchInstitutionById } = useInstitution(); // Hook para refetch
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const handleSubmit = async () => {
    if (!user) return

    setIsLoading(true)
    const loadingToast = toast.loading(t('users.toasts.deleting_user'))
    
    try {
      await deleteUserById(user.id)

      refetchInstitutionById(); // Refetch após sucesso

      toast.dismiss(loadingToast)
      toast.success(t('users.toasts.user_deleted'), {
        duration: 3000,
        icon: '🗑️'
      })
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(user)
      }
      
      // Close modal
      onOpenChange(false)
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('users.toasts.user_delete_failed'))
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

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === 'delete user'

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <UserX className="w-5 h-5" />
            {t('users.modals.delete_user.deactivate_title')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('users.modals.delete_user.deactivate_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* User Information */}
          <Card className="border-muted">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg truncate">{user.name}</h4>
                  <p className="text-sm text-muted-foreground font-mono truncate">{user.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user.user_roles?.map((role) => (
                      <Badge key={role.id} variant="outline" className="text-xs">
                        {role.role.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collapsible Consequences */}
          <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                  {t('users.modals.delete_user.view_consequences')}
                </span>
                {consequencesOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid gap-3">
                {/* Access Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Lock className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-red-600">{t('users.modals.delete_user.consequences.login_access')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('users.modals.delete_user.consequences.login_access_desc')}
                    </p>
                  </div>
                </div>
                
                {/* Data Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-blue-600">{t('users.modals.delete_user.consequences.data_preservation')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('users.modals.delete_user.consequences.data_preservation_desc')}
                    </p>
                  </div>
                </div>
                
                {/* Role Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Shield className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-orange-600">{t('users.modals.delete_user.consequences.role_assignments')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('users.modals.delete_user.consequences.role_assignments_desc')}
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Soft Delete Explanation */}
          <div className="p-4 bg-muted/30 border rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="space-y-2 min-w-0 flex-1">
                <p className="text-sm font-medium">{t('users.modals.delete_user.soft_delete.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('users.modals.delete_user.soft_delete.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 border border-red-200 dark:border-red-800 rounded-lg bg-red-50/50 dark:bg-red-950/20">
              <Checkbox
                id="understand-consequences"
                checked={understoodConsequences}
                onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="understand-consequences" className="text-sm cursor-pointer">
                <span className="font-medium text-red-800 dark:text-red-200">
                  {t('users.modals.delete_user.understand_consequences')}
                </span>
                <br />
                <span className="text-red-700 dark:text-red-300">
                  {t('users.modals.delete_user.acknowledge_text')}
                </span>
              </label>
            </div>

            {/* Final Confirmation Input */}
            {understoodConsequences && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-600">
                  {t('users.modals.delete_user.type_confirmation')}
                </label>
                <input
                  type="text"
                  value={finalConfirmation}
                  onChange={(e) => setFinalConfirmation(e.target.value)}
                  placeholder={t('users.modals.delete_user.confirmation_placeholder')}
                  className="w-full px-3 py-2 border border-red-300 bg-background rounded-md text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  {t('users.modals.delete_user.confirmation_help')}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} className="w-full sm:w-auto">
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isLoading || !isDeleteEnabled}
              className="w-full sm:w-auto"
            >
              <UserX className="w-4 h-4 mr-2" />
              {isLoading ? t('users.modals.delete_user.deactivating') : t('users.modals.delete_user.deactivate_user')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
