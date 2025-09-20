"use client"

import * as React from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"

export interface KPICardData {
  id: string
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
}

interface KPICardsProps {
  data: KPICardData[]
  className?: string
  minCardsForCarousel?: number
  showCarousel?: boolean
  isLoading?: boolean
  skeletonCount?: number
}

/**
 * Componente reutilizável de KPI Cards com carrossel responsivo
 * Segue o padrão do dashboard com estilo monocromático e duotone
 */
export function KPICards({
  data,
  className,
  minCardsForCarousel = 4,
  showCarousel = true,
  isLoading = false,
  skeletonCount = 4
}: KPICardsProps) {
  const { i18n } = useTranslation()
  
  // Determinar se deve usar carrossel baseado no número de cards
  const shouldUseCarousel = showCarousel && data.length >= minCardsForCarousel
  
  // Obter traduções se necessário
  const currentLanguage = i18n?.language || 'en'
  
  // Função para formatar valores
  const formatValue = (value: string | number): string => {
    if (typeof value === 'number') {
      return value.toLocaleString(currentLanguage)
    }
    return value
  }

  // Skeleton para loading
  const renderSkeleton = () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )

  // Renderizar card individual seguindo padrão do dashboard
  const renderCard = (item: KPICardData, index: number) => (
    <Card key={item.id} className="w-full min-w-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
        <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold truncate">{formatValue(item.value)}</div>
        {item.subtitle && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {item.subtitle}
          </p>
        )}
        {item.trend && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            {item.trend.isPositive ? (
              <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
            )}
            <span className="truncate">
              {item.trend.isPositive ? '+' : ''}{item.trend.value}% {item.trend.label || ''}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )

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
    return (
      <div className={cn(
        "grid gap-6",
        data.length === 1 && "grid-cols-1",
        data.length === 2 && "grid-cols-1 md:grid-cols-2",
        data.length === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        data.length >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}>
        {data.map((item, index) => renderCard(item, index))}
      </div>
    )
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
        <CarouselContent className="-ml-1 md:-ml-2 lg:-ml-4">
          {data.map((item, index) => (
            <CarouselItem 
              key={item.id} 
              className={cn(
                "pl-2 md:pl-4 lg:pl-4",
                // Responsive basis - sempre mostra pelo menos 1, máximo 4
                "basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4",
                // Garantir que não ultrapasse os limites
                "min-w-0"
              )}
            >
              {renderCard(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Mostrar controles apenas se houver mais cards que cabem na tela */}
        {data.length > 2 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
            <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
          </>
        )}
      </Carousel>
    </div>
  )
}

// Componente wrapper para facilitar uso com dados específicos
export function UseKPICards({ 
  data, 
  className,
  isLoading = false
}: { 
  data: KPICardData[]
  className?: string
  isLoading?: boolean
}) {
  return (
    <KPICards
      data={data}
      className={className}
      minCardsForCarousel={4}
      showCarousel={true}
      isLoading={isLoading}
    />
  )
}

// Componente wrapper para outras páginas
export function ChurchesKPICards({ 
  data, 
  className,
  isLoading = false
}: { 
  data: KPICardData[]
  className?: string
  isLoading?: boolean
}) {
  return (
    <KPICards
      data={data}
      className={className}
      minCardsForCarousel={4}
      showCarousel={true}
      isLoading={isLoading}
    />
  )
}

export function DepartmentsKPICards({ 
  data, 
  className,
  isLoading = false
}: { 
  data: KPICardData[]
  className?: string
  isLoading?: boolean
}) {
  return (
    <KPICards
      data={data}
      className={className}
      minCardsForCarousel={4}
      showCarousel={true}
      isLoading={isLoading}
    />
  )
}
