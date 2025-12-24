"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, AlertCircle, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useCurrency } from "@/contexts/currency-context"
import { ProjectActivityData } from "@/components/projects/project-activities-table"
import { ActivityCard } from "@/components/shared/activity-card"

interface SelectActivitiesModalProps {
  isOpen: boolean
  onClose: () => void
  activities: ProjectActivityData[]
  onConfirm: (selectedActivities: ProjectActivityData[]) => void
  title?: string
  description?: string
  filterSubsidized?: boolean
}

export function SelectActivitiesModal({
  isOpen,
  onClose,
  activities,
  onConfirm,
  title = "Selecionar Atividades",
  description = "Selecione as atividades que deseja incluir na solicitação de subsídio.",
  filterSubsidized = true,
}: SelectActivitiesModalProps) {
  const { formatCurrency } = useCurrency()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Filter activities if needed
  const availableActivities = React.useMemo(() => {
    return filterSubsidized 
      ? activities.filter(a => a.is_subsidized) 
      : activities
  }, [activities, filterSubsidized])

  // Reset selection when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedIds(new Set())
    }
  }, [isOpen])

  const toggleActivity = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleAll = () => {
    if (selectedIds.size === availableActivities.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(availableActivities.map(a => a.id)))
    }
  }

  const handleConfirm = () => {
    const selected = availableActivities.filter(a => selectedIds.has(a.id))
    onConfirm(selected)
    setSelectedIds(new Set())
  }

  const handleClose = () => {
    setSelectedIds(new Set())
    onClose()
  }

  const selectedTotal = React.useMemo(() => {
    return availableActivities
      .filter(a => selectedIds.has(a.id))
      .reduce((sum, a) => sum + (a.institution_requested_amount || 0), 0)
  }, [availableActivities, selectedIds])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Plus className="w-5 h-5 text-gray-700" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {availableActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Nenhuma atividade disponível
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {filterSubsidized 
                  ? "Não há atividades subsidiadas disponíveis para seleção."
                  : "Não há atividades disponíveis para seleção."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Select All */}
              <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedIds.size === availableActivities.length && availableActivities.length > 0}
                    onCheckedChange={toggleAll}
                    className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-100 data-[state=checked]:border-gray-900 dark:data-[state=checked]:border-gray-100"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selecionar todas ({selectedIds.size}/{availableActivities.length})
                  </span>
                </div>
                {selectedIds.size > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {formatCurrency(selectedTotal)}
                  </Badge>
                )}
              </div>

              {/* Activities List */}
              <div className="space-y-2">
                {availableActivities.map(activity => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isSelected={selectedIds.has(activity.id)}
                    onToggle={toggleActivity}
                    showCheckbox={true}
                    compact={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>
                  {selectedIds.size} {selectedIds.size === 1 ? "atividade" : "atividades"}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} size="sm">
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={selectedIds.size === 0}
              className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Confirmar ({selectedIds.size})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
