# Churches by Region Chart - Interactive & Minimalist Enhancement

## 📊 Problema Identificado

O gráfico **ChurchesByRegionChart** não tinha funcionalidade de clique nos setores do pie chart e o footer estava ausente, dificultando a visualização rápida dos dados da região selecionada.

## 🎯 Referência: Budget Distribution Chart

Analisamos o **BudgetDistributionChart** (`/components/charts/annual-budget/budget-distribution-chart.tsx`) que implementa corretamente:

### 1. Interatividade com Clique

```tsx
<Pie
  data={pieChartData}
  dataKey="amount"
  nameKey="name"
  onClick={(data, index) => {
    // Allow clicking on pie sectors to select them
    if (data && data.name) {
      setActiveEntity(data.name)
    }
  }}
  activeIndex={activeIndex}
  activeShape={/* ... */}
>
```

**Características:**
- ✅ **onClick handler** - Permite clicar em qualquer setor
- ✅ **State update** - Atualiza o estado com a entidade clicada
- ✅ **Visual feedback** - Setor ativo expande (activeShape)

### 2. Footer Minimalista com Dados

```tsx
<CardFooter className="flex-col gap-2 text-xs pt-2">
  {/* Total Budget */}
  <div className="w-full flex items-center justify-between text-xs border-t border-gray-100 pt-3">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">Total Budget</span>
    </div>
    <span className="font-semibold text-gray-900">
      ${data.total.toLocaleString()}
    </span>
  </div>
  
  {/* Selected Entity */}
  <div className="w-full flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">Selected: {activeEntity}</span>
    </div>
    <span className="font-medium">
      ${pieChartData.find(e => e.name === activeEntity)?.amount.toLocaleString()} 
      <span className="text-muted-foreground ml-1">
        ({pieChartData.find(e => e.name === activeEntity)?.percentage}%)
      </span>
    </span>
  </div>
</CardFooter>
```

**Características:**
- ✅ **Minimalista** - Apenas dados essenciais
- ✅ **Hierarquia visual** - Total em destaque com border-top
- ✅ **Cor dinâmica** - Indicador de cor do setor selecionado
- ✅ **Percentagem** - Mostra proporção do total
- ✅ **Formatação** - Valores localizados e legíveis

## ✅ Implementação no ChurchesByRegionChart

### 1. Adicionado CardFooter Import

```diff
import {
  Card,
  CardContent,
  CardDescription,
+ CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
```

### 2. Adicionado onClick Handler no Pie

```tsx
<Pie
  data={chartData}
  dataKey="churches"
  nameKey="region"
  innerRadius={60}
  strokeWidth={5}
  activeIndex={activeIndex}
  onClick={(data) => {
    // Allow clicking on pie sectors to select them
    if (data && data.region) {
      setActiveRegion(data.region)
    }
  }}
  activeShape={/* ... */}
>
```

**Funcionalidade:**
- ✅ **Clique em qualquer setor** → Atualiza `activeRegion`
- ✅ **Sincroniza com Select** → Dropdown também atualiza
- ✅ **Visual feedback** → Setor expande (activeShape já existente)

### 3. Adicionado Footer Minimalista

```tsx
<CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
  {/* Total Churches */}
  <div className="w-full flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">Total Churches</span>
    </div>
    <span className="font-semibold text-gray-900">
      {totalChurches.toLocaleString()}
    </span>
  </div>
  
  {/* Selected Region */}
  <div className="w-full flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: chartData[activeIndex]?.fill }}
      ></div>
      <span className="text-muted-foreground">Selected: {chartData[activeIndex]?.name}</span>
    </div>
    <span className="font-medium">
      {chartData[activeIndex]?.churches.toLocaleString()} churches
      <span className="text-muted-foreground ml-1">
        ({Math.round((chartData[activeIndex]?.churches / totalChurches) * 100)}%)
      </span>
    </span>
  </div>
  
  {/* Provinces List */}
  <div className="w-full flex items-center justify-start text-xs">
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-muted-foreground">Provinces:</span>
      <span className="font-medium text-gray-700">
        {chartData[activeIndex]?.provinces.join(", ")}
      </span>
    </div>
  </div>
</CardFooter>
```

**Estrutura:**

#### Linha 1: Total Geral
```tsx
<div className="w-full flex items-center justify-between text-xs">
  <span className="text-muted-foreground">Total Churches</span>
  <span className="font-semibold text-gray-900">114</span>
</div>
```
- **Label:** "Total Churches" (muted)
- **Valor:** Soma de todas as regiões (bold, dark)
- **Layout:** Space-between (label esquerda, valor direita)

