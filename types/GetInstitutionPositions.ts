/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InstitutionPositionType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetInstitutionPositions
// ====================================================

export interface GetInstitutionPositions_institutionPositions_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface GetInstitutionPositions_institutionPositions {
  __typename: "InstitutionPosition";
  id: string;
  position_type: InstitutionPositionType;
  institution_id: string;
  user_id: string;
  is_deleted: boolean;
  created_at: any;
  updated_at: any;
  user: GetInstitutionPositions_institutionPositions_user;
}

export interface GetInstitutionPositions {
  institutionPositions: GetInstitutionPositions_institutionPositions[];
}

export interface GetInstitutionPositionsVariables {
  institution_id: string;
}
