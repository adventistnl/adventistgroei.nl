# Institution Info Card - Exemplos Visuais

## 🎨 Galeria de Variações

### 1. Variação Blue (Padrão)
```tsx
<InstitutionInfoCard
  name="Seventh-day Adventist Church"
  description="Regional administrative headquarters overseeing church operations"
  status="active"
  establishedYear={2025}
  language="EN"
  accentColor="blue"
/>
```
**Visual**: Card com bordas e ícone em azul, fundo azul claro

---

### 2. Variação Purple
```tsx
<InstitutionInfoCard
  name="Central Conference Office"
  description="Coordinating regional church activities and administrative support"
  status="active"
  establishedYear={2020}
  language="NL"
  accentColor="purple"
/>
```
**Visual**: Card com bordas e ícone em roxo, fundo roxo claro

---

### 3. Variação Green
```tsx
<InstitutionInfoCard
  name="Mission Support Center"
  description="Supporting missionary work and community outreach programs worldwide"
  status="active"
  establishedYear={2018}
  language="PT"
  accentColor="green"
/>
```
**Visual**: Card com bordas e ícone em verde, fundo verde claro

---

### 4. Status Inactive com Red
```tsx
<InstitutionInfoCard
  name="Legacy Regional Office"
  description="Former administrative center, now merged with main headquarters"
  status="inactive"
  establishedYear={2010}
  language="EN"
  accentColor="red"
/>
```
**Visual**: Card vermelho com badge "Inactive" em cinza

---

### 5. Com Ícone Customizado
```tsx
import { Church, Home } from "lucide-react"

<InstitutionInfoCard
  name="Church Network Hub"
  description="Centralized management for church network and community services"
  status="active"
  establishedYear={2022}
  language="EN"
  icon={Church} // Ícone customizado
  accentColor="orange"
/>
```
**Visual**: Card laranja com ícone de igreja ao invés de prédio

---

## 🎭 Comparação de Status

### Active (Verde)
```
┌─────────────────────────────────────┐
│ [🏢]                     [⋮ Menu]   │
│                                      │
│ Institution Name                     │
│ Description text here                │
│                                      │
│ [✓ Active] [Est. 2025]        [EN]  │
└─────────────────────────────────────┘
```
Badge: `bg-green-100 text-green-700`

### Inactive (Cinza)
```
┌─────────────────────────────────────┐
│ [🏢]                     [⋮ Menu]   │
│                                      │
│ Institution Name                     │
│ Description text here                │
│                                      │
│ [✗ Inactive] [Est. 2025]      [EN]  │
└─────────────────────────────────────┘
```
Badge: `bg-gray-100 text-gray-700`

---

## 🔄 No Carrossel (4 Cards)

```
Mobile (< 640px):
┌─────────────────┐
│ Institution Card│
└─────────────────┘
┌─────────────────┐
│ KPI Card 1      │
└─────────────────┘
┌─────────────────┐
│ KPI Card 2      │
└─────────────────┘
┌─────────────────┐
│ KPI Card 3      │
└─────────────────┘

Tablet (640px - 1024px):
┌─────────────────┬─────────────────┐
│ Institution Card│ KPI Card 1      │
└─────────────────┴─────────────────┘
┌─────────────────┬─────────────────┐
│ KPI Card 2      │ KPI Card 3      │
└─────────────────┴─────────────────┘

Desktop (1024px - 1280px):
┌─────────────┬─────────────┬─────────────┐
│ Institution │ KPI Card 1  │ KPI Card 2  │
│    Card     │             │             │
└─────────────┴─────────────┴─────────────┘
┌─────────────┐
│ KPI Card 3  │
└─────────────┘

Desktop XL (> 1280px):
┌─────────┬─────────┬─────────┬─────────┐
│Institut.│ KPI 1   │ KPI 2   │ KPI 3   │
│  Card   │         │         │         │
└─────────┴─────────┴─────────┴─────────┘
```

---

## 🎬 Menu de Ações - Estrutura

