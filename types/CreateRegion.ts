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
  name: string;
  description: string | null;
  territory: any | null;
  color: string | null;
}

export interface CreateRegion {
  createRegion: CreateRegion_createRegion;
}

export interface CreateRegionVariables {
  name: string;
  description?: string | null;
  territory?: any | null;
  color?: string | null;
}
