/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: OpenSlotsForPreacher
// ====================================================

export interface OpenSlotsForPreacher_openSlotsForPreacher {
  __typename: "OpenSlotForPreacher";
  churchId: string;
  churchName: string;
  date: any;
}

export interface OpenSlotsForPreacher {
  openSlotsForPreacher: OpenSlotsForPreacher_openSlotsForPreacher[];
}

export interface OpenSlotsForPreacherVariables {
  month: string;
}
