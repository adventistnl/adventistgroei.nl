/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnnualBudgetUpdateDto, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateAnnualBudget
// ====================================================

export interface UpdateAnnualBudget_updateAnnualBudget {
  __typename: "AnnualBudget";
  id: string;
  year: number;
  planned_budget: any;
  total_expenses: any;
  balance: any;
  status: AnnualBudgetStatus;
  priority: AnnualBudgetPriority;
  category: AnnualBudgetCategory;
  requested_by: string;
  submitted_date: any;
  created_at: any;
  updated_at: any;
}

export interface UpdateAnnualBudget {
  updateAnnualBudget: UpdateAnnualBudget_updateAnnualBudget;
}

export interface UpdateAnnualBudgetVariables {
  id: string;
  data: AnnualBudgetUpdateDto;
}
