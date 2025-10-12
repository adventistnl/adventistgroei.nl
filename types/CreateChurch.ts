/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateChurch
// ====================================================

export interface CreateChurch_createChurch {
  __typename: "ChurchModel";
  id: string;
}

export interface CreateChurch {
  createChurch: CreateChurch_createChurch;
}

export interface CreateChurchVariables {
  institution_id: string;
  name: string;
  region_id: string;
  email: string;
  phone: string;
  contactName: string;
  city: string;
  type?: ChurchType | null;
}
