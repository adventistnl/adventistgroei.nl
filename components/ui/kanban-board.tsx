"use client"

import React, { useState, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { 
  Plus, 
  MoreHorizontal,
  Save,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreateFundingPolicyGroupModal } from "@/components/modals/funding-policy-group"
import toast from "react-hot-toast"

// Generic interfaces for the Kanban board
export interface KanbanGroup {
  id: string
  name: string
  description?: string
  color: string
  active?: boolean
  [key: string]: any // Allow additional properties
}

export interface KanbanItem {
  id: string
  groupId: string // Which group/column this item belongs to
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  metadata?: Record<string, any> // Any additional data
  [key: string]: any // Allow additional properties
}

export interface KanbanAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  onClick: (group: KanbanGroup, item?: KanbanItem) => void
  variant?: 'default' | 'destructive'
  showInGroup?: boolean // Show in group header dropdown
  showInItem?: boolean // Show in item dropdown
}

export interface KanbanBoardProps {
  /**
   * Groups/columns for the Kanban board
   */
  groups: KanbanGroup[]
  /**
   * Items to display in the Kanban board
   */
  items: KanbanItem[]
  /**
   * Actions available for groups and items
   */
  actions?: KanbanAction[]
  /**
   * Callback when an item is moved between groups (optimistic update)
   */
  onItemMove?: (itemId: string, fromGroupId: string, toGroupId: string) => void
  /**
   * Callback when save changes button is clicked
   */
  onSaveChanges?: (changes: Array<{
    itemId: string
    fromGroupId: string
    toGroupId: string
  }>) => Promise<void>
  /**
   * Render function for save changes button (receives hasPendingChanges and onSave callback)
   */
  renderSaveButton?: (hasPendingChanges: boolean, onSave: () => void, onDiscard: () => void, isSaving: boolean) => ReactNode
  /**
   * Custom render function for item cards - receives drag handlers as third parameter
   */
  renderItem?: (item: KanbanItem, group: KanbanGroup, dragHandlers?: {
    onDragStart: (e: React.DragEvent) => void
    onDragEnd: (e: React.DragEvent) => void
    draggable: boolean
    className?: string
  }) => ReactNode
  /**
   * Custom render function for group headers
   */
  renderGroupHeader?: (group: KanbanGroup) => ReactNode
  /**
   * Custom render function for empty group state
   */
  renderEmptyGroup?: (group: KanbanGroup) => ReactNode
  /**
   * Custom render function for add new group area
   */
  renderAddGroup?: () => ReactNode
  /**
   * Whether drag and drop is enabled
   */
  enableDragDrop?: boolean
  /**
   * Loading state
   */
  isLoading?: boolean
  /**
   * Custom className for the container
   */
  className?: string
  /**
   * Maximum height for the Kanban container
   */
  maxHeight?: string
}

