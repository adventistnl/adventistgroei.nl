# QuickActions Component

Componente reutilizável para renderizar botões de ação rápida de forma responsiva.

## Importação

```tsx
import { QuickActions, QuickAction, QuickActionsCompact, QuickActionsGrid } from "@/components/shared/quick-actions"
```

## Uso Básico

```tsx
import { Plus, Building2, Church, Users } from "lucide-react"
import { toast } from "sonner"

const quickActions: QuickAction[] = [
  {
    id: "new-user",
    label: "New User",
    icon: Plus,
    onClick: () => toast.info("New User modal")
  },
  {
    id: "new-institution",
    label: "New Institution",
    icon: Building2,
    onClick: () => console.log("New Institution")
  }
]

// Uso padrão
<QuickActions 
  actions={quickActions}
  title="Quick Actions:"
  showTitle={true}
  size="sm"
/>
```

## Variantes

### 1. QuickActions (Padrão)
Componente padrão com título e orientação flexível.

```tsx
<QuickActions 
  actions={quickActions}
  title="Quick Actions:"
  showTitle={true}
  size="sm"
  orientation="horizontal" // ou "vertical"
/>
```

**Props:**
- `actions` (required): Array de objetos QuickAction
- `title`: Texto do título (default: "Quick Actions:")
- `showTitle`: Mostrar/ocultar título (default: true)
- `size`: Tamanho dos botões - "sm" | "default" | "lg" (default: "sm")
- `orientation`: Layout - "horizontal" | "vertical" (default: "horizontal")
- `className`: Classes CSS adicionais
- `maxColumns`: Número máximo de colunas (default: 4)

### 2. QuickActionsCompact
Versão compacta sem título, ideal para toolbars.

```tsx
<QuickActionsCompact 
  actions={quickActions}
  size="sm"
/>
```

**Props:**
- `actions` (required): Array de objetos QuickAction
- `size`: Tamanho dos botões (default: "sm")
- `className`: Classes CSS adicionais

### 3. QuickActionsGrid
Layout em grid responsivo.

```tsx
<QuickActionsGrid 
  actions={quickActions}
  title="Actions"
  showTitle={true}
  size="sm"
  columns={{
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  }}
/>
```

**Props:**
- `actions` (required): Array de objetos QuickAction
- `title`: Texto do título
- `showTitle`: Mostrar/ocultar título (default: true)
- `size`: Tamanho dos botões (default: "sm")
- `columns`: Configuração de colunas por breakpoint
- `className`: Classes CSS adicionais

## Interface QuickAction

```tsx
interface QuickAction {
  id: string                    // ID único da ação
  label: string                 // Texto do botão
  icon: LucideIcon             // Ícone do lucide-react
  onClick: () => void          // Função executada ao clicar
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  disabled?: boolean           // Desabilitar botão
  className?: string           // Classes CSS adicionais
}
```

## Exemplos de Uso

### Dashboard com Quick Actions

```tsx
const quickActions: QuickAction[] = [
  {
    id: "new-user",
    label: "New User",
    icon: UserPlus,
    onClick: () => setIsCreateUserOpen(true)
  },
  {
    id: "new-project",
    label: "New Project",
    icon: FolderPlus,
    onClick: () => router.push("/projects/new")
  },
  {
    id: "export",
    label: "Export Data",
    icon: Download,
    onClick: handleExport,
    variant: "secondary"
  }
]

<QuickActions 
  actions={quickActions}
  title="Quick Actions:"
  size="sm"
/>
```

### Toolbar Compacta

```tsx
const toolbarActions: QuickAction[] = [
  {
    id: "refresh",
    label: "Refresh",
    icon: RefreshCw,
    onClick: handleRefresh
  },
  {
    id: "filter",
    label: "Filter",
    icon: Filter,
    onClick: () => setShowFilters(true)
  }
]

<QuickActionsCompact actions={toolbarActions} />
```

### Menu Vertical na Sidebar

```tsx
const sidebarActions: QuickAction[] = [
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    onClick: () => router.push("/settings")
  },
  {
    id: "logout",
    label: "Logout",
    icon: LogOut,
    onClick: handleLogout,
    variant: "destructive"
  }
]

<QuickActions 
  actions={sidebarActions}
  orientation="vertical"
  showTitle={false}
/>
```

### Grid Responsivo de Ações

```tsx
const adminActions: QuickAction[] = [
  {
    id: "users",
    label: "Manage Users",
    icon: Users,
    onClick: () => router.push("/admin/users")
  },
  {
    id: "roles",
    label: "Manage Roles",
    icon: Shield,
    onClick: () => router.push("/admin/roles")
  },
  {
    id: "settings",
    label: "System Settings",
    icon: Settings,
    onClick: () => router.push("/admin/settings")
  },
  {
    id: "logs",
    label: "View Logs",
    icon: FileText,
    onClick: () => router.push("/admin/logs")
  }
]

<QuickActionsGrid 
  actions={adminActions}
  title="Admin Panel"
  columns={{
    sm: 1,   // 1 coluna em mobile
    md: 2,   // 2 colunas em tablet
    lg: 3,   // 3 colunas em desktop
    xl: 4    // 4 colunas em telas grandes
  }}
/>
```

## Recursos

✅ Totalmente responsivo
✅ Suporta diferentes variantes de botões
✅ Orientação horizontal e vertical
✅ Grid responsivo com breakpoints customizáveis
✅ TypeScript completo
✅ Ícones do lucide-react
✅ Suporta botões desabilitados
✅ Classes CSS customizáveis

## Acessibilidade

- Todos os botões são clicáveis e navegáveis por teclado
- Suporta estado `disabled`
- Ícones com labels descritivos

## Notas

- O componente usa a biblioteca `lucide-react` para ícones
- Estilos baseados no shadcn/ui
- Responsivo por padrão com flex-wrap e grid
- Pode ser usado em qualquer contexto: headers, sidebars, toolbars, cards, etc.
