import { gql } from "@apollo/client";

export const GET_PROJECTS_QUERY = gql`
  query Projects($institutionId: String) {
    projects(institutionId: $institutionId) {
      id
      title
      description
      budget
      type
      is_private
      required_volunteers
      start_at
      end_at
      deadline
      language_preference
      department_id
      owner_id
      institution_id
      event_id
      created_at
      updated_at
      owner {
        id
        name
        email
      }
      department {
        id
        name
      }
      Institution {
        id
        name
      }
      activities {
        id
        name
        description
        budget_amount
        deadline
        owner_id
        tags
        status
        priority
        is_subsidized
        created_at
        updated_at
        owner {
          id
          name
          email
        }
      }
    }
  }
`;

export const GET_PROJECT_BY_ID_QUERY = gql`
  query GetProjectById($id: String!) {
    project(id: $id) {
      id
      title
      description
      budget
      type
      is_private
      required_volunteers
      start_at
      end_at
      deadline
      language_preference
      department_id
      owner_id
      institution_id
      event_id
      created_at
      updated_at
      owner {
        id
        name
        email
      }
      department {
        id
        name
      }
      Institution {
        id
        name
      }
      activities {
        id
        name
        description
        budget_amount
        deadline
        owner_id
        tags
        status
        priority
        is_subsidized
        created_at
        updated_at
        owner {
          id
          name
          email
        }
      }
      subsidies {
        id
        description
        total_budget
        created_at
        updated_at
        institution_id
        subsidy_status {
          id
          name
          description
        }
        institution {
          id
          name
        }
      }
      special_projects {
        id
        justification_note
        budget
        type
        location_church_plant
        created_at
        updated_at
      }
    }
  }
`;

export const GET_PROJECT_KPIS_QUERY = gql`
  query GetProjectKPIs($institutionId: String) {
    projectKPIs(institutionId: $institutionId) {
      totalProjects
      activeProjects
      completedProjects
      upcomingProjects
      totalBudget
      totalSubsidyRequests
      totalSubsidyAmount
      projectsWithVolunteers
      averageBudgetPerProject
    }

    projectsByDepartment(institutionId: $institutionId) {
      department
      projects
      budget_used
      remaining_budget
      annual_budget
    }

    subsidyStatusDistribution(institutionId: $institutionId) {
      status
      count
      color
    }

    projectsTimeline(institutionId: $institutionId) {
      month
      created
      completed
      budget
    }
  }
`;
