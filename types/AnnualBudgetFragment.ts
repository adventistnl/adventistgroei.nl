/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory, AnnualBudgetEntityType } from "./globalTypes";

// ====================================================
// GraphQL fragment: AnnualBudgetFragment
// ====================================================

export interface AnnualBudgetFragment {
  __typename: "AnnualBudget";
  id: string;
  year: number;
  planned_budget: any;
  total_expenses: number;
  balance: number;
  status: AnnualBudgetStatus;
  priority: AnnualBudgetPriority;
  category: AnnualBudgetCategory;
  requested_by: string;
  submitted_date: any;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  institution_id: string | null;
  church_id: string | null;
  department_id: string | null;
  allocated_amount: number;
  approved_amount: any | null;
  reviewed_by: string | null;
  review_date: any | null;
  approval_date: any | null;
  notes: string | null;
  description: string | null;
  justification: string | null;
  documents: any | null;
  is_locked: boolean;
  has_budget_record: boolean;
  entity_type: AnnualBudgetEntityType;
  approvedAmount: number;
  spentAmount: number;
  usagePercentage: number;
  remainingAmount: number;
}
