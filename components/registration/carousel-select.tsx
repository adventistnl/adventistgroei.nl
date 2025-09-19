"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"

interface SelectItem {
  id: string
  name: string
  description?: string
  location?: string
}

interface CarouselSelectProps {
  items: SelectItem[]
  selectedItem?: string
  onSelect: (id: string) => void
  className?: string
  title?: string
  icon?: React.ReactNode
}

/**
 * Componente de seleção em carrossel
 * Dinâmico e responsivo que se adapta a diferentes containers
 * Garante mínimo de 3 cards visíveis por vez
 */
export function CarouselSelect({ 
  items, 
  selectedItem, 
  onSelect, 
  className,
  title,
  icon
}: CarouselSelectProps) {
  return (
    <div className={cn("w-full max-w-2xl ", className)}>
      {/* Header com título e ícone */}
      {title && (
        <div className="flex items-center gap-0.5rem text-0.875rem font-medium mb-1.5rem">
          {icon}
          {title}
        </div>
      )}

      {/* Carrossel */}
      <Carousel
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: true,
        }}
        className="w-full max-w-full max-w-2xl overflow-hidden"
      >
        <CarouselContent className="-ml-1 max-w-full">
          {items.map((item) => (
            <CarouselItem 
              key={item.id} 
              className="pl-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 min-w-0 max-w-full"
            >
              <div className="p-0.5 h-full">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:shadow-md h-full max-w-full",
                    selectedItem === item.id 
                      ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20" 
                      : "border-border hover:border-primary/30"
                  )}
                  onClick={() => onSelect(item.id)}
                >
                  <CardContent className="p-1rem h-full flex flex-col">
                    <div className="flex items-start gap-0.75rem h-full">
                      {/* Indicador de seleção */}
                      <div className={cn(
                        "w-1rem h-1rem rounded-full border-2 flex-shrink-0 mt-0.125rem transition-all duration-200",
                        selectedItem === item.id 
                          ? "bg-primary border-primary" 
                          : "border-muted-foreground/30"
                      )}>
                        {selectedItem === item.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50" />
                        )}
                      </div>
                      
                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="font-semibold text-0.875rem text-foreground mb-0.5rem leading-tight truncate">
                          {item.name}
                        </h4>
                        {item.description && (
                          <p className="text-0.75rem text-muted-foreground leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.location && (
                          <p className="text-0.75rem text-muted-foreground mt-0.25rem truncate">
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Botões de navegação */}
        <CarouselPrevious className="left-0 bg-background/80 backdrop-blur-sm border-2 hover:bg-background z-10" />
        <CarouselNext className="right-0 bg-background/80 backdrop-blur-sm border-2 hover:bg-background z-10" />
      </Carousel>
    </div>
  )
}

// Componentes específicos para departamentos e igrejas
interface DepartmentSelectProps {
  departments: SelectItem[]
  selectedDepartment?: string
  onSelect: (id: string) => void
  className?: string
}

export function DepartmentSelect({ 
  departments, 
  selectedDepartment, 
  onSelect, 
  className 
}: DepartmentSelectProps) {
  return (
    <CarouselSelect
      items={departments}
      selectedItem={selectedDepartment}
      onSelect={onSelect}
      className={className}
      title="Departamento"
    />
  )
}

interface ChurchSelectProps {
  churches: SelectItem[]
  selectedChurch?: string
  onSelect: (id: string) => void
  className?: string
}

export function ChurchSelect({ 
  churches, 
  selectedChurch, 
  onSelect, 
  className 
}: ChurchSelectProps) {
  return (
    <CarouselSelect
      items={churches}
      selectedItem={selectedChurch}
      onSelect={onSelect}
      className={className}
      title="Igreja"
    />
  )
}
