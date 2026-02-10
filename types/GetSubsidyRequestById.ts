/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubsidyRequestPriority, ActivityStatus, ActivityPriority } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetSubsidyRequestById
// ====================================================

export interface GetSubsidyRequestById_subsidyRequest_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface GetSubsidyRequestById_subsidyRequest_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetSubsidyRequestById_subsidyRequest_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetSubsidyRequestById_subsidyRequest_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetSubsidyRequestById_subsidyRequest_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
}

export interface GetSubsidyRequestById_subsidyRequest_items {
  __typename: "SubsidyRequestItem";
  id: string;
  subsidy_request_id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: GetSubsidyRequestById_subsidyRequest_items_project_activity;
}

export interface GetSubsidyRequestById_subsidyRequest {
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
  priority: SubsidyRequestPriority;
  subsidy_status: GetSubsidyRequestById_subsidyRequest_subsidy_status;
  institution: GetSubsidyRequestById_subsidyRequest_institution;
  department: GetSubsidyRequestById_subsidyRequest_department;
  church: GetSubsidyRequestById_subsidyRequest_church | null;
  items: GetSubsidyRequestById_subsidyRequest_items[] | null;
}

export interface GetSubsidyRequestById {
  subsidyRequest: GetSubsidyRequestById_subsidyRequest | null;
}

export interface GetSubsidyRequestByIdVariables {
  id: string;
}
