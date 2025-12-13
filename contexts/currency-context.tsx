"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"

/**
 * ============================================================================
 * CURRENCY CONTEXT - GLOBAL CURRENCY MANAGEMENT SYSTEM
 * ============================================================================
 * 
 * This context provides a global currency management system for the entire
 * application. It allows users to select their preferred currency and provides
 * utilities to format monetary values consistently across all components.
 * 
 * FEATURES:
 * - Global currency selection with persistence (localStorage)
 * - Support for multiple currencies (EUR, USD, GBP, BRL)
 * - Automatic number formatting based on selected currency
 * - Currency symbol and code access
 * - Toast notifications on currency change
 * 
 * USAGE:
 * 
 * 1. Wrap your app with CurrencyProvider:
 *    ```tsx
 *    <CurrencyProvider>
 *      <YourApp />
 *    </CurrencyProvider>
 *    ```
 * 
 * 2. Use the hook in any component:
 *    ```tsx
 *    const { selectedCurrency, formatCurrency } = useCurrency()
 *    
 *    // Format a value
 *    const formatted = formatCurrency(1234.56)
 *    // Output: "€ 1.234,56" (if EUR selected)
 *    ```
 * 
 * 3. Change currency programmatically:
 *    ```tsx
 *    const { setCurrency } = useCurrency()
 *    setCurrency('USD')
 *    ```
 * 
 * 4. Get currency details:
 *    ```tsx
 *    const { selectedCurrency, availableCurrencies } = useCurrency()
 *    console.log(selectedCurrency.symbol) // "€"
 *    console.log(selectedCurrency.name) // "Euro"
 *    ```
 * 
 * CONFIGURATION:
 * To add new currencies, update the SUPPORTED_CURRENCIES array below.
 * ============================================================================
 */

/**
 * Currency configuration interface
 */
export interface Currency {
  /** ISO 4217 currency code (e.g., EUR, USD) */
  code: string
  /** Full currency name for display */
  name: string
  /** Currency symbol (e.g., €, $, £) */
  symbol: string
  /** Locale code for number formatting (e.g., pt-BR, en-US) */
  locale: string
  /** Flag emoji for visual representation */
  flag: string
  /** Minimum fraction digits for display */
  minFractionDigits: number
  /** Maximum fraction digits for display */
  maxFractionDigits: number
}

/**
 * Supported currencies configuration
 * Add new currencies here to make them available system-wide
 */
export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    locale: "pt-PT",
    flag: "🇪🇺",
    minFractionDigits: 2,
    maxFractionDigits: 2,
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    locale: "en-US",
    flag: "🇺🇸",
    minFractionDigits: 2,
    maxFractionDigits: 2,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    locale: "en-GB",
    flag: "🇬🇧",
    minFractionDigits: 2,
    maxFractionDigits: 2,
  },
  {
    code: "BRL",
    name: "Brazilian Real",
    symbol: "R$",
    locale: "pt-BR",
    flag: "🇧🇷",
    minFractionDigits: 2,
    maxFractionDigits: 2,
  },
]

/**
 * Currency Context Type Definition
 */
interface CurrencyContextType {
  /** Currently selected currency */
  selectedCurrency: Currency
  /** Array of all available currencies */
  availableCurrencies: Currency[]
  /** Change the active currency */
  setCurrency: (code: string) => void
  /** Format a number as currency using current selection */
  formatCurrency: (amount: number, options?: FormatCurrencyOptions) => string
  /** Get currency details by code */
  getCurrencyByCode: (code: string) => Currency | undefined
}

/**
 * Options for currency formatting
 */
