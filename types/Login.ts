/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_user_user_roles_permissions_data {
  __typename: "PermissionModel";
  name: string;
  resolver_name: string;
}

export interface Login_login_user_user_roles_permissions {
  __typename: "PermissionGroupPermissionsModel";
  group: string;
  data: Login_login_user_user_roles_permissions_data[];
}

export interface Login_login_user_user_roles {
  __typename: "RoleModel";
  id: string;
  name: string;
  description: string;
  key_code: string;
  permissions: Login_login_user_user_roles_permissions[];
}

export interface Login_login_user {
  __typename: "UserWithRoles";
  id: string;
  name: string;
  email: string;
  user_roles: Login_login_user_user_roles[];
}

export interface Login_login {
  __typename: "AuthModel";
  accessToken: string;
  expiresIn: number;
  user: Login_login_user;
}

export interface Login {
  login: Login_login;
}

export interface LoginVariables {
  email: string;
  password: string;
}
