/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetZipInfo
// ====================================================

export interface GetZipInfo_getZipInfo {
  __typename: "ZipInfo";
  city: string;
  province: string;
}

export interface GetZipInfo {
  getZipInfo: GetZipInfo_getZipInfo;
}

export interface GetZipInfoVariables {
  zip: string;
  houseNumber: number;
}
