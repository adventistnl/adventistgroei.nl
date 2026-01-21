/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityStatus, ActivityPriority } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetSubsidyRequestsByProject
// ====================================================

export interface GetSubsidyRequestsByProject_subsidyRequests_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface GetSubsidyRequestsByProject_subsidyRequests_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetSubsidyRequestsByProject_subsidyRequests_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetSubsidyRequestsByProject_subsidyRequests_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetSubsidyRequestsByProject_subsidyRequests_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
}

export interface GetSubsidyRequestsByProject_subsidyRequests_items {
  __typename: "SubsidyRequestItem";
  id: string;
  subsidy_request_id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: GetSubsidyRequestsByProject_subsidyRequests_items_project_activity;
}

export interface GetSubsidyRequestsByProject_subsidyRequests {
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
  subsidy_status: GetSubsidyRequestsByProject_subsidyRequests_subsidy_status;
  institution: GetSubsidyRequestsByProject_subsidyRequests_institution;
  department: GetSubsidyRequestsByProject_subsidyRequests_department;
  church: GetSubsidyRequestsByProject_subsidyRequests_church | null;
  items: GetSubsidyRequestsByProject_subsidyRequests_items[] | null;
}

export interface GetSubsidyRequestsByProject {
  subsidyRequests: GetSubsidyRequestsByProject_subsidyRequests[];
}

export interface GetSubsidyRequestsByProjectVariables {
  project_id: string;
}
