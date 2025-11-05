import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ColorBadgeProps {
  color: string
  label?: string
  showHex?: boolean
  className?: string
}

export const ColorBadge: React.FC<ColorBadgeProps> = ({ 
  color, 
  label,
  showHex = true,
  className
}) => {
  return (
    <Badge 
      variant="outline"
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 text-gray-600 border-gray-200",
        "dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
        className
      )}
    >
      <div 
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {showHex && (
        <span className="text-xs font-mono font-medium">
          {label || color}
        </span>
      )}
    </Badge>
  )
}
