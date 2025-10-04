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
  contactId: string;
  name?: string | null;
  phone?: string | null;
  mobile?: string | null;
  country?: string | null;
  email?: string | null;
  city?: string | null;
  address?: string | null;
  full_address?: string | null;
  postal_code?: string | null;
  website?: string | null;
  notes?: string | null;
  is_primary?: boolean | null;
}
