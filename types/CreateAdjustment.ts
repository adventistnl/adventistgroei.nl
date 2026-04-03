/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateAdjustmentDto, AdjustmentStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateAdjustment
// ====================================================

export interface CreateAdjustment_createAdjustment_project_history_user {
  __typename: "User";
  id: string;
  name: string;
}

export interface CreateAdjustment_createAdjustment_project_history {
  __typename: "ProjectHistory";
  id: string;
  project_id: string;
  comment: string | null;
  created_at: any;
  user: CreateAdjustment_createAdjustment_project_history_user;
}

export interface CreateAdjustment_createAdjustment_tasks {
  __typename: "AdjustmentTask";
  id: string;
  title: string;
  completed: boolean;
  position: number;
  created_at: any;
  updated_at: any;
}

export interface CreateAdjustment_createAdjustment {
  __typename: "ProjectAdjustment";
  id: string;
  status: AdjustmentStatus;
  created_at: any;
  updated_at: any;
  project_history: CreateAdjustment_createAdjustment_project_history;
  tasks: CreateAdjustment_createAdjustment_tasks[] | null;
}

export interface CreateAdjustment {
  createAdjustment: CreateAdjustment_createAdjustment;
}

export interface CreateAdjustmentVariables {
  data: CreateAdjustmentDto;
}
