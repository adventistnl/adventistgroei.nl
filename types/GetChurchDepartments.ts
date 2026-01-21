/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetChurchDepartments
// ====================================================

export interface GetChurchDepartments_departments_church {
  __typename: "Church";
  id: string;
  name: string;
}

export interface GetChurchDepartments_departments {
  __typename: "Department";
  id: string;
  name: string;
  description: string;
  church_id: string | null;
  church: GetChurchDepartments_departments_church | null;
}

export interface GetChurchDepartments {
  departments: GetChurchDepartments_departments[];
}

export interface GetChurchDepartmentsVariables {
  church_id: string;
}
