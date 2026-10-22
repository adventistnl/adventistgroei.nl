/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RequestStatus, RequestType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RequestAssignment
// ====================================================

export interface RequestAssignment_requestAssignment {
  __typename: "AssignmentRequest";
  id: string;
  status: RequestStatus;
  type: RequestType;
}

export interface RequestAssignment {
  requestAssignment: RequestAssignment_requestAssignment;
}

export interface RequestAssignmentVariables {
  church_id: string;
  date: any;
}
