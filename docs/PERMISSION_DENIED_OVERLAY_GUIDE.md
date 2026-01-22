# PermissionDeniedOverlay - Componente Reutilizável

## 📋 Descrição

Componente reutilizável para mostrar conteúdo protegido por permissões. Aplica blur no skeleton e exibe mensagem centralizada solicitando acesso ao administrador.

## 🎯 Quando Usar

Use este componente como fallback do `WithPermission` quando um usuário não tem as permissões necessárias para visualizar um conteúdo.

## 📦 Localização

```
/components/shared/permission-denied-overlay.tsx
```

## ⚙️ Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `children` | `React.ReactNode` | - | Conteúdo que será borrado (skeleton) |
| `height` | `string` | `"300px"` | Altura do container |
| `blurIntensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Intensidade do blur |
| `customMessage` | `{ title?: string; description?: string }` | - | Mensagem customizada (opcional) |
| `className` | `string` | - | Classes CSS adicionais |

## 📖 Uso Básico

### Exemplo 1: Com WithPermission (Recomendado)

```tsx
import { WithPermission } from "@/hocs/with-permission"
import { PermissionDeniedOverlay } from "@/components/shared/permission-denied-overlay"
import { PermissionResolverName } from "@/types/graphql-global-types"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function ProtectedComponent() {
  return (
    <WithPermission
      requiredPermissions={[PermissionResolverName.AnnualBudgets]}
      fallback={
        <PermissionDeniedOverlay height="500px">
          {/* Skeleton que replica o componente original */}
          <Card className="h-[500px]">
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-96 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-[300px]" />
            </CardContent>
          </Card>
        </PermissionDeniedOverlay>
      }
    >
      {/* Seu componente protegido aqui */}
      <YourProtectedContent />
    </WithPermission>
  )
}
```

### Exemplo 2: Com Mensagem Customizada

```tsx
<PermissionDeniedOverlay 
  height="400px"
  blurIntensity="high"
  customMessage={{
    title: "Acesso Restrito - Gerência Financeira",
    description: "Entre em contato com seu gerente para solicitar acesso"
  }}
>
  <YourSkeleton />
</PermissionDeniedOverlay>
```

### Exemplo 3: Múltiplas Permissões

```tsx
<WithPermission
  requiredPermissions={[
    PermissionResolverName.AnnualBudgets,
    PermissionResolverName.ViewInstitutionBudget
  ]}
  partialPermissionCheck={false} // Requer TODAS as permissões
  fallback={
    <PermissionDeniedOverlay height="600px">
      <ComplexSkeleton />
    </PermissionDeniedOverlay>
  }
>
  <ProtectedFinancialDashboard />
</WithPermission>
```

## 🎨 Exemplo Visual do Budget Overview Card

```tsx
<WithPermission
  requiredPermissions={[PermissionResolverName.AnnualBudgets]}
  fallback={
    <PermissionDeniedOverlay height="500px" blurIntensity="medium">
      {/* Skeleton que replica exatamente o card original */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader>
          <div className="flex justify-between">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="flex-1 flex justify-center">
          <Skeleton className="w-[250px] h-[250px] rounded-full" />
        </CardContent>
        <div className="border-t p-4">
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </Card>
    </PermissionDeniedOverlay>
  }
>
  <BudgetOverviewCard {...props} />
</WithPermission>
```

## 🌍 Traduções

As mensagens padrão são traduzidas automaticamente via i18n:

**Português:**
- Título: "Acesso Negado"
- Descrição: "Solicite permissão para visualizar este conteúdo"

**English:**
- Title: "Access Denied"
- Description: "Please request permission to view this content"

**Nederlands:**
- Titel: "Toegang Geweigerd"
- Beschrijving: "Vraag toestemming aan om deze inhoud te bekijken"

## 🔐 Permissões Comuns

```typescript
// Orçamentos
PermissionResolverName.AnnualBudgets
PermissionResolverName.ViewInstitutionBudget

// Usuários
PermissionResolverName.CreateUser
PermissionResolverName.UpdateUser
PermissionResolverName.DeleteUser

// Instituições
PermissionResolverName.CreateInstitution
PermissionResolverName.UpdateInstitution

// Roles
PermissionResolverName.CreateRole
PermissionResolverName.EditRole
```

## ✅ Checklist de Implementação

- [ ] Importar `WithPermission` e `PermissionDeniedOverlay`
- [ ] Definir permissões necessárias
- [ ] Criar skeleton que replica o componente original
- [ ] Definir altura correta (`height` prop)
- [ ] Testar com usuário sem permissão
- [ ] Testar com usuário com permissão
- [ ] Verificar traduções em todos os idiomas

## 🚀 Vantagens

✅ **Reutilizável** - Use em qualquer componente
✅ **Consistente** - Design uniforme em toda aplicação
✅ **i18n** - Tradução automática
✅ **Acessível** - Mensagem clara para o usuário
✅ **Customizável** - Altura, blur, mensagens personalizadas
✅ **Visual** - Mostra estrutura borrada do componente

## 📚 Arquivos Relacionados

- **HOC**: `/hocs/with-permission.tsx`
- **Hook**: `/hooks/use-has-permission.ts`
- **Componente Similar**: `/components/shared/privacy-overlay.tsx` (para privacidade de dados)
- **Traduções**: `/lib/translations/permissions.ts`
- **Exemplo de Uso**: `/components/budget/budget-overview-card.tsx`
