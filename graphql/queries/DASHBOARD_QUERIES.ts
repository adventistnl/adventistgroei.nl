import { gql } from "@apollo/client";

export const GET_DASHBOARD_KPIS = gql`
  query DashboardKPIs($institutionId: String!, $year: Int!, $month: Int) {
    dashboardKPIs(institutionId: $institutionId, year: $year, month: $month) {
      # Users
      totalUsers
      newUsersThisYear
      previousYearUsers
      userGrowthRate
      # Projects
      totalProjects
      newProjectsThisYear
      previousYearProjects
      projectGrowthRate
      # Structure
      institutionDepartments
      churchDepartments
      totalDepartments
      activeChurches
      totalRegions
    }
  }
`;
