/**
 * Sistema de Cores para Gráficos - Paleta Centralizada
 * 
 * Arquivo central com todas as cores usadas em gráficos do sistema.
 * Baseado nas cores padrão --chart-1 a --chart-5 do globals.css
 * com suporte completo a light/dark mode.
 * 
 * Uso: Importe este arquivo em qualquer componente de gráfico.
 */

/**
 * Cores padrão do sistema de gráficos (baseado em --chart-1 a --chart-5)
 * Estas são as cores principais que devem ser usadas em todos os gráficos
 */
export const DEFAULT_CHART_COLORS = {
  chart1: {
    name: 'Primary Blue',
    light: '#3b5fc7',      // Convertido de oklch(0.646 0.222 41.116)
    dark: '#5b6fd8',       // Convertido de oklch(0.488 0.243 264.376)
    hsl: {
      light: '227 51% 51%',
      dark: '233 61% 61%',
    }
  },
  chart2: {
    name: 'Teal/Cyan',
    light: '#46a89c',      // Convertido de oklch(0.6 0.118 184.704)
    dark: '#50c9b8',       // Convertido de oklch(0.696 0.17 162.48)
    hsl: {
      light: '172 40% 47%',
      dark: '170 55% 55%',
    }
  },
  chart3: {
    name: 'Dark Gray/Orange',
    light: '#4a5568',      // Convertido de oklch(0.398 0.07 227.392)
    dark: '#e8a05d',       // Convertido de oklch(0.769 0.188 70.08)
    hsl: {
      light: '218 20% 35%',
      dark: '28 75% 64%',
    }
  },
  chart4: {
    name: 'Yellow/Purple',
    light: '#f5d547',      // Convertido de oklch(0.828 0.189 84.429)
    dark: '#b675d9',       // Convertido de oklch(0.627 0.265 303.9)
    hsl: {
      light: '50 89% 62%',
      dark: '283 56% 65%',
    }
  },
  chart5: {
    name: 'Orange/Red',
    light: '#e89a5d',      // Convertido de oklch(0.769 0.188 70.08)
    dark: '#e87171',       // Convertido de oklch(0.645 0.246 16.439)
    hsl: {
      light: '28 75% 64%',
      dark: '0 74% 68%',
    }
  },
} as const

/**
 * Paleta de cores para estrutura organizacional
 * Usa as cores padrão do sistema para consistência
 */
export const STRUCTURE_COLORS = {
  institutions: DEFAULT_CHART_COLORS.chart1,      // Azul primário
  regions: DEFAULT_CHART_COLORS.chart2,           // Teal/Cyan
  churches: DEFAULT_CHART_COLORS.chart5,          // Orange/Red (light) / Red (dark)
  institutionalDepts: DEFAULT_CHART_COLORS.chart4, // Yellow/Purple
  churchDepts: DEFAULT_CHART_COLORS.chart3,       // Dark Gray/Orange
} as const

/**
 * Paleta de cores para status e categorias
 * Baseada nas cores padrão do sistema
 */
export const STATUS_COLORS = {
  active: DEFAULT_CHART_COLORS.chart2,      // Teal - representa ativo
  pending: DEFAULT_CHART_COLORS.chart4,     // Yellow/Purple - representa pendente
  inactive: DEFAULT_CHART_COLORS.chart3,    // Gray - representa inativo
  rejected: DEFAULT_CHART_COLORS.chart5,    // Orange/Red - representa rejeitado
  approved: DEFAULT_CHART_COLORS.chart1,    // Blue - representa aprovado
} as const

/**
 * Paleta de cores para budget/finance
 */
export const BUDGET_COLORS = {
  allocated: DEFAULT_CHART_COLORS.chart1,   // Blue - orçamento alocado
  spent: DEFAULT_CHART_COLORS.chart5,       // Orange/Red - gasto
  available: DEFAULT_CHART_COLORS.chart2,   // Teal - disponível
  overbudget: DEFAULT_CHART_COLORS.chart4,  // Yellow/Purple - acima do orçamento
} as const

/**
 * Paleta de cores para prioridades
 */
export const PRIORITY_COLORS = {
  high: DEFAULT_CHART_COLORS.chart5,        // Orange/Red - alta prioridade
  medium: DEFAULT_CHART_COLORS.chart4,      // Yellow/Purple - média prioridade
  low: DEFAULT_CHART_COLORS.chart2,         // Teal - baixa prioridade
} as const

