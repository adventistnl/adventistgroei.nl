/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Churches
// ====================================================

export interface Churches_churches {
  __typename: "ChurchModel";
  id: string;
  institution_id: string;
  name: string;
  region_id: string | null;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface Churches {
  churches: Churches_churches[];
}
