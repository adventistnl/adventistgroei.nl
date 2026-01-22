"use client"

import React from 'react'
import { EyeOff, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import "@/lib/i18n"

/**
 * PermissionDeniedOverlay Component Props
 */
interface PermissionDeniedOverlayProps {
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
 * PermissionDeniedOverlay Component
 * 
 * Componente reutilizável para mostrar conteúdo protegido por permissões.
 * Aplica blur no skeleton e exibe mensagem centralizada solicitando acesso.
 * 
 * @example Uso com WithPermission
 * ```tsx
 * <WithPermission
 *   requiredPermissions={[PermissionResolverName.AnnualBudgets]}
 *   fallback={
 *     <PermissionDeniedOverlay height="500px">
 *       <YourSkeletonComponent />
 *     </PermissionDeniedOverlay>
 *   }
 * >
 *   <YourProtectedContent />
 * </WithPermission>
 * ```
 * 
 * @example Com customização
 * ```tsx
 * <PermissionDeniedOverlay 
 *   height="400px"
 *   blurIntensity="high"
 *   customMessage={{
 *     title: "Acesso Restrito",
 *     description: "Entre em contato com seu gerente"
 *   }}
 * >
 *   <YourSkeleton />
 * </PermissionDeniedOverlay>
 * ```
 */
export function PermissionDeniedOverlay({
  children,
  height = '300px',
  blurIntensity = 'medium',
  customMessage,
  className,
}: PermissionDeniedOverlayProps) {
  const { t } = useTranslation()
  const blurClass = BLUR_INTENSITY[blurIntensity]

  return (
    <div 
      className={cn("w-full relative", className)}
      style={{ height }}
    >
      <div className={cn(
        "absolute inset-0 pointer-events-none select-none",
        blurClass
      )}>
        {children}
      </div>

      <div className="absolute text-card-foreground flex gap-6 rounded-xl border p-3 shadow-sm h-full inset-0 flex items-center justify-center backdrop-blur-sm z-10">
        {/* Card Minimalista */}
        <div className="">
          <EyeOff className="w-5 h-5  flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {customMessage?.title || t('permissions.access_denied')}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {customMessage?.description || t('permissions.request_access')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
