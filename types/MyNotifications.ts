/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyNotifications
// ====================================================

export interface MyNotifications_myNotifications {
  __typename: "Notification";
  id: string;
  type: string;
  title: string | null;
  message: string;
  read_status: boolean;
  project_id: string | null;
  created_at: any;
}

export interface MyNotifications {
  myNotifications: MyNotifications_myNotifications[];
}
