# Componentes Compartilhados (Shared Components)

## 📊 KPICards

### 📋 Visão Geral

Componente reutilizável para exibir cards de KPI (Key Performance Indicators) com funcionalidade de carrossel responsivo. Segue o padrão do dashboard com estilo monocromático e duotone, incluindo skeleton de carregamento.

### 🎨 Características

- **Padrão Dashboard**: Segue o estilo padrão do sistema com cards monocromáticos
- **Totalmente Responsivo**: Mobile-first design com breakpoints otimizados
- **Carrossel Inteligente**: Ativa apenas quando necessário (mínimo de cards)
- **Skeleton Loading**: Estados de carregamento com skeleton animado
- **i18n Completo**: Suporte para EN/NL/PT com traduções automáticas
- **Estilo Duotone**: Ícones e cores monocromáticas com acentos sutis
- **Tendências Visuais**: Indicadores de crescimento com ícones TrendingUp/Down

### 📦 Interface

```typescript
interface KPICardData {
  id: string
  title: string
  value: string | number
  icon: LucideIcon
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
}

interface KPICardsProps {
  data: KPICardData[]
  className?: string
  minCardsForCarousel?: number
  showCarousel?: boolean
  isLoading?: boolean
  skeletonCount?: number
}
```

### 🚀 Como Usar

#### 1. Importar o Componente

```typescript
import { KPICards, KPICardData } from "@/components/shared/kpi-cards-carousel"
```

#### 2. Preparar os Dados

```typescript
const kpiCardsData: KPICardData[] = [
  {
    id: "total-items",
    title: "Total Items",
    value: 150,
    icon: MapPin,
    subtitle: "Active items"
  },
  {
    id: "budget",
    title: "Budget",
    value: "$2.5M",
    icon: DollarSign,
    subtitle: "Annual budget",
    trend: {
      value: 5.2,
      isPositive: true,
      label: "vs last month"
    }
  }
]
```

#### 3. Renderizar

```typescript
<KPICards 
  data={kpiCardsData}
  isLoading={false}
  minCardsForCarousel={4}
  showCarousel={true}
/>
```

### 🎯 Componentes Wrapper

Para facilitar o uso, existem componentes wrapper específicos:

#### RegionsKPICards
```typescript
<RegionsKPICards data={kpiCardsData} isLoading={false} />
```

#### ChurchesKPICards
```typescript
<ChurchesKPICards data={kpiCardsData} isLoading={false} />
```

#### DepartmentsKPICards
```typescript
<DepartmentsKPICards data={kpiCardsData} isLoading={false} />
```

### 📱 Responsividade

#### Mobile (< 640px)
- **Grid**: 1 coluna
- **Cards**: Largura mínima 280px
- **Fontes**: text-sm (0.875rem)
- **Ícones**: h-4 w-4 (16px)
- **Gap**: 1.5rem (24px)

#### Tablet (640px - 1024px)
- **Grid**: 2 colunas (md:grid-cols-2)
- **Cards**: Flexível com tamanho mínimo
- **Fontes**: text-sm (0.875rem)
- **Ícones**: h-4 w-4 (16px)
- **Gap**: 1.5rem (24px)

#### Desktop (> 1024px)
- **Grid**: 4 colunas (lg:grid-cols-4) ou carrossel se > 4 cards
- **Cards**: Tamanho otimizado
- **Fontes**: text-sm (0.875rem)
- **Ícones**: h-4 w-4 (16px)
- **Gap**: 1.5rem (24px)

### 🎠 Lógica do Carrossel

#### Quando Ativa o Carrossel
- `showCarousel = true`
- `data.length >= minCardsForCarousel` (padrão: 4)

#### Quando Usa Grid
- `showCarousel = false` OU
- `data.length < minCardsForCarousel`

#### Configuração do Carrossel
```typescript
opts={{
  align: "start",
  loop: false,
  skipSnaps: false,
  dragFree: true,
}}
```

### 🎨 Estilos e Cores

#### Padrão Monocromático
- **Ícones**: `text-muted-foreground` (cor padrão do sistema)
- **Títulos**: `text-sm font-medium` (padrão do dashboard)
- **Valores**: `text-2xl font-bold` (destaque principal)
- **Subtítulos**: `text-xs text-muted-foreground` (informação secundária)

#### Tendências Duotone
- **Positiva**: `TrendingUp` com `text-green-500`
- **Negativa**: `TrendingDown` com `text-red-500`
- **Labels**: Texto opcional para contexto (ex: "vs last month")

### 🌍 Internacionalização

#### Traduções Automáticas
- **Detecção**: Automática via `i18n.language`
- **Fallback**: Inglês se idioma não suportado
- **Formatação**: Números localizados por idioma

#### Arquivo de Traduções
```typescript
// /lib/translations/kpi.ts
export const kpiTranslations = {
  en: { /* traduções em inglês */ },
  nl: { /* traduções em holandês */ },
  pt: { /* traduções em português */ }
}
```

### 🔧 Customização

#### Props Opcionais
- `className`: Classes CSS customizadas
- `minCardsForCarousel`: Mínimo de cards para carrossel (padrão: 4)
- `showCarousel`: Forçar carrossel (padrão: true)
- `translationKey`: Chave para traduções específicas

#### Exemplo de Customização
```typescript
<KPICardsCarousel
  data={kpiCardsData}
  className="my-custom-class"
  minCardsForCarousel={3}
  showCarousel={false}
  translationKey="custom.kpi"
/>
```

### ✅ Funcionalidades

- ✅ **Padrão Dashboard**: Estilo consistente com o sistema
- ✅ **Responsivo**: Mobile-first design
- ✅ **Carrossel Inteligente**: Ativa quando necessário
- ✅ **Skeleton Loading**: Estados de carregamento animados
- ✅ **i18n**: Traduções automáticas
- ✅ **Tendências**: Indicadores visuais com ícones TrendingUp/Down
- ✅ **Ícones**: Suporte a qualquer ícone Lucide
- ✅ **Monocromático**: Estilo duotone consistente
- ✅ **Acessibilidade**: ARIA labels e navegação por teclado
- ✅ **Performance**: useMemo para otimização
- ✅ **TypeScript**: Tipagem completa

### 🎯 Casos de Uso

1. **Dashboard Principal**: Métricas gerais do sistema
2. **Páginas de Gestão**: KPIs específicos por entidade
3. **Relatórios**: Indicadores de performance
4. **Análises**: Métricas de tendência e crescimento

### 🔄 Reutilização

Este componente foi projetado para ser usado em **qualquer página** do sistema que precise exibir métricas. A estrutura de dados é flexível e pode ser facilmente adaptada para diferentes contextos.