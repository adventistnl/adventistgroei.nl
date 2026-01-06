/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetSubsidyRequestsByInstitution
// ====================================================

export interface GetSubsidyRequestsByInstitution_subsidyRequests_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface GetSubsidyRequestsByInstitution_subsidyRequests_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetSubsidyRequestsByInstitution_subsidyRequests_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetSubsidyRequestsByInstitution_subsidyRequests_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetSubsidyRequestsByInstitution_subsidyRequests_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
}

export interface GetSubsidyRequestsByInstitution_subsidyRequests_items {
  __typename: "SubsidyRequestItem";
  id: string;
  subsidy_request_id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  project_activity: GetSubsidyRequestsByInstitution_subsidyRequests_items_project_activity;
}

export interface GetSubsidyRequestsByInstitution_subsidyRequests {
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
  subsidy_status: GetSubsidyRequestsByInstitution_subsidyRequests_subsidy_status;
  institution: GetSubsidyRequestsByInstitution_subsidyRequests_institution;
  department: GetSubsidyRequestsByInstitution_subsidyRequests_department;
  church: GetSubsidyRequestsByInstitution_subsidyRequests_church | null;
  items: GetSubsidyRequestsByInstitution_subsidyRequests_items[] | null;
}

export interface GetSubsidyRequestsByInstitution {
  subsidyRequests: GetSubsidyRequestsByInstitution_subsidyRequests[];
}

export interface GetSubsidyRequestsByInstitutionVariables {
  institution_id: string;
}
