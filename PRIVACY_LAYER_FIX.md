# 🎯 Privacy Pattern - Padrão Replicável

## 📋 Estrutura de Camadas

Quando um componente está **hidden**, a estrutura deve ser:

```
┌─────────────────────────────────────┐
│  3. MENSAGEM (z-10)                 │  ← Mensagem centralizada
│     bg-white/40 + backdrop-blur     │
├─────────────────────────────────────┤
│  2. OVERLAY (z-10)                  │  ← Overlay semi-transparente
│     bg-white/40 + backdrop-blur-sm  │
├─────────────────────────────────────┤
│  1. SKELETON COM BLUR (z-0)         │  ← Skeleton borrado
│     blur-sm + pointer-events-none   │
└─────────────────────────────────────┘
```

---

## ✅ Padrão Correto

### Template Base

```tsx
{isHidden ? (
  // Privacy Mode: 3 Camadas
  <div className="h-[300px] w-full relative"> {/* Container */}
    
    {/* 🎯 CAMADA 1: Skeleton com Blur */}
    <div className="absolute inset-0 blur-sm pointer-events-none select-none">
      {/* Seu skeleton customizado aqui */}
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>

    {/* 🎯 CAMADA 2 + 3: Overlay + Mensagem */}
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
  // Normal Mode: Seu conteúdo
  <YourActualContent />
)}
```

---

## 📝 Passo a Passo para Implementar

### 1. **Imports Necessários**

```tsx
import { EyeOff } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { useComponentPrivacy } from "@/contexts/privacy-context"
import { createPrivacyConfig } from "@/config/privacy-roles.config"
```

### 2. **Criar Configuração de Privacy**

```tsx
const PRIVACY_CONFIG = createPrivacyConfig(
  'seu-component-id', // ID único
  'FINANCIAL_DATA'     // Preset: ADMIN_ONLY, FINANCIAL_DATA, etc.
)
```

### 3. **Usar Hook de Privacy**

```tsx
export function YourComponent() {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)
  
  // ... seu código
}
```

### 4. **Adicionar Botão Toggle no Header**

```tsx
<CardHeader>
  <div className="flex items-start justify-between">
    <div className="flex-1">
      <CardTitle>Your Title</CardTitle>
    </div>
    
    {/* Botão Privacy */}
    <InlinePrivacyToggle 
      config={PRIVACY_CONFIG} 
      className="privacy-toggle-button-header flex-shrink-0" 
    />
  </div>
</CardHeader>
```

### 5. **Implementar Camadas de Privacy**

```tsx
<CardContent className="flex-1 relative">
  {isHidden ? (
    // 🔒 PRIVACY MODE
    <div className="h-[300px] w-full relative">
      
      {/* CAMADA 1: Skeleton Customizado com Blur */}
      <div className="absolute inset-0 blur-sm pointer-events-none select-none">
        {/* 🎨 CUSTOMIZE SEU SKELETON AQUI */}
        <div className="space-y-4 p-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      {/* CAMADA 2+3: Overlay + Mensagem (NÃO MODIFICAR) */}
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
    // 👁️ NORMAL MODE
    <YourActualContent />
  )}
</CardContent>
```

---

## 🎨 Customização do Skeleton

### Exemplo 1: Chart Component

```tsx
{/* Skeleton para gráfico */}
<div className="absolute inset-0 blur-sm pointer-events-none select-none">
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />      {/* Título */}
    <Skeleton className="h-64 w-full" />    {/* Gráfico */}
    <div className="flex gap-2 justify-center">
      <Skeleton className="h-4 w-20" />     {/* Legenda 1 */}
      <Skeleton className="h-4 w-20" />     {/* Legenda 2 */}
      <Skeleton className="h-4 w-20" />     {/* Legenda 3 */}
    </div>
  </div>
</div>
```

### Exemplo 2: Table Component

```tsx
{/* Skeleton para tabela */}
<div className="absolute inset-0 blur-sm pointer-events-none select-none">
  <div className="space-y-2 p-4">
    <Skeleton className="h-10 w-full" />    {/* Header */}
    <Skeleton className="h-8 w-full" />     {/* Row 1 */}
    <Skeleton className="h-8 w-full" />     {/* Row 2 */}
    <Skeleton className="h-8 w-full" />     {/* Row 3 */}
    <Skeleton className="h-8 w-full" />     {/* Row 4 */}
  </div>
</div>
```

### Exemplo 3: Card Grid

```tsx
{/* Skeleton para grid de cards */}
<div className="absolute inset-0 blur-sm pointer-events-none select-none">
  <div className="grid grid-cols-3 gap-4 p-4">
    <Skeleton className="h-32 w-full" />    {/* Card 1 */}
    <Skeleton className="h-32 w-full" />    {/* Card 2 */}
    <Skeleton className="h-32 w-full" />    {/* Card 3 */}
  </div>
</div>
```

### Exemplo 4: KPI Cards

```tsx
{/* Skeleton para KPIs */}
<div className="absolute inset-0 blur-sm pointer-events-none select-none">
  <div className="grid grid-cols-4 gap-4 p-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />     {/* Label */}
      <Skeleton className="h-8 w-full" />   {/* Value */}
    </div>
    {/* Repetir para outros KPIs */}
  </div>
</div>
```

---

## ⚠️ Classes CSS Obrigatórias

