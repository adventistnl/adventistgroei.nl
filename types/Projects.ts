/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, LanguagePreference, ProjectStatus, ActivityTags, ActivityStatus, ActivityPriority, EntityType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Projects
// ====================================================

export interface Projects_projects_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Projects_projects_department_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Projects_projects_department {
  __typename: "Department";
  id: string;
  name: string;
  church: Projects_projects_department_church | null;
}

export interface Projects_projects_church_department_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Projects_projects_church_department {
  __typename: "Department";
  id: string;
  name: string;
  description: string;
  church: Projects_projects_church_department_church | null;
}

export interface Projects_projects_Institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface Projects_projects_Church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Projects_projects_activities_assignees_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Projects_projects_activities_assignees {
  __typename: "ProjectActivityAssignee";
  id: string;
  user: Projects_projects_activities_assignees_user;
}

export interface Projects_projects_activities_activity_funding {
  __typename: "ActivityFunding";
  id: string;
  entity_contribution_amount: any;
  entity_contribution_percent: number;
  entity_type: EntityType;
  entity_id: string;
}

export interface Projects_projects_activities {
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
  assignees: Projects_projects_activities_assignees[] | null;
  activity_funding: Projects_projects_activities_activity_funding | null;
}

export interface Projects_projects {
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
  owner: Projects_projects_owner;
  department: Projects_projects_department;
  church_department: Projects_projects_church_department | null;
  Institution: Projects_projects_Institution | null;
  Church: Projects_projects_Church | null;
  activities: Projects_projects_activities[] | null;
}

export interface Projects {
  projects: Projects_projects[];
}

export interface ProjectsVariables {
  institutionId?: string | null;
}
