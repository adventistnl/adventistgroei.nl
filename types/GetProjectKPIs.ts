/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProjectKPIs
// ====================================================

export interface GetProjectKPIs_projectKPIs {
  __typename: "ProjectKPIs";
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  upcomingProjects: number;
  totalBudget: number;
  totalSubsidizedBudget: number;
  totalSubsidyRequests: number;
  totalSubsidyAmount: number;
  projectsWithVolunteers: number;
  averageBudgetPerProject: number;
}

export interface GetProjectKPIs_projectsByDepartment {
  __typename: "ProjectsByDepartment";
  department: string;
  projects: number;
  budget_used: number;
  remaining_budget: number;
  annual_budget: number | null;
}

export interface GetProjectKPIs_subsidyStatusDistribution {
  __typename: "SubsidyStatusDistribution";
  status: string;
  count: number;
  color: string;
}

export interface GetProjectKPIs_projectsTimeline {
  __typename: "ProjectsTimeline";
  month: string;
  created: number;
  completed: number;
  budget: number;
}

export interface GetProjectKPIs {
  projectKPIs: GetProjectKPIs_projectKPIs;
  projectsByDepartment: GetProjectKPIs_projectsByDepartment[];
  subsidyStatusDistribution: GetProjectKPIs_subsidyStatusDistribution[];
  projectsTimeline: GetProjectKPIs_projectsTimeline[];
}

export interface GetProjectKPIsVariables {
  institutionId?: string | null;
}
