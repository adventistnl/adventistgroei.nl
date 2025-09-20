# ResponsiveGridCarousel

Um componente React genérico e reutilizável que renderiza children como **Grid em telas grandes** e como **Carousel em telas pequenas** (tablets e celulares).

## 🎯 Características

- ✅ **Client-side** (`"use client"`)
- ✅ **Children dinâmicos** - aceita qualquer elemento React
- ✅ **Grid responsivo** em telas grandes (desktop)
- ✅ **Carousel** em telas pequenas (mobile/tablet)
- ✅ **Autoplay opcional** com controles de mouse
- ✅ **Altamente configurável** via props
- ✅ **Wrapper de Card opcional**
- ✅ **Breakpoints customizáveis**

## 📦 Instalação

```bash
pnpm add embla-carousel-autoplay embla-carousel
```

## 🚀 Uso Básico

```tsx
import { ResponsiveGridCarousel } from "@/components/shared/responsive-grid-carousel"

function MyComponent() {
  return (
    <ResponsiveGridCarousel autoplayDelay={3000}>
      <MyChart />
      <AnotherChart />
      <Card><CardContent>Exemplo</CardContent></Card>
    </ResponsiveGridCarousel>
  )
}
```

## 🎛️ Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `React.ReactNode` | - | Elementos filhos a serem renderizados |
| `className` | `string` | - | Classes CSS adicionais |
| `autoplayDelay` | `number` | `3000` | Delay do autoplay em ms |
| `enableAutoplay` | `boolean` | `true` | Habilitar autoplay no carousel |
| `gridCols` | `object` | `{sm:1, md:2, lg:3, xl:4}` | Colunas por breakpoint |
| `gap` | `string` | `"gap-4"` | Espaçamento entre itens |
| `itemPadding` | `string` | `"p-2"` | Padding interno dos itens |
| `useCardWrapper` | `boolean` | `false` | Envolver itens em Card |
| `breakpoint` | `string` | `"md"` | Breakpoint para mudar grid→carousel |

## 📱 Comportamento Responsivo

### Desktop (≥ breakpoint)
- Renderiza como **grid inteligente** com layout adaptativo
- **Container centralizado** com `max-w-screen-xl`
- **Distribuição inteligente** baseada no número de items:
  - **1 item**: ocupa toda a largura
  - **2 itens**: 50% cada
  - **3 itens**: primeiro 100%, outros dois 50% cada na linha abaixo
  - **4+ itens**: grid responsivo com máximo 2 linhas
- **Sem overflow horizontal** - sempre respeita os limites da tela
- **Altura uniforme** entre os itens (`auto-rows-fr`)

### Mobile/Tablet (< breakpoint)
- Renderiza como **carousel**
- Navegação por setas
- Autoplay opcional
- Swipe/drag suportado
- Container centralizado com padding

## 🎨 Componentes Wrapper Inclusos

### AnalyticsGridCarousel
Otimizado para gráficos e analytics:

```tsx
<AnalyticsGridCarousel enableAutoplay={false}>
  <MyChart />
  <AnotherChart />
</AnalyticsGridCarousel>
```

### KPIGridCarousel
Otimizado para cards de KPI:

```tsx
<KPIGridCarousel autoplayDelay={3000}>
  <KPICard title="Users" value="1,234" />
  <KPICard title="Revenue" value="$45,678" />
</KPIGridCarousel>
```

## 🎯 Layout Inteligente

O componente implementa um sistema de layout adaptativo que distribui os itens de forma otimizada:

### Distribuição por Número de Itens

#### 1 Item
```
┌─────────────────────┐
│        Item 1       │
└─────────────────────┘
```

#### 2 Itens
```
┌──────────┐ ┌──────────┐
│  Item 1  │ │  Item 2  │
└──────────┘ └──────────┘
```

#### 3 Itens
```
┌─────────────────────┐
│        Item 1       │
└─────────────────────┘
┌──────────┐ ┌──────────┐
│  Item 2  │ │  Item 3  │
└──────────┘ └──────────┘
```

#### 4+ Itens
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ I1  │ │ I2  │ │ I3  │ │ I4  │
└─────┘ └─────┘ └─────┘ └─────┘
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│ I5  │ │ I6  │ │ I7  │ │ I8  │
└─────┘ └─────┘ └─────┘ └─────┘
```

### Limitações
- **Máximo 8 itens** visíveis simultaneamente
- **Máximo 2 linhas** para manter a organização
- **Container**: `max-w-screen-xl` para evitar overflow
- **Altura uniforme**: `auto-rows-fr` garante alinhamento

## 🔧 Configurações Avançadas

### Grid Customizado
```tsx
<ResponsiveGridCarousel
  gridCols={{
    sm: 1,    // 1 coluna em telas pequenas
    md: 2,    // 2 colunas em telas médias
    lg: 3,    // 3 colunas em telas grandes
    xl: 6     // 6 colunas em telas extra grandes
  }}
  gap="gap-6"
  breakpoint="lg" // Muda para carousel apenas em < lg
>
  {children}
</ResponsiveGridCarousel>
```

### Autoplay Customizado
```tsx
<ResponsiveGridCarousel
  enableAutoplay={true}
  autoplayDelay={5000} // 5 segundos
>
  {children}
</ResponsiveGridCarousel>
```

### Wrapper de Card
```tsx
<ResponsiveGridCarousel
  useCardWrapper={true}
  itemPadding="p-4"
>
  {/* Cada child será automaticamente envolvido em Card */}
  <div>Conteúdo 1</div>
  <div>Conteúdo 2</div>
</ResponsiveGridCarousel>
```

## 🎯 Casos de Uso

1. **Dashboards Analytics** - Gráficos que se adaptam ao tamanho da tela
2. **KPI Cards** - Métricas que ficam em grid no desktop e carousel no mobile
3. **Galeria de Produtos** - Produtos em grid que viram carousel
4. **Cards de Conteúdo** - Qualquer conteúdo que precisa ser responsivo
5. **Componentes Mistos** - Diferentes tipos de conteúdo juntos

## ⚡ Performance

- **Detecção de breakpoint** via `window.innerWidth`
- **Lazy loading** dos componentes baseado na tela
- **Autoplay inteligente** - pausa no hover, retoma ao sair
- **Renderização condicional** - apenas o layout necessário é renderizado

## 🎨 Estilos

O componente usa **TailwindCSS** para todos os estilos:
- Classes de grid responsivas (`grid-cols-*`)
- Breakpoints padrão do Tailwind (`sm:`, `md:`, `lg:`, `xl:`)
- Espaçamento consistente (`gap-*`, `p-*`)
- Transições suaves (`transition-all`, `duration-*`)

## 🔄 Integração com Shadcn/ui

Totalmente compatível com componentes Shadcn/ui:
- `Card`, `CardContent`, `CardHeader`
- `Carousel`, `CarouselContent`, `CarouselItem`
- `Button`, `Badge`, `Separator`

## 📚 Exemplos Completos

Veja `responsive-grid-carousel-examples.tsx` para exemplos detalhados de:
- Cards simples com autoplay
- KPI Cards com ícones
- Conteúdo misto (não apenas cards)
- Analytics com wrapper específico

## 🛠️ Troubleshooting

### Autoplay não funciona
- Verifique se `embla-carousel-autoplay` está instalado
- Confirme que `enableAutoplay={true}`

### Grid não responsivo
- Verifique as classes Tailwind (`grid-cols-*`)
- Confirme que o breakpoint está correto

### Carousel sem navegação
- Verifique se há mais de 1 child
- Confirme que os controles não estão ocultos por CSS
