# Permission Configuration Page

## Overview

Uma página dedicada para configuração detalhada de permissões de roles com design monocromático e foco na funcionalidade. A página oferece uma interface limpa e intuitiva para gerenciar permissões granulares.

## 🎯 Características Principais

### ✅ Design Monocromático
- **Paleta Neutra**: Tons de cinza, preto e branco como base
- **Cores de Status**: Apenas elementos de status usam cores
  - 🟢 **Verde**: Permissões ativas, sucesso, completo
  - 🟡 **Amarelo**: Modificações não salvas, parcial
  - 🔴 **Vermelho**: Permissões removidas, erros
  - 🔵 **Azul**: Novas permissões adicionadas
- **Botões Padrão**: `bg-primary text-primary-foreground shadow-sm hover:bg-primary/90`

### 📱 Design Responsivo
- **Mobile First**: Layout otimizado para dispositivos móveis
- **Grid Adaptativo**: 1 coluna no mobile, 2 colunas no desktop
- **Cards Flexíveis**: Ajustam-se automaticamente ao tamanho da tela
- **Navegação Intuitiva**: Breadcrumbs e botão de voltar

### 🔧 Funcionalidades

**1. Informações do Role Destacadas:**
- Card principal com informações completas do role
- Indicadores de status em tempo real
- Estatísticas de cobertura de permissões
- Badge especial para roles de Admin (👑)

**2. Matriz de Permissões Intuitiva:**
- Grupos colapsáveis organizados por categoria
- Checkboxes visuais com feedback imediato
- Indicadores de progresso circular por grupo
- Badges de status (Complete, Partial, etc.)

**3. Controles Avançados:**
- **Select All/Clear All**: Botões globais para todas as permissões
- **Group Actions**: Seleção/limpeza por grupo
- **Visual Feedback**: Animações e transições suaves
- **Estado de Modificação**: Indicadores visuais para mudanças não salvas

## 🗂️ Estrutura de Arquivos

```
/app/access/permissions/[roleId]/
├── page.tsx              # Página de configuração de permissões
├── loading.tsx           # Estados de loading
```

## 🎨 Design System

### Paleta de Cores
```css
/* Base Monocromática */
--background: #fafafa (off-white)
--foreground: #2a2a2a (dark-grey)
--muted: #f5f5f5 (light grey)
--border: #e5e7eb (border grey)

/* Cores de Status Apenas */
--success: #22c55e (green)
--warning: #f59e0b (yellow)  
--error: #ef4444 (red)
--info: #3b82f6 (blue)
```

### Componentes Visuais
- **Cards**: Bordas sutis com hover effects
- **Badges**: Monocromáticos exceto para status
- **Buttons**: Estilo padrão do sistema
- **Checkboxes**: Visuais customizados com animações
- **Progress Rings**: Indicadores circulares de progresso

## 🔗 Navegação

### Roteamento
```
/access → Página principal de access management
/access/permissions/[roleId] → Configuração detalhada de permissões
```

### Integração
- **Link da Tabela**: Botão "Edit Permissions" redireciona para página detalhada
- **Breadcrumbs**: Navegação clara com contexto
- **Botão Voltar**: Retorna para access management

## 🌍 Internacionalização

### Chaves i18n Utilizadas
```json
{
  "access.roles.permissions": {
    "title": "Permission Configuration",
    "groups": { "USER": "User Management", ... },
    "group_descriptions": { "USER": "Control user creation...", ... },
    "selected_count": "{{count}} permissions selected",
    "unsaved_changes": "You have unsaved changes"
  },
  "access.toasts": {
    "permissions_updated": "Permissions updated successfully"
  }
}
```

## 🔧 Funcionalidades Técnicas

### Estado de Permissões
```typescript
const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
const [expandedGroups, setExpandedGroups] = useState<string[]>(['USER', 'ROLE'])
```

### Handlers Principais
```typescript
// Toggle individual permission
const handlePermissionToggle = (permissionId: string, permissionName: string)

// Group operations
const handleGroupSelect = (groupPermissionIds: string[], groupName: string)
const handleGroupClear = (groupPermissionIds: string[], groupName: string)

// Global operations
const handleSelectAll = () // Select all permissions
const handleClearAll = () // Clear all permissions
```

### Validações e Feedback
- **Unsaved Changes**: Confirmação antes de sair
- **Toast Notifications**: Feedback imediato para todas as ações
- **Visual Indicators**: Pontos animados para mudanças
- **Progress Tracking**: Porcentagem de cobertura em tempo real

## 📊 Interface Components

### Role Information Card
- **Header**: Nome, key code, e badges informativos
- **Stats**: Contadores de permissões e cobertura
- **Status**: Indicador de estado (saved/modified)
- **User Count**: Número de usuários com este role

### Permission Groups
- **Collapsible Cards**: Grupos organizados e expansíveis
- **Progress Rings**: Indicadores visuais de completude
- **Quick Actions**: Botões select all/clear por grupo
- **Status Badges**: Complete, Partial, etc.

### Permission Items
- **Visual Checkboxes**: Checkboxes customizados com ícones
- **Status Indicators**: Badges para New, Removed, Active
- **Descriptions**: Texto explicativo para cada permissão
- **Key Codes**: Identificadores técnicos em badges

## 🚀 Uso da Página

### Fluxo de Trabalho
1. **Acesso**: Click em "Edit Permissions" na tabela de roles
2. **Navegação**: Página dedicada abre com informações do role
3. **Configuração**: Use checkboxes para selecionar/desselecionar permissões
4. **Organização**: Expanda/colapsa grupos conforme necessário
5. **Ações Rápidas**: Use botões Select All/Clear para operações em massa
6. **Salvamento**: Salve as alterações ou cancele

### Atalhos de Teclado
- **Espaço**: Toggle permissão selecionada
- **Enter**: Expandir/colapsar grupo
- **Ctrl+S**: Salvar alterações (planejado)
- **Esc**: Cancelar e voltar

## 🔒 Segurança e Validação

### Controle de Acesso
- Verificação de permissão `UPDATE_ROLE` antes de permitir edições
- Validação de mudanças antes de salvar
- Confirmação para ações destrutivas

### Auditoria
- Log de todas as alterações de permissões
- Tracking de quem fez alterações
- Histórico de modificações (planejado)

## 📈 Performance

### Otimizações
- **Memoização**: useMemo para cálculos pesados
- **Lazy Loading**: Grupos carregados sob demanda
- **Debounced Actions**: Evita múltiplas operações simultâneas
- **Virtual Scrolling**: Para listas grandes de permissões

## 🎨 Características Visuais

### Animações e Transições
- **Hover Effects**: Transformações suaves nos cards
- **Progress Animations**: Anéis de progresso animados
- **Pulse Effects**: Indicadores de mudanças não salvas
- **Scale Transforms**: Feedback visual para interações

### Estados Visuais
- **Default**: Cinza neutro
- **Hover**: Cinza mais claro
- **Selected**: Destaque sutil
- **Modified**: Indicador amarelo pulsante
- **Complete**: Verde para grupos completos
- **Partial**: Amarelo para grupos parciais

A página oferece uma experiência **profissional e focada** para configuração de permissões, mantendo a simplicidade visual enquanto fornece funcionalidade avançada! 🎯
