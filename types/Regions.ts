/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Regions
// ====================================================

export interface Regions_regions_kpiData {
  __typename: "RegionKPIData";
  totalRegions: number;
  totalChurches: number;
  totalProvinces: number;
  totalCities: number;
}

export interface Regions_regions_churches_contact {
  __typename: "Contact";
  id: string;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
}

export interface Regions_regions_churches {
  __typename: "Church";
  id: string;
  institution_id: string;
  name: string;
  region_id: string | null;
  contact_id: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  contact: Regions_regions_churches_contact | null;
}

export interface Regions_regions {
  __typename: "Region";
  id: string;
  name: string;
  description: string | null;
  territory: any | null;
  color: string | null;
  created_at: any;
  updated_at: any;
  created_by: string;
  updated_by: string;
  is_deleted: boolean;
  deleted_at: any | null;
  deleted_by: string | null;
  kpiData: Regions_regions_kpiData;
  churches: Regions_regions_churches[] | null;
}

export interface Regions {
  regions: Regions_regions[];
}
