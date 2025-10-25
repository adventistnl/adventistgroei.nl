/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Permissions
// ====================================================

export interface Permissions_permissions_data {
  __typename: "PermissionModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  group: string | null;
  is_essential: boolean | null;
}

export interface Permissions_permissions {
  __typename: "PermissionGroupPermissionsModel";
  group: string;
  data: Permissions_permissions_data[];
}

export interface Permissions {
  permissions: Permissions_permissions[];
}