/**
 * Array de cores padrão para gráficos variados
 * Ordem otimizada para máximo contraste visual
 */
export const CHART_COLORS = [
  DEFAULT_CHART_COLORS.chart1,  // Blue
  DEFAULT_CHART_COLORS.chart2,  // Teal
  DEFAULT_CHART_COLORS.chart5,  // Orange/Red
  DEFAULT_CHART_COLORS.chart4,  // Yellow/Purple
  DEFAULT_CHART_COLORS.chart3,  // Gray/Orange
] as const

/**
 * Função helper para obter cor baseada no tema
 * @param colorObj - Objeto de cor com propriedades light e dark
 * @param isDark - Se é modo escuro
 * @returns String com a cor apropriada
 */
export function getThemeColor(colorObj: { light: string; dark: string }, isDark: boolean = false): string {
  return isDark ? colorObj.dark : colorObj.light
}

/**
 * Função helper para obter cor HSL baseada no tema
 * @param colorObj - Objeto de cor com propriedades hsl.light e hsl.dark
 * @param isDark - Se é modo escuro
 * @returns String HSL
 */
export function getThemeColorHSL(colorObj: { hsl: { light: string; dark: string } }, isDark: boolean = false): string {
  const hsl = isDark ? colorObj.hsl.dark : colorObj.hsl.light
  return `hsl(${hsl})`
}

/**
 * Função para obter array de cores do CHART_COLORS
 * @param count - Número de cores desejado (padrão: 5)
 * @param isDark - Se é modo escuro
 * @returns Array de cores
 */
export function getChartColorArray(count: number = 5, isDark: boolean = false): string[] {
  const colors = []
  for (let i = 0; i < count; i++) {
    const colorIndex = i % CHART_COLORS.length
    colors.push(isDark ? CHART_COLORS[colorIndex].dark : CHART_COLORS[colorIndex].light)
  }
  return colors
}

/**
 * Função para obter array de cores HSL do CHART_COLORS
 * @param count - Número de cores desejado (padrão: 5)
 * @param isDark - Se é modo escuro
 * @returns Array de strings HSL
 */
export function getChartColorArrayHSL(count: number = 5, isDark: boolean = false): string[] {
  const colors = []
  for (let i = 0; i < count; i++) {
    const colorIndex = i % CHART_COLORS.length
    const hsl = isDark ? CHART_COLORS[colorIndex].hsl.dark : CHART_COLORS[colorIndex].hsl.light
    colors.push(`hsl(${hsl})`)
  }
  return colors
}

/**
 * Mapa de variáveis CSS para usar diretamente em componentes
 * Referencia as variáveis --chart-1 a --chart-5 do globals.css
 */
export const CSS_CHART_VARS = {
  chart1: 'var(--chart-1)',
  chart2: 'var(--chart-2)',
  chart3: 'var(--chart-3)',
  chart4: 'var(--chart-4)',
  chart5: 'var(--chart-5)',
} as const

/**
 * Variáveis CSS organizadas por categoria
 * Referencia as variáveis personalizadas do globals.css
 */
export const CSS_VARIABLES = {
  // Structure colors
  structureInstitutions: 'var(--structure-institutions)',
  structureRegions: 'var(--structure-regions)',
  structureChurches: 'var(--structure-churches)',
  structureInstitutionalDepts: 'var(--structure-institutional-depts)',
  structureChurchDepts: 'var(--structure-church-depts)',
  
  // Status colors
  statusActive: 'var(--status-active)',
  statusPending: 'var(--status-pending)',
  statusInactive: 'var(--status-inactive)',
  statusRejected: 'var(--status-rejected)',
  statusApproved: 'var(--status-approved)',
  
  // Budget colors
  budgetAllocated: 'var(--budget-allocated)',
  budgetSpent: 'var(--budget-spent)',
  budgetAvailable: 'var(--budget-available)',
  budgetOverbudget: 'var(--budget-overbudget)',
  
  // Priority colors
  priorityHigh: 'var(--priority-high)',
  priorityMedium: 'var(--priority-medium)',
  priorityLow: 'var(--priority-low)',
} as const
