/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory, AnnualBudgetEntityType, GenderType, LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL fragment: ChurchFragment
// ====================================================

export interface ChurchFragment_contact {
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

export interface ChurchFragment_annual_budgets {
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
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  institution_id: string | null;
  church_id: string | null;
  department_id: string | null;
  requested_amount: any;
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
}

export interface ChurchFragment_departments_contact {
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

export interface ChurchFragment_departments_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface ChurchFragment_departments_annual_budgets {
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
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  institution_id: string | null;
  church_id: string | null;
  department_id: string | null;
  requested_amount: any;
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
}

export interface ChurchFragment_departments_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
}

export interface ChurchFragment_departments_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: ChurchFragment_departments_users_user_roles_role;
}

export interface ChurchFragment_departments_users {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  gender: GenderType | null;
  is_deleted: boolean;
  language_preference: LanguagePreference;
  user_roles: ChurchFragment_departments_users_user_roles[] | null;
}

export interface ChurchFragment_departments {
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
  contact: ChurchFragment_departments_contact | null;
  church: ChurchFragment_departments_church | null;
  annual_budgets: ChurchFragment_departments_annual_budgets[] | null;
  users: ChurchFragment_departments_users[] | null;
}

export interface ChurchFragment_region {
  __typename: "Region";
  id: string;
  name: string;
}

export interface ChurchFragment_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
}

export interface ChurchFragment_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: ChurchFragment_users_user_roles_role;
}

export interface ChurchFragment_users {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  gender: GenderType | null;
  is_deleted: boolean;
  language_preference: LanguagePreference;
  user_roles: ChurchFragment_users_user_roles[] | null;
}

export interface ChurchFragment {
  __typename: "Church";
  id: string;
  institution_id: string;
  name: string;
  region_id: string | null;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  type: ChurchType;
  contact: ChurchFragment_contact | null;
  annual_budgets: ChurchFragment_annual_budgets[] | null;
  departments: ChurchFragment_departments[] | null;
  region: ChurchFragment_region | null;
  users: ChurchFragment_users[] | null;
}
