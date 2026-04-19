/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory, AnnualBudgetEntityType, LanguagePreference } from "./globalTypes";

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

export interface DepartmentFragment_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface DepartmentFragment_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface DepartmentFragment_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface DepartmentFragment_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
}

export interface DepartmentFragment_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: DepartmentFragment_users_user_roles_role;
}

export interface DepartmentFragment_users {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  language_preference: LanguagePreference;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact_id: string | null;
  institution_id: string;
  contact: DepartmentFragment_users_contact | null;
  institution: DepartmentFragment_users_institution;
  church: DepartmentFragment_users_church | null;
  user_roles: DepartmentFragment_users_user_roles[] | null;
}

export interface DepartmentFragment {
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
  contact: DepartmentFragment_contact | null;
  church: DepartmentFragment_church | null;
  annual_budgets: DepartmentFragment_annual_budgets[];
  users: DepartmentFragment_users[] | null;
}
