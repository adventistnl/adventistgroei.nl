# 🔓 Privacy System: Default Visible Behavior

## 📋 Overview

Sistema de privacy atualizado para garantir que **componentes sejam visíveis por padrão**, permitindo que usuários com permissão possam **escolher esconder** clicando no botão toggle.

---

## 🎯 Comportamento Atualizado

### Antes (Antigo)
```
❌ Componente podia começar escondido (dependendo de defaultHidden)
❌ Botão só aparecia se canToggle = true
❌ Usuário tinha que "destrancar" para ver conteúdo
```

### Agora (Novo)
```
✅ Componente SEMPRE começa VISÍVEL por padrão
✅ Botão SEMPRE aparece para usuários com permissão
✅ Usuário pode ESCOLHER esconder clicando no botão
✅ Estado é persistido no localStorage
```

---

## 🔧 Mudanças Implementadas

### 1. **Config Helper - `createPrivacyConfig()`**

**Arquivo**: `config/privacy-roles.config.ts`

```typescript
export function createPrivacyConfig(
  id: string,
  preset: keyof typeof PRIVACY_PRESETS | PrivacyLevel,
  customRoles?: string[]
) {
  return {
    id,
    level: presetConfig.level,
    allowedRoles: customRoles || presetConfig.allowedRoles,
    defaultHidden: false, // 🎯 COMPONENTE VISÍVEL POR PADRÃO
    persistent: true,
    blurIntensity: 'medium' as const
  }
}
```

**O que mudou:**
- ✅ `defaultHidden: false` adicionado explicitamente
- ✅ Componente sempre começa visível
- ✅ Usuário controla visibilidade manualmente

---

### 2. **Privacy Context - Registro de Componentes**

**Arquivo**: `contexts/privacy-context.tsx`

```typescript
const registerComponent = useCallback((config: PrivacyConfig) => {
  setRegisteredComponents(prev => {
    const newMap = new Map(prev)
    newMap.set(config.id, config)
    return newMap
  })

  // 🎯 NOVO: Componente VISÍVEL por padrão (defaultHidden = false)
  // Só esconde se defaultHidden for explicitamente true
  // Ou se já existe estado salvo no localStorage
  if (privacyState[config.id] === undefined) {
    const shouldHide = config.defaultHidden === true // Apenas esconde se explicitamente true
    setPrivacyState(prev => ({
      ...prev,
      [config.id]: shouldHide // false by default = visível
    }))
  }
}, [privacyState])
```

**O que mudou:**
- ✅ Lógica invertida: padrão é `false` (visível)
- ✅ Só esconde se `defaultHidden === true` explicitamente
- ✅ Respeita estado salvo no localStorage (se existir)

---

### 3. **Privacy Wrapper - Visibilidade do Botão**

**Arquivo**: `components/shared/privacy-wrapper.tsx`

```typescript
export function InlinePrivacyToggle({ config, className }: InlinePrivacyToggleProps) {
  const privacyContext = usePrivacy()
  const { isHidden, togglePrivacy, canToggle } = useComponentPrivacy(config)

  // 🎯 NOVO COMPORTAMENTO: Botão sempre visível para roles permitidas
  const showButton = canToggle // Mostra se tiver permissão
  
  // 🚨 DEBUG: Se não mostrar, log o motivo
  if (!showButton) {
    console.warn('⚠️ InlinePrivacyToggle NOT RENDERING')
    console.warn('🔒 Reason: User role not in allowedRoles')
    console.warn('💡 Check user permissions and allowedRoles')
    console.warn('📋 Config:', config)
    console.warn('👤 User Role:', privacyContext.userRole)
    console.warn('✅ Allowed Roles:', config.allowedRoles)
    return null
  }

  // ... resto do componente
}
```

**O que mudou:**
- ✅ Botão aparece se `canToggle = true` (usuário tem permissão)
- ✅ Debug logs melhorados mostrando role e allowedRoles
- ✅ Mensagens claras se botão não renderizar

---

## 🚀 Como Usar

### Exemplo Básico

```tsx
import { createPrivacyConfig } from '@/config/privacy-roles.config'
import { useComponentPrivacy } from '@/contexts/privacy-context'
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'

// 1. Criar config (componente VISÍVEL por padrão)
const PRIVACY_CONFIG = createPrivacyConfig(
  'my-chart',
  'FINANCIAL_DATA' // DEV, ADMIN, FINANCE_MANAGER podem ver e controlar
)

export function MyChart({ data }) {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Chart</CardTitle>
        
        {/* Botão aparece para usuários com permissão */}
        <InlinePrivacyToggle config={PRIVACY_CONFIG} />
      </CardHeader>
      
      <CardContent>
        {/* Componente começa VISÍVEL, usuário pode esconder */}
        {isHidden ? <Skeleton /> : <ChartComponent data={data} />}
      </CardContent>
    </Card>
  )
}
```

---

## 🔍 Fluxo de Comportamento

### Primeira Vez (Sem localStorage)

```
1. Usuário acessa a página
   ↓
2. Componente registrado com defaultHidden: false
   ↓
3. Componente renderiza VISÍVEL
   ↓
4. Botão aparece (se usuário tiver permissão)
   ↓
5. Usuário pode clicar para ESCONDER
   ↓
6. Estado salvo no localStorage
```

