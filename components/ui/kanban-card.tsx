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
import { getStatusStyleFromGroup, KANBAN_SPACING, getBgColorWithOpacity } from "@/lib/kanban-styles"
import { AdvanceSubsidyBadge } from "@/components/ui/advance-subsidy-badge"

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
  
  // Get standardized status style
  const statusStyle = getStatusStyleFromGroup(group)

  return (
    <Card 
      className={`relative w-full transition-all duration-200 bg-card hover:shadow-md ${
        enableDragDrop ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${isDragging ? 'opacity-50 scale-95 shadow-xl' : 'shadow-sm'}`}
      style={{ 
        borderLeftWidth: KANBAN_SPACING.borderWidth,
        borderLeftColor: statusStyle.borderColor,
        borderColor: isDragging ? statusStyle.hoverBorderColor : '#e5e7eb',
        borderWidth: '1px',
        borderLeftStyle: 'solid',
        padding: KANBAN_SPACING.cardPadding,
        margin: KANBAN_SPACING.cardMargin,
        backgroundColor: isDragging ? getBgColorWithOpacity(statusStyle.borderColor, 0.05) : undefined
      }}
      draggable={enableDragDrop}
      onDragStart={(e) => onDragStart?.(e, item)}
      onDragEnd={onDragEnd}
      onMouseEnter={(e) => {
        if (!isDragging && enableDragDrop) {
          e.currentTarget.style.borderLeftColor = statusStyle.hoverBorderColor
          e.currentTarget.style.backgroundColor = getBgColorWithOpacity(statusStyle.borderColor, 0.03)
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.borderLeftColor = statusStyle.borderColor
          e.currentTarget.style.backgroundColor = 'transparent'
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {IconComponent && (
            <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                {item.title}
              </h4>
              <AdvanceSubsidyBadge isForAdvance={item.metadata?.is_for_advance} />
            </div>
            
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
