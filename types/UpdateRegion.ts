/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateRegion
// ====================================================

export interface UpdateRegion_updateRegion {
  __typename: "RegionModel";
  id: string;
}

export interface UpdateRegion {
  updateRegion: UpdateRegion_updateRegion;
}

export interface UpdateRegionVariables {
  id: string;
  name: string;
  institution_id?: string | null;
  parent_region_id?: string | null;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
}
