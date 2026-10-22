/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ChurchForServiceCalendar
// ====================================================

export interface ChurchForServiceCalendar_church {
  __typename: "Church";
  id: string;
  name: string;
  leader_id: string | null;
}

export interface ChurchForServiceCalendar {
  church: ChurchForServiceCalendar_church | null;
}

export interface ChurchForServiceCalendarVariables {
  id: string;
}
