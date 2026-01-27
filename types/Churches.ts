/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType } from "./globalTypes";

// ====================================================
// GraphQL query operation: Churches
// ====================================================

export interface Churches_churches_leader {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface Churches_churches_contact {
  __typename: "Contact";
  id: string;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
}

export interface Churches_churches_region {
  __typename: "Region";
  id: string;
  name: string;
  color: string | null;
}

export interface Churches_churches {
  __typename: "Church";
  id: string;
  institution_id: string;
  name: string;
  region_id: string | null;
  contact_id: string | null;
  leader_id: string | null;
  zip_code: string | null;
  house_number: number | null;
  leader: Churches_churches_leader | null;
  contact: Churches_churches_contact | null;
  region: Churches_churches_region | null;
  type: ChurchType;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface Churches {
  churches: Churches_churches[];
}
