/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateAdvanceRequest
// ====================================================

export interface CreateAdvanceRequest_createAdvanceRequest_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface CreateAdvanceRequest_createAdvanceRequest_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface CreateAdvanceRequest_createAdvanceRequest_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface CreateAdvanceRequest_createAdvanceRequest_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface CreateAdvanceRequest_createAdvanceRequest_project {
  __typename: "Project";
  id: string;
  title: string;
}

export interface CreateAdvanceRequest_createAdvanceRequest {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  total_budget: any;
  is_for_advance: boolean;
  advance_amount: any | null;
  created_at: any;
  subsidy_status: CreateAdvanceRequest_createAdvanceRequest_subsidy_status;
  institution: CreateAdvanceRequest_createAdvanceRequest_institution;
  department: CreateAdvanceRequest_createAdvanceRequest_department;
  church: CreateAdvanceRequest_createAdvanceRequest_church | null;
  project: CreateAdvanceRequest_createAdvanceRequest_project;
}

export interface CreateAdvanceRequest {
  createAdvanceRequest: CreateAdvanceRequest_createAdvanceRequest;
}

export interface CreateAdvanceRequestVariables {
  projectId: string;
  advanceAmount: number;
  language?: LanguagePreference | null;
}
