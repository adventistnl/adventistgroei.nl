# Guia de Componentes Reutilizáveis - Dashboard

Este documento descreve os componentes reutilizáveis criados para o dashboard que podem ser utilizados em qualquer parte do sistema.

## 📊 Componentes de Gráficos Genéricos

### StructureBarChart

Gráfico de barras genérico para visualizar dados de estrutura organizacional.

**Localização:** `components/charts/generic/structure-bar-chart.tsx`

**Características:**
- Suporta orientação horizontal e vertical
- Cores customizáveis por item
- Loading state integrado
- Footer customizável
- TypeScript completo

**Exemplo de uso:**

```tsx
import { StructureBarChart } from "@/components/charts/generic"

<StructureBarChart
  title="Structure Overview"
  description="Quantitative breakdown"
  icon={Building2}
  data={[
    { name: 'Institutions', count: 5, fill: '#3b82f6' },
    { name: 'Regions', count: 12, fill: '#10b981' },
    { name: 'Churches', count: 45, fill: '#f59e0b' }
  ]}
  layout="vertical"
  footer="Total entities: 62"
/>
```

**Props principais:**
- `title` (string) - Título do gráfico
- `description` (string, optional) - Descrição
- `icon` (LucideIcon, optional) - Ícone do título
- `data` (StructureBarChartData[]) - Array de dados
- `layout` ('horizontal' | 'vertical') - Orientação
- `loading` (boolean) - Estado de loading
- `footer` (ReactNode) - Conteúdo do footer

---

### GrowthLineChart

Gráfico de linha genérico para visualizar crescimento e tendências ao longo do tempo.

**Localização:** `components/charts/generic/growth-line-chart.tsx`

**Características:**
- Múltiplas linhas com cores customizáveis
- Legenda automática
- Tipos de linha configuráveis (monotone, linear, step, etc.)
- Pontos (dots) opcionais
- Loading state integrado

**Exemplo de uso:**

```tsx
import { GrowthLineChart } from "@/components/charts/generic"

<GrowthLineChart
  title="User Growth Over Time"
  description="Monthly user registration trends"
  icon={TrendingUp}
  data={[
    { month: 'Jan', users: 100, newUsers: 20 },
    { month: 'Feb', users: 120, newUsers: 25 },
    { month: 'Mar', users: 145, newUsers: 30 }
  ]}
  lines={[
    { dataKey: 'users', label: 'Total Users', color: '#3b82f6' },
    { dataKey: 'newUsers', label: 'New Users', color: '#10b981' }
  ]}
  xAxisKey="month"
  footer={<div>Growth rate: 25%</div>}
/>
```

**Props principais:**
- `title` (string) - Título do gráfico
- `data` (GrowthLineChartData[]) - Array de dados
- `lines` (GrowthLineChartLine[]) - Configuração das linhas
- `xAxisKey` (string) - Chave para eixo X
- `lineType` (string) - Tipo de linha
- `showDots` (boolean) - Mostrar pontos
- `showLegend` (boolean) - Mostrar legenda

---

## 🎴 Componentes de Cards Especializados

### HierarchicalStructureCard

Card informativo para exibir estruturas hierárquicas organizacionais.

**Localização:** `components/charts/dashboard/hierarchical-structure-card.tsx`

**Características:**
- Níveis hierárquicos com indentação visual
- Bordas coloridas por nível
- Ícones customizáveis
- Footer para fluxo de hierarquia
- Loading state integrado

**Exemplo de uso:**

```tsx
import { HierarchicalStructureCard } from "@/components/charts/dashboard"

<HierarchicalStructureCard
  title="Hierarchical Structure"
  description="Organizational hierarchy overview"
  icon={Map}
  levels={[
    {
      title: 'Institution Level',
      icon: Building2,
      description: '5 institutions with 12 departments',
      details: 'Top-level organizational units',
      borderColor: 'border-primary/30',
      indent: 0
    },
    {
      title: 'Regions',
      icon: Map,
      description: '3 regions managing 45 churches',
      borderColor: 'border-blue-500/30',
      indent: 1
    }
  ]}
  footer={
    <div className="p-3 bg-muted/30 rounded-lg">
      <div className="text-xs font-medium">Hierarchy Flow:</div>
      <div className="text-xs text-muted-foreground font-mono">
        Institution → Regions → Churches
      </div>
    </div>
  }
/>
```

