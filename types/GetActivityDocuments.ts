/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetActivityDocuments
// ====================================================

export interface GetActivityDocuments_getActivityDocuments {
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

export interface GetActivityDocuments {
  getActivityDocuments: GetActivityDocuments_getActivityDocuments[];
}

export interface GetActivityDocumentsVariables {
  activityId: string;
}
