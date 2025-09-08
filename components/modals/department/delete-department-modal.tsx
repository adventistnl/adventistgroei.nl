"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  AlertTriangle, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Database, 
  Users,
  Home,
  DollarSign,
  Calendar,
  Globe,
  Building
} from "lucide-react"
import toast from "react-hot-toast"

export interface DepartmentData {
  id: string
  institution_id: string
  church_id: string
  name: string
  description: string
  annual_budget: number
  contact_id?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface DeleteDepartmentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  department: DepartmentData | null
  onSuccess?: (deletedDepartment: DepartmentData) => void
}

export function DeleteDepartmentModal({
  isOpen,
  onOpenChange,
  department,
  onSuccess
}: DeleteDepartmentModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const handleSubmit = async () => {
    if (!department) return

    setIsLoading(true)
    const loadingToast = toast.loading(t('departments.toasts.deactivating'))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(loadingToast)
      toast.success(t('departments.toasts.deactivated'), {
        duration: 3000,
        icon: '🏢'
      })
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(department)
      }
      
      // Close modal
      onOpenChange(false)
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('departments.toasts.deactivate_failed'))
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

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === 'delete department'

  if (!department) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Layers className="w-5 h-5" />
            {t('departments.modals.delete.deactivate_title')}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t('departments.modals.delete.deactivate_description')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Department Information */}
          <Card className="border-muted">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder-logo.svg" />
                  <AvatarFallback className="text-lg bg-emerald-100 text-emerald-600">
                    <Layers className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg truncate">{department.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">{department.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="w-3 h-3 mr-1" />
                      ${department.annual_budget.toLocaleString()}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(department.created_at).getFullYear()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Department Statistics */}
          <Card className="border-orange-200 bg-orange-50/30">
            <CardContent className="p-4">
              <h5 className="font-medium text-orange-800 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {t('departments.modals.delete.affected_components')}
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>{t('departments.stats.church')}: <strong>1</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>{t('departments.stats.members')}: <strong>0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>{t('departments.stats.budget')}: <strong>${department.annual_budget.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-orange-600" />
                  <span>{t('departments.stats.projects')}: <strong>0</strong></span>
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
                  {t('departments.modals.delete.view_consequences')}
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
                    <p className="font-medium text-sm text-red-600">{t('departments.modals.delete.consequences.member_access')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('departments.modals.delete.consequences.member_access_desc')}
                    </p>
                  </div>
                </div>
                
                {/* Data Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-blue-600">{t('departments.modals.delete.consequences.data_preservation')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('departments.modals.delete.consequences.data_preservation_desc')}
                    </p>
                  </div>
                </div>
                
                {/* Budget Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <DollarSign className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-green-600">{t('departments.modals.delete.consequences.budget_impact')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('departments.modals.delete.consequences.budget_impact_desc')}
                    </p>
                  </div>
                </div>

                {/* Projects Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-orange-600">{t('departments.modals.delete.consequences.project_impact')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('departments.modals.delete.consequences.project_impact_desc')}
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
                <p className="text-sm font-medium">{t('departments.modals.delete.soft_delete.title')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('departments.modals.delete.soft_delete.description')}
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
                  {t('departments.modals.delete.understand_consequences')}
                </span>
                <br />
                <span className="text-red-700 dark:text-red-300">
                  {t('departments.modals.delete.acknowledge_text')}
                </span>
              </label>
            </div>

            {/* Final Confirmation Input */}
            {understoodConsequences && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-600">
                  {t('departments.modals.delete.type_confirmation')}
                </label>
                <Input
                  type="text"
                  value={finalConfirmation}
                  onChange={(e) => setFinalConfirmation(e.target.value)}
                  placeholder={t('departments.modals.delete.confirmation_placeholder')}
                  className="w-full border-red-300 focus:border-red-500 focus:ring-red-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  {t('departments.modals.delete.confirmation_help')}
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
              <Layers className="w-4 h-4 mr-2" />
              {isLoading ? t('departments.modals.delete.deactivating') : t('departments.modals.delete.deactivate_department')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