#### Linha 2: Região Selecionada
```tsx
<div className="w-full flex items-center justify-between text-xs">
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: fill }}></div>
    <span>Selected: North Region</span>
  </div>
  <span className="font-medium">
    24 churches <span className="text-muted-foreground">(21%)</span>
  </span>
</div>
```
- **Indicador de cor:** Círculo pequeno (2x2) com cor do setor
- **Label:** "Selected: [Nome da Região]"
- **Valor:** Número de igrejas + percentagem
- **Layout:** Space-between

#### Linha 3: Províncias
```tsx
<div className="w-full flex items-center justify-start text-xs">
  <span className="text-muted-foreground">Provinces:</span>
  <span className="font-medium text-gray-700">Friesland, Groningen, Drenthe</span>
</div>
```
- **Label:** "Provinces:"
- **Valor:** Lista de províncias separadas por vírgula
- **Layout:** Flex-start (permite wrap se necessário)

## 🎨 Visual Design

### Hierarquia Visual

```
┌─────────────────────────────────────────┐
│  Pie Chart                              │
│  [Interactive Visualization]            │
└─────────────────────────────────────────┘
├─────────────────────────────────────────┤ ← border-top separator
│  Total Churches              114        │ ← font-semibold (emphasis)
│  🔴 Selected: North Region   24 (21%)   │ ← color dot + percentage
│  Provinces: Friesland, ...              │ ← contextual info
└─────────────────────────────────────────┘
```

### Tipografia

- **Total geral**: `font-semibold text-gray-900` (mais destaque)
- **Labels**: `text-muted-foreground` (secundário)
- **Valores**: `font-medium` (médio destaque)
- **Percentagem**: `text-muted-foreground` (complementar)
- **Tamanho**: `text-xs` (consistente, compacto)

### Espaçamento

- **Footer padding-top**: `pt-4` (respiro do conteúdo)
- **Gap entre linhas**: `gap-2` (8px - compacto mas legível)
- **Border-top**: `border-t` (separação visual clara)

## 🔄 Fluxo de Interação

### 1. Inicialização
```
Estado Inicial:
- activeRegion = "north" (primeira região)
- activeIndex = 0
- Footer mostra dados da North Region
```

### 2. Clique no Setor
```
Usuário clica em "South Region":
1. onClick handler captura data.region
2. setActiveRegion("south")
3. activeIndex recalcula via useMemo
4. Pie re-renderiza com novo setor ativo
5. Footer atualiza automaticamente
```

### 3. Seleção via Dropdown
```
Usuário seleciona "West Region" no Select:
1. onValueChange dispara setActiveRegion("west")
2. activeIndex recalcula
3. Pie e Footer atualizam
```

### 4. Sincronização
```
Estado sempre sincronizado:
- Select value = activeRegion
- Pie activeIndex baseado em activeRegion
- Footer dados baseados em activeIndex
```

## 📊 Dados Calculados

### Total Churches
```tsx
const totalChurches = React.useMemo(
  () => chartData.reduce((sum, item) => sum + item.churches, 0),
  [chartData]
)
// Resultado: 114 (24 + 18 + 35 + 21 + 16)
```

### Percentagem da Região
```tsx
Math.round((chartData[activeIndex]?.churches / totalChurches) * 100)
// Exemplo North: Math.round((24 / 114) * 100) = 21%
```

### Indicador de Cor
```tsx
style={{ backgroundColor: chartData[activeIndex]?.fill }}
// Usa cores do CHART_PRESETS.regions (theme-aware)
```

## 🎯 Benefícios da Implementação

### 1. UX Melhorada
- ✅ **Interatividade intuitiva** - Clique direto nos setores
- ✅ **Feedback visual** - Setor expande ao clicar
- ✅ **Múltiplas formas de seleção** - Clique OU dropdown
- ✅ **Informação contextual** - Footer mostra detalhes

### 2. Consistência com Annual Budget
- ✅ **Mesmo padrão de interação** - onClick handler
- ✅ **Mesmo estilo de footer** - Minimalista, 3 linhas
- ✅ **Mesma hierarquia visual** - Total → Selecionado → Detalhe
- ✅ **Mesma tipografia** - text-xs, font-medium/semibold

### 3. Acessibilidade
- ✅ **Indicador de cor visível** - Círculo 2x2px
- ✅ **Labels descritivos** - "Selected:", "Provinces:"
- ✅ **Valores formatados** - Separadores de milhar
- ✅ **Percentagens claras** - Entre parênteses

### 4. Responsividade
- ✅ **Text-xs** - Compacto em mobile
- ✅ **Flex-wrap** - Províncias quebram linha se necessário
- ✅ **Space-between** - Aproveita espaço horizontal
- ✅ **Gap consistente** - 8px entre linhas

## 🔍 Comparação com Budget Distribution

