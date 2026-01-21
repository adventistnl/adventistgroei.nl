/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteDepartment
// ====================================================

export interface DeleteDepartment_deleteDepartment {
  __typename: "Department";
  id: string;
  name: string;
  is_deleted: boolean;
  deleted_at: any | null;
}

export interface DeleteDepartment {
  deleteDepartment: DeleteDepartment_deleteDepartment;
}

export interface DeleteDepartmentVariables {
  id: string;
}
