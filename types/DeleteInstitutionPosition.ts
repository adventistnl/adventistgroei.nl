/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InstitutionPositionType } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteInstitutionPosition
// ====================================================

export interface DeleteInstitutionPosition_deleteInstitutionPosition {
  __typename: "InstitutionPosition";
  id: string;
  position_type: InstitutionPositionType;
  is_deleted: boolean;
}

export interface DeleteInstitutionPosition {
  deleteInstitutionPosition: DeleteInstitutionPosition_deleteInstitutionPosition;
}

export interface DeleteInstitutionPositionVariables {
  id: string;
}
