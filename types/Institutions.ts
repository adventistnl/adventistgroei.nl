/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, AnnualBudgetStatus, AnnualBudgetPriority, AnnualBudgetCategory, AnnualBudgetEntityType, ProjectType, ChurchType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Institutions
// ====================================================

export interface Institutions_institutions_contact {
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

export interface Institutions_institutions_annual_budgets {
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

export interface Institutions_institutions_subsidy_requests {
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

export interface Institutions_institutions_direct_messages {
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

export interface Institutions_institutions_projects {
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

export interface Institutions_institutions_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface Institutions_institutions_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface Institutions_institutions_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Institutions_institutions_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
}

export interface Institutions_institutions_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: Institutions_institutions_users_user_roles_role;
}

export interface Institutions_institutions_users {
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
  contact: Institutions_institutions_users_contact | null;
  institution: Institutions_institutions_users_institution;
  church: Institutions_institutions_users_church | null;
  user_roles: Institutions_institutions_users_user_roles[] | null;
}

export interface Institutions_institutions_churches_leader {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Institutions_institutions_churches_contact {
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

export interface Institutions_institutions_churches_departments_contact {
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

export interface Institutions_institutions_churches_departments_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Institutions_institutions_churches_departments_annual_budgets {
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

export interface Institutions_institutions_churches_departments_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface Institutions_institutions_churches_departments_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface Institutions_institutions_churches_departments_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Institutions_institutions_churches_departments_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
}

export interface Institutions_institutions_churches_departments_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: Institutions_institutions_churches_departments_users_user_roles_role;
}

export interface Institutions_institutions_churches_departments_users {
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
  contact: Institutions_institutions_churches_departments_users_contact | null;
  institution: Institutions_institutions_churches_departments_users_institution;
  church: Institutions_institutions_churches_departments_users_church | null;
  user_roles: Institutions_institutions_churches_departments_users_user_roles[] | null;
}

export interface Institutions_institutions_churches_departments {
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
  contact: Institutions_institutions_churches_departments_contact | null;
  church: Institutions_institutions_churches_departments_church | null;
  annual_budgets: Institutions_institutions_churches_departments_annual_budgets[];
  users: Institutions_institutions_churches_departments_users[] | null;
}

export interface Institutions_institutions_churches_region {
  __typename: "Region";
  id: string;
  name: string;
}

export interface Institutions_institutions_churches_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface Institutions_institutions_churches_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface Institutions_institutions_churches_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Institutions_institutions_churches_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
}

export interface Institutions_institutions_churches_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: Institutions_institutions_churches_users_user_roles_role;
}

export interface Institutions_institutions_churches_users {
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
  contact: Institutions_institutions_churches_users_contact | null;
  institution: Institutions_institutions_churches_users_institution;
  church: Institutions_institutions_churches_users_church | null;
  user_roles: Institutions_institutions_churches_users_user_roles[] | null;
}

export interface Institutions_institutions_churches_subsidy_requests {
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

export interface Institutions_institutions_churches_annual_budgets {
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

export interface Institutions_institutions_churches_projects {
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

export interface Institutions_institutions_churches {
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
  leader: Institutions_institutions_churches_leader;
  contact: Institutions_institutions_churches_contact | null;
  departments: Institutions_institutions_churches_departments[] | null;
  region: Institutions_institutions_churches_region | null;
  users: Institutions_institutions_churches_users[] | null;
  subsidy_requests: Institutions_institutions_churches_subsidy_requests[] | null;
  annual_budgets: Institutions_institutions_churches_annual_budgets[] | null;
  projects: Institutions_institutions_churches_projects[] | null;
}

export interface Institutions_institutions_departments_contact {
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

export interface Institutions_institutions_departments_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Institutions_institutions_departments_annual_budgets {
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

export interface Institutions_institutions_departments_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface Institutions_institutions_departments_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface Institutions_institutions_departments_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Institutions_institutions_departments_users_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
}

export interface Institutions_institutions_departments_users_user_roles {
  __typename: "UserRole";
  id: string;
  role: Institutions_institutions_departments_users_user_roles_role;
}

export interface Institutions_institutions_departments_users {
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
  contact: Institutions_institutions_departments_users_contact | null;
  institution: Institutions_institutions_departments_users_institution;
  church: Institutions_institutions_departments_users_church | null;
  user_roles: Institutions_institutions_departments_users_user_roles[] | null;
}

export interface Institutions_institutions_departments {
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
  contact: Institutions_institutions_departments_contact | null;
  church: Institutions_institutions_departments_church | null;
  annual_budgets: Institutions_institutions_departments_annual_budgets[];
  users: Institutions_institutions_departments_users[] | null;
}

export interface Institutions_institutions_churchesKpiData {
  __typename: "ChurchKPIData";
  totalChurches: number;
  totalMembers: number;
  totalDepartments: number;
  totalSubsidyRequests: number;
  totalBudget: number;
  totalUsedBudget: number;
  budgetUtilization: number;
  avgMembersPerChurch: number;
}

export interface Institutions_institutions_churchesActivityData {
  __typename: "ChurchActivityData";
  church_id: string;
  church_name: string;
  month: string;
  year: number;
  activity_score: number;
  user_count: number;
  department_count: number;
  project_count: number;
  has_recent_activity: boolean;
  has_recent_departments: boolean;
  has_recent_projects: boolean;
  has_updated_church: boolean;
  has_new_users: boolean;
}

export interface Institutions_institutions_institutionChartsData_usersByRole {
  __typename: "UsersByRoleData";
  role: string;
  count: number;
  fill: string;
}

export interface Institutions_institutions_institutionChartsData_churchesByRegion {
  __typename: "ChurchesByRegionData";
  region: string;
  name: string;
  churches: number;
  color: string | null;
  fill: string;
}

export interface Institutions_institutions_institutionChartsData {
  __typename: "InstitutionChartsData";
  usersByRole: Institutions_institutions_institutionChartsData_usersByRole[];
  monthlyUserGrowth: number | null;
  churchesByRegion: Institutions_institutions_institutionChartsData_churchesByRegion[];
}

export interface Institutions_institutions {
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
  total_budget: number;
  current_year_budget: number;
  has_budget_record: boolean;
  contact: Institutions_institutions_contact | null;
  annual_budgets: Institutions_institutions_annual_budgets[];
  subsidy_requests: Institutions_institutions_subsidy_requests[];
  direct_messages: Institutions_institutions_direct_messages[];
  projects: Institutions_institutions_projects[] | null;
  users: Institutions_institutions_users[] | null;
  churches: Institutions_institutions_churches[] | null;
  departments: Institutions_institutions_departments[] | null;
  churchesKpiData: Institutions_institutions_churchesKpiData;
  churchesActivityData: Institutions_institutions_churchesActivityData[];
  institutionChartsData: Institutions_institutions_institutionChartsData;
}

export interface Institutions {
  institutions: Institutions_institutions[];
}
