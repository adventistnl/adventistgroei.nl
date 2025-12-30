import { gql } from "@apollo/client";

/**
 * Create a new subsidy request with items
 */
export const CREATE_SUBSIDY_REQUEST = gql`
  mutation CreateSubsidyRequest($data: SubsidyRequestCreateDto!) {
    createSubsidyRequest(data: $data) {
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
  mutation UpdateSubsidyRequest($id: String!, $data: SubsidyRequestUpdateDto!) {
    updateSubsidyRequest(id: $id, data: $data) {
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
  mutation ApproveSubsidyRequest($id: String!, $approved_amount: Float!) {
    approveSubsidyRequest(id: $id, approved_amount: $approved_amount) {
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
  mutation RejectSubsidyRequest($id: String!, $rejection_reason: String!) {
    rejectSubsidyRequest(id: $id, rejection_reason: $rejection_reason) {
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
  mutation DeleteSubsidyRequest($id: String!) {
    deleteSubsidyRequest(id: $id) {
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
