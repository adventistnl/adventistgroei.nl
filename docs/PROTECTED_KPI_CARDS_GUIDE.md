# Protected KPI Cards - Guia de Implementação

## 📊 Visão Geral

Sistema de **KPI Cards protegidos** com validação de permissões individuais no dashboard. Cada KPI verifica se o usuário possui a permissão específica antes de exibir os dados sensíveis.

**Novidade**: Agora com suporte a **carrossel responsivo** para navegação fluida entre múltiplos KPIs!

## 🎯 Funcionalidades

- ✅ **Validação Individual**: Cada KPI valida sua própria permissão
- ✅ **Overlay de Negação**: Exibe mensagem quando usuário não tem acesso
- ✅ **Skeleton Realista**: Mantém estrutura visual durante negação
- ✅ **Blur Effect**: Efeito de desfoque no conteúdo protegido
- ✅ **Carrossel Responsivo**: Navegação suave com drag & swipe
- ✅ **Grid ou Carrossel**: Alterna automaticamente baseado no número de cards
- ✅ **Loading States**: Skeleton durante carregamento

## 🏗️ Arquitetura

### Componente 1: ProtectedKPICard (Card Individual)

```tsx
<ProtectedKPICard
  id="unique-id"
  title="KPI Title"
  value={123}
  icon={IconComponent}
  subtitle="Description"
  trend={{ value: 12.5, isPositive: true }}
  requiredPermission={PermissionResolverName.PermissionName}
/>
```

### Componente 2: ProtectedKPICarousel (Carrossel) ⭐ NOVO

```tsx
<ProtectedKPICarousel
  data={kpiCardsData}
  showCarousel={true}
  minCardsForCarousel={4}
  isLoading={false}
  skeletonCount={6}
/>
```

### Props - ProtectedKPICard

| Prop | Tipo | Descrição | Obrigatório |
|------|------|-----------|-------------|
| `id` | `string` | Identificador único do KPI | ✅ |
| `title` | `string` | Título do KPI | ✅ |
| `value` | `string \| number \| ReactNode` | Valor principal do KPI | ✅ |
| `icon` | `LucideIcon` | Ícone do KPI | ✅ |
| `subtitle` | `string` | Descrição adicional | ❌ |
| `trend` | `{ value: number, isPositive: boolean }` | Tendência (crescimento/queda) | ❌ |
| `requiredPermission` | `PermissionResolverName` | Permissão necessária | ✅ |
| `className` | `string` | Classes CSS adicionais | ❌ |

### Props - ProtectedKPICarousel ⭐ NOVO

| Prop | Tipo | Descrição | Padrão | Obrigatório |
|------|------|-----------|--------|-------------|
| `data` | `ProtectedKPICardData[]` | Array de KPIs protegidos | - | ✅ |
| `showCarousel` | `boolean` | Habilitar carrossel | `true` | ❌ |
| `minCardsForCarousel` | `number` | Mínimo de cards para ativar carrossel | `4` | ❌ |
| `isLoading` | `boolean` | Estado de carregamento | `false` | ❌ |
| `skeletonCount` | `number` | Número de skeletons no loading | `6` | ❌ |
| `className` | `string` | Classes CSS adicionais | - | ❌ |

### Interface - ProtectedKPICardData

```typescript
interface ProtectedKPICardData {
  id: string
  title: string
  value: string | number | React.ReactNode
  icon: LucideIcon
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
  requiredPermission: PermissionResolverName
  className?: string
}
```

## 📋 KPIs do Dashboard

### 1. Total de Projetos
- **Permissão**: `PermissionResolverName.Projects`
- **Dados**: Total de projetos + crescimento anual
- **Ícone**: `FolderKanban`

### 2. Total de Usuários
- **Permissão**: `PermissionResolverName.Users`
- **Dados**: Total de usuários + crescimento anual
- **Ícone**: `Users`

### 3. Departamentos Institucionais
- **Permissão**: `PermissionResolverName.InstitutionalDepartmentsKpIs`
- **Dados**: Total de departamentos institucionais
- **Ícone**: `Building`

### 4. Departamentos de Igrejas
- **Permissão**: `PermissionResolverName.DepartmentKpIs`
- **Dados**: Total de departamentos de igrejas
- **Ícone**: `Layers`

### 5. Total de Igrejas
- **Permissão**: `PermissionResolverName.Churches`
- **Dados**: Total de igrejas ativas
- **Ícone**: `Church`

### 6. Total de Regiões
- **Permissão**: `PermissionResolverName.Regions`
- **Dados**: Total de regiões cadastradas
- **Ícone**: `Map`

## 🎨 Layout Visual

### Carrossel (Recomendado) ⭐
```tsx
<ProtectedKPICarousel data={kpiCardsData} />
```

