"use client"

import React, { useState, useEffect, useRef } from "react"
import { X, ChevronUp, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { InlineBatchEditor, BatchEditField } from "@/components/shared/inline-batch-editor"

export interface BatchAction {
  id: string
  label: string
  icon?: React.ReactNode
  onClick: () => void
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive"
  disabled?: boolean
}

interface BatchActionsPanelProps {
  selectedCount: number
  onClearSelection: () => void
  actions: BatchAction[]
  className?: string
  summary?: React.ReactNode
  primaryAction?: BatchAction
  editFields?: BatchEditField[]
  maxVisibleEditFields?: number
}

export function BatchActionsPanel({
  selectedCount,
  onClearSelection,
  actions,
  className,
  summary,
  primaryAction,
  editFields,
  maxVisibleEditFields = 4
}: BatchActionsPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [visibleActions, setVisibleActions] = useState<BatchAction[]>([])
  const [overflowActions, setOverflowActions] = useState<BatchAction[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate visible actions based on available space
  useEffect(() => {
    const calculateVisibleActions = () => {
      if (!containerRef.current) return
      
      const containerWidth = containerRef.current.offsetWidth
      // Reserve space for: selection badge (200px) + clear button (40px) + summary (variable) + controls (100px) + more button (40px) + primary action (200px)
      const reservedSpace = 580
      const availableSpace = containerWidth - reservedSpace
      
      // Each action button is approximately 120px
      const buttonWidth = 120
      const maxVisibleActions = Math.max(0, Math.floor(availableSpace / buttonWidth))
      
      if (maxVisibleActions >= actions.length) {
        setVisibleActions(actions)
        setOverflowActions([])
      } else {
        setVisibleActions(actions.slice(0, maxVisibleActions))
        setOverflowActions(actions.slice(maxVisibleActions))
      }
    }

    calculateVisibleActions()
    window.addEventListener('resize', calculateVisibleActions)
    return () => window.removeEventListener('resize', calculateVisibleActions)
  }, [actions])

  if (selectedCount === 0) return null

  if (isMinimized) {
    return (
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out cursor-pointer"
        onClick={() => setIsMinimized(false)}
        style={{
          left: "calc(50% + var(--sidebar-width, 0px) / 2)",
        }}
      >
        <Card className="rounded-b-none border border-b-0 shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-2 px-4 py-2">
            <Badge 
              variant="secondary" 
              className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs px-2 py-0.5"
            >
              {selectedCount}
            </Badge>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {selectedCount === 1 ? 'item' : 'itens'}
            </span>
            <ChevronUp className="h-3 w-3 text-gray-500 dark:text-gray-400" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        className
      )}
      style={{
        left: "var(--sidebar-width, 0px)",
      }}
    >
        <div className="mx-auto px-6 pb-6">
          <Card 
            ref={containerRef}
            className="border shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 w-[90%] mx-auto"
          >
            {/* Single Row with Everything */}
            <div className="px-6 py-3">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Selection Badge with "rows selected" text */}
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 text-sm px-3 py-1 font-medium"
                  >
                    {selectedCount}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {selectedCount === 1 ? 'row selected' : 'rows selected'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 ml-1"
                    title="Limpar seleção"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

                {/* Inline Batch Editor */}
                {editFields && editFields.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <InlineBatchEditor fields={editFields} maxVisibleFields={maxVisibleEditFields} />
                    </div>
                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
                  </>
                )}

                {/* Visible Actions */}
                {visibleActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="h-8 gap-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 px-3"
                  >
                    {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}

                {/* Overflow Menu */}
                {overflowActions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 px-3"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        More
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {overflowActions.map((action) => (
                        <DropdownMenuItem
                          key={action.id}
                          onClick={action.onClick}
                          disabled={action.disabled}
                          className="gap-2 cursor-pointer"
                        >
                          {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Spacer */}
                <div className="flex-1 min-w-[20px]" />

                {/* Minimize Button - Standalone, not in dropdown */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMinimized(!isMinimized)
                  }}
                  className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  title={isMinimized ? "Mostrar painel" : "Minimizar painel"}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>

                {/* Primary Action */}
                {primaryAction && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    className="h-8 gap-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium px-4 text-sm"
                  >
                    {primaryAction.icon && <span className="w-4 h-4">{primaryAction.icon}</span>}
                    {primaryAction.label}
                  </Button>
                )}
              </div>

              {/* Summary Row Below - Small and Faded */}
              {summary && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-500 opacity-60">
                    {summary}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
  )
}
