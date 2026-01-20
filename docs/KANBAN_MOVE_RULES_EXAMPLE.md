# Exemplo de Regras de Movimento do Kanban Board

## Configuração para Subsídios/Aprovações

### Regras Implementadas

1. **Items em "approved" e "rejected"**:
   - ❌ NÃO podem ser movidos para "pending" ou "in_review"
   - ✅ PODEM ser movidos para "closed"

2. **Items em "closed"**:
   - ❌ NÃO podem mais ser arrastados (drag desabilitado)
   - ✅ Podem RECEBER items de outros status (drop habilitado)

### Exemplo de Implementação

```tsx
import { KanbanBoard, KanbanMoveRule } from '@/components/ui/kanban-board'

// Definir regras de movimento
const subsidyMoveRules: KanbanMoveRule = {
  // Desabilitar drag de items em "closed"
  disableDragFrom: ['closed'],
  
  // Validação customizada para regras específicas
  canMove: (itemId, fromGroupId, toGroupId, item) => {
    // Items de "approved" ou "rejected" só podem ir para "closed"
    if (fromGroupId === 'approved' || fromGroupId === 'rejected') {
      // Não pode mover para "pending" ou "in_review"
      if (toGroupId === 'pending' || toGroupId === 'in_review') {
        return false
      }
      // Pode mover para "closed" ou ficar no mesmo status
      return toGroupId === 'closed' || toGroupId === fromGroupId
    }
    
    // Items de "closed" não podem ser movidos (já bloqueado por disableDragFrom)
    if (fromGroupId === 'closed') {
      return false
    }
    
    // Outros movimentos são permitidos
    return true
  }
}

// Usar no componente
function SubsidyApprovals() {
  const groups = [
    { id: 'pending', name: 'Pending', color: '#6b7280' },
    { id: 'in_review', name: 'In Review', color: '#3b82f6' },
    { id: 'approved', name: 'Approved', color: '#10b981' },
    { id: 'rejected', name: 'Rejected', color: '#ef4444' },
    { id: 'closed', name: 'Closed', color: '#6366f1' },
  ]
  
  return (
    <KanbanBoard
      groups={groups}
      items={subsidyItems}
      moveRules={subsidyMoveRules}
      onItemMove={handleItemMove}
      onSaveChanges={handleSaveChanges}
    />
  )
}
```

## Matriz de Movimentos Permitidos

| De \ Para | Pending | In Review | Approved | Rejected | Closed |
|-----------|---------|-----------|----------|----------|--------|
| **Pending** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **In Review** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Approved** | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Rejected** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Closed** | ❌ | ❌ | ❌ | ❌ | ❌ |

## Interface KanbanMoveRule

```typescript
export interface KanbanMoveRule {
  /**
   * Group IDs from which items cannot be dragged
   * Exemplo: ['closed'] - items em "closed" não podem ser arrastados
   */
  disableDragFrom?: string[]
  
  /**
   * Group IDs to which items cannot be dropped
   * Exemplo: ['pending'] - nenhum item pode ser dropado em "pending"
   */
  disableDropTo?: string[]
  
  /**
   * Custom validation function for allowed moves
   * Return false to prevent the move
   * 
   * @param itemId - ID do item sendo movido
   * @param fromGroupId - ID do grupo de origem
   * @param toGroupId - ID do grupo de destino
   * @param item - Objeto completo do item (opcional)
   * @returns true se o movimento é permitido, false caso contrário
   */
  canMove?: (
    itemId: string, 
    fromGroupId: string, 
    toGroupId: string, 
    item?: KanbanItem
  ) => boolean
}
```

## Comportamento Visual

### Item Draggable
- Cursor muda para "grab" quando hover
- Pode ser arrastado
- Feedback visual durante drag (opacidade reduzida)

### Item NÃO Draggable
- Cursor permanece normal
- NÃO pode ser arrastado
- Nenhum feedback visual de drag

### Movimento Bloqueado
- Se tentar fazer drop em local não permitido
- Toast de erro aparece: "This move is not allowed"
- Item retorna para posição original

## Casos de Uso Adicionais

### 1. Workflow Linear (só pode avançar)
```typescript
const linearWorkflowRules: KanbanMoveRule = {
  canMove: (itemId, fromGroupId, toGroupId) => {
    const order = ['pending', 'in_review', 'approved', 'closed']
    const fromIndex = order.indexOf(fromGroupId)
    const toIndex = order.indexOf(toGroupId)
    
    // Só pode mover para frente (índice maior)
    return toIndex > fromIndex
  }
}
```

### 2. Bloqueio Condicional por Metadados
```typescript
const conditionalRules: KanbanMoveRule = {
  canMove: (itemId, fromGroupId, toGroupId, item) => {
    // Exemplo: só pode mover para "approved" se tiver documentos anexados
    if (toGroupId === 'approved') {
      return item?.metadata?.hasDocuments === true
    }
    return true
  }
}
```

### 3. Múltiplas Restrições
```typescript
const complexRules: KanbanMoveRule = {
  disableDragFrom: ['closed', 'archived'],
  disableDropTo: ['archived'],
  canMove: (itemId, fromGroupId, toGroupId, item) => {
    // Lógica customizada adicional
    if (fromGroupId === 'approved' && toGroupId === 'pending') {
      return false // Não pode voltar de approved para pending
    }
    return true
  }
}
```
