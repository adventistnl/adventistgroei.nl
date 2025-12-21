/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteActivityDocument
// ====================================================

export interface DeleteActivityDocument_deleteActivityDocument {
  __typename: "ActivityDocuments";
  id: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface DeleteActivityDocument {
  deleteActivityDocument: DeleteActivityDocument_deleteActivityDocument;
}

export interface DeleteActivityDocumentVariables {
  id: string;
}
