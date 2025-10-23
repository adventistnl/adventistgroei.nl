# Chart Theming System

## 📊 Overview

Sistema centralizado de cores para gráficos com suporte a dark/light mode, baseado em HSL para fácil manutenção e geração automática de paletas.

## 🎨 Features

- ✅ **Centralized Color Management**: Single source of truth em `lib/chart-colors.ts`
- ✅ **Dark/Light Mode**: Variações automáticas para ambos os temas
- ✅ **HSL-Based**: Cores em formato HSL para manipulação matemática
- ✅ **No Static Colors**: Todas as cores são geradas dinamicamente
- ✅ **Gradient Generation**: Função para criar gradientes automaticamente
- ✅ **Automatic Palettes**: Geração de N cores para quantidades variáveis de categorias
- ✅ **Type-Safe**: TypeScript com tipos completos
- ✅ **React Hook**: `useChartColors()` para fácil integração

## 📁 Structure

```
lib/
  chart-colors.ts          # Sistema centralizado de cores

components/institutions/charts/
  department-activity-chart.tsx   # ✅ Usando CHART_PRESETS.departments
  users-by-role-chart.tsx        # ✅ Usando CHART_PRESETS.roles
  churches-by-region-chart.tsx   # ✅ Usando CHART_PRESETS.regions
```

## 🔧 Core Components

### 1. BASE_COLORS

8 cores base, cada uma com variações light/dark:

```typescript
export const BASE_COLORS = {
  blue: { light: 'hsl(221, 83%, 53%)', dark: 'hsl(221, 83%, 60%)' },
  green: { light: 'hsl(142, 76%, 36%)', dark: 'hsl(142, 76%, 45%)' },
  red: { light: 'hsl(0, 72%, 51%)', dark: 'hsl(0, 72%, 60%)' },
  yellow: { light: 'hsl(45, 93%, 47%)', dark: 'hsl(45, 93%, 55%)' },
  purple: { light: 'hsl(262, 83%, 58%)', dark: 'hsl(262, 83%, 65%)' },
  orange: { light: 'hsl(24, 95%, 53%)', dark: 'hsl(24, 95%, 60%)' },
  teal: { light: 'hsl(173, 80%, 40%)', dark: 'hsl(173, 80%, 50%)' },
  pink: { light: 'hsl(330, 81%, 60%)', dark: 'hsl(330, 81%, 70%)' },
}
```

### 2. Color Manipulation

```typescript
// Ajustar luminosidade e saturação de uma cor HSL
export function adjustHSL(
  hsl: string, 
  lightness: number, 
  saturation: number
): string

// Exemplo de uso:
const lighterBlue = adjustHSL('hsl(221, 83%, 53%)', 10, 0) // +10% lightness
const desaturated = adjustHSL('hsl(221, 83%, 53%)', 0, -20) // -20% saturation
```

### 3. Automatic Palette Generation

Gera N cores automaticamente para listas dinâmicas:

```typescript
export function generatePalette(
  count: number, 
  theme: 'light' | 'dark'
): string[]

// Exemplo: Gerar paleta para 10 departamentos
const colors = generatePalette(10, 'light')
// Returns: ['hsl(0, 70%, 50%)', 'hsl(36, 70%, 50%)', ...]
```

### 4. Gradient Creation

```typescript
export function createGradient(
  baseColor: string,
  stops: Array<[offset: number, opacity: number]>
)

// Exemplo:
const gradient = createGradient('hsl(221, 83%, 53%)', [
  [0, 0.8],    // 0% offset, 80% opacity
  [100, 0.1]   // 100% offset, 10% opacity
])
```

### 5. CHART_PRESETS

Presets pré-configurados para casos comuns:

```typescript
export const CHART_PRESETS = {
  // Departamentos (6 cores)
  departments: (theme: 'light' | 'dark') => ({
    finance: string,
    education: string,
    youth: string,
    missions: string,
    health: string,
    communications: string,
  }),

  // Status (4 cores)
  status: (theme: 'light' | 'dark') => ({
    approved: string,    // verde
    pending: string,     // amarelo
    rejected: string,    // vermelho
    under_review: string // azul
  }),

  // Roles (5 cores)
  roles: (theme: 'light' | 'dark') => ({
    admin: string,
    finance_manager: string,
    department_head: string,
    church_leader: string,
    volunteer: string,
  }),

  // Regions (5 cores)
  regions: (theme: 'light' | 'dark') => ({
    north: string,
    south: string,
    west: string,
    east: string,
    central: string,
  })
}
```

### 6. React Hook

