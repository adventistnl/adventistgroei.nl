/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AvailabilityStatus, AvailabilitySource } from "./globalTypes";

// ====================================================
// GraphQL query operation: MyAvailability
// ====================================================

export interface MyAvailability_myAvailability {
  __typename: "Availability";
  id: string;
  date: any;
  status: AvailabilityStatus;
  source: AvailabilitySource;
  note: string | null;
  recurrence_rule_id: string | null;
}

export interface MyAvailability {
  myAvailability: MyAvailability_myAvailability[];
}

export interface MyAvailabilityVariables {
  month: string;
}
