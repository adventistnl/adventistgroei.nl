/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectHistoryType, AdjustmentStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectHistory
// ====================================================

export interface GetProjectHistory_projectHistories_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface GetProjectHistory_projectHistories_adjustment_tasks {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  position: number;
}

export interface GetProjectHistory_projectHistories_adjustment {
  __typename: "ProjectAdjustment";
  id: string;
  status: AdjustmentStatus;
  tasks: GetProjectHistory_projectHistories_adjustment_tasks[] | null;
}

export interface GetProjectHistory_projectHistories {
  __typename: "ProjectHistory";
  id: string;
  type: ProjectHistoryType;
  comment: string | null;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  metadata: any | null;
  created_at: any;
  user: GetProjectHistory_projectHistories_user;
  adjustment: GetProjectHistory_projectHistories_adjustment | null;
}

export interface GetProjectHistory {
  projectHistories: GetProjectHistory_projectHistories[];
}

export interface GetProjectHistoryVariables {
  projectId: string;
}
