# Componentes de Orçamento - Budget Components

## Visão Geral

Componentes React reutilizáveis para visualização e gestão de orçamentos institucionais, desenvolvidos com dados reais da API GraphQL.

## Componentes Disponíveis

### 1. BudgetOverviewCard
**Propósito**: Gráfico de pizza mostrando distribuição orçamentária por departamento
- ✅ **Dados da API**: useAnnualBudgetKPIs
- ✅ **Visualização**: Pie chart com departamentos + valor disponível
- ✅ **Cores**: Sistema de cores diferenciadas para cada departamento
- ✅ **Multilíngue**: pt/nl/en

### 2. BudgetMetricsCard  
**Propósito**: Métricas financeiras com barras de progresso
- ✅ **KPIs**: Utilização geral, % gasto, % reservado, % disponível
- ✅ **Dados da API**: useAnnualBudgetKPIs
- ✅ **Indicadores**: Barras de progresso coloridas por status
- ✅ **Multilíngue**: pt/nl/en

### 3. DepartmentAllocationList
**Propósito**: Lista detalhada de alocações por departamento
- ✅ **Dados da API**: useAnnualBudgetKPIs + departmentBudgetData
- ✅ **Detalhes**: Alocado, gasto, restante, % utilização
- ✅ **Status**: Visual indicators (verde/amarelo/vermelho) baseado em utilização
- ✅ **Ordenação**: Por maior alocação
- ✅ **Multilíngue**: pt/nl/en

### 4. BudgetSection (Container)
**Propósito**: Seção completa combinando todos os componentes
- ✅ **Layout**: Grid responsivo (1 col → 2 col → 3 col)
- ✅ **Dados**: Processa departmentBudgetData da instituição atual
- ✅ **Integração**: Usa useInstitution context

## Uso

```tsx
import { BudgetSection } from '@/components/budget'

// Dashboard ou página
<BudgetSection 
  selectedYear={2026} 
  currentLanguage="pt" 
/>
```

## Fontes de Dados

### API GraphQL
- `useAnnualBudgetKPIs`: KPIs institucionais (totalBudget, allocated, spent, etc.)
- `currentInstitutionData.departments`: Dados departamentais com annual_budgets

### Estrutura de Dados
```typescript
// Dados de entrada dos departamentos
interface DepartmentBudgetData {
  id: string
  departmentName: string
  annualBudget?: {
    allocated_amount: number
    planned_budget: number
    total_expenses: number
    balance: number
  }
  hasBudgetRecord: boolean
}
```

## Integração com Annual Budget Page

Os componentes utilizam exatamente os mesmos:
- ✅ GraphQL hooks (`useAnnualBudgetKPIs`)
- ✅ Estrutura de dados (`departmentBudgetData`)  
- ✅ Lógica de processamento
- ✅ Contextos (Currency, Institution)

## Estados e Loading

- ✅ **Loading**: Skeleton components durante fetch
- ✅ **Empty States**: Mensagens quando não há dados
- ✅ **Error Handling**: Fallbacks para dados indisponíveis
- ✅ **Responsive**: Design adaptativo mobile-first

## Características Técnicas

- **TypeScript**: Fully typed com interfaces completas
- **Responsive**: Grid system com breakpoints
- **Multilíngue**: Suporte nativo pt/nl/en
- **Performance**: useMemo para cálculos pesados  
- **Cores**: Sistema consistente usando CSS variables
- **Accessibility**: Semantic HTML + proper ARIA labels