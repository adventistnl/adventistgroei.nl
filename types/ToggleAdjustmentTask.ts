/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ToggleAdjustmentTaskDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ToggleAdjustmentTask
// ====================================================

export interface ToggleAdjustmentTask_toggleAdjustmentTask {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  updated_at: any;
}

export interface ToggleAdjustmentTask {
  toggleAdjustmentTask: ToggleAdjustmentTask_toggleAdjustmentTask;
}

export interface ToggleAdjustmentTaskVariables {
  data: ToggleAdjustmentTaskDto;
}
