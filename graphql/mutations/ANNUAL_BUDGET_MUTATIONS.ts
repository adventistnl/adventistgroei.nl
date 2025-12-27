import { gql } from "@apollo/client";

// INSTITUTION BUDGET MUTATIONS
export const CREATE_INSTITUTION_BUDGET_MUTATION = gql`
  mutation CreateInstitutionBudget($data: InstitutionBudgetCreateDto!) {
    createInstitutionBudget(data: $data) {
      year
      planned_budget
      total_expenses
      allocated_amount
      balance
      status
      priority
      category
      description
      justification
      notes
      is_locked
    }
  }
`;

export const UPDATE_INSTITUTION_BUDGET_MUTATION = gql`
  mutation UpdateInstitutionBudget(
    $id: String!
    $data: InstitutionBudgetUpdateDto!
  ) {
    updateInstitutionBudget(id: $id, data: $data) {
      id
      year
      planned_budget
      total_expenses
      allocated_amount
      balance
      status
      priority
      category
      description
      justification
      notes
      is_locked
      created_at
      updated_at
    }
  }
`;

// DEPARTMENT BUDGET MUTATIONS
export const CREATE_DEPARTMENT_BUDGET_MUTATION = gql`
  mutation CreateDepartmentBudget($data: DepartmentBudgetCreateDto!) {
    createDepartmentBudget(data: $data) {
      year
      planned_budget
      total_expenses
      allocated_amount
      balance
      status
      priority
      category
      description
      justification
      notes
      is_locked
    }
  }
`;

export const UPDATE_DEPARTMENT_BUDGET_MUTATION = gql`
  mutation UpdateDepartmentBudget(
    $id: String!
    $data: DepartmentBudgetUpdateDto!
  ) {
    updateDepartmentBudget(id: $id, data: $data) {
      id
      year
      planned_budget
      total_expenses
      allocated_amount
      balance
      status
      priority
      category
      description
      justification
      notes
      is_locked
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