/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkNotificationRead
// ====================================================

export interface MarkNotificationRead_markNotificationRead {
  __typename: "Notification";
  id: string;
  read_status: boolean;
}

export interface MarkNotificationRead {
  markNotificationRead: MarkNotificationRead_markNotificationRead;
}

export interface MarkNotificationReadVariables {
  id: string;
}
