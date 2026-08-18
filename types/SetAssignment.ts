/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AssignmentStatus, AssignmentOrigin } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAssignment
// ====================================================

export interface SetAssignment_setAssignment {
  __typename: "Assignment";
  id: string;
  church_id: string;
  date: any;
  user_id: string | null;
  origin: AssignmentOrigin;
  status: AssignmentStatus;
}

export interface SetAssignment {
  setAssignment: SetAssignment_setAssignment;
}

export interface SetAssignmentVariables {
  church_id: string;
  date: any;
  user_id?: string | null;
  status?: AssignmentStatus | null;
}
