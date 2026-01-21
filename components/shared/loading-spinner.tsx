"use client"

import * as React from "react"
import { Building2, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  /**
   * Texto a ser exibido abaixo do spinner
   */
  text?: string
  
  /**
   * Ícone a ser exibido no centro do spinner
   * @default Building2
   */
  icon?: LucideIcon
  
  /**
   * Componente React customizado para usar no centro do spinner
   * Alternativa ao icon quando se quer usar um componente não-Lucide
   */
  customIcon?: React.ComponentType<{ className?: string }>
  
  /**
   * Tamanho do spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl"
  
  /**
   * Se true, o spinner ocupa toda a tela como overlay
   * @default false
   */
  fullScreen?: boolean
  
  /**
   * Classes CSS adicionais para o container
   */
  className?: string
  
  /**
   * Classes CSS adicionais para o texto
   */
  textClassName?: string
  
  /**
   * Se true, aplica animação de saída deslizando para baixo
   * @default false
   */
  isExiting?: boolean
  
  /**
   * Callback chamado quando a animação de saída terminar
   */
  onExitComplete?: () => void
}

const sizeConfig = {
  sm: {
    spinner: "w-8 h-8 border-2",
    icon: "w-3 h-3",
    text: "text-xs",
    gap: "mb-2"
  },
  md: {
    spinner: "w-12 h-12 border-4",
    icon: "w-5 h-5",
    text: "text-sm",
    gap: "mb-4"
  },
  lg: {
    spinner: "w-16 h-16 border-4",
    icon: "w-6 h-6",
    text: "text-base",
    gap: "mb-6"
  },
  xl: {
    spinner: "w-20 h-20 border-[6px]",
    icon: "w-8 h-8",
    text: "text-lg",
    gap: "mb-8"
  }
}

/**
 * COMPONENTE DE LOADING SPINNER REUTILIZÁVEL
 * 
 * Características:
 * - Spinner animado com ícone centralizado
 * - Suporte para texto opcional abaixo do spinner
 * - Múltiplos tamanhos (sm, md, lg, xl)
 * - Modo full-screen overlay ou inline
 * - Totalmente customizável via props e classes CSS
 * 
 * @example
 * // Uso básico inline
 * <LoadingSpinner text="Loading..." />
 * 
 * @example
 * // Full-screen overlay
 * <LoadingSpinner text="Loading institutions..." fullScreen />
 * 
 * @example
 * // Pequeno sem texto
 * <LoadingSpinner size="sm" />
 * 
 * @example
 * // Com ícone customizado
 * <LoadingSpinner icon={Church} text="Loading churches..." size="lg" />
 */
export function LoadingSpinner({
  text,
  icon: Icon = Building2,
  customIcon: CustomIcon,
  size = "md",
  fullScreen = false,
  className,
  textClassName,
  isExiting = false,
  onExitComplete
}: LoadingSpinnerProps) {
  const config = sizeConfig[size]
  
  // Efeito para chamar callback quando animação de saída terminar
  React.useEffect(() => {
    if (isExiting && onExitComplete) {
      const timer = setTimeout(() => {
        onExitComplete()
      }, 700) // Duração da animação
      return () => clearTimeout(timer)
    }
  }, [isExiting, onExitComplete])
  
  const spinnerContent = (
    <div className={cn("text-center", className)}>
      <div className="relative">
        <div 
          className={cn(
            "border-muted border-t-primary rounded-full animate-spin mx-auto",
            config.spinner,
            config.gap
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {CustomIcon ? (
            <CustomIcon className={cn("text-primary", config.icon)} />
          ) : (
            <Icon className={cn("text-primary", config.icon)} />
          )}
        </div>
      </div>
      {text && (
        <p className={cn("text-muted-foreground", config.text, textClassName)}>
          {text}
        </p>
      )}
    </div>
  )
  
  if (fullScreen) {
    return (
      <div 
        className={cn(
          "fixed inset-0 bg-background z-50 flex items-center justify-center transition-transform duration-700 ease-in-out",
          isExiting ? "transform translate-y-full" : "transform translate-y-0"
        )}
        style={{ 
          transform: isExiting ? 'translateY(100vh)' : 'translateY(0)',
        }}
      >
        {spinnerContent}
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center">
      {spinnerContent}
    </div>
  )
}

/**
 * VARIANTE: Loading Overlay
 * Componente que pode ser usado para sobrepor conteúdo existente
 * 
 * @example
 * <div className="relative">
 *   <YourContent />
 *   {isLoading && <LoadingOverlay text="Updating..." />}
 * </div>
 */
export function LoadingOverlay({
  text,
  icon,
  size = "md",
  className,
  textClassName
}: Omit<LoadingSpinnerProps, 'fullScreen'>) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <LoadingSpinner
        text={text}
        icon={icon}
        size={size}
        className={className}
        textClassName={textClassName}
      />
    </div>
  )
}
