/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Departments
// ====================================================

export interface Departments_departments {
  __typename: "Department";
  id: string;
  institution_id: string;
  church_id: string;
  name: string;
  description: string;
  annual_budget: any;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface Departments {
  departments: Departments_departments[];
}
