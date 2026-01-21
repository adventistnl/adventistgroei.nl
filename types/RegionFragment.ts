/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RegionFragment
// ====================================================

export interface RegionFragment_churches {
  __typename: "Church";
  id: string;
}

export interface RegionFragment {
  __typename: "Region";
  id: string;
  name: string;
  churches: RegionFragment_churches[] | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}
