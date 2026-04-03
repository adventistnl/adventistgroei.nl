/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveAdjustmentTask
// ====================================================

export interface RemoveAdjustmentTask_removeAdjustmentTask {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
}

export interface RemoveAdjustmentTask {
  removeAdjustmentTask: RemoveAdjustmentTask_removeAdjustmentTask;
}

export interface RemoveAdjustmentTaskVariables {
  taskId: string;
}
