# Sistema de Validação Dinâmica de Permissões na Navegação

## Visão Geral

O sistema de navegação agora valida dinamicamente as permissões do usuário para exibir apenas os itens de menu que ele tem acesso. Para seções com subitems (como "Finance Management"), a seção só é renderizada se o usuário tiver pelo menos uma das permissões necessárias dos filhos.

## Como Funciona

### 1. Funções Helper em `config/navigation.ts`

#### `collectItemPermissions(item: NavItem): PermissionResolverName[]`
Coleta recursivamente todas as permissões de um item e seus subitems.

```typescript
// Exemplo:
const item = {
  title: "Finance Management",
  permissions: [],
  items: [
    { permissions: [PermissionResolverName.Settings] },
    { permissions: [PermissionResolverName.Institutions] }
  ]
}
// Retorna: [PermissionResolverName.Settings, PermissionResolverName.Institutions]
```

#### `shouldShowNavItem(item: NavItem, userPermissions: PermissionResolverName[]): boolean`
Valida se um item deve ser exibido baseado nas permissões do usuário.

**Lógica:**
- Se o item **não tem subitems**: verifica as permissões diretas do item
- Se o item **tem subitems** (url: "#"): coleta todas as permissões dos filhos e verifica se o usuário tem pelo menos uma
- Se **não tem permissões requeridas**: sempre exibe o item

```typescript
// Exemplo 1: Item direto
const item = { permissions: [PermissionResolverName.Users] }
const userPerms = [PermissionResolverName.Users]
shouldShowNavItem(item, userPerms) // true

// Exemplo 2: Seção com subitems
const section = {
  url: "#",
  permissions: [],
  items: [
    { permissions: [PermissionResolverName.Settings] },
    { permissions: [PermissionResolverName.Institutions] }
  ]
}
const userPerms = [PermissionResolverName.Settings]
shouldShowNavItem(section, userPerms) // true (tem Settings)

const userPerms2 = [PermissionResolverName.Users]
shouldShowNavItem(section, userPerms2) // false (não tem nenhuma das necessárias)
```

### 2. Funções de Navegação Atualizadas

#### `getNavMainWithActiveState(pathname: string, userPermissions: PermissionResolverName[]): NavItem[]`
- Filtra items principais baseado em permissões
- Filtra subitems de cada item
- Remove items que o usuário não tem acesso

#### `getNavSectionsWithActiveState(pathname: string, userPermissions: PermissionResolverName[]): NavSection[]`
- Filtra items dentro de cada seção
- Remove seções que ficaram vazias após filtrar items
- Preserva apenas o que o usuário pode acessar

### 3. Hook `useNavigation()`

O hook foi atualizado para:
1. Obter as permissões do usuário via `useAuth()`
2. Passar as permissões para as funções de navegação
3. Memoizar resultados para evitar recálculos desnecessários

```typescript
const { permissions } = useAuth()
const navigation = getNavMainWithActiveState(pathname, permissions)
const sections = getNavSectionsWithActiveState(pathname, permissions)
```

### 4. Componente `NavMain`

Removido o wrapper `<WithPermission>` pois a filtragem agora é feita no hook:

**Antes:**
```tsx
{section.items.map((item) => (
  <WithPermission key={item.title} requiredPermissions={item.permissions}>
    <NavMainItem item={item} />
  </WithPermission>
))}
```

**Depois:**
```tsx
{section.items.map((item) => (
  <NavMainItem key={item.title} item={item} />
))}
```

## Exemplo Prático

### Configuração da Navegação

```typescript
{
  title: "Finance Management",
  url: "#",
  icon: DollarSign,
  items: [
    { 
      title: "Annual Budget", 
      url: "/finance/annual-budget", 
      permissions: [PermissionResolverName.Settings] 
    },
    { 
      title: "Subsidy Approvals", 
      url: "/finance/subsidy-approvals", 
      permissions: [PermissionResolverName.Institutions] 
    },
  ],
  permissions: [], // Vazio - validação feita pelos filhos
}
```

### Cenários de Validação

**Cenário 1: Usuário com permissão `Settings`**
- ✅ Seção "Finance Management" é exibida
- ✅ Subitem "Annual Budget" é exibido
- ❌ Subitem "Subsidy Approvals" é oculto

**Cenário 2: Usuário com permissão `Institutions`**
- ✅ Seção "Finance Management" é exibida
- ❌ Subitem "Annual Budget" é oculto
- ✅ Subitem "Subsidy Approvals" é exibido

**Cenário 3: Usuário com ambas as permissões**
- ✅ Seção "Finance Management" é exibida
- ✅ Subitem "Annual Budget" é exibido
- ✅ Subitem "Subsidy Approvals" é exibido

**Cenário 4: Usuário sem nenhuma permissão**
- ❌ Seção "Finance Management" é completamente oculta

## Benefícios

1. **Segurança**: Apenas itens com permissões adequadas são exibidos
2. **Performance**: Filtragem feita uma vez no hook, não em cada componente
3. **Manutenibilidade**: Lógica centralizada em um único lugar
4. **Flexibilidade**: Suporta validação parcial (OR) e total (AND)
5. **UX**: Interface limpa mostrando apenas o que o usuário pode acessar

## Performance

- **Memoização**: Resultados são memoizados e só recalculados quando pathname ou permissões mudam
- **Filtragem Única**: Feita no hook, não duplicada em cada componente
- **Refs**: Uso de `useRef` para evitar comparações desnecessárias
