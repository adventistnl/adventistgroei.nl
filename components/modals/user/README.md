# User Modal Components

Este diretório contém componentes modais reutilizáveis para gerenciamento completo de usuários no sistema. Todos os modais são independentes e podem ser usados em qualquer página da aplicação.

## Componentes Disponíveis

### 1. CreateUserModal
Modal para criação de novos usuários com formulário completo.

**Props:**
- `isOpen: boolean` - Controla se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback para mudanças de estado
- `institutions: Institution[]` - Lista de instituições disponíveis
- `churches: Church[]` - Lista de igrejas disponíveis
- `regions: Region[]` - Lista de regiões disponíveis
- `departments: Department[]` - Lista de departamentos disponíveis
- `roles: Role[]` - Lista de roles disponíveis
- `onSuccess?: (userData: UserFormData) => void` - Callback executado após criação bem-sucedida

**Funcionalidades:**
- ✅ Formulário com validação completa
- ✅ Campos relacionais (instituição → região/igreja/departamento)
- ✅ Seleção múltipla de roles com checkboxes
- ✅ Switch para status ativo/inativo
- ✅ Validação de campos obrigatórios
- ✅ Loading states e toast notifications
- ✅ Suporte completo a i18n

### 2. EditUserModal
Modal para edição de usuários existentes.

**Props:**
- `isOpen: boolean` - Controla se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback para mudanças de estado
- `user: User | null` - Usuário a ser editado
- `institutions: Institution[]` - Lista de instituições disponíveis
- `churches: Church[]` - Lista de igrejas disponíveis
- `regions: Region[]` - Lista de regiões disponíveis
- `departments: Department[]` - Lista de departamentos disponíveis
- `roles: Role[]` - Lista de roles disponíveis
- `onSuccess?: (userData: EditUserFormData) => void` - Callback executado após edição bem-sucedida

**Funcionalidades:**
- ✅ Formulário pré-preenchido com dados do usuário
- ✅ Card informativo com avatar e dados básicos
- ✅ Atualização de campos relacionais
- ✅ Gestão de roles com checkboxes
- ✅ Switch para ativar/desativar usuário
- ✅ Validação e loading states
- ✅ Suporte completo a i18n

### 3. DeleteUserModal
Modal para exclusão (soft delete) de usuários.

**Props:**
- `isOpen: boolean` - Controla se o modal está aberto
- `onOpenChange: (open: boolean) => void` - Callback para mudanças de estado
- `user: User | null` - Usuário a ser deletado
- `onSuccess?: (deletedUser: User) => void` - Callback executado após exclusão bem-sucedida

**Funcionalidades:**
- ✅ Exibição completa dos dados do usuário
- ✅ Lista de roles atuais do usuário
- ✅ Avisos de segurança visuais
- ✅ Confirmação clara das consequências
- ✅ Soft delete (marcação como inativo)
- ✅ Loading states e toast notifications
- ✅ Suporte completo a i18n

## Tipos TypeScript

```tsx
interface UserFormData {
  name: string
  email: string
  language_preference: string
  institution_id: string
  church_id: string
  region_id: string
  department_id?: string
  role_ids: string[]
  is_active: boolean
}

interface EditUserFormData extends UserFormData {
  id: string
}
```

## Exemplo de Uso

```tsx
import { CreateUserModal, EditUserModal, DeleteUserModal } from "@/components/modals/user"
import { users, roles, institutions, churches, regions, departments } from "@/data/usersData"

function MyComponent() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleCreateSuccess = (userData: UserFormData) => {
    console.log('User created:', userData)
    // Refresh users list, show notification, etc.
  }

  const handleEditSuccess = (userData: EditUserFormData) => {
    console.log('User updated:', userData)
    // Update user in list, show notification, etc.
  }

  const handleDeleteSuccess = (deletedUser: User) => {
    console.log('User deleted:', deletedUser.name)
    // Remove user from list, show notification, etc.
  }

  return (
    <>
      {/* Trigger buttons */}
      <Button onClick={() => setIsCreateOpen(true)}>Create User</Button>
      
      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        institutions={institutions}
        churches={churches}
        regions={regions}
        departments={departments}
        roles={roles}
        onSuccess={handleCreateSuccess}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        user={selectedUser}
        institutions={institutions}
        churches={churches}
        regions={regions}
        departments={departments}
        roles={roles}
        onSuccess={handleEditSuccess}
      />

      <DeleteUserModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        user={selectedUser}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
```

## Estrutura de Dados

Os modais trabalham com a estrutura de dados definida em `/data/usersData.ts`:

- **User**: Entidade principal com relacionamentos
- **Role**: Roles/funções do sistema
- **Institution**: Instituições organizacionais
- **Church**: Igrejas vinculadas às instituições
- **Region**: Regiões geográficas
- **Department**: Departamentos organizacionais

## Relacionamentos

- **Institution** → **Region**, **Church**, **Department**
- **User** → **Institution**, **Church**, **Region**, **Department** (opcional)
- **User** → **Role[]** (múltiplos roles)

## Validações

### CreateUserModal & EditUserModal
- ✅ Nome obrigatório
- ✅ Email obrigatório e formato válido
- ✅ Instituição obrigatória
- ✅ Igreja obrigatória
- ✅ Pelo menos um role obrigatório
- ✅ Campos relacionais (igreja deve pertencer à instituição selecionada)

### DeleteUserModal
- ✅ Confirmação visual clara
- ✅ Exibição de dados que serão perdidos
- ✅ Soft delete (preserva dados históricos)

## Estilo e UX

- ✅ Design responsivo e moderno
- ✅ Consistent com o design system
- ✅ Duotone color scheme
- ✅ Loading states em todas as operações
- ✅ Toast notifications informativas
- ✅ Validação em tempo real
- ✅ Acessibilidade completa

## Integração com APIs

Os modais simulam chamadas de API com delays. Para integrar com APIs reais:

1. Substitua os `setTimeout` por chamadas HTTP reais
2. Implemente tratamento de erro robusto
3. Atualize o estado da aplicação nos callbacks de sucesso
4. Considere implementar otimistic updates para melhor UX
