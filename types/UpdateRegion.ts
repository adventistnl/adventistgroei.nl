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
  name: string;
  description: string | null;
  territory: any | null;
  color: string | null;
}

export interface UpdateRegion {
  updateRegion: UpdateRegion_updateRegion;
}

export interface UpdateRegionVariables {
  id: string;
  name?: string | null;
  description?: string | null;
  territory?: any | null;
  color?: string | null;
}
