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
  activeDepartments: number;
}

export interface GetAnnualBudgetKPIs_departmentSpending {
  __typename: "DepartmentSpending";
  name: string;
  planned: number;
  approved: number;
  reserved: number;
  institution: string;
}

export interface GetAnnualBudgetKPIs_spendingOverTime {
  __typename: "SpendingOverTime";
  date: string;
  month: string;
  finance: number;
  operations: number;
  hr: number;
  it: number;
  marketing: number;
}

export interface GetAnnualBudgetKPIs_budgetDistribution {
  __typename: "BudgetDistribution";
  total: number;
  allocated: number;
  remaining: number;
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
}
