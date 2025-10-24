# EntityInfoCard - Novo Layout Estruturado

## 📐 Layout Atualizado

```
┌─────────────────────────────────────────────────┐
│ ENTITY INFO                      [⋮] [🏢]       │ ← Header com borda
├─────────────────────────────────────────────────┤
│                                                  │
│ Institution Name (Bold)                          │ ← Nome (bold)
│ Description line 1                               │ ← Descrição
│ Description line 2 (max)...                      │   (max 2 linhas)
│                                                  │
├─────────────────────────────────────────────────┤
│ [Active] [Est. 2025] [EN]                       │ ← Footer (badges)
└─────────────────────────────────────────────────┘
```

## 🎯 Estrutura do Componente

### 1. **Header Section** (com borda inferior)
```tsx
┌────────────────────────────────────┐
│ ENTITY INFO          [⋮] [Icon]   │
└────────────────────────────────────┘
```

**Elementos:**
- **Título do Header**: Texto uppercase pequeno (ex: "ENTITY INFO", "INSTITUTION INFO")
- **Action Button**: Menu dropdown com ações (⋮)
- **Ícone Dinâmico**: Ícone com borda e background colorido

**Classes:**
- `border-b border-border` (borda inferior)
- `text-xs font-medium text-muted-foreground uppercase tracking-wide`

### 2. **Content Section**
```tsx
┌────────────────────────────────────┐
│ Entity Name (Bold)                 │
│ Description text here...           │
└────────────────────────────────────┘
```

**Elementos:**
- **Nome**: Bold, text-base, line-clamp-1
- **Descrição**: Muted text, text-xs, line-clamp-2

**Classes:**
- Nome: `font-bold text-base leading-tight line-clamp-1`
- Descrição: `text-xs text-muted-foreground leading-relaxed line-clamp-2`

### 3. **Footer Section** (com borda superior sutil)
```tsx
┌────────────────────────────────────┐
│ [Badge 1] [Badge 2] [Badge 3]     │
└────────────────────────────────────┘
```

**Elementos:**
- **Badges**: Tags de informação customizáveis

**Classes:**
- `border-t border-border/50` (borda superior sutil)

## 🔧 Propriedades Atualizadas

```tsx
interface EntityInfoCardProps {
  // Header
  headerTitle?: string              // ex: "Entity Info", "Institution Info"
  
  // Content
  name: string                       // Nome da entidade (bold)
  description: string                // Descrição (2 linhas max)
  
  // Ícone e Ações
  icon?: LucideIcon                  // Ícone dinâmico (padrão: Building)
  actions?: EntityInfoCardAction[]   // Menu de ações
  
  // Footer
  badges?: Badge[]                   // Tags customizáveis
  
  // Estilo
  accentColor?: "gray" | "blue" | "purple" | "green" | "orange" | "red"
  className?: string
  onClick?: () => void
}
```

## 📖 Exemplos de Uso

### 1. Instituição

```tsx
<EntityInfoCard
  headerTitle="Institution Info"
  name="Seventh-day Adventist Church"
  description="Regional administrative headquarters overseeing church operations"
  icon={Building}
  actions={institutionActions}
  accentColor="gray"
  badges={[
    { label: "Active", variant: "default" },
    { label: "Est. 2025", variant: "outline" },
    { label: "EN", variant: "outline" }
  ]}
/>
```

### 2. Igreja

```tsx
<EntityInfoCard
  headerTitle="Church Info"
  name="Maranatha Community Church"
  description="Urban congregation focused on youth ministry and community outreach"
  icon={Church}
  actions={churchActions}
  accentColor="green"
  badges={[
    { label: "Active", variant: "default" },
    { label: "250 Members", variant: "outline" }
  ]}
/>
```

### 3. Departamento

```tsx
<EntityInfoCard
  headerTitle="Department Info"
  name="Youth Ministry"
  description="Engaging young people in faith-based activities and service"
  icon={Layers}
  actions={departmentActions}
  accentColor="orange"
  badges={[
    { label: "Active", variant: "default" },
    { label: "15 Programs", variant: "outline" }
  ]}
/>
```

### 4. Usuário

```tsx
<EntityInfoCard
  headerTitle="User Info"
  name="John Doe"
  description="Senior Pastor & Regional Coordinator"
  icon={User}
  actions={userActions}
  accentColor="purple"
  badges={[
    { label: "Pastor", variant: "default" },
    { label: "Admin", variant: "outline" }
  ]}
/>
```

