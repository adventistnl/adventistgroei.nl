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
  Trash2
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
  const { t: tCommon } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const handleSubmit = async () => {
    if (!church) return

    setIsLoading(true)
    const loadingToast = toast.loading("Deactivating church...")
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(loadingToast)
      toast.success("Church deactivated successfully", {
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
      toast.error("Failed to deactivate church")
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

  const isDeleteEnabled = understoodConsequences && finalConfirmation.toLowerCase() === 'delete church'

  if (!church) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Trash2 className="w-5 h-5 text-muted-foreground" />
            Deactivate Church
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This action will deactivate the church and affect related data
          </DialogDescription>
        </DialogHeader>
        
        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {/* Church Information */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Home className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">{church.name}</h3>
                <p className="text-sm text-muted-foreground">Region ID: {church.region_id}</p>
              </div>
            </div>

            {/* Affected Components */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground text-center">
                Affected Components
              </h4>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Members: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span>Departments: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget: <strong className="text-foreground">$0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Events: <strong className="text-foreground">0</strong></span>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox
                  id="understand-consequences"
                  checked={understoodConsequences}
                  onCheckedChange={(checked) => setUnderstoodConsequences(checked === true)}
                  className="mt-0.5"
                />
                <label htmlFor="understand-consequences" className="text-sm cursor-pointer">
                  <span className="font-medium text-foreground">
                    I understand the consequences
                  </span>
                  <br />
                  <span className="text-muted-foreground">
                    I acknowledge that this action will affect all related data
                  </span>
                </label>
              </div>

              {/* Final Confirmation Input */}
              {understoodConsequences && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Type 'delete church' to confirm
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder="Type 'delete church' here"
                    className="h-10"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone
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
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={isLoading || !isDeleteEnabled}
              size="sm"
              className="min-w-[120px] text-xs"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                  Deactivating...
                </>
              ) : (
                <>
                  <Trash2 className="w-3 h-3 mr-1" />
                  Deactivate Church
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
