"use client"

import React, { useState, ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { CreateFundingPolicyGroupModal } from "@/components/modals/funding-policy-group"
import toast from "react-hot-toast"
import { KanbanCard } from "./kanban-card"
import { KanbanGroupHeader } from "./kanban-group-header"
import { KanbanEmptyState } from "./kanban-empty-state"
import { KanbanSavePanel } from "./kanban-save-panel"

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
    return (
      <KanbanCard
        key={item.id}
        item={item}
        group={group}
        actions={actions}
        isDragging={draggingItemId === item.id}
        enableDragDrop={enableDragDrop}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    )
  }

  // Default group header renderer
  const defaultRenderGroupHeader = (group: KanbanGroup) => {
    const groupItems = itemsByGroup[group.id] || []
    
    return (
      <KanbanGroupHeader
        group={group}
        itemCount={groupItems.length}
        actions={actions}
      />
    )
  }

  // Default empty group renderer
  const defaultRenderEmptyGroup = (group: KanbanGroup) => {
    return (
      <KanbanEmptyState
        group={group}
        actions={actions}
        isDragOver={dragOverGroupId === group.id}
        isDragging={!!draggingItemId}
      />
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
      {/* Save Panel */}
      <KanbanSavePanel
        pendingChangesCount={pendingChanges.length}
        isSaving={isSaving}
        onSave={handleSaveChanges}
        onDiscard={handleDiscardChanges}
      />
      
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
 
                         