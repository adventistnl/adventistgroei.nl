/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateChurch
// ====================================================

export interface CreateChurch_createChurch_leader {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface CreateChurch_createChurch {
  __typename: "Church";
  id: string;
  name: string;
  institution_id: string;
  region_id: string | null;
  type: ChurchType;
  zip_code: string | null;
  house_number: number | null;
  created_at: any;
  leader: CreateChurch_createChurch_leader | null;
}

export interface CreateChurch {
  createChurch: CreateChurch_createChurch;
}

export interface CreateChurchVariables {
  institution_id: string;
  name: string;
  leader_id?: string | null;
  email: string;
  phone: string;
  contactName: string;
  city: string;
  country: string;
  state: string;
  type?: ChurchType | null;
  zip_code?: string | null;
  house_number?: number | null;
}
