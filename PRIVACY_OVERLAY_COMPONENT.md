# 🎯 PrivacyOverlay Component - Guia Completo

## 📋 Overview

Componente reutilizável que **envolve qualquer skeleton** e gerencia automaticamente:
- ✅ Blur no conteúdo
- ✅ Overlay semi-transparente
- ✅ Mensagem centralizada
- ✅ Fácil de usar e configurar

---

## 🚀 Uso Básico

### Exemplo Simples

```tsx
import { PrivacyOverlay } from '@/components/shared/privacy-overlay'
import { Skeleton } from '@/components/ui/skeleton'

{isHidden ? (
  <PrivacyOverlay height="300px">
    {/* Seu skeleton customizado */}
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  </PrivacyOverlay>
) : (
  <YourActualContent />
)}
```

---

## 📝 Props

| Prop | Type | Default | Descrição |
|------|------|---------|-----------|
| `children` | `ReactNode` | - | **Obrigatório**. Skeleton que será borrado |
| `height` | `string` | `'300px'` | Altura do container |
| `blurIntensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Intensidade do blur |
| `customMessage` | `{ title?: string, description?: string }` | - | Mensagem customizada |
| `className` | `string` | - | Classes CSS adicionais |

---

## 🎨 Exemplos de Uso

### Exemplo 1: Chart Component (Department Spending)

```tsx
import { PrivacyOverlay } from '@/components/shared/privacy-overlay'
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'
import { useComponentPrivacy } from '@/contexts/privacy-context'
import { createPrivacyConfig } from '@/config/privacy-roles.config'

const PRIVACY_CONFIG = createPrivacyConfig(
  'department-spending-chart',
  'FINANCIAL_DATA'
)

export function DepartmentSpendingChart({ data }) {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Department Spending</CardTitle>
          <InlinePrivacyToggle config={PRIVACY_CONFIG} />
        </div>
      </CardHeader>

      <CardContent>
        {isHidden ? (
          <PrivacyOverlay height="300px">
            {/* Skeleton customizado para gráfico */}
            <div className="space-y-4 p-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-64 w-full" />
              <div className="flex gap-2 justify-center">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </PrivacyOverlay>
        ) : (
          <BarChart data={data} />
        )}
      </CardContent>
    </Card>
  )
}
```

### Exemplo 2: Table Component

```tsx
{isHidden ? (
  <PrivacyOverlay height="400px" blurIntensity="high">
    {/* Skeleton para tabela */}
    <div className="space-y-2 p-4">
      <Skeleton className="h-10 w-full" />  {/* Header */}
      <Skeleton className="h-8 w-full" />   {/* Row 1 */}
      <Skeleton className="h-8 w-full" />   {/* Row 2 */}
      <Skeleton className="h-8 w-full" />   {/* Row 3 */}
      <Skeleton className="h-8 w-full" />   {/* Row 4 */}
      <Skeleton className="h-8 w-full" />   {/* Row 5 */}
    </div>
  </PrivacyOverlay>
) : (
  <DataTable data={data} />
)}
```

### Exemplo 3: KPI Cards

```tsx
{isHidden ? (
  <PrivacyOverlay height="200px" blurIntensity="low">
    {/* Skeleton para KPIs */}
    <div className="grid grid-cols-4 gap-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />   {/* Label */}
        <Skeleton className="h-8 w-full" /> {/* Value */}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  </PrivacyOverlay>
) : (
  <KPICards data={kpis} />
)}
```

### Exemplo 4: Mensagem Customizada

```tsx
{isHidden ? (
  <PrivacyOverlay 
    height="300px"
    blurIntensity="high"
    customMessage={{
      title: "Dados Financeiros Restritos",
      description: "Apenas usuários autorizados podem visualizar essas informações. Entre em contato com o departamento financeiro."
    }}
  >
    <div className="space-y-4 p-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  </PrivacyOverlay>
) : (
  <FinancialReport data={data} />
)}
```

---

## 🔧 Intensidades de Blur

### `blurIntensity="low"`
```css
blur-[2px]  /* Blur sutil */
```
**Uso**: Dados menos sensíveis, preview parcial

### `blurIntensity="medium"` (padrão)
```css
blur-sm     /* Blur médio */
```
**Uso**: Maioria dos casos, balanceado

### `blurIntensity="high"`
```css
blur-md     /* Blur intenso */
```
**Uso**: Dados muito sensíveis, máxima privacidade

---

## 📊 Comparação: Antes vs Depois

### ❌ Antes (Sem PrivacyOverlay)

```tsx
{isHidden ? (
  <div className="h-[300px] w-full relative">
    {/* Camada 1: Skeleton com blur */}
    <div className="absolute inset-0 blur-sm pointer-events-none select-none">
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>

    {/* Camada 2: Overlay + mensagem */}
    <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10">
      <div className="bg-gray-900/95 text-white px-8 py-6 rounded-xl flex flex-col items-center gap-3 shadow-2xl max-w-md text-center border border-gray-700">
        <div className="flex items-center gap-3">
          <EyeOff className="w-6 h-6" />
          <span className="text-lg font-semibold">Privacy Content</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          This information is protected. Contact admin to see more.
        </p>
      </div>
    </div>
  </div>
) : (
  <YourContent />
)}

// ❌ 30+ linhas de código repetitivo
// ❌ Difícil de manter
// ❌ Propenso a erros
```

### ✅ Depois (Com PrivacyOverlay)

```tsx
{isHidden ? (
  <PrivacyOverlay height="300px">
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-64 w-full" />
    </div>
  </PrivacyOverlay>
) : (
  <YourContent />
)}

