import { gql } from "@apollo/client";

/**
 * Query to fetch all subsidy requests
 * OPTIMIZED: Removed institution.users (use InstitutionContext instead)
 * OPTIMIZED: Removed redundant fields (leader_id, subsidy_request_id)
 */
export const GET_ALL_SUBSIDY_REQUESTS = gql`
  query GetAllSubsidyRequests {
    subsidyRequests {
      id
      description
      total_budget
      approved_amount
      rejection_reason
      created_at
      updated_at
      approved_at
      created_by
      updated_by
      approved_by
      institution_id
      department_id
      church_id
      project_id
      is_for_advance
      advance_amount
      refund_amount
      have_refund
      refund_done
      subsidy_statuses_id
      subsidy_status {
        id
        name
        description
      }
      institution {
        id
        name
      }
      department {
        id
        name
        leader {
          id
          name
          email
          language_preference
        }
      }
      church {
        id
        name
      }
      project {
        id
        title
        owner_id
        owner {
          id
          name
          email
          language_preference
        }
      }
      items {
        id
        project_activity_id
        requested_amount
        approved_amount
        notes
        created_at
        updated_at
        project_activity {
          id
          name
          description
          budget_amount
          status
          priority
          is_subsidized
        }
      }
      receipts: subsidy_receipts {
         id
         is_validated
      }
      collaborators {
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;

/**
 * List subsidy requests flagged for refund (have_refund = true).
 * Visible to Admin / Institutional Dept. Leader / Financial Manager.
 */
export const GET_SUBSIDIES_WAITING_REFUND = gql`
  query GetSubsidiesWaitingRefund($institutionId: String) {
    getSubsidiesWaitingRefund(institutionId: $institutionId) {
      id
      description
      total_budget
      approved_amount
      refund_amount
      have_refund
      refund_done
      created_at
      subsidy_status {
        id
        name
      }
      requester {
        id
        name
        email
      }
      project {
        id
        title
      }
      institution {
        id
        name
      }
      department {
        id
        name
      }
      church {
        id
        name
      }
    }
  }
`;
/**
 * Query to fetch a single subsidy request by ID
 */
export const GET_SUBSIDY_REQUEST_BY_ID = gql`
  query GetSubsidyRequestById($id: String!) {
    subsidyRequest(id: $id) {
      id
      description
      total_budget
      approved_amount
      rejection_reason
      created_at
      updated_at
      approved_at
      created_by
      updated_by
      approved_by
      institution_id
      department_id
      church_id
      project_id
      is_for_advance
      advance_amount
      refund_amount
      have_refund
      refund_done
      subsidy_statuses_id
      subsidy_status {
        id
        name
        description
      }
      institution {
        id
        name
      }
      # ✅ created_by (requester ID) - we'll find the user in institution.users from InstitutionContext
      created_by
      department {
        id
        name
        leader {
          id
          name
          email
          language_preference
        }
      }
      church {
        id
        name
      }
      request_type
      project {
        id
        title
        department_id
        owner_id
        co_owner_id
        owner {
          id
          name
          email
          language_preference
        }
        co_owner {
          id
          name
          email
        }
        # REMOVED: department field causes error when project.department_id is NULL
        # Backend schema defines Project.department as non-nullable, but DB allows NULL
        # We prioritize subsidy.department anyway, so this fallback is not critical
      }
      items {
        id
        project_activity_id
        requested_amount
        approved_amount
        notes
        created_at
        updated_at
        project_activity {
          id
          name
          description
          budget_amount
          status
          priority
          is_subsidized
        }
      }
      receipts: subsidy_receipts {
         id
         is_validated
      }
      collaborators {
        role
        user {
          id
          name
          email
        }
      }
    }
  }
`;
