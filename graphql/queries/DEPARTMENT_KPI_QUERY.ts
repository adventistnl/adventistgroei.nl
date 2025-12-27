import { gql } from "@apollo/client";

export const GET_DEPARTMENT_KPIS_QUERY = gql`
  query GetDepartmentKPIs($institution_id: String, $church_id: String, $selectedYear: Float) {
    departmentKPIs(institution_id: $institution_id, church_id: $church_id, selectedYear: $selectedYear) {
      totalDepartments
      activeDepartments
      departmentsWithBudget
      totalUsers
      totalAllocatedBudget
      totalSpentBudget
      averageBudgetPerDepartment
      averageUsersPerDepartment
      totalProjects
      openProjects
      completedProjects
    }

    departmentActivityData(institution_id: $institution_id, church_id: $church_id, selectedYear: $selectedYear) {
      department_id
      department_name
      user_count
      allocated_amount
      spent_amount
      project_count
      open_projects
      completed_projects
      activity_count
    }

    departmentBudgetTimeline(institution_id: $institution_id, church_id: $church_id, selectedYear: $selectedYear) {
      month
      department_id
      department_name
      allocated
      spent
    }
  }
`;
