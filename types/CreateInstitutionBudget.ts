/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InstitutionBudgetCreateDto, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateInstitutionBudget
// ====================================================

export interface CreateInstitutionBudget_createInstitutionBudget {
  __typename: "AnnualBudget";
  year: number;
  planned_budget: any;
  total_expenses: number;
  allocated_amount: number;
  balance: number;
  status: AnnualBudgetStatus;
  priority: AnnualBudgetPriority;
  category: AnnualBudgetCategory;
  description: string | null;
  justification: string | null;
  notes: string | null;
  is_locked: boolean;
}

export interface CreateInstitutionBudget {
  createInstitutionBudget: CreateInstitutionBudget_createInstitutionBudget;
}

export interface CreateInstitutionBudgetVariables {
  data: InstitutionBudgetCreateDto;
}