```typescript
export function useChartColors(theme?: 'light' | 'dark'): {
  colors: ChartColors
  theme: string
}

// Uso no componente:
const { colors, theme } = useChartColors()
const departmentColors = CHART_PRESETS.departments(theme as 'light' | 'dark')
```

## 💻 Usage Examples

### Example 1: Area Chart com Gradientes

```typescript
import { useChartColors, CHART_PRESETS } from "@/lib/chart-colors"

export function DepartmentActivityChart() {
  const { theme } = useChartColors()
  const departmentColors = CHART_PRESETS.departments(theme as 'light' | 'dark')

  const chartConfig = {
    finance: { label: "Finance", color: departmentColors.finance },
    education: { label: "Education", color: departmentColors.education },
    // ...
  } satisfies ChartConfig

  return (
    <AreaChart data={data}>
      <defs>
        <linearGradient id="fillFinance" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={departmentColors.finance} stopOpacity={0.8} />
          <stop offset="95%" stopColor={departmentColors.finance} stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <Area
        dataKey="finance"
        fill="url(#fillFinance)"
        stroke={departmentColors.finance}
      />
    </AreaChart>
  )
}
```

### Example 2: Bar Chart

```typescript
import { useChartColors, CHART_PRESETS } from "@/lib/chart-colors"

export function UsersByRoleChart() {
  const { theme } = useChartColors()
  const roleColors = CHART_PRESETS.roles(theme as 'light' | 'dark')

  const mockData = [
    { role: "admin", users: 12, fill: roleColors.admin },
    { role: "finance_manager", users: 28, fill: roleColors.finance_manager },
    // ...
  ]

  const chartConfig = {
    admin: { label: "Administrator", color: roleColors.admin },
    finance_manager: { label: "Finance Manager", color: roleColors.finance_manager },
    // ...
  } satisfies ChartConfig

  return (
    <BarChart data={mockData}>
      <Bar dataKey="users" />
    </BarChart>
  )
}
```

### Example 3: Pie Chart

```typescript
import { useChartColors, CHART_PRESETS } from "@/lib/chart-colors"

export function ChurchesByRegionChart() {
  const { theme } = useChartColors()
  const regionColors = CHART_PRESETS.regions(theme as 'light' | 'dark')

  const mockData = [
    { region: "north", churches: 24, fill: regionColors.north },
    { region: "south", churches: 18, fill: regionColors.south },
    // ...
  ]

  const chartConfig = {
    north: { label: "North Region", color: regionColors.north },
    south: { label: "South Region", color: regionColors.south },
    // ...
  } satisfies ChartConfig

  return (
    <PieChart>
      <Pie data={mockData} dataKey="churches" />
    </PieChart>
  )
}
```

### Example 4: Dynamic Categories

Para casos onde o número de categorias é dinâmico:

```typescript
import { useChartColors, generatePalette } from "@/lib/chart-colors"

export function DynamicChart({ departments }: { departments: string[] }) {
  const { theme } = useChartColors()
  
  // Gerar cores automaticamente baseado na quantidade de departamentos
  const palette = generatePalette(departments.length, theme as 'light' | 'dark')
  
  const mockData = departments.map((dept, index) => ({
    name: dept,
    value: Math.random() * 100,
    fill: palette[index]
  }))

  return <BarChart data={mockData}>...</BarChart>
}
```

## 🎯 Benefits

### 1. Easy Maintenance

Todas as cores em um único arquivo. Mudar a cor de "finance" afeta todos os gráficos:

```typescript
// Em lib/chart-colors.ts
departments: (theme) => ({
  finance: theme === 'light' ? colors.blue.light : colors.blue.dark,
  // Mudar para green afeta TODOS os gráficos automaticamente
  finance: theme === 'light' ? colors.green.light : colors.green.dark,
})
```

### 2. Automatic Theme Support

Sem necessidade de duplicar código para dark/light:

```typescript
// Automaticamente usa a cor correta baseado no tema
const { theme } = useChartColors()
const departmentColors = CHART_PRESETS.departments(theme as 'light' | 'dark')
```

### 3. No Magic Strings

Antes:
```typescript
color: "var(--chart-1)"  // ❌ O que é chart-1?
```

Depois:
```typescript
color: departmentColors.finance  // ✅ Explícito e type-safe
```

### 4. Scalability

Adicionar novo preset é trivial:

