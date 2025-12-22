/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectType, LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateProject
// ====================================================

export interface UpdateProject_updateProject {
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
  type?: ProjectType | null;
  start_at?: string | null;
  end_at?: string | null;
  language_preference?: LanguagePreference | null;
  is_private?: boolean | null;
  required_volunteers?: boolean | null;
  institution_id?: string | null;
  owner_id?: string | null;
  deadline?: string | null;
}
