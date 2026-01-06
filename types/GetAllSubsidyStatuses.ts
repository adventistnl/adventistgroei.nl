/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllSubsidyStatuses
// ====================================================

export interface GetAllSubsidyStatuses_subsidyStatuses {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
  description: string;
}

export interface GetAllSubsidyStatuses {
  subsidyStatuses: GetAllSubsidyStatuses_subsidyStatuses[];
}
