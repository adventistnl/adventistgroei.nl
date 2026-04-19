/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: RejectSubsidyRefund
// ====================================================

export interface RejectSubsidyRefund_rejectSubsidyRefund_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
}

export interface RejectSubsidyRefund_rejectSubsidyRefund {
  __typename: "SubsidyRequest";
  id: string;
  refund_rejected: boolean;
  subsidy_status: RejectSubsidyRefund_rejectSubsidyRefund_subsidy_status;
}

export interface RejectSubsidyRefund {
  rejectSubsidyRefund: RejectSubsidyRefund_rejectSubsidyRefund;
}

export interface RejectSubsidyRefundVariables {
  id: string;
  reason: string;
  language?: LanguagePreference | null;
}