### 5. Projeto

```tsx
<EntityInfoCard
  headerTitle="Project Info"
  name="Community Outreach 2025"
  description="Annual initiative to serve local communities through various programs"
  icon={Briefcase}
  actions={projectActions}
  accentColor="blue"
  badges={[
    { label: "Active", variant: "default" },
    { label: "12 Locations", variant: "outline" }
  ]}
/>
```

## 🎨 Detalhes Visuais

### Ícone com Borda
```tsx
<div className="p-1.5 rounded-md border bg-muted/50 border-muted">
  <Icon className="h-4 w-4 text-muted-foreground" />
</div>
```

**Características:**
- ✅ Padding de 6px (p-1.5)
- ✅ Borda visível (border)
- ✅ Background theme-aware (bg-muted/50)
- ✅ Ícone 16x16 (h-4 w-4)

### Header com Borda
```tsx
<div className="flex items-center justify-between pb-2 border-b border-border">
  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
    ENTITY INFO
  </h4>
  {/* Actions + Icon */}
</div>
```

**Características:**
- ✅ Borda inferior separando header do conteúdo
- ✅ Título uppercase com tracking-wide
- ✅ Padding bottom antes da borda

### Footer com Borda Sutil
```tsx
<div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/50">
  {/* Badges */}
</div>
```

**Características:**
- ✅ Borda superior com 50% de opacidade
- ✅ Padding top após a borda
- ✅ Flex wrap para quebra de linha

## 🔄 Migração da API Antiga

### Antes (Props antigas ainda funcionam!)
```tsx
<InstitutionInfoCard
  title="Institution Name"
  subtitle="Description"
  // ... resto das props
/>
```

### Depois (Nova API recomendada)
```tsx
<EntityInfoCard
  headerTitle="Institution Info"
  name="Institution Name"
  description="Description"
  // ... resto das props
/>
```

## 📊 Comparação Visual

### Layout Antigo
```
┌─────────────────────────────────────┐
│ Title (small)           [Icon][⋮]  │
│ Subtitle text                       │
│                                     │
│ [Badges]                            │
└─────────────────────────────────────┘
```

### Layout Novo ⭐
```
┌─────────────────────────────────────┐
│ ENTITY INFO              [⋮][Icon] │ ← Header com borda
├─────────────────────────────────────┤
│ Title (Bold, maior)                 │ ← Nome em destaque
│ Description text                    │
├─────────────────────────────────────┤
│ [Badges]                            │ ← Footer com borda
└─────────────────────────────────────┘
```

## ✨ Melhorias Implementadas

1. ✅ **Header Separado**: Título genérico separado do conteúdo
2. ✅ **Nome em Destaque**: Bold e maior para melhor hierarquia
3. ✅ **Ícone com Borda**: Mais visível e destacado
4. ✅ **Bordas de Separação**: Estrutura visual clara
5. ✅ **Action Button Primeiro**: Menu de ações antes do ícone
6. ✅ **Footer Separado**: Tags organizadas no final
7. ✅ **Título Customizável**: headerTitle pode ser qualquer texto

## 🎯 Casos de Uso por Título

| Entity Type | headerTitle | icon | accentColor |
|-------------|-------------|------|-------------|
| Instituição | "Institution Info" | Building | gray |
| Igreja | "Church Info" | Church | green |
| Departamento | "Department Info" | Layers | orange |
| Usuário | "User Info" | User | purple |
| Projeto | "Project Info" | Briefcase | blue |
| Região | "Region Info" | MapPin | blue |
| Evento | "Event Info" | Calendar | orange |

## 🚀 Vantagens do Novo Layout

1. **Hierarquia Clara**: Header → Content → Footer
2. **Ícone Destacado**: Borda e posição fixa no header
3. **Título Genérico**: Customizável para qualquer entidade
4. **Nome em Destaque**: Bold para melhor legibilidade
5. **Estrutura Visual**: Bordas separam seções
6. **Ações Visíveis**: Menu dropdown antes do ícone
7. **Footer Organizado**: Badges separadas do conteúdo

---

**Arquivo**: `/components/shared/entity-info-card.tsx`  
**Atualizado**: 24 de outubro de 2025  
**Versão**: 3.0 (Structured Layout)
