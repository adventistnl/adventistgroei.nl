/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AdjustmentStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: ProjectAdjustmentFields
// ====================================================

export interface ProjectAdjustmentFields_project_history_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface ProjectAdjustmentFields_project_history {
  __typename: "ProjectHistory";
  id: string;
  project_id: string;
  comment: string | null;
  created_at: any;
  user: ProjectAdjustmentFields_project_history_user;
}

export interface ProjectAdjustmentFields_tasks {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: any;
  updated_at: any;
}

export interface ProjectAdjustmentFields {
  __typename: "ProjectAdjustment";
  id: string;
  status: AdjustmentStatus;
  created_at: any;
  updated_at: any;
  project_history: ProjectAdjustmentFields_project_history;
  tasks: ProjectAdjustmentFields_tasks[] | null;
}
