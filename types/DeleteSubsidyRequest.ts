/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSubsidyRequest
// ====================================================

export interface DeleteSubsidyRequest_deleteSubsidyRequest_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface DeleteSubsidyRequest_deleteSubsidyRequest {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  total_budget: any;
  approved_amount: any;
  rejection_reason: string | null;
  created_at: any;
  updated_at: any;
  approved_at: any | null;
  created_by: string;
  updated_by: string;
  approved_by: string | null;
  institution_id: string;
  department_id: string;
  church_id: string | null;
  project_id: string;
  subsidy_status: DeleteSubsidyRequest_deleteSubsidyRequest_subsidy_status;
}

export interface DeleteSubsidyRequest {
  deleteSubsidyRequest: DeleteSubsidyRequest_deleteSubsidyRequest;
}

export interface DeleteSubsidyRequestVariables {
  id: string;
}
