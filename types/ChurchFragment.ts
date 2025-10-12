/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ChurchType } from "./globalTypes";

// ====================================================
// GraphQL fragment: ChurchFragment
// ====================================================

export interface ChurchFragment_contact {
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

export interface ChurchFragment_annual_budgets {
  __typename: "AnnualBudget";
  year: number;
  planned_budget: any;
  total_expenses: any;
}

export interface ChurchFragment_departments {
  __typename: "Department";
  id: string;
}

export interface ChurchFragment_region {
  __typename: "Region";
  id: string;
  name: string;
}

export interface ChurchFragment_users {
  __typename: "User";
  id: string;
}

export interface ChurchFragment {
  __typename: "Church";
  id: string;
  institution_id: string;
  name: string;
  region_id: string;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  type: ChurchType;
  contact: ChurchFragment_contact | null;
  annual_budgets: ChurchFragment_annual_budgets[] | null;
  departments: ChurchFragment_departments[] | null;
  region: ChurchFragment_region;
  users: ChurchFragment_users[] | null;
}
