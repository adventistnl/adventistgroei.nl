"use client"

import React from 'react'
import { EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import "@/lib/i18n"

/**
 * PrivacyOverlay Component Props
 */
interface PrivacyOverlayProps {
  /** Conteúdo que será borrado (skeleton) */
  children: React.ReactNode
  /** Altura do container (ex: "300px", "400px") */
  height?: string
  /** Intensidade do blur: 'low' | 'medium' | 'high' */
  blurIntensity?: 'low' | 'medium' | 'high'
  /** Mensagem customizada (opcional) */
  customMessage?: {
    title?: string
    description?: string
  }
  /** Classes CSS adicionais para o container */
  className?: string
}

/**
 * Mapeamento de intensidade do blur
 */
const BLUR_INTENSITY = {
  low: 'blur-[2px]',
  medium: 'blur-sm',
  high: 'blur-md',
} as const

/**
 * PrivacyOverlay Component
 * 
 * Componente reutilizável que envolve qualquer skeleton e aplica:
 * - Blur no conteúdo
 * - Overlay semi-transparente adaptável ao tema
 * - Mensagem centralizada minimalista com i18n
 * 
 * @example
 * ```tsx
 * <PrivacyOverlay height="300px">
 *   <YourCustomSkeleton />
 * </PrivacyOverlay>
 * ```
 * 
 * @example Com customização
 * ```tsx
 * <PrivacyOverlay 
 *   height="400px"
 *   blurIntensity="high"
 *   customMessage={{
 *     title: "Dados Restritos",
 *     description: "Entre em contato com o administrador"
 *   }}
 * >
 *   <YourCustomSkeleton />
 * </PrivacyOverlay>
 * ```
 */
export function PrivacyOverlay({
  children,
  height = '300px',
  blurIntensity = 'medium',
  customMessage,
  className,
}: PrivacyOverlayProps) {
  const { t } = useTranslation()
  const blurClass = BLUR_INTENSITY[blurIntensity]

  return (
    <div 
      className={cn("w-full relative", className)}
      style={{ height }}
    >
      {/* 🎯 CAMADA 1: Skeleton com Blur */}
      <div className={cn(
        "absolute inset-0 pointer-events-none select-none",
        blurClass
      )}>
        {children}
      </div>

      {/* 🎯 CAMADA 2: Overlay Minimalista com Tema */}
      <div className="absolute inset-0 flex items-center justify-center  backdrop-blur-sm z-10">
        {/* Card Minimalista */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-6 py-4 rounded-lg flex items-center gap-3 shadow-lg">
          <EyeOff className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {customMessage?.title || t('privacy.protected_content')}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {customMessage?.description || t('privacy.contact_admin')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook customizado para simplificar o uso de Privacy em componentes
 * 
 * @example
 * ```tsx
 * const { isHidden, PrivacyOverlay } = usePrivacyOverlay(PRIVACY_CONFIG)
 * 
 * return (
 *   <CardContent>
 *     {isHidden ? (
 *       <PrivacyOverlay>
 *         <YourSkeleton />
 *       </PrivacyOverlay>
 *     ) : (
 *       <YourContent />
 *     )}
 *   </CardContent>
 * )
 * ```
 */
export function usePrivacyOverlay(config: any, height = '300px', blurIntensity: 'low' | 'medium' | 'high' = 'medium') {
  // Importar useComponentPrivacy dinamicamente para evitar circular dependency
  const { useComponentPrivacy } = require('@/contexts/privacy-context')
  const { isHidden } = useComponentPrivacy(config)

  const PrivacyOverlayWrapper = ({ children, ...props }: Omit<PrivacyOverlayProps, 'children'> & { children: React.ReactNode }) => (
    <PrivacyOverlay height={height} blurIntensity={blurIntensity} {...props}>
      {children}
    </PrivacyOverlay>
  )

  return {
    isHidden,
    PrivacyOverlay: PrivacyOverlayWrapper,
  }
}