interface FormatCurrencyOptions {
  /** Show currency symbol (default: true) */
  showSymbol?: boolean
  /** Show currency code (default: false) */
  showCode?: boolean
  /** Override minimum fraction digits */
  minFractionDigits?: number
  /** Override maximum fraction digits */
  maxFractionDigits?: number
  /** Use compact notation for large numbers (default: false) */
  compact?: boolean
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

const STORAGE_KEY = "preferred-currency"
const DEFAULT_CURRENCY = "EUR" // Default currency for the system

/**
 * Currency Provider Component
 * Wraps the application to provide global currency management
 */
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // Initialize selected currency from localStorage or default
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const currency = SUPPORTED_CURRENCIES.find((c) => c.code === stored)
        if (currency) return currency
      }
    }
    return SUPPORTED_CURRENCIES.find((c) => c.code === DEFAULT_CURRENCY) || SUPPORTED_CURRENCIES[0]
  })

  // Save to localStorage whenever currency changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, selectedCurrency.code)
    }
  }, [selectedCurrency])

  /**
   * Change the active currency
   * @param code - ISO 4217 currency code
   */
  const setCurrency = useCallback((code: string) => {
    const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code)
    
    if (!currency) {
      toast.error(`Currency ${code} is not supported`)
      return
    }

    setSelectedCurrency(currency)
    
    toast.success(`Currency changed to ${currency.flag} ${currency.name}`, {
      duration: 2000,
      style: { minWidth: "250px" },
    })
  }, [])

  /**
   * Format a number as currency
   * @param amount - The numeric amount to format
   * @param options - Formatting options
   * @returns Formatted currency string
   */
  const formatCurrency = useCallback(
    (amount: number, options: FormatCurrencyOptions = {}): string => {
      const {
        showSymbol = true,
        showCode = false,
        minFractionDigits = selectedCurrency.minFractionDigits,
        maxFractionDigits = selectedCurrency.maxFractionDigits,
        compact = false,
      } = options

      try {
        const formatter = new Intl.NumberFormat(selectedCurrency.locale, {
          style: showSymbol ? "currency" : "decimal",
          currency: selectedCurrency.code,
          minimumFractionDigits: minFractionDigits,
          maximumFractionDigits: maxFractionDigits,
          notation: compact ? "compact" : "standard",
        })

        let formatted = formatter.format(amount)

        // Add currency code if requested
        if (showCode && !showSymbol) {
          formatted = `${formatted} ${selectedCurrency.code}`
        } else if (showCode && showSymbol) {
          formatted = `${formatted} (${selectedCurrency.code})`
        }

        return formatted
      } catch (error) {
        console.error("Error formatting currency:", error)
        return `${selectedCurrency.symbol} ${amount.toFixed(2)}`
      }
    },
    [selectedCurrency]
  )

  /**
   * Get currency details by code
   * @param code - ISO 4217 currency code
   * @returns Currency object or undefined
   */
  const getCurrencyByCode = useCallback((code: string): Currency | undefined => {
    return SUPPORTED_CURRENCIES.find((c) => c.code === code)
  }, [])

  const value: CurrencyContextType = {
    selectedCurrency,
    availableCurrencies: SUPPORTED_CURRENCIES,
    setCurrency,
    formatCurrency,
    getCurrencyByCode,
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

/**
 * Hook to use currency context
 * @throws Error if used outside CurrencyProvider
 * @returns Currency context value
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { selectedCurrency, formatCurrency } = useCurrency()
 *   
 *   return (
 *     <div>
 *       <p>Current currency: {selectedCurrency.name}</p>
 *       <p>Price: {formatCurrency(99.99)}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useCurrency() {
  const context = useContext(CurrencyContext)
  
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  
  return context
}

/**
 * ============================================================================
 * EXAMPLES OF USAGE
 * ============================================================================
 * 
 * Example 1: Basic usage
 * ```tsx
 * function PriceDisplay({ price }: { price: number }) {
 *   const { formatCurrency } = useCurrency()
 *   return <span>{formatCurrency(price)}</span>
 * }
 * ```
 * 
 * Example 2: Custom formatting
 * ```tsx
 * function CompactPrice({ amount }: { amount: number }) {
 *   const { formatCurrency } = useCurrency()
 *   return (
 *     <span>
 *       {formatCurrency(amount, { 
 *         compact: true, 
 *         showCode: true 
 *       })}
 *     </span>
 *   )
 * }
 * ```
 * 
 * Example 3: Currency selector
 * ```tsx
 * function CurrencyPicker() {
 *   const { selectedCurrency, availableCurrencies, setCurrency } = useCurrency()
 *   
 *   return (
 *     <select 
 *       value={selectedCurrency.code}
 *       onChange={(e) => setCurrency(e.target.value)}
 *     >
 *       {availableCurrencies.map((currency) => (
 *         <option key={currency.code} value={currency.code}>
 *           {currency.flag} {currency.name}
 *         </option>
 *       ))}
 *     </select>
 *   )
 * }
 * ```
 * 
 * Example 4: Budget calculations
 * ```tsx
 * function BudgetCard({ total, spent }: { total: number; spent: number }) {
 *   const { formatCurrency, selectedCurrency } = useCurrency()
 *   const remaining = total - spent
 *   
 *   return (
 *     <div>
 *       <p>Total: {formatCurrency(total)}</p>
 *       <p>Spent: {formatCurrency(spent)}</p>
 *       <p>Remaining: {formatCurrency(remaining)}</p>
 *       <p>Currency: {selectedCurrency.name} ({selectedCurrency.code})</p>
 *     </div>
 *   )
 * }
 * ```
 * ============================================================================
 */
