import { gql } from "@apollo/client";

export const GET_PROJECTS_QUERY = gql`
  query Projects($institutionId: String) {
    projects(institutionId: $institutionId) {
      id
      title
      description
      budget
      subsidized_budget
      type
      is_private
      required_volunteers
      start_at
      end_at
      deadline
      language_preference
      department_id
      church_department_id
      owner_id
      institution_id
      event_id
      status
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
        church {
          id
          name
        }
      }
      church_department {
        id
        name
        description
        church {
          id
          name
        }
      }
      Institution {
        id
        name
      }
      Church {
        id
        name
      }
      activities {
        id
        name
        description
        budget_amount
        deadline
        tags
        custom_tags
        status
        priority
        is_subsidized
        created_at
        updated_at
        assignees {
          id
          user {
            id
            name
            email
          }
        }
        activity_funding {
          id
          entity_contribution_amount
          entity_contribution_percent
          entity_type
          entity_id
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
      subsidized_budget
      type
      is_private
      required_volunteers
      start_at
      end_at
      deadline
      language_preference
      department_id
      church_department_id
      owner_id
      institution_id
      event_id
      status
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
        church {
          id
          name
        }
      }
      church_department {
        id
        name
        description
        church {
          id
          name
        }
      }
      Institution {
        id
        name
      }
      Church {
        id
        name
      }
      activities {
        id
        name
        description
        budget_amount
        deadline
        tags
        custom_tags
        status
        priority
        is_subsidized
        created_at
        updated_at
        assignees {
          id
          user {
            id
            name
            email
          }
        }
        activity_funding {
          id
          entity_contribution_amount
          entity_contribution_percent
          entity_type
          entity_id
        }
        activity_documents {
          id
          file_url
          filename
          type
          is_validated
          drive_file_id
        }
      }
      subsidies {
        id
        description
        total_budget
        approved_amount
        rejection_reason
        created_at
        updated_at
        approved_at
        created_by
        updated_by
        approved_by
        institution_id
        department_id
        church_id
        project_id
        is_for_advance
        advance_amount
        subsidy_status {
          id
          name
          description
        }
        institution {
          id
          name
        }
        department {
          id
          name
          church {
            id
            name
          }
        }
        church {
          id
          name
        }
        items {
          id
          subsidy_request_id
          project_activity_id
          requested_amount
          approved_amount
          notes
          created_at
          updated_at
          project_activity {
            id
            name
            description
            budget_amount
            status
            priority
            is_subsidized
          }
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
      kpis {
        totalActivities
        completedActivities
        inProgressActivities
        completionRate
        projectBudget
        allocatedBudget
        subsidizedBudget
        balance
        budgetUtilization
        subsidizedBudgetPercentage
        subsidizedActivities
        subsidyRate
        subsidyRequestsCount
        approvedSubsidyRequestsCount
        totalSubsidyAmount
        daysRemaining
        endDate
        projectStatus
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
      totalSubsidizedBudget
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
