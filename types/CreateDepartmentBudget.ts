/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DepartmentBudgetCreateDto, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateDepartmentBudget
// ====================================================

export interface CreateDepartmentBudget_createDepartmentBudget {
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

export interface CreateDepartmentBudget {
  createDepartmentBudget: CreateDepartmentBudget_createDepartmentBudget;
}

export interface CreateDepartmentBudgetVariables {
  data: DepartmentBudgetCreateDto;
}