**Props principais:**
- `title` (string) - Título do card
- `levels` (HierarchyLevel[]) - Níveis da hierarquia
  - `title` (string) - Nome do nível
  - `icon` (LucideIcon) - Ícone
  - `description` (string) - Descrição com stats
  - `details` (string, optional) - Detalhes adicionais
  - `borderColor` (string) - Classe de cor da borda
  - `indent` (0 | 1 | 2 | 3) - Nível de indentação
- `footer` (ReactNode) - Conteúdo do footer

---

## 🧩 Componentes de UI Compartilhados

### YearFilter

Filtro de anos reutilizável com botões de seleção e opção de adicionar novos anos.

**Localização:** `components/shared/year-filter.tsx`

**Características:**
- Seleção visual de anos
- Botão para adicionar novos anos
- Validação de limite máximo
- Toast notifications integradas
- Scroll horizontal responsivo

**Exemplo de uso:**

```tsx
import { YearFilter } from "@/components/shared/year-filter"

const [years, setYears] = useState([2024, 2023, 2022])
const [selected, setSelected] = useState(2024)

<YearFilter
  availableYears={years}
  selectedYear={selected}
  onYearChange={setSelected}
  onAddYear={(newYear) => setYears([...years, newYear])}
  showAddButton={true}
  maxAllowedYear={2026}
/>
```

**Props principais:**
- `availableYears` (number[]) - Lista de anos disponíveis
- `selectedYear` (number) - Ano selecionado
- `onYearChange` (function) - Callback de seleção
- `onAddYear` (function, optional) - Callback para adicionar ano
- `showAddButton` (boolean) - Mostrar botão "Add Year"
- `maxAllowedYear` (number) - Ano máximo permitido

---

### SectionHeader

Cabeçalho de seção padronizado com ícone, título, descrição e ações.

**Localização:** `components/shared/section-header.tsx`

**Características:**
- 3 tamanhos: sm, default, lg
- Ícone opcional
- Descrição opcional
- Área de ações no lado direito
- Estilização consistente

**Exemplo de uso:**

```tsx
import { SectionHeader } from "@/components/shared/section-header"

<SectionHeader
  title="Institutional Structure"
  icon={Map}
  description="Organizational hierarchy and distribution"
  size="default"
  actions={
    <Button size="sm">
      <Plus className="w-4 h-4 mr-2" />
      Add New
    </Button>
  }
/>
```

**Props principais:**
- `title` (string) - Título da seção
- `icon` (LucideIcon, optional) - Ícone do título
- `description` (string, optional) - Descrição
- `size` ('sm' | 'default' | 'lg') - Tamanho
- `actions` (ReactNode, optional) - Botões/ações

---

## 📦 Importações

### Componentes Genéricos de Gráficos
```tsx
import { 
  StructureBarChart, 
  GrowthLineChart,
  StructureBarChartData,
  GrowthLineChartLine
} from "@/components/charts/generic"
```

### Componentes do Dashboard
```tsx
import { 
  HierarchicalStructureCard,
  HierarchyLevel 
} from "@/components/charts/dashboard"
```

### Componentes Compartilhados
```tsx
import { YearFilter } from "@/components/shared/year-filter"
import { SectionHeader } from "@/components/shared/section-header"
```

---

## 🎯 Benefícios

1. **Reutilização:** Todos os componentes podem ser usados em qualquer página
2. **Consistência:** UI/UX padronizada em todo o sistema
3. **TypeScript:** Tipagem completa para melhor DX
4. **Documentação:** Props bem documentadas com JSDoc
5. **Flexibilidade:** Altamente customizáveis via props
6. **Performance:** Loading states e otimizações integradas
7. **Manutenibilidade:** Código centralizado facilita updates

---

## 🚀 Onde Usar

### StructureBarChart
- Páginas de estatísticas
- Dashboards de departamentos
- Relatórios de distribuição
- Análises comparativas

### GrowthLineChart
- Páginas de analytics
- Relatórios de crescimento
- Tendências temporais
- KPIs ao longo do tempo

### HierarchicalStructureCard
- Páginas de estrutura organizacional
- Documentação de hierarquias
- Onboarding de usuários
- Páginas de ajuda

### YearFilter
- Dashboards com dados anuais
- Relatórios financeiros
- Páginas de analytics
- Histórico de projetos

### SectionHeader
- Qualquer página com múltiplas seções
- Organização de conteúdo
- Páginas de configuração
- Dashboards complexos

---

## 📝 Notas

- Todos os componentes seguem o padrão do sistema (shadcn/ui)
- Suportam temas dark/light automaticamente
- Responsivos por padrão
- Acessíveis (ARIA labels quando aplicável)
- Seguem as convenções de nomenclatura do projeto
