# 🔄 Privacy System Migration Guide

## Quick Migration Steps

### Step 1: Add Privacy Provider ✅ DONE

**File**: `app/layout.tsx`

```typescript
import { PrivacyProviderWithAuth } from '@/components/shared/privacy-provider-with-auth'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GraphQLProvider>
          <AuthProvider>
            {/* PrivacyProviderWithAuth automatically reads user role from AuthContext */}
            <PrivacyProviderWithAuth>
              <InstitutionProvider>
                {/* ... other providers ... */}
                {children}
              </InstitutionProvider>
            </PrivacyProviderWithAuth>
          </AuthProvider>
        </GraphQLProvider>
      </body>
    </html>
  )
}
```

**Note**: The `PrivacyProviderWithAuth` component automatically:
- Reads user role from `AuthContext`
- Maps `user_roles` array to privacy system roles
- Defaults to 'admin' for development/testing
- Supports role hierarchy

### Step 2: Choose Your Implementation Style

#### Option A: Inline Toggle (Simplest) ⭐

**Before:**
```typescript
const [isHidden, setIsHidden] = useState(false)

<button onClick={() => setIsHidden(!isHidden)}>
  Toggle
</button>
```

**After:**
```typescript
import { InlinePrivacyToggle, useComponentPrivacy } from '@/components/shared/privacy-wrapper'

const CONFIG = {
  id: 'my-component',
  level: 'confidential',
}

const { isHidden } = useComponentPrivacy(CONFIG)

<InlinePrivacyToggle config={CONFIG} />
```

#### Option B: Full Wrapper (Recommended) ⭐⭐

**Before:**
```typescript
<div>
  {isHidden ? <Skeleton /> : <Content />}
</div>
```

**After:**
```typescript
import { PrivacyWrapper } from '@/components/shared/privacy-wrapper'

<PrivacyWrapper
  config={{
    id: 'my-component',
    level: 'confidential',
  }}
>
  <Content />
</PrivacyWrapper>
```

### Step 3: Configure Privacy Levels

```typescript
// Public - Everyone sees
level: 'public'

// Internal - Employees only  
level: 'internal'

// Confidential - Managers only
level: 'confidential'

// Restricted - Admin only
level: 'restricted'
```

### Step 4: Test with Different Roles

```typescript
// In your layout or test environment
<PrivacyProvider userRole="user">        // Regular user
<PrivacyProvider userRole="department_head">  // Department head
<PrivacyProvider userRole="finance_manager">  // Finance manager
<PrivacyProvider userRole="admin">       // Admin
```

## Component-by-Component Migration

### Migrate: DepartmentSpendingChart ✅

**Old Code** (Lines to Remove):
```typescript
// Remove useState import
import React, { useMemo, useState } from "react"

// Remove Eye/EyeOff imports
import { Eye, EyeOff } from "lucide-react"

// Remove state
const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(false)

// Remove manual button
<button onClick={() => setIsPrivacyEnabled(!isPrivacyEnabled)}>
  {isPrivacyEnabled ? <Eye /> : <EyeOff />}
</button>

// Remove manual blur/overlay logic
{isPrivacyEnabled ? (
  <div className="blur-sm">...</div>
) : (
  <Content />
)}
```

**New Code** (Already Implemented):
```typescript
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'
import { useComponentPrivacy } from '@/contexts/privacy-context'

const PRIVACY_CONFIG = {
  id: 'department-spending-chart',
  level: 'confidential',
  allowedRoles: ['admin', 'finance_manager', 'department_head'],
  persistent: true,
}

const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

<InlinePrivacyToggle config={PRIVACY_CONFIG} />

{isHidden ? <Skeleton /> : <Chart />}
```

### Migrate: BudgetDistributionChart (Pending)

**File**: `components/charts/annual-budget/budget-distribution-chart.tsx`

