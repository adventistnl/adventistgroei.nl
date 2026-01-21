"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"
import { regionTranslations } from "@/lib/translations/regions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  MapPin, 
  Trash2, 
  Building, 
  ChevronDown,
  ChevronRight,
  Unlink,
  Database,
  TrendingDown,
} from "lucide-react"
import toast from "react-hot-toast"
import { Regions_regions } from "@/types/Regions"
import { useRegions } from "@/hooks/use-regions"

export interface DeleteRegionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  region: Regions_regions
  onSuccess: (regionId: string) => void
}

export function DeleteRegionModal({
  isOpen,
  onOpenChange,
  region,
  onSuccess
}: DeleteRegionModalProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const { deleteRegion } = useRegions();
  const t = structureTranslations[currentLanguage as keyof typeof structureTranslations] || structureTranslations.en
  const tRegion = regionTranslations[currentLanguage as keyof typeof regionTranslations] || regionTranslations.en
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')

  const isDeleteEnabled = understoodConsequences && confirmationText.toLowerCase() === 'delete region'

  const handleDelete = async () => {
    if (!region) return

    setIsLoading(true)
    const loadingToast = toast.loading(tRegion.toasts.deactivating)

    try {
      const result = await deleteRegion({
        variables: {
          id: region.id
        }
      })

      if (result.data?.deleteRegion) {
        toast.dismiss(loadingToast)
        toast.success(tRegion.toasts.deactivated, {
          duration: 3000
        })

        onSuccess(result.data?.deleteRegion.id)
        onOpenChange(false)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      console.error('Error deleting region:', error)
      toast.error(tRegion.toasts.deactivate_failed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setConsequencesOpen(false)
      setUnderstoodConsequences(false)
      setConfirmationText('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="text-lg mb-2">
            {tRegion.modals.delete.deactivate_title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {tRegion.modals.delete.deactivate_description}
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {/* Region Information */}
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
              {/* Ícone */}
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
                <MapPin className="w-6 h-6 text-muted-foreground" />
              </div>
              
              {/* Informações */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {region.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(region.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Collapsible Consequences */}
            <Collapsible open={consequencesOpen} onOpenChange={setConsequencesOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between" size="sm">
                  <span className="flex items-center gap-2 text-xs">
                    {tRegion.modals.delete.view_consequences}
                  </span>
                  {consequencesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-4">
                {/* Churches Disconnection */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Unlink className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{tRegion.modals.delete.churches_disconnected}</p>
                    <p className="text-xs text-muted-foreground">
                      {tRegion.modals.delete.churches_disconnected_desc}
                    </p>
                  </div>
                </div>

                {/* Data Preservation */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{tRegion.modals.delete.region_archived}</p>
                    <p className="text-xs text-muted-foreground">
                      {tRegion.modals.delete.region_archived_desc}
                    </p>
                  </div>
                </div>

                {/* Orphaned Churches */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Building className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{tRegion.modals.delete.orphaned_churches}</p>
                    <p className="text-xs text-muted-foreground">
                      {tRegion.modals.delete.orphaned_churches_desc}
                    </p>
                  </div>
                </div>

                {/* KPI Impact */}
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <TrendingDown className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm text-foreground">{tRegion.modals.delete.data_impact}</p>
                    <p className="text-xs text-muted-foreground">
                      {tRegion.modals.delete.data_impact_desc}
                    </p>
                  </div>
                </div>

                {/* Confirmation Checkbox - Inside Collapsible */}
                <div className="space-y-4 pt-4 border-t mt-4">
                  <div className="flex items-start gap-3 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-950">
                    <Checkbox
                      id="understand-consequences"
                      checked={understoodConsequences}
                      onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                      className="mt-0.5 border-2 border-gray-400 dark:border-gray-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <label htmlFor="understand-consequences" className="text-sm cursor-pointer">
                      <span className="font-medium text-foreground">
                        {tRegion.modals.delete.understand_consequences}
                      </span>
                      <br />
                      <span className="text-muted-foreground">
                        {tRegion.modals.delete.acknowledge_text || "I acknowledge that this action will affect related churches and cannot be easily undone."}
                      </span>
                    </label>
                  </div>

                  {/* Final Confirmation Input - Inside Collapsible */}
                  {understoodConsequences && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {tRegion.modals.delete.type_confirmation}
                      </label>
                      <Input
                        type="text"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                        placeholder={tRegion.modals.delete.confirmation_placeholder}
                        className="h-10"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        {tRegion.modals.delete.confirmation_help}
                      </p>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Botões de Ação - Fixos no rodapé */}
        <div className="flex-shrink-0 border-t pt-4 mt-6">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} size="sm" className="text-xs">
              {t.common.cancel}
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
                  {tRegion.modals.delete.deactivating}
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  {tRegion.modals.delete.deactivate_region}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
