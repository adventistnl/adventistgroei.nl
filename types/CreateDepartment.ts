/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateDepartment
// ====================================================

export interface CreateDepartment_createDepartment {
  __typename: "Department";
  id: string;
}

export interface CreateDepartment {
  createDepartment: CreateDepartment_createDepartment;
}

export interface CreateDepartmentVariables {
  name: string;
  description: string;
  institution: string;
  leader_id: string;
  church?: string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
}
