/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddAdjustmentTaskDto } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddAdjustmentTask
// ====================================================

export interface AddAdjustmentTask_addAdjustmentTask {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: any;
  updated_at: any;
}

export interface AddAdjustmentTask {
  addAdjustmentTask: AddAdjustmentTask_addAdjustmentTask;
}

export interface AddAdjustmentTaskVariables {
  data: AddAdjustmentTaskDto;
}
