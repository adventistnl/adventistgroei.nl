/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory, AnnualBudgetEntityType, LanguagePreference, ProjectType } from "./globalTypes";

// ====================================================
// GraphQL fragment: ChurchFragment
// ====================================================

export interface ChurchFragment_leader {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

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
  allocated_amount: any;
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

export interface ChurchFragment_departments_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface ChurchFragment_departments_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface ChurchFragment_departments_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface ChurchFragment_departments_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
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
  contact: ChurchFragment_departments_users_contact | null;
  institution: ChurchFragment_departments_users_institution;
  church: ChurchFragment_departments_users_church | null;
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
  leader_id: string;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact: ChurchFragment_departments_contact | null;
  church: ChurchFragment_departments_church | null;
  annual_budgets: ChurchFragment_departments_annual_budgets[];
  users: ChurchFragment_departments_users[] | null;
}

export interface ChurchFragment_region {
  __typename: "Region";
  id: string;
  name: string;
}

export interface ChurchFragment_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface ChurchFragment_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface ChurchFragment_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface ChurchFragment_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
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
  contact: ChurchFragment_users_contact | null;
  institution: ChurchFragment_users_institution;
  church: ChurchFragment_users_church | null;
  user_roles: ChurchFragment_users_user_roles[] | null;
}

export interface ChurchFragment_subsidy_requests {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  total_budget: any;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  institution_id: string;
  requester_id: string;
  department_id: string;
  church_id: string | null;
  subsidy_statuses_id: string;
  project_id: string;
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
  allocated_amount: any;
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

export interface ChurchFragment_projects {
  __typename: "Project";
  id: string;
  department_id: string;
  title: string;
  description: string;
  budget: any;
  subsidized_budget: any;
  balance: any;
  language_preference: LanguagePreference;
  type: ProjectType;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  event_id: string | null;
  institution_id: string | null;
}

export interface ChurchFragment {
  __typename: "Church";
  id: string;
  institution_id: string;
  name: string;
  region_id: string | null;
  contact_id: string | null;
  leader_id: string;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  type: ChurchType;
  leader: ChurchFragment_leader;
  contact: ChurchFragment_contact | null;
  departments: ChurchFragment_departments[] | null;
  region: ChurchFragment_region | null;
  users: ChurchFragment_users[] | null;
  subsidy_requests: ChurchFragment_subsidy_requests[] | null;
  annual_budgets: ChurchFragment_annual_budgets[] | null;
  projects: ChurchFragment_projects[] | null;
}
