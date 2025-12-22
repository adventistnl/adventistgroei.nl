/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UploadActivityDocumentDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UploadActivityDocument
// ====================================================

export interface UploadActivityDocument_uploadActivityDocument {
  __typename: "ActivityDocuments";
  id: string;
  activity_id: string;
  project_activity_id: string | null;
  file_url: string;
  drive_file_id: string | null;
  type: string;
  is_validated: boolean;
  uploaded_by: string;
  created_at: any;
  validated_at: any | null;
  updated_at: any;
  updated_by: string | null;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface UploadActivityDocument {
  uploadActivityDocument: UploadActivityDocument_uploadActivityDocument;
}

export interface UploadActivityDocumentVariables {
  input: UploadActivityDocumentDto;
  file: any;
}
