/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ApproveAnnualBudget
// ====================================================

export interface ApproveAnnualBudget_approveAnnualBudget {
  __typename: "AnnualBudget";
  id: string;
  status: string;
  approved_amount: any;
  approval_date: any;
  approved_by: string;
  notes: string;
  updated_at: any;
}

export interface ApproveAnnualBudget {
  approveAnnualBudget: ApproveAnnualBudget_approveAnnualBudget;
}

export interface ApproveAnnualBudgetVariables {
  id: string;
  approvedAmount?: number | null;
  notes?: string | null;
}