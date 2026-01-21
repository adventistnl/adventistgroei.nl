/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteChurch
// ====================================================

export interface DeleteChurch_deleteChurch {
  __typename: "ChurchModel";
  id: string;
  name: string;
  is_deleted: boolean;
  deleted_at: any | null;
}

export interface DeleteChurch {
  deleteChurch: DeleteChurch_deleteChurch;
}

export interface DeleteChurchVariables {
  id: string;
}
