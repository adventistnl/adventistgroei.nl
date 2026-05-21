import React from "react"
import { Badge } from "@/components/ui/badge"
import { Sprout, Star } from "lucide-react"
import { useTranslation } from "react-i18next"
import { projectTranslations } from "@/lib/translations/projects"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type SpecialProjectType = 'Church Planting' | 'Projeto Especial' | null

interface SpecialProjectBadgeProps {
  type: SpecialProjectType
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'default'
}

export function getSpecialProjectColors(type: SpecialProjectType) {
  if (type === 'Church Planting') {
    return {
      border: "border-emerald-200",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      iconBg: "bg-emerald-100",
    }
  }
  if (type === 'Projeto Especial') {
    return {
      border: "border-amber-200",
      bg: "bg-amber-50",
      text: "text-amber-700",
      iconBg: "bg-amber-100",
    }
  }
  return null
}

export function SpecialProjectBadge({ type, className, iconOnly, size = 'default' }: SpecialProjectBadgeProps) {
  const { i18n } = useTranslation()
  const lang = (i18n.language?.split('-')[0] || 'en') as keyof typeof projectTranslations
  const t_project = projectTranslations[lang] || projectTranslations.en

  if (!type) return null

  const isChurchPlanting = type === 'Church Planting'
  const text = isChurchPlanting 
    ? (t_project.specialTypes?.churchPlanting || "Church Planting") 
    : (t_project.specialTypes?.specialProject || "Projeto Especial")

  const Icon = isChurchPlanting ? Sprout : Star
  const colors = getSpecialProjectColors(type)

  if (iconOnly) {
    const sizeClasses = size === 'sm' ? 'w-6 h-6 rounded' : 'w-8 h-8 rounded-lg'
    const iconSizeClasses = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'

    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`${sizeClasses} ${colors?.iconBg} flex items-center justify-center flex-shrink-0 border border-transparent ${colors?.border} ${className || ''}`}>
              <Icon className={`${iconSizeClasses} ${colors?.text}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p className="text-xs">{text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Badge variant="outline" className={`${colors?.bg} ${colors?.text} ${colors?.border} ${className || ''}`}>
      <Icon className="w-3 h-3 mr-1" />
      {text}
    </Badge>
  )
}

