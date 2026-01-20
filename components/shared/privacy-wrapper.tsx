"use client"

import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { usePrivacy, useComponentPrivacy, type PrivacyConfig } from '@/contexts/privacy-context'
import { useTranslation } from 'react-i18next'
import { privacyTranslations } from '@/lib/translations/privacy'

/**
 * Blur intensity mapping
 */
const BLUR_CLASSES = {
  low: 'blur-[2px]',
  medium: 'blur-sm',
  high: 'blur-md',
} as const

/**
 * Privacy Wrapper Component Props
 */
interface PrivacyWrapperProps {
  /** Privacy configuration */
  config: PrivacyConfig
  /** Content to be protected */
  children: React.ReactNode
  /** Custom fallback component to render when privacy is active (replaces skeleton + overlay) */
  fallback?: React.ReactNode
  /** Custom skeleton component (optional, used if fallback is not provided) */
  skeleton?: React.ReactNode
  /** Custom hidden message (optional) - deprecated, always shows "Privacy Content" */
  hiddenMessage?: string
  /** Additional className for the wrapper */
  className?: string
  /** Show toggle button (always positioned at top-right) */
  showToggle?: boolean
  /** Toggle button position - deprecated, always uses 'top-right' */
  togglePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  /** Custom toggle button */
  customToggle?: (props: {
    isHidden: boolean
    toggle: () => void
    canToggle: boolean
  }) => React.ReactNode
  /** Callback when privacy state changes */
  onPrivacyChange?: (isHidden: boolean) => void
}

/**
 * Default Skeleton Component
 */
function DefaultSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-64 w-full" />
      <div className="flex gap-2 justify-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

/**
 * Privacy Toggle Button Component
 */
interface PrivacyToggleButtonProps {
  isHidden: boolean
  toggle: () => void
  canToggle: boolean
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

function PrivacyToggleButton({ 
  isHidden, 
  toggle, 
  canToggle,
  position 
}: PrivacyToggleButtonProps) {
  const { i18n } = useTranslation()
  const t = privacyTranslations[i18n.language as keyof typeof privacyTranslations] || privacyTranslations.en
  
  if (!canToggle) return null

  const positionClasses = {
    'top-right': 'absolute top-2 right-2',
    'top-left': 'absolute top-2 left-2',
    'bottom-right': 'absolute bottom-2 right-2',
    'bottom-left': 'absolute bottom-2 left-2',
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "relative group z-50 p-3 rounded-lg transition-all duration-200",
        "bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl",
        "border-2 border-gray-300 hover:border-blue-500",
        "ring-2 ring-offset-2",
        isHidden ? "ring-blue-500 border-blue-500" : "ring-transparent",
        positionClasses[position]
      )}
      title={isHidden ? t.showSensitive : t.hideSensitive}
      aria-label={isHidden ? t.showContent : t.hideContent}
    >
      {isHidden ? (
        <Eye className="w-5 h-5 text-blue-600 transition-colors duration-200" />
      ) : (
        <EyeOff className="w-5 h-5 text-blue-600 hover:text-gray-600 transition-colors duration-200" />
      )}
      
      {/* Tooltip */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl">
        {isHidden ? t.clickToShow : t.clickToHide}
      </div>
    </button>
  )
}

/**
 * Privacy Wrapper Component
 * 
 * Wraps any content and provides privacy toggle functionality with role-based access control.
 * The toggle button is always positioned at the top-right corner of the component.
 * 
 * When hidden, you can provide:
 * - `fallback`: Custom component to render (full control)
 * - `skeleton`: Skeleton with blur effect + default overlay message
 * - Neither: Uses default skeleton with overlay
 * 
 * @example
 * ```tsx
 * // With custom fallback
 * <PrivacyWrapper
 *   config={{
 *     id: 'budget-chart',
 *     level: 'confidential',
 *     allowedRoles: ['admin', 'finance_manager'],
 *   }}
 *   fallback={<div>Custom privacy message</div>}
 * >
 *   <YourSensitiveContent />
 * </PrivacyWrapper>
 * 
 * // With skeleton (default behavior)
 * <PrivacyWrapper
 *   config={{
 *     id: 'budget-chart',
 *     level: 'confidential',
 *     blurIntensity: 'high',
 *   }}
 * >
 *   <YourSensitiveContent />
 * </PrivacyWrapper>
 * ```
 */
