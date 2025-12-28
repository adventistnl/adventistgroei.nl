/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, LanguagePreference, EventCreateDto, ProjectActivityCreateWithoutProjectDto, ActivityTags } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateProject
// ====================================================

export interface CreateProject_createProject_activities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  deadline: any;
  tags: ActivityTags[] | null;
  created_at: any;
  updated_at: any;
}

export interface CreateProject_createProject {
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
  activities: CreateProject_createProject_activities[] | null;
}

export interface CreateProject {
  createProject: CreateProject_createProject;
}

export interface CreateProjectVariables {
  title: string;
  description: string;
  department_id: string;
  budget: number;
  type: ProjectType;
  start_at: string;
  end_at: string;
  language_preference: LanguagePreference;
  is_private: boolean;
  required_volunteers: boolean;
  is_event: boolean;
  institution_id?: string | null;
  owner_id?: string | null;
  deadline?: string | null;
  event?: EventCreateDto | null;
  activities?: ProjectActivityCreateWithoutProjectDto[] | null;
  is_special_case?: boolean | null;
  special_case_reason?: string | null;
  location_church_plant?: string | null;
  special_budget?: number | null;
}
