/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetZipInfo
// ====================================================

export interface GetZipInfo_getZipInfo {
  __typename: "ZipInfo";
  city: string | null;
  province: string | null;
}

export interface GetZipInfo {
  /**
   * Get city and province information for a Dutch postal code (ZIP code) and house number
   */
  getZipInfo: GetZipInfo_getZipInfo;
}

export interface GetZipInfoVariables {
  zip: string;
  houseNumber: number;
}
