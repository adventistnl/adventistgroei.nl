/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AvailabilityStatus, AvailabilitySource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAvailabilityBulk
// ====================================================

export interface SetAvailabilityBulk_setAvailabilityBulk {
  __typename: "Availability";
  id: string;
  date: any;
  status: AvailabilityStatus;
  source: AvailabilitySource;
  note: string | null;
}

export interface SetAvailabilityBulk {
  setAvailabilityBulk: SetAvailabilityBulk_setAvailabilityBulk[];
}

export interface SetAvailabilityBulkVariables {
  start_date: any;
  end_date: any;
  status: AvailabilityStatus;
  note?: string | null;
}
