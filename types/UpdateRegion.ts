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
  description?: string | null;
}
