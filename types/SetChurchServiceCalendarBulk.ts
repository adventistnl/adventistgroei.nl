/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceCalendarSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetChurchServiceCalendarBulk
// ====================================================

export interface SetChurchServiceCalendarBulk_setChurchServiceCalendarBulk {
  __typename: "ChurchServiceCalendar";
  id: string;
  church_id: string;
  date: any;
  has_service: boolean;
  source: ServiceCalendarSource;
}

export interface SetChurchServiceCalendarBulk {
  setChurchServiceCalendarBulk: SetChurchServiceCalendarBulk_setChurchServiceCalendarBulk[];
}

export interface SetChurchServiceCalendarBulkVariables {
  church_ids: string[];
  day_of_week: number;
  has_service: boolean;
  effective_from: any;
  effective_until?: any | null;
}
