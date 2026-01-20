"use client"

import React, { useState } from "react"
import { Info, Check, AlertCircle, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ValidationBadgesCarousel, ValidationBadgeData } from "@/components/shared/validation-badges-carousel"
import { cn } from "@/lib/utils"

interface SubsidyValidationInfoProps {
  /**
   * Validation badges data for current activity
   */
  badges: ValidationBadgeData[]
  
  /**
   * Whether all validation is complete
   */
  isValid: boolean
  
  /**
   * Translation object for content
   */
  translations: {
    title: string
    howItWorks: string
    description: string
    distribution: string
    status: {
      complete: string
      pending: string
      issues: string
    }
  }
  
  /**
   * Initially expanded state
   */
  initiallyExpanded?: boolean
  
  /**
   * Custom className for container
   */
  className?: string
}

/**
 * SubsidyValidationInfo Component
 * 
 * Displays subsidy information with integrated validation status.
 * Shows a collapsible info section with validation badges and status indicator.
 * 
 * Features:
 * - Visual status indicator (badge color)
 * - Collapsible content
 * - Integrated validation badges carousel
 * - Minimalist design
 */
export function SubsidyValidationInfo({
  badges,
  isValid,
  translations,
  initiallyExpanded = false,
  className
}: SubsidyValidationInfoProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded)
  
  // Calculate validation status
  const allValid = badges.every(badge => badge.isValid)
  const someValid = badges.some(badge => badge.isValid)
  const noneValid = !someValid
  
  // Determine status variant
  const getStatusVariant = (): "success" | "warning" | "error" => {
    if (allValid) return "success"
    if (someValid) return "warning"
    return "error"
  }
  
  // Get status text
  const getStatusText = () => {
    if (allValid) return translations.status.complete
    if (noneValid) return translations.status.issues
    return translations.status.pending
  }
  
  // Get status colors for container
  const getContainerColors = () => {
    if (allValid) {
      return "border-green-200 hover:border-green-300 hover:bg-green-50/50"
    }
    if (someValid) {
      return "border-amber-200 hover:border-amber-300 hover:bg-amber-50/50"
    }
    return "border-red-200 hover:border-red-300 hover:bg-red-50/50"
  }
  
  // Get badge colors
  const getBadgeColors = () => {
    if (allValid) {
      return "bg-green-100 text-green-700 border-green-300"
    }
    if (someValid) {
      return "bg-amber-100 text-amber-700 border-amber-300"
    }
    return "bg-red-100 text-red-700 border-red-300"
  }
  
  // Get icon
  const StatusIcon = allValid ? Check : AlertCircle
  
  return (
    <div className={cn("space-y-2", className)}>
      {/* Toggle Button with Status */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex sm:items-center items-start gap-2 p-2 rounded-lg border transition-all cursor-pointer",
          getContainerColors()
        )}
      >
        <div className="flex-1 flex justify-between sm:flex-row sm:items-center gap-2 text-left">
          <div className="flex gap-2 w-full sm:w-auto">
            <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="text-xs font-medium text-gray-700 flex-1 text-left">
              {translations.title}
            </span>
          </div>

          {/* Status Badge */}
          <Badge 
            variant="outline" 
            className={cn("text-xs flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-start", getBadgeColors())}
          >
            <StatusIcon className="w-3 h-3" />
            {getStatusText()}
          </Badge>
        </div>

        
        {/* Chevron */}
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform flex-shrink-0 self-center",
            isExpanded && "transform rotate-180"
          )} 
        />
      </button>
      
      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 space-y-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
          {/* Validation Badges */}
          <ValidationBadgesCarousel
            badges={badges}
            showCarousel={true}
            minBadgesForCarousel={4}
          />
          
          {/* Info Content */}
          <div className="text-xs text-gray-600 leading-relaxed space-y-2 pt-3 border-t border-gray-200">
            <p className="font-medium text-gray-900">{translations.howItWorks}</p>
            <p>{translations.description}</p>
            <p dangerouslySetInnerHTML={{ __html: translations.distribution }} />
          </div>
        </div>
      )}
    </div>
  )
}
