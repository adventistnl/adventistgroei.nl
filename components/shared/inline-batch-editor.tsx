"use client"

import React, { useState, useEffect, useRef } from "react"
import { MoreHorizontal, DollarSign, Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface BatchEditField {
  id: string
  label: string
  type: "select" | "switch"
  options?: Array<{ value: string; label: string }>
  value?: string | boolean
  onChange: (value: string | boolean) => void
  getBadgeVariant?: (value: string) => string
  showLabel?: boolean
  infoTooltip?: string
}

interface InlineBatchEditorProps {
  fields: BatchEditField[]
  maxVisibleFields?: number
  className?: string
}

export function InlineBatchEditor({
  fields,
  maxVisibleFields = 3,
  className = ""
}: InlineBatchEditorProps) {
  const [visibleFields, setVisibleFields] = useState<BatchEditField[]>([])
  const [overflowFields, setOverflowFields] = useState<BatchEditField[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate visible fields based on available space
  useEffect(() => {
    const calculateVisibleFields = () => {
      if (!containerRef.current) return
      
      const containerWidth = containerRef.current.offsetWidth
      // Each field is approximately 200px
      const fieldWidth = 200
      const moreButtonWidth = 100
      const availableSpace = containerWidth - moreButtonWidth
      
      const maxVisible = Math.max(1, Math.min(
        maxVisibleFields,
        Math.floor(availableSpace / fieldWidth)
      ))
      
      if (maxVisible >= fields.length) {
        setVisibleFields(fields)
        setOverflowFields([])
      } else {
        setVisibleFields(fields.slice(0, maxVisible))
        setOverflowFields(fields.slice(maxVisible))
      }
    }

    calculateVisibleFields()
    window.addEventListener('resize', calculateVisibleFields)
    return () => window.removeEventListener('resize', calculateVisibleFields)
  }, [fields, maxVisibleFields])

  const getBadgeClassName = (field: BatchEditField, value: string | boolean): string => {
    if (field.type === 'switch') {
      return value 
        ? 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-300 bg-green-50 dark:bg-green-950/20'
        : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
    }

    // For selects, use custom variant if provided
    if (field.getBadgeVariant && typeof value === 'string') {
      const variant = field.getBadgeVariant(value)
      const variantMap: Record<string, string> = {
        gray: 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300',
        blue: 'border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20',
        green: 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-300 bg-green-50 dark:bg-green-950/20',
        yellow: 'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-950/20',
        red: 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/20',
        orange: 'border-orange-300 text-orange-700 dark:border-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20',
        purple: 'border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/20',
        cyan: 'border-cyan-300 text-cyan-700 dark:border-cyan-600 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/20',
        indigo: 'border-indigo-300 text-indigo-700 dark:border-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/20',
      }
      return variantMap[variant] || variantMap.gray
    }

    return 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
  }

  const renderField = (field: BatchEditField, showLabel = true) => {
    if (field.type === 'select') {
      const shouldShowLabel = field.showLabel !== false
      return (
        <div key={field.id} className="flex items-center gap-2">
          <Select 
            value={field.value as string || ""}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {field.value && typeof field.value === 'string' && (
            <Badge
              variant="outline"
              className={`text-xs ${getBadgeClassName(field, field.value)}`}
            >
              {field.options?.find(opt => opt.value === field.value)?.label || field.value}
            </Badge>
          )}
          {!shouldShowLabel && field.infoTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-xs">{field.infoTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      )
    }

    if (field.type === 'switch') {
      const shouldShowLabel = field.showLabel !== false
      const tooltipText = field.infoTooltip || 'Ative esta opção para marcar as atividades como subsidiadas. Atividades subsidiadas podem receber apoio financeiro da instituição.'
      
      return (
        <div key={field.id} className="flex items-center gap-2">
          {shouldShowLabel && (
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              {field.label}:
            </Label>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => field.onChange(!(field.value as boolean))}
            className="p-0 h-auto hover:bg-transparent"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              field.value 
                ? 'bg-green-100 border-2 border-green-300 dark:bg-green-900/20 dark:border-green-600' 
                : 'bg-gray-100 border-2 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
            }`}>
              <DollarSign className={`w-4 h-4 ${
                field.value ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
              }`} />
            </div>
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  <Info className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }

    return null
  }

  return (
    <div ref={containerRef} className={`flex items-center gap-3 ${className}`}>
      {/* Visible Fields */}
      {visibleFields.map(field => renderField(field, true))}

      {/* Overflow Menu */}
      {overflowFields.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 px-2"
            >
              <MoreHorizontal className="h-3 w-3" />
              More
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-4 space-y-3">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
              Mais Campos
            </div>
            {overflowFields.map(field => (
              <div key={field.id} className="py-2">
                {renderField(field, true)}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
