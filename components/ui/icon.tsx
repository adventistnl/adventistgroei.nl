import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface IconProps {
  icon: LucideIcon
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
  variant?: "default" | "muted" | "primary" | "secondary" | "destructive" | "success" | "warning"
  className?: string
}

const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4", 
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10"
}

const iconVariants = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  destructive: "text-destructive",
  success: "text-green-600",
  warning: "text-yellow-600"
}

export function Icon({ 
  icon: LucideIcon, 
  size = "md", 
  variant = "default", 
  className,
  ...props 
}: IconProps) {
  return (
    <LucideIcon 
      className={cn(
        iconSizes[size],
        iconVariants[variant],
        "flex-shrink-0",
        className
      )}
      {...props}
    />
  )
}

// Componente específico para ícones de botão
export interface ButtonIconProps extends Omit<IconProps, 'size'> {
  size?: "sm" | "md" | "lg"
}

export function ButtonIcon({ size = "md", ...props }: ButtonIconProps) {
  const buttonSizes = {
    sm: "sm" as const,
    md: "md" as const, 
    lg: "lg" as const
  }
  
  return <Icon size={buttonSizes[size]} {...props} />
}

// Componente para ícones de navegação
export function NavIcon({ size = "md", variant = "muted", ...props }: IconProps) {
  return <Icon size={size} variant={variant} {...props} />
}

export default Icon
