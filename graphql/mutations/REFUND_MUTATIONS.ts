import { gql } from "@apollo/client";

/**
 * Request a refund for a subsidy
 */
export const REQUEST_SUBSIDY_REFUND = gql`
  mutation RequestSubsidyRefund(
    $id: String!
    $refundAmount: Float!
    $reason: String!
    $language: LanguagePreference
  ) {
    requestSubsidyRefund(
      id: $id
      refundAmount: $refundAmount
      reason: $reason
      language: $language
    ) {
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

/**
 * Get subsidies waiting for refund processing
 */
export const GET_SUBSIDIES_WAITING_REFUND = gql`
  query GetSubsidiesWaitingRefund($institutionId: String) {
    getSubsidiesWaitingRefund(institutionId: $institutionId) {
      id
      description
      refund_amount
      have_refund
      refund_done
      created_at
      requester {
        id
        name
        email
      }
      institution {
        id
        name
      }
      department {
        id
        name
      }
      subsidy_status {
        id
        name
      }
    }
  }
`;
