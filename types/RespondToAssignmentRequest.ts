/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RespondToAssignmentRequest
// ====================================================

export interface RespondToAssignmentRequest_respondToAssignmentRequest {
  __typename: "AssignmentRequest";
  id: string;
  status: RequestStatus;
}

export interface RespondToAssignmentRequest {
  respondToAssignmentRequest: RespondToAssignmentRequest_respondToAssignmentRequest;
}

export interface RespondToAssignmentRequestVariables {
  id: string;
  accept: boolean;
}
