/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  full_address: string | null;
  postal_code: string | null;
  website: string | null;
  notes: string | null;
  is_primary: boolean;
  created_at: any;
  updated_at: any;
}

export interface User_user_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface User_user_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface User_user {
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
  recieve_emails: boolean;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact: User_user_contact | null;
  institution: User_user_institution | null;
  church: User_user_church | null;
}

export interface User {
  user: User_user | null;
}

export interface UserVariables {
  id: string;
}
