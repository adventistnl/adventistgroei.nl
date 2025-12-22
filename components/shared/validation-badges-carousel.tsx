"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, AlertCircle, X } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export interface ValidationBadgeData {
  id: string
  label: string
  value: string | number
  isValid: boolean
  variant?: "success" | "warning" | "error" | "neutral"
}

interface ValidationBadgesCarouselProps {
  badges: ValidationBadgeData[]
  className?: string
  showCarousel?: boolean
  minBadgesForCarousel?: number
}

/**
 * Componente reutilizável de badges de validação com carrossel
 * Segue o padrão minimalista do KPICarousel
 * 
 * @example
 * ```tsx
 * const badges: ValidationBadgeData[] = [
 *   {
 *     id: "step1",
 *     label: "Passo 1",
 *     value: "Completo",
 *     isValid: true,
 *     variant: "success"
 *   },
 *   {
 *     id: "step2",
 *     label: "Passo 2",
 *     value: "Pendente",
 *     isValid: false,
 *     variant: "neutral"
 *   }
 * ]
 * 
 * <ValidationBadgesCarousel
 *   badges={badges}
 *   showCarousel={true}
 *   minBadgesForCarousel={4}
 * />
 * ```
 */
export function ValidationBadgesCarousel({
  badges,
  className,
  showCarousel = true,
  minBadgesForCarousel = 4
}: ValidationBadgesCarouselProps) {
  
  // Determinar se deve usar carrossel
  const shouldUseCarousel = showCarousel && badges.length >= minBadgesForCarousel

  // Renderizar badge individual
  const renderBadge = (badge: ValidationBadgeData) => {
    // Determinar variant baseado em isValid se não especificado
    const variant = badge.variant || (badge.isValid ? "success" : "neutral")
    
    // Classes baseadas no variant
    const variantClasses = {
      success: "border-green-200 bg-green-50",
      warning: "border-amber-200 bg-amber-50",
      error: "border-red-200 bg-red-50",
      neutral: "border-gray-200 bg-gray-50"
    }

    const iconBgClasses = {
      success: "bg-green-500",
      warning: "bg-amber-500",
      error: "bg-red-500",
      neutral: "bg-gray-300"
    }

    // Ícone baseado no variant
    const getIcon = () => {
      if (variant === "success") {
        return <Check className="w-3 h-3 text-white" />
      }
      if (variant === "warning") {
        return <AlertCircle className="w-3 h-3 text-white" />
      }
      if (variant === "error") {
        return <X className="w-3 h-3 text-white" />
      }
      return null
    }

    return (
      <div 
        key={badge.id}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all min-w-0",
          variantClasses[variant]
        )}
      >
        {/* Círculo indicador */}
        <div className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
          iconBgClasses[variant]
        )}>
          {getIcon()}
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">
            {badge.label}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {badge.value}
          </p>
        </div>
      </div>
    )
  }

  // Se não deve usar carrossel, renderizar layout flex responsivo
  if (!shouldUseCarousel) {
    return (
      <div className={cn(
        "flex gap-2 flex-wrap",
        className
      )}>
        {badges.map(badge => (
          <div key={badge.id} className="flex-1 min-w-0">
            {renderBadge(badge)}
          </div>
        ))}
      </div>
    )
  }

  // Calcular basis dinâmico
  const getCardBasis = () => {
    if (badges.length === 1) return "basis-full"
    if (badges.length === 2) return "basis-full sm:basis-1/2"
    if (badges.length === 3) return "basis-full sm:basis-1/2 lg:basis-1/3"
    return "basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
  }

  // Renderizar carrossel
  return (
    <div className={cn("w-full max-w-full overflow-hidden", className)}>
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-1 md:-ml-2 items-stretch">
          {badges.map((badge) => (
            <CarouselItem 
              key={badge.id}
              className={cn(
                "pl-2 md:pl-2 flex",
                getCardBasis(),
                "min-w-0 flex-1"
              )}
            >
              <div className="w-full">
                {renderBadge(badge)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Controles apenas se houver mais de 2 badges */}
        {badges.length > 2 && (
          <>
            <CarouselPrevious className="left-0 h-6 w-6 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
            <CarouselNext className="right-0 h-6 w-6 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
          </>
        )}
      </Carousel>
    </div>
  )
}
