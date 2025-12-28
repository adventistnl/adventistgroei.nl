"use client"

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { KanbanItem, KanbanGroup, KanbanAction } from "./kanban-board"

export interface KanbanCardProps {
  item: KanbanItem
  group: KanbanGroup
  actions?: KanbanAction[]
  isDragging?: boolean
  enableDragDrop?: boolean
  onDragStart?: (e: React.DragEvent, item: KanbanItem) => void
  onDragEnd?: () => void
}

export function KanbanCard({
  item,
  group,
  actions = [],
  isDragging = false,
  enableDragDrop = true,
  onDragStart,
  onDragEnd,
}: KanbanCardProps) {
  const IconComponent = item.icon
  const itemActions = actions.filter(action => action.showInItem)
  
  // Use group color for left border
  const borderColor = group.color || '#94a3b8'

  return (
    <Card 
      className={`relative w-full p-3 m-1 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-200 bg-card ${
        enableDragDrop ? 'cursor-grab active:cursor-grabbing' : ''
      } ${isDragging ? 'opacity-50 scale-95 shadow-xl' : ''}`}
      style={{ borderLeftWidth: '5px', borderLeftColor: borderColor }}
      draggable={enableDragDrop}
      onDragStart={(e) => onDragStart?.(e, item)}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {IconComponent && (
            <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0 space-y-1.5">
            <h4 className="font-medium text-sm leading-tight line-clamp-2">
              {item.title}
            </h4>
            
            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
            
            {item.metadata?.type && (
              <StatusBadge 
                label={item.metadata.type}
                variant="neutral"
                size="sm"
              />
            )}
          </div>
        </div>
        
        {itemActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 flex-shrink-0"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {itemActions.map((action) => (
                <DropdownMenuItem 
                  key={action.id}
                  onClick={() => action.onClick(group, item)}
                  className={action.variant === 'destructive' ? 'text-destructive' : ''}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  )
}
