/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetInstitutionalDepartmentsKPIs
// ====================================================

export interface GetInstitutionalDepartmentsKPIs_institutionalDepartmentsKPIs {
  __typename: "InstitutionalDepartmentsKPIs";
  totalPlanned: number;
  totalAllocated: number;
  totalSpent: number;
  totalAvailable: number;
  totalDepartments: number;
  departmentsWithBudget: number;
}

export interface GetInstitutionalDepartmentsKPIs {
  institutionalDepartmentsKPIs: GetInstitutionalDepartmentsKPIs_institutionalDepartmentsKPIs;
}

export interface GetInstitutionalDepartmentsKPIsVariables {
  year: number;
  institutionId: string;
}
