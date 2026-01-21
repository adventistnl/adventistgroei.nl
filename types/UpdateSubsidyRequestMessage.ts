/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSubsidyRequestMessage
// ====================================================

export interface UpdateSubsidyRequestMessage_updateSubsidyRequestMessage {
  __typename: "SubsidyStatusHistory";
  id: string;
  reason: string | null;
  changed_at: any;
}

export interface UpdateSubsidyRequestMessage {
  updateSubsidyRequestMessage: UpdateSubsidyRequestMessage_updateSubsidyRequestMessage;
}

export interface UpdateSubsidyRequestMessageVariables {
  id: string;
  message: string;
}
