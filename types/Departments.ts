/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Departments
// ====================================================

export interface Departments_departments_annual_budgets {
  __typename: "AnnualBudget";
  id: string;
  year: number;
  is_locked: boolean;
  allocated_amount: number;
  total_expenses: number;
}

export interface Departments_departments_users {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Departments_departments {
  __typename: "Department";
  id: string;
  institution_id: string;
  church_id: string | null;
  name: string;
  description: string;
  contact_id: string | null;
  leader_id: string;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  annual_budgets: Departments_departments_annual_budgets[];
  users: Departments_departments_users[] | null;
}

export interface Departments {
  departments: Departments_departments[];
}

export interface DepartmentsVariables {
  institution_id?: string | null;
}
