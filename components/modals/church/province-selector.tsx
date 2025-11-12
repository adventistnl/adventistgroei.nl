"use client"

import React, { useState } from "react"
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
import { states } from "@/data/geographicData"
import { churchTranslations } from "@/lib/translations/churches"

interface ProvinceSelectorProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  error?: string
}

export function ProvinceSelector({
  value,
  onChange,
  isLoading = false,
  error
}: ProvinceSelectorProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-2">
      <Label htmlFor="province" className="flex items-center gap-2 text-sm">
        <MapPin className="w-4 h-4 text-muted-foreground" />
        {tChurch.fields.province} *
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
            {value
              ? states.NL?.find(p => p.code === value)?.name
              : tChurch.placeholders.province}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={tChurch.province_selector.search_placeholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>{tChurch.province_selector.no_province_found}</CommandEmpty>
              <CommandGroup heading="Províncias">
                {states.NL?.map((province) => (
                  <CommandItem
                    key={province.code}
                    value={province.name}
                    onSelect={() => {
                      onChange(province.code)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === province.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2" />
                    {province.name}
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
