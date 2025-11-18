/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteAnnualBudget
// ====================================================

export interface DeleteAnnualBudget_deleteAnnualBudget {
  __typename: "DeleteBudgetResponse";
  success: boolean;
  message: string;
}

export interface DeleteAnnualBudget {
  deleteAnnualBudget: DeleteAnnualBudget_deleteAnnualBudget;
}

export interface DeleteAnnualBudgetVariables {
  id: string;
}
