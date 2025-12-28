/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetDepartmentKPIs
// ====================================================

export interface GetDepartmentKPIs_departmentKPIs {
  __typename: "DepartmentKPIs";
  totalDepartments: number;
  activeDepartments: number;
  departmentsWithBudget: number;
  totalUsers: number;
  totalAllocatedBudget: number;
  totalSpentBudget: number;
  averageBudgetPerDepartment: number;
  averageUsersPerDepartment: number;
  totalProjects: number;
  openProjects: number;
  completedProjects: number;
}

export interface GetDepartmentKPIs_departmentActivityData {
  __typename: "DepartmentActivityData";
  department_id: string;
  department_name: string;
  user_count: number;
  allocated_amount: number;
  spent_amount: number;
  project_count: number;
  open_projects: number;
  completed_projects: number;
  activity_count: number;
}

export interface GetDepartmentKPIs_departmentBudgetTimeline {
  __typename: "DepartmentBudgetTimeline";
  month: string;
  department_id: string;
  department_name: string;
  allocated: number;
  spent: number;
}

export interface GetDepartmentKPIs {
  departmentKPIs: GetDepartmentKPIs_departmentKPIs;
  departmentActivityData: GetDepartmentKPIs_departmentActivityData[];
  departmentBudgetTimeline: GetDepartmentKPIs_departmentBudgetTimeline[];
}

export interface GetDepartmentKPIsVariables {
  institution_id?: string | null;
  church_id?: string | null;
  selectedYear?: number | null;
}
