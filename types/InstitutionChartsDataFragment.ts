/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: InstitutionChartsDataFragment
// ====================================================

export interface InstitutionChartsDataFragment_usersByRole {
  __typename: "UsersByRoleData";
  role: string;
  count: number;
  fill: string;
}

export interface InstitutionChartsDataFragment {
  __typename: "InstitutionChartsData";
  usersByRole: InstitutionChartsDataFragment_usersByRole[];
  monthlyUserGrowth: number | null;
}
