# 🔐 Privacy Roles - Sistema Dinâmico e Configurável

## 📋 Overview

Sistema completo e dinâmico para gerenciar roles e permissões de privacy, integrado com o AuthContext existente da aplicação.

---

## ✨ Características

### 1. **Integração Automática com AuthContext**
- ✅ Lê `key_code` dos roles do usuário automaticamente
- ✅ Suporta múltiplos roles (usa o de maior prioridade)
- ✅ Fallback para 'admin' em desenvolvimento
- ✅ Debug logs automáticos

### 2. **Suporte para DEV e ADMIN**
- ✅ **DEV** (Developer) - Acesso total para desenvolvimento
- ✅ **ADMIN** (Administrator) - Acesso total de administração
- ✅ Sistema de prioridades: DEV > ADMIN > FINANCE > DEPT > USER > GUEST

### 3. **Configuração Simples**
- ✅ Presets prontos para uso
- ✅ Configuração customizável
- ✅ Uma linha de código para configurar

---

## 🎯 Roles Disponíveis

### Hierarquia de Roles (Maior → Menor Acesso)

```
1. DEV (Developer)           → admin        [ALL ACCESS]
   ↓
2. ADMIN (Administrator)     → admin        [ALL ACCESS]
   ↓
3. FINANCE_MANAGER           → finance      [FINANCIAL DATA]
   ↓
4. DEPARTMENT_HEAD           → dept_head    [DEPARTMENT DATA]
   ↓
5. USER                      → user         [PUBLIC DATA]
   ↓
6. GUEST                     → guest        [NO ACCESS]
```

### Detalhamento

| Privacy Role | Key Code Examples | Access Levels |
|--------------|-------------------|---------------|
| **admin** | DEV, DEVELOPER, ADMIN, SUPER_ADMIN | public, internal, confidential, restricted |
| **finance_manager** | FINANCE_MANAGER, FINANCE_ADMIN, CFO | public, internal, confidential |
| **department_head** | DEPARTMENT_MANAGER, DEPARTMENT_HEAD | public, internal |
| **user** | EMPLOYEE, USER, MEMBER, STAFF | public |
| **guest** | VIEWER, GUEST, READ_ONLY | (none) |

---

## 🚀 Como Usar

### Opção 1: Usando Presets (Recomendado)

```tsx
import { createPrivacyConfig } from '@/config/privacy-roles.config'

// ✅ FINANCIAL_DATA: DEV, ADMIN, FINANCE_MANAGER
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-financial-chart',
  'FINANCIAL_DATA'
)

// ✅ ADMIN_ONLY: Apenas DEV e ADMIN
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-admin-panel',
  'ADMIN_ONLY'
)

// ✅ DEPARTMENT_DATA: DEV, ADMIN, FINANCE_MANAGER, DEPARTMENT_HEAD
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-department-report',
  'DEPARTMENT_DATA'
)

// ✅ PUBLIC_DATA: Todos usuários autenticados
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-public-info',
  'PUBLIC_DATA'
)
```

### Opção 2: Configuração Customizada

```tsx
import { createPrivacyConfig } from '@/config/privacy-roles.config'

// Apenas DEV e ADMIN
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-component',
  'confidential',
  ['DEV', 'ADMIN']
)

// Apenas FINANCE roles
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-component',
  'confidential',
  ['FINANCE_MANAGER', 'FINANCE_ADMIN', 'CFO']
)

// Roles específicos
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-component',
  'internal',
  ['DEV', 'ADMIN', 'DEPARTMENT_HEAD']
)
```

### Opção 3: Configuração Manual Completa

```tsx
const PRIVACY_CONFIG = {
  id: 'my-component',
  level: 'confidential' as const,
  allowedRoles: ['DEV', 'ADMIN', 'FINANCE_MANAGER'],
  persistent: true,
  blurIntensity: 'high' as const,
  autoHideDelay: 30000, // 30 segundos
}
```

---

## 📦 Presets Disponíveis

### `ADMIN_ONLY`
```tsx
createPrivacyConfig('my-id', 'ADMIN_ONLY')

// Equivalente a:
{
  level: 'restricted',
  allowedRoles: ['DEV', 'DEVELOPER', 'ADMIN', 'SUPER_ADMIN']
}
```

**Uso**: Painéis administrativos, configurações de sistema

### `FINANCIAL_DATA`
```tsx
createPrivacyConfig('my-id', 'FINANCIAL_DATA')

// Equivalente a:
{
  level: 'confidential',
  allowedRoles: ['DEV', 'ADMIN', 'FINANCE_MANAGER', 'FINANCE_ADMIN', 'CFO']
}
```

