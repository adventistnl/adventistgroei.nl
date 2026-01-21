import React from 'react'
import { useTranslation } from 'react-i18next'
import { Construction } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ComingSoonProps {
  /**
   * Título customizado (opcional)
   * Se não fornecido, usa a tradução padrão
   */
  title?: string
  /**
   * Descrição customizada (opcional)
   * Se não fornecida, usa a tradução padrão
   */
  description?: string
  /**
   * Ícone customizado (opcional)
   * Se não fornecido, usa Construction icon padrão
   */
  icon?: React.ComponentType<{ className?: string }>
  /**
   * Tamanho do componente
   * @default 'default'
   */
  size?: 'sm' | 'default' | 'lg' | 'full'
  /**
   * Se deve mostrar o card com borda
   * @default true
   */
  showCard?: boolean
  /**
   * Classes CSS adicionais
   */
  className?: string
  /**
   * Forçar modo de exibição independentemente do ambiente
   * Se não fornecido, detecta automaticamente baseado em NODE_ENV
   * @default undefined (auto-detect)
   */
  forceMode?: 'production' | 'development'
}

export function ComingSoon({
  title,
  description,
  icon: Icon = Construction,
  size = 'default',
  showCard = true,
  className,
  forceMode
}: ComingSoonProps) {
  const { t } = useTranslation()

  // Detecta o ambiente
  const isProduction = forceMode 
    ? forceMode === 'production' 
    : process.env.NODE_ENV === 'production'

  // Traduções padrão
  const defaultTitle = t('common.coming_soon') || 'Coming Soon'
  const defaultDescription = t('common.coming_soon_description') || 'This feature is under development and will be available soon.'

  // Configurações de tamanho
  const sizeConfig = {
    sm: {
      container: 'min-h-[200px] py-8',
      icon: 'w-12 h-12',
      title: 'text-lg sm:text-xl',
      description: 'text-xs sm:text-sm',
      spacing: 'gap-3'
    },
    default: {
      container: 'min-h-[300px] py-12',
      icon: 'w-16 h-16',
      title: 'text-xl sm:text-2xl lg:text-3xl',
      description: 'text-sm sm:text-base',
      spacing: 'gap-4'
    },
    lg: {
      container: 'min-h-[400px] py-16',
      icon: 'w-20 h-20',
      title: 'text-2xl sm:text-3xl lg:text-4xl',
      description: 'text-base sm:text-lg',
      spacing: 'gap-6'
    },
    full: {
      container: 'min-h-screen py-20',
      icon: 'w-24 h-24',
      title: 'text-3xl sm:text-4xl lg:text-5xl',
      description: 'text-lg sm:text-xl',
      spacing: 'gap-8'
    }
  }

  const config = sizeConfig[size]

  // Modo DEV: Badge flutuante no canto inferior direito
  if (!isProduction) {
    return (
      <div className={cn('relative w-full h-full', className)}>
        {/* Conteúdo filho passa através */}
        <div className="w-full h-full">
          {/* Espaço reservado para conteúdo futuro */}
        </div>

        {/* Badge flutuante */}
        <Badge
          variant="secondary"
          className={cn(
            'fixed bottom-4 right-4 z-50',
            'flex items-center gap-2 px-3 py-2',
            'shadow-lg border-2 border-primary/20',
            'hover:scale-105 transition-transform cursor-default',
            'animate-pulse'
          )}
        >
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium">
            {title || defaultTitle}
          </span>
        </Badge>
      </div>
    )
  }

  // Modo PRO: Exibição completa de Coming Soon
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8',
        config.container,
        config.spacing,
        className
      )}
    >
      {/* Ícone */}
      <div className="relative">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full animate-pulse" />
        <Icon
          className={cn(
            'relative text-muted-foreground',
            config.icon
          )}
        />
      </div>

      {/* Título */}
      <h2
        className={cn(
          'font-bold text-foreground',
          config.title
        )}
      >
        {title || defaultTitle}
      </h2>

      {/* Descrição */}
      <p
        className={cn(
          'text-muted-foreground max-w-md mx-auto',
          config.description
        )}
      >
        {description || defaultDescription}
      </p>

      {/* Decoração - Pontos animados */}
      <div className="flex items-center gap-2 mt-2">
        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )

  if (showCard) {
    return (
      <Card className="w-full">
        {content}
      </Card>
    )
  }

  return content
}

export default ComingSoon
