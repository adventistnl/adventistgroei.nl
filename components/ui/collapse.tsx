import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapseProps {
  trigger: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  triggerClassName?: string
  contentClassName?: string
  animated?: boolean
  disabled?: boolean
}

export function Collapse({
  trigger,
  children,
  defaultOpen = false,
  className,
  triggerClassName,
  contentClassName,
  animated = true,
  disabled = false
}: CollapseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between p-3 text-left',
          'hover:bg-accent/50 transition-colors rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          triggerClassName
        )}
        aria-expanded={isOpen}
        aria-controls="collapse-content"
      >
        <div className="flex-1">{trigger}</div>
        {!disabled && (
          <div className={cn(
            'ml-2 transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </button>

      {/* Content */}
      <div
        id="collapse-content"
        className={cn(
          'overflow-hidden transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
          !animated && (isOpen ? 'block' : 'hidden'),
          contentClassName
        )}
        aria-hidden={!isOpen}
      >
        <div className="p-3 pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// Alternative simple version without animation
export function SimpleCollapse({
  trigger,
  children,
  defaultOpen = false,
  className,
  triggerClassName,
  contentClassName
}: Omit<CollapseProps, 'animated' | 'disabled'>) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('w-full', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between p-2 text-left',
          'hover:bg-accent/50 transition-colors rounded-md',
          'focus:outline-none focus:ring-1 focus:ring-primary',
          triggerClassName
        )}
      >
        <div className="flex-1">{trigger}</div>
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground transition-transform duration-150',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      {isOpen && (
        <div className={cn('p-2 pt-0', contentClassName)}>
          {children}
        </div>
      )}
    </div>
  )
}