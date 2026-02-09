/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ConfirmRefundDone
// ====================================================

export interface ConfirmRefundDone_confirmRefundDone_subsidy_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
}

export interface ConfirmRefundDone_confirmRefundDone {
  __typename: "SubsidyRequest";
  id: string;
  refund_amount: any;
  have_refund: boolean;
  refund_done: boolean;
  subsidy_status: ConfirmRefundDone_confirmRefundDone_subsidy_status;
}

export interface ConfirmRefundDone {
  confirmRefundDone: ConfirmRefundDone_confirmRefundDone;
}

export interface ConfirmRefundDoneVariables {
  id: string;
  language?: LanguagePreference | null;
}
