import { gql } from "@apollo/client";

/**
 * Create a new subsidy request with items
 */
export const CREATE_SUBSIDY_REQUEST = gql`
  mutation CreateSubsidyRequest($data: SubsidyRequestCreateDto!, $language: LanguagePreference) {
    createSubsidyRequest(data: $data, language: $language) {
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
      }
      church {
        id
        name
      }
      items {
        id
        subsidy_request_id
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
    }
  }
`;

/**
 * Update an existing subsidy request
 */
export const UPDATE_SUBSIDY_REQUEST = gql`
  mutation UpdateSubsidyRequest($id: String!, $data: SubsidyRequestUpdateDto!, $language: LanguagePreference) {
    updateSubsidyRequest(id: $id, data: $data, language: $language) {
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
      }
      church {
        id
        name
      }
      items {
        id
        subsidy_request_id
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
    }
  }
`;

/**
 * Approve a subsidy request
 */
export const APPROVE_SUBSIDY_REQUEST = gql`
  mutation ApproveSubsidyRequest($id: String!, $approved_amount: Float!, $language: LanguagePreference) {
    approveSubsidyRequest(id: $id, approved_amount: $approved_amount, language: $language) {
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
      }
      church {
        id
        name
      }
      items {
        id
        subsidy_request_id
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
    }
  }
`;

/**
 * Reject a subsidy request
 */
export const REJECT_SUBSIDY_REQUEST = gql`
  mutation RejectSubsidyRequest($id: String!, $rejection_reason: String!, $language: LanguagePreference) {
    rejectSubsidyRequest(id: $id, rejection_reason: $rejection_reason, language: $language) {
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
      }
      church {
        id
        name
      }
      items {
        id
        subsidy_request_id
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
    }
  }
`;

/**
 * Delete a subsidy request (soft delete)
 */
export const DELETE_SUBSIDY_REQUEST = gql`
  mutation DeleteSubsidyRequest($id: String!, $language: LanguagePreference) {
    deleteSubsidyRequest(id: $id, language: $language) {
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
      subsidy_status {
        id
        name
        description
      }
    }
  }
`;

/**
 * Get all subsidy requests for a project
 */
export const GET_SUBSIDY_REQUESTS_BY_PROJECT = gql`
  query GetSubsidyRequestsByProject($project_id: String!) {
    subsidyRequests(project_id: $project_id) {
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
      }
      church {
        id
        name
      }
      items {
        id
        subsidy_request_id
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
    }
  }
`;

/**
 * Get a single subsidy request by ID
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
      priority
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
      }
      church {
        id
        name
      }
      items {
        id
        subsidy_request_id
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
    }
  }
`;

/**
 * Add a message to subsidy request history
 */
export const ADD_SUBSIDY_REQUEST_MESSAGE = gql`
  mutation AddSubsidyRequestMessage($id: String!, $message: String!, $language: LanguagePreference) {
    addSubsidyRequestMessage(id: $id, message: $message, language: $language) {
      id
      subsidy_request_id
      status_id
      type
      reason
      changed_by
      changed_at
      status {
        id
        name
      }
      user {
        id
        name
      }
    }
  }
`;

/**
 * Update a subsidy request message
 */
export const UPDATE_SUBSIDY_REQUEST_MESSAGE = gql`
  mutation UpdateSubsidyRequestMessage($id: String!, $message: String!, $language: LanguagePreference) {
    updateSubsidyRequestMessage(id: $id, message: $message, language: $language) {
      id
      reason
      changed_at
    }
  }
`;

/**
 * Delete a subsidy request message
 */
export const DELETE_SUBSIDY_REQUEST_MESSAGE = gql`
  mutation DeleteSubsidyRequestMessage($id: String!, $language: LanguagePreference) {
    deleteSubsidyRequestMessage(id: $id, language: $language) {
      id
    }
  }
`;

/**
 * Create an advance request for a project
 */
export const CREATE_ADVANCE_REQUEST = gql`
  mutation CreateAdvanceRequest($projectId: String!, $advanceAmount: Float!, $language: LanguagePreference) {
    createAdvanceRequest(projectId: $projectId, advanceAmount: $advanceAmount, language: $language) {
      id
      description
      total_budget
      is_for_advance
      advance_amount
      created_at
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
      }
      church {
        id
        name
      }
      project {
        id
        title
      }
    }
  }
`;
