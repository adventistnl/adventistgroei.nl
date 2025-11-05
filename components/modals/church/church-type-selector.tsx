"use client"

import React from "react"
import { useTranslation } from "react-i18next"
import { Label } from "@/components/ui/label"
import { Building, Sprout, Check } from "lucide-react"
import { ChurchType } from "@/types/graphql-global-types"
import { cn } from "@/lib/utils"
import { churchTranslations } from "@/lib/translations/churches"

export interface ChurchTypeOption {
  value: ChurchType
  label: string
  description: string
  icon: typeof Sprout | typeof Building
  color: 'green' | 'orange'
}

// Function to get church type options with translations
export const getChurchTypeOptions = (language: string): ChurchTypeOption[] => {
  const tChurch = churchTranslations[language as keyof typeof churchTranslations] || churchTranslations.en
  
  return [
    { 
      value: ChurchType.Plant, 
      label: tChurch.church_types.plant.label,
      description: tChurch.church_types.plant.description,
      icon: Sprout,
      color: 'green'
    },
    { 
      value: ChurchType.Company, 
      label: tChurch.church_types.company.label,
      description: tChurch.church_types.company.description,
      icon: Building,
      color: 'orange'
    },
  ]
}

// Legacy export for backward compatibility
export const CHURCH_TYPE_OPTIONS: ChurchTypeOption[] = getChurchTypeOptions('en')

interface ChurchTypeSelectorProps {
  isSpecialChurch: boolean
  selectedType: ChurchType | null | undefined
  onSpecialChurchChange: (value: boolean) => void
  onTypeChange: (type: ChurchType | null) => void
  isLoading?: boolean
  error?: string
}

export function ChurchTypeSelector({
  isSpecialChurch,
  selectedType,
  onSpecialChurchChange,
  onTypeChange,
  isLoading = false,
  error
}: ChurchTypeSelectorProps) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n?.language || 'en'
  const tChurch = churchTranslations[currentLanguage as keyof typeof churchTranslations] || churchTranslations.en
  
  // Get translated options
  const churchTypeOptions = getChurchTypeOptions(currentLanguage)
  
  return (
    <>
      {/* Switch: Is Special Church? - Minimalista */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border border-slate-200">
          <div className="flex-1">
            <Label htmlFor="special-church" className="text-sm font-medium text-slate-700 cursor-pointer">
              {tChurch.fields.is_special_church}
            </Label>
            <p className="text-xs text-slate-500 mt-0.5">
              {tChurch.fields.special_church_help}
            </p>
          </div>
          <button
            id="special-church"
            type="button"
            role="switch"
            aria-checked={isSpecialChurch}
            onClick={() => {
              const newValue = !isSpecialChurch
              onSpecialChurchChange(newValue)
              if (!newValue) {
                onTypeChange(null)
              }
            }}
            disabled={isLoading}
            className={cn(
              "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
              isSpecialChurch ? "bg-slate-900 border-slate-900" : "bg-slate-200 border-slate-200",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
                isSpecialChurch ? "translate-x-4" : "translate-x-0.5"
              )}
            />
          </button>
        </div>
      </div>

      {/* Church Type Selection - Only shown if special church */}
      {isSpecialChurch && (
        <div className="space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          <Label className="flex items-center gap-2 text-sm">
            <Building className="w-4 h-4 text-muted-foreground" />
            {tChurch.fields.church_type} *
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {churchTypeOptions.map((type) => {
              const Icon = type.icon
              const isSelected = selectedType !== null && selectedType !== undefined && selectedType === type.value
              const isPlant = type.value === ChurchType.Plant
              const borderColor = isPlant ? 'border-green-500' : 'border-orange-500'
              const bgColor = isPlant ? 'bg-green-50' : 'bg-orange-50'
              const iconColor = isPlant ? 'text-green-600' : 'text-orange-600'
              const checkBgColor = isPlant ? 'bg-green-600' : 'bg-orange-600'
              
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onTypeChange(type.value)}
                  disabled={isLoading}
                  className={cn(
                    "relative flex flex-col items-start gap-3 p-4 rounded-lg transition-all duration-200",
                    "hover:shadow-sm",
                    isPlant ? "border-2 border-dashed" : "border-2 border-solid",
                    isSelected 
                      ? `${borderColor} ${bgColor}` 
                      : "border-slate-200 bg-white hover:border-slate-300",
                    isLoading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {/* Icon - Com cores */}
                  <div className="flex items-center gap-3 w-full">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isPlant ? "border-2 border-dashed" : "border-2 border-solid",
                      isSelected 
                        ? `${borderColor} ${bgColor}` 
                        : "border-slate-200 bg-slate-50"
                    )}>
                      <Icon className={cn(
                        "w-5 h-5",
                        isSelected ? iconColor : "text-slate-400"
                      )} />
                    </div>
                    
                    {/* Check indicator com cor */}
                    {isSelected && (
                      <div className={cn(
                        "ml-auto w-5 h-5 rounded-full flex items-center justify-center",
                        checkBgColor
                      )}>
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  
                  {/* Label com destaque em bold */}
                  <div className="text-left space-y-1 w-full">
                    <p className={cn(
                      "text-sm",
                      isSelected ? "font-bold text-slate-900" : "font-semibold text-slate-700"
                    )}>
                      {type.label}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {type.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>
      )}
    </>
  )
}
