/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestRevisionAnnualBudgetDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RequestRevisionAnnualBudget
// ====================================================

export interface RequestRevisionAnnualBudget_requestRevisionAnnualBudget {
  __typename: "RequestRevisionBudgetResponse";
  id: string;
  status: string;
  review_date: any;
  reviewed_by: string;
  notes: string | null;
  updated_at: any;
}

export interface RequestRevisionAnnualBudget {
  requestRevisionAnnualBudget: RequestRevisionAnnualBudget_requestRevisionAnnualBudget;
}

export interface RequestRevisionAnnualBudgetVariables {
  id: string;
  data: RequestRevisionAnnualBudgetDto;
}
