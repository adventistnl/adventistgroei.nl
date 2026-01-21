/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, LanguagePreference, ProjectStatus, ActivityTags, ActivityStatus, ActivityPriority, EntityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectById
// ====================================================

export interface GetProjectById_project_owner {
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

export interface GetProjectById_project_department {
  __typename: "Department";
  id: string;
  name: string;
  church: GetProjectById_project_department_church | null;
}

export interface GetProjectById_project_church_department_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetProjectById_project_church_department {
  __typename: "Department";
  id: string;
  name: string;
  description: string;
  church: GetProjectById_project_church_department_church | null;
}

export interface GetProjectById_project_Institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetProjectById_project_Church {
  __typename: "Church";
  id: string;
  name: string;
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
  user: GetProjectById_project_activities_assignees_user;
}

export interface GetProjectById_project_activities_activity_funding {
  __typename: "ActivityFunding";
  id: string;
  entity_contribution_amount: any;
  entity_contribution_percent: number;
  entity_type: EntityType;
  entity_id: string;
}

export interface GetProjectById_project_activities_activity_documents {
  __typename: "ActivityDocuments";
  id: string;
  file_url: string;
  filename: string;
  type: string;
  is_validated: boolean;
  drive_file_id: string | null;
}

export interface GetProjectById_project_activities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  deadline: any;
  tags: ActivityTags[] | null;
  custom_tags: string[] | null;
  status: ActivityStatus;
  priority: ActivityPriority;
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
}

export interface GetProjectById_project_subsidies_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetProjectById_project_subsidies_department_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetProjectById_project_subsidies_department {
  __typename: "Department";
  id: string;
  name: string;
  church: GetProjectById_project_subsidies_department_church | null;
}

export interface GetProjectById_project_subsidies_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetProjectById_project_subsidies_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
}

export interface GetProjectById_project_subsidies_items {
  __typename: "SubsidyRequestItem";
  id: string;
  subsidy_request_id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: GetProjectById_project_subsidies_items_project_activity;
}

export interface GetProjectById_project_subsidies {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  total_budget: any;
  approved_amount: any;
  rejection_reason: string | null;
  created_at: any;
  updated_at: any;
  approved_at: any | null;
  created_by: string;
  updated_by: string;
  approved_by: string | null;
  institution_id: string;
  department_id: string;
  church_id: string | null;
  project_id: string;
  subsidy_status: GetProjectById_project_subsidies_subsidy_status;
  institution: GetProjectById_project_subsidies_institution;
  department: GetProjectById_project_subsidies_department;
  church: GetProjectById_project_subsidies_church | null;
  items: GetProjectById_project_subsidies_items[] | null;
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

export interface GetProjectById_project {
  __typename: "Project";
  id: string;
  title: string;
  description: string;
  budget: any;
  subsidized_budget: any;
  type: ProjectType;
  is_private: boolean;
  required_volunteers: boolean;
  start_at: any;
  end_at: any;
  deadline: any | null;
  language_preference: LanguagePreference;
  department_id: string;
  church_department_id: string | null;
  owner_id: string;
  institution_id: string | null;
  event_id: string | null;
  status: ProjectStatus;
  created_at: any;
  updated_at: any;
  owner: GetProjectById_project_owner;
  department: GetProjectById_project_department;
  church_department: GetProjectById_project_church_department | null;
  Institution: GetProjectById_project_Institution | null;
  Church: GetProjectById_project_Church | null;
  activities: GetProjectById_project_activities[] | null;
  subsidies: GetProjectById_project_subsidies[] | null;
  special_projects: GetProjectById_project_special_projects[] | null;
  kpis: GetProjectById_project_kpis;
}

export interface GetProjectById {
  project: GetProjectById_project | null;
}

export interface GetProjectByIdVariables {
  id: string;
}
