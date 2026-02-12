"use client"

import React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrivacy } from '@/contexts/privacy-context'
import { useTranslation } from 'react-i18next'
import { privacyTranslations } from '@/lib/translations/privacy'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface GlobalPrivacyToggleProps {
  /** Custom class name for styling */
  className?: string
  /** Show as icon only or with text */
  variant?: 'icon' | 'text'
  /** Size of the button */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** Show label/count in icon variant */
  showLabel?: boolean
  /** Custom icon to replace default Eye/EyeOff */
  customIcon?: React.ReactNode
}

/**
 * Global Privacy Toggle Component
 * 
 * Botão reutilizável que detecta se algum conteúdo está oculto
 * e permite alternar a privacidade de todos os componentes registrados.
 * 
 * Uso:
 * ```tsx
 * <GlobalPrivacyToggle />
 * <GlobalPrivacyToggle variant="text" size="default" />
 * ```
 */
export function GlobalPrivacyToggle({
  className,
  variant = 'icon',
  size = 'icon',
  showLabel = false,
  customIcon,
}: GlobalPrivacyToggleProps) {
  const { i18n } = useTranslation()
  const t = privacyTranslations[i18n.language as keyof typeof privacyTranslations] || privacyTranslations.en
  const { privacyState, toggleGlobalPrivacy, getRegisteredComponents } = usePrivacy()

  // Verificar se há algum componente escondido
  const hasHiddenComponents = React.useMemo(() => {
    return Object.values(privacyState).some(isHidden => isHidden === true)
  }, [privacyState])

  // Verificar se todos os componentes estão escondidos
  const allHidden = React.useMemo(() => {
    const registered = getRegisteredComponents()
    if (registered.length === 0) return false
    
    return registered.every(component => privacyState[component.id] === true)
  }, [privacyState, getRegisteredComponents])

  // Contar quantos componentes estão escondidos
  const hiddenCount = React.useMemo(() => {
    return Object.values(privacyState).filter(isHidden => isHidden === true).length
  }, [privacyState])

  // Determinar ícone e tooltip
  const icon = customIcon || (allHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />)
  const tooltipText = allHidden 
    ? t.showAll
    : hasHiddenComponents 
      ? `${t.someHidden} (${hiddenCount})`
      : t.hideAll


  if (variant === 'icon') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={size}
              onClick={toggleGlobalPrivacy}
              className={cn(
                'transition-all',
                hasHiddenComponents && 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground',
                className
              )}
            >
              {icon}
              {showLabel && hasHiddenComponents && hiddenCount > 0 && (
                <span className="ml-1 text-xs font-semibold">
                  {hiddenCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Variant: text
  return (
    <Button
      variant="outline"
      size={size}
      onClick={toggleGlobalPrivacy}
      className={cn(
        'transition-all gap-2',
        hasHiddenComponents && 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground',
        className
      )}
    >
      {icon}
      <span>{allHidden ? t.showAll : t.hideAll}</span>
      {showLabel && hasHiddenComponents && hiddenCount > 0 && (
        <span className="ml-1 text-xs font-semibold">
          ({hiddenCount})
        </span>
      )}
    </Button>
  )
}
