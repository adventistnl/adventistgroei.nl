# Delete Institution Modal - Header & Institution Info Layout

## 📋 Overview

Reorganização do header do modal para mostrar primeiro o título "Deactivate Institution" e depois as informações da instituição em um container destacado com background cinza.

## 🎨 Mudanças Implementadas

### **Layout Anterior (Header em linha)**

```tsx
<DialogHeader className="flex-shrink-0 pb-4">
  <div className="flex items-start gap-4">
    {/* Ícone */}
    <div className="w-12 h-12 bg-muted rounded-full ...">
      <Building className="w-6 h-6 text-muted-foreground" />
    </div>
    
    {/* Informações */}
    <div className="flex-1 min-w-0">
      <DialogTitle className="text-lg mb-1">
        {institution.name}
      </DialogTitle>
      <DialogDescription className="text-sm text-muted-foreground">
        {institution.denomination}
      </DialogDescription>
    </div>
  </div>
</DialogHeader>
```

**Visual Anterior:**
```
┌─────────────────────────────────────┐
│ [🏢] Adventist Church NL            │
│      Seventh-day Adventist          │
└─────────────────────────────────────┘
```

### **Novo Layout (Título separado + Card)**

```tsx
<DialogHeader className="flex-shrink-0 pb-4">
  <DialogTitle className="text-lg mb-2">
    {t('institutions.modals.delete.deactivate_title')}
  </DialogTitle>
  <DialogDescription className="text-sm text-muted-foreground">
    {t('institutions.modals.delete.deactivate_description')}
  </DialogDescription>
</DialogHeader>

{/* Conteúdo - Scrollable */}
<div className="flex-1 overflow-y-auto min-h-0">
  <div className="space-y-6 p-1">
    
    {/* Institution Information */}
    <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
      {/* Ícone */}
      <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
        <Building className="w-6 h-6 text-muted-foreground" />
      </div>
      
      {/* Informações */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-foreground mb-1">
          {institution.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {institution.denomination}
        </p>
      </div>
    </div>
    
    {/* ... resto do conteúdo ... */}
  </div>
</div>
```

**Novo Visual:**
```
┌─────────────────────────────────────┐
│ Deactivate Institution              │ ← Título principal
│ This will deactivate the...         │ ← Descrição
├─────────────────────────────────────┤
│                                     │
│ ╔═══════════════════════════════╗  │
│ ║ [🏢] Adventist Church NL      ║  │ ← Container cinza
│ ║      Seventh-day Adventist    ║  │
│ ╚═══════════════════════════════╝  │
│                                     │
│ Affected Components                 │
│ ...                                 │
└─────────────────────────────────────┘
```

## 🎯 Componentes do Novo Layout

### 1. **DialogHeader (Fixo no topo)**

```tsx
<DialogHeader className="flex-shrink-0 pb-4">
  <DialogTitle className="text-lg mb-2">
    {t('institutions.modals.delete.deactivate_title')}
  </DialogTitle>
  <DialogDescription className="text-sm text-muted-foreground">
    {t('institutions.modals.delete.deactivate_description')}
  </DialogDescription>
</DialogHeader>
```

**Características:**
- ✅ Título: "Deactivate Institution"
- ✅ Descrição: "This will deactivate the institution..."
- ✅ Texto padrão (sem ícone no header)
- ✅ Margem inferior: `mb-2` entre título e descrição

### 2. **Institution Information Card**

```tsx
<div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg border">
  {/* Ícone */}
  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center flex-shrink-0 border">
    <Building className="w-6 h-6 text-muted-foreground" />
  </div>
  
  {/* Informações */}
  <div className="flex-1 min-w-0">
    <h3 className="text-base font-semibold text-foreground mb-1">
      {institution.name}
    </h3>
    <p className="text-sm text-muted-foreground">
      {institution.denomination}
    </p>
  </div>
</div>
```

**Características:**
- ✅ Background cinza: `bg-muted/50` (50% opacity)
- ✅ Borda: `border` (sutil)
- ✅ Cantos arredondados: `rounded-lg`
- ✅ Padding: `p-4`
- ✅ Layout flex em linha: `flex items-start gap-4`

**Ícone Container:**
- ✅ Tamanho: `w-12 h-12` (48x48px)
- ✅ Background branco: `bg-background`
- ✅ Borda sutil: `border`
- ✅ Círculo: `rounded-full`
- ✅ Ícone Building centralizado

**Informações:**
- ✅ Nome: `text-base font-semibold` (destaque)
- ✅ Denominação: `text-sm text-muted-foreground` (secundário)

## 🎨 Hierarquia Visual

### Estrutura Completa:

```
┌─────────────────────────────────────────┐
│ HEADER (Fixo)                           │
│ ├─ Deactivate Institution (título)      │
│ └─ This will deactivate... (descrição)  │
├─────────────────────────────────────────┤
│ CONTEÚDO (Scrollable)                   │
│                                         │
│ ┌─────────────────────────────────┐    │
│ │ [🏢] Institution Name           │    │ ← Card cinza
│ │      Denomination               │    │
│ └─────────────────────────────────┘    │
│                                         │
│ Affected Components                     │
│ ├─ Regions: 5                          │
│ ├─ Churches: 12                        │
│ ├─ Departments: 8                      │
│ └─ Users: 45                           │
│                                         │
│ [View Consequences ▼]                  │
│                                         │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓     │
│ ┃ ☑ I understand consequences  ┃     │
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛     │
│                                         │
│ Type 'delete institution':              │
│ [delete institution____________]        │
│                                         │
├─────────────────────────────────────────┤
│ FOOTER (Fixo)                           │
│ [Cancel] [🗑 Deactivate]               │
└─────────────────────────────────────────┘
```