**Comportamento**:
- **≥ 4 cards**: Ativa carrossel automático
- **< 4 cards**: Renderiza grid responsivo
- **Controles**: Setas prev/next quando há mais de 2 cards
- **Drag**: Suporte a arrastar e deslizar

### Grid Manual (Alternativa)
```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
  {kpiCardsData.map(kpi => (
    <ProtectedKPICard key={kpi.id} {...kpi} />
  ))}
</div>
```

### Breakpoints Responsivos (Carrossel)

| Tela | Colunas Visíveis | Cards por Slide |
|------|------------------|-----------------|
| Mobile (`< 640px`) | 1 coluna | 1 card |
| Tablet (`≥ 640px`) | 2 colunas | 2 cards |
| Desktop (`≥ 1024px`) | 3 colunas | 3 cards |
| Large (`≥ 1280px`) | 6 colunas | 6 cards |

### Breakpoints Responsivos (Grid Manual)

| Tela | Colunas | Exemplo |
|------|---------|---------|
| Mobile (`< 768px`) | 1 coluna | Stacked |
| Tablet (`≥ 768px`) | 2 colunas | Side by side |
| Desktop (`≥ 1024px`) | 3 colunas | Grid 3x2 |
| Large (`≥ 1280px`) | 6 colunas | Single row |

## 🔒 Sistema de Permissões

### Permissões Disponíveis

```typescript
// Estrutura
PermissionResolverName.NomePermissao

// Exemplos
PermissionResolverName.Projects         // Projetos
PermissionResolverName.Users            // Usuários
PermissionResolverName.Churches         // Igrejas
PermissionResolverName.Regions          // Regiões
PermissionResolverName.DepartmentKpIs   // Departamentos (igreja)
PermissionResolverName.InstitutionalDepartmentsKpIs // Departamentos (instituição)
```

### Fluxo de Validação

```
1. Renderizar <ProtectedKPICard>
2. <WithPermission> verifica permissão do usuário
3. SE tem permissão → Mostrar KPI real
4. SE NÃO tem → Mostrar PermissionDeniedOverlay
   - Skeleton com blur effect
   - Mensagem de acesso negado
   - Ícone de bloqueio
```

## 🧩 Estrutura de Arquivos

```
components/shared/
├── protected-kpi-card.tsx          # ⭐ Card individual protegido
├── protected-kpi-carousel.tsx      # ⭐ Carrossel de cards protegidos (NOVO)
├── permission-denied-overlay.tsx   # Overlay de negação
└── kpi-cards-carousel.tsx          # KPICards (legado, sem proteção)

app/dashboard/
└── page.tsx                        # Implementação com ProtectedKPICarousel

hocs/
└── with-permission.tsx             # HOC WithPermission

lib/translations/
└── permissions.ts                  # Traduções (PT/EN/NL)
```

## 🚀 Como Usar

### Opção 1: Carrossel (Recomendado) ⭐

#### 1. Importar Componentes

```tsx
import { ProtectedKPICarousel, type ProtectedKPICardData } from "@/components/shared/protected-kpi-carousel"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { Users, FolderKanban, Church } from "lucide-react"
```

#### 2. Preparar Dados

```tsx
const kpiCardsData: ProtectedKPICardData[] = [
  {
    id: "total-users",
    title: "Total de Usuários",
    value: 1234,
    icon: Users,
    subtitle: "45 novos este ano",
    trend: { value: 12.5, isPositive: true },
    requiredPermission: PermissionResolverName.Users
  },
  {
    id: "total-projects",
    title: "Total de Projetos",
    value: 89,
    icon: FolderKanban,
    subtitle: "15 novos este mês",
    trend: { value: 8.3, isPositive: true },
    requiredPermission: PermissionResolverName.Projects
  },
  // ... mais KPIs
]
```

#### 3. Renderizar Carrossel

```tsx
<ProtectedKPICarousel
  data={kpiCardsData}
  showCarousel={true}
  minCardsForCarousel={4}
  isLoading={false}
  skeletonCount={6}
/>
```

### Opção 2: Cards Individuais (Grid Manual)

#### 1. Importar o Componente

```tsx
import { ProtectedKPICard } from "@/components/shared/protected-kpi-card"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { Users } from "lucide-react"
```

#### 2. Renderizar no Grid

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
  <ProtectedKPICard
    id="total-users"
    title="Total de Usuários"
    value={1234}
    icon={Users}
    subtitle="45 novos este ano"
    trend={{ value: 12.5, isPositive: true }}
    requiredPermission={PermissionResolverName.Users}
  />
  
  {/* Mais KPIs... */}
