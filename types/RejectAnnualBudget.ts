/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RejectAnnualBudget
// ====================================================

export interface RejectAnnualBudget_rejectAnnualBudget {
  __typename: "AnnualBudget";
  id: string;
  status: string;
  review_date: any;
  reviewed_by: string;
  notes: string;
  updated_at: any;
}

export interface RejectAnnualBudget {
  rejectAnnualBudget: RejectAnnualBudget_rejectAnnualBudget;
}

export interface RejectAnnualBudgetVariables {
  id: string;
  reason: string;
}