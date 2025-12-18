/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, LanguagePreference, ActivityTags, ActivityStatus, ActivityPriority } from "./globalTypes";

// ====================================================
// GraphQL query operation: Projects
// ====================================================

export interface Projects_projects_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Projects_projects_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface Projects_projects_Institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface Projects_projects_activities_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Projects_projects_activities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  deadline: any;
  owner_id: string;
  tags: ActivityTags[] | null;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
  created_at: any;
  updated_at: any;
  owner: Projects_projects_activities_owner;
}

export interface Projects_projects {
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
  owner: Projects_projects_owner;
  department: Projects_projects_department;
  Institution: Projects_projects_Institution | null;
  activities: Projects_projects_activities[] | null;
}

export interface Projects {
  projects: Projects_projects[];
}
