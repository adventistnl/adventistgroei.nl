# 💰 Currency System - Quick Reference

## TL;DR

```tsx
// 1. Import the hook
import { useCurrency } from "@/contexts/currency-context"

// 2. Use in component
function MyComponent() {
  const { formatCurrency } = useCurrency()
  return <span>{formatCurrency(1234.56)}</span>
}

// 3. Add selector to UI
import { CurrencySelector } from "@/components/shared/currency-selector"
<CurrencySelector />
```

## 📍 Component Locations

- **Context:** `/contexts/currency-context.tsx`
- **Selector:** `/components/shared/currency-selector.tsx`
- **Docs:** `/docs/CURRENCY_SYSTEM.md`
- **Integration:** `/app/layout.tsx` (Provider) + `/components/modern-header.tsx` (Selector)

## 🎯 Common Use Cases

### Display Money
```tsx
const { formatCurrency } = useCurrency()
<span>{formatCurrency(99.99)}</span>
```

### Change Currency
```tsx
const { setCurrency } = useCurrency()
<button onClick={() => setCurrency('USD')}>Use USD</button>
```

### Get Currency Info
```tsx
const { selectedCurrency } = useCurrency()
<span>{selectedCurrency.symbol} {selectedCurrency.name}</span>
```

## 🔧 Formatting Options

```tsx
// Compact notation
formatCurrency(1500000, { compact: true }) // "€ 1,5M"

// Without symbol
formatCurrency(100, { showSymbol: false }) // "100"

// With code
formatCurrency(100, { showCode: true }) // "€ 100 (EUR)"

// Custom decimals
formatCurrency(99.999, { maxFractionDigits: 3 }) // "€ 99,999"
```

## 🌍 Supported Currencies

| Code | Name | Symbol | Flag |
|------|------|--------|------|
| EUR | Euro | € | 🇪🇺 |
| USD | US Dollar | $ | 🇺🇸 |
| GBP | British Pound | £ | 🇬🇧 |
| BRL | Brazilian Real | R$ | 🇧🇷 |

## ⚙️ CurrencySelector Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | `"outline"` | Button style |
| `size` | string | `"icon"` | Button size |
| `showLabel` | boolean | `false` | Show currency code |
| `className` | string | `""` | Additional CSS |

## 📖 Full Documentation

See `/docs/CURRENCY_SYSTEM.md` for:
- Detailed API reference
- Architecture diagrams
- Advanced examples
- Troubleshooting
- Adding new currencies

## ✅ Checklist for Using Currency

- [ ] Import `useCurrency` hook
- [ ] Use `formatCurrency()` for all money displays
- [ ] Never hardcode currency symbols
- [ ] Store amounts as numbers, format for display only
- [ ] Add `<CurrencySelector />` where appropriate
- [ ] Test with different currencies

## 🚨 Common Mistakes

❌ **Don't:**
```tsx
<span>€ {amount.toFixed(2)}</span>
const [price] = useState(formatCurrency(100)) // Storing formatted
```

✅ **Do:**
```tsx
const { formatCurrency } = useCurrency()
<span>{formatCurrency(amount)}</span>
const [price] = useState(100) // Store as number
```

---

**Quick Help:** If you see "useCurrency must be used within a CurrencyProvider", check that `<CurrencyProvider>` is in your app layout.
