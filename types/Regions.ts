/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Regions
// ====================================================

export interface Regions_regions_churches {
  __typename: "Church";
  id: string;
  institution_id: string;
  name: string;
  region_id: string;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface Regions_regions {
  __typename: "Region";
  id: string;
  name: string;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  churches: Regions_regions_churches[] | null;
}

export interface Regions {
  regions: Regions_regions[];
}