</div>
```

Para mensagens customizadas, use diretamente o `PermissionDeniedOverlay`:

```tsx
<WithPermission 
  requiredPermissions={[PermissionResolverName.CustomPermission]}
  fallback={
    <PermissionDeniedOverlay 
      height="160px"
      customMessage={{
        title: "Acesso Restrito",
        description: "Entre em contato com o gerente"
      }}
    >
      {yourSkeleton}
    </PermissionDeniedOverlay>
  }
>
  <YourContent />
</WithPermission>
```

## 📊 Exemplo Completo (Dashboard)

```tsx
export default function DashboardPage() {
  const kpis = {
    totalProjects: 42,
    totalUsers: 156,
    totalChurches: 23,
    projectGrowthRate: 15.2,
    userGrowthRate: 8.5,
    // ... outros KPIs
  }

  const kpiCardsData: ProtectedKPICardData[] = [
    {
      id: "total-projects",
      title: "Total Projects",
      value: kpis.totalProjects,
      icon: FolderKanban,
      subtitle: "12 new this year",
      trend: { value: kpis.projectGrowthRate, isPositive: true },
      requiredPermission: PermissionResolverName.Projects
    },
    {
      id: "total-users",
      title: "Total Users",
      value: kpis.totalUsers,
      icon: Users,
      subtitle: "45 new this year",
      trend: { value: kpis.userGrowthRate, isPositive: true },
      requiredPermission: PermissionResolverName.Users
    },
    // ... mais 4 KPIs
  ]

  return (
    <div>
      <SectionHeader 
        title="System Overview"
        description="Key performance indicators"
      />

      {/* Carrossel de KPIs Protegidos */}
      <ProtectedKPICarousel
        data={kpiCardsData}
        showCarousel={true}
        minCardsForCarousel={4}
        isLoading={false}
        skeletonCount={6}
      />
    </div>
  )
}
```

## 🎨 Estados Visuais

### Estado Normal (Com Permissão)
- Card completo com dados reais
- Ícone colorido
- Valor principal grande (text-2xl)
- Subtitle com informações adicionais
- Trend indicator (↗️ verde / ↘️ vermelho)

### Estado de Negação (Sem Permissão)
- Skeleton com blur effect (blur-sm)
- Mensagem centralizada sobre o blur
- Ícone `EyeOff` (olho fechado)
- Texto: "Access Denied" / "Acesso Negado"
- Descrição: "Please request permission..." / "Solicite permissão..."

## 🌍 Internacionalização

### Traduções Automáticas
O componente usa `useTranslation()` para mensagens de acesso negado:

```typescript
// PT
t('permissions.access_denied') → "Acesso Negado"
t('permissions.request_access') → "Solicite permissão ao administrador..."

// EN
t('permissions.access_denied') → "Access Denied"
t('permissions.request_access') → "Please request permission from administrator..."

// NL
t('permissions.access_denied') → "Toegang Geweigerd"
t('permissions.request_access') → "Vraag toestemming aan bij beheerder..."
```

## ⚡ Performance

### Otimizações
- **Lazy rendering**: Apenas KPIs visíveis são renderizados primeiro (carrossel)
- **useMemo**: Cálculos de KPIs memoizados
- **Static skeleton**: Skeleton é pré-renderizado, não recalculado
- **Drag-free**: Carrossel com `dragFree: true` para navegação fluida

### Decisão: Carrossel vs Grid?

**Use Carrossel quando**:
- ✅ 4 ou mais KPIs
- ✅ Quer navegação fluida (drag/swipe)
- ✅ Espaço horizontal limitado
- ✅ Mobile-first (melhor UX em telas pequenas)

**Use Grid quando**:
- ✅ Menos de 4 KPIs
- ✅ Quer visão completa de todos os cards
- ✅ Desktop-only
- ✅ Não precisa de navegação

### Configuração Recomendada

```tsx
// Carrossel para 4+ cards, grid para menos
<ProtectedKPICarousel
  data={kpiCardsData}
  showCarousel={true}           // Habilitado
  minCardsForCarousel={4}        // Ativa com 4+ cards
  isLoading={isLoadingData}
  skeletonCount={6}              // Mesmo número de KPIs
/>
```

### Melhores Práticas
```tsx
// ✅ BOM: Usar useMemo para KPIs
const kpis = useMemo(() => ({
  totalProjects: calculateProjects(),
  totalUsers: calculateUsers(),
}), [dependencies])

// ✅ BOM: Dados tipados
const kpiCardsData: ProtectedKPICardData[] = [...]

// ❌ RUIM: Calcular toda vez
const kpis = {
  totalProjects: calculateProjects(), // Recalcula sempre!
  totalUsers: calculateUsers(),
}

