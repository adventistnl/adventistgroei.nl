/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: RegionFragment
// ====================================================

export interface RegionFragment_contact {
  __typename: "Contact";
  id: string;
  name: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  full_address: string | null;
  postal_code: string | null;
  website: string | null;
  notes: string | null;
  is_primary: boolean;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}

export interface RegionFragment_churches {
  __typename: "Church";
  id: string;
}

export interface RegionFragment_institution {
  __typename: "Institution";
  id: string;
  name: string;
}

export interface RegionFragment_annual_budgets {
  __typename: "AnnualBudget";
  year: number;
  planned_budget: any;
  total_expenses: any;
}

export interface RegionFragment {
  __typename: "Region";
  id: string;
  name: string;
  parent_region_id: string | null;
  contact_id: string | null;
  contact: RegionFragment_contact | null;
  churches: RegionFragment_churches[] | null;
  institution: RegionFragment_institution;
  annual_budgets: RegionFragment_annual_budgets[] | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
}
