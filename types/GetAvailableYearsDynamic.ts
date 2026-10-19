/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AvailableYearsEntity } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetAvailableYearsDynamic
// ====================================================

export interface GetAvailableYearsDynamic {
  availableYears: number[];
}

export interface GetAvailableYearsDynamicVariables {
  entities: AvailableYearsEntity[];
  institution_id?: string | null;
}
