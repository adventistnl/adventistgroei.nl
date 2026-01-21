/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./globalTypes";

// ====================================================
// GraphQL query operation: InstitutionByIdLight
// ====================================================

export interface InstitutionByIdLight_institution_contact {
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
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface InstitutionByIdLight_institution {
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
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  churches_count: number;
  departments_count: number;
  users_count: number;
  total_budget: number;
  current_year_budget: number;
  has_budget_record: boolean;
  contact: InstitutionByIdLight_institution_contact | null;
}

export interface InstitutionByIdLight {
  institution: InstitutionByIdLight_institution | null;
}

export interface InstitutionByIdLightVariables {
  id: string;
}
