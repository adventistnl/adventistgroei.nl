/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestType, RequestStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyAssignmentRequests
// ====================================================

export interface MyAssignmentRequests_myAssignmentRequests_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface MyAssignmentRequests_myAssignmentRequests_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface MyAssignmentRequests_myAssignmentRequests_template {
  __typename: "AssignmentInviteTemplate";
  id: string;
  name: string;
}

export interface MyAssignmentRequests_myAssignmentRequests {
  __typename: "AssignmentRequest";
  id: string;
  date: any;
  type: RequestType;
  status: RequestStatus;
  decided_at: any | null;
  church: MyAssignmentRequests_myAssignmentRequests_church;
  user: MyAssignmentRequests_myAssignmentRequests_user;
  template: MyAssignmentRequests_myAssignmentRequests_template | null;
}

export interface MyAssignmentRequests {
  myAssignmentRequests: MyAssignmentRequests_myAssignmentRequests[];
}
