/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRole
// ====================================================

export interface CreateRole_createRole {
  __typename: "RoleModel";
  id: string;
}

export interface CreateRole {
  createRole: CreateRole_createRole;
}

export interface CreateRoleVariables {
  name: string;
  description: string;
  key_code: string;
}
