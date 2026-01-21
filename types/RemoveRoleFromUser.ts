/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveRoleFromUser
// ====================================================

export interface RemoveRoleFromUser_removeRoleFromUser {
  __typename: "UserModel";
  id: string;
}

export interface RemoveRoleFromUser {
  removeRoleFromUser: RemoveRoleFromUser_removeRoleFromUser;
}

export interface RemoveRoleFromUserVariables {
  userId: string;
  roleId: string;
}
