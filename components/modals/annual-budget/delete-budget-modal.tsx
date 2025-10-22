"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  AlertTriangle, 
  Building, 
  ChevronDown, 
  ChevronRight, 
  DollarSign,
  Calendar,
  Trash2,
  Database,
  FileText,
  Users,
  Lock,
  Unlock
} from "lucide-react"
import toast from "react-hot-toast"

interface BudgetRequest {
  id: string
  entity_type: 'institution' | 'region' | 'church' | 'department'
  entity_id: string
  entity_name: string
  year: number
  requested_amount: number
  approved_amount?: number
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'requires_revision'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'operational' | 'project' | 'maintenance' | 'emergency' | 'expansion'
  description: string
  justification: string
  requested_by: string
  reviewed_by?: string
  submitted_date: string
  review_date?: string
  approval_date?: string
  notes?: string
  documents?: string[]
  created_at: string
  updated_at: string
  is_locked?: boolean
}

export interface DeleteBudgetModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  budget: BudgetRequest | null
  onSuccess?: (deletedBudget: BudgetRequest) => void
}

export function DeleteBudgetModal({
  isOpen,
  onOpenChange,
  budget,
  onSuccess
}: DeleteBudgetModalProps) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const handleSubmit = async () => {
    if (!budget) return
    setIsLoading(true)
    const loadingToast = toast.loading(t("annual_budget.modals.delete.messages.deleting"))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.dismiss(loadingToast)
      toast.success(t("annual_budget.modals.delete.messages.deleted"), {
        duration: 3000,
        icon: '🗑️'
      })
      
      if (onSuccess) {
        onSuccess(budget)
      }
      onOpenChange(false)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t("annual_budget.modals.delete.messages.delete_failed"))
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

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === 'delete budget' && !isLoading

  if (!budget) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="w-5 h-5" />
            {t("annual_budget.modals.delete.title")}
          </DialogTitle>
          <DialogDescription className="text-base">
            {t("annual_budget.modals.delete.description")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Budget Information */}
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                  <Building className="w-8 h-8 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg text-gray-900 truncate">{budget.entity_name}</h4>
                  <p className="text-sm text-gray-500 truncate capitalize">{budget.entity_type}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                      <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                      {budget.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                      <DollarSign className="w-3 h-3 mr-1 text-gray-500" />
                      ${budget.requested_amount.toLocaleString()}
                    </Badge>
                    {budget.is_locked !== undefined && (
                      <Badge variant="outline" className="text-xs bg-white text-gray-700 border-gray-300">
                        {budget.is_locked ? (
                          <>
                            <Lock className="w-3 h-3 mr-1 text-gray-500" />
                            Locked
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 mr-1 text-gray-500" />
                            Unlocked
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Collapsible Consequences */}
          <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between border-gray-300 text-gray-700 hover:bg-gray-50">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-600" />
                  {t("annual_budget.modals.delete.view_consequences")}
                </span>
                {consequencesOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-4">
              <div className="grid gap-3">
                {/* Financial Consequence */}
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <DollarSign className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900">{t("annual_budget.modals.delete.consequences.financial_record")}</p>
                    <p className="text-xs text-gray-600">
                      {t("annual_budget.modals.delete.consequences.financial_record_desc")}
                    </p>
                  </div>
                </div>
                
                {/* Historical Data Consequence */}
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <Database className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900">{t("annual_budget.modals.delete.consequences.historical_data")}</p>
                    <p className="text-xs text-gray-600">
                      {t("annual_budget.modals.delete.consequences.historical_data_desc")}
                    </p>
                  </div>
                </div>
                
                {/* Reporting Consequence */}
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <FileText className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900">{t("annual_budget.modals.delete.consequences.reporting_impact")}</p>
                    <p className="text-xs text-gray-600">
                      {t("annual_budget.modals.delete.consequences.reporting_impact_desc")}
                    </p>
                  </div>
                </div>

                {/* Approval Chain Consequence */}
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <Users className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-gray-900">{t("annual_budget.modals.delete.consequences.approval_chain")}</p>
                    <p className="text-xs text-gray-600">
                      {t("annual_budget.modals.delete.consequences.approval_chain_desc")}
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Permanent Delete Warning */}
          <div className="p-4 bg-red-50/30 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 min-w-0 flex-1">
                <p className="text-sm font-medium text-red-800">{t("annual_budget.modals.delete.permanent_warning.title")}</p>
                <p className="text-sm text-red-700">
                  {t("annual_budget.modals.delete.permanent_warning.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg bg-gray-50">
              <Checkbox
                id="understand-consequences"
                checked={understoodConsequences}
                onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                className="mt-0.5 border-gray-400 data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-800"
              />
              <label htmlFor="understand-consequences" className="text-sm cursor-pointer">
                <span className="font-medium text-gray-900">
                  {t("annual_budget.modals.delete.understand_consequences")}
                </span>
                <br />
                <span className="text-gray-700">
                  {t("annual_budget.modals.delete.acknowledge_text")}
                </span>
              </label>
            </div>

            {/* Final Confirmation Input */}
            {understoodConsequences && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-red-600">
                  {t("annual_budget.modals.delete.type_confirmation")}
                </label>
                <Input
                  type="text"
                  value={finalConfirmation}
                  onChange={(e) => setFinalConfirmation(e.target.value)}
                  placeholder={t("annual_budget.modals.delete.confirmation_placeholder")}
                  className="w-full border-red-300 focus:border-red-500 focus:ring-red-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600">
                  {t("annual_budget.modals.delete.confirmation_help")}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading} 
              className="w-full sm:w-auto border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isLoading || !isDeleteEnabled}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isLoading ? t("annual_budget.modals.delete.messages.deleting") : t("annual_budget.modals.delete.delete_budget")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}