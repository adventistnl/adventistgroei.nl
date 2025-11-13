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
import { states, cities } from "@/data/geographicData"
import { churchTranslations } from "@/lib/translations/churches"

interface ProvinceAndCitySelectorProps {
  provinceValue: string
  onProvinceChangeAction: (value: string) => void
  cityValue: string
  onCityChangeAction: (value: string) => void
  countryCode: string
  isLoading?: boolean
  provinceError?: string
  cityError?: string
}

export function ProvinceAndCitySelector({
  provinceValue,
  onProvinceChangeAction,
  cityValue,
  onCityChangeAction,
  countryCode,
  isLoading = false,
  provinceError,
  cityError
}: ProvinceAndCitySelectorProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  const [provinceOpen, setProvinceOpen] = useState(false)
  const [cityOpen, setCityOpen] = useState(false)
  const [provinceSearch, setProvinceSearch] = useState("")
  const [citySearch, setCitySearch] = useState("")

  // Get provinces for the country
  const countryProvinces = useMemo(() => {
    const countryKey = countryCode.toUpperCase() as keyof typeof states
    return states[countryKey] || []
  }, [countryCode])

  // Filter provinces by search
  const filteredProvinces = useMemo(() => {
    if (!provinceSearch) return countryProvinces
    return countryProvinces.filter(province =>
      province.name.toLowerCase().includes(provinceSearch.toLowerCase())
    )
  }, [countryProvinces, provinceSearch])

  // Get cities for selected province
  const provinceCities = useMemo(() => {
    if (!provinceValue) return []
    const cityKey = provinceValue as keyof typeof cities
    return cities[cityKey] || []
  }, [provinceValue])

  // Filter cities by search
  const filteredCities = useMemo(() => {
    if (!citySearch) return provinceCities
    return provinceCities.filter(city =>
      city.name.toLowerCase().includes(citySearch.toLowerCase())
    )
  }, [provinceCities, citySearch])

  const selectedProvinceName = useMemo(() => {
    const province = countryProvinces.find(p => p.code === provinceValue)
    return province?.name || tChurch.placeholders.province
  }, [provinceValue, countryProvinces, tChurch])

  const selectedCityName = useMemo(() => {
    const city = provinceCities.find(c => c.code === cityValue)
    return city?.name || tChurch.placeholders.city
  }, [cityValue, provinceCities, tChurch])

  return (
    <div className="space-y-4">
      {/* Province Selector */}
      <div className="space-y-2">
        <Label htmlFor="province" className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          {tChurch.fields.province}
        </Label>
        <Popover open={provinceOpen} onOpenChange={setProvinceOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={provinceOpen}
              className={cn(
                "w-full h-10 justify-between font-normal",
                !provinceValue && "text-muted-foreground",
                provinceError && "border-red-500"
              )}
              disabled={isLoading}
            >
              {selectedProvinceName}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput 
                placeholder={tChurch.placeholders.province}
                value={provinceSearch}
                onValueChange={setProvinceSearch}
              />
              <CommandList>
                <CommandEmpty>No provinces found.</CommandEmpty>
                <CommandGroup heading={tChurch.fields.province}>
                  {filteredProvinces.map((province) => (
                    <CommandItem
                      key={province.code}
                      value={province.name}
                      onSelect={() => {
                        onProvinceChangeAction(province.code)
                        onCityChangeAction("") // Reset city when province changes
                        setProvinceOpen(false)
                        setProvinceSearch("")
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          provinceValue === province.code ? "opacity-100" : "opacity-0"
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
        {provinceError && (
          <p className="text-sm text-red-600">{provinceError}</p>
        )}
      </div>

      {/* City Selector */}
      {provinceValue && (
        <div className="space-y-2 animate-in fade-in-0 duration-200">
          <Label htmlFor="city" className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            {tChurch.fields.city}
          </Label>
          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityOpen}
                className={cn(
                  "w-full h-10 justify-between font-normal",
                  !cityValue && "text-muted-foreground",
                  cityError && "border-red-500"
                )}
                disabled={isLoading || !provinceValue}
              >
                {selectedCityName}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder={tChurch.placeholders.city}
                  value={citySearch}
                  onValueChange={setCitySearch}
                />
                <CommandList>
                  <CommandEmpty>No cities found.</CommandEmpty>
                  <CommandGroup heading={tChurch.fields.city}>
                    {filteredCities.map((city) => (
                      <CommandItem
                        key={city.code}
                        value={city.name}
                        onSelect={() => {
                          onCityChangeAction(city.code)
                          setCityOpen(false)
                          setCitySearch("")
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            cityValue === city.code ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2" />
                        {city.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {cityError && (
            <p className="text-sm text-red-600">{cityError}</p>
          )}
        </div>
      )}
    </div>
  )
}
