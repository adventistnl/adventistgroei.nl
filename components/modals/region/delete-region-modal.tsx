"use client"

import React, { useState } from "react"
import { useTranslation } from "react-i18next"
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
  EyeOff
} from "lucide-react"
import toast from "react-hot-toast"

export interface RegionData {
  id: string
  institution_id: string
  name: string
  parent_region_id?: string | null
  contact_id?: string | null
  created_at: string
  updated_at: string
  created_by: string
  updated_by: string
  is_deleted: boolean
  deleted_at?: string | null
  deleted_by?: string | null
}

export interface DeleteRegionModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  region: RegionData
  onSuccess: (region: RegionData) => void
}

export function DeleteRegionModal({
  isOpen,
  onOpenChange,
  region,
  onSuccess
}: DeleteRegionModalProps) {
  const { t } = useTranslation()
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
      toast.error(t('regions.modals.delete.confirmation_help'))
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(t('regions.toasts.deactivating'))

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      const deletedRegion: RegionData = {
        ...region,
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: 'current_user',
        updated_at: new Date().toISOString(),
        updated_by: 'current_user'
      }

      toast.dismiss(loadingToast)
      toast.success(t('regions.toasts.deactivated'), {
        duration: 3000,
        icon: '✅'
      })

      onSuccess(deletedRegion)
      onOpenChange(false)

    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(t('regions.toasts.deactivate_failed'))
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
            {t('regions.modals.delete.deactivate_title')}
          </DialogTitle>
          <DialogDescription>
            {t('regions.modals.delete.deactivate_description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Region Information */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                {t('regions.labels.region')} Information
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
                    Created: {new Date(region.created_at).toLocaleDateString()}
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
                  {t('regions.modals.delete.affected_components')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  This action will affect multiple components of your organization. 
                  Please review the consequences before proceeding.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Building className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-sm">Churches</div>
                      <div className="text-xs text-muted-foreground">~15 churches affected</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Users className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-sm">Members</div>
                      <div className="text-xs text-muted-foreground">~2,500 members affected</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-sm">Events</div>
                      <div className="text-xs text-muted-foreground">~8 upcoming events</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-medium text-sm">Budget</div>
                      <div className="text-xs text-muted-foreground">$125,000 allocated</div>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleViewConsequences}
                  className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {t('regions.modals.delete.view_consequences')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  {t('regions.modals.delete.consequences.church_access')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      {t('regions.modals.delete.consequences.church_access')}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {t('regions.modals.delete.consequences.church_access_desc')}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      {t('regions.modals.delete.consequences.data_preservation')}
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {t('regions.modals.delete.consequences.data_preservation_desc')}
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      {t('regions.modals.delete.consequences.member_impact')}
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {t('regions.modals.delete.consequences.member_impact_desc')}
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                      {t('regions.modals.delete.consequences.event_impact')}
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {t('regions.modals.delete.consequences.event_impact_desc')}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    {t('regions.modals.delete.soft_delete.title')}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t('regions.modals.delete.soft_delete.description')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="understand"
                    checked={understandConsequences}
                    onCheckedChange={setUnderstandConsequences}
                    disabled={isLoading}
                  />
                  <Label htmlFor="understand" className="text-sm">
                    {t('regions.modals.delete.understand_consequences')}
                  </Label>
                </div>

                {understandConsequences && (
                  <Button 
                    variant="outline" 
                    onClick={handleUnderstandConsequences}
                    className="w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t('regions.modals.delete.acknowledge_text')}
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
                  Final Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    {t('regions.modals.delete.type_confirmation')}
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="confirmation" className="text-sm font-medium">
                      Type: <code className="bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs">delete region</code>
                    </Label>
                    <Input
                      id="confirmation"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder={t('regions.modals.delete.confirmation_placeholder')}
                      disabled={isLoading}
                      className={isConfirmationValid ? 'border-green-500' : 'border-red-500'}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t('regions.modals.delete.confirmation_help')}
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
              {t('common.cancel')}
            </Button>

            {showConfirmation && isConfirmationValid && (
              <Button 
                onClick={handleDelete} 
                disabled={isLoading || !understandConsequences}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isLoading ? t('regions.modals.delete.deactivating') : t('regions.modals.delete.deactivate_region')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
