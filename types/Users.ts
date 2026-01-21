/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Users
// ====================================================

export interface Users_users_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface Users_users_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface Users_users_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface Users_users {
  __typename: "UserModel";
  id: string;
  institution_id: string;
  password: string | null;
  church_id: string | null;
  department_id: string | null;
  name: string;
  email: string;
  language_preference: string;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact: Users_users_contact | null;
  institution: Users_users_institution | null;
  church: Users_users_church | null;
}

export interface Users {
  users: Users_users[];
}

export interface UsersVariables {
  institution_id?: string | null;
}
