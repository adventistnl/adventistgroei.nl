/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AdjustmentStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectAdjustments
// ====================================================

export interface GetProjectAdjustments_projectAdjustments_project_history_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface GetProjectAdjustments_projectAdjustments_project_history {
  __typename: "ProjectHistory";
  id: string;
  project_id: string;
  comment: string | null;
  created_at: any;
  user: GetProjectAdjustments_projectAdjustments_project_history_user;
}

export interface GetProjectAdjustments_projectAdjustments_tasks {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: any;
  updated_at: any;
}

export interface GetProjectAdjustments_projectAdjustments {
  __typename: "ProjectAdjustment";
  id: string;
  status: AdjustmentStatus;
  created_at: any;
  updated_at: any;
  project_history: GetProjectAdjustments_projectAdjustments_project_history;
  tasks: GetProjectAdjustments_projectAdjustments_tasks[] | null;
}

export interface GetProjectAdjustments {
  projectAdjustments: GetProjectAdjustments_projectAdjustments[];
}

export interface GetProjectAdjustmentsVariables {
  projectId: string;
}
