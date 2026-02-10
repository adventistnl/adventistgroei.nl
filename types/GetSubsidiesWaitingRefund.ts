/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSubsidiesWaitingRefund
// ====================================================

export interface GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_requester {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_department {
  __typename: "Department";
  id: string;
  name: string;
}

export interface GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
}

export interface GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund {
  __typename: "SubsidyRequest";
  id: string;
  description: string;
  refund_amount: any;
  have_refund: boolean;
  refund_done: boolean;
  created_at: any;
  requester: GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_requester;
  institution: GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_institution;
  department: GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_department;
  subsidy_status: GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund_subsidy_status;
}

export interface GetSubsidiesWaitingRefund {
  getSubsidiesWaitingRefund: GetSubsidiesWaitingRefund_getSubsidiesWaitingRefund[];
}

export interface GetSubsidiesWaitingRefundVariables {
  institutionId?: string | null;
}
