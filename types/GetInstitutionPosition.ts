/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InstitutionPositionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetInstitutionPosition
// ====================================================

export interface GetInstitutionPosition_institutionPosition_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetInstitutionPosition_institutionPosition {
  __typename: "InstitutionPosition";
  id: string;
  position_type: InstitutionPositionType;
  institution_id: string;
  user_id: string;
  created_at: any;
  updated_at: any;
  user: GetInstitutionPosition_institutionPosition_user;
}

export interface GetInstitutionPosition {
  institutionPosition: GetInstitutionPosition_institutionPosition | null;
}

export interface GetInstitutionPositionVariables {
  id: string;
}
