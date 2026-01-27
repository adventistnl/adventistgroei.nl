/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, SubsidyHistoryType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddSubsidyRequestMessage
// ====================================================

export interface AddSubsidyRequestMessage_addSubsidyRequestMessage_status {
  __typename: "SubsidyStatus";
  id: string;
  name: string;
}

export interface AddSubsidyRequestMessage_addSubsidyRequestMessage_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface AddSubsidyRequestMessage_addSubsidyRequestMessage {
  __typename: "SubsidyStatusHistory";
  id: string;
  subsidy_request_id: string;
  status_id: string;
  type: SubsidyHistoryType;
  reason: string | null;
  changed_by: string;
  changed_at: any;
  status: AddSubsidyRequestMessage_addSubsidyRequestMessage_status;
  user: AddSubsidyRequestMessage_addSubsidyRequestMessage_user;
}

export interface AddSubsidyRequestMessage {
  addSubsidyRequestMessage: AddSubsidyRequestMessage_addSubsidyRequestMessage;
}

export interface AddSubsidyRequestMessageVariables {
  id: string;
  message: string;
  language?: LanguagePreference | null;
}
