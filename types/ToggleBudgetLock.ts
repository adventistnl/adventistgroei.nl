/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleBudgetLock
// ====================================================

export interface ToggleBudgetLock_toggleBudgetLock {
  __typename: "ToggleLockBudgetResponse";
  id: string;
  is_locked: boolean;
  updated_at: any;
}

export interface ToggleBudgetLock {
  toggleBudgetLock: ToggleBudgetLock_toggleBudgetLock;
}

export interface ToggleBudgetLockVariables {
  id: string;
}
