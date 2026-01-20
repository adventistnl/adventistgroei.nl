"use client"

import React, { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { X, List, LayoutGrid, Maximize2 } from "lucide-react"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { PrivacyConfig } from "@/contexts/privacy-context"

export type ViewMode = 'table' | 'kanban'

interface ExpandedViewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  itemCount?: number
  itemCountLabel?: string
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  tableViewLabel?: string
  kanbanViewLabel?: string
  expandLabel?: string
  children: ReactNode
  showViewToggle?: boolean
  width?: string
  height?: string
  tablePrivacyConfig?: PrivacyConfig
  kanbanPrivacyConfig?: PrivacyConfig
}

export function ExpandedViewModal({
  isOpen,
  onClose,
  title,
  itemCount,
  itemCountLabel = 'items',
  viewMode,
  onViewModeChange,
  tableViewLabel = 'Table',
  kanbanViewLabel = 'Kanban',
  expandLabel = 'Expand View',
  children,
  showViewToggle = true,
  width = '95vw',
  height = '95vh',
  tablePrivacyConfig,
  kanbanPrivacyConfig
}: ExpandedViewModalProps) {
  if (!isOpen) return null

  const ViewToggle = () => (
    <div className="flex items-center gap-2">
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === 'table' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('table')}
          className={viewMode === 'table' ? 'rounded-r-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'rounded-r-none'}
        >
          <List className="h-4 w-4 mr-2" />
          {/* {tableViewLabel} */}
        </Button>
        <Button
          variant={viewMode === 'kanban' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewModeChange('kanban')}
          className={viewMode === 'kanban' ? 'rounded-l-none bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200' : 'rounded-l-none'}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          {/* {kanbanViewLabel} */}
        </Button>
      </div>
    </div>
  )

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div 
        className="bg-background border rounded-lg shadow-2xl flex flex-col" 
        style={{ width, height }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="border-b p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">
              {title}
            </h2>
            {itemCount !== undefined && (
              <div className="text-sm text-muted-foreground">
                {itemCount} {itemCountLabel}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {viewMode === 'table' && tablePrivacyConfig && (
              <InlinePrivacyToggle 
                config={tablePrivacyConfig}
                className="w-8 h-8"
              />
            )}
            {viewMode === 'kanban' && kanbanPrivacyConfig && (
              <InlinePrivacyToggle 
                config={kanbanPrivacyConfig}
                className="w-8 h-8"
              />
            )}
            {showViewToggle && <ViewToggle />}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