```tsx
const actions = [
  // Seção 1: Visualização
  {
    label: "View Contact Details",
    icon: Eye,
    onClick: handleViewContact,
    showSeparatorAfter: true // ← Adiciona linha separadora
  },
  
  // Seção 2: Gerenciamento
  {
    label: "Manage Churches",
    icon: Home,
    onClick: handleChurches
  },
  {
    label: "Manage Departments",
    icon: Layers,
    onClick: handleDepartments
  },
  {
    label: "Manage Annual Budgets",
    icon: DollarSign,
    onClick: handleBudgets,
    showSeparatorAfter: true // ← Adiciona linha separadora
  },
  
  // Seção 3: Edição
  {
    label: "Edit Institution",
    icon: Edit,
    onClick: handleEdit
  },
  
  // Seção 4: Exclusão (destrutiva)
  {
    label: "Delete Institution",
    icon: Trash2,
    onClick: handleDelete,
    variant: "destructive" // ← Texto vermelho
  }
]
```

**Resultado Visual:**
```
┌──────────────────────────────┐
│ 👁 View Contact Details      │
├──────────────────────────────┤ ← Separador
│ 🏠 Manage Churches           │
│ 📚 Manage Departments        │
│ 💰 Manage Annual Budgets     │
├──────────────────────────────┤ ← Separador
│ ✏️  Edit Institution         │
│ 🗑️  Delete Institution       │ ← Texto vermelho
└──────────────────────────────┘
```

---

## 🌓 Dark Mode vs Light Mode

### Light Mode
```
Background:     bg-blue-50
Border:         border-blue-200
Icon Color:     text-blue-600
Icon BG:        bg-blue-100
Text:           text-foreground (preto)
Muted:          text-muted-foreground (cinza)
```

### Dark Mode
```
Background:     dark:bg-blue-950/30
Border:         dark:border-blue-800
Icon Color:     dark:text-blue-400
Icon BG:        dark:bg-blue-900/50
Text:           dark:text-foreground (branco)
Muted:          dark:text-muted-foreground (cinza claro)
```

---

## 📱 Responsividade Detalhada

### Mobile First Approach

```tsx
// Sempre flex-col em mobile
<div className="flex flex-col sm:flex-row ...">

// Cards empilhados
<CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
```

### Breakpoints
- `< 640px` (mobile): 1 card por linha
- `640px - 1024px` (sm/md): 2 cards por linha
- `1024px - 1280px` (lg): 3 cards por linha
- `> 1280px` (xl): 4 cards por linha

---

## ✂️ Truncamento de Texto

### Nome (1 linha)
```tsx
className="line-clamp-1"
```
"Seventh-day Adventist Church Regional Office" → "Seventh-day Adventist Churc..."

### Descrição (2 linhas)
```tsx
className="line-clamp-2"
```
"Regional administrative headquarters overseeing church operations across the Netherlands and coordinating with international offices" → 
"Regional administrative headquarters overseeing church operations across the Netherlands and..."

---

## 🎯 Use Cases por Cor

### Blue (Padrão)
- Instituições gerais
- Escritórios administrativos
- Headquarters

### Purple
- Centros de educação
- Instituições de pesquisa
- Centros de treinamento

### Green
- Missões e projetos
- Centros de saúde
- Iniciativas comunitárias

### Orange
- Departamentos ativos
- Eventos e conferências
- Atividades em andamento

### Red
- Instituições inativas
- Alertas importantes
- Status crítico

---

## 🔧 Configuração Rápida

### Template Mínimo
```tsx
<InstitutionInfoCard
  name="Nome"
  description="Descrição"
  status="active"
  establishedYear={2025}
  language="EN"
/>
```

### Template Completo
```tsx
<InstitutionInfoCard
  name="Nome da Instituição"
  description="Descrição detalhada da instituição"
  status="active"
  establishedYear={2025}
  language="EN"
  icon={CustomIcon}
  actions={customActions}
  accentColor="blue"
  onClick={() => handleClick()}
  className="custom-class"
/>
```

---

## 📊 Integração com KPICards - Fluxo Completo

```tsx
// 1. Definir ações
const actions = useMemo(() => [...], [])

// 2. Criar custom card
const customCard = useMemo(() => (
  <InstitutionInfoCard {...props} />
), [deps])

// 3. Preparar KPI data
const kpiData = useMemo(() => [...], [])

// 4. Renderizar com custom card
<KPICards
  data={kpiData}
  customFirstCard={customCard}
  showCarousel={true}
/>
```

**Resultado**: Custom card aparece como primeiro item, seguido pelos KPI cards

---

## ⚡ Performance Tips

1. **Use useMemo** para ações e card
2. **Evite** criar ações inline no JSX
3. **Memoize** callbacks complexos
4. **Limite** número de ações (máx 8)
5. **Otimize** descrições longas antes de passar

---

**Documentação atualizada**: 24 de outubro de 2025
