# 🔴 Sistema de Tags para Dados Mockados

## Visão Geral

Este sistema de tags identifica componentes e seções de código que ainda utilizam **dados mockados/simulados** ao invés de dados reais do backend GraphQL.

## Tags Disponíveis

### 🔴 MOCK_DATA: {queryName} - {descrição}

- **Propósito**: Marca componentes que usam dados simulados
- **Formato**: `🔴 MOCK_DATA: {nome_da_query} - {breve_descrição_do_problema}`
- **Localização**: Comentário no topo do arquivo ou seção relevante

### 🎯 Indicador Visual na UI

- **Componente**: `MockDataIndicator` em `@/components/shared/mock-data-indicator.tsx`
- **Hook**: `useShowMockIndicators()` para controlar visibilidade
- **Comportamento**: Aparece apenas em desenvolvimento ou quando ativado via localStorage
- **Estilo**: Badge vermelho com ícone de alerta

## Como Controlar a Visibilidade

```javascript
// Ativar indicadores de mock data
localStorage.setItem('show-mock-indicators', 'true')

// Desativar indicadores de mock data
localStorage.setItem('show-mock-indicators', 'false')
```

Por padrão, os indicadores aparecem apenas em ambiente de desenvolvimento.

## Queries com Dados Mockados Identificadas

### 1. `departmentSpending(year: Int!)`
- **Descrição**: Departments fixos + cálculos simulados
- **Localização dos dados mockados**: `app/finance/annual-budget/page.tsx` - `institutionDepartments` useMemo
- **Arquivos afetados**:
  - `app/finance/annual-budget/page.tsx` (geração dos dados mockados)
  - `components/charts/annual-budget/department-spending-chart.tsx` (consumo dos dados)
- **Status**: ❌ Pendente implementação

### 2. `spendingOverTime(year: Int!)`
- **Descrição**: Valores fixos + variação aleatória
- **Localização dos dados mockados**: Dados vêm da GraphQL query `budgetKPIs` mas são mockados no backend
- **Arquivos afetados**:
  - `components/charts/annual-budget/spending-over-time-chart.tsx` (consumo dos dados)
- **Status**: ❌ Pendente implementação

## Queries com Dados Reais ✅

### `budgetKPIs` e `budgetDistribution`
- **Status**: ✅ Implementado - usam dados reais do banco
- **Fonte**: GraphQL API backend

## Como Identificar Dados Mockados

1. **Procure pela tag 🔴 MOCK_DATA** nos arquivos
2. **Verifique imports de dados mockados** (`@/data/mockData`, etc.)
3. **Procure por `useMemo` com arrays hardcoded**
4. **Verifique TODOs relacionados** a "replace with real GraphQL data"

## Próximos Passos

1. **Implementar GraphQL queries reais** para `departmentSpending` e `spendingOverTime`
2. **Atualizar tipos TypeScript** gerados pelo codegen
3. **Substituir dados mockados** por chamadas GraphQL
4. **Testar integração** com dados reais
5. **Remover tags 🔴 MOCK_DATA** após implementação

## Convenções

- Use sempre o emoji 🔴 para dados mockados
- Mantenha a tag no topo do arquivo afetado
- Descreva brevemente o problema dos dados mockados
- Referencie o nome da query GraphQL correspondente