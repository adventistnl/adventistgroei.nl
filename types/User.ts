/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LanguagePreference } from "./graphql-global-types";

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user {
  id: string;
  institution_id: string;
  church_id: string | null;
  name: string;
  email: string;
  language_preference: LanguagePreference;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface User {
  user: User_user | null;
}
