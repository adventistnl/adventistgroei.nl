/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateDepartment
// ====================================================

export interface UpdateDepartment_updateDepartment_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface UpdateDepartment_updateDepartment {
  __typename: "Department";
  id: string;
  name: string;
  description: string;
  church_id: string | null;
  contact: UpdateDepartment_updateDepartment_contact | null;
}

export interface UpdateDepartment {
  updateDepartment: UpdateDepartment_updateDepartment;
}

export interface UpdateDepartmentVariables {
  id: string;
  name: string;
  description: string;
  church?: string | null;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
}
