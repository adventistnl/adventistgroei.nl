"use client"

import React, { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import { MapPin, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { churchTranslations } from "@/lib/translations/churches"
import { Regions_regions } from "@/types/Regions"

interface RegionSelectorProps {
  value: string
  onChange: (value: string) => void
  regions: Regions_regions[]
  isLoading?: boolean
  error?: string
  isOptional?: boolean
}

export function RegionSelector({
  value,
  onChange,
  regions,
  isLoading = false,
  error,
  isOptional = true
}: RegionSelectorProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter regions by search query
  const filteredRegions = useMemo(() => {
    if (!searchQuery) return regions
    return regions.filter(region =>
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [regions, searchQuery])

  // Get the selected region name for display
  const selectedRegionName = useMemo(() => {
    if (!value) return isOptional ? tChurch.placeholders.region : tChurch.placeholders.region
    return regions.find(r => r.id === value)?.name || value
  }, [value, regions, isOptional, tChurch])

  return (
    <div className="space-y-2">
      <Label htmlFor="region" className="flex items-center gap-2 text-sm">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        {tChurch.fields.region} {!isOptional && '*'}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full h-10 justify-between font-normal",
              !value && "text-muted-foreground",
              error && "border-red-500"
            )}
            disabled={isLoading}
          >
            <span className="truncate">
              {selectedRegionName}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={tChurch.placeholders.region}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No regions found.</CommandEmpty>
              {isOptional && (
                <CommandGroup>
                  <CommandItem
                    value="clear"
                    onSelect={() => {
                      onChange("")
                      setOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="text-muted-foreground">{tChurch.buttons.clear}</span>
                  </CommandItem>
                </CommandGroup>
              )}
              <CommandGroup heading={tChurch.fields.region}>
                {filteredRegions.map((region) => (
                  <CommandItem
                    key={region.id}
                    value={region.name}
                    onSelect={() => {
                      onChange(region.id)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === region.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div 
                      className="w-2 h-2 rounded-full mr-2 flex-shrink-0" 
                      style={{ backgroundColor: region.color || '#ccc' }}
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="truncate">{region.name}</span>
                      {region.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {region.description}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
