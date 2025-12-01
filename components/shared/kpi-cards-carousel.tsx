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
import { useComponentPrivacy, type PrivacyConfig } from "@/contexts/privacy-context"

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
  onClick?: () => void
  className?: string
  headerAction?: React.ReactNode
  privacyConfig?: PrivacyConfig // Nova propriedade para privacy
}

interface KPICardsProps {
  data: KPICardData[]
  className?: string
  minCardsForCarousel?: number
  showCarousel?: boolean
  isLoading?: boolean
  skeletonCount?: number
  variant?: "default" | "minimal" // "default" shows colors, "minimal" shows no colors
  customFirstCard?: React.ReactNode // Card customizado para primeira posição
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
  skeletonCount = 4,
  variant = "default", // Default shows colors
  customFirstCard
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
  const renderCard = (item: KPICardData, index: number) => {
    // Remove color-related classes when variant is minimal
    const cardClassName = variant === "minimal" 
      ? cn(
          "w-full min-w-0 relative flex flex-col h-full",
          // Remove border colors and hover effects for minimal variant
          item.className?.replace(/border-l-\w+-\d+/g, '')
                        .replace(/hover:bg-\w+-\d+/g, '')
                        .replace(/border-\w+-\d+/g, '')
        )
      : cn(
          "w-full min-w-0 relative flex flex-col h-full",
          item.className
        )

    return (
      <KPICardWithPrivacy
        key={item.id}
        item={item}
        cardClassName={cardClassName}
        variant={variant}
        formatValue={formatValue}
      />
    )
  }

  // Componente interno com privacy support
  const KPICardWithPrivacy = ({ item, cardClassName, variant, formatValue }: {
    item: KPICardData
    cardClassName: string
    variant: "default" | "minimal"
    formatValue: (value: string | number) => string
  }) => {
    const { isHidden } = useComponentPrivacy(item.privacyConfig || { id: item.id, level: 'public' })

    return (
      <Card 
        key={item.id} 
        className={cardClassName}
        onClick={item.onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
          <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            {item.headerAction}
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="flex-1">
            <div className={cn(
              "text-2xl font-bold truncate transition-all duration-300",
              isHidden && "blur-md select-none"
            )}>
              {formatValue(item.value)}
            </div>
            {item.subtitle && (
              <p className={cn(
                "text-xs text-muted-foreground line-clamp-2 mt-1 transition-all duration-300",
                isHidden && "blur-sm select-none"
              )}>
                {item.subtitle}
              </p>
            )}
          </div>
          {item.trend && (
            <p className={cn(
              "text-xs text-muted-foreground flex items-center gap-1 mt-2 transition-all duration-300",
              isHidden && "blur-sm select-none"
            )}>
              {variant === "default" ? (
                // Show colored trend icons for default variant
                item.trend.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
                )
              ) : (
                // Show neutral trend icons for minimal variant
                item.trend.isPositive ? (
                  <TrendingUp className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                )
              )}
              <span className="truncate">
                {item.trend.isPositive ? '+' : ''}{item.trend.value}% {item.trend.label || ''}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
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
    const totalCards = (customFirstCard ? 1 : 0) + data.length
    
    return (
      <div className={cn(
        "grid gap-6 auto-rows-fr",
        totalCards === 1 && "grid-cols-1",
        totalCards === 2 && "grid-cols-1 md:grid-cols-2",
        totalCards === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        totalCards >= 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}>
        {customFirstCard && <div>{customFirstCard}</div>}
        {data.map((item, index) => renderCard(item, index))}
      </div>
    )
  }

  // Calcular basis dinâmico baseado na quantidade total de cards (incluindo custom)
  const totalCards = (customFirstCard ? 1 : 0) + data.length
  
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
          {/* Custom First Card (se fornecido) */}
          {customFirstCard && (
            <CarouselItem 
              className={cn(
                "pl-2 md:pl-4 lg:pl-4 flex",
                getCardBasis(),
                "min-w-0"
              )}
            >
              {customFirstCard}
            </CarouselItem>
          )}
          
          {/* Regular KPI Cards */}
          {data.map((item, index) => (
            <CarouselItem 
              key={item.id} 
              className={cn(
                "pl-2 md:pl-4 lg:pl-4 flex",
                getCardBasis(),
                // Garantir que não ultrapasse os limites
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
