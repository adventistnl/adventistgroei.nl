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
import { departmentTranslations } from "@/lib/translations/departments"

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
  const { t: tCommon } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [consequencesOpen, setConsequencesOpen] = useState(false)
  const [understoodConsequences, setUnderstoodConsequences] = useState(false)
  const [finalConfirmation, setFinalConfirmation] = useState('')

  const handleSubmit = async () => {
    if (!department) return

    setIsLoading(true)
    const loadingToast = toast.loading("Deactivating department...")
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(loadingToast)
      toast.success("Department deactivated successfully", {
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
      toast.error("Failed to deactivate department")
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
      <DialogContent className="w-[95vw] max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Layers className="w-5 h-5 text-muted-foreground" />
            Deactivate Department
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This action will deactivate the department and affect related data
          </DialogDescription>
        </DialogHeader>
        
        {/* Conteúdo - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-6 p-1">
            {/* Department Information */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Layers className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">{department.name}</h3>
                <p className="text-sm text-muted-foreground">{department.description}</p>
              </div>
            </div>

            {/* Affected Components */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground text-center">
                Affected Components
              </h4>
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="w-4 h-4" />
                  <span>Church: <strong className="text-foreground">1</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>Members: <strong className="text-foreground">0</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="w-4 h-4" />
                  <span>Budget: <strong className="text-foreground">${department.annual_budget.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4" />
                  <span>Projects: <strong className="text-foreground">0</strong></span>
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
                    Type 'delete department' to confirm
                  </label>
                  <Input
                    type="text"
                    value={finalConfirmation}
                    onChange={(e) => setFinalConfirmation(e.target.value)}
                    placeholder="Type 'delete department' here"
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
                  <Layers className="w-3 h-3 mr-1" />
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
