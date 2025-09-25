/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL query operation: Institutions
// ====================================================

export interface Institutions_institutions_contact {
  __typename: "Contact";
  id: string;
  phone: string | null;
  email: string | null;
  country: string | null;
  full_address: string | null;
  is_primary: boolean;
}

export interface Institutions_institutions {
  __typename: "Institution";
  id: string;
  name: string;
  denomination: string;
  language_preference: LanguagePreference;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  regions_count: number;
  churches_count: number;
  departments_count: number;
  users_count: number;
  contact: Institutions_institutions_contact | null;
}

export interface Institutions {
  institutions: Institutions_institutions[];
}
