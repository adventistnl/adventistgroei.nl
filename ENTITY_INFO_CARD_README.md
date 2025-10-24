# EntityInfoCard - Componente Genérico Reutilizável

## 🎯 Visão Geral

O `EntityInfoCard` é um componente **totalmente genérico e reutilizável** para exibir informações resumidas de qualquer entidade (instituições, igrejas, departamentos, usuários, etc). Foi projetado com foco em:

- ✨ **Reutilização total** - Props genéricas para qualquer tipo de entidade
- 🎨 **Customização completa** - Cores, ícones, badges e ações configuráveis
- 📏 **Altura otimizada** - Layout compacto e eficiente
- 🌓 **Theme-aware** - Gray como padrão com suporte a dark/light mode
- 🔧 **Layout otimizado** - Ícone e ações no extremo direito

## 🔧 Propriedades

### EntityInfoCardProps

| Propriedade | Tipo | Obrigatório | Padrão | Descrição |
|-------------|------|-------------|--------|-----------|
| `title` | `string` | ✅ | - | Título principal da entidade |
| `subtitle` | `string` | ✅ | - | Subtítulo/descrição (máx 2 linhas) |
| `icon` | `LucideIcon` | ❌ | `Building` | Ícone no canto superior direito |
| `actions` | `EntityInfoCardAction[]` | ❌ | `[]` | Menu de ações dropdown |
| `badges` | `Badge[]` | ❌ | `[]` | Badges customizáveis no footer |
| `accentColor` | `"gray" \| "blue" \| "purple" \| "green" \| "orange" \| "red"` | ❌ | `"gray"` | Cor de destaque do card |
| `className` | `string` | ❌ | - | Classes CSS adicionais |
| `onClick` | `() => void` | ❌ | - | Callback ao clicar no card |

### EntityInfoCardAction

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `label` | `string` | Texto da ação |
| `icon` | `LucideIcon` | Ícone da ação |
| `onClick` | `() => void` | Callback da ação |
| `variant` | `"default" \| "destructive"` | Estilo (destructive = vermelho) |
| `showSeparatorAfter` | `boolean` | Mostrar linha após a ação |

### Badge Object

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `label` | `string` | Texto do badge |
| `variant` | `"default" \| "secondary" \| "outline"` | Estilo do badge |
| `className` | `string` | Classes CSS customizadas |

## 📐 Layout Otimizado

```
┌─────────────────────────────────────────────────┐
│ Title                          [Icon] [Actions⋮]│
│ Subtitle line 1                                 │
│ Subtitle line 2 (max)...                        │
│                                                  │
│ [Badge 1] [Badge 2] [Badge 3]                   │
└─────────────────────────────────────────────────┘
```

**Características do Layout:**
- ✅ Altura reduzida (padding: 16px)
- ✅ Ícone no extremo direito
- ✅ Botão de ações ao lado do ícone
- ✅ Badges no footer em linha única
- ✅ Título e subtítulo à esquerda

## 🎨 Cores Disponíveis

### Gray (Padrão - Theme-Aware) ⭐
```tsx
accentColor="gray"
```
- **Light Mode**: `bg-muted/30`, `border-muted`
- **Dark Mode**: Adapta automaticamente ao tema
- **Uso**: Padrão para todos os cards genéricos

### Blue
```tsx
accentColor="blue"
```
Azul corporativo para instituições principais

### Purple
```tsx
accentColor="purple"
```
Roxo criativo para centros educacionais

### Green
```tsx
accentColor="green"
```
Verde sucesso para missões e projetos

### Orange
```tsx
accentColor="orange"
```
Laranja energia para eventos ativos

### Red
```tsx
accentColor="red"
```
Vermelho atenção para alertas

## 📖 Exemplos de Uso

### 1. Uso Básico (Mínimo)

```tsx
import { EntityInfoCard } from "@/components/shared/entity-info-card"

<EntityInfoCard
  title="Seventh-day Adventist Church"
  subtitle="Regional administrative headquarters"
/>
```

### 2. Com Badges Customizados

```tsx
<EntityInfoCard
  title="Central Conference"
  subtitle="Coordinating regional church activities"
  badges={[
    {
      label: "Active",
      variant: "default",
      className: "bg-green-100 text-green-700"
    },
    {
      label: "Est. 2020",
      variant: "outline"
    },
    {
      label: "NL",
      variant: "outline",
      className: "font-mono"
    }
  ]}
/>
```

### 3. Com Ícone e Ações

```tsx
import { Church, Eye, Edit, Trash2 } from "lucide-react"

const actions = [
  {
    label: "View Details",
    icon: Eye,
    onClick: () => console.log("View"),
    showSeparatorAfter: true
  },
  {
    label: "Edit",
    icon: Edit,
    onClick: () => console.log("Edit")
  },
  {
    label: "Delete",
    icon: Trash2,
    onClick: () => console.log("Delete"),
    variant: "destructive"
  }
]

<EntityInfoCard
  title="Grace Community Church"
  subtitle="Local congregation with 500+ members"
  icon={Church}
  actions={actions}
  accentColor="blue"
/>
```

### 4. Instituição (Exemplo Completo)

```tsx
import { Building } from "lucide-react"
import { cn } from "@/lib/utils"

const isActive = !institution.is_deleted

<EntityInfoCard
  title={institution.name}
  subtitle={institution.denomination}
  icon={Building}
  actions={institutionActions}
  accentColor="gray"
  badges={[
    {
      label: isActive ? "Active" : "Inactive",
      variant: isActive ? "default" : "secondary",
      className: cn(
        "text-xs",
        isActive 
          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" 
          : "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
      )
    },
    {
      label: `Est. ${new Date(institution.created_at).getFullYear()}`,
      variant: "outline",
      className: "text-xs font-normal"
    },
    {
      label: institution.language_preference.toUpperCase(),
      variant: "outline",
      className: "text-xs font-mono"
    }
  ]}
/>
```

