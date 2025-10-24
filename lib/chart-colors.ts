/**
 * Sistema de Cores para Gráficos
 * 
 * Sistema centralizado e padronizado de cores para todos os gráficos da aplicação.
 * Suporta dark/light mode e gera variações automáticas baseadas em cores base.
 */

// Cores base do sistema (usando CSS variables para suportar dark/light mode)
export const BASE_COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  
  // Cores monocromáticas
  black: {
    light: 'hsl(0, 0%, 20%)',
    dark: 'hsl(0, 0%, 90%)',
  },
  white: {
    light: 'hsl(0, 0%, 100%)',
    dark: 'hsl(0, 0%, 10%)',
  },
  gray: {
    light: 'hsl(0, 0%, 60%)',
    dark: 'hsl(0, 0%, 40%)',
  },
  
  // Cores principais
  blue: {
    light: 'hsl(221, 83%, 53%)',
    dark: 'hsl(221, 83%, 60%)',
  },
  green: {
    light: 'hsl(142, 76%, 36%)',
    dark: 'hsl(142, 76%, 45%)',
  },
  red: {
    light: 'hsl(0, 72%, 51%)',
    dark: 'hsl(0, 72%, 60%)',
  },
  yellow: {
    light: 'hsl(45, 93%, 47%)',
    dark: 'hsl(45, 93%, 55%)',
  },
  purple: {
    light: 'hsl(262, 83%, 58%)',
    dark: 'hsl(262, 83%, 65%)',
  },
  orange: {
    light: 'hsl(24, 95%, 53%)',
    dark: 'hsl(24, 95%, 60%)',
  },
  teal: {
    light: 'hsl(173, 80%, 40%)',
    dark: 'hsl(173, 80%, 50%)',
  },
  pink: {
    light: 'hsl(330, 81%, 60%)',
    dark: 'hsl(330, 81%, 70%)',
  },
} as const

/**
 * Gera uma variação de cor baseada em HSL
 * @param hsl - String HSL (ex: 'hsl(221, 83%, 53%)')
 * @param lightness - Ajuste de luminosidade (-100 a 100)
 * @param saturation - Ajuste de saturação (-100 a 100)
 * @returns String HSL ajustada
 */
export function adjustHSL(hsl: string, lightness: number = 0, saturation: number = 0): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  if (!match) return hsl

  const h = parseInt(match[1])
  let s = parseInt(match[2]) + saturation
  let l = parseInt(match[3]) + lightness

  // Limitar valores
  s = Math.max(0, Math.min(100, s))
  l = Math.max(0, Math.min(100, l))

  return `hsl(${h}, ${s}%, ${l}%)`
}

/**
 * Gera um gradiente linear para gráficos de área
 * @param baseColor - Cor base HSL
 * @param stops - Array de stops [offset, opacity]
 * @returns Objeto com definições de gradiente
 */
export function createGradient(
  baseColor: string,
  stops: Array<[number, number]> = [[5, 0.8], [95, 0.1]]
) {
  return {
    id: `gradient-${baseColor.replace(/[^\w]/g, '')}`,
    stops: stops.map(([offset, opacity]) => ({
      offset: `${offset}%`,
      stopColor: baseColor,
      stopOpacity: opacity,
    })),
  }
}

/**
 * Gera uma paleta de cores automática para múltiplos departamentos/categorias
 * @param count - Número de cores necessárias
 * @param theme - 'light' ou 'dark'
 * @returns Array de cores HSL
 */
export function generatePalette(count: number, theme: 'light' | 'dark' = 'light'): string[] {
  const baseColors = [
    BASE_COLORS.blue[theme],
    BASE_COLORS.green[theme],
    BASE_COLORS.purple[theme],
    BASE_COLORS.orange[theme],
    BASE_COLORS.teal[theme],
    BASE_COLORS.pink[theme],
    BASE_COLORS.red[theme],
    BASE_COLORS.yellow[theme],
  ]

  // Se precisar de mais cores, gerar variações
  if (count <= baseColors.length) {
    return baseColors.slice(0, count)
  }

  const palette: string[] = [...baseColors]
  const variations = [-20, -10, 10, 20]
  
  while (palette.length < count) {
    for (const baseColor of baseColors) {
      if (palette.length >= count) break
      
      for (const variation of variations) {
        if (palette.length >= count) break
        palette.push(adjustHSL(baseColor, variation))
      }
    }
  }

  return palette.slice(0, count)
}

