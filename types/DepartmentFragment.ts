/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: DepartmentFragment
// ====================================================

export interface DepartmentFragment_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface DepartmentFragment {
  __typename: "Department";
  id: string;
  institution_id: string;
  church_id: string;
  name: string;
  description: string;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  church: DepartmentFragment_church;
}
