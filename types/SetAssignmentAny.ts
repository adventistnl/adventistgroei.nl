/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AssignmentStatus, AssignmentOrigin } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAssignmentAny
// ====================================================

export interface SetAssignmentAny_setAssignmentAny {
  __typename: "Assignment";
  id: string;
  church_id: string;
  date: any;
  user_id: string | null;
  origin: AssignmentOrigin;
  status: AssignmentStatus;
}

export interface SetAssignmentAny {
  setAssignmentAny: SetAssignmentAny_setAssignmentAny;
}

export interface SetAssignmentAnyVariables {
  church_id: string;
  date: any;
  user_id?: string | null;
  status?: AssignmentStatus | null;
}
