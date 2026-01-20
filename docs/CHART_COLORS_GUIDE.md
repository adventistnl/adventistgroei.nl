# Sistema de Cores para Gráficos - Guia de Uso

## 📚 Visão Geral

Sistema centralizado de cores para todos os gráficos do projeto, **baseado nas cores padrão --chart-1 a --chart-5** do globals.css com suporte automático a **Light** e **Dark Mode**.

## 🎨 Cores Padrão do Sistema

O sistema usa 5 cores principais definidas em `globals.css` como `--chart-1` a `--chart-5`:

| Variável | Light Mode | Dark Mode | Uso Principal |
|----------|-----------|-----------|---------------|
| `--chart-1` | Blue (#3b5fc7) | Blue (#5b6fd8) | Instituições, Aprovado, Alocado |
| `--chart-2` | Teal (#46a89c) | Teal (#50c9b8) | Regiões, Ativo, Disponível |
| `--chart-3` | Dark Gray (#4a5568) | Orange (#e8a05d) | Depts Igreja (light), Inativo (dark) |
| `--chart-4` | Yellow (#f5d547) | Purple (#b675d9) | Depts Inst., Pendente, Médio |
| `--chart-5` | Orange (#e89a5d) | Red (#e87171) | Igrejas, Rejeitado, Gasto |

**Todas as outras categorias são mapeadas para essas 5 cores base.**

## 🗂️ Paletas Disponíveis

### 1. **Estrutura Organizacional** (`STRUCTURE_COLORS`)
Baseadas nas cores --chart-*:
- `institutions` → `--chart-1` (Blue)
- `regions` → `--chart-2` (Teal)
- `churches` → `--chart-5` (Orange/Red)
- `institutionalDepts` → `--chart-4` (Yellow/Purple)
- `churchDepts` → `--chart-3` (Gray/Orange)

### 2. **Status** (`STATUS_COLORS`)
- `active` → `--chart-2` (Teal)
- `pending` → `--chart-4` (Yellow/Purple)
- `inactive` → `--chart-3` (Gray/Orange)
- `rejected` → `--chart-5` (Orange/Red)
- `approved` → `--chart-1` (Blue)

### 3. **Budget/Finanças** (`BUDGET_COLORS`)
- `allocated` → `--chart-1` (Blue)
- `spent` → `--chart-5` (Orange/Red)
- `available` → `--chart-2` (Teal)
- `overbudget` → `--chart-4` (Yellow/Purple)

### 4. **Prioridades** (`PRIORITY_COLORS`)
- `high` → `--chart-5` (Orange/Red)
- `medium` → `--chart-4` (Yellow/Purple)
- `low` → `--chart-2` (Teal)

---

## 🚀 Como Usar

### **Opção 1: Via Variáveis CSS (Recomendado)**

As cores já estão definidas no `globals.css` como variáveis CSS que mudam automaticamente com o tema:

```tsx
const chartData = [
  {
    name: "Institutions",
    value: 10,
    fill: "hsl(var(--structure-institutions))", // ✅ Muda automaticamente
  },
  {
    name: "Regions",
    value: 25,
    fill: "hsl(var(--structure-regions))",
  },
]
```

**Variáveis CSS disponíveis:**
```css
/* Estrutura */
--structure-institutions
--structure-regions
--structure-churches
--structure-institutional-depts
--structure-church-depts

/* Status */
--status-active
--status-pending
--status-inactive
--status-rejected
--status-approved

/* Budget */
--budget-allocated
--budget-spent
--budget-available
--budget-overbudget

/* Prioridades */
--priority-high
--priority-medium
--priority-low
```

### **Opção 2: Via Import TypeScript**

```tsx
import { 
  STRUCTURE_COLORS, 
  STATUS_COLORS,
  getThemeColor,
  getChartColorArray 
} from '@/lib/chart-palette'

// Obter cor baseada no tema
const isDark = document.documentElement.classList.contains('dark')
const institutionColor = getThemeColor(STRUCTURE_COLORS.institutions, isDark)

// Obter array de cores
const colors = getChartColorArray(5, isDark)
```

---

## 📖 Exemplos Práticos

### **Exemplo 1: Usar Cores Padrão do Sistema (Recomendado)**

```tsx
import { BarChart, Bar } from "recharts"

// Usando as variáveis CSS --chart-1 a --chart-5
const data = [
  { name: "Institutions", value: 10, fill: "var(--chart-1)" },
  { name: "Regions", value: 25, fill: "var(--chart-2)" },
  { name: "Churches", value: 40, fill: "var(--chart-5)" },
]

<BarChart data={data}>
  <Bar dataKey="value" />
</BarChart>
```

### **Exemplo 2: Usar Cores Específicas de Categoria**

```tsx
// Para estrutura organizacional
const data = [
  { name: "Institutions", value: 10, fill: "hsl(var(--structure-institutions))" },
  { name: "Regions", value: 25, fill: "hsl(var(--structure-regions))" },
]

// Para status
const statusData = [
  { name: "Active", value: 50, fill: "hsl(var(--status-active))" },
  { name: "Pending", value: 30, fill: "hsl(var(--status-pending))" },
]
```

### **Exemplo 3: Import TypeScript**

```tsx
import { CSS_CHART_VARS, getChartColorArray } from '@/lib/chart-palette'

// Usar variáveis CSS diretamente
const color = CSS_CHART_VARS.chart1 // 'var(--chart-1)'

// Obter array de cores (retorna até 5 cores repetindo se necessário)
const colors = getChartColorArray(10, isDark)
```

---

## 🎨 Cores em Detalhes

### Cores Padrão (--chart-1 a --chart-5)

| Variável | Light Mode (OKLCH) | Dark Mode (OKLCH) | HSL Light | HSL Dark |
|----------|-------------------|-------------------|-----------|----------|
| `--chart-1` | oklch(0.646 0.222 41.116) | oklch(0.488 0.243 264.376) | 227 51% 51% | 233 61% 61% |
| `--chart-2` | oklch(0.6 0.118 184.704) | oklch(0.696 0.17 162.48) | 172 40% 47% | 170 55% 55% |
| `--chart-3` | oklch(0.398 0.07 227.392) | oklch(0.769 0.188 70.08) | 218 20% 35% | 28 75% 64% |
| `--chart-4` | oklch(0.828 0.189 84.429) | oklch(0.627 0.265 303.9) | 50 89% 62% | 283 56% 65% |
| `--chart-5` | oklch(0.769 0.188 70.08) | oklch(0.645 0.246 16.439) | 28 75% 64% | 0 74% 68% |

### Mapeamento de Categorias

**Estrutura Organizacional:**
- Institutions: chart-1 (Blue)
- Regions: chart-2 (Teal)
- Churches: chart-5 (Orange → Red)
- Institutional Depts: chart-4 (Yellow → Purple)
- Church Depts: chart-3 (Gray → Orange)

**Status:**
- Active: chart-2 (Teal)
- Pending: chart-4 (Yellow → Purple)
- Inactive: chart-3 (Gray → Orange)
- Rejected: chart-5 (Orange → Red)
- Approved: chart-1 (Blue)

**Budget:**
- Allocated: chart-1 (Blue)
- Spent: chart-5 (Orange → Red)
- Available: chart-2 (Teal)
- Overbudget: chart-4 (Yellow → Purple)

---

## ✅ Benefícios

1. **Consistência**: Todas as cores centralizadas em um único local
2. **Tema Automático**: Cores mudam automaticamente com dark/light mode
3. **Acessibilidade**: Cores escolhidas com contraste adequado
4. **Manutenção**: Fácil atualizar cores globalmente
5. **Type-Safe**: TypeScript fornece autocompletar e validação

---

## 📁 Arquivos Relacionados

- `/lib/chart-palette.ts` - Definições TypeScript
- `/app/globals.css` - Variáveis CSS
- `/components/charts/dashboard/users-by-structure-overview-chart.tsx` - Exemplo de uso

---

## 🔧 Customização

Para adicionar novas cores ao sistema:

1. Adicione no arquivo `/lib/chart-palette.ts`:
```tsx
export const MY_COLORS = {
  myColor: {
    light: '#123456',
    dark: '#abcdef',
    hsl: {
      light: '210 50% 30%',
      dark: '210 50% 70%',
    }
  },
}
```

2. Adicione no `/app/globals.css`:
```css
:root {
  --my-color: 210 50% 30%;
}

.dark {
  --my-color: 210 50% 70%;
}
```

3. Use no componente:
```tsx
fill="hsl(var(--my-color))"
```

---

**Criado para garantir padronização e qualidade visual em todos os gráficos do sistema!** 🚀
