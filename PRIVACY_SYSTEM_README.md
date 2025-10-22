# Privacy System - Reusable Privacy Toggle Feature

## 📋 Overview

Sistema completo e reutilizável de privacidade com controle de acesso baseado em roles, permitindo ocultar/mostrar informações sensíveis em qualquer componente da aplicação.

## 🏗️ Arquitetura

```
contexts/
  └── privacy-context.tsx         # Context API + Hooks
components/
  └── shared/
      └── privacy-wrapper.tsx      # Componentes reutilizáveis
```

### Componentes Principais

1. **PrivacyContext** - Gerenciamento global de estado
2. **PrivacyProvider** - Provider para a aplicação
3. **usePrivacy** - Hook para acesso ao context
4. **useComponentPrivacy** - Hook para componentes específicos
5. **PrivacyWrapper** - HOC para envolver componentes
6. **InlinePrivacyToggle** - Botão inline para headers
7. **withPrivacy** - HOC factory

## 🎯 Funcionalidades

### ✨ Features Principais

- ✅ **Role-based Access Control** - Controle por níveis de permissão
- ✅ **Persistent State** - Salva estado no localStorage
- ✅ **Auto-hide Timer** - Oculta automaticamente após inatividade
- ✅ **Customizable Blur** - Intensidade configurável de blur
- ✅ **Global & Component-level Control** - Controle individual ou global
- ✅ **Custom Skeletons** - Placeholder customizável
- ✅ **Custom Messages** - Mensagens personalizadas
- ✅ **Custom Toggle Buttons** - Botões customizáveis
- ✅ **Event Callbacks** - onPrivacyChange callback
- ✅ **Flexible Positioning** - 4 posições do botão toggle

### 🔒 Privacy Levels

```typescript
type PrivacyLevel = 'public' | 'internal' | 'confidential' | 'restricted'
```

| Level | Description | Default Roles |
|-------|-------------|---------------|
| `public` | Informação pública | Todos |
| `internal` | Uso interno | user, department_head, finance_manager, admin |
| `confidential` | Confidencial | department_head, finance_manager, admin |
| `restricted` | Restrito | admin |

### 👥 Role Permissions

```typescript
PRIVACY_ROLE_PERMISSIONS = {
  admin: ['public', 'internal', 'confidential', 'restricted'],
  finance_manager: ['public', 'internal', 'confidential'],
  department_head: ['public', 'internal'],
  user: ['public'],
  guest: [],
}
```

## 🚀 Quick Start

### 1. Setup Provider

Envolva sua aplicação com o `PrivacyProvider`:

```typescript
// app/layout.tsx
import { PrivacyProvider } from '@/contexts/privacy-context'

export default function RootLayout({ children }) {
  // Get user role from auth context
  const userRole = useAuth().user?.role || 'user'

  return (
    <html>
      <body>
        <PrivacyProvider userRole={userRole}>
          {children}
        </PrivacyProvider>
      </body>
    </html>
  )
}
```

### 2. Use InlinePrivacyToggle (Simple)

Para adicionar apenas o botão toggle em um header:

```typescript
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'
import { useComponentPrivacy } from '@/contexts/privacy-context'

function MyChart() {
  const PRIVACY_CONFIG = {
    id: 'my-chart',
    level: 'confidential',
    allowedRoles: ['admin', 'finance_manager'],
  }

  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>My Chart</CardTitle>
          <InlinePrivacyToggle config={PRIVACY_CONFIG} />
        </div>
      </CardHeader>
      
      <CardContent>
        {isHidden ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ActualChart />
        )}
      </CardContent>
    </Card>
  )
}
```

### 3. Use PrivacyWrapper (Complete)

Para envolver todo o conteúdo com funcionalidade completa:

```typescript
import { PrivacyWrapper } from '@/components/shared/privacy-wrapper'

function MySensitiveComponent() {
  return (
    <PrivacyWrapper
      config={{
        id: 'budget-chart',
        level: 'confidential',
        allowedRoles: ['admin', 'finance_manager'],
        blurIntensity: 'high',
        persistent: true,
      }}
      showToggle={true}
      togglePosition="top-right"
    >
      <YourSensitiveContent />
    </PrivacyWrapper>
  )
}
```

