/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteProjectActivity
// ====================================================

export interface DeleteProjectActivity_deleteProjectActivity {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  is_deleted: boolean;
  deleted_at: any | null;
}

export interface DeleteProjectActivity {
  deleteProjectActivity: DeleteProjectActivity_deleteProjectActivity;
}

export interface DeleteProjectActivityVariables {
  id: string;
}
