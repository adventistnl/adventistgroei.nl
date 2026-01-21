# FilterTags Component

Componente reutilizável de filtros por tags com design monocromático, minimalista e suporte completo a i18n e light/dark mode.

## ✨ Características

- ✅ **Design Monocromático**: Usa apenas `foreground`, `background` e `muted` do tema
- ✅ **Light/Dark Mode**: Suporte automático via sistema de temas do shadcn/ui
- ✅ **i18n Ready**: Recebe labels traduzidos via props
- ✅ **Scroll Horizontal**: Suave com scrollbar minimalista
- ✅ **Título Opcional**: Controle via props `title` e `showTitle`
- ✅ **Contador Opcional**: Mostra quantidade com `showCount` e `count` nos tags
- ✅ **3 Tamanhos**: `sm`, `md` (padrão), `lg`
- ✅ **3 Variantes**: `default`, `pills`, `underline`
- ✅ **Totalmente Acessível**: ARIA labels e estados corretos
- ✅ **Responsivo**: Adapta automaticamente ao container

## 📦 Interface

```typescript
interface FilterTag {
  key: string
  label: string
  count?: number // Opcional: mostrar quantidade de itens
}

interface FilterTagsProps {
  tags: FilterTag[]
  selectedTag: string
  onTagSelect: (tag: string) => void
  title?: string
  showTitle?: boolean
  className?: string
  tagClassName?: string
  showCount?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "pills" | "underline"
}
```

## 🎨 Variantes

### Default (Padrão)
Cards retangulares com cantos arredondados. Tag selecionado tem fundo escuro.

```tsx
<FilterTags
  tags={tags}
  selectedTag={selected}
  onTagSelect={setSelected}
  variant="default" // Padrão
/>
```

### Pills
Tags totalmente arredondados, estilo pill/badge.

```tsx
<FilterTags
  tags={tags}
  selectedTag={selected}
  onTagSelect={setSelected}
  variant="pills"
/>
```

### Underline
Estilo minimalista com underline no tag selecionado.

```tsx
<FilterTags
  tags={tags}
  selectedTag={selected}
  onTagSelect={setSelected}
  variant="underline"
/>
```

## 📏 Tamanhos

```tsx
// Pequeno (text-xs, px-2.5, py-1)
<FilterTags size="sm" ... />

// Médio - Padrão (text-sm, px-3, py-1.5)
<FilterTags size="md" ... />

// Grande (text-base, px-4, py-2)
<FilterTags size="lg" ... />
```

## 🌍 Uso com i18n

```tsx
import { useTranslation } from "react-i18next"
import { FilterTags } from "@/components/shared/filter-tags"

function MyComponent() {
  const { i18n } = useTranslation()
  const t = translations[i18n.language] || translations.en
  
  const filters = [
    { key: "all", label: t.filterAll },
    { key: "active", label: t.filterActive, count: 5 },
    { key: "completed", label: t.filterCompleted, count: 12 }
  ]
  
  const [selected, setSelected] = useState("all")
  
  return (
    <FilterTags
      tags={filters}
      selectedTag={selected}
      onTagSelect={setSelected}
      title={t.filterTitle}
      showTitle={true}
      showCount={true}
    />
  )
}
```

## 📊 Com Contador

```tsx
const statusFilters = [
  { key: "all", label: "All", count: 25 },
  { key: "pending", label: "Pending", count: 8 },
  { key: "approved", label: "Approved", count: 15 },
  { key: "rejected", label: "Rejected", count: 2 }
]

<FilterTags
  tags={statusFilters}
  selectedTag={selectedStatus}
  onTagSelect={setSelectedStatus}
  showCount={true}
  variant="pills"
/>
```

## 🎯 Uso Básico (Sem Título)

```tsx
const [filter, setFilter] = useState("all")

<FilterTags
  tags={[
    { key: "all", label: "Todos" },
    { key: "active", label: "Ativos" },
    { key: "inactive", label: "Inativos" }
  ]}
  selectedTag={filter}
  onTagSelect={setFilter}
  showTitle={false} // Sem título
/>
```

## 🔧 Hook Helper

Use o hook `useFilterTags` para simplificar o gerenciamento de estado:

```tsx
import { useFilterTags } from "@/components/shared/filter-tags"

function MyList() {
  const data = [
    { id: 1, status: "active", name: "Item 1" },
    { id: 2, status: "inactive", name: "Item 2" },
    // ...
  ]
  
  const { selectedTag, setSelectedTag, filteredData } = useFilterTags(
    data,
    'all', // Filtro inicial
    (item, tag) => tag === 'all' || item.status === tag
  )
  
  return (
    <div>
      <FilterTags
        tags={[
          { key: "all", label: "All", count: data.length },
          { key: "active", label: "Active", count: data.filter(i => i.status === 'active').length },
          { key: "inactive", label: "Inactive", count: data.filter(i => i.status === 'inactive').length }
        ]}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        showCount={true}
      />
      
      {/* Renderizar dados filtrados */}
      {filteredData.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

## 🎨 Design System

### Cores (Light Mode)
- **Tag não selecionado**: `bg-muted/30 text-muted-foreground`
- **Tag selecionado**: `bg-foreground text-background`
- **Hover**: `bg-muted/50 text-foreground`

### Cores (Dark Mode)
- Sistema automático via tema do Tailwind
- Todas as cores se invertem corretamente
- Contraste mantido em ambos os modos

## ✅ Exemplo Completo (Modal de Convite)

```tsx
// lib/translations/invite.ts
export const inviteTranslations = {
  en: {
    filterByCategory: "Filter by Category",
    filterAll: "All Roles",
    filterAdministration: "Administration",
    // ...
  },
  pt: {
    filterByCategory: "Filtrar por Categoria",
    filterAll: "Todas as Funções",
    filterAdministration: "Administração",
    // ...
  }
}

// components/modals/invite-modal.tsx
import { FilterTags, FilterTag } from "@/components/shared/filter-tags"

const categoryFilters: FilterTag[] = [
  { key: "all", label: t.filterAll },
  { key: "administration", label: t.filterAdministration },
  { key: "church", label: t.filterChurch },
  // ...
]

<FilterTags
  tags={categoryFilters}
  selectedTag={selectedCategory}
  onTagSelect={(tag) => setSelectedCategory(tag)}
  title={t.filterByCategory}
  showTitle={true}
  size="sm"
  variant="default"
/>
```

## 🚀 Performance

- ✅ **Memoização automática**: React otimizado internamente
- ✅ **Scroll virtual**: Não há limite de tags
- ✅ **Sem re-renders**: Apenas o necessário

## ♿ Acessibilidade

- ✅ `aria-pressed` para estado de seleção
- ✅ `aria-label` descritivo
- ✅ Navegação por teclado (Tab)
- ✅ Estados de foco visíveis
- ✅ Contraste WCAG AAA

## 📱 Responsividade

O componente é totalmente responsivo:
- Scroll horizontal em telas pequenas
- Todos os tags sempre visíveis
- ScrollBar minimalista e suave
- Touch-friendly (mobile)

## 🎯 Casos de Uso

1. **Filtros de Status**: Pending, Active, Completed
2. **Categorias**: All, Church, Administration, Leadership
3. **Tipos**: Documents, Images, Videos
4. **Prioridades**: High, Medium, Low
5. **Datas**: Today, This Week, This Month
6. **Qualquer filtro rápido por tags!**
