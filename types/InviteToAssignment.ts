/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestStatus, RequestType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: InviteToAssignment
// ====================================================

export interface InviteToAssignment_inviteToAssignment {
  __typename: "AssignmentRequest";
  id: string;
  status: RequestStatus;
  type: RequestType;
}

export interface InviteToAssignment {
  inviteToAssignment: InviteToAssignment_inviteToAssignment;
}

export interface InviteToAssignmentVariables {
  church_id: string;
  date: any;
  user_id: string;
  template_id?: string | null;
}
