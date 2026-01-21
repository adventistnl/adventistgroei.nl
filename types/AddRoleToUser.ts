/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddRoleToUser
// ====================================================

export interface AddRoleToUser_addRoleToUser {
  __typename: "UserModel";
  id: string;
}

export interface AddRoleToUser {
  addRoleToUser: AddRoleToUser_addRoleToUser;
}

export interface AddRoleToUserVariables {
  userId: string;
  roleId: string;
}
