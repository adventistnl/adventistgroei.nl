import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export type SubsidyStatusName = 'pending' | 'in_review' | 'approved' | 'rejected' | 'closed' | 'advanced_closed' | 'waiting_documents' | 'waiting_refund'

export interface SubsidyStatusContext {
  is_for_advance: boolean
  have_refund: boolean
  refund_done: boolean
  hasPendingDocuments?: boolean
  hasRejectedDocuments?: boolean
}

export interface UserRoleContext {
  isFinanceUser: boolean
  isOwnerOrLeader: boolean
}

// ============================================================================
// STATE MACHINE CONFIGURATION
// ============================================================================

// Statuses grouped by suas fases no ciclo de vida
export const PRE_APPROVED_STATUSES: SubsidyStatusName[] = ['pending', 'in_review']
export const POST_APPROVED_STATUSES: SubsidyStatusName[] = ['approved', 'advanced_closed', 'waiting_documents', 'waiting_refund', 'closed', 'rejected']

// Dicionário de transições permitidas: De qual status -> Para quais status
// Facilita muito a leitura e manutenção das regras de negócio
export const SUBSIDY_TRANSITIONS: Record<'normal' | 'advance', Record<SubsidyStatusName, SubsidyStatusName[]>> = {
  normal: {
    pending: ['in_review', 'approved', 'rejected'],
    in_review: ['pending', 'approved', 'rejected'],
    approved: ['closed'],
    rejected: ['approved'],
    waiting_refund: ['closed'],
    advanced_closed: [], // Not applicable for normal subsidies
    waiting_documents: [], // Not applicable for normal subsidies
    closed: [] // Final state
  },
  advance: {
    pending: ['in_review', 'approved', 'rejected'],
    in_review: ['pending', 'approved', 'rejected'],
    approved: ['waiting_documents', 'advanced_closed'],
    rejected: ['approved'],
    advanced_closed: ['waiting_documents', 'closed'],
    waiting_documents: ['closed', 'waiting_refund'],
    waiting_refund: ['closed'],
    closed: [] // Final state
  }
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useSubsidyStatusRules = () => {
  const { t } = useTranslation()

  // Retorna null se a transição for permitida, ou uma string com a mensagem de erro
  const getStatusChangeError = useCallback((
    from: string,
    to: string,
    context: SubsidyStatusContext,
    userContext: UserRoleContext
  ): string | null => {
    const fromStatus = (from || '').toLowerCase() as SubsidyStatusName
    const toStatus = (to || '').toLowerCase() as SubsidyStatusName

    // ------------------------------------------------------------------------
    // 1. ROLE-BASED RESTRICTIONS (QUEM PODE MOVER)
    // ------------------------------------------------------------------------
    
    // Only Owner/Leader can touch pre-approved subsidies
    if (PRE_APPROVED_STATUSES.includes(fromStatus)) {
      if (userContext.isFinanceUser && !userContext.isOwnerOrLeader) {
        return t('subsidy.errors.financialCannotActBeforeApproval', 'Financial managers can only act on subsidies that have already been approved')
      }
    }

    // Only Finance can manage post-approved subsidies
    if (POST_APPROVED_STATUSES.includes(fromStatus)) {
      if (!userContext.isFinanceUser) {
        return t('subsidy.errors.onlyFinancialCanManage', 'Only Finance users can manage subsidies after approval')
      }
    }

    // No one can revert a post-approved subsidy back to pre-approved statuses (business rule)
    if (POST_APPROVED_STATUSES.includes(fromStatus) && PRE_APPROVED_STATUSES.includes(toStatus)) {
      return t('subsidy.errors.cannotRevertToPreApproved', 'Cannot move approved subsidies back to Pending or In Review')
    }

    // ------------------------------------------------------------------------
    // 2. STATE MACHINE RESTRICTIONS (PARA ONDE PODE IR)
    // ------------------------------------------------------------------------

    // Exception: If refund is pending (requested but not done), allow ANY status change
    if (context.have_refund && !context.refund_done) {
      return null
    }

    // Exception: Only "Request Refund" action triggers waiting_refund, not manual status changes
    if (toStatus === 'waiting_refund') {
      return t('subsidy.errors.refundNotRequested', 'No refund has been requested for this subsidy')
    }

    // Validate using the Transition Map
    const type = context.is_for_advance ? 'advance' : 'normal'
    const allowedTransitions = SUBSIDY_TRANSITIONS[type][fromStatus] || []

    if (!allowedTransitions.includes(toStatus)) {
      // Provide user-friendly errors for specific blocked transitions
      if (fromStatus === 'closed') {
        return t('subsidy.errors.statusClosed', 'Status Closed cannot be changed')
      }
      
      if (context.is_for_advance) {
         if (fromStatus === 'approved') return t('subsidy.errors.invalidAdvanceTransition', 'Can only change to Waiting Documents or Advanced Closed')
         if (fromStatus === 'advanced_closed') return t('subsidy.errors.finalState', 'Advanced Closed can only change to Closed or Waiting Documents')
         if (fromStatus === 'waiting_documents') return t('subsidy.errors.finalState', 'Waiting Documents can only change to Closed or Waiting Refund')
      } else {
         if (toStatus === 'advanced_closed' || toStatus === 'waiting_documents') {
           return t('subsidy.errors.invalidNormalTransition', 'Normal subsidies cannot go to Advanced Closed or Waiting Documents')
         }
      }

      return t('subsidy.errors.invalidTransition', `Cannot move subsidy from ${fromStatus} to ${toStatus}`)
    }

    // ------------------------------------------------------------------------
    // 3. DOCUMENTS RESTRICTIONS
    // ------------------------------------------------------------------------
    
    if (['approved', 'closed', 'advanced_closed'].includes(toStatus) && context.hasRejectedDocuments) {
      return t('subsidy.errors.documentsRejected', 'Cannot approve or close with rejected documents')
    }

    if (['approved', 'closed', 'rejected', 'advanced_closed'].includes(toStatus) && context.hasPendingDocuments) {
      return t('subsidy.errors.documentsPending', 'All documents must be validated first')
    }

    return null // Null means no error -> Allowed
  }, [t])

  // Boolean helper
  const canChangeStatus = useCallback((
    from: string,
    to: string,
    context: SubsidyStatusContext,
    userContext: UserRoleContext
  ): boolean => {
    return getStatusChangeError(from, to, context, userContext) === null
  }, [getStatusChangeError])

  return {
    getStatusChangeError,
    canChangeStatus,
    preApprovedStatuses: PRE_APPROVED_STATUSES,
    postApprovedStatuses: POST_APPROVED_STATUSES,
    transitions: SUBSIDY_TRANSITIONS
  }
}
