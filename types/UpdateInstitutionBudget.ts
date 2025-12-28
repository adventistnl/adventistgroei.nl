/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InstitutionBudgetUpdateDto, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateInstitutionBudget
// ====================================================

export interface UpdateInstitutionBudget_updateInstitutionBudget {
  __typename: "AnnualBudget";
  id: string;
  year: number;
  planned_budget: any;
  total_expenses: any;
  allocated_amount: any;
  balance: any;
  status: AnnualBudgetStatus;
  priority: AnnualBudgetPriority;
  category: AnnualBudgetCategory;
  description: string | null;
  justification: string | null;
  notes: string | null;
  is_locked: boolean;
  created_at: any;
  updated_at: any;
}

export interface UpdateInstitutionBudget {
  updateInstitutionBudget: UpdateInstitutionBudget_updateInstitutionBudget;
}

export interface UpdateInstitutionBudgetVariables {
  id: string;
  data: InstitutionBudgetUpdateDto;
}
