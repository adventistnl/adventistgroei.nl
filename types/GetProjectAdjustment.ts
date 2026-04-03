/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AdjustmentStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectAdjustment
// ====================================================

export interface GetProjectAdjustment_projectAdjustment_project_history_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface GetProjectAdjustment_projectAdjustment_project_history {
  __typename: "ProjectHistory";
  id: string;
  project_id: string;
  comment: string | null;
  created_at: any;
  user: GetProjectAdjustment_projectAdjustment_project_history_user;
}

export interface GetProjectAdjustment_projectAdjustment_tasks {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: any;
  updated_at: any;
}

export interface GetProjectAdjustment_projectAdjustment {
  __typename: "ProjectAdjustment";
  id: string;
  status: AdjustmentStatus;
  created_at: any;
  updated_at: any;
  project_history: GetProjectAdjustment_projectAdjustment_project_history;
  tasks: GetProjectAdjustment_projectAdjustment_tasks[] | null;
}

export interface GetProjectAdjustment {
  projectAdjustment: GetProjectAdjustment_projectAdjustment;
}

export interface GetProjectAdjustmentVariables {
  id: string;
}
