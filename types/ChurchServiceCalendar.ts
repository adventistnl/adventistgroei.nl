/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ServiceCalendarSource } from "./globalTypes";

// ====================================================
// GraphQL query operation: ChurchServiceCalendar
// ====================================================

export interface ChurchServiceCalendar_churchServiceCalendar {
  __typename: "ChurchServiceCalendar";
  id: string;
  date: any;
  has_service: boolean;
  source: ServiceCalendarSource;
}

export interface ChurchServiceCalendar {
  churchServiceCalendar: ChurchServiceCalendar_churchServiceCalendar[];
}

export interface ChurchServiceCalendarVariables {
  church_id: string;
  month: string;
}
