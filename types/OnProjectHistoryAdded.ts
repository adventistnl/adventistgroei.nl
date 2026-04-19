/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProjectHistoryType } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: OnProjectHistoryAdded
// ====================================================

export interface OnProjectHistoryAdded_projectHistoryAdded_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface OnProjectHistoryAdded_projectHistoryAdded {
  __typename: "ProjectHistory";
  id: string;
  type: ProjectHistoryType;
  comment: string | null;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  metadata: any | null;
  created_at: any;
  user: OnProjectHistoryAdded_projectHistoryAdded_user;
}

export interface OnProjectHistoryAdded {
  projectHistoryAdded: OnProjectHistoryAdded_projectHistoryAdded;
}

export interface OnProjectHistoryAddedVariables {
  projectId: string;
}
