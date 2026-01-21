/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateInstitutionContact
// ====================================================

export interface UpdateInstitutionContact_updateInstitution {
  __typename: "Institution";
  id: string;
}

export interface UpdateInstitutionContact {
  updateInstitution: UpdateInstitutionContact_updateInstitution;
}

export interface UpdateInstitutionContactVariables {
  id: string;
  contactId: string;
  name?: string | null;
  phone?: string | null;
  mobile?: string | null;
  country?: string | null;
  email?: string | null;
  city?: string | null;
  address?: string | null;
  full_address?: string | null;
  postal_code?: string | null;
  website?: string | null;
  notes?: string | null;
  is_primary?: boolean | null;
}
