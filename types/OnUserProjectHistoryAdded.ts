/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectHistoryType } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: OnUserProjectHistoryAdded
// ====================================================

export interface OnUserProjectHistoryAdded_userProjectHistoryAdded_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface OnUserProjectHistoryAdded_userProjectHistoryAdded {
  __typename: "ProjectHistory";
  id: string;
  type: ProjectHistoryType;
  comment: string | null;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  metadata: any | null;
  created_at: any;
  project_id: string;
  user: OnUserProjectHistoryAdded_userProjectHistoryAdded_user;
}

export interface OnUserProjectHistoryAdded {
  userProjectHistoryAdded: OnUserProjectHistoryAdded_userProjectHistoryAdded;
}

export interface OnUserProjectHistoryAddedVariables {
  userId: string;
}
