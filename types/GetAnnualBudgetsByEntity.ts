/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnnualBudgetEntityType, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAnnualBudgetsByEntity
// ====================================================

export interface GetAnnualBudgetsByEntity_annualBudgets {
  __typename: "AnnualBudget";
  id: string;
  year: number;
  planned_budget: any;
  total_expenses: any;
  balance: any;
  notes: string | null;
  description: string | null;
  justification: string | null;
  approved_by: string | null;
  status: AnnualBudgetStatus;
  priority: AnnualBudgetPriority;
  category: AnnualBudgetCategory;
  entity_type: AnnualBudgetEntityType;
  institution_id: string | null;
  church_id: string | null;
  department_id: string | null;
  requested_amount: any;
  approved_amount: any | null;
  requested_by: string;
  reviewed_by: string | null;
  submitted_date: any;
  review_date: any | null;
  approval_date: any | null;
  documents: any | null;
  is_locked: boolean;
  has_budget_record: boolean;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
}

export interface GetAnnualBudgetsByEntity {
  annualBudgets: GetAnnualBudgetsByEntity_annualBudgets[];
}

export interface GetAnnualBudgetsByEntityVariables {
  entityId: string;
  entityType: AnnualBudgetEntityType;
}
