/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL fragment: UserFragment
// ====================================================

export interface UserFragment_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface UserFragment_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface UserFragment_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface UserFragment_user_roles_role {
  __typename: "Role";
  id: string;
  name: string;
  key_code: string;
  description: string;
  color: string | null;
}

export interface UserFragment_user_roles {
  __typename: "UserRole";
  id: string;
  role: UserFragment_user_roles_role;
}

export interface UserFragment {
  __typename: "User";
  id: string;
  name: string;
  email: string;
  language_preference: LanguagePreference;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact_id: string | null;
  institution_id: string;
  contact: UserFragment_contact | null;
  institution: UserFragment_institution;
  church: UserFragment_church | null;
  user_roles: UserFragment_user_roles[] | null;
}
