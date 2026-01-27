/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, ActivityStatus, ActivityPriority } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ApproveSubsidyRequest
// ====================================================

export interface ApproveSubsidyRequest_approveSubsidyRequest_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface ApproveSubsidyRequest_approveSubsidyRequest_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface ApproveSubsidyRequest_approveSubsidyRequest_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface ApproveSubsidyRequest_approveSubsidyRequest_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface ApproveSubsidyRequest_approveSubsidyRequest_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
}

export interface ApproveSubsidyRequest_approveSubsidyRequest_items {
  __typename: "SubsidyRequestItem";
  id: string;
  subsidy_request_id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: ApproveSubsidyRequest_approveSubsidyRequest_items_project_activity;
}

export interface ApproveSubsidyRequest_approveSubsidyRequest {
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
  subsidy_status: ApproveSubsidyRequest_approveSubsidyRequest_subsidy_status;
  institution: ApproveSubsidyRequest_approveSubsidyRequest_institution;
  department: ApproveSubsidyRequest_approveSubsidyRequest_department;
  church: ApproveSubsidyRequest_approveSubsidyRequest_church | null;
  items: ApproveSubsidyRequest_approveSubsidyRequest_items[] | null;
}

export interface ApproveSubsidyRequest {
  approveSubsidyRequest: ApproveSubsidyRequest_approveSubsidyRequest;
}

export interface ApproveSubsidyRequestVariables {
  id: string;
  approved_amount: number;
  language?: LanguagePreference | null;
}
