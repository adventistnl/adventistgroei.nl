/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TriggerMonthlyClose
// ====================================================

export interface TriggerMonthlyClose_triggerMonthlyClose {
  __typename: "MonthlyCloseResult";
  autoAccepted: number;
  locked: number;
}

export interface TriggerMonthlyClose {
  triggerMonthlyClose: TriggerMonthlyClose_triggerMonthlyClose;
}

export interface TriggerMonthlyCloseVariables {
  month: string;
}
