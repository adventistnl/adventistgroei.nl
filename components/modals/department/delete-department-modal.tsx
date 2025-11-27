"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  AlertTriangle, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Database, 
  Briefcase,
  Users,
  DollarSign,
  FileText,
  Trash2
} from "lucide-react"
import toast from "react-hot-toast"
import { departmentTranslations } from "@/lib/translations/departments"
import { useDeleteDepartmentMutation } from "@/hooks/graphql/use-departments"
import {
  InstitutionById_institution_departments as DepartmentData,
} from "@/types/InstitutionById"

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
  const { t: tCommon, i18n } = useTranslation()
  const [deleteDepartment] = useDeleteDepartmentMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const t = departmentTranslations[currentLanguage as keyof typeof departmentTranslations] || departmentTranslations.en

  const confirmationText = 'delete department'

  const handleSubmit = async () => {
    if (!department) return

    setIsLoading(true)
    const loadingToast = toast.loading(t.toasts.deleting)

    try {
      await deleteDepartment({ variables: { id: department.id } })
      
      toast.dismiss(loadingToast)
      toast.success(t.toasts.deleted, {
        duration: 3000,
        icon: '🗑️'
      })

      if (onSuccess) {
        onSuccess(department)
      }

      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t.toasts.delete_failed)
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

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === confirmationText.toLowerCase()

  if (!department) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
            {t.modals.delete.deactivate_title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t.modals.delete.deactivate_description}
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">

            {/* Department Information */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
              {/* Ícone */}
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
                <Layers className="w-6 h-6 text-muted-foreground" />
              </div>
              
              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {department.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {department.description}
                </p>
              </div>
            </div>

            {/* Affected Components */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground text-center">
                {t.modals.delete.affected_components}
              </h4>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span>{t.modals.delete.affected_data.projects}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{t.modals.delete.affected_data.volunteers}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>{t.modals.delete.affected_data.budgets}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{t.modals.delete.affected_data.documents}: <strong className="text-foreground">0</strong></span>
                </div>
              </div>
            </div>

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    {t.modals.delete.view_consequences}
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Data Deletion Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Trash2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.modals.delete.consequences.projects_deleted}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.modals.delete.consequences.projects_deleted_desc}
                    </p>
                  </div>
                </div>

                {/* User Unlinking Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.modals.delete.consequences.users_unlinked}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.modals.delete.consequences.users_unlinked_desc}
                    </p>
                  </div>
                </div>

                {/* Data Preservation Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.modals.delete.consequences.data_preservation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.modals.delete.consequences.data_preservation_desc}
                    </p>
                  </div>
                </div>

                {/* Financial Impact Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <DollarSign className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {t.modals.delete.consequences.budget_deleted}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.modals.delete.consequences.budget_deleted_desc}
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
                    {t.modals.delete.understand_consequences}
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    {t.modals.delete.acknowledge_text}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t.modals.delete.type_confirmation || "Type the confirmation text to proceed"}
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t.modals.delete.confirmation_help || `Type "delete department" to confirm`}
                  </p>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder={t.modals.delete.confirmation_placeholder || "delete department"}
                    className="h-10"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} size="sm" className="text-xs">
              {t.buttons.cancel}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !isDeleteEnabled}
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
                  {t.modals.delete.deactivating}
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  {t.modals.delete.deactivate_department}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
