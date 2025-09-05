/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login_user_user_roles {
  id: string;
  name: string;
  description: string;
  key_code: string;
}

export interface Login_login_user {
  id: string;
  name: string;
  email: string;
  user_roles: Login_login_user_user_roles[];
}

export interface Login_login {
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
