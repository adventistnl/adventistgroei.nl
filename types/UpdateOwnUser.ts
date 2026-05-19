/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserUpdateDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateOwnUser
// ====================================================

export interface UpdateOwnUser_updateOwnUser_contact {
  __typename: "Contact";
  phone: string | null;
  address: string | null;
}

export interface UpdateOwnUser_updateOwnUser_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface UpdateOwnUser_updateOwnUser_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface UpdateOwnUser_updateOwnUser {
  __typename: "UserModel";
  id: string;
  name: string;
  email: string;
  recieve_emails: boolean;
  contact: UpdateOwnUser_updateOwnUser_contact | null;
  language_preference: string;
  institution_id: string;
  church_id: string | null;
  institution: UpdateOwnUser_updateOwnUser_institution | null;
  church: UpdateOwnUser_updateOwnUser_church | null;
  created_at: any;
  updated_at: any;
}

export interface UpdateOwnUser {
  updateOwnUser: UpdateOwnUser_updateOwnUser;
}

export interface UpdateOwnUserVariables {
  data: UserUpdateDto;
}
