import { gql } from "@apollo/client";

export const CREATE_ANNUAL_BUDGET_MUTATION = gql`
  mutation CreateAnnualBudget(
    $year: Int!
    $planned_budget: Float!
    $total_expenses: Float
    $description: String!
    $justification: String
    $allocated_amount: Float!
    $entity_type: AnnualBudgetEntityType!
    $entity_id: String!
    $notes: String
  ) {
    createAnnualBudget(
      data: {
        year: $year
        planned_budget: $planned_budget
        total_expenses: $total_expenses
        description: $description
        justification: $justification
        allocated_amount: $allocated_amount
        entity_type: $entity_type
        entity_id: $entity_id
        notes: $notes
      }
    ) {
      id
      year
      planned_budget
      total_expenses
      balance
      status
      created_at
      updated_at
    }
  }
`;

export const UPDATE_ANNUAL_BUDGET_MUTATION = gql`
  mutation UpdateAnnualBudget(
    $id: String!
    $data: AnnualBudgetUpdateDto!
  ) {
    updateAnnualBudget(
      id: $id
      data: $data
    ) {
      id
      year
      planned_budget
      total_expenses
      balance
      status
      priority
      category
      requested_by
      submitted_date
      created_at
      updated_at
    }
  }
`;

// export const DELETE_ANNUAL_BUDGET_MUTATION = gql`
//   mutation DeleteAnnualBudget($id: String!) {
//     deleteAnnualBudget(id: $id) {
//       success
//       message
//     }
//   }
// `;

export const DELETE_ANNUAL_BUDGET_MUTATION = gql`
  mutation DeleteAnnualBudget($id: String!) {
    deleteAnnualBudget(id: $id) {
      success
      message
    }
  }
`;

// export const APPROVE_ANNUAL_BUDGET_MUTATION = gql`
//   mutation ApproveAnnualBudget($id: String!, $approvedAmount: Float, $notes: String) {
//     approveAnnualBudget(id: $id, approvedAmount: $approvedAmount, notes: $notes) {
//       id
//       status
//       approved_amount
//       approval_date
//       approved_by
//       notes
//       updated_at
//     }
//   }
// `;

export const APPROVE_ANNUAL_BUDGET_MUTATION = gql`
  mutation ApproveAnnualBudget($id: String!, $data: ApproveAnnualBudgetDto!) {
    approveAnnualBudget(id: $id, data: $data) {
      id
      status
      approved_amount
      approval_date
      approved_by
      notes
      updated_at
    }
  }
`;

// export const REJECT_ANNUAL_BUDGET_MUTATION = gql`
//   mutation RejectAnnualBudget($id: String!, $reason: String) {
//     rejectAnnualBudget(id: $id, reason: $reason) {
//       id
//       status
//       review_date
//       reviewed_by
//       notes
//       updated_at
//     }
//   }
// `;

export const REJECT_ANNUAL_BUDGET_MUTATION = gql`
  mutation RejectAnnualBudget($id: String!, $data: RejectAnnualBudgetDto!) {
    rejectAnnualBudget(id: $id, data: $data) {
      id
      status
      review_date
      reviewed_by
      notes
      updated_at
    }
  }
`;

// export const REQUEST_REVISION_ANNUAL_BUDGET_MUTATION = gql`
//   mutation RequestRevision($id: String!, $revisionNotes: String) {
//     requestRevision(id: $id, revisionNotes: $revisionNotes) {
//       id
//       status
//       review_date
//       reviewed_by
//       notes
//       updated_at
//     }
//   }
// `;

export const REQUEST_REVISION_ANNUAL_BUDGET_MUTATION = gql`
  mutation RequestRevisionAnnualBudget($id: String!, $data: RequestRevisionAnnualBudgetDto!) {
    requestRevisionAnnualBudget(id: $id, data: $data) {
      id
      status
      review_date
      reviewed_by
      notes
      updated_at
    }
  }
`;

// export const TOGGLE_BUDGET_LOCK_MUTATION = gql`
//   mutation ToggleBudgetLock($id: String!) {
//     toggleBudgetLock(id: $id) {
//       id
//       is_locked
//       updated_at
//     }
//   }
// `;

export const TOGGLE_BUDGET_LOCK_MUTATION = gql`
  mutation ToggleBudgetLock($id: String!) {
    toggleBudgetLock(id: $id) {
      id
      is_locked
      updated_at
    }
  }
`;