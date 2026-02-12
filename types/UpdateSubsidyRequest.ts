/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubsidyRequestUpdateDto, LanguagePreference, ActivityStatus, ActivityPriority } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSubsidyRequest
// ====================================================

export interface UpdateSubsidyRequest_updateSubsidyRequest_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface UpdateSubsidyRequest_updateSubsidyRequest_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface UpdateSubsidyRequest_updateSubsidyRequest_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface UpdateSubsidyRequest_updateSubsidyRequest_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface UpdateSubsidyRequest_updateSubsidyRequest_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
}

export interface UpdateSubsidyRequest_updateSubsidyRequest_items {
  __typename: "SubsidyRequestItem";
  id: string;
  subsidy_request_id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: UpdateSubsidyRequest_updateSubsidyRequest_items_project_activity;
}

export interface UpdateSubsidyRequest_updateSubsidyRequest {
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
  refund_amount: any;
  have_refund: boolean;
  refund_done: boolean;
  subsidy_status: UpdateSubsidyRequest_updateSubsidyRequest_subsidy_status;
  institution: UpdateSubsidyRequest_updateSubsidyRequest_institution;
  department: UpdateSubsidyRequest_updateSubsidyRequest_department;
  church: UpdateSubsidyRequest_updateSubsidyRequest_church | null;
  items: UpdateSubsidyRequest_updateSubsidyRequest_items[] | null;
}

export interface UpdateSubsidyRequest {
  updateSubsidyRequest: UpdateSubsidyRequest_updateSubsidyRequest;
}

export interface UpdateSubsidyRequestVariables {
  id: string;
  data: SubsidyRequestUpdateDto;
  language?: LanguagePreference | null;
}
