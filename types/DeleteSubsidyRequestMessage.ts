/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteSubsidyRequestMessage
// ====================================================

export interface DeleteSubsidyRequestMessage_deleteSubsidyRequestMessage {
  __typename: "SubsidyStatusHistory";
  id: string;
}

export interface DeleteSubsidyRequestMessage {
  deleteSubsidyRequestMessage: DeleteSubsidyRequestMessage_deleteSubsidyRequestMessage;
}

export interface DeleteSubsidyRequestMessageVariables {
  id: string;
  language?: LanguagePreference | null;
}
