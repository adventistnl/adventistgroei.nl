/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateInstitution
// ====================================================

export interface UpdateInstitution_updateInstitution {
  __typename: "Institution";
  id: string;
}

export interface UpdateInstitution {
  updateInstitution: UpdateInstitution_updateInstitution;
}

export interface UpdateInstitutionVariables {
  id: string;
  name?: string | null;
  denomination?: string | null;
  language_preference?: string | null;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  contactId: string;
}
