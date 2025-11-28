import { gql } from "@apollo/client";

export const GET_BUDGET_DASHBOARD_DATA = gql`
  query GetBudgetDashboardData($year: Int!) {
    # Dados agregados por entidade (para gráficos)
    entityDistribution(year: $year) {
      name
      amount
      percentage
      count
    }

    # Dados individuais com cálculos (para tabelas)
    annualBudgets(
      where: {
        year: { equals: $year }
        is_deleted: { equals: false }
      }
      orderBy: { created_at: desc }
    ) {
      id
      year
      planned_budget
      total_expenses
      balance
      notes
      description
      justification
      approved_by
      status
      priority
      category
      entity_type
      institution_id
      church_id
      department_id
      requested_amount
      approved_amount
      requested_by
      reviewed_by
      submitted_date
      review_date
      approval_date
      documents
      is_locked
      has_budget_record
      created_at
      updated_at
      created_by
      updated_by

      # Campos calculados via resolved fields
      approvedAmount
      spentAmount
      usagePercentage
      remainingAmount

      institution {
        id
        name
      }
      church {
        id
        name
      }
      department {
        id
        name
      }
      approved_user {
        id
        name
        email
      }
    }
  }
`;

export const GET_ANNUAL_BUDGET_BY_ID = gql`
  query GetAnnualBudgetById($id: String!) {
    annualBudget(id: $id) {
      id
      year
      planned_budget
      total_expenses
      balance
      notes
      description
      justification
      approved_by
      status
      priority
      category
      entity_type
      institution_id
      church_id
      department_id
      requested_amount
      approved_amount
      requested_by
      reviewed_by
      submitted_date
      review_date
      approval_date
      documents
      is_locked
      has_budget_record
      created_at
      updated_at
      created_by
      updated_by
      institution {
        id
        name
      }
      church {
        id
        name
      }
      department {
        id
        name
      }
      approved_user {
        id
        name
        email
      }
    }
  }
`;

export const GET_AVAILABLE_YEARS = gql`
  query GetAvailableYears {
    annualBudgets(
      where: { is_deleted: { equals: false } }
      orderBy: { year: desc }
    ) {
      year
    }
  }
`;

export const GET_ANNUAL_BUDGET_KPIS = gql`
  query GetAnnualBudgetKPIs($year: Int!, $institutionId: String!) {
    budgetKPIs(year: $year, institutionId: $institutionId) {
      totalInstitutionBudget
      totalAllocated
      totalSpent
      budgetRemaining
      budgetUtilization
      activeDepartments
    }

    departmentSpending(year: $year, institutionId: $institutionId) {
      name
      planned
      approved
      reserved
      institution
    }

    spendingOverTime(year: $year, institutionId: $institutionId) {
      date
      month
      departments {
        departmentId
        departmentName
        amount
      }
    }

    budgetDistribution(year: $year, institutionId: $institutionId) {
      total
      allocated
      remaining
      percentageUsed
    }
  }
`;