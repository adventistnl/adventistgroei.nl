/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateAdjustmentStatusDto, AdjustmentStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateAdjustmentStatus
// ====================================================

export interface UpdateAdjustmentStatus_updateAdjustmentStatus_tasks {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: any;
  updated_at: any;
}

export interface UpdateAdjustmentStatus_updateAdjustmentStatus {
  __typename: "ProjectAdjustment";
  id: string;
  status: AdjustmentStatus;
  updated_at: any;
  tasks: UpdateAdjustmentStatus_updateAdjustmentStatus_tasks[] | null;
}

export interface UpdateAdjustmentStatus {
  updateAdjustmentStatus: UpdateAdjustmentStatus_updateAdjustmentStatus;
}

export interface UpdateAdjustmentStatusVariables {
  data: UpdateAdjustmentStatusDto;
}