### 4. Use withPrivacy HOC

Para envolver componentes existentes:

```typescript
import { withPrivacy } from '@/components/shared/privacy-wrapper'

const SensitiveBudgetChart = withPrivacy(
  BudgetChart,
  {
    id: 'budget-chart',
    level: 'confidential',
    allowedRoles: ['admin', 'finance_manager'],
  },
  {
    showToggle: true,
    togglePosition: 'top-right',
  }
)

// Usage
<SensitiveBudgetChart data={budgetData} />
```

## 📝 Configuration Options

### PrivacyConfig

```typescript
interface PrivacyConfig {
  /** Unique identifier (required) */
  id: string
  
  /** Privacy level (required) */
  level: 'public' | 'internal' | 'confidential' | 'restricted'
  
  /** Specific roles allowed to toggle (optional) */
  allowedRoles?: string[]
  
  /** Default state (optional, default: false) */
  defaultHidden?: boolean
  
  /** Persist in localStorage (optional, default: false) */
  persistent?: boolean
  
  /** Blur intensity (optional, default: 'medium') */
  blurIntensity?: 'low' | 'medium' | 'high'
  
  /** Auto-hide delay in ms (optional) */
  autoHideDelay?: number
}
```

### PrivacyWrapper Props

```typescript
interface PrivacyWrapperProps {
  /** Privacy configuration (required) */
  config: PrivacyConfig
  
  /** Content to protect (required) */
  children: React.ReactNode
  
  /** Custom skeleton (optional) */
  skeleton?: React.ReactNode
  
  /** Custom message (optional) */
  hiddenMessage?: string
  
  /** Additional className (optional) */
  className?: string
  
  /** Show toggle button (optional, default: true) */
  showToggle?: boolean
  
  /** Button position (optional, default: 'top-right') */
  togglePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  
  /** Custom toggle render (optional) */
  customToggle?: (props: {
    isHidden: boolean
    toggle: () => void
    canToggle: boolean
  }) => React.ReactNode
  
  /** Privacy change callback (optional) */
  onPrivacyChange?: (isHidden: boolean) => void
}
```

## 💡 Usage Examples

### Example 1: Simple Chart with Inline Toggle

```typescript
import { InlinePrivacyToggle, useComponentPrivacy } from '@/components/shared/privacy-wrapper'

export function DepartmentSpendingChart({ data }) {
  const PRIVACY_CONFIG = {
    id: 'department-spending',
    level: 'confidential',
    allowedRoles: ['admin', 'finance_manager', 'department_head'],
    persistent: true,
  }

  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Department Spending</CardTitle>
          <InlinePrivacyToggle config={PRIVACY_CONFIG} />
        </div>
      </CardHeader>
      
      <CardContent>
        {isHidden ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <BarChart data={data} />
        )}
      </CardContent>
    </Card>
  )
}
```

### Example 2: Full Wrapper with Custom Skeleton

```typescript
export function BudgetOverview({ budget }) {
  const customSkeleton = (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-40 w-full" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  )

  return (
    <PrivacyWrapper
      config={{
        id: 'budget-overview',
        level: 'restricted',
        blurIntensity: 'high',
      }}
      skeleton={customSkeleton}
      hiddenMessage="Restricted budget information"
    >
      <div>
        <h2>Total Budget: ${budget.total}</h2>
        <BudgetChart data={budget.details} />
      </div>
    </PrivacyWrapper>
  )
}
```

### Example 3: Auto-hide with Custom Message

```typescript
export function FinancialDashboard() {
  return (
    <PrivacyWrapper
      config={{
        id: 'financial-dashboard',
        level: 'confidential',
        autoHideDelay: 60000, // 1 minute
        persistent: true,
      }}
      hiddenMessage="Financial data auto-hidden for security"
      onPrivacyChange={(hidden) => {
        console.log('Privacy state changed:', hidden)
      }}
    >
      <FinancialContent />
    </PrivacyWrapper>
  )
}
```

### Example 4: Custom Toggle Button

