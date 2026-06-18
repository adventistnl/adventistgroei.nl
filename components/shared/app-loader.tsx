"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AdventistLogo } from "@/components/ui/adventist-logo"

/**
 * COMPONENTE ÚNICO DE LOADING — AppLoader
 *
 * Duas variantes:
 *   1. Apenas logo + anel giratório           → <AppLoader />
 *   2. Logo + anel + mensagem abaixo          → <AppLoader message="Carregando..." />
 *
 * Modos de exibição:
 *   • Inline (padrão)   → encaixado no fluxo normal do layout
 *   • Full-screen       → fullScreen → overlay fixo bg-background z-50
 *
 * Tamanhos: sm | md (padrão) | lg | xl
 *
 * @example
 * // Inline — spinner sem mensagem
 * <AppLoader />
 *
 * @example
 * // Full-screen com mensagem
 * <AppLoader fullScreen message="Carregando dashboard..." />
 *
 * @example
 * // Splash animado com saída (ex: LoginSplash)
 * <AppLoader fullScreen message="..." isExiting onExitComplete={fn} />
 *
 * @example
 * // Pequeno inline (ex: dentro de skeleton do sidebar)
 * <AppLoader size="sm" />
 */

interface AppLoaderProps {
  /**
   * Mensagem exibida abaixo do anel.
   * Sem message → apenas logo + spinner (variante 1).
   * Com message → logo + spinner + texto (variante 2).
   */
  message?: string

  /**
   * Tamanho do conjunto logo+anel.
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl"

  /**
   * Se true, o loader ocupa a tela inteira como overlay fixo.
   * Usa fixed inset-0 bg-background z-50.
   * @default false
   */
  fullScreen?: boolean

  /**
   * Classes CSS extras para o container externo.
   */
  className?: string

  /**
   * Classes CSS extras para o texto da mensagem.
   */
  messageClassName?: string

  /**
   * Se true, aplica animação de saída (slide-down).
   * Usar em conjunto com onExitComplete.
   * @default false
   */
  isExiting?: boolean

  /**
   * Callback chamado quando a animação de saída terminar (~700ms).
   */
  onExitComplete?: () => void
}

/** Mapeamento de tamanhos → classes CSS */
const SIZE_CONFIG = {
  sm: {
    ring:     "w-10 h-10 border-2",
    logo:     "w-5 h-5",
    text:     "text-xs mt-2",
  },
  md: {
    ring:     "w-16 h-16 border-[3px]",
    logo:     "w-8 h-8",
    text:     "text-sm mt-4",
  },
  lg: {
    ring:     "w-24 h-24 border-4",
    logo:     "w-11 h-11",
    text:     "text-base mt-6",
  },
  xl: {
    ring:     "w-28 h-28 border-[5px]",
    logo:     "w-13 h-13",
    text:     "text-lg mt-8",
  },
} as const

export function AppLoader({
  message,
  size = "lg",
  fullScreen = false,
  className,
  messageClassName,
  isExiting = false,
  onExitComplete,
}: AppLoaderProps) {
  const config = SIZE_CONFIG[size]

  // Chama onExitComplete após a duração da animação de saída
  React.useEffect(() => {
    if (isExiting && onExitComplete) {
      const timer = setTimeout(onExitComplete, 700)
      return () => clearTimeout(timer)
    }
  }, [isExiting, onExitComplete])

  const inner = (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      {/* Anel giratório com logo no centro */}
      <div className="relative">
        {/* Anel */}
        <div
          className={cn(
            "rounded-full border-muted border-t-primary animate-spin",
            config.ring
          )}
        />
        {/* Logo centralizado dentro do anel */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AdventistLogo className={cn("text-primary", config.logo)} />
        </div>
      </div>

      {/* Mensagem (variante 2 — só renderiza se message for fornecido) */}
      {message && (
        <p
          className={cn(
            "text-muted-foreground text-center leading-snug",
            config.text,
            messageClassName
          )}
        >
          {message}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div
        className={cn(
          "fixed inset-0 bg-background z-50 flex items-center justify-center",
          "transition-transform duration-700 ease-in-out",
          isExiting ? "translate-y-full" : "translate-y-0"
        )}
      >
        {inner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      {inner}
    </div>
  )
}
