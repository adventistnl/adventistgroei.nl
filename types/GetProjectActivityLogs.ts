/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectActivityLogAction } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectActivityLogs
// ====================================================

export interface GetProjectActivityLogs_projectActivityLogs_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetProjectActivityLogs_projectActivityLogs {
  __typename: "ProjectActivityLog";
  id: string;
  activity_id: string;
  user_id: string;
  action: ProjectActivityLogAction;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  metadata: any | null;
  created_at: any;
  user: GetProjectActivityLogs_projectActivityLogs_user;
}

export interface GetProjectActivityLogs {
  projectActivityLogs: GetProjectActivityLogs_projectActivityLogs[];
}

export interface GetProjectActivityLogsVariables {
  activityId: string;
}
