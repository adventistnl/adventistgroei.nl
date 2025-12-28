"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { KanbanGroup, KanbanAction } from "./kanban-board"

export interface KanbanEmptyStateProps {
  group: KanbanGroup
  actions?: KanbanAction[]
  isDragOver?: boolean
  isDragging?: boolean
}

export function KanbanEmptyState({
  group,
  actions = [],
  isDragOver = false,
  isDragging = false,
}: KanbanEmptyStateProps) {
  const { t } = useTranslation()
  const addItemAction = actions.find(
    action => action.showInGroup && action.label.toLowerCase().includes('add')
  )
  
  return (
    <div className={`text-center py-6 text-muted-foreground transition-all duration-200 ${
      isDragOver ? 'text-foreground border-2 border-dashed rounded-lg' : ''
    }`}>
      <p className="text-xs">
        {isDragOver && isDragging 
          ? t('kanban.dropItemHere') 
          : t('kanban.noItemsYet')
        }
      </p>
      
      {!isDragging && addItemAction && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2 h-7 text-xs"
          onClick={() => addItemAction.onClick(group)}
        >
          <Plus className="w-3 h-3 mr-1" />
          {t('kanban.addFirstItem')}
        </Button>
      )}
    </div>
  )
}
