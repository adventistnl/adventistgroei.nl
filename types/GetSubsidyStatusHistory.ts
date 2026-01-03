/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSubsidyStatusHistory
// ====================================================

export interface GetSubsidyStatusHistory_getSubsidyStatusHistory_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface GetSubsidyStatusHistory_getSubsidyStatusHistory_previous_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface GetSubsidyStatusHistory_getSubsidyStatusHistory_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface GetSubsidyStatusHistory_getSubsidyStatusHistory {
  __typename: "SubsidyStatusHistory";
  id: string;
  status_id: string;
  previous_status_id: string | null;
  reason: string | null;
  changed_by: string;
  changed_at: any;
  status: GetSubsidyStatusHistory_getSubsidyStatusHistory_status;
  previous_status: GetSubsidyStatusHistory_getSubsidyStatusHistory_previous_status | null;
  user: GetSubsidyStatusHistory_getSubsidyStatusHistory_user;
}

export interface GetSubsidyStatusHistory {
  getSubsidyStatusHistory: GetSubsidyStatusHistory_getSubsidyStatusHistory[];
}

export interface GetSubsidyStatusHistoryVariables {
  subsidyRequestId: string;
}
