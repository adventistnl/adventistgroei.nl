/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory, AnnualBudgetEntityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAnnualBudgetById
// ====================================================

export interface GetAnnualBudgetById_annualBudget_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetAnnualBudgetById_annualBudget_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetAnnualBudgetById_annualBudget_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetAnnualBudgetById_annualBudget_approved_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetAnnualBudgetById_annualBudget {
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
  allocated_amount: any;
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
  institution: GetAnnualBudgetById_annualBudget_institution | null;
  church: GetAnnualBudgetById_annualBudget_church | null;
  department: GetAnnualBudgetById_annualBudget_department | null;
  approved_user: GetAnnualBudgetById_annualBudget_approved_user | null;
}

export interface GetAnnualBudgetById {
  annualBudget: GetAnnualBudgetById_annualBudget | null;
}

export interface GetAnnualBudgetByIdVariables {
  id: string;
}
