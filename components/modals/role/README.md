# Role Modal Components

Este diretório contém componentes modais reutilizáveis para gerenciamento de roles (funções) no sistema. Todos os modais são completamente independentes e podem ser usados em qualquer página da aplicação.

## Componentes Disponíveis

### 1. CreateRoleModal
Modal para criação de novos roles.

**Props:**
- `isOpen: boolean` - Controla se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback para mudanças de estado
- `onSuccess?: (roleData: RoleFormData) => void` - Callback executado após criação bem-sucedida

**Exemplo:**
```tsx
import { CreateRoleModal } from "@/components/modals/role"

<CreateRoleModal
  isOpen={isCreateOpen}
  onOpenChange={setIsCreateOpen}
  onSuccess={(roleData) => console.log('Role created:', roleData)}
/>
```

### 2. EditRoleModal
Modal para edição de roles existentes.

**Props:**
- `isOpen: boolean` - Controla se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback para mudanças de estado
- `role: Role | null` - Role a ser editado
- `users?: User[]` - Lista de usuários para mostrar quantos têm o role
- `onSuccess?: (roleData: EditRoleFormData) => void` - Callback executado após edição bem-sucedida
- `onEditPermissions?: (role: Role) => void` - Callback para navegar para página de permissões

**Exemplo:**
```tsx
import { EditRoleModal } from "@/components/modals/role"

<EditRoleModal
  isOpen={isEditOpen}
  onOpenChange={setIsEditOpen}
  role={selectedRole}
  users={users}
  onSuccess={(roleData) => console.log('Role updated:', roleData)}
  onEditPermissions={(role) => navigate(`/roles/${role.id}`)}
/>
```

### 3. DeleteRoleModal
Modal para exclusão de roles com possibilidade de reatribuição de usuários.

**Props:**
- `isOpen: boolean` - Controla se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback para mudanças de estado
- `role: Role | null` - Role a ser deletado
- `users?: User[]` - Lista de usuários para verificar quais têm o role
- `availableRoles?: Role[]` - Roles disponíveis para reatribuição
- `onSuccess?: (deletedRole: Role, reassignmentRoleId?: string) => void` - Callback executado após exclusão

**Exemplo:**
```tsx
import { DeleteRoleModal } from "@/components/modals/role"

<DeleteRoleModal
  isOpen={isDeleteOpen}
  onOpenChange={setIsDeleteOpen}
  role={selectedRole}
  users={users}
  availableRoles={availableRoles}
  onSuccess={(deletedRole, reassignmentId) => {
    console.log('Role deleted:', deletedRole.name)
    if (reassignmentId) console.log('Users reassigned to:', reassignmentId)
  }}
/>
```

## Funcionalidades

### CreateRoleModal
- ✅ Formulário com validação
- ✅ Campos: Nome, Código da Chave, Descrição
- ✅ Auto-uppercase para código da chave
- ✅ Loading states durante criação
- ✅ Toast notifications
- ✅ Suporte completo a i18n

### EditRoleModal
- ✅ Formulário pré-preenchido com dados do role
- ✅ Proteção para role ADMIN (key_code não editável)
- ✅ Exibição de informações do role (usuários atribuídos)
- ✅ Botão para navegar para página de permissões
- ✅ Loading states durante edição
- ✅ Toast notifications
- ✅ Suporte completo a i18n

### DeleteRoleModal
- ✅ Verificação automática de usuários com o role
- ✅ Fluxo inteligente: reatribuição ou confirmação direta
- ✅ Seleção de role para reatribuição
- ✅ Exibição de usuários afetados
- ✅ Avisos de segurança visuais
- ✅ Opção de pular reatribuição
- ✅ Loading states durante exclusão
- ✅ Toast notifications
- ✅ Suporte completo a i18n

## Tipos TypeScript

```tsx
interface RoleFormData {
  name: string
  key_code: string
  description: string
}

interface EditRoleFormData extends RoleFormData {
  id: string
}
```

## Padrão de Estado

Para usar os modais, você precisa gerenciar o estado básico:

```tsx
const [isCreateOpen, setIsCreateOpen] = useState(false)
const [isEditOpen, setIsEditOpen] = useState(false)
const [isDeleteOpen, setIsDeleteOpen] = useState(false)
const [selectedRole, setSelectedRole] = useState<Role | null>(null)
```

## Integração com APIs

Os modais simulam chamadas de API com delays. Para integrar com APIs reais:

1. Substitua os `setTimeout` por chamadas reais de API
2. Implemente tratamento de erro adequado
3. Atualize o estado/cache da aplicação nos callbacks de sucesso

## Estilo e UX

- ✅ Design responsivo
- ✅ Animações suaves
- ✅ Estados de loading
- ✅ Feedback visual claro
- ✅ Acessibilidade (ARIA labels, navegação por teclado)
- ✅ Tema consistente com o sistema
- ✅ Duotone color scheme

## Dependências

- React 18+
- Next.js 13+
- Tailwind CSS
- Radix UI (Dialog, Select, etc.)
- Lucide React (ícones)
- react-hot-toast (notificações)
- react-i18next (internacionalização)

## Exemplo Completo

Veja `example-usage.tsx` para um exemplo completo de como usar todos os modais em um componente.
