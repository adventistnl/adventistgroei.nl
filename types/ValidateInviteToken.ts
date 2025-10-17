/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ValidateInviteToken
// ====================================================

export interface ValidateInviteToken_validateInviteToken {
  __typename: "ValidateOutputModel";
  role_ids: string[];
  email: string;
  institution_id: string;
  inviter_id: string;
  language_preference: LanguagePreference | null;
  exp: number;
}

export interface ValidateInviteToken {
  validateInviteToken: ValidateInviteToken_validateInviteToken;
}

export interface ValidateInviteTokenVariables {
  token: string;
}
