/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: InstitutionsForInvite
// ====================================================

export interface InstitutionsForInvite_institutions_departments {
  __typename: "Department";
  id: string;
  name: string;
}

export interface InstitutionsForInvite_institutions_churches_departments {
  __typename: "Department";
  id: string;
  name: string;
}

export interface InstitutionsForInvite_institutions_churches {
  __typename: "Church";
  id: string;
  name: string;
  departments: InstitutionsForInvite_institutions_churches_departments[] | null;
}

export interface InstitutionsForInvite_institutions {
  __typename: "Institution";
  id: string;
  name: string;
  departments: InstitutionsForInvite_institutions_departments[] | null;
  churches: InstitutionsForInvite_institutions_churches[] | null;
}

export interface InstitutionsForInvite {
  institutions: InstitutionsForInvite_institutions[];
}