### Container Principal
```css
className="h-[300px] w-full relative"  /* Altura, largura e position */
```

### Camada 1: Skeleton com Blur
```css
className="absolute inset-0 blur-sm pointer-events-none select-none"
```
- ✅ `absolute inset-0` - Preenche todo container
- ✅ `blur-sm` - Aplica blur no skeleton
- ✅ `pointer-events-none` - Desabilita interação
- ✅ `select-none` - Desabilita seleção de texto

### Camada 2+3: Overlay + Mensagem
```css
className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10"
```
- ✅ `absolute inset-0` - Preenche todo container
- ✅ `flex items-center justify-center` - Centraliza mensagem
- ✅ `bg-white/40` - Overlay semi-transparente
- ✅ `backdrop-blur-sm` - Blur adicional no background
- ✅ `z-10` - Fica acima do skeleton

### Mensagem
```css
className="bg-gray-900/95 text-white px-8 py-6 rounded-xl flex flex-col items-center gap-3 shadow-2xl max-w-md text-center border border-gray-700"
```
- ✅ `bg-gray-900/95` - Background quase opaco
- ✅ `shadow-2xl` - Sombra forte
- ✅ `border border-gray-700` - Border sutil

---

## 📊 Exemplo Completo: Department Spending Chart

```tsx
"use client"

import React, { useMemo } from "react"
import { Building, TrendingUp, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InlinePrivacyToggle } from "@/components/shared/privacy-wrapper"
import { useComponentPrivacy } from "@/contexts/privacy-context"
import { createPrivacyConfig } from "@/config/privacy-roles.config"

// 1. Configuração
const PRIVACY_CONFIG = createPrivacyConfig(
  'department-spending-chart',
  'FINANCIAL_DATA'
)

export function DepartmentSpendingChart({ data }) {
  // 2. Hook de Privacy
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      {/* 3. Header com Botão */}
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>Department Spending</CardTitle>
          <InlinePrivacyToggle 
            config={PRIVACY_CONFIG} 
            className="privacy-toggle-button-header" 
          />
        </div>
      </CardHeader>

      {/* 4. Content com Privacy Layers */}
      <CardContent className="flex-1 relative">
        {isHidden ? (
          // Privacy Mode
          <div className="h-[300px] w-full relative">
            
            {/* Camada 1: Skeleton com Blur */}
            <div className="absolute inset-0 blur-sm pointer-events-none select-none">
              <div className="space-y-4 p-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-64 w-full" />
                <div className="flex gap-2 justify-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>

            {/* Camada 2+3: Overlay + Mensagem */}
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
          // Normal Mode
          <YourChart data={data} />
        )}
      </CardContent>
    </Card>
  )
}
```

---

## ✅ Checklist de Implementação

Para cada novo componente:

- [ ] ✅ Imports: `EyeOff`, `Skeleton`, `InlinePrivacyToggle`, `useComponentPrivacy`
- [ ] ✅ Config: `createPrivacyConfig('id', 'PRESET')`
- [ ] ✅ Hook: `const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)`
- [ ] ✅ Botão no header: `<InlinePrivacyToggle config={PRIVACY_CONFIG} />`
- [ ] ✅ Container: `<div className="h-[300px] w-full relative">`
- [ ] ✅ Camada 1: Skeleton customizado com `blur-sm`
- [ ] ✅ Camada 2+3: Overlay + mensagem padrão
- [ ] ✅ Testar: hide/show funcionando
- [ ] ✅ Verificar: mensagem aparece centralizada

---

## 🚫 Erros Comuns

### ❌ Erro 1: Skeleton sem blur
```tsx
{/* ERRADO */}
<div className="space-y-4">
  <Skeleton className="h-8 w-3/4" />
</div>
```

```tsx
{/* CORRETO */}
<div className="absolute inset-0 blur-sm pointer-events-none select-none">
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-3/4" />
  </div>
</div>
```

### ❌ Erro 2: Mensagem sem overlay
```tsx
{/* ERRADO - Mensagem não aparece */}
<div className="flex items-center justify-center">
  <div className="bg-gray-900/95">...</div>
</div>
```

```tsx
{/* CORRETO - Com overlay */}
<div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-10">
  <div className="bg-gray-900/95">...</div>
</div>
```

### ❌ Erro 3: Sem z-index
```tsx
{/* ERRADO - Mensagem fica atrás */}
<div className="absolute inset-0 flex items-center justify-center">
  ...
</div>
```

```tsx
{/* CORRETO - Com z-10 */}
<div className="absolute inset-0 flex items-center justify-center ... z-10">
  ...
</div>
```

---

## 🎯 Resultado Final

```
┌─────────────────────────────────────┐
│  Title             ⚫ [👁️]          │
├─────────────────────────────────────┤
│  ░░░░░░░░░░░░░░░░░░░                │  ← Blur visível
│  ┌───────────────────────┐          │
│  │  🔒 Privacy Content   │          │  ← Mensagem visível
│  │  Contact admin...     │          │
│  └───────────────────────┘          │
│  ░░░░░░░░░░░░░░░░░░░                │  ← Blur visível
└─────────────────────────────────────┘
```

**Padrão validado e pronto para replicar! 🎉**

---

**Última Atualização**: 22 de outubro de 2025  
**Versão**: 3.3.0 - Privacy Layer Pattern  
**Status**: ✅ Padrão Definido
