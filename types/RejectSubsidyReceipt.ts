/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RejectSubsidyReceipt
// ====================================================

export interface RejectSubsidyReceipt_rejectSubsidyReceipt_subsidy_request {
  __typename: "SubsidyRequest";
  id: string;
  subsidy_statuses_id: string;
}

export interface RejectSubsidyReceipt_rejectSubsidyReceipt {
  __typename: "SubsidyReceipt";
  id: string;
  filename: string;
  is_validated: boolean;
  approved: boolean;
  validated_at: any | null;
  validated_by: string | null;
  rejection_reason: string | null;
  amount: any | null;
  file_url: string;
  subsidy_request: RejectSubsidyReceipt_rejectSubsidyReceipt_subsidy_request | null;
}

export interface RejectSubsidyReceipt {
  rejectSubsidyReceipt: RejectSubsidyReceipt_rejectSubsidyReceipt;
}

export interface RejectSubsidyReceiptVariables {
  id: string;
  reason?: string | null;
}
