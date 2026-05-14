/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DepartmentBudgetUpdateDto, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateDepartmentBudget
// ====================================================

export interface UpdateDepartmentBudget_updateDepartmentBudget {
  __typename: "AnnualBudget";
  id: string;
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
  created_at: any;
  updated_at: any;
}

export interface UpdateDepartmentBudget {
  updateDepartmentBudget: UpdateDepartmentBudget_updateDepartmentBudget;
}

export interface UpdateDepartmentBudgetVariables {
  id: string;
  data: DepartmentBudgetUpdateDto;
}