## 🎨 Estilos e Cores

### Container da Instituição

```css
/* Light Mode */
bg-muted/50         → Cinza claro com 50% opacity
bg-background       → Branco (ícone)
border              → Borda cinza sutil
text-foreground     → Texto principal preto
text-muted-foreground → Texto secundário cinza

/* Dark Mode */
bg-muted/50         → Cinza escuro com 50% opacity
bg-background       → Preto/cinza escuro (ícone)
border              → Borda cinza sutil
text-foreground     → Texto principal branco
text-muted-foreground → Texto secundário cinza
```

### Comparação com Background

**Antes (sem background):**
```
Institution Name
Denomination
```

**Depois (com background cinza):**
```
╔═══════════════════════════╗
║ [🏢] Institution Name     ║
║      Denomination         ║
╚═══════════════════════════╝
```

## 📐 Layout Responsivo

### Desktop (> 640px)
```
┌────────────────────────────────┐
│ Deactivate Institution         │
│ This will deactivate...        │
├────────────────────────────────┤
│                                │
│ ┌──────────────────────────┐  │
│ │ [🏢] Institution Name    │  │
│ │      Denomination        │  │
│ └──────────────────────────┘  │
│                                │
│ ...resto do conteúdo...        │
└────────────────────────────────┘
```

### Mobile (< 640px)
```
┌─────────────────────────┐
│ Deactivate Institution  │
│ This will deactivate... │
├─────────────────────────┤
│                         │
│ ┌─────────────────────┐ │
│ │ [🏢] Institution    │ │
│ │      Name           │ │
│ │      Denomination   │ │
│ └─────────────────────┘ │
│                         │
│ ...resto...             │
└─────────────────────────┘
```

## ✅ Benefícios das Mudanças

### 1. **Hierarquia Clara**
- ✅ Título do modal ("Deactivate Institution") como elemento principal
- ✅ Informações da instituição como contexto secundário
- ✅ Separação visual entre ação e dados

### 2. **Destaque Visual**
- ✅ Container cinza destaca as informações da instituição
- ✅ Ícone em círculo branco com borda
- ✅ Nome em negrito (`font-semibold`)

### 3. **Consistência**
- ✅ Header padrão com DialogTitle e DialogDescription
- ✅ Container segue padrão de cards do sistema
- ✅ Espaçamento consistente (`space-y-6`, `gap-4`, `p-4`)

### 4. **Acessibilidade**
- ✅ Título semântico com DialogTitle
- ✅ Descrição com DialogDescription
- ✅ Hierarquia de headings (`<h3>` para nome da instituição)

## 🎯 Fluxo Visual do Usuário

### 1. **Primeira Visualização**
```
Usuário lê: "Deactivate Institution"
           ↓
Usuário entende: É um modal de desativação
           ↓
Usuário vê: Card cinza com nome da instituição
           ↓
Usuário confirma: Está desativando a instituição correta
```

### 2. **Processo de Confirmação**
```
1. Lê o título: "Deactivate Institution"
2. Vê o card: "Adventist Church NL - Seventh-day Adventist"
3. Verifica estatísticas: 5 regiões, 12 igrejas, etc.
4. Expande consequences (opcional)
5. Marca checkbox: "I understand"
6. Digita: "delete institution"
7. Clica: Botão vermelho ativo "Deactivate"
```

## 📊 Comparação Antes vs Depois

### Antes:
```
Prioridade 1: Nome da instituição (header)
Prioridade 2: Denominação (header)
Prioridade 3: Estatísticas
```

### Depois:
```
Prioridade 1: Deactivate Institution (título)
Prioridade 2: Descrição da ação
Prioridade 3: Nome da instituição (card destacado)
Prioridade 4: Denominação (card)
Prioridade 5: Estatísticas
```

## 🎯 Objetivos Alcançados

✅ **Título "Deactivate Institution" no header**  
✅ **Informações da instituição abaixo do título**  
✅ **Container com background cinza (`bg-muted/50`)**  
✅ **Ícone Building em círculo branco**  
✅ **Nome da instituição em destaque (`font-semibold`)**  
✅ **Denominação como texto secundário**  
✅ **Borda sutil no container**  
✅ **Layout responsivo mantido**  
✅ **Hierarquia visual clara**  

## 📚 Arquivos Modificados

1. **components/modals/institution/delete-institution-modal.tsx**
   - DialogHeader reorganizado (título + descrição)
   - Institution info movida para dentro do conteúdo scrollable
   - Container com `bg-muted/50` e `border`
   - Ícone com background branco (`bg-background`)

---

**Status:** ✅ Implementado e funcional  
**Data:** 23 de outubro de 2025  
**Branch:** feature/privacy-overlay-minimalist  
**TypeScript Errors:** 0
