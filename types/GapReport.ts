/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GapReport
// ====================================================

export interface GapReport_gapReport_churchesWithoutPreacher {
  __typename: "ChurchGapEntry";
  churchId: string;
  churchName: string;
  date: any;
}

export interface GapReport_gapReport_preachersWithoutAssignment {
  __typename: "PreacherGapEntry";
  userId: string;
  userName: string;
  date: any;
}

export interface GapReport_gapReport {
  __typename: "GapReport";
  month: string;
  computedAt: any;
  churchesWithoutPreacher: GapReport_gapReport_churchesWithoutPreacher[];
  preachersWithoutAssignment: GapReport_gapReport_preachersWithoutAssignment[];
}

export interface GapReport {
  gapReport: GapReport_gapReport;
}

export interface GapReportVariables {
  month: string;
}
