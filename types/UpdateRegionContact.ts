/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateRegionContact
// ====================================================

export interface UpdateRegionContact_updateRegion {
  __typename: "RegionModel";
  id: string;
}

export interface UpdateRegionContact {
  updateRegion: UpdateRegionContact_updateRegion;
}

export interface UpdateRegionContactVariables {
  id: string;
  name?: string | null;
  description?: string | null;
}