**Uso**: Gráficos financeiros, orçamentos, relatórios de gastos

### `DEPARTMENT_DATA`
```tsx
createPrivacyConfig('my-id', 'DEPARTMENT_DATA')

// Equivalente a:
{
  level: 'internal',
  allowedRoles: ['DEV', 'ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_HEAD', 'MANAGER']
}
```

**Uso**: Dados departamentais, relatórios internos

### `PUBLIC_DATA`
```tsx
createPrivacyConfig('my-id', 'PUBLIC_DATA')

// Equivalente a:
{
  level: 'public',
  allowedRoles: ['DEV', 'ADMIN', 'FINANCE_MANAGER', 'DEPARTMENT_HEAD', 'USER']
}
```

**Uso**: Informações públicas, dashboards gerais

---

## 💡 Exemplos Práticos

### Exemplo 1: Budget Chart (Financial)

```tsx
import { createPrivacyConfig } from '@/config/privacy-roles.config'
import { useComponentPrivacy } from '@/contexts/privacy-context'
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'

const PRIVACY_CONFIG = createPrivacyConfig(
  'budget-chart',
  'FINANCIAL_DATA' // DEV, ADMIN, FINANCE_MANAGER
)

export function BudgetChart() {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <InlinePrivacyToggle config={PRIVACY_CONFIG} />
      </CardHeader>
      <CardContent>
        {isHidden ? <Skeleton /> : <Chart />}
      </CardContent>
    </Card>
  )
}
```

### Exemplo 2: Admin Panel (Admin Only)

```tsx
const PRIVACY_CONFIG = createPrivacyConfig(
  'admin-panel',
  'ADMIN_ONLY' // Apenas DEV e ADMIN
)

export function AdminPanel() {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Configuration</CardTitle>
        <InlinePrivacyToggle config={PRIVACY_CONFIG} />
      </CardHeader>
      <CardContent>
        {isHidden ? <Skeleton /> : <AdminSettings />}
      </CardContent>
    </Card>
  )
}
```

### Exemplo 3: Department Report (Custom Roles)

```tsx
const PRIVACY_CONFIG = createPrivacyConfig(
  'dept-report',
  'internal',
  ['DEV', 'ADMIN', 'DEPARTMENT_HEAD'] // Custom roles
)

export function DepartmentReport() {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Performance</CardTitle>
        <InlinePrivacyToggle config={PRIVACY_CONFIG} />
      </CardHeader>
      <CardContent>
        {isHidden ? <Skeleton /> : <Report />}
      </CardContent>
    </Card>
  )
}
```

---

## 🔧 Adicionar Novos Roles

### Passo 1: Editar `config/privacy-roles.config.ts`

```typescript
export const PRIVACY_ROLES = {
  // ... roles existentes ...
  
  // Novo role customizado
  PROJECT_MANAGER: {
    key: 'project_manager' as const,
    label: 'Project Manager',
    description: 'Access to project and internal data',
    authRoles: ['PROJECT_MANAGER', 'PROJ_MANAGER', 'PM'],
    accessLevels: ['public', 'internal'] as PrivacyLevel[]
  }
}
```

### Passo 2: Adicionar ao Grupo (Opcional)

```typescript
export const PRIVACY_ROLE_GROUPS = {
  // ... grupos existentes ...
  
  // Novo grupo
  PROJECT_ROLES: [
    ...PRIVACY_ROLES.DEV.authRoles,
    ...PRIVACY_ROLES.ADMIN.authRoles,
    ...PRIVACY_ROLES.PROJECT_MANAGER.authRoles
  ] as string[]
}
```

### Passo 3: Criar Preset (Opcional)

```typescript
export const PRIVACY_PRESETS = {
  // ... presets existentes ...
  
  // Novo preset
  PROJECT_DATA: {
    level: 'internal' as PrivacyLevel,
    allowedRoles: [...PRIVACY_ROLE_GROUPS.PROJECT_ROLES] as string[]
  }
}
```

### Passo 4: Usar o Novo Role

```tsx
// Usando o novo preset
const config = createPrivacyConfig('my-project', 'PROJECT_DATA')

// Ou diretamente
const config = createPrivacyConfig(
  'my-project',
  'internal',
  ['DEV', 'ADMIN', 'PROJECT_MANAGER']
)
```

---

## 🔍 Debug e Troubleshooting

### Ver Role Atual do Usuário