```typescript
// Em lib/chart-colors.ts
export const CHART_PRESETS = {
  // ... existing presets
  
  // Novo preset para priority levels
  priority: (theme: 'light' | 'dark') => ({
    critical: theme === 'light' ? colors.red.light : colors.red.dark,
    high: theme === 'light' ? colors.orange.light : colors.orange.dark,
    medium: theme === 'light' ? colors.yellow.light : colors.yellow.dark,
    low: theme === 'light' ? colors.blue.light : colors.blue.dark,
  })
}
```

## 🔄 Theme Switching

O sistema detecta automaticamente o tema atual:

```typescript
const { theme } = useChartColors()
// theme = 'light' ou 'dark' baseado no sistema/preferência do usuário
```

Para forçar um tema específico:

```typescript
const { colors } = useChartColors('dark')  // Sempre usa dark mode
```

## 📊 Integration with ResponsiveGridCarousel

Os gráficos estão envolvidos no ResponsiveGridCarousel para responsividade:

```typescript
<ResponsiveGridCarousel
  gridCols={{ sm: 1, md: 1, lg: 2 }}
  gap="gap-6"
  breakpoint="lg"
>
  <div className="lg:col-span-2">
    <DepartmentActivityChart loading={isLoading} />
  </div>
  <UsersByRoleChart loading={isLoading} />
  <ChurchesByRegionChart loading={isLoading} />
</ResponsiveGridCarousel>
```

## 🎨 Color Reference

### Base Colors (Light Mode)

- **Blue**: `hsl(221, 83%, 53%)` - Primary, Finance
- **Green**: `hsl(142, 76%, 36%)` - Success, Education, Approved
- **Red**: `hsl(0, 72%, 51%)` - Error, Rejected
- **Yellow**: `hsl(45, 93%, 47%)` - Warning, Pending, Youth
- **Purple**: `hsl(262, 83%, 58%)` - Missions
- **Orange**: `hsl(24, 95%, 53%)` - Health, Under Review
- **Teal**: `hsl(173, 80%, 40%)` - Communications
- **Pink**: `hsl(330, 81%, 60%)` - Special, East Region

### Base Colors (Dark Mode)

Mesma matiz e saturação, com luminosidade aumentada (7-10%) para melhor contraste no fundo escuro.

## 🚀 Future Enhancements

Possíveis melhorias futuras:

1. **Color Blind Mode**: Paletas otimizadas para daltonismo
2. **Custom Themes**: Permitir usuário definir cores personalizadas
3. **Color Analyzer**: Ferramenta para verificar contraste WCAG
4. **Export/Import**: Salvar/carregar esquemas de cores
5. **Animation Support**: Transições suaves ao mudar tema

## 📝 Best Practices

### ✅ DO

```typescript
// Use presets quando disponível
const departmentColors = CHART_PRESETS.departments(theme)

// Use generatePalette para listas dinâmicas
const colors = generatePalette(items.length, theme)

// Use adjustHSL para variações
const lighterBlue = adjustHSL(colors.blue.light, 10, 0)
```

### ❌ DON'T

```typescript
// Não use cores hardcoded
color: "#3b82f6"  // ❌

// Não use CSS variables diretamente
color: "var(--chart-1)"  // ❌

// Não duplique definições de cores
const blue = 'hsl(221, 83%, 53%)'  // ❌ Use BASE_COLORS
```

## 🐛 Troubleshooting

### Issue: Colors not updating on theme change

**Solution**: Certifique-se de usar `useChartColors()` hook e recriar `chartConfig` dentro do componente:

```typescript
export function MyChart() {
  const { theme } = useChartColors()
  const colors = CHART_PRESETS.departments(theme as 'light' | 'dark')
  
  const chartConfig = {
    // Recriado a cada render quando theme muda
    finance: { label: "Finance", color: colors.finance }
  }
  
  return <Chart config={chartConfig} />
}
```

### Issue: TypeScript error with theme type

**Solution**: Cast theme para literal type:

```typescript
const colors = CHART_PRESETS.departments(theme as 'light' | 'dark')
```

### Issue: Chart não renderiza cores

**Solution**: Verifique se `fill` está definido no data:

```typescript
const mockData = [
  { region: "north", churches: 24, fill: regionColors.north }, // ✅
]
```

## 📚 Related Files

- `/lib/chart-colors.ts` - Sistema de cores
- `/components/institutions/charts/department-activity-chart.tsx` - Exemplo Area Chart
- `/components/institutions/charts/users-by-role-chart.tsx` - Exemplo Bar Chart
- `/components/institutions/charts/churches-by-region-chart.tsx` - Exemplo Pie Chart
- `/app/institutions/page.tsx` - Página usando os gráficos

---

**Created**: January 2025  
**Version**: 1.0  
**Status**: ✅ Production Ready
