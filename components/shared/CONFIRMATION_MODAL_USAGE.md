# Confirmation Modal - Componente Reutilizável

Modal de confirmação altamente versátil e minimalista para ações que requerem confirmação do usuário.

## Características

- **5 variantes visuais**: `default`, `danger`, `success`, `warning`, `info`
- **Totalmente personalizável**: ícones, textos, tamanhos
- **Lista de impactos**: Exibe pontos importantes automaticamente
- **Estados de loading**: Suporte nativo para operações assíncronas
- **Flexível**: Aceita conteúdo customizado via `children`

## Uso Básico

```tsx
import { ConfirmationModal } from "@/components/shared/confirmation-modal"

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ConfirmationModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      onConfirm={async () => {
        // Sua lógica aqui
        await deleteItem()
      }}
      title="Delete Item"
      description="This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
    />
  )
}
```

## Exemplos por Variante

### 1. Danger (Ações Destrutivas)

```tsx
<ConfirmationModal
  isOpen={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  onConfirm={handleDelete}
  variant="danger"
  title="Delete User Account"
  description="This will permanently delete the user account and all associated data."
  impacts={[
    "All user data will be permanently deleted",
    "Action cannot be undone",
    "User will be logged out immediately"
  ]}
  confirmText="Delete Account"
  cancelText="Cancel"
  isLoading={isDeleting}
/>
```

### 2. Warning (Ações com Consequências)

```tsx
<ConfirmationModal
  isOpen={isLockOpen}
  onOpenChange={setIsLockOpen}
  onConfirm={handleLock}
  variant="warning"
  icon={Lock}
  title="Lock Budget"
  description="This will prevent further modifications to the budget."
  impacts={[
    "Budget cannot be edited after locking",
    "All departments will be locked",
    "Requires admin approval to unlock"
  ]}
  confirmText="Lock Budget"
  isLoading={isLocking}
  closeOnConfirm={false} // Manter aberto após confirmação
/>
```

### 3. Success (Confirmação Positiva)

```tsx
<ConfirmationModal
  isOpen={isApproveOpen}
  onOpenChange={setIsApproveOpen}
  onConfirm={handleApprove}
  variant="success"
  title="Approve Budget Request"
  description="Approve this budget allocation for the department."
  confirmText="Approve"
  cancelText="Review Later"
/>
```

### 4. Info (Informativa)

```tsx
<ConfirmationModal
  isOpen={isInfoOpen}
  onOpenChange={setIsInfoOpen}
  onConfirm={handleProceed}
  variant="info"
  title="Update Available"
  description="A new version is available. Would you like to update now?"
  confirmText="Update Now"
  cancelText="Later"
/>
```

### 5. Default (Neutra)

```tsx
<ConfirmationModal
  isOpen={isConfirmOpen}
  onOpenChange={setIsConfirmOpen}
  onConfirm={handleConfirm}
  title="Confirm Action"
  description="Are you sure you want to proceed?"
  confirmText="Confirm"
/>
```

## Conteúdo Customizado

Use `children` para adicionar conteúdo personalizado:

```tsx
<ConfirmationModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  onConfirm={handleSubmit}
  variant="warning"
  title="Export Data"
  description="This will export all user data to CSV."
>
  <div className="bg-muted p-3 rounded-lg">
    <p className="text-sm font-medium">Export will include:</p>
    <ul className="text-sm mt-2 space-y-1">
      <li>✓ User profiles (1,234 records)</li>
      <li>✓ Transaction history (5,678 records)</li>
      <li>✓ Activity logs (12,345 records)</li>
    </ul>
  </div>
  <p className="text-sm text-muted-foreground mt-3">
    This process may take several minutes.
  </p>
</ConfirmationModal>
```

## Props Completas

```typescript
interface ConfirmationModalProps {
  // Controle (obrigatório)
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  
  // Conteúdo (obrigatório)
  title: string
  
  // Conteúdo (opcional)
  description?: string | React.ReactNode
  children?: React.ReactNode
  
  // Customização
  variant?: "default" | "danger" | "success" | "warning" | "info" // default: "default"
  icon?: LucideIcon // Sobrescreve ícone padrão da variante
  showIcon?: boolean // default: true
  
  // Botões
  confirmText?: string // default: "Confirm"
  cancelText?: string // default: "Cancel"
  showCancel?: boolean // default: true
  
  // Estados
  isLoading?: boolean // default: false
  disabled?: boolean // default: false
  
  // Avançado
  impacts?: string[] // Lista de pontos de impacto
  size?: "sm" | "default" | "lg" // default: "default"
  closeOnConfirm?: boolean // default: true (fecha após confirmar)
}
```

## Dicas de Uso

1. **Use `impacts`** para listar consequências importantes da ação
2. **Use `isLoading`** para operações assíncronas - o botão mostrará spinner automaticamente
3. **Use `closeOnConfirm={false}`** quando precisar manter o modal aberto após confirmação
4. **Use `children`** para conteúdo complexo que não cabe em `description`
5. **Use `size`** para ajustar a largura: `sm` (400px), `default` (500px), `lg` (600px)

## Variantes e Cores

| Variante | Cor Principal | Uso Recomendado |
|----------|--------------|-----------------|
| `danger` | Vermelho | Deletar, remover, ações destrutivas |
| `warning` | Âmbar | Lock, ações com consequências reversíveis |
| `success` | Verde | Aprovar, confirmar, ações positivas |
| `info` | Azul | Informações, atualizações |
| `default` | Azul | Confirmações neutras |

## Acessibilidade

- ✅ Suporte completo a teclado (ESC para fechar)
- ✅ Focus trap dentro do modal
- ✅ ARIA labels adequados
- ✅ Estados de loading claramente indicados
- ✅ Cores com contraste adequado

## Integração com i18n

```tsx
import { useTranslation } from "react-i18next"

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <ConfirmationModal
      title={t('modals.delete.title')}
      description={t('modals.delete.description')}
      confirmText={t('common.delete')}
      cancelText={t('common.cancel')}
      impacts={[
        t('modals.delete.impact_1'),
        t('modals.delete.impact_2'),
        t('modals.delete.impact_3')
      ]}
      // ... outras props
    />
  )
}
```

## Tratamento de Erros

O `onConfirm` pode ser uma função assíncrona. Erros devem ser tratados pelo componente pai:

```tsx
const handleDelete = async () => {
  try {
    await deleteUser(userId)
    toast.success("User deleted successfully")
    setIsOpen(false)
  } catch (error) {
    toast.error("Failed to delete user")
    // Modal permanece aberto para nova tentativa
  }
}

<ConfirmationModal
  onConfirm={handleDelete}
  closeOnConfirm={false} // Importante: deixar o pai controlar quando fechar
  // ... outras props
/>
```
