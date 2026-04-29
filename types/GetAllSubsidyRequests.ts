/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, ActivityStatus, ActivityPriority, CollaboratorRole } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAllSubsidyRequests
// ====================================================

export interface GetAllSubsidyRequests_subsidyRequests_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface GetAllSubsidyRequests_subsidyRequests_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetAllSubsidyRequests_subsidyRequests_department_leader {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  language_preference: LanguagePreference;
}

export interface GetAllSubsidyRequests_subsidyRequests_department {
  __typename: "Department";
  id: string;
  name: string;
  leader: GetAllSubsidyRequests_subsidyRequests_department_leader | null;
}

export interface GetAllSubsidyRequests_subsidyRequests_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetAllSubsidyRequests_subsidyRequests_project_owner {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  language_preference: LanguagePreference;
}

export interface GetAllSubsidyRequests_subsidyRequests_project {
  __typename: "Project";
  id: string;
  title: string;
  owner_id: string;
  owner: GetAllSubsidyRequests_subsidyRequests_project_owner;
}

export interface GetAllSubsidyRequests_subsidyRequests_items_project_activity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  description: string;
  budget_amount: any;
  status: ActivityStatus;
  priority: ActivityPriority;
  is_subsidized: boolean;
}

export interface GetAllSubsidyRequests_subsidyRequests_items {
  __typename: "SubsidyRequestItem";
  id: string;
  project_activity_id: string;
  requested_amount: any;
  approved_amount: any;
  notes: string | null;
  created_at: any;
  updated_at: any;
  project_activity: GetAllSubsidyRequests_subsidyRequests_items_project_activity;
}

export interface GetAllSubsidyRequests_subsidyRequests_receipts {
  __typename: "SubsidyReceipt";
  id: string;
  is_validated: boolean;
}

export interface GetAllSubsidyRequests_subsidyRequests_collaborators_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetAllSubsidyRequests_subsidyRequests_collaborators {
  __typename: "ProjectCollaborator";
  role: CollaboratorRole;
  user: GetAllSubsidyRequests_subsidyRequests_collaborators_user;
}

export interface GetAllSubsidyRequests_subsidyRequests {
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
  subsidy_status: GetAllSubsidyRequests_subsidyRequests_subsidy_status;
  institution: GetAllSubsidyRequests_subsidyRequests_institution;
  department: GetAllSubsidyRequests_subsidyRequests_department;
  church: GetAllSubsidyRequests_subsidyRequests_church | null;
  project: GetAllSubsidyRequests_subsidyRequests_project;
  items: GetAllSubsidyRequests_subsidyRequests_items[] | null;
  receipts: GetAllSubsidyRequests_subsidyRequests_receipts[] | null;
  collaborators: GetAllSubsidyRequests_subsidyRequests_collaborators[];
}

export interface GetAllSubsidyRequests {
  subsidyRequests: GetAllSubsidyRequests_subsidyRequests[];
}
