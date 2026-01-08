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
  isDisabled?: boolean
  disabledReason?: string
}

export function ActivityCard({
  activity,
  isSelected = false,
  onToggle,
  showCheckbox = true,
  compact = true,
  className,
  isDisabled = false,
  disabledReason
}: ActivityCardProps) {
  const { formatCurrency, selectedCurrency } = useCurrency()

  const handleClick = () => {
    if (onToggle && !isDisabled) {
      onToggle(activity.id)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 p-3 border rounded-md transition-colors",
        isDisabled 
          ? "border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/20 cursor-not-allowed opacity-70"
          : isSelected
            ? "border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800/50 cursor-pointer"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer",
        className
      )}
    >
      {/* Subsidy Status Icon - Extrema Esquerda */}
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          activity.is_subsidized 
            ? 'bg-green-100 border-2 border-green-300 dark:bg-green-950 dark:border-green-800' 
            : 'bg-gray-100 border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
        }`}>
          <span className={`text-sm font-bold ${
            activity.is_subsidized ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
          }`}>
            {selectedCurrency.symbol}
          </span>
        </div>
      </div>

      {showCheckbox && (
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => !isDisabled && onToggle?.(activity.id)}
          disabled={isDisabled}
          className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-100 data-[state=checked]:border-gray-900 dark:data-[state=checked]:border-gray-100"
        />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {activity.name}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 flex flex-col items-end gap-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {formatCurrency(activity.budget_amount)}
        </p>
        
        {disabledReason && (
          <Badge variant="secondary" className="text-xs">
            {disabledReason}
          </Badge>
        )}
        
        {!disabledReason && activity.institution_requested_amount && activity.institution_requested_amount > 0 && (
          <p className="text-xs text-green-600 dark:text-green-500 font-medium">
            {formatCurrency(activity.institution_requested_amount)}
          </p>
        )}
      </div>
    </div>
  )
}
