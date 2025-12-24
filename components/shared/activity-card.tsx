"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useCurrency } from "@/contexts/currency-context"
import { ProjectActivityData } from "@/components/projects/project-activities-table"
import { cn } from "@/lib/utils"

interface ActivityCardProps {
  activity: ProjectActivityData
  isSelected?: boolean
  onToggle?: (id: string) => void
  showCheckbox?: boolean
  compact?: boolean
  className?: string
}

export function ActivityCard({
  activity,
  isSelected = false,
  onToggle,
  showCheckbox = true,
  compact = true,
  className
}: ActivityCardProps) {
  const { formatCurrency } = useCurrency()

  const handleClick = () => {
    if (onToggle) {
      onToggle(activity.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors",
        isSelected
          ? "border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800/50"
          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/30",
        className
      )}
    >
      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle?.(activity.id)}
          className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-100 data-[state=checked]:border-gray-900 dark:data-[state=checked]:border-gray-100"
        />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {activity.name}
          </p>
          {activity.is_subsidized && (
            <Badge 
              variant="outline" 
              className="text-xs border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30"
            >
              Subsidiada
            </Badge>
          )}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {formatCurrency(activity.budget_amount)}
        </p>
        {activity.institution_requested_amount && activity.institution_requested_amount > 0 && (
          <p className="text-xs text-green-600 dark:text-green-500 font-medium">
            {formatCurrency(activity.institution_requested_amount)}
          </p>
        )}
      </div>
    </div>
  )
}
