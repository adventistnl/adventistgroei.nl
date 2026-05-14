/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectStatus, ProjectType, LanguagePreference, ChurchType, ActivityStatus, ActivityPriority, ActivityTags, EntityType, SubsidyRequestPriority, SubsidyRequestType, CollaboratorRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectById
// ====================================================

export interface GetProjectById_project_church_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetProjectById_project_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectById_project_co_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectById_project_department_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetProjectById_project_department_annual_budgets {
  __typename: "AnnualBudget";
  id: string;
  year: number;
  is_locked: boolean;
  allocated_amount: number;
  total_expenses: number;
}

export interface GetProjectById_project_department {
  __typename: "Department";
  id: string;
  name: string;
  description: string;
  leader_id: string | null;
  church: GetProjectById_project_department_church | null;
  annual_budgets: GetProjectById_project_department_annual_budgets[];
}

export interface GetProjectById_project_Institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetProjectById_project_church {
  __typename: "Church";
  id: string;
  name: string;
  type: ChurchType;
}

export interface GetProjectById_project_activities_assignees_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectById_project_activities_assignees {
  __typename: "ProjectActivityAssignee";
  id: string;
  user_id: string;
  user: GetProjectById_project_activities_assignees_user;
}

export interface GetProjectById_project_activities_activity_funding {
  __typename: "ActivityFunding";
  id: string;
  entity_type: EntityType;
  entity_id: string;
  entity_contribution_amount: any;
  entity_contribution_percent: number;
  validated: boolean;
}

export interface GetProjectById_project_activities_activity_documents {
  __typename: "ActivityDocuments";
  id: string;
  filename: string;
  file_url: string;
  type: string;
  is_validated: boolean;
  validated_at: any | null;
  uploaded_by: string;
  created_at: any;
}

export interface GetProjectById_project_activities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  budget_amount: any;
  deadline: any;
  tags: ActivityTags[] | null;
  custom_tags: string[] | null;
  is_subsidized: boolean;
  created_at: any;
  updated_at: any;
  assignees: GetProjectById_project_activities_assignees[] | null;
  activity_funding: GetProjectById_project_activities_activity_funding | null;
  activity_documents: GetProjectById_project_activities_activity_documents[] | null;
}

export interface GetProjectById_project_subsidies_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface GetProjectById_project_subsidies_requester {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectById_project_subsidies_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetProjectById_project_subsidies_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetProjectById_project_subsidies_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetProjectById_project_subsidies_items_project_activity_activity_documents {
  __typename: "ActivityDocuments";
  id: string;
  filename: string;
  is_validated: boolean;
}

export interface GetProjectById_project_subsidies_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  status: ActivityStatus;
  budget_amount: any;
  activity_documents: GetProjectById_project_subsidies_items_project_activity_activity_documents[] | null;
}

export interface GetProjectById_project_subsidies_items {
  __typename: "SubsidyRequestItem";
  id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  project_activity: GetProjectById_project_subsidies_items_project_activity;
}

export interface GetProjectById_project_subsidies_subsidy_receipts {
  __typename: "SubsidyReceipt";
  id: string;
  filename: string;
  file_url: string;
  type: string;
  amount: any | null;
  approved: boolean;
  is_validated: boolean;
  validated_at: any | null;
}

export interface GetProjectById_project_subsidies {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  total_budget: any;
  approved_amount: any;
  rejection_reason: string | null;
  priority: SubsidyRequestPriority;
  request_type: SubsidyRequestType;
  is_for_advance: boolean;
  advance_amount: any | null;
  refund_amount: any;
  have_refund: boolean;
  refund_done: boolean;
  created_at: any;
  updated_at: any;
  approved_at: any | null;
  subsidy_status: GetProjectById_project_subsidies_subsidy_status;
  requester: GetProjectById_project_subsidies_requester;
  institution: GetProjectById_project_subsidies_institution;
  department: GetProjectById_project_subsidies_department;
  church: GetProjectById_project_subsidies_church | null;
  items: GetProjectById_project_subsidies_items[] | null;
  subsidy_receipts: GetProjectById_project_subsidies_subsidy_receipts[] | null;
}

export interface GetProjectById_project_collaborators_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectById_project_collaborators {
  __typename: "ProjectCollaborator";
  role: CollaboratorRole;
  activity_ids: string[] | null;
  user: GetProjectById_project_collaborators_user;
}

export interface GetProjectById_project_kpis {
  __typename: "ProjectKPIsDto";
  totalActivities: number;
  completedActivities: number;
  inProgressActivities: number;
  completionRate: number;
  projectBudget: number;
  allocatedBudget: number;
  subsidizedBudget: number;
  balance: number;
  budgetUtilization: number;
  subsidizedBudgetPercentage: number;
  subsidizedActivities: number;
  subsidyRate: number;
  subsidyRequestsCount: number;
  approvedSubsidyRequestsCount: number;
  totalSubsidyAmount: number;
  daysRemaining: number;
  endDate: any;
  projectStatus: string;
}

export interface GetProjectById_project_special_projects {
  __typename: "SpecialProjects";
  id: string;
  justification_note: string | null;
  budget: any | null;
  type: string;
  location_church_plant: string | null;
  created_at: any;
  updated_at: any;
}

export interface GetProjectById_project {
  __typename: "Project";
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  type: ProjectType;
  language_preference: LanguagePreference;
  budget: any;
  subsidized_budget: any;
  balance: any;
  is_private: boolean;
  required_volunteers: boolean;
  start_at: any;
  end_at: any;
  deadline: any | null;
  created_at: any;
  updated_at: any;
  department_id: string;
  church_department_id: string | null;
  owner_id: string;
  institution_id: string | null;
  church_id: string | null;
  event_id: string | null;
  church_department: GetProjectById_project_church_department | null;
  owner: GetProjectById_project_owner;
  co_owner_id: string | null;
  co_owner: GetProjectById_project_co_owner | null;
  department: GetProjectById_project_department;
  Institution: GetProjectById_project_Institution | null;
  church: GetProjectById_project_church | null;
  activities: GetProjectById_project_activities[] | null;
  subsidies: GetProjectById_project_subsidies[] | null;
  collaborators: GetProjectById_project_collaborators[];
  kpis: GetProjectById_project_kpis;
  special_projects: GetProjectById_project_special_projects[] | null;
}

export interface GetProjectById {
  project: GetProjectById_project | null;
}

export interface GetProjectByIdVariables {
  id: string;
}
