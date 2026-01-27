/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateChurch
// ====================================================

export interface UpdateChurch_updateChurch_leader {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface UpdateChurch_updateChurch_region {
  __typename: "Region";
  id: string;
  name: string;
  color: string | null;
}

export interface UpdateChurch_updateChurch {
  __typename: "Church";
  id: string;
  name: string;
  institution_id: string;
  region_id: string | null;
  type: ChurchType;
  zip_code: string | null;
  house_number: number | null;
  updated_at: any;
  leader: UpdateChurch_updateChurch_leader | null;
  region: UpdateChurch_updateChurch_region | null;
}

export interface UpdateChurch {
  updateChurch: UpdateChurch_updateChurch;
}

export interface UpdateChurchVariables {
  id: string;
  name?: string | null;
  leader_id?: string | null;
  email?: string | null;
  phone?: string | null;
  contactName?: string | null;
  city?: string | null;
  country?: string | null;
  state?: string | null;
  type?: ChurchType | null;
  zip_code?: string | null;
  house_number?: number | null;
  region_id?: string | null;
}
