/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EligiblePreachersForSlot
// ====================================================

export interface EligiblePreachersForSlot_eligiblePreachersForSlot {
  __typename: "User";
  id: string;
  name: string;
}

export interface EligiblePreachersForSlot {
  eligiblePreachersForSlot: EligiblePreachersForSlot_eligiblePreachersForSlot[];
}

export interface EligiblePreachersForSlotVariables {
  church_id: string;
  date: any;
}
