"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Trash2,
  Home,
  ChevronDown,
  ChevronRight,
  Lock,
  Database,
  Layers,
} from "lucide-react"
import toast from "react-hot-toast"
import { useChurches } from "@/hooks/use-churches"
import { churchTranslations } from "@/lib/translations/churches"

export interface ChurchData {
  id: string
  institution_id: string
  name: string
  region_id?: string | null
  contact_id?: string | null
  contact?: {
    id?: string
    name?: string | null
    phone?: string | null
    email?: string | null
    country?: string | null
    city?: string | null
  } | null
  type?: string | null
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
  onOpenChangeAction: (open: boolean) => void
  church: ChurchData | null
  onSuccess?: (deletedChurch: ChurchData) => void
}

export function DeleteChurchModal({
  isOpen,
  onOpenChangeAction,
  church,
  onSuccess
}: DeleteChurchModalProps) {
  const { t, i18n } = useTranslation()
  const { deleteChurch } = useChurches()
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  // Get translations for current language
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en

  const handleDelete = async () => {
    if (!church) return

    setIsLoading(true)
    const loadingToast = toast.loading(tChurch.toasts.deactivating)

    try {
      const variables = {
        id: church.id
      }
      const res = await deleteChurch({ variables })
      if (!res || !res.data) {
        throw new Error("Failed to delete church")
      }

      toast.dismiss(loadingToast)
      toast.success(tChurch.toasts.deactivated, {
        duration: 3000
      })

      if (onSuccess) {
        onSuccess(church)
      }

      onOpenChangeAction(false)

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
      onOpenChangeAction(false)
    }
  }

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === 'delete church' && !isLoading

  if (!church) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
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
                  {church.id}
                </p>
              </div>
            </div>

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    {tChurch.modals.delete.view_consequences || "Ver consequências da deleção"}
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Direct Relationships Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Layers className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{tChurch.modals.delete.consequences.direct_relationships}</p>
                    <p className="text-xs text-muted-foreground">
                      {tChurch.modals.delete.consequences.direct_relationships_desc}
                    </p>
                  </div>
                </div>

                {/* Indirect Relationships Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{tChurch.modals.delete.consequences.indirect_relationships}</p>
                    <p className="text-xs text-muted-foreground">
                      {tChurch.modals.delete.consequences.indirect_relationships_desc}
                    </p>
                  </div>
                </div>

                {/* Data Preservation Consequence */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{tChurch.modals.delete.consequences.data_safety}</p>
                    <p className="text-xs text-muted-foreground">
                      {tChurch.modals.delete.consequences.data_safety_desc}
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
                    {tChurch.modals.delete.understand_consequences || "Compreendo as consequências desta ação"}
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    {tChurch.modals.delete.acknowledge_text}
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {tChurch.modals.delete.type_confirmation}
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder={tChurch.modals.delete.confirmation_placeholder}
                    className="h-10"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
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
              onClick={handleDelete}
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
                  {tChurch.toasts.deactivating}
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
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
