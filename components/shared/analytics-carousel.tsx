"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

export interface AnalyticsChartData {
  id: string
  title: string
  description?: string
  icon?: LucideIcon
  content: React.ReactNode
  className?: string
}

interface AnalyticsCarouselProps {
  data: AnalyticsChartData[]
  className?: string
  minChartsForCarousel?: number
  showCarousel?: boolean
  isLoading?: boolean
  skeletonCount?: number
}

/**
 * Componente reutilizável de Analytics com carrossel responsivo
 * Os gráficos se ajustam na redução da tela até ficarem todos em carrossel
 */
export function AnalyticsCarousel({
  data,
  className,
  minChartsForCarousel = 2,
  showCarousel = true,
  isLoading = false,
  skeletonCount = 3
}: AnalyticsCarouselProps) {
  
  // Determinar se deve usar carrossel baseado no número de charts
  const shouldUseCarousel = showCarousel && data.length >= minChartsForCarousel
  
  // Skeleton para loading
  const renderSkeleton = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>
  )

  // Renderizar chart individual
  const renderChart = (item: AnalyticsChartData, index: number) => (
    <Card key={item.id} className={cn("w-full min-w-0", item.className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          {item.icon && <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />}
          <span className="truncate">{item.title}</span>
        </CardTitle>
        {item.description && (
          <CardDescription className="text-xs sm:text-sm line-clamp-2">
            {item.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="w-full overflow-hidden">
          {item.content}
        </div>
      </CardContent>
    </Card>
  )

  // Se está carregando, mostrar skeletons
  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-4 sm:gap-6",
        skeletonCount === 1 && "grid-cols-1",
        skeletonCount === 2 && "grid-cols-1 lg:grid-cols-2",
        skeletonCount >= 3 && "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
        className
      )}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
      </div>
    )
  }

  // Se não deve usar carrossel, renderizar grid responsivo normal
  if (!shouldUseCarousel) {
    return (
      <div className={cn(
        "grid gap-4 sm:gap-6",
        data.length === 1 && "grid-cols-1",
        data.length === 2 && "grid-cols-1 lg:grid-cols-2",
        data.length >= 3 && "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
        className
      )}>
        {data.map((item, index) => renderChart(item, index))}
      </div>
    )
  }

  // Renderizar carrossel responsivo
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
                "pl-1 md:pl-2 lg:pl-4",
                // Responsive basis - adapta conforme o tamanho da tela
                "basis-full",
                // Em telas médias, mostra 1 por vez
                "md:basis-full",
                // Em telas grandes, mostra 2 por vez se houver mais de 2 charts
                data.length >= 2 && "lg:basis-1/2",
                // Em telas extra grandes, mostra até 3 por vez se houver mais de 2 charts
                data.length >= 3 && "xl:basis-1/3",
                // Garantir que não ultrapasse os limites
                "min-w-0"
              )}
            >
              {renderChart(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Mostrar controles de navegação */}
        {data.length > 1 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
            <CarouselNext className="right-2 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
          </>
        )}
      </Carousel>
    </div>
  )
}

// Componente wrapper específico para Access Analytics
export function AccessAnalyticsCarousel({ 
  data, 
  className,
  isLoading = false
}: { 
  data: AnalyticsChartData[]
  className?: string
  isLoading?: boolean
}) {
  return (
    <AnalyticsCarousel
      data={data}
      className={className}
      minChartsForCarousel={2}
      showCarousel={true}
      isLoading={isLoading}
      skeletonCount={3}
    />
  )
}
