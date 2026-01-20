/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, ProjectStatus, LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProject
// ====================================================

export interface UpdateProject_updateProject {
  __typename: "Project";
  id: string;
  title: string;
  description: string;
  department_id: string;
  owner_id: string;
  institution_id: string | null;
  updated_at: any;
}

export interface UpdateProject {
  updateProject: UpdateProject_updateProject;
}

export interface UpdateProjectVariables {
  id: string;
  title?: string | null;
  description?: string | null;
  department_id?: string | null;
  budget?: number | null;
  subsidized_budget?: number | null;
  balance?: number | null;
  type?: ProjectType | null;
  status?: ProjectStatus | null;
  start_at?: string | null;
  end_at?: string | null;
  language_preference?: LanguagePreference | null;
  is_private?: boolean | null;
  required_volunteers?: boolean | null;
  institution_id?: string | null;
  church_id?: string | null;
  owner_id?: string | null;
  deadline?: string | null;
}