```typescript
export function CustomToggleExample() {
  const customToggle = ({ isHidden, toggle, canToggle }) => {
    if (!canToggle) return null
    
    return (
      <button
        onClick={toggle}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isHidden ? '🔓 Show Data' : '🔒 Hide Data'}
      </button>
    )
  }

  return (
    <PrivacyWrapper
      config={{
        id: 'custom-toggle',
        level: 'internal',
      }}
      customToggle={customToggle}
      showToggle={false} // Disable default toggle
    >
      <SensitiveContent />
    </PrivacyWrapper>
  )
}
```

### Example 5: Global Privacy Control

```typescript
import { usePrivacy } from '@/contexts/privacy-context'

export function PrivacyControlPanel() {
  const { toggleGlobalPrivacy, getRegisteredComponents } = usePrivacy()
  
  return (
    <div>
      <button onClick={toggleGlobalPrivacy}>
        Toggle All Privacy
      </button>
      
      <div>
        <h3>Protected Components:</h3>
        <ul>
          {getRegisteredComponents().map(comp => (
            <li key={comp.id}>
              {comp.id} - Level: {comp.level}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

### Example 6: Multiple Components with Different Levels

```typescript
export function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Public - Everyone can see */}
      <PrivacyWrapper
        config={{
          id: 'public-stats',
          level: 'public',
        }}
      >
        <PublicStatsCard />
      </PrivacyWrapper>

      {/* Internal - Employees only */}
      <PrivacyWrapper
        config={{
          id: 'internal-metrics',
          level: 'internal',
        }}
      >
        <InternalMetricsCard />
      </PrivacyWrapper>

      {/* Confidential - Managers only */}
      <PrivacyWrapper
        config={{
          id: 'confidential-budget',
          level: 'confidential',
          blurIntensity: 'high',
        }}
      >
        <BudgetCard />
      </PrivacyWrapper>

      {/* Restricted - Admin only */}
      <PrivacyWrapper
        config={{
          id: 'restricted-salaries',
          level: 'restricted',
          blurIntensity: 'high',
        }}
      >
        <SalaryCard />
      </PrivacyWrapper>
    </div>
  )
}
```

## 🎨 Customization

### Custom Blur Intensity

```typescript
// Low blur
blurIntensity: 'low'    // blur-[2px]

// Medium blur (default)
blurIntensity: 'medium' // blur-sm

// High blur
blurIntensity: 'high'   // blur-md
```

### Custom Skeleton

```typescript
const myCustomSkeleton = (
  <div className="space-y-4">
    <Skeleton className="h-16 w-full" />
    <Skeleton className="h-32 w-full" />
    <Skeleton className="h-8 w-3/4" />
  </div>
)

<PrivacyWrapper
  config={config}
  skeleton={myCustomSkeleton}
>
  {content}
</PrivacyWrapper>
```

### Custom Toggle Position

```typescript
// Top right (default)
togglePosition="top-right"

// Top left
togglePosition="top-left"

// Bottom right
togglePosition="bottom-right"

// Bottom left
togglePosition="bottom-left"
```

## 🔧 Advanced Usage

### Conditional Privacy Based on Data

```typescript
export function DynamicPrivacyChart({ data }) {
  const privacyLevel = data.amount > 1000000 
    ? 'confidential' 
    : 'internal'

  return (
    <PrivacyWrapper
      config={{
        id: 'dynamic-chart',
        level: privacyLevel,
      }}
    >
      <Chart data={data} />
    </PrivacyWrapper>
  )
}
```

### Privacy with Analytics

```typescript
export function TrackedPrivacyComponent() {
  return (
    <PrivacyWrapper
      config={{
        id: 'analytics-chart',
        level: 'confidential',
      }}
      onPrivacyChange={(hidden) => {
        analytics.track('privacy_toggled', {
          component: 'analytics-chart',
          hidden,
          timestamp: new Date().toISOString(),
        })
      }}
    >
      <AnalyticsChart />
    </PrivacyWrapper>
  )
}
```

### Multiple Components with Shared State

```typescript
const SHARED_CONFIG = {
  id: 'financial-section',
  level: 'confidential',
  persistent: true,
}