| Feature | Budget Distribution | Churches by Region | Status |
|---------|--------------------|--------------------|--------|
| **Clique no Pie** | ✅ onClick handler | ✅ onClick handler | ✅ Implementado |
| **Footer Total** | ✅ Total Budget | ✅ Total Churches | ✅ Implementado |
| **Footer Selecionado** | ✅ Selected entity + % | ✅ Selected region + % | ✅ Implementado |
| **Indicador de Cor** | ❌ Não tem | ✅ Círculo colorido | ✅ Melhorado |
| **Info Contextual** | ❌ Não tem | ✅ Lista de províncias | ✅ Adicionado |
| **Border-top** | ✅ border-gray-100 | ✅ border-t | ✅ Implementado |
| **Tipografia** | ✅ text-xs | ✅ text-xs | ✅ Consistente |
| **Espaçamento** | ✅ gap-2 | ✅ gap-2 | ✅ Consistente |

## 💡 Diferenças e Melhorias

### Vantagens do ChurchesByRegionChart

1. **Indicador de Cor Visual**
   ```tsx
   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: fill }}></div>
   ```
   - Budget Distribution não tem
   - Melhora identificação rápida
   - Conecta visualmente com o pie

2. **Informação Contextual Adicional**
   ```tsx
   <span>Provinces: Friesland, Groningen, Drenthe</span>
   ```
   - Budget Distribution não mostra detalhes extras
   - Útil para entender composição da região
   - Mantém interface minimalista

3. **Cores Dinâmicas do Theme**
   ```tsx
   fill: regionColors.north // Baseado em CHART_PRESETS
   ```
   - Budget Distribution usa gradiente red estático
   - ChurchesByRegion adapta ao dark/light mode

## 📝 Código Completo do Footer

```tsx
<CardFooter className="flex-col gap-2 text-xs pt-4 border-t">
  {/* Total Churches */}
  <div className="w-full flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">Total Churches</span>
    </div>
    <span className="font-semibold text-gray-900">
      {totalChurches.toLocaleString()}
    </span>
  </div>
  
  {/* Selected Region */}
  <div className="w-full flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: chartData[activeIndex]?.fill }}
      ></div>
      <span className="text-muted-foreground">
        Selected: {chartData[activeIndex]?.name}
      </span>
    </div>
    <span className="font-medium">
      {chartData[activeIndex]?.churches.toLocaleString()} churches
      <span className="text-muted-foreground ml-1">
        ({Math.round((chartData[activeIndex]?.churches / totalChurches) * 100)}%)
      </span>
    </span>
  </div>
  
  {/* Provinces List */}
  <div className="w-full flex items-center justify-start text-xs">
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-muted-foreground">Provinces:</span>
      <span className="font-medium text-gray-700">
        {chartData[activeIndex]?.provinces.join(", ")}
      </span>
    </div>
  </div>
</CardFooter>
```

## 🚀 Uso no Código

### Exemplo de Interação

```tsx
// Estado inicial
activeRegion = "north"
activeIndex = 0

// Usuário clica no setor "West Region"
<Pie onClick={(data) => {
  if (data && data.region) {
    setActiveRegion("west") // ← Atualiza estado
  }
}} />

// Re-render automático
activeRegion = "west"
activeIndex = 2 // Recalculado via useMemo

// Footer atualiza automaticamente
chartData[activeIndex] = {
  region: "west",
  name: "West Region",
  churches: 35,
  provinces: ["Noord-Holland", "Zuid-Holland", "Utrecht"],
  fill: "hsl(173, 80%, 40%)"
}

// Renderiza:
// 🟢 Selected: West Region   35 churches (31%)
// Provinces: Noord-Holland, Zuid-Holland, Utrecht
```

## 📦 Arquivos Modificados

1. **components/institutions/charts/churches-by-region-chart.tsx**
   - ✅ Adicionado `CardFooter` import
   - ✅ Adicionado `onClick` handler no `<Pie>`
   - ✅ Criado footer minimalista com 3 linhas
   - ✅ Indicador de cor dinâmico
   - ✅ Cálculo de percentagem
   - ✅ Lista de províncias

## 🎓 Lições Aprendidas

1. **Reutilizar padrões existentes**
   - Budget Distribution já tinha solução comprovada
   - Adaptar ao contexto específico (regiões vs budget)
   - Manter consistência visual

2. **onClick é key para interatividade**
   - Recharts suporta onClick nativamente
   - Simples de implementar: `onClick={(data) => setState(data.key)}`
   - Sincroniza automaticamente com outros controles

3. **Footer minimalista é eficaz**
   - 3 linhas é suficiente (total, selecionado, detalhe)
   - text-xs mantém compacto
   - Border-top cria separação clara

4. **Indicadores visuais melhoram UX**
   - Círculo de cor conecta footer com pie
   - Percentagem dá contexto rápido
   - Info adicional (províncias) agrega valor

---

**Data de Implementação**: 22 de outubro de 2025  
**Versão**: 1.0  
**Status**: ✅ Concluído e Testado  
**Baseado em**: Budget Distribution Chart Pattern