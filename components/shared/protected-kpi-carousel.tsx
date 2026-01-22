"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { ProtectedKPICard } from "@/components/shared/protected-kpi-card"
import { PermissionResolverName } from "@/types/graphql-global-types"

export interface ProtectedKPICardData {
  id: string
  title: string
  value: string | number | React.ReactNode
  icon: LucideIcon
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  requiredPermission: PermissionResolverName | PermissionResolverName[]
  className?: string
}

interface ProtectedKPICarouselProps {
  data: ProtectedKPICardData[]
  className?: string
  minCardsForCarousel?: number
  showCarousel?: boolean
  isLoading?: boolean
  skeletonCount?: number
}

/**
 * Carrossel de KPI Cards Protegidos
 * 
 * Similar ao KPICards mas com validação de permissões individuais
 * Cada card valida sua própria permissão antes de exibir dados sensíveis
 * 
 * @example
 * ```tsx
 * <ProtectedKPICarousel
 *   data={[
 *     {
 *       id: "total-users",
 *       title: "Total Users",
 *       value: 1234,
 *       icon: Users,
 *       subtitle: "45 new this year",
 *       trend: { value: 12.5, isPositive: true },
 *       requiredPermission: PermissionResolverName.Users
 *     },
 *     // ... more KPIs
 *   ]}
 *   showCarousel={true}
 *   minCardsForCarousel={4}
 * />
 * ```
 */
export function ProtectedKPICarousel({
  data,
  className,
  minCardsForCarousel = 4,
  showCarousel = true,
  isLoading = false,
  skeletonCount = 6,
}: ProtectedKPICarouselProps) {
  const { i18n } = useTranslation()
  
  // Determinar se deve usar carrossel baseado no número de cards
  const shouldUseCarousel = showCarousel && data.length >= minCardsForCarousel
  
  // Skeleton para loading state
  const renderSkeleton = () => (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32 mb-1" />
        <Skeleton className="h-3 w-16 mt-2" />
      </CardContent>
    </Card>
  )

  // Renderizar card protegido individual
  const renderCard = (item: ProtectedKPICardData, index: number) => {
    return (
      <ProtectedKPICard
        key={item.id}
        id={item.id}
        title={item.title}
        value={item.value}
        icon={item.icon}
        subtitle={item.subtitle}
        trend={item.trend}
        requiredPermission={item.requiredPermission}
        className={item.className}
      />
    )
  }

  // Se está carregando, mostrar skeletons
  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-6",
        skeletonCount === 1 && "grid-cols-1",
        skeletonCount === 2 && "grid-cols-1 md:grid-cols-2",
        skeletonCount === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        skeletonCount >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
      </div>
    )
  }

  // Se não deve usar carrossel, renderizar grid normal
  if (!shouldUseCarousel) {
    const totalCards = data.length
    
    return (
      <div className={cn(
        "grid gap-6 auto-rows-fr",
        totalCards === 1 && "grid-cols-1",
        totalCards === 2 && "grid-cols-1 md:grid-cols-2",
        totalCards === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        totalCards >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}>
        {data.map((item, index) => renderCard(item, index))}
      </div>
    )
  }

  // Calcular basis dinâmico baseado na quantidade total de cards
  const totalCards = data.length
  
  const getCardBasis = () => {
    if (totalCards === 1) return "basis-full"
    if (totalCards === 2) return "basis-full sm:basis-1/2"
    if (totalCards === 3) return "basis-full sm:basis-1/2 lg:basis-1/3"
    // 4 ou mais cards
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
        <CarouselContent className="-ml-1 md:-ml-2 lg:-ml-4 items-stretch">
          {/* Protected KPI Cards */}
          {data.map((item, index) => (
            <CarouselItem 
              key={item.id} 
              className={cn(
                "pl-2 md:pl-4 lg:pl-4 flex",
                getCardBasis(),
                "min-w-0"
              )}
            >
              {renderCard(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Mostrar controles apenas se houver mais cards que cabem na tela */}
        {totalCards > 2 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
            <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
          </>
        )}
      </Carousel>
    </div>
  )
}
