/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ApproveAnnualBudgetDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ApproveAnnualBudget
// ====================================================

export interface ApproveAnnualBudget_approveAnnualBudget {
  __typename: "ApproveBudgetResponse";
  id: string;
  status: string;
  approved_amount: number | null;
  approval_date: any | null;
  approved_by: string | null;
  notes: string | null;
  updated_at: any;
}

export interface ApproveAnnualBudget {
  approveAnnualBudget: ApproveAnnualBudget_approveAnnualBudget;
}

export interface ApproveAnnualBudgetVariables {
  id: string;
  data: ApproveAnnualBudgetDto;
}
