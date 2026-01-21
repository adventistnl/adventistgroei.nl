"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  ChevronDown,
  Check,
  ChevronsUpDown
} from "lucide-react"
import { format } from "date-fns"

// Filter Types
export type FilterType = 
  | "select" 
  | "multi-select" 
  | "date" 
  | "date-range" 
  | "checkbox" 
  | "radio"
  | "checkbox-group"

export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface FilterConfig {
  id: string
  label: string
  type: FilterType
  placeholder?: string
  options?: FilterOption[]
  defaultValue?: any
  icon?: React.ComponentType<{ className?: string }>
  description?: string
  multiple?: boolean
}

export interface PageFiltersProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (filterId: string, value: any) => void
  onClear?: () => void
  triggerLabel?: string
  triggerIcon?: React.ComponentType<{ className?: string }>
  align?: "start" | "center" | "end"
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  width?: number
  showClearButton?: boolean
  disabled?: boolean
}

export function PageFilters({
  filters,
  values,
  onChange,
  onClear,
  triggerLabel = "Filters",
  triggerIcon: TriggerIcon = Filter,
  align = "end",
  side = "bottom",
  className,
  width = 320,
  showClearButton = true,
  disabled = false
}: PageFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  // Count active filters
  const activeFiltersCount = React.useMemo(() => {
    return filters.filter(filter => {
      const value = values[filter.id]
      if (value === undefined || value === null) return false
      
      // For arrays (multi-select, checkbox-group)
      if (Array.isArray(value)) return value.length > 0
      
      // For dates
      if (value instanceof Date) return true
      
      // For date ranges
      if (typeof value === 'object' && (value.from || value.to)) return true
      
      // For strings (select, radio)
      if (typeof value === 'string') return value !== '' && value !== 'all'
      
      // For booleans (checkbox)
      if (typeof value === 'boolean') return value === true
      
      return false
    }).length
  }, [filters, values])

  const handleClear = () => {
    if (onClear) {
      onClear()
    } else {
      // Default clear behavior - reset all to default or empty
      filters.forEach(filter => {
        if (filter.type === 'multi-select' || filter.type === 'checkbox-group') {
          onChange(filter.id, [])
        } else if (filter.type === 'checkbox') {
          onChange(filter.id, false)
        } else if (filter.type === 'date-range') {
          onChange(filter.id, { from: undefined, to: undefined })
        } else {
          onChange(filter.id, filter.defaultValue || '')
        }
      })
    }
  }

  const renderFilter = (filter: FilterConfig) => {
    const value = values[filter.id]
    const FilterIcon = filter.icon

    // Estados para popovers - definidos aqui para evitar problemas com hooks
    const [selectOpen, setSelectOpen] = React.useState(false)
    const [multiSelectOpen, setMultiSelectOpen] = React.useState(false)

    switch (filter.type) {
      case "select":
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              {FilterIcon && <FilterIcon className="w-4 h-4" />}
              {filter.label}
            </Label>
            {filter.description && (
              <p className="text-xs text-muted-foreground">{filter.description}</p>
            )}
            <Popover open={selectOpen} onOpenChange={setSelectOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={selectOpen}
                  className={cn(
                    "w-full justify-between font-normal h-10",
                    !value && "text-muted-foreground"
                  )}
                >
                  {value
                    ? (() => {
                        const selectedOption = filter.options?.find(option => option.value === value)
                        return (
                          <div className="flex items-center gap-2">
                            {selectedOption?.icon && <selectedOption.icon className="w-4 h-4" />}
                            {selectedOption?.label}
                          </div>
                        )
                      })()
                    : filter.placeholder || `Select ${filter.label.toLowerCase()}`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={`Search ${filter.label.toLowerCase()}...`} />
                  <CommandList>
                    <CommandEmpty>No {filter.label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                      {filter.options?.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            onChange(filter.id, currentValue === value ? "" : currentValue)
                            setSelectOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )

      case "multi-select":
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              {FilterIcon && <FilterIcon className="w-4 h-4" />}
              {filter.label}
            </Label>
            {filter.description && (
              <p className="text-xs text-muted-foreground">{filter.description}</p>
            )}
            <Popover open={multiSelectOpen} onOpenChange={setMultiSelectOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "w-full justify-between font-normal h-10",
                    selectedValues.length === 0 && "text-muted-foreground"
                  )}
                >
                  <span className="truncate">
                    {selectedValues.length > 0
                      ? `${selectedValues.length} selected`
                      : filter.placeholder || `Select ${filter.label.toLowerCase()}`}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder={`Search ${filter.label.toLowerCase()}...`} />
                  <CommandList>
                    <CommandEmpty>No {filter.label.toLowerCase()} found.</CommandEmpty>
                    <CommandGroup>
                      {filter.options?.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            const newValues = selectedValues.includes(option.value)
                              ? selectedValues.filter(v => v !== option.value)
                              : [...selectedValues, option.value]
                            onChange(filter.id, newValues)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedValues.map(val => {
                  const option = filter.options?.find(o => o.value === val)
                  return (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {option?.label || val}
                      <X 
                        className="w-3 h-3 ml-1 cursor-pointer" 
                        onClick={() => onChange(filter.id, selectedValues.filter(v => v !== val))}
                      />
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        )

      case "checkbox-group":
        const checkedValues = Array.isArray(value) ? value : []
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              {FilterIcon && <FilterIcon className="w-4 h-4" />}
              {filter.label}
            </Label>
            {filter.description && (
              <p className="text-xs text-muted-foreground">{filter.description}</p>
            )}
            <div className="space-y-2 pl-1">
              {filter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${filter.id}-${option.value}`}
                    checked={checkedValues.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...checkedValues, option.value]
                        : checkedValues.filter(v => v !== option.value)
                      onChange(filter.id, newValues)
                    }}
                  />
                  <label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    {option.icon && <option.icon className="w-4 h-4" />}
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case "radio":
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              {FilterIcon && <FilterIcon className="w-4 h-4" />}
              {filter.label}
            </Label>
            {filter.description && (
              <p className="text-xs text-muted-foreground">{filter.description}</p>
            )}
            <RadioGroup value={value || filter.defaultValue || ''} onValueChange={(val) => onChange(filter.id, val)}>
              {filter.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${filter.id}-${option.value}`} />
                  <label
                    htmlFor={`${filter.id}-${option.value}`}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                  >
                    {option.icon && <option.icon className="w-4 h-4" />}
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "checkbox":
        return (
          <div key={filter.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={filter.id}
                checked={value || false}
                onCheckedChange={(checked) => onChange(filter.id, checked)}
              />
              <label
                htmlFor={filter.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
              >
                {FilterIcon && <FilterIcon className="w-4 h-4" />}
                {filter.label}
              </label>
            </div>
            {filter.description && (
              <p className="text-xs text-muted-foreground pl-6">{filter.description}</p>
            )}
          </div>
        )

      case "date":
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              {FilterIcon && <FilterIcon className="w-4 h-4" />}
              {filter.label}
            </Label>
            {filter.description && (
              <p className="text-xs text-muted-foreground">{filter.description}</p>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(value, "PPP") : <span>{filter.placeholder || "Pick a date"}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(date) => onChange(filter.id, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case "date-range":
        const dateRange = value || { from: undefined, to: undefined }
        return (
          <div key={filter.id} className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              {FilterIcon && <FilterIcon className="w-4 h-4" />}
              {filter.label}
            </Label>
            {filter.description && (
              <p className="text-xs text-muted-foreground">{filter.description}</p>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>{filter.placeholder || "Pick a date range"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => onChange(filter.id, range)}
                  numberOfMonths={2}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2", className)}
          disabled={disabled}
        >
          <TriggerIcon className="w-4 h-4" />
          {triggerLabel}
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-4" 
        align={align} 
        side={side}
        style={{ width: `${width}px` }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </h4>
            {showClearButton && activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {filters.map(filter => renderFilter(filter))}
          </div>

          {/* Footer Actions (optional) */}
          {activeFiltersCount > 0 && (
            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
