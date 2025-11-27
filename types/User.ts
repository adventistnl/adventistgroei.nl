/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference, ChurchType } from "./globalTypes";

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
  denomination: string;
  description: string | null;
  language_preference: LanguagePreference;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
}

export interface User_user_church {
  __typename: "Church";
  id: string;
  type: ChurchType;
  institution_id: string;
  name: string;
  region_id: string | null;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface User_user {
  __typename: "UserModel";
  id: string;
  institution_id: string;
  church_id: string | null;
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
