/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RequestSubsidyRefund
// ====================================================

export interface RequestSubsidyRefund_requestSubsidyRefund_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
}

export interface RequestSubsidyRefund_requestSubsidyRefund {
  __typename: "SubsidyRequest";
  id: string;
  refund_amount: any;
  have_refund: boolean;
  refund_done: boolean;
  subsidy_status: RequestSubsidyRefund_requestSubsidyRefund_subsidy_status;
}

export interface RequestSubsidyRefund {
  requestSubsidyRefund: RequestSubsidyRefund_requestSubsidyRefund;
}

export interface RequestSubsidyRefundVariables {
  id: string;
  refundAmount: number;
  reason: string;
  language?: LanguagePreference | null;
}
