/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectHistoryCreateDto, ProjectHistoryType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateProjectHistory
// ====================================================

export interface CreateProjectHistory_createProjectHistory_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface CreateProjectHistory_createProjectHistory {
  __typename: "ProjectHistory";
  id: string;
  type: ProjectHistoryType;
  comment: string | null;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  metadata: any | null;
  created_at: any;
  user: CreateProjectHistory_createProjectHistory_user;
}

export interface CreateProjectHistory {
  createProjectHistory: CreateProjectHistory_createProjectHistory;
}

export interface CreateProjectHistoryVariables {
  data: ProjectHistoryCreateDto;
}
