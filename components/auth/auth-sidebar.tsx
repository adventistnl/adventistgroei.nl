'use client'

import { useRef, useCallback } from 'react'
import { AdventistLogo } from '@/components/ui/adventist-logo'

/**
 * Pilar decorativo padrão (coluna 7) das páginas de autenticação.
 * Fundo artístico: feixes diagonais luminosos + grain, animados,
 * com parallax e glow que seguem o mouse. Cores adaptam ao tema.
 */
export function AuthSidebar() {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // Posição do mouse em % (glow) e offset -50..50 (parallax)
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mx', `${px}%`)
    el.style.setProperty('--my', `${py}%`)
    el.style.setProperty('--ox', `${px - 50}`)
    el.style.setProperty('--oy', `${py - 50}`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '50%')
    el.style.setProperty('--my', '50%')
    el.style.setProperty('--ox', '0')
    el.style.setProperty('--oy', '0')
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="auth-sidebar col-span-1 relative overflow-hidden"
    >
      {/* Camada de arte com parallax (segue o mouse) */}
      <div className="auth-art">
        <div className="auth-beam auth-beam-1" />
        <div className="auth-beam auth-beam-2" />
        <div className="auth-beam auth-beam-3" />
        <div className="auth-beam auth-beam-4" />
      </div>

      {/* Glow interativo que segue o cursor */}
      <div className="auth-glow" />

      {/* Padrão de linhas a 45° */}
      <div className="auth-lines" />

      {/* Textura de grain (ruído) */}
      <div className="auth-grain" />

      {/* Vinheta para profundidade */}
      <div className="auth-vignette" />

      {/* Logo centralizado no topo */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div
          className="flex items-center justify-center"
          style={{ width: 'clamp(3rem, 8vw, 5rem)', height: 'clamp(3rem, 8vw, 5rem)' }}
        >
          <AdventistLogo className="w-full h-full text-gray-900 dark:text-white" />
        </div>
      </div>
    </div>
  )
}
