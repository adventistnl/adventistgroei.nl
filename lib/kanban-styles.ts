/**
 * Kanban Board Styling Utilities
 * 
 * Centralized styling functions and constants for Kanban components
 */

import { KanbanGroup } from "@/components/ui/kanban-board"

/**
 * Spacing constants for consistent layout
 */
export const KANBAN_SPACING = {
  groupGap: 'gap-6',
  itemGap: 'space-y-2',
  groupWidth: 'w-80',
  padding: {
    card: 'p-4',
    header: 'p-4 pb-3',
    content: 'p-4'
  }
}

/**
 * Get status style configuration from group color
 * Used for StatusBadge and visual feedback
 */
export function getStatusStyleFromGroup(group: KanbanGroup) {
  // Map hex colors to status badge variants
  const colorMap: Record<string, string> = {
    '#6b7280': 'default',    // gray - pending
    '#3b82f6': 'info',       // blue - in review
    '#10b981': 'success',    // green - approved
    '#ef4444': 'destructive', // red - rejected
    '#6366f1': 'secondary',  // indigo - closed
    '#f97316': 'warning',    // orange - warning/other
  }

  return colorMap[group.color] || 'default'
}

/**
 * Convert hex color to RGB with opacity
 * Useful for background colors with transparency
 */
export function getBgColorWithOpacity(hexColor: string, opacity: number = 0.1): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')
  
  // Parse hex to RGB
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

/**
 * Get drag state classes for visual feedback
 */
export function getDragStateClasses(isDragging: boolean, isDragOver: boolean): string {
  const classes = []
  
  if (isDragging) {
    classes.push('opacity-50', 'scale-95', 'cursor-grabbing')
  }
  
  if (isDragOver) {
    classes.push('ring-2', 'ring-primary', 'ring-offset-2')
  }
  
  return classes.join(' ')
}

/**
 * Get group container classes based on state
 */
export function getGroupContainerClasses(
  isDragOver: boolean,
  isDragging: boolean,
  isActive: boolean = false
): string {
  const classes = ['transition-all', 'duration-200']
  
  if (isDragOver) {
    classes.push('ring-1', 'ring-foreground/20', 'bg-muted/20')
  }
  
  if (isDragging) {
    classes.push('border-dashed')
  }
  
  if (isActive) {
    classes.push('ring-2', 'ring-primary')
  }
  
  return classes.join(' ')
}

/**
 * Generate style object for group header badge
 */
export function getGroupBadgeStyle(color: string) {
  return {
    backgroundColor: getBgColorWithOpacity(color, 0.15),
    borderColor: color,
    color: color,
  }
}
