/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AssignmentOrigin, AssignmentStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: ScheduleOverview
// ====================================================

export interface ScheduleOverview_scheduleOverview_church {
  __typename: "Church";
  id: string;
  name: string;
  region_id: string | null;
}

export interface ScheduleOverview_scheduleOverview_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface ScheduleOverview_scheduleOverview {
  __typename: "Assignment";
  id: string;
  church_id: string;
  date: any;
  user_id: string | null;
  origin: AssignmentOrigin;
  status: AssignmentStatus;
  church: ScheduleOverview_scheduleOverview_church;
  user: ScheduleOverview_scheduleOverview_user | null;
}

export interface ScheduleOverview {
  scheduleOverview: ScheduleOverview_scheduleOverview[];
}

export interface ScheduleOverviewVariables {
  month: string;
}
