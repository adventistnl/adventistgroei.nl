/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, LanguagePreference, ActivityTags, ActivityStatus, ActivityPriority, EntityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectById
// ====================================================

export interface GetProjectById_project_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectById_project_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetProjectById_project_Institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetProjectById_project_activities_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectById_project_activities_activity_funding {
  __typename: "ActivityFunding";
  id: string;
  entity_contribution_amount: any;
  entity_contribution_percent: number;
  entity_type: EntityType;
  entity_id: string;
}

export interface GetProjectById_project_activities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  deadline: any;
  owner_id: string;
  tags: ActivityTags[] | null;
  custom_tags: string[] | null;
  activity_tag: ActivityTags | null;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
  created_at: any;
  updated_at: any;
  owner: GetProjectById_project_activities_owner;
  activity_funding: GetProjectById_project_activities_activity_funding | null;
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

export interface GetProjectById_project_subsidies {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  total_budget: any;
  created_at: any;
  updated_at: any;
  institution_id: string;
  subsidy_status: GetProjectById_project_subsidies_subsidy_status;
  institution: GetProjectById_project_subsidies_institution;
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
  budget: any;
  type: ProjectType;
  is_private: boolean;
  required_volunteers: boolean;
  start_at: any;
  end_at: any;
  deadline: any | null;
  language_preference: LanguagePreference;
  department_id: string;
  owner_id: string;
  institution_id: string | null;
  event_id: string | null;
  created_at: any;
  updated_at: any;
  owner: GetProjectById_project_owner;
  department: GetProjectById_project_department;
  Institution: GetProjectById_project_Institution | null;
  activities: GetProjectById_project_activities[] | null;
  subsidies: GetProjectById_project_subsidies[] | null;
  special_projects: GetProjectById_project_special_projects[] | null;
}

export interface GetProjectById {
  project: GetProjectById_project | null;
}

export interface GetProjectByIdVariables {
  id: string;
}
