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
      co_owner_id
      co_owner {
        id
        name
        email
      }
      collaborators {
        role
        activity_ids
        user {
          id
          name
          email
        }
      }
      church_id
      church {
        id
        name
      }
      department {
        id
        name
      }
      activities {
        id
        name
        status
        tags
        custom_tags
      }
      subsidies {
        id
      }
      special_projects {
        id
        type
      }
    }
  }
`;

export const GET_PROJECT_BY_ID_QUERY = gql`
  query GetProjectById($id: String!) {
    project(id: $id) {
      # === DADOS BASE ===
      id
      title
      description
      status
      type
      language_preference
      budget
      subsidized_budget
      balance
      is_private
      required_volunteers
      start_at
      end_at
      deadline
      created_at
      updated_at
      department_id
      church_department_id
      owner_id
      institution_id
      church_id
      event_id

      # === CHURCH DEPARTMENT ===
      church_department {
        id
        name
      }

      # === PROPRIETÁRIOS ===
      owner {
        id
        name
        email
      }
      co_owner_id
      co_owner {
        id
        name
        email
      }

      # === DEPARTAMENTO E LOCALIZAÇÃO ===
      department {
        id
        name
        description
        leader_id
        church {
          id
          name
        }
        annual_budgets {
          id
          year
          is_locked
          allocated_amount
          total_expenses
        }
      }
      Institution {
        id
        name
      }
      church {
        id
        name
        type
      }

      # === ATIVIDADES ===
      activities {
        id
        name
        description
        status
        priority
        budget_amount
        deadline
        tags
        custom_tags
        is_subsidized
        created_at
        updated_at
        assignees {
          id
          user_id
          user {
            id
            name
            email
          }
        }
        activity_funding {
          id
          entity_type
          entity_id
          entity_contribution_amount
          entity_contribution_percent
          validated
        }
        activity_documents {
          id
          filename
          file_url
          type
          is_validated
          validated_at
          uploaded_by
          created_at
        }
      }

      # === SUBSIDY REQUESTS ===
      subsidies {
        id
        description
        total_budget
        approved_amount
        rejection_reason
        priority
        request_type
        is_for_advance
        advance_amount
        refund_amount
        have_refund
        refund_done
        created_at
        updated_at
        approved_at
        subsidy_status {
          id
          name
          description
          order
        }
        requester {
          id
          name
          email
        }
        institution {
          id
          name
        }
        department {
          id
          name
        }
        church {
          id
          name
        }
        items {
          id
          requested_amount
          approved_amount
          notes
          project_activity {
            id
            name
            status
            budget_amount
            activity_documents {
              id
              filename
              is_validated
            }
          }
        }
        subsidy_receipts {
          id
          filename
          file_url
          type
          amount
          approved
          is_validated
          validated_at
        }
      }

      # === COLABORADORES ===
      collaborators {
        role
        activity_ids
        user {
          id
          name
          email
        }
      }

      # === KPIs ===
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

      # === PROJETOS ESPECIAIS ===
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

export const GET_MY_PROJECTS_QUERY = gql`
  query MyProjects {
    myProjects {
      id
      title
      status
      is_private
      start_at
      end_at
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

export const GET_PROJECT_ACTIVITIES = gql`
  query GetProjectActivities($filters: String) {
    projectActivities(filters: $filters) {
      id
      name
      budget_amount
      is_subsidized
      is_deleted
      project_id
      status
    }
  }
`;
