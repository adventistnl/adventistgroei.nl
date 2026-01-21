/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateInstitution
// ====================================================

export interface CreateInstitution_createInstitution {
  __typename: "Institution";
  id: string;
}

export interface CreateInstitution {
  createInstitution: CreateInstitution_createInstitution;
}

export interface CreateInstitutionVariables {
  name: string;
  denomination: string;
  description?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactFullAddress?: string | null;
  contactWebsite?: string | null;
  contactCountry?: string | null;
  languagePreference: string;
}
