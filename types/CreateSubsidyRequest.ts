/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubsidyRequestCreateDto, LanguagePreference, SubsidyRequestType, ActivityStatus, ActivityPriority } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSubsidyRequest
// ====================================================

export interface CreateSubsidyRequest_createSubsidyRequest_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface CreateSubsidyRequest_createSubsidyRequest_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface CreateSubsidyRequest_createSubsidyRequest_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface CreateSubsidyRequest_createSubsidyRequest_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface CreateSubsidyRequest_createSubsidyRequest_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
}

export interface CreateSubsidyRequest_createSubsidyRequest_items {
  __typename: "SubsidyRequestItem";
  id: string;
  subsidy_request_id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: CreateSubsidyRequest_createSubsidyRequest_items_project_activity;
}

export interface CreateSubsidyRequest_createSubsidyRequest {
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
  request_type: SubsidyRequestType;
  is_for_advance: boolean;
  advance_amount: any | null;
  refund_amount: any;
  have_refund: boolean;
  refund_done: boolean;
  subsidy_status: CreateSubsidyRequest_createSubsidyRequest_subsidy_status;
  institution: CreateSubsidyRequest_createSubsidyRequest_institution;
  department: CreateSubsidyRequest_createSubsidyRequest_department;
  church: CreateSubsidyRequest_createSubsidyRequest_church | null;
  items: CreateSubsidyRequest_createSubsidyRequest_items[] | null;
}

export interface CreateSubsidyRequest {
  createSubsidyRequest: CreateSubsidyRequest_createSubsidyRequest;
}

export interface CreateSubsidyRequestVariables {
  data: SubsidyRequestCreateDto;
  language?: LanguagePreference | null;
}
