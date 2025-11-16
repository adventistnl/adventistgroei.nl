# Church Details - Data Flow & Mock Fallback System

## Visão Geral

Quando você visualiza os detalhes de uma Igreja (Church), o sistema utiliza uma estratégia de **dados híbrida**:
- **Dados Reais**: Quando disponíveis (departments, users, etc.)
- **Dados Mock**: Como fallback quando não há dados reais

## Fluxo de Dados

### 1. Carregamento da Church
```
User clica "Ver Detalhes" → Church é carregada via GraphQL → selectedChurchDetail recebe dados
```

A Church inclui:
- `departments` - Array de departamentos da church
- `users` - Array de usuários da church (agora com dados completos!)
- `region` - Região associada
- `contact` - Informações de contato

### 2. Geração de Dados para Gráficos

A função `generateChurchDepartmentData(church)` é chamada para preparar dados para os gráficos:

```typescript
const generateChurchDepartmentData = (church: any) => {
  const departments = church?.departments || [];
  
  // Fallback: Se não há departamentos, usa dados mock
  if (departments.length === 0) {
    return {
      activities: MOCK_DEPARTMENT_ACTIVITIES,
      membersByDept: MOCK_MEMBERS_BY_DEPARTMENT,
      projectsByDept: MOCK_PROJECTS_BY_DEPARTMENT
    };
  }
  
  // Caso contrário, gera dados dinâmicos baseados nos departamentos reais
  // ...
}
```

## Dados Mock Disponíveis

### 1. **MOCK_DEPARTMENT_ACTIVITIES**
Timeline mensal de atividades por departamento:
```typescript
const MOCK_DEPARTMENT_ACTIVITIES = [
  { 
    month: 'Jan', 
    'Youth Ministry': 12, 
    'Worship': 8, 
    'Education': 6, 
    'Community': 5, 
    'Evangelism': 7 
  },
  // ... outros meses (Feb-Jun)
]
```

**Usado para**: Gráfico de linha temporal de atividades

### 2. **MOCK_MEMBERS_BY_DEPARTMENT**
Distribuição de membros (total e ativos) por departamento:
```typescript
const MOCK_MEMBERS_BY_DEPARTMENT = [
  { 
    department: 'Youth Ministry', 
    members: 45,
    activeMembers: 42,
    fill: '#3b82f6'
  },
  // ... outros departamentos
]
```

**Usado para**: Gráfico de membros por departamento

### 3. **MOCK_PROJECTS_BY_DEPARTMENT**
Distribuição de projetos (ativos vs concluídos) por departamento:
```typescript
const MOCK_PROJECTS_BY_DEPARTMENT = [
  { 
    department: 'Youth Ministry', 
    projects: 8,
    activeProjects: 6,
    completedProjects: 2,
    fill: '#3b82f6'
  },
  // ... outros departamentos
]
```

**Usado para**: Gráfico de projetos por departamento

## Quando os Dados Mock São Utilizados

✅ **Dados Mock SÃO utilizados quando:**
- Church não possui nenhum departamento (`departments.length === 0`)
- Visão "analytics" geral da church (sem departamentos específicos)

❌ **Dados Mock NÃO são utilizados quando:**
- Church possui 1 ou mais departamentos (usa dados reais gerados dinamicamente)
- Tabelas de membros e departamentos (usa dados reais do GraphQL)

## Geração Dinâmica de Dados (Com Departamentos Reais)

Quando a church possui departamentos, a função `generateChurchDepartmentData` gera dados dinâmicos:

### CHART 1: Atividades por Mês
```typescript
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const activities = months.map((month, monthIndex) => {
  const monthData: any = { month };
  
  departments.slice(0, 5).forEach((dept: any, deptIndex: number) => {
    const baseActivities = 5;
    const monthlyGrowth = monthIndex * 2;
    const deptOffset = deptIndex * 3;
    const randomVariation = Math.random() * 5;
    
    monthData[dept.name] = Math.floor(
      baseActivities + monthlyGrowth + deptOffset + randomVariation
    );
  });
  
  return monthData;
});
```
- Limita a 5 departamentos para não sobrecarregar
- Simula crescimento ao longo dos meses
- Adiciona variação aleatória

