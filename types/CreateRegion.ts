/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateRegion
// ====================================================

export interface CreateRegion_createRegion {
  __typename: "RegionModel";
  id: string;
  institution_id: string;
  name: string;
  parent_region_id: string | null;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface CreateRegion {
  createRegion: CreateRegion_createRegion;
}

export interface CreateRegionVariables {
  name: string;
  institution_id: string;
  parent_region_id?: string | null;
  email?: string | null;
  phone?: string | null;
  mobile?: string | null;
  country?: string | null;
  city?: string | null;
  full_address?: string | null;
  postal_code?: string | null;
  website?: string | null;
}
