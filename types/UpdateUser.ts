/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser {
  __typename: "UserModel";
  id: string;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser;
}

export interface UpdateUserVariables {
  id: string;
  name?: string | null;
  contact_id?: string | null;
  email?: string | null;
  language_preference?: string | null;
  institution_id?: string | null;
  church_id?: string | null;
  department_id?: string | null;
  is_deleted?: boolean | null;
  phone?: string | null;
  address?: string | null;
}
