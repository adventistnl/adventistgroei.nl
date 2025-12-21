/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ValidateActivityDocument
// ====================================================

export interface ValidateActivityDocument_validateActivityDocument {
  __typename: "ActivityDocuments";
  id: string;
  is_validated: boolean;
  validated_at: any | null;
  updated_at: any;
  updated_by: string | null;
}

export interface ValidateActivityDocument {
  validateActivityDocument: ValidateActivityDocument_validateActivityDocument;
}

export interface ValidateActivityDocumentVariables {
  id: string;
}
