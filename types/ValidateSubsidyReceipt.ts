/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ValidateSubsidyReceipt
// ====================================================

export interface ValidateSubsidyReceipt_validateSubsidyReceipt_subsidy_request {
  __typename: "SubsidyRequest";
  id: string;
  subsidy_statuses_id: string;
}

export interface ValidateSubsidyReceipt_validateSubsidyReceipt {
  __typename: "SubsidyReceipt";
  id: string;
  filename: string;
  is_validated: boolean;
  approved: boolean;
  validated_at: any | null;
  validated_by: string | null;
  note: string | null;
  amount: any | null;
  file_url: string;
  subsidy_request: ValidateSubsidyReceipt_validateSubsidyReceipt_subsidy_request | null;
}

export interface ValidateSubsidyReceipt {
  validateSubsidyReceipt: ValidateSubsidyReceipt_validateSubsidyReceipt;
}

export interface ValidateSubsidyReceiptVariables {
  id: string;
  note?: string | null;
}
