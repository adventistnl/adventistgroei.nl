"use client"

import * as React from "react"
import { X, Check, Shield } from "lucide-react"
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Roles, Roles_roles } from "@/types/Roles"
import { CardsCarousel, CardData } from "@/components/shared/cards-carousel"

interface RoleSelectorProps {
  control: Control<any>
  name: string
  label: string
  roles: Roles_roles[]
  allowDeselect?: boolean
  className?: string
  useCarousel?: boolean // Nova prop para ativar carrossel
  cardWidthClass?: string // Largura dos cards no carrossel
}

export function RoleSelector({ 
  control, 
  name, 
  label, 
  roles, 
  allowDeselect = true, 
  className,
  useCarousel = true, // Padrão: usar carrossel
  cardWidthClass = "w-64" // Largura média para mostrar título completo
}: RoleSelectorProps) {
  const handleRoleClick = (roleValue: string, currentValue: string, onChange: (value: string) => void) => {
    if (currentValue === roleValue && allowDeselect) {
      onChange("")
    } else {
      onChange(roleValue)
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-3", className)}>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          
          {useCarousel ? (
            // Renderizar com CardsCarousel
            <CardsCarousel
              data={roles.map((role): CardData => ({
                id: role.id,
                title: role.name,
                subtitle: role.description,
                icon: Shield,
                isSelected: field.value === role.id,
                onClick: () => handleRoleClick(role.id, field.value, field.onChange),
                onDeselect: allowDeselect ? () => field.onChange("") : undefined,
                className: field.value === role.id 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }))}
              cardWidthClass={cardWidthClass}
              minCardsForCarousel={3}
              showCarousel={true}
            />
          ) : (
            // Renderizar layout original (grid/wrap)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roles.map((role) => {
                const isSelected = field.value === role.id
                
                return (
                  <div
                    key={role.id}
                    className={cn(
                      "relative cursor-pointer transition-all duration-300 p-4 rounded-xl border-2 group min-h-[60px]",
                      isSelected 
                        ? "border-foreground bg-foreground text-background shadow-lg scale-[1.02]" 
                        : "border-muted-foreground/20 bg-muted/5 hover:border-foreground/50 hover:bg-muted/20 hover:shadow-md"
                    )}
                    onClick={() => handleRoleClick(role.id, field.value, field.onChange)}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-background border-2 border-foreground rounded-full flex items-center justify-center z-10">
                        {allowDeselect ? (
                          <X className="w-3 h-3 text-foreground" />
                        ) : (
                          <Check className="w-3 h-3 text-foreground" />
                        )}
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="text-left h-full flex flex-col justify-center pr-3">
                      <div className={cn(
                        "font-semibold text-sm leading-tight mb-2",
                        isSelected ? "text-background" : "text-foreground"
                      )}>
                        {role.name}
                      </div>
                      <div className={cn(
                        "text-xs leading-relaxed",
                        isSelected ? "text-background/80" : "text-muted-foreground"
                      )}>
                        {role.description}
                      </div>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className={cn(
                      "absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100",
                      !isSelected && "bg-gradient-to-br from-foreground/5 to-foreground/10"
                    )} />
                  </div>
                )
              })}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
