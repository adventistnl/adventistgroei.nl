/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Roles
// ====================================================

export interface Roles_roles_users {
  __typename: "RoleAssignmentModel";
  user_id: string;
  is_deleted: boolean;
}

export interface Roles_roles_permissions_data {
  __typename: "PermissionModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  group: string | null;
  is_essential: boolean | null;
}

export interface Roles_roles_permissions {
  __typename: "PermissionGroupPermissionsModel";
  group: string;
  data: Roles_roles_permissions_data[];
}

export interface Roles_roles {
  __typename: "RoleModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  is_fixed: boolean;
  users: (Roles_roles_users | null)[] | null;
  color: string | null;
  permissions: Roles_roles_permissions[];
}

export interface Roles {
  roles: Roles_roles[];
}
