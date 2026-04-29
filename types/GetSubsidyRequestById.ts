/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, SubsidyRequestType, ActivityStatus, ActivityPriority, CollaboratorRole } from "./globalTypes";

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

export interface GetSubsidyRequestById_subsidyRequest_department_leader {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  language_preference: LanguagePreference;
}

export interface GetSubsidyRequestById_subsidyRequest_department {
  __typename: "Department";
  id: string;
  name: string;
  leader: GetSubsidyRequestById_subsidyRequest_department_leader | null;
}

export interface GetSubsidyRequestById_subsidyRequest_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetSubsidyRequestById_subsidyRequest_project_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  language_preference: LanguagePreference;
}

export interface GetSubsidyRequestById_subsidyRequest_project_co_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetSubsidyRequestById_subsidyRequest_project {
  __typename: "Project";
  id: string;
  title: string;
  department_id: string;
  owner_id: string;
  co_owner_id: string | null;
  owner: GetSubsidyRequestById_subsidyRequest_project_owner;
  co_owner: GetSubsidyRequestById_subsidyRequest_project_co_owner | null;
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
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: GetSubsidyRequestById_subsidyRequest_items_project_activity;
}

export interface GetSubsidyRequestById_subsidyRequest_receipts {
  __typename: "SubsidyReceipt";
  id: string;
  is_validated: boolean;
}

export interface GetSubsidyRequestById_subsidyRequest_collaborators_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetSubsidyRequestById_subsidyRequest_collaborators {
  __typename: "ProjectCollaborator";
  role: CollaboratorRole;
  user: GetSubsidyRequestById_subsidyRequest_collaborators_user;
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
  is_for_advance: boolean;
  advance_amount: any | null;
  refund_amount: any;
  have_refund: boolean;
  refund_done: boolean;
  subsidy_statuses_id: string;
  subsidy_status: GetSubsidyRequestById_subsidyRequest_subsidy_status;
  institution: GetSubsidyRequestById_subsidyRequest_institution;
  department: GetSubsidyRequestById_subsidyRequest_department;
  church: GetSubsidyRequestById_subsidyRequest_church | null;
  request_type: SubsidyRequestType;
  project: GetSubsidyRequestById_subsidyRequest_project;
  items: GetSubsidyRequestById_subsidyRequest_items[] | null;
  receipts: GetSubsidyRequestById_subsidyRequest_receipts[] | null;
  collaborators: GetSubsidyRequestById_subsidyRequest_collaborators[];
}

export interface GetSubsidyRequestById {
  subsidyRequest: GetSubsidyRequestById_subsidyRequest | null;
}

export interface GetSubsidyRequestByIdVariables {
  id: string;
}
