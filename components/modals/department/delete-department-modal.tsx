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
          <DialogTitle className="text-lg mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-red-600">Deactivate Department</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This action will deactivate the department and all related data. Data is preserved and can be recovered.
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">

            {/* Department Information */}
            <div className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900">
              {/* Ícone */}
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center flex-shrink-0 border border-red-200 dark:border-red-800">
                <Layers className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>

              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {department.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {department.description}
                </p>
              </div>
            </div>

            {/* Affected Components */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground text-center">
                📊 Affected Data
              </h4>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span><span className="text-muted-foreground">Projects:</span> <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span><span className="text-muted-foreground">Volunteers:</span> <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span><span className="text-muted-foreground">Budgets:</span> <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span><span className="text-muted-foreground">Documents:</span> <strong className="text-foreground">0</strong></span>
                </div>
              </div>
            </div>

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
                {/* Data Deletion Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
                  <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-red-900 dark:text-red-100">
                      Projects & Activities Deleted
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      All projects, activities, and related data will be marked as deleted
                    </p>
                  </div>
                </div>

                {/* User Unlinking Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900">
                  <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-amber-900 dark:text-amber-100">
                      Users Unlinked from Department
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Department users will be removed from this department but remain in the institution
                    </p>
                  </div>
                </div>

                {/* Data Preservation Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                  <Database className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-blue-900 dark:text-blue-100">
                      Data Preservation & Recovery
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      All data remains in the database and can be recovered by administrators
                    </p>
                  </div>
                </div>

                {/* Financial Impact Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
                  <DollarSign className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-orange-900 dark:text-orange-100">
                      Budget & Financial Data Deleted
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      All budgets, subsidy requests, and financial records will be marked as deleted
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
                    I acknowledge that this action will deactivate the department and all related data
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2 p-4 border rounded-lg">
                  <label className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Type the confirmation text to proceed
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder='Type: "delete department"'
                    className="h-10"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    This action cannot be easily undone without administrator intervention
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação - Fixos no rodapé */}
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
              disabled={isLoading || !isDeleteEnabled}
              size="sm"
              className={`min-w-[160px] text-xs ${
                isDeleteEnabled 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-600/40 text-white/60 cursor-not-allowed hover:bg-red-600/40'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  Deactivating...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Deactivate Department
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