```javascript
// No console do navegador
window.__PRIVACY_DEBUG__
```

### Logs Automáticos

O sistema loga automaticamente:

```
🔐 PrivacyProviderWithAuth - Auth Data
  User: John Doe
  User Roles: [{name: "Admin", key_code: "ADMIN"}]
  Roles (key_codes): ["ADMIN"]

🔐 Privacy Role Mapped:
  from: ["ADMIN"]
  to: "admin"

✅ Role matched: ADMIN → admin (priority 2)
```

### Verificar se Usuário Tem Acesso

```tsx
import { useHasPrivacyRole } from '@/components/shared/privacy-provider-with-auth'

function MyComponent() {
  const canAccessFinancial = useHasPrivacyRole('finance_manager')
  const isAdmin = useHasPrivacyRole('admin')
  
  console.log('Can access financial:', canAccessFinancial)
  console.log('Is admin:', isAdmin)
}
```

---

## 📊 Comparação: Antes vs Depois

### Antes (Manual)

```tsx
// ❌ Configuração manual, difícil de manter
const PRIVACY_CONFIG = {
  id: 'my-chart',
  level: 'confidential' as const,
  allowedRoles: ['admin', 'finance_manager', 'department_head'],
  persistent: true,
  blurIntensity: 'medium' as const,
}

// ❌ Sem suporte para DEV
// ❌ Precisa lembrar todos os roles
// ❌ Não valida key_codes do AuthContext
```

### Depois (Dinâmico)

```tsx
// ✅ Uma linha, preset pronto
const PRIVACY_CONFIG = createPrivacyConfig('my-chart', 'FINANCIAL_DATA')

// ✅ Suporte automático para DEV
// ✅ Integração com AuthContext (key_code)
// ✅ Validação automática de roles
// ✅ Fácil de customizar
```

---

## ✅ Checklist de Implementação

### Para Novos Componentes

- [ ] Importar `createPrivacyConfig`
- [ ] Escolher preset apropriado ou criar custom
- [ ] Criar `PRIVACY_CONFIG` com `createPrivacyConfig()`
- [ ] Adicionar `useComponentPrivacy(PRIVACY_CONFIG)`
- [ ] Adicionar `<InlinePrivacyToggle config={PRIVACY_CONFIG} />`
- [ ] Implementar `{isHidden ? <Skeleton /> : <Content />}`
- [ ] Testar com diferentes roles

### Para Componentes Existentes

- [ ] Substituir config manual por `createPrivacyConfig()`
- [ ] Verificar se roles estão corretos (usar key_codes)
- [ ] Adicionar DEV ao allowedRoles se necessário
- [ ] Testar funcionalidade

---

## 🎯 Quick Reference

### Uso Mais Comum

```tsx
import { createPrivacyConfig } from '@/config/privacy-roles.config'
import { useComponentPrivacy } from '@/contexts/privacy-context'
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'

// 1. Criar config (uma linha!)
const PRIVACY_CONFIG = createPrivacyConfig('my-id', 'FINANCIAL_DATA')

// 2. Usar hook
const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

// 3. Adicionar toggle
<InlinePrivacyToggle config={PRIVACY_CONFIG} />

// 4. Conditional render
{isHidden ? <Skeleton /> : <MyContent />}
```

### Presets Rápidos

```tsx
'ADMIN_ONLY'      → DEV, ADMIN
'FINANCIAL_DATA'  → DEV, ADMIN, FINANCE_MANAGER
'DEPARTMENT_DATA' → DEV, ADMIN, FINANCE_MANAGER, DEPARTMENT_HEAD
'PUBLIC_DATA'     → Todos autenticados
```

### Custom Roles Rápido

```tsx
// Apenas DEV
createPrivacyConfig('id', 'restricted', ['DEV'])

// DEV + ADMIN
createPrivacyConfig('id', 'restricted', ['DEV', 'ADMIN'])

// DEV + ADMIN + FINANCE
createPrivacyConfig('id', 'confidential', ['DEV', 'ADMIN', 'FINANCE_MANAGER'])
```

---

## 📚 Arquivos Relacionados

- **Configuração**: `config/privacy-roles.config.ts`
- **Provider**: `components/shared/privacy-provider-with-auth.tsx`
- **Context**: `contexts/privacy-context.tsx`
- **Exemplo**: `components/charts/annual-budget/department-spending-chart.tsx`

---

**Última Atualização**: 22 de outubro de 2025  
**Versão**: 3.0.0 - Dynamic Role System with DEV Support
