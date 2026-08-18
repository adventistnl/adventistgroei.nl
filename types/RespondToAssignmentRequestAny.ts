/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RespondToAssignmentRequestAny
// ====================================================

export interface RespondToAssignmentRequestAny_respondToAssignmentRequestAny {
  __typename: "AssignmentRequest";
  id: string;
  status: RequestStatus;
}

export interface RespondToAssignmentRequestAny {
  respondToAssignmentRequestAny: RespondToAssignmentRequestAny_respondToAssignmentRequestAny;
}

export interface RespondToAssignmentRequestAnyVariables {
  id: string;
  accept: boolean;
}
