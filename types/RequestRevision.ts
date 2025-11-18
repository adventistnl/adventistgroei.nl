/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestRevision
// ====================================================

export interface RequestRevision_requestRevision {
  __typename: "AnnualBudget";
  id: string;
  status: string;
  review_date: any;
  reviewed_by: string;
  notes: string;
  updated_at: any;
}

export interface RequestRevision {
  requestRevision: RequestRevision_requestRevision;
}

export interface RequestRevisionVariables {
  id: string;
  revisionNotes: string;
}