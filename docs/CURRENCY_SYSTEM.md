# 💰 Global Currency System Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
5. [Components](#components)
6. [Usage Examples](#usage-examples)
7. [Adding New Currencies](#adding-new-currencies)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Global Currency System provides a centralized, type-safe way to manage currency selection and formatting across the entire application. It ensures consistency in how monetary values are displayed regardless of the selected currency.

### Key Features

- ✅ **Global State Management** - Single source of truth for currency selection
- ✅ **Persistent Storage** - Currency preference saved in localStorage
- ✅ **Multiple Currencies** - Support for EUR, USD, GBP, BRL (extensible)
- ✅ **Automatic Formatting** - Locale-aware number formatting
- ✅ **Type Safety** - Full TypeScript support
- ✅ **UI Components** - Ready-to-use selector component
- ✅ **Toast Notifications** - User feedback on currency changes
- ✅ **Theme Support** - Works with light/dark modes

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Root                        │
│                    (app/layout.tsx)                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              CurrencyProvider                          │ │
│  │  • Manages global currency state                      │ │
│  │  • Persists to localStorage                           │ │
│  │  • Provides formatting utilities                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│          ┌───────────────┴───────────────┐                  │
│          │                               │                  │
│  ┌───────▼────────┐             ┌────────▼────────┐        │
│  │  UI Components │             │  Business Logic │        │
│  │  • Header      │             │  • Calculations │        │
│  │  • Modals      │             │  • Reports      │        │
│  │  • Tables      │             │  • Analytics    │        │
│  └────────────────┘             └─────────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
adventistgroei.nl/
├── contexts/
│   └── currency-context.tsx          # Core context and provider
├── components/
│   └── shared/
│       └── currency-selector.tsx     # UI selector component
├── docs/
│   └── CURRENCY_SYSTEM.md           # This documentation
└── app/
    └── layout.tsx                    # Provider integration
```

---

## 🚀 Quick Start

### 1. Import the Hook

In any component where you need currency functionality:

```tsx
import { useCurrency } from "@/contexts/currency-context"
```

### 2. Use the Hook

```tsx
function MyComponent() {
  const { formatCurrency, selectedCurrency } = useCurrency()
  
  return (
    <div>
      <p>Currency: {selectedCurrency.name}</p>
      <p>Price: {formatCurrency(99.99)}</p>
    </div>
  )
}
```

### 3. Add Currency Selector (Optional)

For pages where users should change currency:

```tsx
import { CurrencySelector } from "@/components/shared/currency-selector"

function SettingsPage() {
  return (
    <div>
      <h2>Currency Settings</h2>
      <CurrencySelector showLabel size="default" />
    </div>
  )
}
```

---

## 📚 API Reference

### `useCurrency()` Hook

Returns an object with the following properties and methods:

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `selectedCurrency` | `Currency` | Currently selected currency object |
| `availableCurrencies` | `Currency[]` | Array of all supported currencies |

#### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `setCurrency` | `(code: string) => void` | Change active currency by code |
| `formatCurrency` | `(amount: number, options?: FormatCurrencyOptions) => string` | Format number as currency |
| `getCurrencyByCode` | `(code: string) => Currency \| undefined` | Get currency details by code |

### Currency Type

```typescript
interface Currency {
  code: string              // ISO 4217 code (e.g., "EUR")
  name: string             // Full name (e.g., "Euro")
  symbol: string           // Symbol (e.g., "€")
  locale: string           // Locale code (e.g., "pt-PT")
  flag: string             // Emoji flag (e.g., "🇪🇺")
  minFractionDigits: number // Min decimal places
  maxFractionDigits: number // Max decimal places
}
```

### FormatCurrencyOptions

```typescript
interface FormatCurrencyOptions {
  showSymbol?: boolean        // Show currency symbol (default: true)
  showCode?: boolean          // Show currency code (default: false)
  minFractionDigits?: number  // Override min decimals
  maxFractionDigits?: number  // Override max decimals
  compact?: boolean           // Use compact notation (default: false)
}
```

---

## 🧩 Components

### CurrencySelector

A dropdown component for currency selection.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "outline" \| "ghost" \| "secondary"` | `"outline"` | Button style |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"icon"` | Button size |
| `className` | `string` | `""` | Additional CSS classes |
| `showLabel` | `boolean` | `false` | Show currency code next to icon |

#### Usage Examples

```tsx
// Icon only (header)
<CurrencySelector />

// With label (settings page)
<CurrencySelector showLabel size="default" />

// Custom styling
<CurrencySelector 
  variant="ghost" 
  size="sm"
  className="rounded-full"
/>
```

---

## 💡 Usage Examples

### Example 1: Display Price

```tsx
function ProductCard({ product }: { product: Product }) {
  const { formatCurrency } = useCurrency()
  
  return (
    <div className="card">
      <h3>{product.name}</h3>
      <p className="price">{formatCurrency(product.price)}</p>
    </div>
  )
}
```

### Example 2: Budget Calculation

```tsx
function BudgetSummary({ total, spent }: BudgetProps) {
  const { formatCurrency, selectedCurrency } = useCurrency()
  const remaining = total - spent
  const percentageSpent = (spent / total) * 100
  
  return (
    <div className="budget-summary">
      <div>
        <label>Total Budget:</label>
        <span>{formatCurrency(total)}</span>
      </div>
      <div>
        <label>Spent:</label>
        <span>{formatCurrency(spent)}</span>
      </div>
      <div>
        <label>Remaining:</label>
        <span className={remaining < 0 ? 'text-red-600' : 'text-green-600'}>
          {formatCurrency(remaining)}
        </span>
      </div>
      <div>
        <label>Currency:</label>
        <span>{selectedCurrency.flag} {selectedCurrency.name}</span>
      </div>
    </div>
  )
}
```

### Example 3: Data Table with Currency

```tsx
function ActivityTable({ activities }: { activities: Activity[] }) {
  const { formatCurrency } = useCurrency()
  
  return (
    <table>
      <thead>
        <tr>
          <th>Activity</th>
          <th>Budget</th>
          <th>Spent</th>
          <th>Remaining</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.id}>
            <td>{activity.name}</td>
            <td>{formatCurrency(activity.budget_amount)}</td>
            <td>{formatCurrency(activity.spent_amount || 0)}</td>
            <td>{formatCurrency(activity.budget_amount - (activity.spent_amount || 0))}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Example 4: Custom Formatting

```tsx
function CompactBudgetCard({ amount }: { amount: number }) {
  const { formatCurrency } = useCurrency()
  
  return (
    <div className="stat-card">
      <h4>Total Budget</h4>
      <p className="text-3xl font-bold">
        {/* Compact notation: 1.5M instead of 1,500,000 */}
        {formatCurrency(amount, { 
          compact: true,
          showCode: true 
        })}
      </p>
    </div>
  )
}
```

### Example 5: Form with Currency Input

```tsx
function BudgetForm() {
  const { selectedCurrency, formatCurrency } = useCurrency()
  const [amount, setAmount] = useState(0)
  
  return (
    <form>
      <label>
        Budget Amount ({selectedCurrency.symbol})
      </label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="0.00"
      />
      <p className="preview">
        Preview: {formatCurrency(amount)}
      </p>
    </form>
  )
}
```

### Example 6: Multi-Currency Comparison

```tsx
function CurrencyComparison({ baseAmount }: { baseAmount: number }) {
  const { availableCurrencies, formatCurrency, selectedCurrency, setCurrency } = useCurrency()
  
  return (
    <div className="comparison-grid">
      {availableCurrencies.map((currency) => {
        const isSelected = currency.code === selectedCurrency.code
        
        return (
          <button
            key={currency.code}
            onClick={() => setCurrency(currency.code)}
            className={isSelected ? 'selected' : ''}
          >
            <span className="flag">{currency.flag}</span>
            <span className="name">{currency.name}</span>
            <span className="amount">
              {/* Temporarily format with different currency */}
              {new Intl.NumberFormat(currency.locale, {
                style: 'currency',
                currency: currency.code
              }).format(baseAmount)}
            </span>
          </button>
        )
      })}
    </div>
  )
}
```

---

## ➕ Adding New Currencies

### Step 1: Update Currency Configuration

Edit `/contexts/currency-context.tsx`:

```typescript
export const SUPPORTED_CURRENCIES: Currency[] = [
  // ... existing currencies ...
  {
    code: "JPY",                    // ISO 4217 code
    name: "Japanese Yen",           // Display name
    symbol: "¥",                    // Currency symbol
    locale: "ja-JP",                // Locale for formatting
    flag: "🇯🇵",                    // Flag emoji
    minFractionDigits: 0,           // No decimals for Yen
    maxFractionDigits: 0,
  },
]
```

### Step 2: Test the New Currency

```tsx
function TestNewCurrency() {
  const { setCurrency, formatCurrency } = useCurrency()
  
  useEffect(() => {
    // Test the new currency
    setCurrency('JPY')
  }, [])
  
  return (
    <div>
      <p>{formatCurrency(1000)} {/* Should show: ¥1,000 */}</p>
    </div>
  )
}
```

### Step 3: Update Documentation

Add the new currency to this documentation file.

---

## ✅ Best Practices

### 1. Always Use the Hook

❌ **Bad:**
```tsx
// Hardcoded currency
<span>€ {amount.toFixed(2)}</span>
```

✅ **Good:**
```tsx
const { formatCurrency } = useCurrency()
<span>{formatCurrency(amount)}</span>
```

### 2. Don't Store Formatted Values

❌ **Bad:**
```tsx
const [budget, setBudget] = useState(formatCurrency(1000)) // "€ 1.000"
```

✅ **Good:**
```tsx
const [budget, setBudget] = useState(1000) // Store as number
// Format only for display
<span>{formatCurrency(budget)}</span>
```

### 3. Use Appropriate Formatting Options

```tsx
// For large numbers
<span>{formatCurrency(1500000, { compact: true })}</span> // "€ 1,5M"

// For exact values
<span>{formatCurrency(99.995, { maxFractionDigits: 3 })}</span> // "€ 99,995"

// For display without symbol
<span>{formatCurrency(100, { showSymbol: false, showCode: true })}</span> // "100 EUR"
```

### 4. Consider Accessibility

```tsx
<span aria-label={`${formatCurrency(amount)} ${selectedCurrency.name}`}>
  {formatCurrency(amount)}
</span>
```

### 5. Handle Null/Undefined Values

```tsx
function SafeCurrencyDisplay({ amount }: { amount?: number }) {
  const { formatCurrency } = useCurrency()
  
  if (amount == null) {
    return <span>N/A</span>
  }
  
  return <span>{formatCurrency(amount)}</span>
}
```

---

## 🔧 Troubleshooting

### Issue 1: "useCurrency must be used within a CurrencyProvider"

**Cause:** Component is outside the CurrencyProvider in the component tree.

**Solution:** Ensure `<CurrencyProvider>` wraps your app in `/app/layout.tsx`:

```tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  )
}
```

### Issue 2: Currency Not Persisting

**Cause:** localStorage not working or being cleared.

**Solution:** Check browser settings and localStorage:

```tsx
// Debug helper
console.log(localStorage.getItem('preferred-currency'))
```

### Issue 3: Incorrect Formatting

**Cause:** Wrong locale or currency code.

**Solution:** Verify currency configuration in `SUPPORTED_CURRENCIES`:

```typescript
{
  code: "EUR",        // Must be valid ISO 4217
  locale: "pt-PT",    // Must be valid locale
  // ...
}
```

### Issue 4: Currency Selector Not Appearing

**Cause:** Component not imported or props misconfigured.

**Solution:**

```tsx
// Correct import
import { CurrencySelector } from "@/components/shared/currency-selector"

// Check it's rendered
<CurrencySelector />
```

---

## 🎓 Additional Resources

- [ISO 4217 Currency Codes](https://en.wikipedia.org/wiki/ISO_4217)
- [MDN: Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [React Context API](https://react.dev/reference/react/useContext)

---

## 📝 Changelog

### Version 1.0.0 (2025-12-03)

- ✅ Initial implementation
- ✅ Support for EUR, USD, GBP, BRL
- ✅ CurrencyProvider context
- ✅ CurrencySelector component
- ✅ Complete documentation
- ✅ Integration with modern-header
- ✅ localStorage persistence
- ✅ Toast notifications

---

## 👥 Contributing

To contribute improvements to the currency system:

1. Update `/contexts/currency-context.tsx` for core functionality
2. Update `/components/shared/currency-selector.tsx` for UI
3. Update this documentation
4. Test with all supported currencies
5. Submit PR with clear description

---

**Last Updated:** 2025-12-03  
**Version:** 1.0.0  
**Author:** Development Team
