/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateChurchRegion
// ====================================================

export interface UpdateChurchRegion_updateChurch_region {
  __typename: "Region";
  id: string;
  name: string;
  color: string | null;
}

export interface UpdateChurchRegion_updateChurch {
  __typename: "Church";
  id: string;
  name: string;
  region_id: string | null;
  region: UpdateChurchRegion_updateChurch_region | null;
}

export interface UpdateChurchRegion {
  updateChurch: UpdateChurchRegion_updateChurch;
}

export interface UpdateChurchRegionVariables {
  id: string;
  region_id?: string | null;
}
