# PageFilters Component

Componente reutilizável e dinâmico para filtros de página com shadcn/ui.

## Características

- ✅ **Versátil**: Suporta 7 tipos diferentes de filtros
- ✅ **Dinâmico**: Configuração via props, sem código hardcoded
- ✅ **Responsivo**: Layout adaptável com scroll quando necessário
- ✅ **Acessível**: Usa componentes shadcn/ui com acessibilidade
- ✅ **Contador**: Badge automático mostrando filtros ativos
- ✅ **Limpar**: Botão para resetar todos os filtros
- ✅ **Ícones**: Suporte para ícones personalizados por filtro

## Tipos de Filtros Suportados

| Tipo | Descrição | Uso |
|------|-----------|-----|
| `select` | Seleção única de lista | Anos, categorias, status |
| `multi-select` | Seleção múltipla com badges | Departamentos, tags |
| `checkbox-group` | Grupo de checkboxes | Permissões, recursos |
| `radio` | Seleção exclusiva | Tipos, modos |
| `checkbox` | Checkbox único | Ativo/Inativo, flags |
| `date` | Selecionador de data única | Data específica |
| `date-range` | Intervalo de datas | Períodos, ranges |

## Uso Básico

```tsx
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"
import { MapPin, Calendar } from "lucide-react"

const [filterValues, setFilterValues] = useState({
  region: "all",
  month: "all"
})

const filterConfigs: FilterConfig[] = [
  {
    id: "region",
    label: "Region",
    type: "select",
    icon: MapPin,
    placeholder: "Select region",
    defaultValue: "all",
    options: [
      { label: "All regions", value: "all" },
      { label: "North", value: "north" },
      { label: "South", value: "south" }
    ]
  },
  {
    id: "month",
    label: "Month",
    type: "select",
    icon: Calendar,
    options: [
      { label: "All months", value: "all" },
      { label: "January", value: "0" },
      { label: "February", value: "1" }
    ]
  }
]

<PageFilters
  filters={filterConfigs}
  values={filterValues}
  onChange={(id, value) => setFilterValues(prev => ({ ...prev, [id]: value }))}
  onClear={() => setFilterValues({ region: "all", month: "all" })}
/>
```

## Exemplo: Multi-Select

```tsx
const filterConfigs: FilterConfig[] = [
  {
    id: "departments",
    label: "Departments",
    type: "multi-select",
    icon: Building2,
    description: "Select multiple departments",
    options: [
      { label: "Finance", value: "finance", icon: DollarSign },
      { label: "HR", value: "hr", icon: Users },
      { label: "IT", value: "it", icon: Monitor }
    ]
  }
]

// State
const [filterValues, setFilterValues] = useState({
  departments: [] // Array para multi-select
})
```

## Exemplo: Date Range

```tsx
const filterConfigs: FilterConfig[] = [
  {
    id: "dateRange",
    label: "Date Range",
    type: "date-range",
    icon: CalendarIcon,
    placeholder: "Pick date range",
    description: "Filter by creation date"
  }
]

// State
const [filterValues, setFilterValues] = useState({
  dateRange: { from: undefined, to: undefined }
})
```

## Exemplo: Checkbox Group

```tsx
const filterConfigs: FilterConfig[] = [
  {
    id: "permissions",
    label: "Permissions",
    type: "checkbox-group",
    icon: Shield,
    options: [
      { label: "Read", value: "read" },
      { label: "Write", value: "write" },
      { label: "Delete", value: "delete" }
    ]
  }
]

// State
const [filterValues, setFilterValues] = useState({
  permissions: [] // Array de valores selecionados
})
```

## Props

### PageFiltersProps

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `filters` | `FilterConfig[]` | **obrigatório** | Array de configurações de filtro |
| `values` | `Record<string, any>` | **obrigatório** | Estado atual dos filtros |
| `onChange` | `(id: string, value: any) => void` | **obrigatório** | Callback quando filtro muda |
| `onClear` | `() => void` | auto | Callback para limpar filtros |
| `triggerLabel` | `string` | `"Filters"` | Texto do botão trigger |
| `triggerIcon` | `Component` | `Filter` | Ícone do botão trigger |
| `align` | `"start" \| "center" \| "end"` | `"end"` | Alinhamento do popover |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | Lado do popover |
| `width` | `number` | `320` | Largura do popover em pixels |
| `showClearButton` | `boolean` | `true` | Mostrar botão limpar |
| `disabled` | `boolean` | `false` | Desabilitar o componente |

