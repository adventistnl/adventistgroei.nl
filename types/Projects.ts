/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, LanguagePreference, ProjectStatus, CollaboratorRole, ActivityStatus, ActivityTags } from "./globalTypes";

// ====================================================
// GraphQL query operation: Projects
// ====================================================

export interface Projects_projects_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Projects_projects_co_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Projects_projects_collaborators_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Projects_projects_collaborators {
  __typename: "ProjectCollaborator";
  role: CollaboratorRole;
  activity_ids: string[] | null;
  user: Projects_projects_collaborators_user;
}

export interface Projects_projects_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Projects_projects_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface Projects_projects_activities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  status: ActivityStatus;
  tags: ActivityTags[] | null;
  custom_tags: string[] | null;
}

export interface Projects_projects_subsidies {
  __typename: "SubsidyRequest";
  id: string;
}

export interface Projects_projects_special_projects {
  __typename: "SpecialProjects";
  id: string;
  type: string;
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
  co_owner_id: string | null;
  co_owner: Projects_projects_co_owner | null;
  collaborators: Projects_projects_collaborators[];
  church_id: string | null;
  church: Projects_projects_church | null;
  department: Projects_projects_department;
  activities: Projects_projects_activities[] | null;
  subsidies: Projects_projects_subsidies[] | null;
  special_projects: Projects_projects_special_projects[] | null;
}

export interface Projects {
  projects: Projects_projects[];
}

export interface ProjectsVariables {
  institutionId?: string | null;
}