export function KanbanBoard({
  groups,
  items,
  actions = [],
  onItemMove,
  onSaveChanges,
  renderSaveButton,
  renderItem,
  renderGroupHeader,
  renderEmptyGroup,
  renderAddGroup,
  enableDragDrop = true,
  isLoading = false,
  className = "",
  maxHeight = "calc(100vh - 200px)"
}: KanbanBoardProps) {
  const { t } = useTranslation()
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null)
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Array<{
    itemId: string
    fromGroupId: string
    toGroupId: string
  }>>([])
  const [isSaving, setIsSaving] = useState(false)

  // Group items by their groupId
  const itemsByGroup = items.reduce((acc, item) => {
    if (!acc[item.groupId]) {
      acc[item.groupId] = []
    }
    acc[item.groupId].push(item)
    return acc
  }, {} as Record<string, KanbanItem[]>)

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, item: KanbanItem) => {
    if (!enableDragDrop) return
    setDraggingItemId(item.id)
    e.dataTransfer.setData('text/plain', JSON.stringify({
      itemId: item.id,
      fromGroupId: item.groupId
    }))
    // Add visual feedback
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    if (!enableDragDrop) return
    e.preventDefault()
    setDragOverGroupId(groupId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!enableDragDrop) return
    e.preventDefault()
    // Only clear if we're leaving the entire drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverGroupId(null)
    }
  }

  const handleDragEnd = () => {
    if (!enableDragDrop) return
    setDraggingItemId(null)
    setDragOverGroupId(null)
  }

  const handleDrop = (e: React.DragEvent, toGroupId: string) => {
    if (!enableDragDrop) return
    e.preventDefault()
    setDragOverGroupId(null)
    setDraggingItemId(null)
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      const { itemId, fromGroupId } = data
      
      if (fromGroupId !== toGroupId) {
        // Add to pending changes instead of saving immediately
        setPendingChanges(prev => {
          // Check if this item already has a pending change
          const existingIndex = prev.findIndex(change => change.itemId === itemId)
          if (existingIndex >= 0) {
            // Update existing change
            const updated = [...prev]
            updated[existingIndex] = { itemId, fromGroupId: prev[existingIndex].fromGroupId, toGroupId }
            return updated
          }
          // Add new change
          return [...prev, { itemId, fromGroupId, toGroupId }]
        })
        
        // Apply the change optimistically (visual update only)
        if (onItemMove) {
          onItemMove(itemId, fromGroupId, toGroupId)
        }
      }
    } catch (error) {
      console.error('Error parsing drag data:', error)
    }
  }

  const handleSaveChanges = async () => {
    if (pendingChanges.length === 0) return
    
    setIsSaving(true)
    try {
      if (onSaveChanges) {
        await onSaveChanges(pendingChanges)
      } else {
        // Default behavior - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      toast.success(`${pendingChanges.length} change${pendingChanges.length > 1 ? 's' : ''} saved successfully!`, {
        duration: 2000,
        icon: '✅'
      })
      
      setPendingChanges([])
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscardChanges = () => {
    // Reload the page or refetch data to revert visual changes
    window.location.reload()
  }

  // Handle create group modal
  const handleCreateGroupClick = () => {
    setIsCreateGroupModalOpen(true)
  }

  const handleCreateGroupSuccess = (group: any) => {
    const createGroupAction = actions.find(action => action.label.toLowerCase().includes('group'))
    if (createGroupAction) {
      const newGroup = {
        id: group.id,
        name: group.name,
        description: group.description || '',
        color: '#f97316', // orange color for funding policy groups
        active: group.is_active
      }
      createGroupAction.onClick(newGroup as KanbanGroup)
    }
  }

  // Default item renderer
  const defaultRenderItem = (item: KanbanItem, group: KanbanGroup) => {
    const IconComponent = item.icon
    const groupActions = actions.filter(action => action.showInItem)
    
    return (
      <Card 
        key={item.id}
        className={`relative w-full p-3 border hover:border-foreground/20 transition-all duration-200 bg-card/50 ${
          enableDragDrop ? 'cursor-grab active:cursor-grabbing hover:shadow-sm' : ''
        } ${draggingItemId === item.id ? 'opacity-50 scale-95' : ''}`}
        draggable={enableDragDrop}
        onDragStart={(e) => handleDragStart(e, item)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {IconComponent && (
              <IconComponent className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0 space-y-1.5">
              <h4 className="font-medium text-sm leading-tight line-clamp-2">{item.title}</h4>
              
              {item.metadata?.type && (
                <StatusBadge 
                  label={item.metadata.type}
                  variant="neutral"
                  size="sm"
                />
              )}
            </div>
          </div>
          
          {groupActions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {groupActions.map((action) => (
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

  // Default group header renderer
  const defaultRenderGroupHeader = (group: KanbanGroup) => {
    const groupItems = itemsByGroup[group.id] || []
    const groupActions = actions.filter(action => action.showInGroup)
    
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div 
            className="w-2 h-2 rounded-full flex-shrink-0" 
            style={{ backgroundColor: group.color }}
          />
          <CardTitle className="text-base font-semibold truncate">{group.name}</CardTitle>
          <StatusBadge 
            label={`${groupItems.length}`}
            variant="neutral"
            size="sm"
            className="flex-shrink-0"
          />
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {group.active !== false && (
            <StatusBadge 
              label="Active"
              variant="success"
              showDot
              size="sm"
            />
          )}
          
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
    )
  }

  // Default empty group renderer
  const defaultRenderEmptyGroup = (group: KanbanGroup) => {
    const addItemAction = actions.find(action => action.showInGroup && action.label.toLowerCase().includes('add'))
    
    return (
      <div className={`text-center py-6 text-muted-foreground transition-all duration-200 ${
        dragOverGroupId === group.id ? 'text-foreground border-2 border-dashed rounded-lg' : ''
      }`}>
        <p className="text-xs">
          {dragOverGroupId === group.id && draggingItemId ? t('kanban.dropItemHere') : t('kanban.noItemsYet')}
        </p>
        
        {!draggingItemId && addItemAction && (
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

  // Default add group renderer
  const defaultRenderAddGroup = () => {
    const addGroupAction = actions.find(action => action.label.toLowerCase().includes('group'))
    
    if (!addGroupAction) return null
    
    return (
      <div className="flex-shrink-0 w-80">
        <Button
          variant="outline"
          className="h-full min-h-[300px] w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
          onClick={handleCreateGroupClick}
        >
          <div className="text-center">
            <Plus className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">{t('kanban.addNewGroup')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('kanban.createNewGroup')}
            </p>
          </div>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-80">
                <Card className="h-full">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...Array(2)].map((_, j) => (
                        <div key={j} className="h-20 bg-muted rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`kanban-board ${className}`}>
      {/* Pending Changes Notification - Fixed Position */}
      {pendingChanges.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="shadow-xl border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  <div className="text-sm">
                    <span className="font-semibold">{pendingChanges.length}</span>
                    <span className="text-muted-foreground ml-1">
                      unsaved change{pendingChanges.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDiscardChanges}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Main container - contained within viewport */}
      <div 
        className="overflow-x-auto overflow-y-hidden w-full px-6 py-4"
        style={{ maxHeight }}
      >
        {/* Horizontal scrolling container for groups */}
        <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
          {groups.map((group) => {
            const groupItems = itemsByGroup[group.id] || []
            
            return (
              <div key={group.id} className="flex-shrink-0 w-80">
                <Card 
                  className={`h-full transition-all duration-200 ${
                    dragOverGroupId === group.id ? 'ring-1 ring-foreground/20 bg-muted/20' : ''
                  } ${draggingItemId ? 'border-dashed' : ''}`}
                  onDragOver={(e) => handleDragOver(e, group.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, group.id)}
                >
                  <CardHeader className="p-4 pb-3">
                    {renderGroupHeader ? renderGroupHeader(group) : defaultRenderGroupHeader(group)}
                    
                    {group.description && (
                      <CardDescription className="text-xs mt-2 line-clamp-2">
                        {group.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <Separator />
                  
                  <CardContent 
                    className={`p-4 transition-all duration-200 ${
                      dragOverGroupId === group.id ? 'bg-muted/30' : ''
                    }`}
                  >
                    {/* Drop zone indicator */}
                    {draggingItemId && dragOverGroupId === group.id && (
                      <div className="mb-3 p-2 border border-dashed rounded-md text-center bg-muted/50">
                        <p className="text-xs text-muted-foreground">{t('kanban.dropItemHere')}</p>
                      </div>
                    )}
                    
                    {/* Container for items */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {groupItems.length > 0 ? (
                        groupItems.map((item) => {
                          if (renderItem) {
                            const dragHandlers = enableDragDrop ? {
                              onDragStart: (e: React.DragEvent) => handleDragStart(e, item),
                              onDragEnd: handleDragEnd,
                              draggable: true,
                              className: draggingItemId === item.id ? 'opacity-50 scale-95' : ''
                            } : undefined
                            return renderItem(item, group, dragHandlers)
                          }
                          return defaultRenderItem(item, group)
                        })
                      ) : (
                        renderEmptyGroup ? renderEmptyGroup(group) : defaultRenderEmptyGroup(group)
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
          
          {/* Add new group column */}
          {renderAddGroup ? renderAddGroup() : defaultRenderAddGroup()}
        </div>
      </div>

      {/* Create Funding Policy Group Modal */}
      <CreateFundingPolicyGroupModal
        isOpen={isCreateGroupModalOpen}
        onOpenChange={setIsCreateGroupModalOpen}
        onSuccess={handleCreateGroupSuccess}
      />
    </div>
  )
}

export default KanbanBoard