### FilterConfig

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `id` | `string` | ✅ | Identificador único do filtro |
| `label` | `string` | ✅ | Label exibido |
| `type` | `FilterType` | ✅ | Tipo do filtro |
| `options` | `FilterOption[]` | ⚠️ | Opções (necessário para select, multi-select, etc.) |
| `placeholder` | `string` | ❌ | Placeholder do input |
| `defaultValue` | `any` | ❌ | Valor padrão |
| `icon` | `Component` | ❌ | Ícone ao lado do label |
| `description` | `string` | ❌ | Texto de ajuda abaixo do label |

## Exemplo Completo: Projects Page

```tsx
"use client"

import { useState, useMemo } from "react"
import { PageFilters, FilterConfig } from "@/components/shared/page-filters"
import { 
  Building2, 
  Calendar, 
  CheckCircle2,
  Filter as FilterIcon
} from "lucide-react"

export default function ProjectsPage() {
  const [filterValues, setFilterValues] = useState({
    department: "all",
    status: [],
    dateRange: { from: undefined, to: undefined },
    showCompleted: false
  })

  const filterConfigs: FilterConfig[] = useMemo(() => [
    {
      id: "department",
      label: "Department",
      type: "select",
      icon: Building2,
      defaultValue: "all",
      options: [
        { label: "All departments", value: "all" },
        { label: "Finance", value: "finance" },
        { label: "HR", value: "hr" }
      ]
    },
    {
      id: "status",
      label: "Status",
      type: "checkbox-group",
      icon: CheckCircle2,
      description: "Filter by project status",
      options: [
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
        { label: "Completed", value: "completed" }
      ]
    },
    {
      id: "dateRange",
      label: "Created Date",
      type: "date-range",
      icon: Calendar,
      placeholder: "Select date range"
    },
    {
      id: "showCompleted",
      label: "Show Completed",
      type: "checkbox",
      description: "Include completed projects"
    }
  ], [])

  // Aplicar filtros aos dados
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Department filter
      if (filterValues.department !== "all" && 
          project.department_id !== filterValues.department) {
        return false
      }

      // Status filter
      if (filterValues.status.length > 0 && 
          !filterValues.status.includes(project.status)) {
        return false
      }

      // Date range filter
      if (filterValues.dateRange?.from) {
        const projectDate = new Date(project.created_at)
        if (projectDate < filterValues.dateRange.from) return false
        if (filterValues.dateRange.to && projectDate > filterValues.dateRange.to) {
          return false
        }
      }

      // Show completed filter
      if (!filterValues.showCompleted && project.status === "completed") {
        return false
      }

      return true
    })
  }, [projects, filterValues])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1>Projects</h1>
        
        <PageFilters
          filters={filterConfigs}
          values={filterValues}
          onChange={(id, value) => {
            setFilterValues(prev => ({ ...prev, [id]: value }))
          }}
          onClear={() => {
            setFilterValues({
              department: "all",
              status: [],
              dateRange: { from: undefined, to: undefined },
              showCompleted: false
            })
          }}
          triggerLabel="Filter Projects"
          triggerIcon={FilterIcon}
          width={360}
        />
      </div>

      {/* Tabela com filteredProjects */}
    </div>
  )
}
```

## Customização

### Ícones Personalizados

```tsx
import { Users, Star } from "lucide-react"

const options = [
  { 
    label: "Admin", 
    value: "admin",
    icon: Users 
  },
  { 
    label: "Premium", 
    value: "premium",
    icon: Star 
  }
]
```

### Largura Customizada

```tsx
<PageFilters
  width={400}  // Popover mais largo
  // ...
/>
```

### Alinhamento

```tsx
<PageFilters
  align="start"    // Alinhar à esquerda
  side="left"      // Abrir à esquerda
  // ...
/>
```

## Boas Práticas

1. **IDs únicos**: Use IDs descritivos e únicos
2. **Valores padrão**: Sempre defina `defaultValue` para evitar undefined
3. **useMemo**: Use `useMemo` para `filterConfigs` se dependem de dados assíncronos
4. **Estado centralizado**: Mantenha `filterValues` em um único objeto
5. **Filtragem eficiente**: Use `useMemo` para filtrar dados apenas quando necessário
6. **Descrições**: Adicione `description` para filtros complexos
7. **Ícones**: Use ícones para melhor UX visual

## TypeScript

O componente é totalmente tipado:

```typescript
import { PageFilters, FilterConfig, FilterOption, FilterType } from "@/components/shared/page-filters"

// Tipos disponíveis
type FilterType = 
  | "select" 
  | "multi-select" 
  | "date" 
  | "date-range" 
  | "checkbox" 
  | "radio"
  | "checkbox-group"
```
