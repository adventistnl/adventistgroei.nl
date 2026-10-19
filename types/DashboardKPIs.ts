/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DashboardKPIs
// ====================================================

export interface DashboardKPIs_dashboardKPIs {
  __typename: "DashboardKPIs";
  totalUsers: number | null;
  newUsersThisYear: number | null;
  previousYearUsers: number | null;
  userGrowthRate: number | null;
  totalProjects: number | null;
  newProjectsThisYear: number | null;
  previousYearProjects: number | null;
  projectGrowthRate: number | null;
  institutionDepartments: number | null;
  churchDepartments: number | null;
  totalDepartments: number | null;
  activeChurches: number | null;
  totalRegions: number | null;
}

export interface DashboardKPIs {
  dashboardKPIs: DashboardKPIs_dashboardKPIs;
}

export interface DashboardKPIsVariables {
  institutionId: string;
  year: number;
  month?: number | null;
}
