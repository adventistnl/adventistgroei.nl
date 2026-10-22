/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AvailabilityStatus, AvailabilitySource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAvailability
// ====================================================

export interface SetAvailability_setAvailability {
  __typename: "Availability";
  id: string;
  date: any;
  status: AvailabilityStatus;
  source: AvailabilitySource;
  note: string | null;
}

export interface SetAvailability {
  setAvailability: SetAvailability_setAvailability;
}

export interface SetAvailabilityVariables {
  date: any;
  status: AvailabilityStatus;
  note?: string | null;
}
