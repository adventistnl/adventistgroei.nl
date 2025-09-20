/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendInviteEmail
// ====================================================

export interface SendInviteEmail {
  /**
   * Send an invitation email
   */
  sendInviteEmail: boolean;
}

export interface SendInviteEmailVariables {
  inviter_id: string;
  to: string;
  message?: string | null;
  url: string;
}
