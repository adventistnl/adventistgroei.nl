/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DepartmentFragment
// ====================================================

export interface DepartmentFragment_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  full_address: string | null;
  postal_code: string | null;
  website: string | null;
  notes: string | null;
  is_primary: boolean;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface DepartmentFragment_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface DepartmentFragment_annual_budgets {
  __typename: "AnnualBudget";
  year: number;
  planned_budget: any;
  total_expenses: any;
}

export interface DepartmentFragment_users {
  __typename: "User";
  id: string;
}

export interface DepartmentFragment {
  __typename: "Department";
  id: string;
  institution_id: string;
  church_id: string | null;
  name: string;
  description: string;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact: DepartmentFragment_contact | null;
  church: DepartmentFragment_church | null;
  annual_budgets: DepartmentFragment_annual_budgets[] | null;
  users: DepartmentFragment_users[] | null;
}