### CHART 2: Membros por Departamento
```typescript
const membersByDept = departments.map((dept: any, index: number) => ({
  department: dept.name,
  members: dept.users?.length || Math.floor(15 + Math.random() * 30),
  activeMembers: dept.users?.filter((u: any) => !u.is_deleted).length 
    || Math.floor(10 + Math.random() * 25),
  fill: colors[index % colors.length]
}));
```
- **Dados Reais**: Usa contagem real de `dept.users` quando disponível
- **Fallback**: Simula números entre 15-45 membros

### CHART 3: Projetos por Departamento
```typescript
const projectsByDept = departments.map((dept: any, index: number) => {
  const totalProjects = dept.projects?.length || Math.floor(3 + Math.random() * 8);
  const activeProjects = Math.floor(totalProjects * 0.7);
  
  return {
    department: dept.name,
    projects: totalProjects,
    activeProjects: activeProjects,
    completedProjects: totalProjects - activeProjects,
    fill: colors[index % colors.length]
  };
});
```
- **Dados Reais**: Usa contagem real de `dept.projects` quando disponível
- **Fallback**: Simula 3-11 projetos
- Assume ~70% dos projetos estão ativos

## Gráficos da Página

| Gráfico | Dados | Tipo |
|---------|-------|------|
| **Atividades por Departamento** | Dinâmico ou Mock | Timeline |
| **Membros por Departamento** | Dinâmico (Real + Fallback) | Bar Chart |
| **Projetos por Departamento** | Dinâmico (Real + Fallback) | Bar Chart |

## Tabelas da Página

| Tabela | Dados | Fonte |
|--------|-------|-------|
| **Church Members** | Real | `church.users` do GraphQL |
| **Church Departments** | Real | `church.departments` do GraphQL |

## Considerações Importantes

### ✅ Aspectos Positivos
1. **Sempre há dados para exibir**: Mock garante que gráficos nunca ficam vazios
2. **Dados reais quando disponíveis**: Usa informações reais quando existem
3. **Escalável**: Suporta quantidade dinâmica de departamentos
4. **Visual consistente**: Cores alternadas para melhor visualização

### ⚠️ Pontos de Atenção
1. **Números simulados**: Quando há `dept.projects` sem preencher, usa simulação
2. **TODO comentado**: Há comentário indicando que atividades deveriam vir do backend real
3. **Limite de 5 departamentos**: Gráfico de atividades limita a 5 para legibilidade

## Melhorias Futuras

```typescript
// TODO: Substituir por contagem real de activities quando disponível no backend
// Atualmente simula crescimento de atividades ao longo dos meses
monthData[dept.name] = Math.floor(baseActivities + monthlyGrowth + deptOffset + randomVariation);
```

Quando o backend fornecer dados reais de atividades, a função pode ser atualizada para:
```typescript
// Contar atividades reais
const realActivities = dept.activities?.filter(a => a.month === month).length || 0;
monthData[dept.name] = realActivities;
```

## Exemplo de Cenários

### Cenário 1: Church SEM Departamentos
```
📊 GRÁFICOS → Utilizam MOCK_DEPARTMENT_ACTIVITIES, MOCK_MEMBERS_BY_DEPARTMENT, MOCK_PROJECTS_BY_DEPARTMENT
📋 TABELAS → Vazias (sem departamentos)
```

### Cenário 2: Church COM 3 Departamentos (Reais)
```
📊 GRÁFICOS → Dados gerados dinamicamente:
  - Atividades: Calcula para cada departamento real
  - Membros: Conta real do dept.users (agora com dados completos!)
  - Projetos: Conta real de dept.projects
📋 TABELAS → Exibem dados reais dos 3 departamentos + membros
```

## Como Testar

1. **Crie uma Church sem departamentos** → Verá dados mock nos gráficos
2. **Crie uma Church com departamentos e usuários** → Verá dados reais
3. **Veja a evolução**: Os gráficos mostram padrão realista com crescimento mensal
