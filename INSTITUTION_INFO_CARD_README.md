# Institution Info Card - Componente Customizável para KPI Carrossel

## 📋 Visão Geral

O `InstitutionInfoCard` é um componente altamente customizável projetado para exibir informações resumidas de uma instituição no formato de card. Ele foi especialmente desenvolvido para ser o primeiro card no carrossel de KPI Cards, oferecendo contexto institucional antes das métricas.

## ✨ Características

- **🎨 Totalmente Customizável**: 5 cores de destaque (blue, purple, green, orange, red)
- **📱 Responsivo**: Adapta-se perfeitamente a diferentes tamanhos de tela
- **🎯 Integração Fácil**: Funciona seamlessly com o KPICards carrossel
- **⚙️ Ações Dropdown**: Menu de ações configurável no canto superior direito
- **🌓 Dark Mode**: Suporte completo a temas claro/escuro
- **📏 Limitação de Texto**: Descrição limitada a 2 linhas com quebra automática

## 🔧 Propriedades

### InstitutionInfoCardProps

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `name` | `string` | ✅ | Nome da instituição |
| `description` | `string` | ✅ | Descrição (máx. 2 linhas) |
| `status` | `"active" \| "inactive"` | ✅ | Status da instituição |
| `establishedYear` | `number` | ✅ | Ano de estabelecimento (ex: 2025) |
| `language` | `string` | ✅ | Código da linguagem (ex: "EN") |
| `icon` | `LucideIcon` | ❌ | Ícone customizável (padrão: Building) |
| `actions` | `InstitutionInfoCardAction[]` | ❌ | Ações do dropdown |
| `accentColor` | `"blue" \| "purple" \| "green" \| "orange" \| "red"` | ❌ | Cor de destaque (padrão: blue) |
| `className` | `string` | ❌ | Classes CSS adicionais |
| `onClick` | `() => void` | ❌ | Callback ao clicar no card |

### InstitutionInfoCardAction

| Propriedade | Tipo | Obrigatório | Descrição |
|-------------|------|-------------|-----------|
| `label` | `string` | ✅ | Texto da ação |
| `icon` | `LucideIcon` | ✅ | Ícone da ação |
| `onClick` | `() => void` | ✅ | Callback da ação |
| `variant` | `"default" \| "destructive"` | ❌ | Estilo da ação |
| `showSeparatorAfter` | `boolean` | ❌ | Mostrar separador após ação |

## 📖 Exemplos de Uso

### 1. Uso Básico

```tsx
import { InstitutionInfoCard } from "@/components/shared/institution-info-card"
import { Building } from "lucide-react"

<InstitutionInfoCard
  name="Seventh-day Adventist Church"
  description="Regional administrative headquarters overseeing church operations across the Netherlands"
  status="active"
  establishedYear={2025}
  language="EN"
/>
```

### 2. Com Ações Customizadas

```tsx
import { InstitutionInfoCard } from "@/components/shared/institution-info-card"
import { Building, Eye, Edit, Trash2, Home } from "lucide-react"

const actions = [
  {
    label: "View Details",
    icon: Eye,
    onClick: () => console.log("View"),
    showSeparatorAfter: true
  },
  {
    label: "Manage Churches",
    icon: Home,
    onClick: () => console.log("Churches")
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

<InstitutionInfoCard
  name="Seventh-day Adventist Church"
  description="Regional administrative headquarters"
  status="active"
  establishedYear={2025}
  language="EN"
  actions={actions}
  accentColor="purple"
/>
```

### 3. Integração com KPI Cards Carrossel

```tsx
import { KPICards } from "@/components/shared/kpi-cards-carousel"
import { InstitutionInfoCard } from "@/components/shared/institution-info-card"

const customFirstCard = (
  <InstitutionInfoCard
    name={institution.name}
    description={institution.denomination}
    status={institution.is_deleted ? "inactive" : "active"}
    establishedYear={new Date(institution.created_at).getFullYear()}
    language={institution.language_preference}
    actions={institutionActions}
    accentColor="blue"
  />
)

<KPICards
  data={kpiCardsData}
  customFirstCard={customFirstCard}
  minCardsForCarousel={3}
  showCarousel={true}
/>
```

### 4. Com Dados Dinâmicos (useMemo)

```tsx
const institutionCardActions = useMemo(() => [
  {
    label: "View Contact",
    icon: Eye,
    onClick: handleViewContact,
    showSeparatorAfter: true
  },
  {
    label: "Edit",
    icon: Edit,
    onClick: handleEdit
  }
], [])

const customFirstCard = useMemo(() => {
  if (!currentInstitution) return null
  
  return (
    <InstitutionInfoCard
      name={currentInstitution.name}
      description={currentInstitution.denomination}
      status={currentInstitution.is_deleted ? "inactive" : "active"}
      establishedYear={new Date(currentInstitution.created_at).getFullYear()}
      language={currentInstitution.language_preference}
      actions={institutionCardActions}
      accentColor="blue"
    />
  )
}, [currentInstitution, institutionCardActions])
```