/**
 * Hook para obter cores de gráfico com suporte a dark mode
 */
export function useChartColors(theme?: 'light' | 'dark') {
  // Se não especificado, detectar do sistema ou usar light como padrão
  const isDark = theme === 'dark' || 
    (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  const currentTheme = isDark ? 'dark' : 'light'

  return {
    theme: currentTheme,
    colors: {
      blue: BASE_COLORS.blue[currentTheme],
      green: BASE_COLORS.green[currentTheme],
      red: BASE_COLORS.red[currentTheme],
      yellow: BASE_COLORS.yellow[currentTheme],
      purple: BASE_COLORS.purple[currentTheme],
      orange: BASE_COLORS.orange[currentTheme],
      teal: BASE_COLORS.teal[currentTheme],
      pink: BASE_COLORS.pink[currentTheme],
      gray: BASE_COLORS.gray[currentTheme],
      black: BASE_COLORS.black[currentTheme],
      white: BASE_COLORS.white[currentTheme],
    },
    generatePalette: (count: number) => generatePalette(count, currentTheme),
    adjustColor: adjustHSL,
    createGradient,
  }
}

/**
 * Configuração de cores pré-definidas para tipos comuns de gráficos
 */
export const CHART_PRESETS = {
  // Para gráficos de departamentos
  departments: (theme: 'light' | 'dark' = 'light') => ({
    finance: BASE_COLORS.blue[theme],
    education: BASE_COLORS.green[theme],
    youth: BASE_COLORS.purple[theme],
    missions: BASE_COLORS.orange[theme],
    communication: BASE_COLORS.teal[theme],
    administration: BASE_COLORS.gray[theme],
  }),

  // Para status (aprovado, pendente, rejeitado)
  status: (theme: 'light' | 'dark' = 'light') => ({
    approved: BASE_COLORS.green[theme],
    pending: BASE_COLORS.yellow[theme],
    rejected: BASE_COLORS.red[theme],
    under_review: BASE_COLORS.orange[theme],
  }),

  // Para roles de usuário
  roles: (theme: 'light' | 'dark' = 'light') => ({
    admin: BASE_COLORS.red[theme],
    finance_manager: BASE_COLORS.blue[theme],
    department_head: BASE_COLORS.purple[theme],
    church_leader: BASE_COLORS.green[theme],
    volunteer: BASE_COLORS.teal[theme],
  }),

  // Para regiões
  regions: (theme: 'light' | 'dark' = 'light') => ({
    north: BASE_COLORS.blue[theme],
    south: BASE_COLORS.green[theme],
    west: BASE_COLORS.purple[theme],
    east: BASE_COLORS.orange[theme],
    central: BASE_COLORS.teal[theme],
  }),
} as const

/**
 * Utilitário para criar config do Recharts/shadcn charts
 */
export function createChartConfig<T extends string>(
  categories: readonly T[],
  theme: 'light' | 'dark' = 'light'
) {
  const palette = generatePalette(categories.length, theme)
  
  const config: Record<string, { label: string; color: string }> = {}
  
  categories.forEach((category, index) => {
    config[category] = {
      label: category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' '),
      color: palette[index],
    }
  })

  return config
}

/**
 * Função auxiliar para CSS variables (para usar em gradientes)
 */
export function getCSSVariable(name: string): string {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Exportar tipo para TypeScript
 */
export type ChartTheme = 'light' | 'dark'
export type ChartColorKey = keyof typeof BASE_COLORS
export type ChartPresetKey = keyof typeof CHART_PRESETS