// ❌ RUIM: Sem tipagem
const kpiCardsData = [...] // Type inference pode falhar
```

## 🛠️ Troubleshooting

### Problema: KPI não aparece
**Solução**: Verifique se a permissão existe no enum `PermissionResolverName`

### Problema: Carrossel não ativa
**Solução**: 
- Verifique se `showCarousel={true}`
- Confirme que tem 4+ cards (ou ajuste `minCardsForCarousel`)
- Verifique se `data.length >= minCardsForCarousel`

### Problema: Mensagem em inglês mesmo em PT
**Solução**: Verifique se `permissions.ts` foi adicionado ao i18n em `lib/i18n.ts`

### Problema: Skeleton diferente do card real
**Solução**: Ajuste a altura (`height`) no `PermissionDeniedOverlay` para 160px

### Problema: Cards muito pequenos/grandes no carrossel
**Solução**: O carrossel ajusta automaticamente. Verifique breakpoints:
- Mobile: 1 card visível
- Tablet: 2 cards visíveis
- Desktop: 3 cards visíveis
- Large: até 6 cards visíveis

### Problema: Controles do carrossel não aparecem
**Solução**: Controles aparecem apenas com 3+ cards. Para 1-2 cards, usa grid automático.

### Problema: TypeScript error no `data` prop
**Solução**: Use a interface `ProtectedKPICardData[]`:
```tsx
import { type ProtectedKPICardData } from "@/components/shared/protected-kpi-carousel"

const data: ProtectedKPICardData[] = [...]
```

## 📚 Referências

- **Componentes Principais**:
  - [`/components/shared/protected-kpi-carousel.tsx`](../components/shared/protected-kpi-carousel.tsx) - ⭐ Carrossel de KPIs protegidos (NOVO)
  - [`/components/shared/protected-kpi-card.tsx`](../components/shared/protected-kpi-card.tsx) - Card individual protegido
  - [`/components/shared/permission-denied-overlay.tsx`](../components/shared/permission-denied-overlay.tsx) - Overlay de negação
  - [`/hocs/with-permission.tsx`](../hocs/with-permission.tsx) - HOC de validação
  
- **UI Base**:
  - [`/components/ui/carousel.tsx`](../components/ui/carousel.tsx) - Componente de carrossel base
  - [`/components/ui/card.tsx`](../components/ui/card.tsx) - Card base
  - [`/components/ui/skeleton.tsx`](../components/ui/skeleton.tsx) - Skeleton loader
  
- **Traduções**:
  - [`/lib/translations/permissions.ts`](../lib/translations/permissions.ts) - Mensagens de permissão
  
- **Tipos**:
  - [`/types/graphql-global-types.ts`](../types/graphql-global-types.ts) - Enum `PermissionResolverName`

## ✅ Checklist de Implementação

### Usando Carrossel (Recomendado)
- [ ] Importar `ProtectedKPICarousel` e type `ProtectedKPICardData`
- [ ] Importar `PermissionResolverName`
- [ ] Importar ícones do `lucide-react`
- [ ] Criar array `kpiCardsData: ProtectedKPICardData[]`
- [ ] Para cada KPI no array:
  - [ ] Definir `id` único
  - [ ] Configurar `title`, `value`, `icon`
  - [ ] Adicionar `subtitle` (opcional)
  - [ ] Configurar `trend` se tiver dados de crescimento
  - [ ] **Escolher permissão correta** do `PermissionResolverName`
- [ ] Renderizar `<ProtectedKPICarousel data={kpiCardsData} />`
- [ ] Configurar props opcionais:
  - [ ] `showCarousel={true}` (ativar carrossel)
  - [ ] `minCardsForCarousel={4}` (mínimo para carrossel)
  - [ ] `isLoading={isLoadingData}` (estado de loading)
  - [ ] `skeletonCount={6}` (número de skeletons)
- [ ] Testar com usuário SEM permissão (deve mostrar overlay)
- [ ] Testar com usuário COM permissão (deve mostrar dados)
- [ ] Verificar navegação do carrossel (arrastar/clicar setas)
- [ ] Validar responsividade em diferentes telas
- [ ] Verificar traduções (PT/EN/NL)

### Usando Grid Manual
- [ ] Importar `ProtectedKPICard` e `PermissionResolverName`
- [ ] Criar grid container com classes responsivas
- [ ] Para cada KPI:
  - [ ] Definir `id` único
  - [ ] Configurar `title`, `value`, `icon`
  - [ ] Adicionar `subtitle` (opcional)
  - [ ] Configurar `trend` se tiver dados de crescimento
  - [ ] **Escolher permissão correta** do `PermissionResolverName`
- [ ] Testar com usuário SEM permissão (deve mostrar overlay)
- [ ] Testar com usuário COM permissão (deve mostrar dados)
- [ ] Verificar layout responsivo em diferentes telas
- [ ] Validar traduções (PT/EN/NL)

---

**Última Atualização**: Janeiro 2026  
**Versão**: 1.0.0  
**Autor**: Adventist GROEI Platform
