import { gql } from "@apollo/client";

/**
 * Validate (approve) a subsidy receipt.
 * Permission: VALIDATE_SUBSIDY_RECEIPT (ADMIN, FINANCIAL_MANAGER, INSTITUTIONAL_LEADER)
 */
export const VALIDATE_SUBSIDY_RECEIPT = gql`
  mutation ValidateSubsidyReceipt($id: ID!, $note: String) {
    validateSubsidyReceipt(id: $id, note: $note) {
      id
      filename
      is_validated
      approved
      validated_at
      validated_by
      note
      amount
      file_url
      subsidy_request {
        id
        subsidy_statuses_id
      }
    }
  }
`;

/**
 * Reject a subsidy receipt.
 * Permission: VALIDATE_SUBSIDY_RECEIPT (same as validate — ADMIN, FINANCIAL_MANAGER, INSTITUTIONAL_LEADER)
 */
export const REJECT_SUBSIDY_RECEIPT = gql`
  mutation RejectSubsidyReceipt($id: ID!, $reason: String) {
    rejectSubsidyReceipt(id: $id, reason: $reason) {
      id
      filename
      is_validated
      approved
      validated_at
      validated_by
      rejection_reason
      amount
      file_url
      subsidy_request {
        id
        subsidy_statuses_id
      }
    }
  }
`;

/**
 * Request a refund for a subsidy
 */
export const REQUEST_SUBSIDY_REFUND = gql`
  mutation RequestSubsidyRefund(
    $id: String!
    $refundAmount: Float!
    $refundType: String!
    $reason: String!
    $language: LanguagePreference
  ) {
    requestSubsidyRefund(
      id: $id
      refundAmount: $refundAmount
      refundType: $refundType
      reason: $reason
      language: $language
    ) {
      id
      refund_amount
      refund_type
      have_refund
      refund_done
      subsidy_status {
        id
        name
      }
    }
  }
`;

/**
 * Reject a requested refund
 */
export const REJECT_SUBSIDY_REFUND = gql`
  mutation RejectSubsidyRefund(
    $id: String!
    $reason: String!
    $language: LanguagePreference
  ) {
    rejectSubsidyRefund(
      id: $id
      reason: $reason
      language: $language
    ) {
      id
      refund_rejected
      subsidy_status {
        id
        name
      }
    }
  }
`;

/**
 * Confirm that refund has been processed
 */
export const CONFIRM_REFUND_DONE = gql`
  mutation ConfirmRefundDone($id: String!, $language: LanguagePreference) {
    confirmRefundDone(id: $id, language: $language) {
      id
      refund_amount
      have_refund
      refund_done
      subsidy_status {
        id
        name
      }
    }
  }
`;

