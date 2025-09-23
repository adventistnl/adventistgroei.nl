/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateRole
// ====================================================

export interface UpdateRole_updateRole_permissions_data {
  __typename: "PermissionModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  group: string | null;
}

export interface UpdateRole_updateRole_permissions {
  __typename: "PermissionGroupPermissionsModel";
  group: string;
  data: UpdateRole_updateRole_permissions_data[];
}

export interface UpdateRole_updateRole {
  __typename: "RoleModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  permissions: UpdateRole_updateRole_permissions[];
}

export interface UpdateRole {
  updateRole: UpdateRole_updateRole;
}

export interface UpdateRoleVariables {
  id: string;
  permissionIds: string[];
}
