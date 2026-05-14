/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InstitutionPositionUpdateDto, InstitutionPositionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateInstitutionPosition
// ====================================================

export interface UpdateInstitutionPosition_updateInstitutionPosition_user {
  __typename: "User";
  id: string;
  name: string;
  email: string;
}

export interface UpdateInstitutionPosition_updateInstitutionPosition {
  __typename: "InstitutionPosition";
  id: string;
  position_type: InstitutionPositionType;
  institution_id: string;
  user_id: string;
  updated_at: any;
  user: UpdateInstitutionPosition_updateInstitutionPosition_user;
}

export interface UpdateInstitutionPosition {
  updateInstitutionPosition: UpdateInstitutionPosition_updateInstitutionPosition;
}

export interface UpdateInstitutionPositionVariables {
  id: string;
  data: InstitutionPositionUpdateDto;
}
