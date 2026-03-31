/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ActivityStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetProjectActivities
// ====================================================

export interface GetProjectActivities_projectActivities {
  __typename: "ProjectActivity";
  id: string;
  name: string;
  budget_amount: any;
  is_subsidized: boolean;
  is_deleted: boolean;
  project_id: string;
  status: ActivityStatus;
}

export interface GetProjectActivities {
  projectActivities: GetProjectActivities_projectActivities[];
}

export interface GetProjectActivitiesVariables {
  filters?: string | null;
}