```typescript
// 1. Add imports
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'
import { useComponentPrivacy } from '@/contexts/privacy-context'

// 2. Add config
const PRIVACY_CONFIG = {
  id: 'budget-distribution-chart',
  level: 'confidential',
  persistent: true,
}

// 3. Use hook
const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

// 4. Add toggle to header
<CardHeader>
  <div className="flex justify-between">
    <CardTitle>Budget Distribution</CardTitle>
    <InlinePrivacyToggle config={PRIVACY_CONFIG} />
  </div>
</CardHeader>

// 5. Conditional rendering
<CardContent>
  {isHidden ? (
    <Skeleton className="h-64 w-full" />
  ) : (
    <ActualChart />
  )}
</CardContent>
```

### Migrate: SpendingOverTimeChart (Pending)

**File**: `components/charts/annual-budget/spending-over-time-chart.tsx`

```typescript
const PRIVACY_CONFIG = {
  id: 'spending-over-time-chart',
  level: 'internal',
  allowedRoles: ['admin', 'finance_manager', 'department_head', 'user'],
  persistent: true,
}

const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

// Add toggle + conditional rendering
```

### Migrate: KPI Cards (Pending)

**File**: `app/finance/annual-budget/page.tsx`

Option 1: Wrap individual KPI cards
```typescript
<PrivacyWrapper
  config={{
    id: 'kpi-total-budget',
    level: 'internal',
  }}
  showToggle={true}
  togglePosition="top-right"
>
  <KPICard data={kpiData.totalBudget} />
</PrivacyWrapper>
```

Option 2: Wrap all KPI cards together
```typescript
<PrivacyWrapper
  config={{
    id: 'kpi-section',
    level: 'internal',
  }}
>
  <div className="grid grid-cols-5 gap-4">
    {kpiCardsData.map(card => (
      <KPICard key={card.id} data={card} />
    ))}
  </div>
</PrivacyWrapper>
```

## Checklist

- [ ] Add `PrivacyProvider` to `app/layout.tsx`
- [ ] Connect user role from auth context
- [ ] Migrate `DepartmentSpendingChart` (✅ Done)
- [ ] Migrate `BudgetDistributionChart`
- [ ] Migrate `SpendingOverTimeChart`
- [ ] Migrate KPI Cards section
- [ ] Migrate Budget Requests Table (optional)
- [ ] Test with `admin` role
- [ ] Test with `finance_manager` role
- [ ] Test with `department_head` role
- [ ] Test with `user` role
- [ ] Test persistent state (localStorage)
- [ ] Test privacy level permissions
- [ ] Update documentation

## Common Issues & Solutions

### Issue: "usePrivacy must be used within PrivacyProvider"
**Solution**: Ensure `PrivacyProvider` wraps your app in `layout.tsx`

### Issue: Toggle button not showing
**Solution**: Check user role has permission for that privacy level

### Issue: State not persisting
**Solution**: Add `persistent: true` to config

### Issue: Multiple components sharing unwanted state
**Solution**: Ensure each component has unique `id` in config

## Testing Roles

Create a role switcher for development:

```typescript
// components/dev/role-switcher.tsx
'use client'

import { useState } from 'react'

export function RoleSwitcher() {
  const [role, setRole] = useState('user')
  
  return (
    <select value={role} onChange={(e) => setRole(e.target.value)}>
      <option value="guest">Guest</option>
      <option value="user">User</option>
      <option value="department_head">Department Head</option>
      <option value="finance_manager">Finance Manager</option>
      <option value="admin">Admin</option>
    </select>
  )
}
```

## Performance Considerations

- ✅ **Minimal re-renders**: Context uses `useMemo` for optimization
- ✅ **LocalStorage**: State persisted efficiently
- ✅ **Lazy registration**: Components register only when mounted
- ✅ **No global re-renders**: Only affected components update

## Next Steps

1. Complete migration of all sensitive components
2. Add privacy analytics tracking
3. Implement audit logging for compliance
4. Add keyboard shortcuts (Ctrl+H to toggle)
5. Create admin privacy dashboard
6. Add privacy export/import functionality

---

**Migration Priority:**
1. 🔴 High: Financial charts and KPIs
2. 🟡 Medium: Budget tables and details
3. 🟢 Low: Public-facing components

**Estimated Time**: 2-4 hours for complete migration