// ✅ 7 linhas de código
// ✅ Fácil de manter
// ✅ Reutilizável
// ✅ Consistente
```

**Redução:** ~77% menos código! (30 linhas → 7 linhas)

---

## 🎯 Template Completo

### Setup Inicial

```tsx
// 1. Imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PrivacyOverlay } from '@/components/shared/privacy-overlay'
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'
import { useComponentPrivacy } from '@/contexts/privacy-context'
import { createPrivacyConfig } from '@/config/privacy-roles.config'

// 2. Privacy Config
const PRIVACY_CONFIG = createPrivacyConfig(
  'your-component-id',
  'FINANCIAL_DATA' // ou outro preset
)

// 3. Component
export function YourComponent({ data }) {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      {/* 4. Header com Toggle */}
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Your Title</CardTitle>
          <InlinePrivacyToggle config={PRIVACY_CONFIG} />
        </div>
      </CardHeader>

      {/* 5. Content com PrivacyOverlay */}
      <CardContent>
        {isHidden ? (
          <PrivacyOverlay height="300px">
            {/* 6. Seu Skeleton Customizado */}
            <div className="space-y-4 p-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </PrivacyOverlay>
        ) : (
          // 7. Seu Conteúdo Real
          <YourActualContent data={data} />
        )}
      </CardContent>
    </Card>
  )
}
```

---

## 💡 Dicas e Boas Práticas

### 1. **Altura do Container**

```tsx
// ✅ Use a mesma altura do conteúdo real
<PrivacyOverlay height="300px">  {/* Mesmo que o gráfico */}
  <YourSkeleton />
</PrivacyOverlay>

// ❌ Evite heights diferentes
<PrivacyOverlay height="200px">  {/* Gráfico tem 300px */}
  <YourSkeleton />
</PrivacyOverlay>
```

### 2. **Skeleton Customizado**

```tsx
// ✅ Crie skeleton que reflita o conteúdo
<PrivacyOverlay height="300px">
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />    {/* Título */}
    <Skeleton className="h-64 w-full" />  {/* Gráfico */}
    <Skeleton className="h-4 w-1/2" />    {/* Legenda */}
  </div>
</PrivacyOverlay>

// ❌ Evite skeleton genérico demais
<PrivacyOverlay height="300px">
  <Skeleton className="h-full w-full" />
</PrivacyOverlay>
```

### 3. **Blur Intensity**

```tsx
// ✅ Escolha baseado na sensibilidade
<PrivacyOverlay blurIntensity="high">    {/* Dados muito sensíveis */}
<PrivacyOverlay blurIntensity="medium">  {/* Maioria dos casos */}
<PrivacyOverlay blurIntensity="low">     {/* Preview parcial OK */}
```

### 4. **Mensagem Customizada**

```tsx
// ✅ Use para contextos específicos
<PrivacyOverlay 
  customMessage={{
    title: "Dados Financeiros",
    description: "Requer autorização especial"
  }}
>
  <YourSkeleton />
</PrivacyOverlay>

// ✅ Deixe padrão para casos gerais
<PrivacyOverlay>  {/* Usa mensagem padrão */}
  <YourSkeleton />
</PrivacyOverlay>
```

---

## 🔍 Estrutura Interna

O `PrivacyOverlay` implementa automaticamente:

```
┌─────────────────────────────────────┐
│  MENSAGEM CENTRALIZADA              │  ← Camada 3 (z-10)
│  "Privacy Content"                  │
├─────────────────────────────────────┤
│  OVERLAY SEMI-TRANSPARENTE          │  ← Camada 2 (z-10)
│  bg-white/40 + backdrop-blur        │
├─────────────────────────────────────┤
│  SKELETON COM BLUR                  │  ← Camada 1 (z-0)
│  {children} + blur-sm               │
└─────────────────────────────────────┘
```

---

## ✅ Checklist de Migração

Para migrar componentes existentes:

- [ ] Importar `PrivacyOverlay`
- [ ] Remover código manual de blur/overlay
- [ ] Envolver skeleton com `<PrivacyOverlay>`
- [ ] Definir `height` apropriada
- [ ] Escolher `blurIntensity` (opcional)
- [ ] Testar hide/show
- [ ] Verificar altura do container
- [ ] Validar mensagem centralizada

---

## 📚 Arquivos

- **Componente**: `components/shared/privacy-overlay.tsx`
- **Exemplo**: `components/charts/annual-budget/department-spending-chart.tsx`
- **Documentação**: `PRIVACY_OVERLAY_COMPONENT.md`

---

## 🎉 Benefícios

| Benefício | Descrição |
|-----------|-----------|
| **🔄 Reutilizável** | Use em qualquer componente |
| **⚡ Simples** | 1 linha em vez de 30+ |
| **🎨 Customizável** | Height, blur, mensagem |
| **📦 Encapsulado** | Toda lógica em um lugar |
| **🛡️ Consistente** | Mesmo visual em todo app |
| **🐛 Menos bugs** | Código centralizado |
| **📝 Manutenível** | Fácil de atualizar |

---

**Componente pronto para uso! 🚀**

**Última Atualização**: 22 de outubro de 2025  
**Versão**: 4.0.0 - PrivacyOverlay Component  
**Status**: ✅ Implementado e Documentado
