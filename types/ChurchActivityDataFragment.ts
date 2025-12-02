/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ChurchActivityDataFragment
// ====================================================

export interface ChurchActivityDataFragment {
  __typename: "ChurchActivityData";
  church_id: string;
  church_name: string;
  month: string;
  year: number;
  activity_score: number;
  user_count: number;
  department_count: number;
  project_count: number;
  has_recent_activity: boolean;
  has_recent_departments: boolean;
  has_recent_projects: boolean;
  has_updated_church: boolean;
  has_new_users: boolean;
}
