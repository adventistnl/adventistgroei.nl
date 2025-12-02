/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnnualBudgetEntityType, AnnualBudgetStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateAnnualBudget
// ====================================================

export interface CreateAnnualBudget_createAnnualBudget {
  __typename: "AnnualBudget";
  id: string;
  year: number;
  planned_budget: any;
  total_expenses: any;
  balance: any;
  status: AnnualBudgetStatus;
  created_at: any;
  updated_at: any;
}

export interface CreateAnnualBudget {
  createAnnualBudget: CreateAnnualBudget_createAnnualBudget;
}

export interface CreateAnnualBudgetVariables {
  year: number;
  planned_budget: number;
  total_expenses?: number | null;
  description: string;
  justification?: string | null;
  allocated_amount: number;
  entity_type: AnnualBudgetEntityType;
  entity_id: string;
  notes?: string | null;
}