### Visitas Subsequentes (Com localStorage)

```
1. Usuário acessa a página
   ↓
2. Sistema lê localStorage
   ↓
3. Se estava escondido → renderiza escondido
4. Se estava visível → renderiza visível
   ↓
5. Botão aparece (se usuário tiver permissão)
   ↓
6. Usuário pode alternar estado
```

---

## 🎯 Benefícios

### Para Usuários
- ✅ **Sem surpresas**: Vê o conteúdo imediatamente
- ✅ **Controle total**: Pode esconder se preferir
- ✅ **Estado persistente**: Preferência salva entre sessões
- ✅ **Visível**: Botão sempre disponível (se tiver permissão)

### Para Desenvolvedores
- ✅ **Simples**: `createPrivacyConfig()` já configura tudo
- ✅ **Previsível**: Componente sempre começa visível
- ✅ **Flexível**: Pode sobrescrever com `defaultHidden: true` se necessário
- ✅ **Debug fácil**: Logs claros se botão não aparecer

---

## 🔧 Casos de Uso

### Caso 1: Dados Financeiros (Padrão)

```tsx
// Componente VISÍVEL, usuário PODE esconder
const PRIVACY_CONFIG = createPrivacyConfig(
  'financial-report',
  'FINANCIAL_DATA' // DEV, ADMIN, FINANCE podem controlar
)

// Resultado:
// ✅ Relatório aparece imediatamente
// ✅ Botão disponível para esconder
// ✅ Usuário decide se quer privacidade
```

### Caso 2: Dados Sensíveis (Customizado)

```tsx
// Se quiser começar ESCONDIDO (caso raro)
const PRIVACY_CONFIG = {
  id: 'sensitive-data',
  level: 'restricted',
  allowedRoles: ['DEV', 'ADMIN'],
  defaultHidden: true, // 🔒 Começa ESCONDIDO
  persistent: true
}

// Resultado:
// 🔒 Dados aparecem borrados
// ✅ Usuário precisa clicar para revelar
// ✅ Útil para dados extra sensíveis
```

### Caso 3: Dados Públicos

```tsx
// Dados públicos mas com opção de esconder
const PRIVACY_CONFIG = createPrivacyConfig(
  'public-dashboard',
  'PUBLIC_DATA' // Todos usuários autenticados
)

// Resultado:
// ✅ Dashboard visível para todos
// ✅ Todos podem esconder se quiserem
// ✅ Útil para preferências de visualização
```

---

## 🐛 Debug

### Botão Não Aparece?

```javascript
// No console do navegador:
window.__PRIVACY_DEBUG__

// Verifique:
// 1. User role está em allowedRoles?
// 2. canToggle é true?
// 3. Component foi registrado?
```

### Logs Automáticos

Quando botão não renderiza, você verá:

```
⚠️ InlinePrivacyToggle NOT RENDERING
🔒 Reason: User role not in allowedRoles
💡 Check user permissions and allowedRoles
📋 Config: {...}
👤 User Role: "user"
✅ Allowed Roles: ["DEV", "ADMIN", "FINANCE_MANAGER"]
```

**Solução**: Adicionar role do usuário ao `allowedRoles` ou usar preset mais permissivo

---

## ✅ Checklist de Migração

Para componentes existentes:

- [ ] Verificar se usa `createPrivacyConfig()` (já tem defaultHidden: false)
- [ ] Se usa config manual, adicionar `defaultHidden: false`
- [ ] Testar: componente aparece visível na primeira carga?
- [ ] Testar: botão aparece para usuários com permissão?
- [ ] Testar: clicar esconde o componente?
- [ ] Testar: reload preserva estado (localStorage)?

---

## 📊 Comparação

### Antes vs Depois

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Estado Inicial** | Podia começar escondido | Sempre começa VISÍVEL |
| **Controle** | Sistema decide | Usuário decide |
| **Botão** | Aparece só se canToggle | Aparece sempre (se permissão) |
| **UX** | Usuário "destranca" | Usuário "esconde" se quiser |
| **localStorage** | Sim | Sim (mantido) |
| **Debug** | Básico | Logs detalhados |

---

## 🎯 Filosofia

### Design Principle

> **"Transparência por padrão, privacidade por escolha"**

- ✅ Usuários veem dados imediatamente
- ✅ Decidem se querem esconder
- ✅ Sistema respeita escolhas
- ✅ Controle nas mãos do usuário

---

## 📚 Arquivos Modificados

1. **`config/privacy-roles.config.ts`**
   - `createPrivacyConfig()` agora retorna `defaultHidden: false`

2. **`contexts/privacy-context.tsx`**
   - `registerComponent()` agora usa lógica invertida
   - Componente visível por padrão a menos que `defaultHidden === true`

3. **`components/shared/privacy-wrapper.tsx`**
   - Import `usePrivacy` adicionado
   - Debug logs melhorados com userRole e allowedRoles

---

## 🚀 Próximos Passos

- ✅ Sistema pronto para uso
- ✅ Todos componentes com `createPrivacyConfig()` já funcionam corretamente
- ✅ Novos componentes seguem comportamento padrão automaticamente

**Sem ação necessária - Sistema já atualizado! 🎉**

---

**Última Atualização**: 22 de outubro de 2025  
**Versão**: 3.1.0 - Default Visible Behavior