export function PrivacyWrapper({
  config,
  children,
  fallback,
  skeleton,
  hiddenMessage,
  className,
  showToggle = true,
  togglePosition = 'top-right',
  customToggle,
  onPrivacyChange,
}: PrivacyWrapperProps) {
  const { i18n } = useTranslation()
  const t = privacyTranslations[i18n.language as keyof typeof privacyTranslations] || privacyTranslations.en
  const { isHidden, togglePrivacy, canToggle } = useComponentPrivacy(config)

  const blurIntensity = config.blurIntensity || 'medium'
  const blurClass = BLUR_CLASSES[blurIntensity]

  // Notify parent of privacy state changes
  React.useEffect(() => {
    onPrivacyChange?.(isHidden)
  }, [isHidden, onPrivacyChange])

  const handleToggle = () => {
    if (canToggle) {
      togglePrivacy()
    }
  }

  return (
    <div className={cn("relative", className)}>
      {isHidden ? (
        // Privacy Mode: Render fallback or skeleton with blur and centered message
        fallback ? (
          // Custom Fallback Component
          <div className="relative w-full h-full">
            {fallback}
            
            {/* Toggle Button - Always top-right */}
            {showToggle && !customToggle && (
              <PrivacyToggleButton
                isHidden={isHidden}
                toggle={handleToggle}
                canToggle={canToggle}
                position="top-right"
              />
            )}

            {/* Custom Toggle */}
            {customToggle && customToggle({
              isHidden,
              toggle: handleToggle,
              canToggle,
            })}
          </div>
        ) : (
          // Default Skeleton with Blur and Overlay
          <div className="relative w-full h-full min-h-[300px]">
            {/* Blurred Content */}
            <div className={cn(
              "w-full h-full pointer-events-none select-none",
              blurClass // Blur aplicado diretamente no skeleton
            )}>
              {skeleton || <DefaultSkeleton />}
            </div>
            
            {/* Overlay com Mensagem Centralizada */}
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-gray-900/95 text-white px-8 py-6 rounded-xl flex flex-col items-center gap-3 shadow-2xl max-w-md text-center border border-gray-700">
                <div className="flex items-center gap-3">
                  <EyeOff className="w-6 h-6" />
                  <span className="text-lg font-semibold">{t.privacyTitle}</span>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {t.privacyDescription}
                </p>
              </div>
            </div>

            {/* Toggle Button - Always top-right */}
            {showToggle && !customToggle && (
              <PrivacyToggleButton
                isHidden={isHidden}
                toggle={handleToggle}
                canToggle={canToggle}
                position="top-right"
              />
            )}

            {/* Custom Toggle */}
            {customToggle && customToggle({
              isHidden,
              toggle: handleToggle,
              canToggle,
            })}
          </div>
        )
      ) : (
        // Normal Mode: Show actual content
        <div className="relative w-full h-full">
          {children}
          
          {/* Toggle Button - Always top-right */}
          {showToggle && !customToggle && (
            <PrivacyToggleButton
              isHidden={isHidden}
              toggle={handleToggle}
              canToggle={canToggle}
              position="top-right"
            />
          )}

          {/* Custom Toggle */}
          {customToggle && customToggle({
            isHidden,
            toggle: handleToggle,
            canToggle,
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Inline Privacy Toggle Component
 * For use in headers or custom layouts
 */
interface InlinePrivacyToggleProps {
  config: PrivacyConfig
  className?: string
}

export function InlinePrivacyToggle({ config, className }: InlinePrivacyToggleProps) {
  const { i18n } = useTranslation()
  const t = privacyTranslations[i18n.language as keyof typeof privacyTranslations] || privacyTranslations.en
  const privacyContext = usePrivacy()
  const { isHidden, togglePrivacy, canToggle } = useComponentPrivacy(config)

  // 🔍 DEBUG: Expor dados essenciais para debug (somente em dev)
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
      // @ts-ignore
      window.__PRIVACY_DEBUG__ = {
        // @ts-ignore
        ...(window.__PRIVACY_DEBUG__ || {}),
        [config.id]: {
          configId: config.id,
          canToggle,
          isHidden,
          userRole: privacyContext.userRole,
          timestamp: new Date().toISOString()
        }
      }
    }
  }, [config.id, canToggle, isHidden, privacyContext.userRole])

  // Não renderizar se não tiver permissão
  if (!canToggle) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('🔒 Privacy toggle not available for user role:', privacyContext.userRole)
    }
    return null
  }

  return (
    <button
      onClick={togglePrivacy}
      className={cn(
        "relative group flex-shrink-0 transition-all duration-300",
        "cursor-pointer",
        "w-10 h-10 rounded-full", // 🎯 Círculo
        "border-2 border-dashed", // 🎯 Border dashed
        "flex items-center justify-center",
        // 🎯 Estados: hide (dark bg + white icon) vs show (transparent + opacity)
        isHidden 
          ? "bg-gray-900 border-gray-700 hover:bg-gray-800" // Dark background quando hidden
          : "bg-transparent border-gray-400 hover:border-gray-600 opacity-70 hover:opacity-100", // Transparent quando visible
        className
      )}
      title={isHidden ? t.showSensitive : t.hideSensitive}
      aria-label={isHidden ? t.showContent : t.hideContent}
      data-privacy-toggle={config.id}
      data-can-toggle={canToggle}
      data-is-hidden={isHidden}
    >
      {isHidden ? (
        <Eye className="w-4 h-4 text-white transition-colors duration-300" />
      ) : (
        <EyeOff className="w-4 h-4 text-gray-700 transition-colors duration-300" />
      )}
      
      {/* Tooltip */}
      <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
        {isHidden ? t.clickShow : t.clickHide}
      </div>
    </button>
  )
}

/**
 * HOC to wrap any component with privacy functionality
 */
export function withPrivacy<P extends object>(
  Component: React.ComponentType<P>,
  config: PrivacyConfig,
  options?: {
    fallback?: React.ReactNode
    skeleton?: React.ReactNode
    hiddenMessage?: string
    showToggle?: boolean
    togglePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  }
) {
  return function PrivacyWrappedComponent(props: P) {
    return (
      <PrivacyWrapper
        config={config}
        fallback={options?.fallback}
        skeleton={options?.skeleton}
        hiddenMessage={options?.hiddenMessage}
        showToggle={options?.showToggle}
        togglePosition={options?.togglePosition}
      >
        <Component {...props} />
      </PrivacyWrapper>
    )
  }
}