## 🎨 Cores Disponíveis

### Blue (Padrão)
```tsx
accentColor="blue" // Azul corporativo
```

### Purple
```tsx
accentColor="purple" // Roxo criativo
```

### Green
```tsx
accentColor="green" // Verde sucesso
```

### Orange
```tsx
accentColor="orange" // Laranja energia
```

### Red
```tsx
accentColor="red" // Vermelho atenção
```

## 📐 Layout do Card

```
┌─────────────────────────────────────┐
│ [Icon]              [Actions Menu]  │
│                                      │
│ Institution Name                     │
│ Description line 1                   │
│ Description line 2 (max)...          │
│                                      │
│ [Active]  [Est. 2025]          [EN]  │
└─────────────────────────────────────┘
```

## 🔄 Integração com KPICards

O componente foi projetado para se integrar perfeitamente com o sistema de carrossel de KPI Cards:

1. **Cálculo Automático de Layout**: O carrossel ajusta automaticamente o basis dos cards considerando o custom card
2. **Mesma Altura**: O custom card sempre mantém a mesma altura dos outros KPI cards
3. **Responsivo**: Funciona em todos os breakpoints (mobile, tablet, desktop)
4. **Controles de Navegação**: Aparecem automaticamente quando há mais de 2 cards

## ⚠️ Considerações

### Limitação de Texto
A descrição é automaticamente limitada a 2 linhas com `line-clamp-2`. Textos longos receberão "..." no final.

**Bom:**
```tsx
description="Regional administrative headquarters"
```

**Evitar (será truncado):**
```tsx
description="This is a very long description that spans multiple lines and will be automatically truncated by the CSS line clamp utility after the second line which is the maximum allowed"
```

### Performance
Use `useMemo` para actions e o card completo quando usar com dados dinâmicos:

```tsx
const actions = useMemo(() => [...], [dependencies])
const customCard = useMemo(() => <InstitutionInfoCard .../>, [dependencies])
```

### Acessibilidade
- Todas as ações possuem labels descritivas
- Ícones são claramente identificados
- Status badges possuem contraste adequado
- Menu dropdown é navegável por teclado

## 🚀 Próximos Passos

1. **Adicionar tooltip** para descrições truncadas
2. **Suporte a imagem** customizada ao invés de ícone
3. **Animações** no hover/click
4. **Modo compacto** para cards menores
5. **Mais variantes** de status (pending, warning, etc)

## 📝 Exemplo Completo (app/institutions/page.tsx)

```tsx
import { InstitutionInfoCard, InstitutionInfoCardAction } from "@/components/shared/institution-info-card"
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"

export default function InstitutionsPage() {
  // ... outros hooks

  const institutionCardActions: InstitutionInfoCardAction[] = useMemo(() => [
    {
      label: "View Contact Details",
      icon: Eye,
      onClick: handleViewInstitutionContact,
      showSeparatorAfter: true
    },
    {
      label: "Manage Churches",
      icon: Home,
      onClick: () => {}
    },
    {
      label: "Edit Institution",
      icon: Edit,
      onClick: handleEditInstitution
    },
    {
      label: "Delete Institution",
      icon: Trash2,
      onClick: handleDeleteInstitution,
      variant: "destructive"
    }
  ], [])

  const customFirstCard = useMemo(() => {
    if (!currentInstitutionData) return null
    
    return (
      <InstitutionInfoCard
        name={currentInstitutionData.name}
        description={currentInstitutionData.denomination}
        status={currentInstitutionData.is_deleted ? "inactive" : "active"}
        establishedYear={new Date(currentInstitutionData.created_at).getFullYear()}
        language={currentInstitutionData.language_preference}
        icon={Building}
        actions={institutionCardActions}
        accentColor="blue"
      />
    )
  }, [currentInstitutionData, institutionCardActions])

  return (
    <AppLayout>
      {/* ... */}
      
      <KPICards 
        data={kpiCardsData}
        isLoading={isLoading}
        minCardsForCarousel={3}
        showCarousel={true}
        customFirstCard={customFirstCard}
      />
      
      {/* ... */}
    </AppLayout>
  )
}
```

## 🎯 Casos de Uso

1. **Dashboard Institucional**: Primeiro card mostrando contexto antes das métricas
2. **Páginas de Overview**: Resumo rápido da instituição com ações
3. **Comparações**: Múltiplos cards institucionais lado a lado
4. **Relatórios**: Cabeçalho de seção com informações institucionais

---

**Desenvolvido com**: React, TypeScript, Tailwind CSS, Radix UI, Lucide Icons
**Compatibilidade**: Next.js 14+, React 18+
**Theme Support**: Dark/Light modes
