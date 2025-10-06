"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface ResponsiveGridCarouselProps {
  children: React.ReactNode
  className?: string
  autoplayDelay?: number
  enableAutoplay?: boolean
  gridCols?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: string
  itemPadding?: string
  useCardWrapper?: boolean
  breakpoint?: string // Breakpoint onde muda de grid para carousel (default: 'md')
}

/**
 * Componente genérico que renderiza children como Grid inteligente em telas grandes
 * e como Carousel em telas pequenas (tablets e celulares)
 * 
 * Layout Grid Desktop:
 * - 1 item: ocupa toda largura
 * - 2 itens: 50% cada
 * - 3 itens: primeiro 100%, outros dois 50% cada na linha abaixo
 * - 4+ itens: grid responsivo com máximo 2 linhas
 */
export function ResponsiveGridCarousel({
  children,
  className,
  autoplayDelay = 3000,
  enableAutoplay = true,
  gridCols = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  },
  gap = "gap-4",
  itemPadding = "p-2",
  useCardWrapper = false,
  breakpoint = "md"
}: ResponsiveGridCarouselProps) {
  
  const autoplayPlugin = useRef(
    enableAutoplay ? Autoplay({ 
      delay: autoplayDelay, 
      stopOnInteraction: true,
      stopOnMouseEnter: true
    }) : null
  )

  // Converter children em array
  const childrenArray = React.Children.toArray(children)
  const itemCount = childrenArray.length

  // Wrapper para cada item (opcional)
  const wrapItem = (child: React.ReactNode, index: number) => {
    if (useCardWrapper) {
      return (
        <Card key={index} className="w-full min-w-0 h-full">
          <CardContent className={cn("w-full h-full", itemPadding)}>
            {child}
          </CardContent>
        </Card>
      )
    }
    
    return (
      <div key={index} className={cn("w-full min-w-0 h-full", itemPadding)}>
        {child}
      </div>
    )
  }

  // Gerar layout inteligente baseado no número de itens
  const getGridLayout = () => {
    if (itemCount === 1) {
      return "grid grid-cols-1 w-full"
    }
    
    if (itemCount === 2) {
      return "grid grid-cols-1 md:grid-cols-2 w-full"
    }
    
    if (itemCount === 3) {
      return "grid grid-cols-1 md:grid-cols-2 w-full"
    }
    
    // 4 ou mais itens - grid responsivo limitado a 2 linhas
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full"
  }

  // Renderizar item com classes específicas baseado na posição e total
  const renderGridItem = (child: React.ReactNode, index: number) => {
    let itemClasses = "w-full min-w-0 h-full"
    
    if (itemCount === 3) {
      if (index === 0) {
        // Primeiro item ocupa toda a linha
        itemClasses = "w-full min-w-0 h-full md:col-span-2"
      } else {
        // Segundo e terceiro item dividem a linha abaixo
        itemClasses = "w-full min-w-0 h-full"
      }
    }
    
    return (
      <div key={index} className={itemClasses}>
        {wrapItem(child, index)}
      </div>
    )
  }

  // Renderizar Grid para desktop com layout inteligente
  const renderGrid = () => (
    <div className={cn(
      "w-full mx-auto overflow-hidden",
      className
    )}>
      <div className={cn(
        getGridLayout(),
        gap,
        "auto-rows-fr" // Garante altura uniforme
      )}>
        {childrenArray.slice(0, 8).map((child, index) => renderGridItem(child, index))}
      </div>
      
      {/* Mostrar itens extras se houver mais de 8 */}
      {itemCount > 8 && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            Showing 8 of {itemCount} items. 
            <button className="ml-2 text-primary hover:underline">
              View all
            </button>
          </p>
        </div>
      )}
    </div>
  )

  // Renderizar Carousel para mobile/tablet
  const renderCarousel = () => (
    <div className={cn("w-full mx-auto p-4 overflow-hidden", className)}>
      <Carousel
        plugins={autoplayPlugin.current ? [autoplayPlugin.current] : []}
        className="w-full"
        onMouseEnter={() => autoplayPlugin.current?.stop()}
        onMouseLeave={() => autoplayPlugin.current?.reset()}
        opts={{
          align: "start",
          loop: itemCount > 1,
          skipSnaps: false,
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {childrenArray.map((child, index) => (
            <CarouselItem 
              key={index}
              className={cn(
                "pl-2 md:pl-4",
                "basis-full", // Uma por vez em mobile
                "min-w-0"
              )}
            >
              {wrapItem(child, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Controles de navegação */}
        {itemCount > 1 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm border hover:bg-background/90 shadow-lg" />
            <CarouselNext className="right-2 h-8 w-8 sm:h-10 sm:w-10 bg-background/80 backdrop-blur-sm border hover:bg-background/90 shadow-lg" />
          </>
        )}
      </Carousel>
    </div>
  )

  // Renderização condicional baseada no tamanho da tela
  return (
    <>
      {/* Grid para Desktop - visível apenas em breakpoint maior */}
      <div className={cn(`hidden ${breakpoint}:block`)}>
        {renderGrid()}
      </div>
      
      {/* Carousel para Mobile/Tablet - visível apenas em breakpoint menor */}
      <div className={cn(`block ${breakpoint}:hidden`)}>
        {renderCarousel()}
      </div>
    </>
  )
}

// Componente wrapper específico para Analytics (mantém compatibilidade)
export function AnalyticsGridCarousel({
  children,
  className,
  autoplayDelay = 4000,
  enableAutoplay = false // Desabilitado por padrão para analytics
}: Omit<ResponsiveGridCarouselProps, 'gridCols' | 'useCardWrapper'>) {
  return (
    <ResponsiveGridCarousel
      className={className}
      autoplayDelay={autoplayDelay}
      enableAutoplay={enableAutoplay}
      gap="gap-4 sm:gap-6"
      itemPadding="p-0" // Analytics já tem seu próprio padding
      useCardWrapper={false} // Analytics já são cards
      breakpoint="md" // Muda para carousel em telas menores que md
    >
      {children}
    </ResponsiveGridCarousel>
  )
}

// Componente wrapper específico para KPI Cards
export function KPIGridCarousel({
  children,
  className,
  autoplayDelay = 3000,
  enableAutoplay = true
}: Omit<ResponsiveGridCarouselProps, 'gridCols' | 'useCardWrapper'>) {
  return (
    <ResponsiveGridCarousel
      className={className}
      autoplayDelay={autoplayDelay}
      enableAutoplay={enableAutoplay}
      gap="gap-3 sm:gap-4 lg:gap-6"
      itemPadding="p-1"
      useCardWrapper={false} // KPIs já são cards
      breakpoint="md"
    >
      {children}
    </ResponsiveGridCarousel>
  )
}
