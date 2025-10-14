/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GenderType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateUser
// ====================================================

export interface CreateUser_createUser {
  __typename: "UserModel";
  id: string;
  institution_id: string;
  password: string | null;
  church_id: string | null;
  name: string;
  email: string;
  language_preference: string;
}

export interface CreateUser {
  createUser: CreateUser_createUser;
}

export interface CreateUserVariables {
  name: string;
  email: string;
  password: string;
  language_preference: string;
  institution_id: string;
  department_id: string;
  church_id: string;
  roles: string[];
  gender: GenderType;
}
