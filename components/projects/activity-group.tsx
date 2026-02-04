import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plus, Settings, DollarSign, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCurrency } from '@/contexts/currency-context'

export interface ProjectActivity {
  id: string
  name: string
  description: string
  budget_amount: number
  request_subsidy: boolean
  is_subsidized: boolean
  tags: string[]
}

type Props = {
  title: string
  activities: ProjectActivity[]
  groupType?: 'subsidized' | 'nonSubsidized' | 'trash'
  onMove?: (activityId: string, toGroup: 'subsidized' | 'nonSubsidized' | 'trash') => void
  onRestore?: (activityId: string) => void
  onDelete?: (activityId: string) => void
  onEdit?: (activityId: string) => void
  onClearAll?: () => void
  isTrash?: boolean
  allowDrop?: boolean
  defaultCollapsed?: boolean
  translations?: any
  renderTagWithIcon?: (tag: string, className?: string) => React.ReactNode
}

export default function ActivityGroup({
  title,
  activities,
  groupType = 'subsidized',
  onMove,
  onRestore,
  onDelete,
  onEdit,
  onClearAll,
  isTrash = false,
  allowDrop = true,
  defaultCollapsed = false,
  translations,
  renderTagWithIcon
}: Props) {
  const { formatCurrency } = useCurrency()
  const [draggedOver, setDraggedOver] = useState(false)
  const [draggingActivityId, setDraggingActivityId] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const totalBudget = activities.reduce((sum, act) => sum + act.budget_amount, 0)

  const handleDragStart = (e: React.DragEvent, activityId: string) => {
    e.dataTransfer.setData('text/plain', activityId)
    setDraggingActivityId(activityId)
  }

  const handleDragEnd = () => {
    setDraggingActivityId(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (allowDrop) {
      e.preventDefault()
      setDraggedOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOver(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDraggedOver(false)
    if (!allowDrop || !onMove) return
    const activityId = e.dataTransfer.getData('text/plain')
    const targetGroup = isTrash ? 'trash' : groupType
    onMove(activityId, targetGroup)
  }

  return (
    <div
      className={cn(
        'border-2 rounded-lg bg-card rounded-xl  shadow-sm transition-all duration-200',
        draggedOver && allowDrop
          ? 'border-primary border-dashed bg-primary/10 shadow-lg transform scale-[1.02]'
          : 'border-border',
        isTrash && 'border-red-200 bg-red-50',
        allowDrop && 'hover:border-primary/50'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="font-medium flex items-center gap-2 hover:text-primary transition-colors"
          >
            {isTrash ? (
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <X className="w-3 h-3 text-red-600" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-3 h-3 text-primary" />
              </div>
            )}
            {title}
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                !isCollapsed && 'rotate-90'
              )}
            />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="font-mono">
                {formatCurrency(totalBudget)}
              </Badge>
            </div>
            {isTrash && activities.length > 0 && onClearAll && (
              <Button
                size="sm"
                variant="outline"
                onClick={onClearAll}
                className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                <X className="w-3 h-3 mr-1" />
                {(translations as any)?.activityGroups?.clearAll || 'Limpar Tudo'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                {isTrash ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </div>
              <p className="text-sm">
                {isTrash
                  ? ((translations as any)?.activityGroups?.emptyTrash || 'Lixeira vazia')
                  : ((translations as any)?.activityGroups?.emptyGroup || 'Nenhuma atividade neste grupo')}
              </p>
              {!isTrash && (
                <p className="text-xs text-muted-foreground mt-1">
                  {(translations as any)?.activityGroups?.dragAndDrop || 'Arraste atividades entre grupos'}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  draggable={!isTrash}
                  onDragStart={(e) => handleDragStart(e, activity.id)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'p-3 border-2 rounded-lg transition-all duration-200',
                    'hover:shadow-sm cursor-move',
                    isTrash ? 'border-red-200 bg-red-50/50' : 'border-border',
                    draggingActivityId === activity.id && 'opacity-50 transform scale-95'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm truncate">{activity.name}</h5>
                        <Badge variant="outline" className="text-xs font-mono shrink-0">
                          {formatCurrency(activity.budget_amount)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {activity.description}
                      </p>
                      {activity.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {activity.tags.map((tag) => renderTagWithIcon ? renderTagWithIcon(tag, 'h-5') : null)}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-3 shrink-0">
                      {isTrash ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onRestore?.(activity.id)}
                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onEdit?.(activity.id)}
                            className="h-7 w-7 p-0"
                          >
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete?.(activity.id)}
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
