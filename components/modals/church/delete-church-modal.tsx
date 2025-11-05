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
  Home, 
  ChevronDown, 
  ChevronRight, 
  Lock, 
  Database, 
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Building,
  FileText,
  Trash2,
  Layers
} from "lucide-react"
import toast from "react-hot-toast"
import { churchTranslations } from "@/lib/translations/churches"

export interface ChurchData {
  id: string
  institution_id: string
  name: string
  region_id: string
  contact_id?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface DeleteChurchModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  church: ChurchData | null
  onSuccess?: (deletedChurch: ChurchData) => void
}

export function DeleteChurchModal({
  isOpen,
  onOpenChange,
  church,
  onSuccess
}: DeleteChurchModalProps) {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en

  const handleSubmit = async () => {
    if (!church) return

    setIsLoading(true)
    const loadingToast = toast.loading(tChurch.toasts.deactivating)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(loadingToast)
      toast.success(tChurch.toasts.deactivated, {
        duration: 3000,
        icon: '🏢'
      })
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(church)
      }
      
      // Close modal
      onOpenChange(false)
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(tChurch.toasts.deactivate_failed)
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

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === tChurch.modals.delete.confirmation_text.toLowerCase()

  if (!church) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Trash2 className="w-5 h-5 text-muted-foreground" />
            {tChurch.modals.delete.deactivate_title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {tChurch.modals.delete.deactivate_description}
          </DialogDescription>
        </DialogHeader>
        
        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {/* Church Information */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
              {/* Ícone */}
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
                <Home className="w-6 h-6 text-muted-foreground" />
              </div>
              
              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {church.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Region ID: {church.region_id}
                </p>
              </div>
            </div>

            {/* Affected Components */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground text-center">
                {tChurch.modals.delete.affected_components}
              </h4>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{tChurch.stats.members}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Layers className="w-4 h-4" />
                  <span>{tChurch.stats.departments}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span>{tChurch.stats.projects}: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{tChurch.stats.activities}: <strong className="text-foreground">0</strong></span>
                </div>
              </div>
            </div>

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    {tChurch.modals.delete.view_consequences}
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Member Access Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {tChurch.modals.delete.consequences.member_access}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tChurch.modals.delete.consequences.member_access_desc}
                    </p>
                  </div>
                </div>
                
                {/* Data Preservation Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {tChurch.modals.delete.consequences.data_preservation}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tChurch.modals.delete.consequences.data_preservation_desc}
                    </p>
                  </div>
                </div>
                
                {/* Department Impact Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Layers className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {tChurch.modals.delete.consequences.department_impact}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tChurch.modals.delete.consequences.department_impact_desc}
                    </p>
                  </div>
                </div>

                {/* Project Impact Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">
                      {tChurch.modals.delete.consequences.project_impact}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tChurch.modals.delete.consequences.project_impact_desc}
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
                    {tChurch.modals.delete.understand_consequences}
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    {tChurch.modals.delete.acknowledge_text}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2 p-4 border rounded-lg">
                  <label className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {tChurch.modals.delete.type_confirmation.split("'")[0]}'<span className="font-bold">{tChurch.modals.delete.confirmation_text}</span>'{tChurch.modals.delete.type_confirmation.split("'")[2]}
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder={tChurch.modals.delete.confirmation_placeholder}
                    className="h-10"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {tChurch.modals.delete.confirmation_help}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} size="sm" className="text-xs">
              {t('common.cancel')}
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
                  {tChurch.modals.delete.deactivating}
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {tChurch.modals.delete.deactivate_church}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
