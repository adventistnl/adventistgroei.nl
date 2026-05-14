/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InstitutionPositionCreateDto, InstitutionPositionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateInstitutionPosition
// ====================================================

export interface CreateInstitutionPosition_createInstitutionPosition_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface CreateInstitutionPosition_createInstitutionPosition {
  __typename: "InstitutionPosition";
  id: string;
  position_type: InstitutionPositionType;
  institution_id: string;
  user_id: string;
  created_at: any;
  user: CreateInstitutionPosition_createInstitutionPosition_user;
}

export interface CreateInstitutionPosition {
  createInstitutionPosition: CreateInstitutionPosition_createInstitutionPosition;
}

export interface CreateInstitutionPositionVariables {
  data: InstitutionPositionCreateDto;
}
