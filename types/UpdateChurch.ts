/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateChurch
// ====================================================

export interface UpdateChurch_updateChurch {
  __typename: "ChurchModel";
  id: string;
  name: string;
  institution_id: string;
  region_id: string | null;
  type: ChurchType | null;
  updated_at: any;
}

export interface UpdateChurch {
  updateChurch: UpdateChurch_updateChurch;
}

export interface UpdateChurchVariables {
  id: string;
  name?: string | null;
  region_id?: string | null;
  email?: string | null;
  phone?: string | null;
  contactName?: string | null;
  city?: string | null;
  country?: string | null;
  state?: string | null;
  type?: ChurchType | null;
}
