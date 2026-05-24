/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: UserModelFragment
// ====================================================

export interface UserModelFragment_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface UserModelFragment_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface UserModelFragment_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface UserModelFragment {
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
  contact: UserModelFragment_contact | null;
  institution: UserModelFragment_institution | null;
  church: UserModelFragment_church | null;
}
