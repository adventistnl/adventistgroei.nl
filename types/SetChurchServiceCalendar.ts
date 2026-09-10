/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceCalendarSource } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SetChurchServiceCalendar
// ====================================================

export interface SetChurchServiceCalendar_setChurchServiceCalendar {
  __typename: "ChurchServiceCalendar";
  id: string;
  date: any;
  has_service: boolean;
  source: ServiceCalendarSource;
}

export interface SetChurchServiceCalendar {
  setChurchServiceCalendar: SetChurchServiceCalendar_setChurchServiceCalendar[];
}

export interface SetChurchServiceCalendarVariables {
  church_id: string;
  has_service: boolean;
  date?: any | null;
  day_of_week?: number | null;
  effective_from?: any | null;
  effective_until?: any | null;
}
