/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RecurrenceType, AvailabilityStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetAvailabilityRecurrenceRule
// ====================================================

export interface SetAvailabilityRecurrenceRule_setAvailabilityRecurrenceRule {
  __typename: "AvailabilityRecurrenceRule";
  id: string;
  type: RecurrenceType;
  status: AvailabilityStatus;
  day_of_week: number | null;
  start_date: any | null;
  end_date: any | null;
  effective_from: any;
  effective_until: any | null;
  note: string | null;
}

export interface SetAvailabilityRecurrenceRule {
  setAvailabilityRecurrenceRule: SetAvailabilityRecurrenceRule_setAvailabilityRecurrenceRule;
}

export interface SetAvailabilityRecurrenceRuleVariables {
  id?: string | null;
  type: RecurrenceType;
  status: AvailabilityStatus;
  day_of_week?: number | null;
  start_date?: any | null;
  end_date?: any | null;
  effective_from?: any | null;
  effective_until?: any | null;
  note?: string | null;
}
