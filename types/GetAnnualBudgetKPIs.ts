/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAnnualBudgetKPIs
// ====================================================

export interface GetAnnualBudgetKPIs_budgetKPIs {
  __typename: "BudgetKPIs";
  totalInstitutionBudget: number;
  totalAllocated: number;
  totalSpent: number;
  budgetRemaining: number;
  budgetUtilization: number;
  /**
   * Número de departments ativos (sempre 0 para budgets da instituição)
   */
  activeDepartments: number;
}

export interface GetAnnualBudgetKPIs_departmentSpending {
  __typename: "DepartmentSpending";
  name: string;
  planned: number;
  approved: number;
  reserved: number;
  spent: number;
  available: number;
  institution: string;
}

export interface GetAnnualBudgetKPIs_spendingOverTime_departments {
  __typename: "DepartmentMonthlySpending";
  departmentId: string;
  departmentName: string;
  amount: number;
}

export interface GetAnnualBudgetKPIs_spendingOverTime {
  __typename: "SpendingOverTime";
  date: string;
  month: string;
  departments: GetAnnualBudgetKPIs_spendingOverTime_departments[];
}

export interface GetAnnualBudgetKPIs_budgetDistribution {
  __typename: "BudgetDistribution";
  total: number;
  spent: number;
  allocated: number;
  available: number;
  percentageUsed: number;
}

export interface GetAnnualBudgetKPIs {
  budgetKPIs: GetAnnualBudgetKPIs_budgetKPIs;
  departmentSpending: GetAnnualBudgetKPIs_departmentSpending[];
  spendingOverTime: GetAnnualBudgetKPIs_spendingOverTime[];
  budgetDistribution: GetAnnualBudgetKPIs_budgetDistribution;
}

export interface GetAnnualBudgetKPIsVariables {
  year: number;
  institutionId: string;
}
