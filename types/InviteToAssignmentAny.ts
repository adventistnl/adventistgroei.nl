/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestStatus, RequestType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: InviteToAssignmentAny
// ====================================================

export interface InviteToAssignmentAny_inviteToAssignmentAny {
  __typename: "AssignmentRequest";
  id: string;
  status: RequestStatus;
  type: RequestType;
}

export interface InviteToAssignmentAny {
  inviteToAssignmentAny: InviteToAssignmentAny_inviteToAssignmentAny;
}

export interface InviteToAssignmentAnyVariables {
  church_id: string;
  date: any;
  user_id: string;
  template_id?: string | null;
}
