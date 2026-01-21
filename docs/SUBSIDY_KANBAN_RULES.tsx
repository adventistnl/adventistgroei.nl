/**
 * Exemplo de configuração de regras de movimento para aprovações de subsídios
 * 
 * Regras implementadas:
 * 1. Items de "approved" ou "rejected" só podem ir para "closed"
 * 2. Items de "closed" não podem ser arrastados (drag desabilitado)
 * 3. Salvamento automático sem painel de mudanças pendentes
 */

import { KanbanBoard, KanbanMoveRule } from '@/components/ui/kanban-board'

// Definir as regras de movimento
export const subsidyApprovalMoveRules: KanbanMoveRule = {
  // Desabilitar drag de items que estão em "closed"
  disableDragFrom: ['closed'],
  
  // Validação customizada para regras específicas
  canMove: (itemId, fromGroupId, toGroupId, item) => {
    // Items de "approved" ou "rejected" só podem mover para "closed"
    if (fromGroupId === 'approved' || fromGroupId === 'rejected') {
      // Bloqueia movimentos para "pending" ou "in_review"
      if (toGroupId === 'pending' || toGroupId === 'in_review') {
        return false
      }
      // Permite apenas para "closed"
      return toGroupId === 'closed'
    }
    
    // Items de "closed" não podem ser movidos (já bloqueado por disableDragFrom)
    if (fromGroupId === 'closed') {
      return false
    }
    
    // Outros movimentos são permitidos (pending ↔ in_review)
    return true
  }
}

// Exemplo de uso no componente
export function SubsidyApprovalsKanban() {
  const groups = [
    { id: 'pending', name: 'Pending', color: '#6b7280', description: 'Awaiting review' },
    { id: 'in_review', name: 'In Review', color: '#3b82f6', description: 'Under evaluation' },
    { id: 'approved', name: 'Approved', color: '#10b981', description: 'Approved requests' },
    { id: 'rejected', name: 'Rejected', color: '#ef4444', description: 'Rejected requests' },
    { id: 'closed', name: 'Closed', color: '#6366f1', description: 'Closed and archived' },
  ]
  
  const handleItemMove = (itemId: string, fromGroupId: string, toGroupId: string) => {
    // Atualização otimista do estado local
    // Esta função atualiza imediatamente a UI antes da chamada da API
    console.log(`Moving item ${itemId} from ${fromGroupId} to ${toGroupId}`)
  }
  
  const handleSaveChanges = async (changes: Array<{ itemId: string, fromGroupId: string, toGroupId: string }>) => {
    // Esta função é chamada automaticamente após cada drop bem-sucedido
    // NÃO mostra painel de pending changes
    
    const change = changes[0] // Sempre será apenas 1 mudança por vez
    
    try {
      // Exemplo de chamada GraphQL/API
      const response = await updateSubsidyStatus({
        variables: {
          subsidyId: change.itemId,
          newStatus: change.toGroupId
        }
      })
      
      // Retorna Promise vazia em caso de sucesso
      // Toast de sucesso é mostrado automaticamente
    } catch (error) {
      // Em caso de erro, lança exceção
      // Toast de erro é mostrado automaticamente
      // Estado é revertido automaticamente
      throw error
    }
  }
  
  return (
    <KanbanBoard
      groups={groups}
      items={subsidyItems}
      moveRules={subsidyApprovalMoveRules}
      onItemMove={handleItemMove}
      onSaveChanges={handleSaveChanges}
      enableDragDrop={true}
    />
  )
}

/**
 * Matriz de movimentos permitidos:
 * 
 * | De \ Para     | Pending | In Review | Approved | Rejected | Closed |
 * |---------------|---------|-----------|----------|----------|--------|
 * | **Pending**   | ✅      | ✅        | ✅       | ✅       | ✅     |
 * | **In Review** | ✅      | ✅        | ✅       | ✅       | ✅     |
 * | **Approved**  | ❌      | ❌        | ✅       | ❌       | ✅     |
 * | **Rejected**  | ❌      | ❌        | ❌       | ✅       | ✅     |
 * | **Closed**    | ❌      | ❌        | ❌       | ❌       | ❌     |
 * 
 * Legenda:
 * - ✅ Movimento permitido
 * - ❌ Movimento bloqueado
 * 
 * Comportamento:
 * - Salvamento automático: Cada drop aciona onSaveChanges imediatamente
 * - Sem painel de pending changes: KanbanSavePanel foi removido
 * - Feedback visual: Toast de sucesso/erro após cada operação
 * - Rollback automático: Se API falhar, estado é revertido visualmente
 */
