/**
 * Currency Configuration Types
 * Sistema de moeda para formatação de valores monetários na aplicação
 */

export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  decimals: number
  thousandsSeparator: string
  decimalSeparator: string
  symbolPosition: 'before' | 'after'
  spaceAfterSymbol: boolean
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
    symbolPosition: 'before',
    spaceAfterSymbol: true,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    symbolPosition: 'before',
    spaceAfterSymbol: false,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimals: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    symbolPosition: 'before',
    spaceAfterSymbol: false,
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Brazilian Real',
    decimals: 2,
    thousandsSeparator: '.',
    decimalSeparator: ',',
    symbolPosition: 'before',
    spaceAfterSymbol: true,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    decimals: 2,
    thousandsSeparator: "'",
    decimalSeparator: '.',
    symbolPosition: 'before',
    spaceAfterSymbol: true,
  },
}

/**
 * Formata um valor numérico de acordo com a configuração de moeda
 */
export function formatCurrency(
  value: number,
  currency: CurrencyConfig,
  options?: {
    showSymbol?: boolean
    compact?: boolean // Se true, mostra K/M/B para valores grandes
    decimals?: number // Override do número de decimais
  }
): string {
  const showSymbol = options?.showSymbol ?? true
  const compact = options?.compact ?? false
  const decimals = options?.decimals ?? currency.decimals

  let formattedValue: string

  if (compact && Math.abs(value) >= 1000) {
    // Formato compacto (K, M, B)
    const absValue = Math.abs(value)
    let compactValue: number
    let suffix: string

    if (absValue >= 1_000_000_000) {
      compactValue = value / 1_000_000_000
      suffix = 'B'
    } else if (absValue >= 1_000_000) {
      compactValue = value / 1_000_000
      suffix = 'M'
    } else {
      compactValue = value / 1_000
      suffix = 'K'
    }

    const compactDecimals = Math.abs(compactValue) >= 100 ? 0 : 1
    formattedValue = compactValue.toFixed(compactDecimals) + suffix
  } else {
    // Formato normal
    const [integerPart, decimalPart] = Math.abs(value).toFixed(decimals).split('.')
    
    // Adicionar separador de milhares
    const formattedInteger = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      currency.thousandsSeparator
    )
    
    formattedValue = decimals > 0
      ? `${formattedInteger}${currency.decimalSeparator}${decimalPart}`
      : formattedInteger
    
    // Adicionar sinal negativo se necessário
    if (value < 0) {
      formattedValue = `-${formattedValue}`
    }
  }

  if (!showSymbol) {
    return formattedValue
  }

  // Adicionar símbolo da moeda
  const space = currency.spaceAfterSymbol ? ' ' : ''
  return currency.symbolPosition === 'before'
    ? `${currency.symbol}${space}${formattedValue}`
    : `${formattedValue}${space}${currency.symbol}`
}

/**
 * Obtém a configuração de moeda pelo código
 */
export function getCurrencyByCode(code: string): CurrencyConfig {
  return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.EUR
}

/**
 * Lista de todas as moedas suportadas
 */
export function getSupportedCurrencies(): CurrencyConfig[] {
  return Object.values(SUPPORTED_CURRENCIES)
}
