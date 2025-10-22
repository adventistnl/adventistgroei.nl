# Privacy Component Standards

## 📋 Overview

Este documento define os padrões para uso do sistema de privacy em componentes. Todos os componentes que utilizam o sistema de privacy devem seguir estas diretrizes para garantir consistência visual e experiência do usuário.

## ✅ Padrões Obrigatórios

### 1. Posicionamento do Botão de Toggle

**OBRIGATÓRIO**: O botão de toggle de privacy deve **sempre** estar posicionado no **canto superior direito** do componente.

```tsx
// ✅ CORRETO - Botão automático no top-right
<PrivacyWrapper config={PRIVACY_CONFIG}>
  <YourContent />
</PrivacyWrapper>

// ✅ CORRETO - InlinePrivacyToggle personalizado
<div className="relative">
  <div className="flex items-center justify-between">
    <h3>Título</h3>
    <InlinePrivacyToggle config={PRIVACY_CONFIG} />
  </div>
  {isHidden ? <Skeleton /> : <Content />}
</div>

// ❌ ERRADO - Não usar togglePosition
<PrivacyWrapper 
  config={PRIVACY_CONFIG}
  togglePosition="bottom-left"  // Deprecated!
>
  <YourContent />
</PrivacyWrapper>
```

### 2. Mensagem de Conteúdo Oculto

**OBRIGATÓRIO**: Quando o conteúdo estiver oculto, deve mostrar a seguinte mensagem centralizada:

```
Privacy Content
Contact admin to see more
```

Esta mensagem é **fixa** e **não pode ser customizada** via prop `hiddenMessage`. A prop está deprecated.

### 3. Visual de Conteúdo Oculto

**OBRIGATÓRIO**: O conteúdo oculto deve ter:

- ✅ **Skeleton Component**: Representação visual do layout do conteúdo
- ✅ **Blur Effect**: Aplicado sobre o skeleton (low/medium/high)
- ✅ **Overlay Translúcido**: Fundo branco semi-transparente (bg-white/30)
- ✅ **Modal de Mensagem**: Fundo escuro (bg-gray-900/90) com texto branco
- ✅ **Ícone EyeOff**: Junto ao título "Privacy Content"

### 4. Visual de Conteúdo Visível

**OBRIGATÓRIO**: Quando visível, o botão deve:

- ✅ Estar no canto superior direito
- ✅ Mostrar ícone `EyeOff` em azul (text-blue-600)
- ✅ Ter tooltip "Click to hide information"
- ✅ Ter fundo branco semi-transparente (bg-white/80)

## 🎨 Implementação Visual

### Estrutura de Layout

```
┌─────────────────────────────────────┐
│ Component Card                  [👁️]│  <- Toggle sempre top-right
│                                     │
│  ┌──────────────────────────────┐  │
│  │                              │  │
│  │   [Skeleton com Blur]        │  │
│  │                              │  │
│  │   ┌──────────────────────┐   │  │
│  │   │  🚫 Privacy Content  │   │  │  <- Mensagem centralizada
│  │   │ Contact admin to see │   │  │
│  │   │      more            │   │  │
│  │   └──────────────────────┘   │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

## 📝 Exemplos de Uso

### Exemplo 1: Uso Básico com PrivacyWrapper

```tsx
import { PrivacyWrapper } from '@/components/shared/privacy-wrapper'

const PRIVACY_CONFIG = {
  id: 'my-sensitive-chart',
  level: 'confidential' as const,
  persistent: true,
  blurIntensity: 'medium' as const,
}

export function MySensitiveChart() {
  return (
    <PrivacyWrapper config={PRIVACY_CONFIG}>
      <Card>
        <CardHeader>
          <CardTitle>Financial Data</CardTitle>
        </CardHeader>
        <CardContent>
          <MyChart data={data} />
        </CardContent>
      </Card>
    </PrivacyWrapper>
  )
}
```

### Exemplo 2: Uso com InlinePrivacyToggle (Controle Manual)

```tsx
import { InlinePrivacyToggle } from '@/components/shared/privacy-wrapper'
import { useComponentPrivacy } from '@/contexts/privacy-context'

const PRIVACY_CONFIG = {
  id: 'department-spending',
  level: 'confidential' as const,
  persistent: true,
}

