"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { CardTitle, CardDescription } from "@/components/ui/card"
import { MoreHorizontal, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { KanbanGroup, KanbanAction } from "./kanban-board"

export interface KanbanGroupHeaderProps {
  group: KanbanGroup
  itemCount: number
  actions?: KanbanAction[]
}

export function KanbanGroupHeader({
  group,
  itemCount,
  actions = [],
}: KanbanGroupHeaderProps) {
  const groupActions = actions.filter(action => action.showInGroup)
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0" 
            style={{ backgroundColor: group.color }}
          />
          <CardTitle className="text-base font-semibold truncate">
            {group.name}
          </CardTitle>
          <StatusBadge 
            label={`${itemCount}`}
            variant="neutral"
            size="sm"
            className="flex-shrink-0"
          />
          {group.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0 flex-shrink-0 hover:bg-muted"
                  >
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">{group.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* {group.active !== false && (
            <StatusBadge 
              label="Active"
              variant="success"
              showDot
              size="sm"
            />
          )}
           */}
          {groupActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {groupActions.map((action) => (
                  <DropdownMenuItem 
                    key={action.id}
                    onClick={() => action.onClick(group)}
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
      </div>
    </div>
  )
}