export function FinancialSection() {
  const { isHidden } = useComponentPrivacy(SHARED_CONFIG)

  return (
    <div>
      <InlinePrivacyToggle config={SHARED_CONFIG} />
      
      {isHidden ? (
        <>
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </>
      ) : (
        <>
          <BudgetChart />
          <SpendingChart />
        </>
      )}
    </div>
  )
}
```

## 📊 Migration Guide

### Converting Existing Components

**Before:**
```typescript
const [isHidden, setIsHidden] = useState(false)

return (
  <div>
    <button onClick={() => setIsHidden(!isHidden)}>
      {isHidden ? 'Show' : 'Hide'}
    </button>
    {isHidden ? <Skeleton /> : <Content />}
  </div>
)
```

**After:**
```typescript
import { PrivacyWrapper } from '@/components/shared/privacy-wrapper'

return (
  <PrivacyWrapper
    config={{
      id: 'my-component',
      level: 'confidential',
    }}
  >
    <Content />
  </PrivacyWrapper>
)
```

## 🧪 Testing

### Test Privacy Toggle

```typescript
import { render, screen } from '@testing-library/react'
import { PrivacyProvider } from '@/contexts/privacy-context'

test('privacy toggle hides content', () => {
  render(
    <PrivacyProvider userRole="admin">
      <PrivacyWrapper
        config={{
          id: 'test-component',
          level: 'public',
        }}
      >
        <div>Sensitive Content</div>
      </PrivacyWrapper>
    </PrivacyProvider>
  )

  // Initially visible
  expect(screen.getByText('Sensitive Content')).toBeInTheDocument()

  // Click toggle
  const toggle = screen.getByRole('button')
  fireEvent.click(toggle)

  // Now hidden
  expect(screen.queryByText('Sensitive Content')).not.toBeInTheDocument()
})
```

## 🔐 Security Considerations

### What Privacy System DOES:
- ✅ Hides visual information from casual viewing
- ✅ Prevents accidental exposure during screen sharing
- ✅ Adds conscious layer of security awareness
- ✅ Controls based on user roles

### What Privacy System DOES NOT:
- ❌ Prevent determined users from accessing data
- ❌ Encrypt or secure data transmission
- ❌ Replace proper authentication/authorization
- ❌ Prevent browser DevTools inspection
- ❌ Protect against system screenshots

### Best Practices:
1. **Always implement server-side authorization**
2. **Use HTTPS for all data transmission**
3. **Implement proper session management**
4. **Log privacy toggle events for audit**
5. **Combine with other security measures**

## 📚 API Reference

### Hooks

#### usePrivacy()
```typescript
const {
  privacyState,           // Current state of all components
  togglePrivacy,          // Toggle specific component
  setPrivacy,            // Set privacy state
  isHidden,              // Check if hidden
  toggleGlobalPrivacy,   // Toggle all components
  userRole,              // Current user role
  canTogglePrivacy,      // Check if user can toggle
  registerComponent,     // Register new component
  unregisterComponent,   // Unregister component
  getRegisteredComponents, // Get all registered
} = usePrivacy()
```

#### useComponentPrivacy(config)
```typescript
const {
  isHidden,    // Is this component hidden
  togglePrivacy, // Toggle this component
  setPrivacy,   // Set privacy state
  canToggle,    // Can user toggle this
  config,       // Component config
} = useComponentPrivacy(config)
```

## 🐛 Troubleshooting

### Privacy toggle not showing
- Ensure user has proper role permissions
- Check `allowedRoles` configuration
- Verify `PrivacyProvider` is wrapping your app

### State not persisting
- Set `persistent: true` in config
- Check localStorage is available
- Verify browser settings allow localStorage

### Multiple components sharing state
- Each component needs unique `id`
- Use shared config object for intentional sharing

## 📖 Related Documentation

- [Privacy Context API](./contexts/privacy-context.tsx)
- [Privacy Wrapper Component](./components/shared/privacy-wrapper.tsx)
- [Department Spending Chart Example](./components/charts/annual-budget/department-spending-chart.tsx)

---

**Version**: 2.0.0  
**Last Updated**: 22 de outubro de 2025  
**Maintained by**: Frontend Team
