"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { structureTranslations } from "@/lib/translations/structure"
import { regionTranslations } from "@/lib/translations/regions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  MapPin, 
  AlertTriangle, 
  Trash2, 
  Shield, 
  Users, 
  Building, 
  Calendar,
  CheckCircle,
  X,
  Eye,
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
  const [showConsequences, setShowConsequences] = useState(false)
  const [understandConsequences, setUnderstandConsequences] = useState(false)
  const [confirmationText, setConfirmationText] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const isConfirmationValid = confirmationText === 'delete region'

  const handleViewConsequences = () => {
    setShowConsequences(true)
  }

  const handleUnderstandConsequences = () => {
    setUnderstandConsequences(true)
    setShowConfirmation(true)
  }

  const handleDelete = async () => {
    if (!understandConsequences || !isConfirmationValid) {
      toast.error(tRegion.modals.delete.confirmation_help)
      return
    }

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
          duration: 3000,
          icon: '✅'
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
      setShowConsequences(false)
      setUnderstandConsequences(false)
      setConfirmationText('')
      setShowConfirmation(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {tRegion.modals.delete.deactivate_title}
          </DialogTitle>
          <DialogDescription>
            {tRegion.modals.delete.deactivate_description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Region Information */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  {tRegion.labels.region}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">{region.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(region.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consequences Section */}
          {!showConsequences ? (
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  {tRegion.modals.delete.consequences_title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {tRegion.modals.delete.consequences_intro}
                </p>
                
                <div className="space-y-3">
                  {/* Churches Disconnection */}
                  <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      <Unlink className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-orange-900 dark:text-orange-100">{tRegion.modals.delete.churches_disconnected}</div>
                      <div className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                        {tRegion.modals.delete.churches_disconnected_desc}
                      </div>
                    </div>
                  </div>

                  {/* Soft Delete */}
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-blue-900 dark:text-blue-100">{tRegion.modals.delete.region_archived}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        {tRegion.modals.delete.region_archived_desc}
                      </div>
                    </div>
                  </div>

                  {/* Orphaned Churches */}
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      <Building className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-yellow-900 dark:text-yellow-100">{tRegion.modals.delete.orphaned_churches}</div>
                      <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        {tRegion.modals.delete.orphaned_churches_desc}
                      </div>
                    </div>
                  </div>

                  {/* KPI Impact */}
                  <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      <TrendingDown className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-purple-900 dark:text-purple-100">{tRegion.modals.delete.data_impact}</div>
                      <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        {tRegion.modals.delete.data_impact_desc}
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleViewConsequences}
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {tRegion.modals.delete.view_consequences}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  {tRegion.modals.delete.detailed_consequences_title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* What Happens */}
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                      <Unlink className="w-4 h-4" />
                      {tRegion.modals.delete.detailed_consequences.what_happens}
                    </h4>
                    <ul className="space-y-2 text-sm text-orange-800 dark:text-orange-200">
                      <li className="flex gap-2">
                        <span className="text-orange-600 dark:text-orange-400">✓</span>
                        <span>{tRegion.modals.delete.detailed_consequences.churches_region_id_clear}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-orange-600 dark:text-orange-400">✓</span>
                        <span>{tRegion.modals.delete.detailed_consequences.soft_delete_detail}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-orange-600 dark:text-orange-400">✓</span>
                        <span>{tRegion.modals.delete.detailed_consequences.churches_as_orphaned}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Churches Impact */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {tRegion.modals.delete.detailed_consequences.churches_orphaned_title}
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                      <li className="flex gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>{tRegion.modals.delete.detailed_consequences.churches_not_deleted}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>{tRegion.modals.delete.detailed_consequences.orphaned_stay_linked}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>{tRegion.modals.delete.detailed_consequences.churches_visible}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Data Consistency */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      {tRegion.modals.delete.data_will_be_preserved}
                    </h4>
                    <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
                      <li className="flex gap-2">
                        <span className="text-yellow-600 dark:text-yellow-400">✓</span>
                        <span>{tRegion.modals.delete.detailed_consequences.all_data_preserved}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 dark:text-yellow-400">✓</span>
                        <span>{tRegion.modals.delete.detailed_consequences.nothing_physically_deleted}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-yellow-600 dark:text-yellow-400">⚠</span>
                        <span>{tRegion.modals.delete.detailed_consequences.data_consistency}</span>
                      </li>
                    </ul>
                  </div>

                  {/* KPI Impact */}
                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <TrendingDown className="w-4 h-4" />
                      {tRegion.modals.delete.kpi_metrics_changes}
                    </h4>
                    <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                      <li className="flex gap-2">
                        <span className="text-purple-600 dark:text-purple-400">📉</span>
                        <span>{tRegion.modals.delete.detailed_consequences.total_regions_decrease}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600 dark:text-purple-400">📊</span>
                        <span>{tRegion.modals.delete.detailed_consequences.region_statistics_change}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-purple-600 dark:text-purple-400">⚠</span>
                        <span>{tRegion.modals.delete.detailed_consequences.orphaned_risks}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      {tRegion.modals.delete.recommendation_title}
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      {tRegion.modals.delete.detailed_consequences.recommendation}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="understand"
                    checked={understandConsequences}
                    onCheckedChange={(checked) => setUnderstandConsequences(checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="understand" className="text-sm">
                    {tRegion.modals.delete.understand_consequences}
                  </Label>
                </div>

                {understandConsequences && (
                  <Button 
                    variant="outline" 
                    onClick={handleUnderstandConsequences}
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {tRegion.modals.delete.detailed_consequences.confirm_understand}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Confirmation Section */}
          {showConfirmation && (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <Trash2 className="w-4 h-4" />
                  {tRegion.modals.delete.final_confirmation}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    {tRegion.modals.delete.type_confirmation}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="confirmation" className="text-sm font-medium">
                      {tRegion.modals.delete.type_confirmation} <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs">delete region</code>
                    </Label>
                    <Input
                      id="confirmation"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder={tRegion.modals.delete.confirmation_placeholder}
                      disabled={isLoading}
                      className={isConfirmationValid ? 'border-green-500' : 'border-red-500'}
                    />
                    <p className="text-xs text-muted-foreground">
                      {tRegion.modals.delete.confirmation_help}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={isLoading} className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" />
              {t.common.cancel}
            </Button>

            {showConfirmation && isConfirmationValid && (
              <Button 
                onClick={handleDelete} 
                disabled={isLoading || !understandConsequences}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isLoading ? tRegion.modals.delete.deactivating : tRegion.modals.delete.deactivate_region}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
