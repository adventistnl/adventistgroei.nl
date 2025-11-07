/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, ProjectType, GenderType, ChurchType } from "./globalTypes";

// ====================================================
// GraphQL fragment: InstitutionFragment
// ====================================================

export interface InstitutionFragment_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
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

export interface InstitutionFragment_subsidy_requests {
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
  church_id: string;
  subsidy_statuses_id: string;
  project_id: string;
}

export interface InstitutionFragment_direct_messages {
  __typename: "DirectMessage";
  id: string;
  institution_id: string;
  sender_id: string;
  title: string;
  content: string;
  status: string;
  sent_at: any;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionFragment_projects {
  __typename: "Project";
  id: string;
  department_id: string;
  title: string;
  description: string;
  budget: any;
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

export interface InstitutionFragment_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface InstitutionFragment_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface InstitutionFragment_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
}

export interface InstitutionFragment_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: InstitutionFragment_users_user_roles_role;
}

export interface InstitutionFragment_users {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  password: string;
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
  gender: GenderType | null;
  church: InstitutionFragment_users_church | null;
  institution: InstitutionFragment_users_institution;
  user_roles: InstitutionFragment_users_user_roles[] | null;
}

export interface InstitutionFragment_churches_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
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

export interface InstitutionFragment_churches_annual_budgets {
  __typename: "AnnualBudget";
  year: number;
  planned_budget: any;
  total_expenses: any;
}

export interface InstitutionFragment_churches_departments_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
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

export interface InstitutionFragment_churches_departments_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface InstitutionFragment_churches_departments_annual_budgets {
  __typename: "AnnualBudget";
  year: number;
  planned_budget: any;
  total_expenses: any;
}

export interface InstitutionFragment_churches_departments_users {
  __typename: "User";
  id: string;
}

export interface InstitutionFragment_churches_departments {
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
  contact: InstitutionFragment_churches_departments_contact | null;
  church: InstitutionFragment_churches_departments_church | null;
  annual_budgets: InstitutionFragment_churches_departments_annual_budgets[] | null;
  users: InstitutionFragment_churches_departments_users[] | null;
}

export interface InstitutionFragment_churches_region {
  __typename: "Region";
  id: string;
  name: string;
}

export interface InstitutionFragment_churches_users {
  __typename: "User";
  id: string;
}

export interface InstitutionFragment_churches {
  __typename: "Church";
  id: string;
  institution_id: string;
  name: string;
  region_id: string;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  type: ChurchType;
  contact: InstitutionFragment_churches_contact | null;
  annual_budgets: InstitutionFragment_churches_annual_budgets[] | null;
  departments: InstitutionFragment_churches_departments[] | null;
  region: InstitutionFragment_churches_region;
  users: InstitutionFragment_churches_users[] | null;
}

export interface InstitutionFragment_departments_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
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

export interface InstitutionFragment_departments_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface InstitutionFragment_departments_annual_budgets {
  __typename: "AnnualBudget";
  year: number;
  planned_budget: any;
  total_expenses: any;
}

export interface InstitutionFragment_departments_users {
  __typename: "User";
  id: string;
}

export interface InstitutionFragment_departments {
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
  contact: InstitutionFragment_departments_contact | null;
  church: InstitutionFragment_departments_church | null;
  annual_budgets: InstitutionFragment_departments_annual_budgets[] | null;
  users: InstitutionFragment_departments_users[] | null;
}

export interface InstitutionFragment {
  __typename: "Institution";
  id: string;
  name: string;
  denomination: string;
  description: string | null;
  language_preference: LanguagePreference;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  churches_count: number;
  departments_count: number;
  users_count: number;
  contact: InstitutionFragment_contact | null;
  subsidy_requests: InstitutionFragment_subsidy_requests[];
  direct_messages: InstitutionFragment_direct_messages[];
  projects: InstitutionFragment_projects[] | null;
  users: InstitutionFragment_users[] | null;
  churches: InstitutionFragment_churches[] | null;
  departments: InstitutionFragment_departments[] | null;
}
