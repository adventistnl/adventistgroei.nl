/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InviteUser
// ====================================================

export interface InviteUser_inviteUser {
  __typename: "InviteModel";
  token: string;
}

export interface InviteUser {
  inviteUser: InviteUser_inviteUser;
}

export interface InviteUserVariables {
  role_ids: string[];
  email: string;
  institution_id: string;
  inviter_id: string;
  language_preference: string;
}
