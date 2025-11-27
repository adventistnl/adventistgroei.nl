"use client"

import * as React from "react"
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
import { LucideIcon } from "lucide-react"

export interface CardData {
  id: string
  title: string
  subtitle?: string
  icon?: LucideIcon
  isSelected?: boolean
  onClick?: () => void
  onDeselect?: () => void
  className?: string
  headerAction?: React.ReactNode
  content?: React.ReactNode
}

interface CardsCarouselProps {
  data: CardData[]
  className?: string
  minCardsForCarousel?: number
  showCarousel?: boolean
  isLoading?: boolean
  skeletonCount?: number
  cardWidthClass?: string // Classe de largura para os cards (ex: "w-48", "w-64")
}

/**
 * Componente reutilizável de Cards com carrossel responsivo
 * Similar ao KPICards mas focado em cards de seleção (ex: roles, tags, etc)
 */
export function CardsCarousel({
  data,
  className,
  minCardsForCarousel = 4,
  showCarousel = true,
  isLoading = false,
  skeletonCount = 4,
  cardWidthClass = "w-52", // Largura média por padrão
}: CardsCarouselProps) {
  // Determinar se deve usar carrossel baseado no número de cards
  const shouldUseCarousel = showCarousel && data.length >= minCardsForCarousel

  // Skeleton para loading
  const renderSkeleton = () => (
    <Card className={cardWidthClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  )

  // Renderizar card individual
  const renderCard = (item: CardData, index: number) => {
    return (
      <Card
        key={item.id}
        className={cn(
          cardWidthClass,
          "relative flex flex-col h-full cursor-pointer transition-all",
          item.isSelected
            ? "border-primary bg-primary/5 shadow-sm"
            : "hover:border-muted-foreground/30 hover:shadow-sm",
          item.className
        )}
        onClick={item.onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {item.icon && <item.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
            <CardTitle className="text-sm font-medium whitespace-normal break-words leading-tight">
              {item.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {item.isSelected && item.onDeselect && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  item.onDeselect?.()
                }}
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                aria-label="Deselect"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            {item.headerAction}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-0">
          {item.subtitle && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {item.subtitle}
            </p>
          )}
          {item.content && (
            <div className="mt-2">
              {item.content}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Se está carregando, mostrar skeletons
  if (isLoading) {
    return (
      <div className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index}>{renderSkeleton()}</div>
        ))}
      </div>
    )
  }

  // Se não deve usar carrossel, renderizar scroll horizontal simples
  if (!shouldUseCarousel) {
    return (
      <div className={cn("flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent", className)}>
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
        <CarouselContent className="-ml-2 md:-ml-4">
          {data.map((item, index) => (
            <CarouselItem
              key={item.id}
              className="pl-2 md:pl-4 basis-auto"
            >
              {renderCard(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Mostrar controles apenas se houver mais de 3 cards */}
        {data.length > 3 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
            <CarouselNext className="right-2 h-8 w-8 bg-background/80 backdrop-blur-sm border hover:bg-background/90" />
          </>
        )}
      </Carousel>
    </div>
  )
}
