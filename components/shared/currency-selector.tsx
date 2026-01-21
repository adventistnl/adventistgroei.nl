"use client"

import * as React from "react"
import { Check, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useCurrency } from "@/contexts/currency-context"
import { cn } from "@/lib/utils"

/**
 * ============================================================================
 * CURRENCY SELECTOR COMPONENT
 * ============================================================================
 * 
 * A dropdown component for selecting the global currency in the application.
 * This component is designed to be placed in the header alongside other
 * global settings like language and theme.
 * 
 * FEATURES:
 * - Dropdown menu with all available currencies
 * - Visual indicators (flags, symbols, currency codes)
 * - Current selection highlighted
 * - Accessible keyboard navigation
 * - Responsive design
 * - Works with global CurrencyContext
 * 
 * USAGE:
 * 
 * Basic usage (minimal):
 * ```tsx
 * <CurrencySelector />
 * ```
 * 
 * With custom variant:
 * ```tsx
 * <CurrencySelector variant="ghost" />
 * ```
 * 
 * With custom size:
 * ```tsx
 * <CurrencySelector size="sm" />
 * ```
 * 
 * PLACEMENT:
 * Typically placed in the header:
 * ```tsx
 * <header>
 *   <ThemeSwitcher />
 *   <LanguageSelector />
 *   <CurrencySelector />
 * </header>
 * ```
 * 
 * REQUIREMENTS:
 * - Must be used within a CurrencyProvider
 * - Requires @/contexts/currency-context
 * ============================================================================
 */

interface CurrencySelectorProps {
  /** Button variant (default: "outline") */
  variant?: "default" | "outline" | "ghost" | "secondary"
  /** Button size (default: "icon") */
  size?: "default" | "sm" | "lg" | "icon"
  /** Additional CSS classes */
  className?: string
  /** Show full currency name instead of just icon (default: false) */
  showLabel?: boolean
}

/**
 * CurrencySelector Component
 * 
 * A dropdown menu component for selecting the application's currency.
 * Integrates with the global CurrencyContext to persist user preferences.
 * 
 * @param variant - Button style variant
 * @param size - Button size
 * @param className - Additional CSS classes
 * @param showLabel - Display currency name next to icon
 * 
 * @example
 * ```tsx
 * // Icon only (recommended for header)
 * <CurrencySelector />
 * 
 * // With label (recommended for settings page)
 * <CurrencySelector showLabel size="default" />
 * ```
 */
export function CurrencySelector({
  variant = "outline",
  size = "icon",
  className,
  showLabel = false,
}: CurrencySelectorProps) {
  const { selectedCurrency, availableCurrencies, setCurrency } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "flex items-center gap-2",
            size === "icon" && "h-9 w-9",
            className
          )}
          title={`Current currency: ${selectedCurrency.name}`}
        >
          <Coins className="h-4 w-4" />
          {showLabel && (
            <span className="text-sm font-medium">
              {selectedCurrency.code}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
          Select Currency
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {availableCurrencies.map((currency) => {
          const isSelected = currency.code === selectedCurrency.code
          
          return (
            <DropdownMenuItem
              key={currency.code}
              onClick={() => setCurrency(currency.code)}
              className={cn(
                "flex items-center justify-between cursor-pointer",
                isSelected && "bg-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base" role="img" aria-label={currency.name}>
                  {currency.flag}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {currency.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currency.symbol} {currency.code}
                  </span>
                </div>
              </div>
              
              {isSelected && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * ============================================================================
 * EXAMPLES OF USAGE IN DIFFERENT CONTEXTS
 * ============================================================================
 * 
 * Example 1: Header Integration (Recommended)
 * In your header component, simply add the CurrencySelector alongside
 * other global settings like ThemeSwitcher and LanguageSelector.
 * 
 * Example 2: Settings Page
 * For settings pages, you can show the full label and use a larger size
 * for better visibility and user experience.
 * 
 * Example 3: Inline in Form
 * When used in forms, the selector can be styled to match form inputs
 * with custom className and showLabel prop.
 * 
 * Example 4: Mobile Responsive
 * For mobile layouts, you can conditionally show/hide the label based
 * on screen size using Tailwind responsive classes.
 * 
 * Refer to the component props and CURRENCY_SYSTEM.md documentation
 * for detailed implementation examples.
 * ============================================================================
 */