export function DepartmentChart() {
  const { isHidden } = useComponentPrivacy(PRIVACY_CONFIG)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Department Spending</CardTitle>
            <CardDescription>Budget allocation</CardDescription>
          </div>
          
          {/* Toggle sempre no canto superior direito */}
          <InlinePrivacyToggle config={PRIVACY_CONFIG} className="ml-2" />
        </div>
      </CardHeader>
      <CardContent>
        {isHidden ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <MyChart data={data} />
        )}
      </CardContent>
    </Card>
  )
}
```

### Exemplo 3: Skeleton Customizado

```tsx
const CustomSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-64" />
    <Skeleton className="h-48 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-12 w-32" />
      <Skeleton className="h-12 w-32" />
    </div>
  </div>
)

export function MyComponent() {
  return (
    <PrivacyWrapper 
      config={PRIVACY_CONFIG}
      skeleton={<CustomSkeleton />}
    >
      <YourContent />
    </PrivacyWrapper>
  )
}
```

## 🚫 Props Deprecated

As seguintes props estão **deprecated** e não devem ser utilizadas:

### `hiddenMessage` (Deprecated)

```tsx
// ❌ ERRADO - Não usar
<PrivacyWrapper 
  config={PRIVACY_CONFIG}
  hiddenMessage="Custom message"  // Deprecated!
>
  <YourContent />
</PrivacyWrapper>

// ✅ CORRETO - Mensagem é sempre "Privacy Content"
<PrivacyWrapper config={PRIVACY_CONFIG}>
  <YourContent />
</PrivacyWrapper>
```

**Razão**: Mensagens customizadas causam inconsistência na experiência do usuário.

### `togglePosition` (Deprecated)

```tsx
// ❌ ERRADO - Não usar
<PrivacyWrapper 
  config={PRIVACY_CONFIG}
  togglePosition="bottom-left"  // Deprecated!
>
  <YourContent />
</PrivacyWrapper>

// ✅ CORRETO - Posição é sempre top-right
<PrivacyWrapper config={PRIVACY_CONFIG}>
  <YourContent />
</PrivacyWrapper>
```

**Razão**: Posicionamento consistente melhora usabilidade e previsibilidade.

## ✅ Checklist de Implementação

Ao implementar privacy em um componente, verifique:

- [ ] Botão de toggle está no canto superior direito
- [ ] Mensagem é "Privacy Content - Contact admin to see more"
- [ ] Skeleton está configurado (padrão ou customizado)
- [ ] Blur intensity está definida (low/medium/high)
- [ ] Privacy config tem ID único
- [ ] Privacy level está correto (public/internal/confidential/restricted)
- [ ] `persistent: true` se quiser salvar estado no localStorage
- [ ] Não está usando props deprecated (`hiddenMessage`, `togglePosition`)

## 🎯 Benefícios da Padronização

1. **Consistência Visual**: Todos os componentes com privacy têm o mesmo layout
2. **Usabilidade**: Usuários sabem onde encontrar o botão de toggle
3. **Manutenibilidade**: Código mais limpo e fácil de manter
4. **Acessibilidade**: Posicionamento previsível ajuda navegação por teclado
5. **Profissionalismo**: Mensagens claras e design polido

## 📚 Documentação Relacionada

- [PRIVACY_SYSTEM_README.md](./PRIVACY_SYSTEM_README.md) - Documentação completa do sistema
- [PRIVACY_MIGRATION_GUIDE.md](./PRIVACY_MIGRATION_GUIDE.md) - Guia de migração
- [PRIVACY_SETUP_COMPLETE.md](./PRIVACY_SETUP_COMPLETE.md) - Setup e configuração

## 🆘 Troubleshooting

### Botão não aparece no top-right

**Problema**: Botão aparece em posição incorreta ou não aparece.

**Solução**:
```tsx
// Certifique-se que o container pai tem position: relative
<Card className="relative">  {/* Adicione 'relative' */}
  <PrivacyWrapper config={PRIVACY_CONFIG}>
    <YourContent />
  </PrivacyWrapper>
</Card>
```

### Mensagem customizada não aparece

**Problema**: Prop `hiddenMessage` não funciona.

**Razão**: Esta prop está deprecated. A mensagem é sempre "Privacy Content - Contact admin to see more".

### Skeleton não tem blur

**Problema**: Skeleton aparece sem efeito de blur.

**Solução**:
```tsx
// Configure blurIntensity no config
const PRIVACY_CONFIG = {
  id: 'my-component',
  level: 'confidential' as const,
  blurIntensity: 'medium' as const,  // low | medium | high
}
```

---

**Última Atualização**: 22 de outubro de 2025  
**Versão do Sistema**: 1.1.0
