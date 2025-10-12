/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAnnualBudget
// ====================================================

export interface CreateAnnualBudget_createAnnualBudget {
  __typename: "AnnualBudget";
  id: string;
}

export interface CreateAnnualBudget {
  createAnnualBudget: CreateAnnualBudget_createAnnualBudget;
}

export interface CreateAnnualBudgetVariables {
  year: number;
  planned_budget: number;
  entity_type: string;
  entity_id: string;
  description: string;
  justification?: string | null;
}
