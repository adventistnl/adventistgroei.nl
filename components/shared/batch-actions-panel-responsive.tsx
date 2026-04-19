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
import { useTranslation } from "react-i18next"
import { useCurrency } from "@/contexts/currency-context"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { useHasPermission } from "@/hooks/use-has-permission"

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
  /** Show currency values in summary */
  showCurrency?: boolean
  /** Custom translations namespace */
  translationNamespace?: string
  /** Force mobile layout */
  forceMobileLayout?: boolean
}

export function BatchActionsPanelResponsive({
  selectedCount,
  onClearSelection,
  actions,
  className,
  summary,
  primaryAction,
  editFields,
  maxVisibleEditFields = 4,
  showCurrency = false,
  translationNamespace = "batchActions",
  forceMobileLayout = false
}: BatchActionsPanelProps) {
  const { t, i18n } = useTranslation()
  const { formatCurrency, selectedCurrency } = useCurrency()
  
  // Verificar permissão para batch editing
  const hasUpdatePermission = useHasPermission([PermissionResolverName.UpdateProjectActivity])
  
  const [isMinimized, setIsMinimized] = useState(false)
  const [visibleActions, setVisibleActions] = useState<BatchAction[]>([])
  const [overflowActions, setOverflowActions] = useState<BatchAction[]>([])
  const [isMobileView, setIsMobileView] = useState(false)
  const [isTabletView, setIsTabletView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Detect screen size and set responsive states
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobileView(forceMobileLayout || width < 640) // sm breakpoint
      setIsTabletView(width >= 640 && width < 1024) // md breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [forceMobileLayout])

  // Calculate visible actions based on available space and screen size
  useEffect(() => {
    const calculateVisibleActions = () => {
      if (!containerRef.current) return
      
      // Mobile: Show only primary action and more menu
      if (isMobileView) {
        setVisibleActions([])
        setOverflowActions(actions)
        return
      }
      
      // Tablet: Show fewer actions
      if (isTabletView) {
        const maxTabletActions = Math.min(2, actions.length)
        setVisibleActions(actions.slice(0, maxTabletActions))
        setOverflowActions(actions.slice(maxTabletActions))
        return
      }
      
      // Desktop: Calculate based on available space
      const containerWidth = containerRef.current.offsetWidth
      const reservedSpace = 580
      const availableSpace = containerWidth - reservedSpace
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
  }, [actions, isMobileView, isTabletView])

  // Get translations with fallbacks
  const getTranslation = (key: string, fallback: string = key) => {
    const translationKey = `${translationNamespace}.${key}`
    const translated = t(translationKey)
    return translated !== translationKey ? translated : t(`shared.batchActions.${key}`, fallback)
  }

  if (selectedCount === 0) return null

  if (isMinimized) {
    return (
      <div
        className={cn(
          "fixed bottom-0 z-50 transition-all duration-300 ease-in-out cursor-pointer",
          isMobileView 
            ? "left-0 right-0 w-full" 
            : "left-1/2 -translate-x-1/2"
        )}
        onClick={() => setIsMinimized(false)}
        style={!isMobileView ? {
          left: "calc(50% + var(--sidebar-width, 0px) / 2)",
        } : undefined}
      >
        <Card className={cn(
          "shadow-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow",
          isMobileView ? "rounded-none border-b-0 w-full" : "rounded-b-none border border-b-0"
        )}>
          <div className={cn(
            "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2",
            isMobileView ? "justify-center" : ""
          )}>
            <Badge 
              variant="secondary" 
              className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs px-2 py-0.5"
            >
              {selectedCount}
            </Badge>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
              {getTranslation(selectedCount === 1 ? 'itemSelected' : 'itemsSelected', 
                selectedCount === 1 ? '1 item selected' : `${selectedCount} items selected`)}
            </span>
            <ChevronUp className="h-3 w-3 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed bottom-0 z-50 transition-all duration-300 ease-in-out",
        isMobileView 
          ? "left-0 right-0 w-full h-[80vh]" // Mobile: 80% da tela
          : "left-0 right-0",
        className
      )}
      style={!isMobileView ? {
        left: "var(--sidebar-width, 0px)",
      } : undefined}
    >
      <div className={cn(
        "px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6",
        isMobileView ? "px-2 pb-2 h-full flex flex-col" : ""
      )}>
        <Card 
          ref={containerRef}
          className={cn(
            "border shadow-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
            isMobileView ? "w-full mx-0 h-full flex flex-col" : "w-[90%] mx-auto",
            isTabletView ? "w-[95%]" : ""
          )}
        >
          {/* Mobile Layout - Vertical Stack */}
          {isMobileView ? (
            <div className="px-3 py-4 space-y-4 flex-1 flex flex-col overflow-y-auto">
              {/* Selection Info Row */}
              <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 text-sm px-3 py-1 font-medium flex-shrink-0"
                  >
                    {selectedCount}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {getTranslation(selectedCount === 1 ? 'rowSelected' : 'rowsSelected', 
                      selectedCount === 1 ? 'row selected' : 'rows selected')}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                    title={getTranslation('clearSelection', 'Clear selection')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(true)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    title={getTranslation('minimizePanel', 'Minimize panel')}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Inline Batch Editor - Mobile */}
              {hasUpdatePermission && editFields && editFields.length > 0 && (
                <div className="border-t pt-4 flex-shrink-0">
                  <InlineBatchEditor fields={editFields} maxVisibleFields={2} />
                </div>
              )}

              {/* Actions Section - Mobile - Takes remaining space */}
              <div className="flex-1 flex flex-col gap-3 justify-center">
                {/* Primary Action - Full Width */}
                {primaryAction && (
                  <Button
                    variant="default"
                    size="lg"
                    onClick={primaryAction.onClick}
                    disabled={primaryAction.disabled}
                    className="w-full h-12 gap-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium text-base"
                  >
                    {primaryAction.icon && <span className="w-5 h-5">{primaryAction.icon}</span>}
                    <span className="truncate">{primaryAction.label}</span>
                  </Button>
                )}

                {/* Secondary Actions - Individual Buttons */}
                <div className="grid grid-cols-1 gap-2">
                  {actions.slice(0, 3).map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="default"
                      onClick={action.onClick}
                      disabled={action.disabled}
                      className="w-full h-10 gap-2 text-sm justify-start"
                    >
                      {action.icon && <span className="w-4 h-4 flex-shrink-0">{action.icon}</span>}
                      <span className="truncate">{action.label}</span>
                    </Button>
                  ))}
                  
                  {/* More Actions - Overflow Menu */}
                  {actions.length > 3 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="default"
                          className="w-full h-10 gap-2 text-sm justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="truncate">
                            {getTranslation('moreActions', 'More actions')} ({actions.length - 3})
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-full max-w-xs">
                        {actions.slice(3).map((action) => (
                          <DropdownMenuItem
                            key={action.id}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className="gap-2 cursor-pointer"
                          >
                            {action.icon && <span className="w-4 h-4">{action.icon}</span>}
                            <span className="truncate">{action.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              {/* Summary Row - Mobile */}
              {summary && (
                <div className="border-t pt-3 flex-shrink-0">
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    {showCurrency && typeof summary === 'string'
                      ? <span>{selectedCurrency.flag} {formatCurrency(parseFloat(summary) || 0)}</span>
                      : summary}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Desktop/Tablet Layout - Single Row */
            <div className={cn(
              "px-4 md:px-6 py-3",
              isTabletView ? "px-4 py-3" : ""
            )}>
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                {/* Selection Badge */}
                <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                  <Badge 
                    variant="secondary" 
                    className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 text-sm px-3 py-1 font-medium"
                  >
                    {selectedCount}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {getTranslation(selectedCount === 1 ? 'rowSelected' : 'rowsSelected', 
                      selectedCount === 1 ? 'row selected' : 'rows selected')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 ml-1"
                    title={getTranslation('clearSelection', 'Clear selection')}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Separator */}
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />

                {/* Inline Batch Editor */}
                {hasUpdatePermission && editFields && editFields.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <InlineBatchEditor 
                        fields={editFields} 
                        maxVisibleFields={isTabletView ? 2 : maxVisibleEditFields} 
                      />
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
                    className={cn(
                      "h-8 gap-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800",
                      isTabletView ? "px-2" : "px-3"
                    )}
                  >
                    {action.icon && <span className="w-4 h-4 flex-shrink-0">{action.icon}</span>}
                    <span className={cn("truncate", isTabletView ? "max-w-16" : "")}>
                      {action.label}
                    </span>
                  </Button>
                ))}

                {/* Overflow Menu */}
                {overflowActions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 gap-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800",
                          isTabletView ? "px-2" : "px-3"
                        )}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className={cn(
                          isTabletView ? "hidden" : "inline"
                        )}>
                          {getTranslation('more', 'More')}
                        </span>
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
                          <span className="truncate">{action.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Spacer */}
                <div className="flex-1 min-w-[20px]" />

                {/* Controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Minimize Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="h-7 w-7 p-0 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    title={getTranslation(isMinimized ? 'showPanel' : 'minimizePanel', 
                      isMinimized ? 'Show panel' : 'Minimize panel')}
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
                      className={cn(
                        "h-8 gap-1.5 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium text-sm",
                        isTabletView ? "px-3" : "px-4"
                      )}
                    >
                      {primaryAction.icon && <span className="w-4 h-4 flex-shrink-0">{primaryAction.icon}</span>}
                      <span className={cn("truncate", isTabletView ? "max-w-20" : "")}>
                        {primaryAction.label}
                      </span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Summary Row Below - Desktop/Tablet */}
              {summary && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="text-xs text-gray-500 dark:text-gray-500 opacity-60 flex items-center gap-1.5">
                    {showCurrency && typeof summary === 'string'
                      ? <><span>{selectedCurrency.flag}</span><span>{formatCurrency(parseFloat(summary) || 0)}</span><span className="text-gray-400">({selectedCurrency.code})</span></>
                      : summary}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}