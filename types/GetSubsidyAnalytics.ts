/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSubsidyAnalytics
// ====================================================

export interface GetSubsidyAnalytics_subsidyKPIs {
  __typename: "SubsidyKPIs";
  totalRequests: number;
  pendingRequests: number;
  inReviewRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRequested: number;
  totalApproved: number;
  approvalRate: number;
}

export interface GetSubsidyAnalytics_subsidyByDepartment {
  __typename: "SubsidyByDepartment";
  month: string;
  department: string;
  amount: number;
}

export interface GetSubsidyAnalytics_subsidyByMonth {
  __typename: "SubsidyByMonth";
  month: string;
  approved: number;
  pending: number;
  rejected: number;
  quarter: number;
}

export interface GetSubsidyAnalytics_subsidyByStatus {
  __typename: "SubsidyByStatus";
  status: string;
  count: number;
  fill: string;
}

export interface GetSubsidyAnalytics {
  subsidyKPIs: GetSubsidyAnalytics_subsidyKPIs;
  subsidyByDepartment: GetSubsidyAnalytics_subsidyByDepartment[];
  subsidyByMonth: GetSubsidyAnalytics_subsidyByMonth[];
  subsidyByStatus: GetSubsidyAnalytics_subsidyByStatus[];
}

export interface GetSubsidyAnalyticsVariables {
  institutionId?: string | null;
}
