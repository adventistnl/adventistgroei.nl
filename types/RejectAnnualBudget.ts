/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RejectAnnualBudgetDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RejectAnnualBudget
// ====================================================

export interface RejectAnnualBudget_rejectAnnualBudget {
  __typename: "RejectBudgetResponse";
  id: string;
  status: string;
  review_date: any;
  reviewed_by: string;
  notes: string | null;
  updated_at: any;
}

export interface RejectAnnualBudget {
  rejectAnnualBudget: RejectAnnualBudget_rejectAnnualBudget;
}

export interface RejectAnnualBudgetVariables {
  id: string;
  data: RejectAnnualBudgetDto;
}