### 5. Igreja

```tsx
import { Church } from "lucide-react"

<EntityInfoCard
  title="Maranatha Church"
  subtitle="Urban congregation focused on youth ministry"
  icon={Church}
  accentColor="green"
  badges={[
    { label: "Active", variant: "default" },
    { label: "250 Members", variant: "outline" },
    { label: "Urban", variant: "outline" }
  ]}
/>
```

### 6. Departamento

```tsx
import { Layers } from "lucide-react"

<EntityInfoCard
  title="Youth Ministry"
  subtitle="Engaging young people in faith and service"
  icon={Layers}
  accentColor="orange"
  badges={[
    { label: "Active", variant: "default" },
    { label: "15 Programs", variant: "outline" }
  ]}
/>
```

### 7. Usuário

```tsx
import { User } from "lucide-react"

<EntityInfoCard
  title="John Doe"
  subtitle="Senior Pastor & Regional Coordinator"
  icon={User}
  accentColor="purple"
  badges={[
    { label: "Pastor", variant: "default" },
    { label: "Admin", variant: "outline" }
  ]}
/>
```

## 🔄 Integração com KPI Carrossel

```tsx
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { EntityInfoCard } from "@/components/shared/entity-info-card"

const customFirstCard = useMemo(() => (
  <EntityInfoCard
    title="My Institution"
    subtitle="Description here"
    actions={myActions}
    badges={myBadges}
  />
), [myActions, myBadges])

<KPICards
  data={kpiCardsData}
  customFirstCard={customFirstCard}
  showCarousel={true}
/>
```

## 🔙 Backward Compatibility

O componente mantém compatibilidade com a API antiga via `InstitutionInfoCard`:

```tsx
// API antiga ainda funciona
<InstitutionInfoCard
  name="Institution Name"
  description="Description"
  status="active"
  establishedYear={2025}
  language="EN"
  actions={actions}
/>

// É automaticamente convertido para nova API
```

## 🎯 Use Cases por Tipo

### 1. Instituições (gray/blue)
```tsx
<EntityInfoCard
  title="Institution Name"
  subtitle="Denomination"
  icon={Building}
  accentColor="gray"
/>
```

### 2. Igrejas (green)
```tsx
<EntityInfoCard
  title="Church Name"
  subtitle="Location & Description"
  icon={Church}
  accentColor="green"
/>
```

### 3. Departamentos (orange)
```tsx
<EntityInfoCard
  title="Department Name"
  subtitle="Mission & Focus"
  icon={Layers}
  accentColor="orange"
/>
```

### 4. Usuários (purple)
```tsx
<EntityInfoCard
  title="User Name"
  subtitle="Role & Position"
  icon={User}
  accentColor="purple"
/>
```

## 🌓 Theme Colors (Gray Default)

### Light Mode
```
Background: bg-muted/30
Border: border-muted
Icon: text-muted-foreground
Icon BG: bg-muted/50
```

### Dark Mode
```
Adapta automaticamente via CSS variables
Mantém contraste adequado
```

## ⚡ Performance Tips

1. **Sempre use useMemo** para actions e badges:
```tsx
const actions = useMemo(() => [...], [deps])
const badges = useMemo(() => [...], [deps])
```

2. **Memoize o card completo**:
```tsx
const customCard = useMemo(() => <EntityInfoCard .../>, [deps])
```

3. **Evite criar objetos inline**:
```tsx
// ❌ Ruim
<EntityInfoCard badges={[{ label: "Active" }]} />

// ✅ Bom
const badges = useMemo(() => [{ label: "Active" }], [])
<EntityInfoCard badges={badges} />
```

## 📊 Comparação: Antes vs Depois

### Antes (InstitutionInfoCard)
```tsx
<InstitutionInfoCard
  name="Name"
  description="Description"
  status="active"
  establishedYear={2025}
  language="EN"
  icon={Building}
  actions={actions}
  accentColor="blue"
/>
```
- ❌ Props específicas para instituições
- ❌ Ícone e ações separados
- ❌ Altura maior
- ❌ Sem suporte a badges customizados

### Depois (EntityInfoCard)
```tsx
<EntityInfoCard
  title="Name"
  subtitle="Description"
  icon={Building}
  actions={actions}
  accentColor="gray"
  badges={[
    { label: "Active", variant: "default" },
    { label: "Est. 2025", variant: "outline" },
    { label: "EN", variant: "outline" }
  ]}
/>
```
- ✅ Props genéricas para qualquer entidade
- ✅ Ícone e ações juntos no canto direito
- ✅ Altura reduzida (padding menor)
- ✅ Badges totalmente customizáveis
- ✅ Gray como padrão theme-aware

## 🚀 Vantagens

1. **Genérico**: Funciona para qualquer tipo de entidade
2. **Compacto**: Altura reduzida e layout otimizado
3. **Theme-Aware**: Gray padrão adapta ao tema automaticamente
4. **Flexível**: Badges customizáveis ao invés de campos fixos
5. **Layout Otimizado**: Ícone e ações no canto direito
6. **Reutilizável**: Mesmo componente para instituições, igrejas, departamentos, etc
7. **Backward Compatible**: API antiga ainda funciona

---

**Desenvolvido**: 24 de outubro de 2025  
**Versão**: 2.0 (Generic & Optimized)  
**Compatibilidade**: React 18+, Next.js 14+  
**Theme Support**: Dark/Light via CSS variables
