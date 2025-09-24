/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Role
// ====================================================

export interface Role_role_users {
  __typename: "RoleAssignmentModel";
  user_id: string;
  is_deleted: boolean;
}

export interface Role_role_permissions_data {
  __typename: "PermissionModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  group: string | null;
}

export interface Role_role_permissions {
  __typename: "PermissionGroupPermissionsModel";
  group: string;
  data: Role_role_permissions_data[];
}

export interface Role_role {
  __typename: "RoleModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  color: string | null;
  users: (Role_role_users | null)[] | null;
  permissions: Role_role_permissions[];
}

export interface Role {
  role: Role_role | null;
}

export interface RoleVariables {
  id: string;
}
